"use client";

interface GateBoxesProps {
  onKnow: () => void;
  onFind: () => void;
}

export default function GateBoxes({ onKnow, onFind }: GateBoxesProps) {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Enter Directly */}
      <button className="gate-box" onClick={onKnow} style={{ background: "#F0ECE4", borderRight: "1px solid rgba(138,122,104,0.15)" }}>
        <div>
          <div style={{ width: 32, height: 1, background: "#C8B898", marginBottom: 36 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(138,122,104,0.6)", marginBottom: 16 }}>
            Already know yours?
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.9 }}>
            Enter<br />Directly
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "#8A7A68", lineHeight: 1.8, marginBottom: 28, maxWidth: 280 }}>
            Know your Kibbe type, colour season, and archetypes already? Enter them and go straight to your wardrobe.
          </p>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3B0510", borderBottom: "1px solid rgba(59,5,16,0.3)", paddingBottom: 2 }}>
            Enter profile →
          </span>
        </div>
      </button>

      {/* Decode Your Style */}
      <button className="gate-box" onClick={onFind} style={{ background: "#F9F7F3" }}>
        <div>
          <div style={{ width: 32, height: 1, background: "#3B0510", marginBottom: 36 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(138,122,104,0.6)", marginBottom: 16 }}>
            New to this?
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.9 }}>
            Decode<br />Your Style
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 300, color: "#8A7A68", lineHeight: 1.8, marginBottom: 28, maxWidth: 280 }}>
            Three adaptive diagnostics — body architecture, colour season, style archetypes — that together form your complete style cipher.
          </p>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8962E", borderBottom: "1px solid rgba(184,150,46,0.35)", paddingBottom: 2 }}>
            Begin the analysis →
          </span>
        </div>
      </button>
    </div>
  );
}
