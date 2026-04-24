import { NextRequest, NextResponse } from "next/server";

/* ── Depop proxy — avoids CORS from the browser ── */
// Depop condition codes: 3=Good 4=Like New 5=New with tags

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q         = searchParams.get("q")         ?? "";
  const sizes     = searchParams.get("sizes")      ?? "";   // comma-separated
  const condition = searchParams.get("condition")  ?? "3";  // minimum condition
  const limit     = searchParams.get("limit")      ?? "50";

  if (!q) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    q,
    ...(sizes && { sizes }),
    condition_gte: condition,
    limit,
  });

  try {
    const res = await fetch(
      `https://api.depop.com/api/v2/search/products?${params.toString()}`,
      {
        headers: {
          "Accept":       "application/json",
          "User-Agent":   "StyleCipher/1.0",
        },
        next: { revalidate: 300 }, // cache 5 min
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Depop API error ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[depop proxy]", err);
    return NextResponse.json({ error: "Proxy request failed" }, { status: 502 });
  }
}
