"use client";
import Rule from "@/components/shared/Rule";

interface GateBoxesProps {
  onKnow: () => void;
  onFind: () => void;
}

export default function GateBoxes({ onKnow, onFind }: GateBoxesProps) {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Know Your Type */}
      <button
        className="gate-box"
        onClick={onKnow}
        style={{ background: "#221516", borderRight: "1px solid #3B0510" }}
      >
        <div>
          <Rule color="#6B1E2E" />
          <div style={{ marginTop: 24 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8A7A68", marginBottom: 12 }}>
              Already know yours?
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, fontStyle: "italic", color: "#F2EBE0", lineHeight: 0.95 }}>
              Know Your<br />Type
            </h2>
          </div>
        </div>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 300, color: "#8A7A68", lineHeight: 1.7, marginBottom: 20 }}>
            Enter your Kibbe type, colour season, and style archetypes directly. Perfect if you&apos;ve done the analysis before.
          </p>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C8B898" }}>
            Enter Directly
          </span>
        </div>
      </button>

      {/* Find Your Type */}
      <button
        className="gate-box"
        onClick={onFind}
        style={{ background: "#F2EBE0" }}
      >
        <div>
          <Rule color="#3B0510" />
          <div style={{ marginTop: 24 }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8A7A68", marginBottom: 12 }}>
              New to this?
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.95 }}>
              Find Your<br />Type
            </h2>
          </div>
        </div>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 300, color: "#6A5A4A", lineHeight: 1.7, marginBottom: 20 }}>
            Answer three adaptive quizzes to discover your Kibbe body type, colour season, and personal style archetypes.
          </p>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#3B0510" }}>
            Take the Quizzes
          </span>
        </div>
      </button>
    </div>
  );
}
