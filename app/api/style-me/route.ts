import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { KIBBE } from "@/lib/data/kibbe";
import { SEASONS } from "@/lib/data/seasons";
import { ARCHETYPES } from "@/lib/data/archetypes";
import { BRANDS, DEFAULT_BRANDS } from "@/lib/data/brands";
import type {
  KibbeType, SeasonKey, ArchetypeCode,
  Platform, Category, StyleMeResult,
} from "@/lib/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

interface RequestBody {
  kibbeType:        KibbeType | null;
  colorSeason:      SeasonKey | null;
  archetypeWeights: Partial<Record<ArchetypeCode, number>>;
  platform:         Platform;
  category:         Category;
  vibe:             string;
  depopSize?:       string;
  depopListings?:   unknown[];   // live Depop results passed through
  inspoImageB64?:   string;      // base64 JPEG for Match Inspo
}

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const {
    kibbeType, colorSeason, archetypeWeights,
    platform, category, vibe,
    depopSize, depopListings, inspoImageB64,
  } = body;

  const k = kibbeType ? KIBBE[kibbeType] : null;
  const s = colorSeason ? SEASONS[colorSeason] : null;

  // Top 7 archetypes by weight
  const topArch = Object.entries(archetypeWeights)
    .filter(([, w]) => (w ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 7) as [ArchetypeCode, number][];

  const profileBrands =
    topArch.length > 0 ? (BRANDS[topArch[0][0]] ?? DEFAULT_BRANDS) : DEFAULT_BRANDS;

  const archCtx = topArch.length > 0
    ? `\nSTYLE ARCHETYPE PROFILE:\n${topArch
        .slice(0, 5)
        .map(([c, w]) => `- ${ARCHETYPES[c].name} (${((w ?? 0) * 100).toFixed(0)}%): ${ARCHETYPES[c].desc}`)
        .join("\n")}\nBrands: ${profileBrands.investment.slice(0, 3).join(", ")} (investment), ${profileBrands.niche.slice(0, 2).join(", ")} (niche)\nReconcile archetype aesthetic with Kibbe silhouette rules when selecting pieces.`
    : "";

  const isDepop = platform === "Depop";

  const systemPrompt = `You are an expert personal stylist for luxury rental and resale platforms. You proactively find specific real items — the client does NOT search, YOU curate.
${k ? `BODY TYPE: ${kibbeType} (${k.short}) — ${k.desc}\nSilhouettes: ${k.sil.map((x) => x.n).join(", ")}\nFabrics: ${k.fab.join(", ")}\nNecklines: ${k.neck.join(", ")}\nAvoid: ${k.avoid.join(", ")}\nJewellery: ${k.jewel}` : "No body type set."}
${s ? `COLOUR SEASON: ${s.label} (${s.sub}) — ${s.desc}\nBest metals: ${s.metals}\nAvoid: ${s.avoid}` : "No colour season set."}
${archCtx}
PLATFORM: ${platform === "all" ? "Rent the Runway, Nuuly, FashionPass" : platform}
${isDepop ? `DEPOP: Size ${depopSize ?? "S"} US letter, condition Good and above. Account for vintage sizing running small. Provide exact search query strings.` : ""}
${category !== "all" ? `CATEGORY: ${category}` : ""}
${vibe ? `OCCASION: ${vibe}` : ""}
${depopListings ? `\nLIVE DEPOP LISTINGS:\n${JSON.stringify(depopListings, null, 2)}\nPrioritise these live listings when available.` : ""}
Recommend 8 items. Explain why each works — body type, colour, AND archetype reasoning.
${isDepop
    ? `Return JSON array: [{"name":"item","brand":"brand","platform":"Depop","price":"price range","match":"why this works","search_query":"exact Depop search string","era":"decade if vintage"}]`
    : `Return JSON array: [{"name":"item","brand":"brand","platform":"RTR|Nuuly|FashionPass","price":"rental price","match":"why this works","url":"URL if known"}]`}
JSON only, no markdown fences.`;

  try {
    let messages: Anthropic.MessageParam[];

    if (inspoImageB64) {
      messages = [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/jpeg", data: inspoImageB64 },
            },
            {
              type: "text",
              text: "Find rental items matching this aesthetic, adapted for my body type and colouring. Return JSON only.",
            },
          ],
        },
      ];
    } else {
      messages = [
        {
          role: "user",
          content: `Find ${category !== "all" ? category : "pieces"}${vibe ? ` for ${vibe}` : ""} from ${platform === "all" ? "RTR, Nuuly, FashionPass" : platform}. JSON only.`,
        },
      ];
    }

    const response = await anthropic.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 3000,
      system:     systemPrompt,
      messages,
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    let results: StyleMeResult[];
    try {
      results = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      results = [
        { name: "Results", brand: "", platform: "", price: "", match: text.slice(0, 400) },
      ];
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("[style-me]", err);
    return NextResponse.json(
      [{ name: "Error", brand: "", platform: "", price: "", match: "Request failed. Please try again." }],
      { status: 500 },
    );
  }
}
