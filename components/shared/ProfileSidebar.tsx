"use client";
import { useStyleStore } from "@/store/useStyleStore";
import { KIBBE, SEASONS, ARCHETYPES } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";
import WeightBar from "./WeightBar";
import PaletteDisplay from "./PaletteDisplay";

export default function ProfileSidebar() {
  const { selK, selS, archWeights } = useStyleStore();

  const kibbeData = selK ? KIBBE[selK] : null;
  const seasonData = selS ? SEASONS[selS] : null;

  const top3: Array<{ code: ArchetypeCode; wt: number }> = Object.entries(archWeights)
    .map(([c, w]) => ({ code: c as ArchetypeCode, wt: w ?? 0 }))
    .sort((a, b) => b.wt - a.wt)
    .slice(0, 3);

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      borderLeft: "1px solid rgba(138,122,104,0.15)",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      background: "#F0ECE4",
    }}>
      {/* Header */}
      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(138,122,104,0.1)" }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 11,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "0.12em",
          color: "rgba(106,90,74,0.5)",
          textTransform: "uppercase",
        }}>
          Your Dossier
        </p>
      </div>

      {/* Kibbe */}
      <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid rgba(138,122,104,0.08)" }}>
        <p className="t-label" style={{ marginBottom: 8 }}>Body Architecture</p>
        {kibbeData ? (
          <>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 18,
              fontWeight: 700,
              fontStyle: "italic",
              color: "#221516",
              lineHeight: 1.1,
              marginBottom: 2,
            }}>
              {selK}
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, color: "#8A7A68", marginBottom: 12 }}>
              {kibbeData.short}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {kibbeData.sil.slice(0, 4).map((s) => (
                <p key={s.n} style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, color: "#6A5A4A", paddingLeft: 10, borderLeft: "1px solid rgba(184,150,46,0.4)", lineHeight: 1.3 }}>
                  {s.n}
                </p>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "rgba(138,122,104,0.5)" }}>
            Pending analysis
          </p>
        )}
      </div>

      {/* Season */}
      <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid rgba(138,122,104,0.08)" }}>
        <p className="t-label" style={{ marginBottom: 8 }}>Colour Season</p>
        {seasonData ? (
          <>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              fontWeight: 600,
              fontStyle: "italic",
              color: "#221516",
              marginBottom: 2,
            }}>
              {seasonData.label}
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, color: "#8A7A68", marginBottom: 12 }}>
              {seasonData.sub}
            </p>
            <PaletteDisplay pal={seasonData.pal} neut={seasonData.neut} />
          </>
        ) : (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "rgba(138,122,104,0.5)" }}>
            Pending analysis
          </p>
        )}
      </div>

      {/* Archetypes */}
      <div style={{ padding: "16px 18px 24px" }}>
        <p className="t-label" style={{ marginBottom: 12 }}>Top Archetypes</p>
        {top3.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {top3.map(({ code, wt }) => {
              const arch = ARCHETYPES[code];
              if (!arch) return null;
              return (
                <div key={code}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 28, height: 28, flexShrink: 0, background: `linear-gradient(135deg, ${arch.c}20, ${arch.c}50)`, border: `1px solid ${arch.c}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontStyle: "italic", color: arch.c, fontWeight: 700 }}>
                        {arch.family[0]}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#221516", lineHeight: 1.1 }}>
                        {arch.name}
                      </p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 300, color: "#8A7A68", letterSpacing: "0.08em" }}>
                        {arch.family}
                      </p>
                    </div>
                  </div>
                  <WeightBar value={wt} color={arch.c} />
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "rgba(138,122,104,0.5)" }}>
            Pending analysis
          </p>
        )}
      </div>
    </aside>
  );
}
