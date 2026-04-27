import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { TextBlockParam } from "@anthropic-ai/sdk/resources/messages/messages.js";
import { KIBBE } from "@/lib/data/kibbe";
import { SEASONS } from "@/lib/data/seasons";
import type { KibbeType, SeasonKey, Platform, Category, StyleMeResult } from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

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
  const isDepop = platform === "Depop";
  const vibeStr = vibes.join(", ");

  const systemParts = [
    isDepop
      ? "You are an expert personal stylist specialising in Depop vintage finds. Suggest 8 specific items a person could realistically find on Depop right now, with realistic search queries they should use."
      : "You are an expert personal stylist for luxury rental platforms. Recommend 8 specific real items currently available on Rent the Runway, Nuuly, or FashionPass. Use your knowledge of their current inventory.",
    k
      ? `BODY TYPE: ${kibbeType} (${k.short}) — ${k.desc}\nSilhouettes: ${k.sil.map((x) => x.n).join(", ")}\nFabrics: ${k.fab.join(", ")}\nNecklines: ${k.neck.join(", ")}\nAvoid: ${k.avoid.join(", ")}`
      : "",
    s
      ? `COLOUR SEASON: ${s.label} (${s.sub})\nBest colours: ${s.pal.slice(0, 4).join(", ")}\nAvoid: ${s.avoid}`
      : "",
    archetypes.length > 0
      ? `STYLE ARCHETYPES: ${archetypes.join(", ")}`
      : "",
    category !== "all" ? `CATEGORY: ${category}` : "",
    vibeStr ? `VIBE: ${vibeStr}` : "",
    isDepop
      ? `Size: ${depopSize ?? "S"} US (search one size up for vintage).\nReturn JSON only:\n[{"name":"item description","brand":"brand or seller","platform":"Depop","price":"~$XX","match":"why it works","search_query":"exact depop search string","era":"decade if vintage"}]`
      : `Return JSON only — no markdown:\n[{"name":"item name","brand":"brand","platform":"RTR|Nuuly|FashionPass","price":"rental price","match":"why it works for this body type, colour season, and aesthetic"}]`,
  ].filter(Boolean).join("\n\n");

  const system: TextBlockParam[] = [
    { type: "text", text: systemParts, cache_control: { type: "ephemeral" } },
  ];

  let messages: Anthropic.MessageParam[];

  if (inspoMode && inspoImage) {
    const b64 = inspoImage.replace(/^data:image\/[a-z+]+;base64,/, "");
    messages = [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
          { type: "text", text: "Recommend rental pieces matching this aesthetic, adapted for my body type, colour season, and archetypes. Return JSON only." },
        ],
      },
    ];
  } else {
    messages = [
      {
        role: "user",
        content: isDepop
          ? `Suggest 8 specific Depop finds: ${category !== "all" ? category.toLowerCase() : "clothing"}${vibeStr ? ` with ${vibeStr} aesthetic` : ""}${archetypes.length > 0 ? `, ${archetypes[0]} style` : ""}. Include a realistic search_query for each. Return JSON only.`
          : `Recommend 8 rental pieces${category !== "all" ? ` (${category.toLowerCase()})` : ""}${vibeStr ? ` for ${vibeStr}` : ""} from RTR, Nuuly, or FashionPass. Return JSON only.`,
      },
    ];
  }

  try {
    const response = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system,
      messages,
    });

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
