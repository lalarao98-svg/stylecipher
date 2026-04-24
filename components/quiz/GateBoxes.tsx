"use client";

interface GateBoxesProps {
  onKnow: () => void;
  onFind: () => void;
}

export default function GateBoxes({ onKnow, onFind }: GateBoxesProps) {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Know Your Type */}
      <button className="gate-box" onClick={onKnow} style={{ background: "#0E0B0A", borderRight: "1px solid rgba(200,184,152,0.08)" }}>
        <div>
          <div style={{ width: 32, height: 1, background: "#C8B898", marginBottom: 36 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 16 }}>
            Already know yours?
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.9 }}>
            Enter<br />Directly
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, marginBottom: 28, maxWidth: 280 }}>
            Know your Kibbe type, colour season, and archetypes already? Enter them and go straight to your wardrobe.
          </p>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C8B898", borderBottom: "1px solid rgba(200,184,152,0.3)", paddingBottom: 2 }}>
            Enter profile →
          </span>
        </div>
      </button>

      {/* Find Your Type */}
      <button className="gate-box" onClick={onFind} style={{ background: "#140F0D" }}>
        <div>
          <div style={{ width: 32, height: 1, background: "#3B0510", marginBottom: 36 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 16 }}>
            New to this?
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.9 }}>
            Decode<br />Your Style
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, marginBottom: 28, maxWidth: 280 }}>
            Three adaptive diagnostics — body architecture, colour season, style archetypes — that together form your complete style cipher.
          </p>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8962E", borderBottom: "1px solid rgba(184,150,46,0.3)", paddingBottom: 2 }}>
            Begin the analysis →
          </span>
        </div>
      </button>
    </div>
  );
}
