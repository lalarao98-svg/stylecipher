interface WeightBarProps {
  value: number; // 0-1
  color?: string;
  label?: string;
  subLabel?: string;
}

export default function WeightBar({ value, color = "#3B0510", label, subLabel }: WeightBarProps) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ width: "100%" }}>
      {(label || subLabel) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          {label && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#221516" }}>
              {label}
            </span>
          )}
          {subLabel && (
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, color: "#8A7A68", letterSpacing: "0.08em" }}>
              {subLabel}
            </span>
          )}
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, fontStyle: "italic", fontWeight: 300, color: "#4A6B8A", marginLeft: 8 }}>
            {pct}%
          </span>
        </div>
      )}
      <div style={{ height: 2, width: "100%", background: "#E8DDD0" }}>
        <div style={{ height: 2, width: `${pct}%`, background: color, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}
