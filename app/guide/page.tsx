"use client";
import { useStyleStore } from "@/store/useStyleStore";
import { KIBBE, SIL_IMG, SEASONS, ARCHETYPES, ARCHETYPE_IMG, BRANDS, DEFAULT_BRANDS, SFAM } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";
import Image from "next/image";
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

function SectionRule({ color }: { color: string }) {
  return <div style={{ width: "100%", height: 1, background: `rgba(200,184,152,0.1)` }} />;
}

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
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 20 }}>
            No Profile Yet
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.88, marginBottom: 24 }}>
            Build Your<br />Style Profile First
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, marginBottom: 32 }}>
            Complete the quizzes on Decode to unlock your personalised style dossier.
          </p>
          <a href="/" className="btn-primary">Begin Decode</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div style={{ background: "#140F0D", padding: "48px 56px 44px", borderBottom: "1px solid rgba(200,184,152,0.06)" }}>
          <div style={{ width: 48, height: 1, background: sfamColor, marginBottom: 32 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.4)", marginBottom: 16 }}>
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

          {/* Kibbe section */}
          {kibbeData && (
            <section style={{ paddingTop: 52, paddingBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
                <span className="sec-num">01</span>
                <div style={{ flex: 1 }}>
                  <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Body Architecture</p>
                  <div style={{ width: 48, height: 1, background: kibbeData.c }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", marginBottom: 6 }}>
                    {selK}
                  </h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontStyle: "italic", color: "#8A7A68", marginBottom: 20 }}>
                    {kibbeData.short}
                  </p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, marginBottom: 28 }}>
                    {kibbeData.desc}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Ideal Fabrics</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.fab.map((f) => <span key={f} className="chip">{f}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Necklines</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.neck.map((n) => <span key={n} className="chip">{n}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Avoid</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.avoid.map((a) => (
                          <span key={a} className="chip" style={{ borderColor: "rgba(155,42,42,0.3)", color: "rgba(155,100,100,0.8)" }}>{a}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Jewellery</p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.7 }}>{kibbeData.jewel}</p>
                    </div>
                  </div>
                </div>

                <div style={{ width: 220, flexShrink: 0 }}>
                  <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Silhouettes</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {kibbeData.sil.map((s) => (
                      <div key={s.n} style={{ position: "relative", height: 80, overflow: "hidden", border: "1px solid rgba(200,184,152,0.12)" }}>
                        <Image
                          src={SIL_IMG[s.n] ?? SIL_IMG.default}
                          alt={s.n}
                          fill
                          sizes="100px"
                          style={{ objectFit: "cover", filter: "saturate(0.5) brightness(0.7)" }}
                        />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(14,11,10,0.9))", padding: "4px 5px" }}>
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, fontWeight: 300, letterSpacing: "0.08em", color: "#C8B898" }}>
                            {s.n}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <SectionRule color="" />

          {/* Season section */}
          {seasonData && (
            <section style={{ paddingTop: 52, paddingBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
                <span className="sec-num">02</span>
                <div style={{ flex: 1 }}>
                  <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Colour Season</p>
                  <div style={{ width: 48, height: 1, background: sfamColor }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 48 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", marginBottom: 4 }}>
                    {seasonData.label}
                  </h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 17, color: "#8A7A68", marginBottom: 20 }}>
                    {seasonData.sub}
                  </p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, marginBottom: 20 }}>
                    {seasonData.desc}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8, color: "rgba(200,184,152,0.45)" }}>Best Metals</p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.7 }}>{seasonData.metals}</p>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8, color: "rgba(200,184,152,0.45)" }}>Avoid</p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.7 }}>{seasonData.avoid}</p>
                    </div>
                  </div>
                </div>
                <div style={{ width: 280, flexShrink: 0 }}>
                  <p className="t-label" style={{ marginBottom: 12, color: "rgba(200,184,152,0.45)" }}>Your Palette</p>
                  <PaletteDisplay pal={seasonData.pal} neut={seasonData.neut} />
                </div>
              </div>
            </section>
          )}

          <SectionRule color="" />

          {/* Archetypes section */}
          <section style={{ paddingTop: 52, paddingBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
              <span className="sec-num">03</span>
              <div style={{ flex: 1 }}>
                <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Style Archetypes</p>
                <div style={{ width: 48, height: 1, background: "#B8962E" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {top3.map((code, rank) => {
                const arch = ARCHETYPES[code];
                const wt = archWeights[code] ?? 0;
                return (
                  <div key={code} style={{ display: "flex", gap: 32 }}>
                    <div style={{ position: "relative", width: 180, height: 240, flexShrink: 0, overflow: "hidden", border: "1px solid rgba(200,184,152,0.15)" }}>
                      <Image
                        src={ARCHETYPE_IMG[code]}
                        alt={arch.name}
                        fill
                        sizes="180px"
                        style={{ objectFit: "cover", filter: "saturate(0.7) brightness(0.85)" }}
                      />
                      <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(14,11,10,0.82)", padding: "2px 8px" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", fontWeight: 300, color: "#C8B898" }}>
                          #{rank + 1}
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: arch.c, marginBottom: 8 }}>
                        {arch.family}
                      </p>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.9, marginBottom: 16 }}>
                        {arch.name}
                      </h3>
                      <WeightBar value={wt} color={arch.c} />
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, marginTop: 18 }}>
                        {arch.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <SectionRule color="" />

          {/* Brands section */}
          <section style={{ paddingTop: 52, paddingBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32 }}>
              <span className="sec-num">04</span>
              <div style={{ flex: 1 }}>
                <p className="t-label" style={{ marginBottom: 10, color: "rgba(200,184,152,0.45)" }}>Brand Directory</p>
                <div style={{ width: 48, height: 1, background: "#B8962E" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
              {TIERS.map((tier) => (
                <div key={tier}>
                  <p className="t-label" style={{ marginBottom: 14, color: "rgba(200,184,152,0.45)" }}>{TIER_LABELS[tier]}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(brands[tier] ?? []).map((brand) => (
                      <p key={brand} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 400, fontStyle: "italic", color: "#C8B898" }}>
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
