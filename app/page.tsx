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
    const steps: Array<{ id: FindStep; label: string; done: boolean; color: string; num: string; value: string | null }> = [
      { id: "kibbe",  label: "Body Architecture", done: !!selK,   color: "#3B0510", num: "01", value: selK ?? null },
      { id: "season", label: "Colour Season",     done: !!selS,   color: "#4A6B8A", num: "02", value: selS ? SEASONS[selS].label : null },
      { id: "arch",   label: "Archetypes",        done: archDone, color: "#B8962E", num: "03", value: archDone ? "Decoded" : null },
    ];
    return (
      <div style={{ display: "flex", borderBottom: "1px solid rgba(138,122,104,0.18)", flexShrink: 0, background: "#F0ECE4" }}>
        {steps.map((s, i) => {
          const isOn = findStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setFindStep(s.id)}
              className={`step-tab${isOn ? " on" : ""}`}
              style={{ borderRight: i < 2 ? "1px solid rgba(138,122,104,0.12)" : "none", borderBottom: `2px solid ${isOn ? s.color : "transparent"}` }}
            >
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 44,
                fontWeight: 300,
                fontStyle: "italic",
                color: isOn ? s.color : "rgba(138,122,104,0.25)",
                lineHeight: 1,
                flexShrink: 0,
                transition: "color 0.2s",
              }}>
                {s.num}
              </span>
              <div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", color: s.done ? s.color : "rgba(138,122,104,0.5)", marginBottom: 5 }}>
                  {s.done ? "Complete" : "Pending"}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, fontStyle: "italic", color: "#221516", lineHeight: 1.1 }}>
                  {s.done && s.value ? s.value : s.label}
                </p>
              </div>
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
      <div style={{ flex: 1, overflowY: "auto", padding: "48px 56px 48px 80px", background: "#F9F7F3" }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(138,122,104,0.6)", marginBottom: 14 }}>
                Direct Entry
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 48, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.88 }}>
                Enter Your<br />Profile
              </h1>
            </div>
            <button className="btn-text" onClick={() => setGate("choose")}>← Back</button>
          </div>
          <div style={{ width: 48, height: 1, background: "#C8B898", marginBottom: 44 }} />

          <div style={{ marginBottom: 40 }}>
            <p className="t-label" style={{ marginBottom: 14 }}>Kibbe Body Type</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ALL_KIBBE.map((t) => (
                <button key={t} className={`chip${selK === t ? " on" : ""}`} onClick={() => setSelK(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ width: "100%", height: 1, background: "rgba(138,122,104,0.15)", marginBottom: 40 }} />

          <div style={{ marginBottom: 44 }}>
            <p className="t-label" style={{ marginBottom: 14 }}>Colour Season</p>
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F9F7F3" }}>
      <StatusStrip />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {findStep === "kibbe"  && <KibbeQuiz    onDone={() => setFindStep("season")} />}
        {findStep === "season" && <SeasonQuiz   onDone={() => setFindStep("arch")}   />}
        {findStep === "arch"   && <ArchetypeQuiz onDone={() => setFindStep("done")}  />}
        {findStep === "done"   && (
          <div className="fade-up" style={{ padding: "64px 64px" }}>
            <div style={{ width: 48, height: 1, background: "#3B0510", marginBottom: 40 }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(138,122,104,0.6)", marginBottom: 16 }}>
              Analysis Complete
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 60, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.88, marginBottom: 28 }}>
              Dossier<br />Complete
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 300, color: "#8A7A68", lineHeight: 1.8, maxWidth: 400, marginBottom: 40 }}>
              Your style cipher has been decoded. Explore your personalised dossier, or go straight to your wardrobe.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="/guide" className="btn-primary">View Dossier</a>
              <a href="/style-me" className="btn-ghost-dark">Wardrobe</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
