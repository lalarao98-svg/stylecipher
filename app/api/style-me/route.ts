import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { WebSearchTool20260209, TextBlockParam } from "@anthropic-ai/sdk/resources/messages/messages.js";
import { KIBBE } from "@/lib/data/kibbe";
import { SEASONS } from "@/lib/data/seasons";
import type { KibbeType, SeasonKey, Platform, Category, StyleMeResult } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

const WEB_SEARCH: WebSearchTool20260209 = {
  type: "web_search_20260209",
  name: "web_search",
};

interface RequestBody {
  kibbeType:   KibbeType | null;
  colorSeason: SeasonKey | null;
  archetypes:  string[];
  platform:    Platform;
  category:    Category;
  vibes:       string[];
  depopSize?:  string;
  inspoImage?: string;
  inspoMode?:  boolean;
}

function searchUrl(platform: string, name: string, brand: string): string {
  const q = encodeURIComponent(`${brand} ${name}`.trim());
  if (platform === "RTR" || platform === "Rent the Runway") return `https://www.renttherunway.com/search#/?keyword=${q}`;
  if (platform === "Nuuly") return `https://nuuly.com/search?q=${q}`;
  if (platform === "FashionPass") return `https://www.fashionpass.com/search?q=${q}`;
  return "";
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const {
    kibbeType, colorSeason, archetypes,
    platform, category, vibes,
    depopSize, inspoImage, inspoMode,
  } = body;

  const k = kibbeType ? KIBBE[kibbeType] : null;
  const s = colorSeason ? SEASONS[colorSeason] : null;
  const isDepop = platform === "Depop";
  const vibeStr = vibes.join(", ");

  const profileCtx = [
    k ? `BODY TYPE: ${kibbeType} (${k.short}) — ${k.desc}\nSilhouettes: ${k.sil.map((x) => x.n).join(", ")}\nFabrics: ${k.fab.join(", ")}\nNecklines: ${k.neck.join(", ")}\nAvoid: ${k.avoid.join(", ")}` : "",
    s ? `COLOUR SEASON: ${s.label} (${s.sub})\nBest colours: ${s.pal.slice(0, 5).join(", ")}\nAvoid: ${s.avoid}` : "",
    archetypes.length > 0 ? `STYLE ARCHETYPES: ${archetypes.join(", ")}` : "",
    category !== "all" ? `CATEGORY: ${category}` : "",
    vibeStr ? `VIBE: ${vibeStr}` : "",
  ].filter(Boolean).join("\n\n");

  const systemParts = isDepop ? [
    "You are an expert vintage stylist. Use web_search to find 8 REAL active Depop listings right now.",
    profileCtx,
    `Size: ${depopSize ?? "S"} US — search one size up for vintage.\nSearch with queries like: site:depop.com vintage [style] [item] size [size]`,
    `Return JSON only — no markdown:\n[{"name":"exact listing title","brand":"seller/brand","platform":"Depop","price":"listed price","match":"why it works","url":"https://www.depop.com/products/...","search_query":"query used","era":"decade"}]`,
  ] : [
    "You are an expert personal stylist. Recommend 8 specific items available on Rent the Runway, Nuuly, or FashionPass. Use your knowledge of their current inventory — real brands and styles they actually carry.",
    profileCtx,
    `Return JSON only — no markdown:\n[{"name":"item name","brand":"brand name","platform":"RTR|Nuuly|FashionPass","price":"rental price e.g. $30/4 days","match":"why it works for this profile"}]`,
  ];

  const system: TextBlockParam[] = [
    { type: "text", text: systemParts.filter(Boolean).join("\n\n"), cache_control: { type: "ephemeral" } },
  ];

  let messages: Anthropic.MessageParam[];

  if (inspoMode && inspoImage) {
    const b64 = inspoImage.replace(/^data:image\/[a-z+]+;base64,/, "");
    messages = [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
          { type: "text", text: isDepop ? "Find Depop listings matching this aesthetic for my profile. Use web_search. Return JSON only." : "Recommend rental pieces matching this aesthetic for my profile. Return JSON only." },
        ],
      },
    ];
  } else {
    messages = [
      {
        role: "user",
        content: isDepop
          ? `Search Depop for ${category !== "all" ? category.toLowerCase() : "clothing"}${vibeStr ? ` with ${vibeStr} aesthetic` : ""}${archetypes.length > 0 ? `, ${archetypes[0]} style` : ""}. Use web_search with site:depop.com to find 8 real active listings. Return JSON only.`
          : `Recommend 8 rental pieces${category !== "all" ? ` (${category.toLowerCase()})` : ""}${vibeStr ? ` for ${vibeStr}` : ""} from RTR, Nuuly, or FashionPass. Return JSON only.`,
      },
    ];
  }

  try {
    // Depop needs web search; rental platforms don't
    const useSearch = isDepop || (inspoMode && !!inspoImage);

    let response = await anthropic.messages.create({
      model:      useSearch ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system,
      tools:      useSearch ? [WEB_SEARCH] : [],
      messages,
    });

    let iterations = 0;
    while (response.stop_reason === "pause_turn" && iterations < 3) {
      iterations++;
      messages = [...messages, { role: "assistant", content: response.content }];
      response = await anthropic.messages.create({
        model:      "claude-sonnet-4-6",
        max_tokens: 2000,
        system,
        tools:      [WEB_SEARCH],
        messages,
      });
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    let results: StyleMeResult[];
    try {
      results = JSON.parse(text.replace(/```json\n?|```/g, "").trim());
    } catch {
      results = [{ name: "Results", brand: "", platform: "", price: "", match: text.slice(0, 400) }];
    }

    // Add search links for rental platforms that didn't return a url
    if (!isDepop) {
      results = results.map((r) => ({
        ...r,
        url: r.url || searchUrl(r.platform, r.name, r.brand),
      }));
    }

    return NextResponse.json(results);
  } catch (err: unknown) {
    console.error("[style-me]", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    const isAuth = errMsg.toLowerCase().includes("auth") || errMsg.includes("401") || errMsg.includes("api_key");
    const userMsg = isAuth
      ? "Invalid API key — set ANTHROPIC_API_KEY in Vercel environment variables"
      : `Request failed: ${errMsg.slice(0, 120)}`;
    return NextResponse.json(
      [{ name: "Error", brand: "", platform: "", price: "", match: userMsg }],
      { status: 500 },
    );
  }
}
