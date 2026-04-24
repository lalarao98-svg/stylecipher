"use client";
import { useState } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { SEASONS } from "@/lib/data";
import type { KibbeType, SeasonKey } from "@/lib/types";
import GateBoxes from "@/components/quiz/GateBoxes";
import KibbeQuiz from "@/components/quiz/KibbeQuiz";
import SeasonQuiz from "@/components/quiz/SeasonQuiz";
import ArchetypeQuiz from "@/components/quiz/ArchetypeQuiz";

type Gate = "choose" | "know" | "find";
type FindStep = "kibbe" | "season" | "arch" | "done";

const ALL_KIBBE: KibbeType[] = [
  "Dramatic","SoftDramatic","Classic","SoftClassic","DramaticClassic",
  "Natural","SoftNatural","FlamboyantNatural",
  "Romantic","TheatricalRomantic",
  "Gamine","SoftGamine","FlamboyantGamine",
];
const ALL_SEASONS = Object.keys(SEASONS) as SeasonKey[];

export default function FindMyTypePage() {
  const { selK, selS, archDone, setSelK, setSelS } = useStyleStore();
  const [gate, setGate] = useState<Gate>("choose");
  const [findStep, setFindStep] = useState<FindStep>("kibbe");

  function StatusStrip() {
    const steps: Array<{ id: FindStep; label: string; done: boolean; color: string }> = [
      { id: "kibbe",  label: "Body Architecture", done: !!selK,   color: "#3B0510" },
      { id: "season", label: "Colour Season",     done: !!selS,   color: "#4A6B8A" },
      { id: "arch",   label: "Archetypes",        done: archDone, color: "#B8962E" },
    ];
    return (
      <div style={{ display: "flex", borderBottom: "1px solid rgba(200,184,152,0.08)", flexShrink: 0, background: "#0E0B0A" }}>
        {steps.map((s, i) => {
          const isOn = findStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setFindStep(s.id)}
              style={{
                flex: 1,
                padding: "12px 24px",
                background: isOn ? "rgba(245,239,228,0.03)" : "transparent",
                borderRight: i < 2 ? "1px solid rgba(200,184,152,0.06)" : "none",
                borderTop: `2px solid ${isOn ? s.color : "transparent"}`,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", color: s.done ? s.color : "rgba(138,122,104,0.45)", marginBottom: 3 }}>
                {s.done ? "Complete" : "Pending"}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, fontWeight: 600, fontStyle: "italic", color: s.done ? "#C8B898" : "rgba(200,184,152,0.35)" }}>
                {s.id === "kibbe" && s.done ? selK : s.id === "season" && s.done && selS ? SEASONS[selS].label : s.label}
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  if (gate === "choose") {
    return (
      <div style={{ flex: 1, overflow: "hidden" }}>
        <GateBoxes onKnow={() => setGate("know")} onFind={() => { setGate("find"); setFindStep("kibbe"); }} />
      </div>
    );
  }

  if (gate === "know") {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "48px 56px" }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 14 }}>
                Direct Entry
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 48, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.88 }}>
                Enter Your<br />Profile
              </h1>
            </div>
            <button className="btn-text" onClick={() => setGate("choose")}>← Back</button>
          </div>
          <div style={{ width: 48, height: 1, background: "#C8B898", marginBottom: 44 }} />

          <div style={{ marginBottom: 40 }}>
            <p className="t-label" style={{ marginBottom: 14, color: "rgba(200,184,152,0.5)" }}>Kibbe Body Type</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ALL_KIBBE.map((t) => (
                <button key={t} className={`chip${selK === t ? " on" : ""}`} onClick={() => setSelK(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ width: "100%", height: 1, background: "rgba(200,184,152,0.08)", marginBottom: 40 }} />

          <div style={{ marginBottom: 44 }}>
            <p className="t-label" style={{ marginBottom: 14, color: "rgba(200,184,152,0.5)" }}>Colour Season</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ALL_SEASONS.map((s) => (
                <button key={s} className={`chip${selS === s ? " on" : ""}`} onClick={() => setSelS(s)}>
                  {SEASONS[s].label}
                </button>
              ))}
            </div>
          </div>

          {selK && selS && (
            <button className="btn-primary" onClick={() => setGate("choose")}>Save Profile</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <StatusStrip />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {findStep === "kibbe"  && <KibbeQuiz    onDone={() => setFindStep("season")} />}
        {findStep === "season" && <SeasonQuiz   onDone={() => setFindStep("arch")}   />}
        {findStep === "arch"   && <ArchetypeQuiz onDone={() => setFindStep("done")}  />}
        {findStep === "done"   && (
          <div className="fade-up" style={{ padding: "64px 64px" }}>
            <div style={{ width: 48, height: 1, background: "#3B0510", marginBottom: 40 }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,184,152,0.45)", marginBottom: 16 }}>
              Analysis Complete
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 60, fontWeight: 700, fontStyle: "italic", color: "#F5EFE4", lineHeight: 0.88, marginBottom: 28 }}>
              Dossier<br />Complete
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(138,122,104,0.7)", lineHeight: 1.8, maxWidth: 400, marginBottom: 40 }}>
              Your style cipher has been decoded. Explore your personalised dossier, or go straight to your wardrobe.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="/guide" className="btn-primary">View Dossier</a>
              <a href="/style-me" className="btn-ghost">Wardrobe</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
