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
  kibbeType:      KibbeType | null;
  colorSeason:    SeasonKey | null;
  archetypes:     string[];        // top 3 archetype names from store
  platform:       Platform;
  category:       Category;
  vibes:          string[];
  depopSize?:     string;
  depopListings?: unknown[];       // pre-fetched Depop results from /api/depop
  inspoImage?:    string;          // base64 data URI
  inspoMode?:     boolean;
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const {
    kibbeType, colorSeason, archetypes,
    platform, category, vibes,
    depopSize, depopListings, inspoImage, inspoMode,
  } = body;

  const k = kibbeType ? KIBBE[kibbeType] : null;
  const s = colorSeason ? SEASONS[colorSeason] : null;
  const isDepop = platform === "Depop";
  const vibeStr = vibes.join(", ");

  const systemParts = [
    "You are an expert personal stylist for luxury rental and resale platforms. You proactively find specific real items — the client does NOT search, YOU curate. Use web_search to find current real listings.",
    k
      ? `BODY TYPE: ${kibbeType} (${k.short}) — ${k.desc}\nSilhouettes: ${k.sil.map((x) => x.n).join(", ")}\nFabrics: ${k.fab.join(", ")}\nNecklines: ${k.neck.join(", ")}\nAvoid: ${k.avoid.join(", ")}\nJewellery: ${k.jewel}`
      : "No body type set.",
    s
      ? `COLOUR SEASON: ${s.label} (${s.sub}) — ${s.desc}\nPalette: ${s.pal.join(", ")}\nBest metals: ${s.metals}\nAvoid: ${s.avoid}`
      : "No colour season set.",
    archetypes.length > 0
      ? `STYLE ARCHETYPES (top 3): ${archetypes.join(", ")}\nReconcile archetype aesthetic with Kibbe silhouette rules.`
      : "",
    `PLATFORM: ${platform === "all" ? "Rent the Runway (rtr.com), Nuuly (nuuly.com), FashionPass (fashionpass.com)" : platform}`,
    isDepop
      ? `DEPOP: Size ${depopSize ?? "S"} US letter. Condition Good or above. Vintage sizing typically runs 1–2 sizes small — account for this. Provide exact copyable Depop search queries.`
      : "",
    isDepop && depopListings && depopListings.length > 0
      ? `LIVE DEPOP LISTINGS (prioritise these when available):\n${JSON.stringify(depopListings.slice(0, 20), null, 2)}`
      : "",
    category !== "all" ? `CATEGORY: ${category}` : "",
    vibeStr ? `VIBE / OCCASION: ${vibeStr}` : "",
    "Recommend exactly 8 items. For each item explain why it works — body type, colour season, AND archetype reasoning combined.",
    isDepop
      ? `Return a JSON array ONLY — no markdown fences:\n[{"name":"item name","brand":"brand","platform":"Depop","price":"price range","match":"why this works for this client","search_query":"exact Depop search string","era":"decade if vintage, else omit"}]`
      : `Return a JSON array ONLY — no markdown fences:\n[{"name":"item name","brand":"brand","platform":"RTR|Nuuly|FashionPass","price":"rental price","match":"why this works for this client","url":"direct listing URL if found"}]`,
  ].filter(Boolean).join("\n\n");

  // System as cacheable array — stable instructions first
  const system: TextBlockParam[] = [
    {
      type: "text",
      text: systemParts,
      cache_control: { type: "ephemeral" },
    },
  ];

  let messages: Anthropic.MessageParam[];

  if (inspoMode && inspoImage) {
    // Strip data URI prefix to get raw base64
    const b64 = inspoImage.replace(/^data:image\/[a-z+]+;base64,/, "");
    messages = [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: b64 },
          },
          {
            type: "text",
            text: "Find rental or resale pieces that match this aesthetic, adapted for my exact body type, colour season, and archetypes. Use web_search to find real current listings. Return JSON only.",
          },
        ],
      },
    ];
  } else {
    messages = [
      {
        role: "user",
        content: `Find ${category !== "all" ? category.toLowerCase() : "pieces"}${vibeStr ? ` for ${vibeStr}` : ""} from ${isDepop ? "Depop" : "RTR, Nuuly, and FashionPass"}. Use web_search to find real current listings. Return JSON only.`,
      },
    ];
  }

  try {
    let response = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 3000,
      system,
      tools:      [WEB_SEARCH],
      messages,
    });

    // pause_turn means the server hit its tool-loop limit mid-turn; continue up to 5 times
    let iterations = 0;
    while (response.stop_reason === "pause_turn" && iterations < 5) {
      iterations++;
      messages = [...messages, { role: "assistant", content: response.content }];
      response = await anthropic.messages.create({
        model:      "claude-sonnet-4-6",
        max_tokens: 3000,
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
      results = [
        { name: "Results", brand: "", platform: "", price: "", match: text.slice(0, 400) },
      ];
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("[style-me]", err);
    return NextResponse.json(
      [{ name: "Error", brand: "", platform: "", price: "", match: "Request failed — please try again." }],
      { status: 500 },
    );
  }
}
