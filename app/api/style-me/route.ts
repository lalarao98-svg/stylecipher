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

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const {
    kibbeType, colorSeason, archetypes,
    platform, category, vibes,
    depopSize, inspoImage, inspoMode,
  } = body;

  const k = kibbeType ? KIBBE[kibbeType] : null;
  const s = colorSeason ? SEASONS[colorSeason] : null;
  const vibeStr = vibes.join(", ");

  const kibbeBlock = k
    ? `KIBBE BODY TYPE: ${kibbeType} (${k.short})
${k.desc}
Correct silhouettes: ${k.sil.map((x) => x.n).join(", ")}
Best fabrics: ${k.fab.join(", ")}
Best necklines: ${k.neck.join(", ")}
AVOID: ${k.avoid.join(", ")}`
    : "No Kibbe type set — recommend universally flattering cuts.";

  const seasonBlock = s
    ? `COLOUR SEASON: ${s.label} (${s.sub})
${s.desc}
Best colours: ${s.pal.join(", ")}
Neutrals: ${s.neut.join(", ")}
Best metals: ${s.metals}
AVOID: ${s.avoid}`
    : "No colour season set — use versatile neutrals.";

  const archetypeBlock = archetypes.length > 0
    ? `STYLE ARCHETYPES (dominant first): ${archetypes.join(", ")}
All pieces should feel authentic to the ${archetypes[0]} aesthetic while respecting Kibbe silhouette rules.`
    : "No archetypes set — use classic, versatile styling.";

  const filters = [
    platform !== "all" && platform === "Depop"
      ? `FOCUS: Depop only. Size ${depopSize ?? "S"} US — search one size up for vintage.`
      : platform !== "all"
      ? `FOCUS: ${platform} only.`
      : "",
    category !== "all" ? `CATEGORY: ${category} only.` : "",
    vibeStr ? `OCCASION / VIBE: ${vibeStr}` : "",
  ].filter(Boolean).join("\n");

  const systemPrompt = `You are an expert personal stylist with access to real-time web search. Your job is to find actual purchasable products — from anywhere on the web — that perfectly match this client's profile. Search broadly: rental platforms (Rent the Runway, Nuuly, FashionPass, Depop), luxury retailers (Net-a-Porter, Matches, Ssense, Farfetch), brand sites (Sandro, Maje, Ba&sh, Isabel Marant, etc.), and boutique e-commerce. Prioritise pieces that are currently available and purchasable.

CLIENT PROFILE:
${kibbeBlock}

${seasonBlock}

${archetypeBlock}
${filters ? `\n${filters}` : ""}

SEARCH INSTRUCTIONS:
Search for specific real products. For each piece:
- Currently available on a real product page (not sold out if possible)
- Matches the client's Kibbe silhouette rules
- Works within their colour season palette or neutrals
- Aligns with their top archetype aesthetic
- Mix of accessible and investment price points
- Include rental options where available

Find 8 items. For each, retrieve:
1. Exact product name
2. Brand
3. Retailer/platform
4. Direct product page URL (specific product page — not category)
5. Price or rental price
6. Stylist note explaining why it works for their Kibbe type, colour season, and archetype — be specific

Return ONLY a valid JSON array, no markdown, no preamble:
[{"name":"exact product name","brand":"brand","platform":"retailer","price":"price","url":"https://exact-product-url","match":"specific stylist note","type":"rent or buy"}]`;

  const system: TextBlockParam[] = [
    { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
  ];

  let messages: Anthropic.MessageParam[];

  if (inspoMode && inspoImage) {
    const b64 = inspoImage.replace(/^data:image\/[a-z+]+;base64,/, "");
    messages = [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
          { type: "text", text: "Find purchasable products matching this aesthetic, perfectly adapted for my Kibbe type, colour season, and archetypes. Use web search to find real current listings. Return JSON only." },
        ],
      },
    ];
  } else {
    messages = [
      {
        role: "user",
        content: `Search for and find 8 real purchasable products${category !== "all" ? ` (${category.toLowerCase()})` : ""}${vibeStr ? ` for ${vibeStr}` : ""} that perfectly match my profile. Use web search to find actual current product pages with real URLs. Return JSON only.`,
      },
    ];
  }

  try {
    let response = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 2500,
      system,
      tools:      [WEB_SEARCH],
      messages,
    });

    let iterations = 0;
    while (response.stop_reason === "pause_turn" && iterations < 4) {
      iterations++;
      messages = [...messages, { role: "assistant", content: response.content }];
      response = await anthropic.messages.create({
        model:      "claude-sonnet-4-6",
        max_tokens: 2500,
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
