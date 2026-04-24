"use client";
import { useStyleStore } from "@/store/useStyleStore";
import { KIBBE, SIL_IMG, SEASONS, ARCHETYPES, ARCHETYPE_IMG, BRANDS, DEFAULT_BRANDS, SFAM } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";
import Image from "next/image";
import Rule from "@/components/shared/Rule";
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
  const top3 = codes
    .sort((a, b) => (archWeights[b] ?? 0) - (archWeights[a] ?? 0))
    .slice(0, 3);

  const primaryArch = top3[0];
  const brands = primaryArch
    ? (BRANDS[primaryArch] ?? DEFAULT_BRANDS)
    : DEFAULT_BRANDS;

  const sfamColor = seasonData ? (SFAM[seasonData.fam] ?? "#8A7A68") : "#8A7A68";

  if (!selK && !selS) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p className="t-label" style={{ marginBottom: 16 }}>No Profile Yet</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.95, marginBottom: 20 }}>
            Build Your<br />Style Profile First
          </h2>
          <p className="t-body" style={{ marginBottom: 24 }}>Complete the quizzes on Find My Type to unlock your personalised style guide.</p>
          <a href="/" className="btn-primary">Find My Type</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div style={{ background: "#221516", padding: "40px 56px 36px" }}>
          <Rule color={sfamColor} />
          <div style={{ marginTop: 28 }}>
            <p className="t-label" style={{ color: "#8A7A68", marginBottom: 12 }}>Your Style Guide</p>
            {selK && (
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 56, fontWeight: 700, fontStyle: "italic", color: "#F2EBE0", lineHeight: 0.9 }}>
                {selK}
              </h1>
            )}
            {selS && (
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, fontStyle: "italic", color: "#C8B898", marginTop: 8 }}>
                {seasonData?.label} — {seasonData?.sub}
              </p>
            )}
          </div>
        </div>

        <div style={{ padding: "0 56px" }}>

          {/* Kibbe section */}
          {kibbeData && (
            <section style={{ paddingTop: 48, paddingBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
                <span className="sec-num">01</span>
                <div style={{ flex: 1 }}>
                  <p className="t-label" style={{ marginBottom: 8 }}>Body Architecture</p>
                  <Rule color={kibbeData.c} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 600, color: "#221516", marginBottom: 8 }}>
                    {selK} — {kibbeData.short}
                  </h2>
                  <p className="t-body" style={{ marginBottom: 20 }}>{kibbeData.desc}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8 }}>Ideal Fabrics</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.fab.map((f) => <span key={f} className="chip">{f}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8 }}>Necklines</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.neck.map((n) => <span key={n} className="chip">{n}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8 }}>Avoid</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {kibbeData.avoid.map((a) => <span key={a} className="chip" style={{ borderColor: "#E8D0D0", color: "#9B6A6A" }}>{a}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 8 }}>Jewellery</p>
                      <p className="t-body">{kibbeData.jewel}</p>
                    </div>
                  </div>
                </div>

                {/* Silhouette grid */}
                <div style={{ width: 220, flexShrink: 0 }}>
                  <p className="t-label" style={{ marginBottom: 8 }}>Silhouettes</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {kibbeData.sil.map((s) => (
                      <div key={s.n} style={{ position: "relative", height: 72, overflow: "hidden", border: "1px solid #E8DDD0" }}>
                        <Image
                          src={SIL_IMG[s.n] ?? SIL_IMG.default}
                          alt={s.n}
                          fill
                          sizes="100px"
                          style={{ objectFit: "cover", filter: "saturate(0.75)" }}
                        />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(34,21,22,0.65)", padding: "3px 5px" }}>
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, fontWeight: 500, letterSpacing: "0.1em", color: "#F2EBE0", textTransform: "uppercase" }}>
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

          <div className="rule-thin" />

          {/* Season section */}
          {seasonData && (
            <section style={{ paddingTop: 48, paddingBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
                <span className="sec-num">02</span>
                <div style={{ flex: 1 }}>
                  <p className="t-label" style={{ marginBottom: 8 }}>Colour Season</p>
                  <Rule color={sfamColor} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 40 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 600, color: "#221516", marginBottom: 8 }}>
                    {seasonData.label}
                  </h2>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 16, color: "#6A5A4A", marginBottom: 16 }}>
                    {seasonData.sub}
                  </p>
                  <p className="t-body" style={{ marginBottom: 20 }}>{seasonData.desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <p className="t-label" style={{ marginBottom: 6 }}>Best Metals</p>
                      <p className="t-body">{seasonData.metals}</p>
                    </div>
                    <div>
                      <p className="t-label" style={{ marginBottom: 6 }}>Avoid</p>
                      <p className="t-body">{seasonData.avoid}</p>
                    </div>
                  </div>
                </div>
                <div style={{ width: 280, flexShrink: 0 }}>
                  <p className="t-label" style={{ marginBottom: 10 }}>Your Palette</p>
                  <PaletteDisplay pal={seasonData.pal} neut={seasonData.neut} />
                </div>
              </div>
            </section>
          )}

          <div className="rule-thin" />

          {/* Archetypes section */}
          <section style={{ paddingTop: 48, paddingBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
              <span className="sec-num">03</span>
              <div style={{ flex: 1 }}>
                <p className="t-label" style={{ marginBottom: 8 }}>Style Archetypes</p>
                <Rule color="#6B1E2E" />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {top3.map((code, rank) => {
                const arch = ARCHETYPES[code];
                const wt = archWeights[code] ?? 0;
                return (
                  <div key={code} style={{ display: "flex", gap: 24 }}>
                    <div style={{ position: "relative", width: 180, height: 220, flexShrink: 0, overflow: "hidden", border: "1px solid #C8B898" }}>
                      <Image
                        src={ARCHETYPE_IMG[code]}
                        alt={arch.name}
                        fill
                        sizes="180px"
                        style={{ objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(34,21,22,0.8)", padding: "2px 8px" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontStyle: "italic", fontWeight: 300, color: "#F2EBE0" }}>
                          #{rank + 1}
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: arch.c, marginBottom: 6 }}>
                        {arch.family}
                      </p>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.95, marginBottom: 12 }}>
                        {arch.name}
                      </h3>
                      <WeightBar value={wt} color={arch.c} />
                      <p className="t-body" style={{ marginTop: 16 }}>{arch.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="rule-thin" />

          {/* Brands section */}
          <section style={{ paddingTop: 48, paddingBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
              <span className="sec-num">04</span>
              <div style={{ flex: 1 }}>
                <p className="t-label" style={{ marginBottom: 8 }}>Brand Directory</p>
                <Rule color="#A87828" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {TIERS.map((tier) => (
                <div key={tier}>
                  <p className="t-label" style={{ marginBottom: 12 }}>{TIER_LABELS[tier]}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(brands[tier] ?? []).map((brand) => (
                      <p key={brand} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 400, color: "#221516" }}>
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
