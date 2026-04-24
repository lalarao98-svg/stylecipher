interface WeightBarProps {
  value: number; // 0-1
  color?: string;
  label?: string;
  subLabel?: string;
}

export default function WeightBar({ value, color = "#B8962E", label, subLabel }: WeightBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)));
  return (
    <div style={{ width: "100%" }}>
      {(label || subLabel) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
          <div>
            {label && (
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, color: "#C8B898" }}>
                {label}
              </span>
            )}
            {subLabel && (
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 300, color: "rgba(138,122,104,0.6)", marginLeft: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {subLabel}
              </span>
            )}
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, fontStyle: "italic", fontWeight: 300, color: "rgba(138,122,104,0.6)" }}>
            {pct}%
          </span>
        </div>
      )}
      <div style={{ height: 1, background: "rgba(200,184,152,0.12)", width: "100%", position: "relative" }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${pct}%`,
          background: color,
          opacity: 0.75,
          transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>
    </div>
  );
}
