"use client";
import Image from "next/image";
import { useStyleStore } from "@/store/useStyleStore";
import { KIBBE, SIL_IMG, SEASONS, ARCHETYPES, ARCHETYPE_IMG } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";
import WeightBar from "./WeightBar";
import PaletteDisplay from "./PaletteDisplay";
import Rule from "./Rule";

export default function ProfileSidebar() {
  const { selK, selS, archWeights } = useStyleStore();

  const kibbeData = selK ? KIBBE[selK] : null;
  const seasonData = selS ? SEASONS[selS] : null;

  const top3: Array<{ code: ArchetypeCode; wt: number }> = Object.entries(archWeights)
    .map(([c, w]) => ({ code: c as ArchetypeCode, wt: w ?? 0 }))
    .sort((a, b) => b.wt - a.wt)
    .slice(0, 3);

  return (
    <aside style={{ width: 210, flexShrink: 0, borderLeft: "1px solid #C8B898", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Kibbe section */}
      <div style={{ padding: "20px 16px 16px" }}>
        <p className="t-label" style={{ marginBottom: 10 }}>Body Type</p>
        {kibbeData ? (
          <>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 1.1, marginBottom: 4 }}>
              {selK}
            </p>
            <p className="t-body" style={{ marginBottom: 12 }}>{kibbeData.short}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {kibbeData.sil.slice(0, 4).map((s) => (
                <div key={s.n} style={{ position: "relative", height: 56, overflow: "hidden", border: "1px solid #E8DDD0" }}>
                  <Image
                    src={SIL_IMG[s.n] ?? SIL_IMG.default}
                    alt={s.n}
                    fill
                    sizes="90px"
                    style={{ objectFit: "cover", filter: "saturate(0.7)" }}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(34,21,22,0.6)", padding: "3px 4px" }}>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, fontWeight: 500, letterSpacing: "0.1em", color: "#F2EBE0", textTransform: "uppercase" }}>
                      {s.n}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="t-body" style={{ color: "#A89A88" }}>Complete the Kibbe quiz</p>
        )}
      </div>

      <Rule color="#E8DDD0" />

      {/* Season section */}
      <div style={{ padding: "16px 16px" }}>
        <p className="t-label" style={{ marginBottom: 10 }}>Colour Season</p>
        {seasonData ? (
          <>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#221516", marginBottom: 2 }}>
              {seasonData.label}
            </p>
            <p className="t-body" style={{ marginBottom: 10, fontSize: 11 }}>{seasonData.sub}</p>
            <PaletteDisplay pal={seasonData.pal} neut={seasonData.neut} />
          </>
        ) : (
          <p className="t-body" style={{ color: "#A89A88" }}>Complete the Season quiz</p>
        )}
      </div>

      <Rule color="#E8DDD0" />

      {/* Top archetypes */}
      <div style={{ padding: "16px 16px 20px" }}>
        <p className="t-label" style={{ marginBottom: 12 }}>Top Archetypes</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {top3.map(({ code, wt }) => {
            const arch = ARCHETYPES[code];
            if (!arch) return null;
            return (
              <div key={code}>
                <WeightBar
                  value={wt}
                  color={arch.c}
                  label={arch.name}
                  subLabel={arch.family}
                />
              </div>
            );
          })}
        </div>
        {top3.length === 0 && (
          <p className="t-body" style={{ color: "#A89A88" }}>Complete the Archetype quiz</p>
        )}
      </div>
    </aside>
  );
}
