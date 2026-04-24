"use client";
import { useState } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { AQ, ARCHETYPES, ARCHETYPE_IMG } from "@/lib/data";
import { updateArchWeights, pickNextRound, shouldStop } from "@/lib/algorithms/archetype";
import type { ArchetypeCode } from "@/lib/types";
import ArchCard from "@/components/shared/ArchCard";
import WeightBar from "@/components/shared/WeightBar";
import Rule from "@/components/shared/Rule";

type QuizMode = "quiz" | "grid";

export default function ArchetypeQuiz({ onDone }: { onDone: () => void }) {
  const {
    archWeights, archDone, archHistory,
    archStep, archUsed,
    setArchWeights, setArchDone, pushArchHistory,
    setArchStep, setArchUsed,
  } = useStyleStore();

  const [mode, setMode] = useState<QuizMode>("quiz");
  const [roundIdx, setRoundIdx] = useState<number | null>(() => pickNextRound(archWeights, archUsed));

  const codes = Object.keys(ARCHETYPES) as ArchetypeCode[];
  const top5 = [...codes].sort((a, b) => (archWeights[b] ?? 0) - (archWeights[a] ?? 0)).slice(0, 5);

  function handleAnswer(sig: Partial<Record<ArchetypeCode, number>>) {
    const next = updateArchWeights(archWeights, sig, 1.2);
    pushArchHistory(next);
    setArchWeights(next);
    const newUsed = [...archUsed, roundIdx!];
    setArchUsed(newUsed);
    setArchStep(archStep + 1);

    if (shouldStop([...archHistory, next])) {
      setArchDone(true);
      onDone();
      return;
    }
    setRoundIdx(pickNextRound(next, newUsed));
  }

  function handleManualSelect(code: ArchetypeCode) {
    const next = updateArchWeights(archWeights, { [code]: 1.5 }, 1.0);
    setArchWeights(next);
    pushArchHistory(next);
  }

  if (archDone || mode === "grid") {
    return (
      <div style={{ padding: "24px 32px", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p className="t-label">All Archetypes</p>
            {archDone && <p className="t-body" style={{ marginTop: 4 }}>Quiz complete. Click any card to boost its weight.</p>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!archDone && <button className="btn-text" onClick={() => setMode("quiz")}>Back to Quiz</button>}
            {archDone && <button className="btn-primary" onClick={onDone}>View Results</button>}
          </div>
        </div>

        <Rule color="#C8B898" />

        {archDone && (
          <div style={{ marginTop: 20, marginBottom: 24 }}>
            <p className="t-label" style={{ marginBottom: 12 }}>Your Top Archetypes</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {top5.map((code) => (
                <WeightBar
                  key={code}
                  value={archWeights[code] ?? 0}
                  color={ARCHETYPES[code]?.c}
                  label={ARCHETYPES[code]?.name}
                  subLabel={ARCHETYPES[code]?.family}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
          {codes.map((code) => {
            const arch = ARCHETYPES[code];
            return (
              <ArchCard
                key={code}
                code={code}
                name={arch.name}
                family={arch.family}
                imgUrl={ARCHETYPE_IMG[code]}
                accentColor={arch.c}
                showWeight={archWeights[code] ?? 0}
                onClick={() => handleManualSelect(code)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  const round = roundIdx !== null ? AQ[roundIdx] : null;

  return (
    <div style={{ padding: "32px 48px", maxWidth: 680 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p className="t-label">Archetype Discovery · Round {archStep + 1}</p>
        <button className="btn-text" onClick={() => setMode("grid")}>Browse All Archetypes</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {top5.slice(0, 3).map((code) => (
          <div key={code} style={{ flex: 1 }}>
            <WeightBar value={archWeights[code] ?? 0} color={ARCHETYPES[code]?.c} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8A7A68", marginTop: 3 }}>
              {ARCHETYPES[code]?.name}
            </p>
          </div>
        ))}
      </div>

      <Rule color="#C8B898" />

      {round ? (
        <>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, margin: "24px 0 28px" }}>
            <span className="sec-num">{String(archStep + 1).padStart(2, "0")}</span>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: "#221516", lineHeight: 1.25, paddingTop: 8 }}>
              {round.q}
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {round.opts.map((opt) => (
              <button key={opt.l} className="quiz-opt" onClick={() => handleAnswer(opt.sig)}>
                {opt.l}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 32 }}>
          <p className="t-body">No more rounds available.</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => { setArchDone(true); onDone(); }}>
            Finish
          </button>
        </div>
      )}
    </div>
  );
}
