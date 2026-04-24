"use client";
import { useState } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { SQ, SEASONS } from "@/lib/data";
import { calcSeason } from "@/lib/algorithms/season";
import type { SeasonKey } from "@/lib/types";
import Rule from "@/components/shared/Rule";
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
      const r = calcSeason(next as Parameters<typeof calcSeason>[0]);
      setShowResult(r);
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
      <div className="fade-up" style={{ padding: "32px 48px", maxWidth: 600 }}>
        <p className="t-label" style={{ marginBottom: 16 }}>Your Colour Season</p>
        <Rule color="#4A6B8A" />
        <div style={{ marginTop: 24, display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 42, fontWeight: 700, fontStyle: "italic", color: "#221516", lineHeight: 0.95 }}>
              {data.label}
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontStyle: "italic", color: "#6A5A4A", marginTop: 8 }}>{data.sub}</p>
            <p className="t-body" style={{ marginTop: 14 }}>{data.desc}</p>
            <p className="t-body" style={{ marginTop: 8 }}>Metals: {data.metals}</p>
          </div>
          <div style={{ width: 180, flexShrink: 0 }}>
            <PaletteDisplay pal={data.pal} neut={data.neut} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button className="btn-primary" onClick={() => confirmResult(showResult)}>Confirm Season</button>
          <button className="btn-ghost" onClick={() => { setShowResult(null); setSeasonStep(0); setSeasonScores({}); }}>Retake</button>
        </div>
        <div style={{ marginTop: 24 }}>
          <p className="t-label" style={{ marginBottom: 8 }}>Or choose manually</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_SEASONS.map((s) => (
              <button key={s} className={`chip${selS === s ? " on" : ""}`} onClick={() => confirmResult(s)}>
                {SEASONS[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 48px", maxWidth: 600 }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 24 }}>
        {SQ.map((_, i) => (
          <div key={i} className="prog-seg" style={{ background: i <= seasonStep ? "#4A6B8A" : "#E8DDD0" }} />
        ))}
      </div>

      <p className="t-label" style={{ marginBottom: 4 }}>Colour Analysis · {seasonStep + 1} of {SQ.length}</p>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
        <span className="sec-num">{String(seasonStep + 1).padStart(2, "0")}</span>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 600, color: "#221516", lineHeight: 1.2, paddingTop: 8 }}>
          {question.q}
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.opts.map((opt) => (
          <button key={opt.l} className="quiz-opt" style={{ borderLeftColor: "transparent" }} onClick={() => handleOpt(opt.sc)}>
            {opt.l}
          </button>
        ))}
      </div>

      {seasonStep > 0 && (
        <button className="btn-text" style={{ marginTop: 20 }} onClick={() => setSeasonStep(seasonStep - 1)}>
          Back
        </button>
      )}
    </div>
  );
}
