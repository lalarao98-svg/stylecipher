import { NextRequest, NextResponse } from "next/server";

/* ── Depop proxy — avoids CORS from the browser ── */

interface DepopRequestBody {
  query: string;
  size?:  string;
  limit?: number;
}

export async function POST(req: NextRequest) {
  const body: DepopRequestBody = await req.json();
  const { query, size, limit = 50 } = body;

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const params = new URLSearchParams({ q: query, limit: String(limit) });
  if (size) params.set("sizes", size);
  // condition_type accepts multiple values; include all "good and above" conditions
  params.append("condition_type", "good");
  params.append("condition_type", "like_new");
  params.append("condition_type", "new_with_tags");

  try {
    const res = await fetch(
      `https://api.depop.com/api/v2/search/products?${params.toString()}`,
      {
        headers: {
          "Accept":     "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 300 }, // cache 5 min
      },
    );

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Depop returned ${res.status}. The endpoint may have changed. Details: ${msg.slice(0, 200)}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[depop proxy]", err);
    return NextResponse.json(
      { error: "Proxy request failed — Depop may be unreachable or the endpoint has moved." },
      { status: 502 },
    );
  }
}
