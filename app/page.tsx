"use client";
import { useState } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { KIBBE, SEASONS, ARCHETYPES } from "@/lib/data";
import type { KibbeType, SeasonKey } from "@/lib/types";
import GateBoxes from "@/components/quiz/GateBoxes";
import KibbeQuiz from "@/components/quiz/KibbeQuiz";
import SeasonQuiz from "@/components/quiz/SeasonQuiz";
import ArchetypeQuiz from "@/components/quiz/ArchetypeQuiz";
import Rule from "@/components/shared/Rule";

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
  const { selK, selS, archDone, quizTab, setSelK, setSelS, setQuizTab } = useStyleStore();
  const [gate, setGate] = useState<Gate>("choose");
  const [findStep, setFindStep] = useState<FindStep>("kibbe");

  const profileComplete = selK && selS && archDone;

  /* ── Status strip ── */
  function StatusStrip() {
    const steps: Array<{ id: FindStep; label: string; done: boolean; color: string }> = [
      { id: "kibbe",  label: "Kibbe Type",   done: !!selK,    color: "#3B0510" },
      { id: "season", label: "Colour Season", done: !!selS,    color: "#4A6B8A" },
      { id: "arch",   label: "Archetypes",    done: archDone,  color: "#6B1E2E" },
    ];
    return (
      <div style={{ display: "flex", borderBottom: "1px solid #C8B898", flexShrink: 0 }}>
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setFindStep(s.id)}
            style={{
              flex: 1,
              padding: "10px 20px",
              background: findStep === s.id ? "#F2EBE0" : "#FFFFFF",
              borderRight: i < 2 ? "1px solid #C8B898" : "none",
              borderTop: findStep === s.id ? `3px solid ${s.color}` : "3px solid transparent",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: s.done ? s.color : "#8A7A68" }}>
              {s.done ? "Complete" : "Pending"}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 600, color: "#221516", marginTop: 2 }}>
              {s.done && s.id === "kibbe" ? selK : s.done && s.id === "season" ? SEASONS[selS!].label : s.label}
            </p>
          </button>
        ))}
      </div>
    );
  }

  /* ── Gate: choose ── */
  if (gate === "choose") {
    return (
      <div style={{ flex: 1, overflow: "hidden" }}>
        <GateBoxes onKnow={() => setGate("know")} onFind={() => { setGate("find"); setFindStep("kibbe"); }} />
      </div>
    );
  }

  /* ── Know Your Type — manual selection ── */
  if (gate === "know") {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 56px", maxWidth: 800 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.95 }}>
            Know Your Type
          </h1>
          <button className="btn-text" onClick={() => setGate("choose")}>Back</button>
        </div>
        <Rule color="#3B0510" />

        <div style={{ marginTop: 36 }}>
          <p className="t-label" style={{ marginBottom: 12 }}>Kibbe Body Type</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 36 }}>
            {ALL_KIBBE.map((t) => (
              <button key={t} className={`chip${selK === t ? " on" : ""}`} onClick={() => setSelK(t)}>{t}</button>
            ))}
          </div>
        </div>

        <Rule color="#C8B898" thin />

        <div style={{ marginTop: 32 }}>
          <p className="t-label" style={{ marginBottom: 12 }}>Colour Season</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 36 }}>
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
    );
  }

  /* ── Find Your Type — quiz flow ── */
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <StatusStrip />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {findStep === "kibbe" && (
          <KibbeQuiz onDone={() => setFindStep("season")} />
        )}
        {findStep === "season" && (
          <SeasonQuiz onDone={() => setFindStep("arch")} />
        )}
        {findStep === "arch" && (
          <ArchetypeQuiz onDone={() => setFindStep("done")} />
        )}
        {findStep === "done" && (
          <div className="fade-up" style={{ padding: "48px 56px" }}>
            <Rule color="#3B0510" />
            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 48, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.95 }}>
                Profile<br />Complete
              </h2>
              <p className="t-body" style={{ marginTop: 20, maxWidth: 400 }}>
                Your style profile is ready. Head to Style Guide to explore your recommendations, or try Style Me for outfit inspiration.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <a href="/guide" className="btn-primary">View Style Guide</a>
                <a href="/style-me" className="btn-ghost">Style Me</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
