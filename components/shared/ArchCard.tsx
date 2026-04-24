"use client";

interface ArchCardProps {
  code: string;
  name: string;
  family: string;
  imgUrl?: string;
  accentColor: string;
  selected?: boolean;
  onClick?: () => void;
  showWeight?: number;
}

export default function ArchCard({ name, family, accentColor, selected, onClick, showWeight }: ArchCardProps) {
  const initial = family[0]?.toUpperCase() ?? "A";

  return (
    <div
      className={`arch-card${selected ? " on" : ""}`}
      onClick={onClick}
      style={{ userSelect: "none", display: "flex", flexDirection: "column" }}
    >
      {/* Color header block */}
      <div style={{
        height: 90,
        background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}40 100%)`,
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
        borderBottom: `1.5px solid ${accentColor}30`,
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: accentColor, opacity: selected ? 1 : 0.5 }} />
        <span style={{
          position: "absolute",
          bottom: -12,
          right: 4,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 72,
          fontWeight: 700,
          fontStyle: "italic",
          color: accentColor,
          opacity: 0.18,
          lineHeight: 1,
          pointerEvents: "none",
        }}>
          {initial}
        </span>
        {showWeight !== undefined && showWeight > 0 && (
          <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(14,11,10,0.72)", padding: "2px 6px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, fontStyle: "italic", color: "#C8B898" }}>
              {Math.round(showWeight * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{ padding: "8px 10px 10px", background: selected ? `${accentColor}0A` : "transparent" }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", color: accentColor, marginBottom: 2 }}>
          {family}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#221516", lineHeight: 1.2 }}>
          {name}
        </p>
      </div>
    </div>
  );
}
