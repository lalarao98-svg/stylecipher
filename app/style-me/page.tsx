"use client";
import { useState, useEffect } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import type { Platform, Category, StyleMeResult } from "@/lib/types";
import { ARCHETYPES } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";
import ProfileSidebar from "@/components/shared/ProfileSidebar";

const PLATFORMS: Platform[] = ["all", "RTR", "Nuuly", "FashionPass", "Depop"];
const CATEGORIES: Category[] = ["all", "Dresses", "Tops", "Bottoms", "Outerwear", "Sets"];

const FILTER_ROW: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 0",
  borderBottom: "1px solid rgba(138,122,104,0.1)",
};

const LABEL_W: React.CSSProperties = {
  width: 72,
  flexShrink: 0,
  fontFamily: "'Jost', sans-serif",
  fontSize: 10,
  fontWeight: 300,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#8A7A68",
};

export default function StyleMePage() {
  const {
    selK, selS, archWeights, depopSize,
    platform, category,
    styleMeResults, pushStyleMeResults,
    setPlatform, setCategory, setDepopSize,
  } = useStyleStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const codes = Object.keys(ARCHETYPES) as ArchetypeCode[];
  const sortedCodes = [...codes].sort((a, b) => (archWeights[b] ?? 0) - (archWeights[a] ?? 0));
  const top3Names = sortedCodes.slice(0, 3).map((c) => ARCHETYPES[c].name);
  const top3Families = sortedCodes.slice(0, 3).map((c) => ARCHETYPES[c].family);

  const latestResults = styleMeResults[0] ?? [];

  async function fetchResults(overridePlatform?: Platform, overrideCategory?: Category) {
    setLoading(true);
    setError(null);
    const activePlatform = overridePlatform ?? platform;
    const activeCategory = overrideCategory ?? category;
    try {
      let depopListings: unknown[] | undefined;
      if (activePlatform === "Depop") {
        const query = [...top3Names.slice(0, 2), activeCategory !== "all" ? activeCategory : ""]
          .filter(Boolean).join(" ").trim() || "vintage";
        const depopRes = await fetch("/api/depop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, size: depopSize || undefined, limit: 30 }),
        });
        if (depopRes.ok) {
          const depopData = await depopRes.json();
          depopListings = Array.isArray(depopData?.objects) ? depopData.objects : [];
        }
      }

      const res = await fetch("/api/style-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kibbeType: selK,
          colorSeason: selS,
          archetypes: top3Names,
          vibes: top3Families,
          platform: activePlatform,
          category: activeCategory,
          depopSize,
          depopListings,
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: StyleMeResult[] = await res.json();
      pushStyleMeResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Auto-fetch on mount if profile is set
  useEffect(() => {
    if (selK || selS) {
      fetchResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePlatform(p: Platform) {
    setPlatform(p);
    fetchResults(p, undefined);
  }

  function handleCategory(c: Category) {
    setCategory(c);
    fetchResults(undefined, c);
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#F9F7F3" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Filters */}
        <div style={{ borderBottom: "1px solid rgba(138,122,104,0.15)", padding: "0 32px", flexShrink: 0, background: "#F0ECE4" }}>
          <div style={FILTER_ROW}>
            <p style={LABEL_W}>Platform</p>
            {PLATFORMS.map((p) => (
              <button key={p} className={`plat-btn${platform === p ? " on" : ""}`} onClick={() => handlePlatform(p)}>
                {p === "all" ? "All" : p}
              </button>
            ))}
          </div>

          <div style={{ ...FILTER_ROW, borderBottom: platform === "Depop" ? "1px solid rgba(138,122,104,0.1)" : "none" }}>
            <p style={LABEL_W}>Category</p>
            {CATEGORIES.map((c) => (
              <button key={c} className={`plat-btn${category === c ? " on" : ""}`} onClick={() => handleCategory(c)}>
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>

          {platform === "Depop" && (
            <div style={{ ...FILTER_ROW, borderBottom: "none" }}>
              <p style={LABEL_W}>Size</p>
              <input
                className="meas-input"
                style={{ width: 120 }}
                placeholder="e.g. M or 10"
                value={depopSize}
                onChange={(e) => setDepopSize(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Action bar */}
        <div style={{ padding: "12px 32px", borderBottom: "1px solid rgba(138,122,104,0.12)", display: "flex", alignItems: "center", gap: 16, flexShrink: 0, background: "#F9F7F3" }}>
          <button className="btn-primary" onClick={() => fetchResults()} disabled={loading || (!selK && !selS)}>
            {loading ? (platform === "Depop" ? "Fetching listings…" : "Searching…") : "Refresh"}
          </button>
          {!selK && !selS && (
            <p className="t-body">
              Complete your profile on <a href="/" style={{ color: "#3B0510", textDecoration: "none", borderBottom: "1px solid rgba(59,5,16,0.3)" }}>Decode</a> first.
            </p>
          )}
          {error && <p className="t-body" style={{ color: "#9B2A2A" }}>{error}</p>}
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px" }}>
          {loading && latestResults.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <p className="t-label" style={{ marginBottom: 16 }}>
                {platform === "Depop" ? "Fetching listings…" : "Curating your wardrobe…"}
              </p>
              <p className="t-body" style={{ color: "#8A7A68" }}>Finding pieces that match your profile</p>
            </div>
          )}

          {!loading && latestResults.length === 0 && !selK && !selS && (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <p className="t-label" style={{ marginBottom: 20 }}>Profile required</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.88, marginBottom: 20 }}>
                Complete Decode First
              </h2>
              <p className="t-body" style={{ maxWidth: 360, margin: "0 auto 28px" }}>
                Your body type, colour season, and archetypes are needed to curate your wardrobe.
              </p>
              <a href="/" className="btn-primary">Go to Decode</a>
            </div>
          )}

          {latestResults.length > 0 && (
            <>
              <div style={{ width: 48, height: 1, background: "#3B0510", marginBottom: 24 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {latestResults.map((item, i) => (
                  <ResultCard key={i} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ProfileSidebar />
    </div>
  );
}

function ResultCard({ item }: { item: StyleMeResult }) {
  return (
    <div className="result-card" style={{ padding: "18px 18px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p className="t-label">{item.platform}</p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 700, fontStyle: "italic", color: "#4A6B8A" }}>
          {item.price}
        </p>
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#221516", lineHeight: 1.2 }}>
        {item.name}
      </p>
      <p className="t-body">{item.brand}</p>
      {item.era && <p className="t-body" style={{ color: "#A87828", fontStyle: "italic" }}>{item.era}</p>}
      <p className="t-body" style={{ marginTop: 4, fontStyle: "italic" }}>{item.match}</p>
      {item.search_query && (
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "#5A6012", wordBreak: "break-all", marginTop: 4 }}>
          &ldquo;{item.search_query}&rdquo;
        </p>
      )}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-text" style={{ marginTop: 8, alignSelf: "flex-start" }}>
          View Item
        </a>
      )}
    </div>
  );
}
