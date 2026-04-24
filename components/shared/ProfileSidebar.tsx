"use client";
import Image from "next/image";
import { useStyleStore } from "@/store/useStyleStore";
import { KIBBE, SIL_IMG, SEASONS, ARCHETYPES, ARCHETYPE_IMG } from "@/lib/data";
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
      borderLeft: "1px solid rgba(200,184,152,0.1)",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      background: "#0E0B0A",
    }}>
      {/* Header */}
      <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid rgba(200,184,152,0.08)" }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 11,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "0.12em",
          color: "rgba(200,184,152,0.4)",
          textTransform: "uppercase",
        }}>
          Your Dossier
        </p>
      </div>

      {/* Kibbe */}
      <div style={{ padding: "18px 18px 16px", borderBottom: "1px solid rgba(200,184,152,0.06)" }}>
        <p className="t-label" style={{ marginBottom: 10, color: "rgba(138,122,104,0.6)" }}>Body Architecture</p>
        {kibbeData ? (
          <>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 18,
              fontWeight: 700,
              fontStyle: "italic",
              color: "#F5EFE4",
              lineHeight: 1.1,
              marginBottom: 3,
            }}>
              {selK}
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, color: "#8A7A68", marginBottom: 12 }}>
              {kibbeData.short}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              {kibbeData.sil.slice(0, 4).map((s) => (
                <div key={s.n} style={{ position: "relative", height: 64, overflow: "hidden" }}>
                  <Image
                    src={SIL_IMG[s.n] ?? SIL_IMG.default}
                    alt={s.n}
                    fill
                    sizes="90px"
                    style={{ objectFit: "cover", filter: "saturate(0.5) brightness(0.7)" }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(transparent, rgba(14,11,10,0.85))",
                    padding: "3px 4px",
                  }}>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, fontWeight: 300, letterSpacing: "0.08em", color: "#C8B898" }}>
                      {s.n}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "rgba(138,122,104,0.4)" }}>
            Pending analysis
          </p>
        )}
      </div>

      {/* Season */}
      <div style={{ padding: "18px 18px 16px", borderBottom: "1px solid rgba(200,184,152,0.06)" }}>
        <p className="t-label" style={{ marginBottom: 10, color: "rgba(138,122,104,0.6)" }}>Colour Season</p>
        {seasonData ? (
          <>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              fontWeight: 600,
              fontStyle: "italic",
              color: "#F5EFE4",
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
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "rgba(138,122,104,0.4)" }}>
            Pending analysis
          </p>
        )}
      </div>

      {/* Archetypes */}
      <div style={{ padding: "18px 18px 24px" }}>
        <p className="t-label" style={{ marginBottom: 14, color: "rgba(138,122,104,0.6)" }}>Top Archetypes</p>
        {top3.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {top3.map(({ code, wt }) => {
              const arch = ARCHETYPES[code];
              if (!arch) return null;
              return (
                <div key={code}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ position: "relative", width: 28, height: 28, overflow: "hidden", flexShrink: 0 }}>
                      <Image
                        src={ARCHETYPE_IMG[code]}
                        alt={arch.name}
                        fill
                        sizes="28px"
                        style={{ objectFit: "cover", filter: "saturate(0.6) brightness(0.8)" }}
                      />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#C8B898", lineHeight: 1.1 }}>
                        {arch.name}
                      </p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 300, color: "rgba(138,122,104,0.7)", letterSpacing: "0.08em" }}>
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
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontStyle: "italic", color: "rgba(138,122,104,0.4)" }}>
            Pending analysis
          </p>
        )}
      </div>
    </aside>
  );
}
