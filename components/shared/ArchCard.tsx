"use client";
import { ARCHETYPE_PAL } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";

interface ArchCardProps {
  code: string;
  name: string;
  family: string;
  desc?: string;
  imgUrl?: string;
  accentColor: string;
  selected?: boolean;
  onClick?: () => void;
  showWeight?: number;
}

export default function ArchCard({ code, name, family, desc, accentColor, selected, onClick, showWeight }: ArchCardProps) {
  const pal = ARCHETYPE_PAL[code as ArchetypeCode] ?? [accentColor, accentColor, accentColor, accentColor];

  return (
    <div
      className={`arch-card${selected ? " on" : ""}`}
      onClick={onClick}
      style={{ userSelect: "none", display: "flex", flexDirection: "column" }}
    >
      {/* Palette strip — 4 equal colour bars */}
      <div style={{ display: "flex", height: 56, flexShrink: 0, position: "relative" }}>
        {pal.map((colour, i) => (
          <div key={i} style={{ flex: 1, background: colour }} />
        ))}
        {/* Thin accent top border */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accentColor }} />
        {/* Weight badge */}
        {showWeight !== undefined && showWeight > 0 && (
          <div style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(14,11,10,0.75)", padding: "1px 5px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 10, fontStyle: "italic", color: "#C8B898" }}>
              {Math.round(showWeight * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Text content */}
      <div style={{ padding: "8px 10px 10px", flex: 1 }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", color: accentColor, marginBottom: 2 }}>
          {family}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#221516", lineHeight: 1.2, marginBottom: desc ? 4 : 0 }}>
          {name}
        </p>
        {desc && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300, color: "#8A7A68", lineHeight: 1.5, letterSpacing: "0.02em" }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}
