"use client";
import { useStyleStore } from "@/store/useStyleStore";
import { KIBBE, SEASONS, ARCHETYPES, BRANDS, DEFAULT_BRANDS, SFAM } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";
import PaletteDisplay from "@/components/shared/PaletteDisplay";
import WeightBar from "@/components/shared/WeightBar";
import ProfileSidebar from "@/components/shared/ProfileSidebar";

const TIERS = ["investment", "mid", "accessible", "niche"] as const;
const TIER_LABELS: Record<string, string> = {
  investment: "Investment",
  mid: "Mid-Range",
  accessible: "Accessible",
  niche: "Niche & Indie",
};

export default function GuidePage() {
  const { selK, selS, archWeights } = useStyleStore();

  const kibbeData = selK ? KIBBE[selK] : null;
  const seasonData = selS ? SEASONS[selS] : null;

  const codes = Object.keys(ARCHETYPES) as ArchetypeCode[];
  const top3 = [...codes]
    .sort((a, b) => (archWeights[b] ?? 0) - (archWeights[a] ?? 0))
    .slice(0, 3);

  const primaryArch = top3[0];
  const brands = primaryArch ? (BRANDS[primaryArch] ?? DEFAULT_BRANDS) : DEFAULT_BRANDS;
  const sfamColor = seasonData ? (SFAM[seasonData.fam] ?? "#8A7A68") : "#4A6B8A";

  if (!selK && !selS) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F7F3" }}>
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <p className="t-label" style={{ marginBottom: 20 }}>No Profile Yet</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.88, marginBottom: 24 }}>
            Build Your<br />Style Profile First
          </h2>
          <p className="t-body" style={{ marginBottom: 32 }}>
            Complete the quizzes on Decode to unlock your personalised style dossier.
          </p>
          <a href="/" className="btn-primary">Begin Decode</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#F9F7F3" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div style={{ background: "#1A1210", padding: "48px 56px 44px", borderBottom: "1px solid rgba(138,122,104,0.12)" }}>
          <div style={{ width: 48, height: 1, background: sfamColor, marginBottom: 32 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 16 }}>
            Your Style Dossier
          </p>
          {selK && (
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 64, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.85, marginBottom: 10 }}>
              {selK}
            </h1>
          )}
          {selS && (
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, fontStyle: "italic", color: "#8A7A68" }}>
              {seasonData?.label} — {seasonData?.sub}
            </p>
          )}
        </div>

        <div style={{ padding: "0 56px" }}>

          {/* Kibbe */}
          {kibbeData && (
            <section style={{ paddingTop: 52, paddingBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
                <span className="sec-num">01</span>
                <div style={{ flex: 1 }}>
                  <p className="t-label" style={{ marginBottom: 10 }}>Body Architecture</p>
                  <div style={{ width: 48, height: 1, background: kibbeData.c }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 700, fontStyle: "italic", color: "#221516", marginBottom: 6 }}>
                    {selK}
                  </h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontStyle: "italic", color: "#8A7A68", marginBottom: 20 }}>
                    {kibbeData.short}
                  </p>
                  <p className="t-body" style={{ marginBottom: 28 }}>{kibbeData.desc}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10 }}>Ideal Fabrics</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.fab.map((f) => <span key={f} className="chip">{f}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10 }}>Necklines</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.neck.map((n) => <span key={n} className="chip">{n}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10 }}>Avoid</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.avoid.map((a) => (
                          <span key={a} className="chip" style={{ borderColor: "rgba(155,42,42,0.3)", color: "rgba(120,60,60,0.8)" }}>{a}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10 }}>Jewellery</p>
                      <p className="t-body">{kibbeData.jewel}</p>
                    </div>
                  </div>
                </div>

                <div style={{ width: 200, flexShrink: 0 }}>
                  <p className="t-label" style={{ marginBottom: 14 }}>Silhouettes</p>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {kibbeData.sil.map((s, i) => (
                      <div key={s.n} style={{ padding: "10px 0", borderBottom: i < kibbeData.sil.length - 1 ? "1px solid rgba(138,122,104,0.12)" : "none", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 3, height: 3, background: kibbeData.c, borderRadius: "50%", flexShrink: 0, opacity: 0.7 }} />
                        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 400, color: "#221516" }}>{s.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <div style={{ width: "100%", height: 1, background: "rgba(138,122,104,0.12)" }} />

          {/* Season */}
          {seasonData && (
            <section style={{ paddingTop: 52, paddingBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
                <span className="sec-num">02</span>
                <div style={{ flex: 1 }}>
                  <p className="t-label" style={{ marginBottom: 10 }}>Colour Season</p>
                  <div style={{ width: 48, height: 1, background: sfamColor }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 48 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 700, fontStyle: "italic", color: "#221516", marginBottom: 4 }}>
                    {seasonData.label}
                  </h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 17, color: "#8A7A68", marginBottom: 20 }}>
                    {seasonData.sub}
                  </p>
                  <p className="t-body" style={{ marginBottom: 20 }}>{seasonData.desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8 }}>Best Metals</p>
                      <p className="t-body">{seasonData.metals}</p>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8 }}>Avoid</p>
                      <p className="t-body">{seasonData.avoid}</p>
                    </div>
                  </div>
                </div>
                <div style={{ width: 280, flexShrink: 0 }}>
                  <p className="t-label" style={{ marginBottom: 12 }}>Your Palette</p>
                  <PaletteDisplay pal={seasonData.pal} neut={seasonData.neut} />
                </div>
              </div>
            </section>
          )}

          <div style={{ width: "100%", height: 1, background: "rgba(138,122,104,0.12)" }} />

          {/* Archetypes */}
          <section style={{ paddingTop: 52, paddingBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
              <span className="sec-num">03</span>
              <div style={{ flex: 1 }}>
                <p className="t-label" style={{ marginBottom: 10 }}>Style Archetypes</p>
                <div style={{ width: 48, height: 1, background: "#B8962E" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {top3.map((code, rank) => {
                const arch = ARCHETYPES[code];
                const wt = archWeights[code] ?? 0;
                return (
                  <div key={code} style={{ display: "flex", gap: 32 }}>
                    <div style={{ width: 180, height: 240, flexShrink: 0, overflow: "hidden", border: `1px solid ${arch.c}30`, background: `linear-gradient(160deg, ${arch.c}12 0%, ${arch.c}35 100%)`, position: "relative", display: "flex", alignItems: "flex-end", padding: "16px 14px" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: arch.c, opacity: 0.7 }} />
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 120, fontWeight: 700, fontStyle: "italic", color: arch.c, opacity: 0.15, lineHeight: 1, position: "absolute", bottom: -16, right: -4, pointerEvents: "none" }}>
                        {arch.family[0]}
                      </span>
                      <div style={{ background: "rgba(34,21,22,0.72)", padding: "3px 8px" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", fontWeight: 300, color: "#F5EFE4" }}>
                          #{rank + 1}
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: arch.c, marginBottom: 8 }}>
                        {arch.family}
                      </p>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.9, marginBottom: 16 }}>
                        {arch.name}
                      </h3>
                      <WeightBar value={wt} color={arch.c} />
                      <p className="t-body" style={{ marginTop: 18 }}>{arch.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div style={{ width: "100%", height: 1, background: "rgba(138,122,104,0.12)" }} />

          {/* Brands */}
          <section style={{ paddingTop: 52, paddingBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
              <span className="sec-num">04</span>
              <div style={{ flex: 1 }}>
                <p className="t-label" style={{ marginBottom: 10 }}>Brand Directory</p>
                <div style={{ width: 48, height: 1, background: "#B8962E" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
              {TIERS.map((tier) => (
                <div key={tier}>
                  <p className="t-label" style={{ marginBottom: 14 }}>{TIER_LABELS[tier]}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(brands[tier] ?? []).map((brand) => (
                      <p key={brand} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 400, fontStyle: "italic", color: "#3B0510" }}>
                        {brand}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <ProfileSidebar />
    </div>
  );
}
