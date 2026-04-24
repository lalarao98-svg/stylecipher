"use client";
import { useState } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { KQ } from "@/lib/data";
import { inferKibbe } from "@/lib/algorithms/kibbe";
import type { KibbeType, KibbeMeasurements } from "@/lib/types";
import { KIBBE } from "@/lib/data";

const ALL_TYPES: KibbeType[] = [
  "Dramatic", "SoftDramatic", "Classic", "SoftClassic", "DramaticClassic",
  "Natural", "SoftNatural", "FlamboyantNatural",
  "Romantic", "TheatricalRomantic",
  "Gamine", "SoftGamine", "FlamboyantGamine",
];

const ABBR_MAP: Record<string, KibbeType[]> = {
  D: ["Dramatic"], SD: ["SoftDramatic"], C: ["Classic"], SC: ["SoftClassic"], DC: ["DramaticClassic"],
  N: ["Natural"], SN: ["SoftNatural"], FN: ["FlamboyantNatural"],
  R: ["Romantic"], TR: ["TheatricalRomantic"],
  G: ["Gamine"], SG: ["SoftGamine"], FG: ["FlamboyantGamine"],
};

function tallyScores(scores: Record<string, number>): KibbeType {
  const totals: Record<string, number> = {};
  for (const [abbr, val] of Object.entries(scores)) {
    const types = ABBR_MAP[abbr] ?? [];
    for (const t of types) totals[t] = (totals[t] ?? 0) + val;
  }
  let best: KibbeType = "Classic";
  let max = -Infinity;
  for (const [t, v] of Object.entries(totals)) {
    if (v > max) { max = v; best = t as KibbeType; }
  }
  return best;
}

const EMPTY_MEAS: KibbeMeasurements = {
  height: "", bust: "", waist: "", hips: "", shoulders: "",
  shoulderShape: "", bodyFlesh: "", faceShape: "",
};

export default function KibbeQuiz({ onDone }: { onDone: () => void }) {
  const { kibbeStep, kibbeScores, kibbeMode, selK, setKibbeStep, setKibbeScores, setKibbeMode, setSelK } = useStyleStore();
  const [meas, setMeas] = useState<KibbeMeasurements>(EMPTY_MEAS);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<KibbeType | null>(null);

  const question = KQ[kibbeStep];

  function handleOpt(sc: Partial<Record<string, number>>) {
    const next = { ...kibbeScores };
    for (const [k, v] of Object.entries(sc)) {
      next[k] = (next[k] ?? 0) + (v ?? 0);
    }
    if (kibbeStep + 1 < KQ.length) {
      setKibbeScores(next);
      setKibbeStep(kibbeStep + 1);
    } else {
      setKibbeScores(next);
      setResult(tallyScores(next));
      setShowResult(true);
    }
  }

  function handleMeasSubmit() {
    const r = inferKibbe(meas);
    if (r) { setResult(r.type); setShowResult(true); }
  }

  function confirmResult(t: KibbeType) {
    setSelK(t);
    onDone();
  }

  if (showResult && result) {
    const data = KIBBE[result];
    return (
      <div className="fade-up" style={{ padding: "40px 56px", maxWidth: 640 }}>
        <p className="t-label" style={{ marginBottom: 16 }}>Your Body Architecture</p>
        <div style={{ width: 48, height: 1, background: data.c, marginBottom: 28 }} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
          <span className="sec-num">{String(1).padStart(2, "0")}</span>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 52, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.88, marginBottom: 8 }}>
              {result}
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: "italic", color: "#8A7A68" }}>{data.short}</p>
          </div>
        </div>
        <p className="t-body" style={{ maxWidth: 480, marginBottom: 32 }}>{data.desc}</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          <button className="btn-primary" onClick={() => confirmResult(result)}>Confirm Type</button>
          <button className="btn-ghost-dark" onClick={() => { setShowResult(false); setKibbeStep(0); setKibbeScores({}); }}>Retake</button>
        </div>
        <div style={{ width: "100%", height: 1, background: "rgba(138,122,104,0.15)", marginBottom: 24 }} />
        <p className="t-label" style={{ marginBottom: 10 }}>Or choose manually</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ALL_TYPES.map((t) => (
            <button key={t} className={`chip${selK === t ? " on" : ""}`} onClick={() => confirmResult(t)}>{t}</button>
          ))}
        </div>
      </div>
    );
  }

  if (kibbeMode === "measure") {
    return (
      <div style={{ padding: "40px 56px", maxWidth: 560 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <p className="t-label" style={{ marginBottom: 10 }}>Measurements Mode</p>
            <div style={{ width: 32, height: 1, background: "#4A6B8A" }} />
          </div>
          <button className="btn-text" onClick={() => setKibbeMode("quiz")}>Switch to Quiz</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {(["height","bust","waist","hips","shoulders"] as const).map((field) => (
            <div key={field}>
              <p className="t-label" style={{ marginBottom: 6 }}>{field} (inches)</p>
              <input
                className="meas-input"
                type="text"
                placeholder={`e.g. ${field === "height" ? "65" : "36"}`}
                value={meas[field]}
                onChange={(e) => setMeas({ ...meas, [field]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <p className="t-label" style={{ marginBottom: 8 }}>Shoulder Shape</p>
            <div style={{ display: "flex", gap: 6 }}>
              {(["narrow","moderate","wide","sloped"] as const).map((v) => (
                <button key={v} className={`chip${meas.shoulderShape === v ? " on" : ""}`} onClick={() => setMeas({ ...meas, shoulderShape: v })}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="t-label" style={{ marginBottom: 8 }}>Body Flesh</p>
            <div style={{ display: "flex", gap: 6 }}>
              {(["lean","moderate","soft","muscular"] as const).map((v) => (
                <button key={v} className={`chip${meas.bodyFlesh === v ? " on" : ""}`} onClick={() => setMeas({ ...meas, bodyFlesh: v })}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="t-label" style={{ marginBottom: 8 }}>Face Shape</p>
            <div style={{ display: "flex", gap: 6 }}>
              {(["angular","round","blunt","mixed"] as const).map((v) => (
                <button key={v} className={`chip${meas.faceShape === v ? " on" : ""}`} onClick={() => setMeas({ ...meas, faceShape: v })}>{v}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 8, alignSelf: "flex-start" }} onClick={handleMeasSubmit}>
            Infer Type
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 56px", maxWidth: 640 }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 28 }}>
        {KQ.map((_, i) => (
          <div key={i} className="prog-seg" style={{ background: i <= kibbeStep ? "#3B0510" : "rgba(138,122,104,0.15)" }} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p className="t-label">{question.cat}</p>
        <button className="btn-text" onClick={() => setKibbeMode("measure")}>Use Measurements</button>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 32 }}>
        <span className="sec-num">{String(kibbeStep + 1).padStart(2, "0")}</span>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: "#221516", lineHeight: 1.2, paddingTop: 8 }}>
          {question.q}
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.opts.map((opt) => (
          <button key={opt.l} className="quiz-opt" onClick={() => handleOpt(opt.sc)}>
            {opt.l}
          </button>
        ))}
      </div>

      {kibbeStep > 0 && (
        <button className="btn-text" style={{ marginTop: 24 }} onClick={() => setKibbeStep(kibbeStep - 1)}>
          Back
        </button>
      )}
    </div>
  );
}
