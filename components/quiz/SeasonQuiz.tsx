"use client";
import { useState } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { SQ, SEASONS } from "@/lib/data";
import { calcSeason } from "@/lib/algorithms/season";
import type { SeasonKey } from "@/lib/types";
import PaletteDisplay from "@/components/shared/PaletteDisplay";

export default function SeasonQuiz({ onDone }: { onDone: () => void }) {
  const { seasonStep, seasonScores, selS, setSeasonStep, setSeasonScores, setSelS } = useStyleStore();
  const [showResult, setShowResult] = useState<SeasonKey | null>(null);

  const question = SQ[seasonStep];

  function handleOpt(sc: Partial<Record<string, number>>) {
    const next = { ...seasonScores };
    for (const [k, v] of Object.entries(sc)) {
      next[k] = (next[k] ?? 0) + (v ?? 0);
    }
    if (seasonStep + 1 < SQ.length) {
      setSeasonScores(next);
      setSeasonStep(seasonStep + 1);
    } else {
      setSeasonScores(next);
      setShowResult(calcSeason(next as Parameters<typeof calcSeason>[0]));
    }
  }

  function confirmResult(s: SeasonKey) {
    setSelS(s);
    onDone();
  }

  const ALL_SEASONS = Object.keys(SEASONS) as SeasonKey[];

  if (showResult) {
    const data = SEASONS[showResult];
    return (
      <div className="fade-up" style={{ padding: "40px 56px", maxWidth: 640 }}>
        <p className="t-label" style={{ marginBottom: 16 }}>Your Colour Season</p>
        <div style={{ width: 48, height: 1, background: "#4A6B8A", marginBottom: 28 }} />
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start", marginBottom: 32 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 52, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.88, marginBottom: 8 }}>
              {data.label}
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontStyle: "italic", color: "#8A7A68", marginBottom: 20 }}>{data.sub}</p>
            <p className="t-body" style={{ marginBottom: 10 }}>{data.desc}</p>
            <p className="t-body">Metals: {data.metals}</p>
          </div>
          <div style={{ width: 180, flexShrink: 0 }}>
            <PaletteDisplay pal={data.pal} neut={data.neut} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          <button className="btn-primary" onClick={() => confirmResult(showResult)}>Confirm Season</button>
          <button className="btn-ghost-dark" onClick={() => { setShowResult(null); setSeasonStep(0); setSeasonScores({}); }}>Retake</button>
        </div>
        <div style={{ width: "100%", height: 1, background: "rgba(138,122,104,0.15)", marginBottom: 24 }} />
        <p className="t-label" style={{ marginBottom: 10 }}>Or choose manually</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ALL_SEASONS.map((s) => (
            <button key={s} className={`chip${selS === s ? " on" : ""}`} onClick={() => confirmResult(s)}>
              {SEASONS[s].label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 56px", maxWidth: 640 }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 28 }}>
        {SQ.map((_, i) => (
          <div key={i} className="prog-seg" style={{ background: i <= seasonStep ? "#4A6B8A" : "rgba(138,122,104,0.15)" }} />
        ))}
      </div>

      <p className="t-label" style={{ marginBottom: 8 }}>
        Colour Analysis · {seasonStep + 1} of {SQ.length}
      </p>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 32 }}>
        <span className="sec-num">{String(seasonStep + 1).padStart(2, "0")}</span>
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

      {seasonStep > 0 && (
        <button className="btn-text" style={{ marginTop: 24 }} onClick={() => setSeasonStep(seasonStep - 1)}>
          Back
        </button>
      )}
    </div>
  );
}
