"use client";
import { useMemo, useState } from "react";
import type { ProjectedPlayer, VorPosition } from "@/lib/fantasy/types";
import { VOR_POSITIONS } from "@/lib/fantasy/types";
import { POS_COLOR, SANS, T, fmt } from "./theme";

const FW = 260;
const FH = 190;
const M = { top: 24, right: 12, bottom: 26, left: 34 };

interface Hover {
  pos: VorPosition;
  p: ProjectedPlayer;
  px: number;
  py: number;
}

/** Risk vs VOR, faceted into small multiples per position (one hue per facet). */
export default function RiskScatter({ players }: { players: ProjectedPlayer[] }) {
  const facets = useMemo(() => {
    const byPos = {} as Record<VorPosition, ProjectedPlayer[]>;
    for (const pos of VOR_POSITIONS) {
      // Draft-relevant only: deep negative VOR is waiver-wire noise that
      // would squash the interesting half of every facet.
      byPos[pos] = players
        .filter((p) => p.pos === pos && p.vor != null && p.risk != null && p.vor > -30)
        .sort((a, b) => b.vor! - a.vor!)
        .slice(0, 30);
    }
    return byPos;
  }, [players]);

  const all = VOR_POSITIONS.flatMap((pos) => facets[pos]);
  const [hover, setHover] = useState<Hover | null>(null);
  if (!all.length) return null;

  const riskMin = Math.min(...all.map((p) => p.risk!));
  const riskMax = Math.max(...all.map((p) => p.risk!));
  const vorMin = Math.min(0, ...all.map((p) => p.vor!));
  const vorMax = Math.max(...all.map((p) => p.vor!));

  const plotW = FW - M.left - M.right;
  const plotH = FH - M.top - M.bottom;
  const sx = (r: number) => M.left + ((r - riskMin) / (riskMax - riskMin || 1)) * plotW;
  const sy = (v: number) => M.top + (1 - (v - vorMin) / (vorMax - vorMin || 1)) * plotH;

  const vorStep = vorMax > 120 ? 60 : 30;
  const yTicks: number[] = [];
  for (let t = Math.ceil(vorMin / vorStep) * vorStep; t <= vorMax; t += vorStep) yTicks.push(t);
  const xTicks = [4, 5, 6, 7].filter((t) => t >= riskMin && t <= riskMax);

  function nearest(pos: VorPosition, e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best: Hover | null = null;
    let bestD = 18 * 18; // generous hit radius, larger than the mark
    for (const p of facets[pos]) {
      const px = sx(p.risk!);
      const py = sy(p.vor!);
      const d = (px - mx) ** 2 + (py - my) ** 2;
      if (d < bestD) {
        bestD = d;
        best = { pos, p, px, py };
      }
    }
    setHover(best);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(2, ${FW}px)`, gap: 12 }}>
      {VOR_POSITIONS.map((pos) => (
        <div key={pos} style={{ position: "relative" }}>
          <svg
            width={FW}
            height={FH}
            role="img"
            aria-label={`${pos}: risk versus value over replacement`}
            onMouseMove={(e) => nearest(pos, e)}
            onMouseLeave={() => setHover(null)}
          >
            <text x={M.left} y={14} fontFamily={SANS} fontSize={11} fontWeight={500} letterSpacing="0.1em" fill={T.textSecondary}>
              <tspan fill={POS_COLOR[pos]}>●</tspan>
              <tspan dx={6}>{pos}</tspan>
            </text>
            {yTicks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={FW - M.right} y1={sy(t)} y2={sy(t)} stroke={T.grid} strokeWidth={1} />
                <text x={M.left - 6} y={sy(t) + 3} textAnchor="end" fontFamily={SANS} fontSize={9} fill={T.textMuted} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {t}
                </text>
              </g>
            ))}
            {xTicks.map((t) => (
              <text key={t} x={sx(t)} y={FH - 8} textAnchor="middle" fontFamily={SANS} fontSize={9} fill={T.textMuted}>
                {t}
              </text>
            ))}
            {/* zero-VOR baseline: above it a player beats the waiver wire */}
            {vorMin < 0 && (
              <line x1={M.left} x2={FW - M.right} y1={sy(0)} y2={sy(0)} stroke={T.textMuted} strokeWidth={1} strokeOpacity={0.5} />
            )}
            {facets[pos].map((p) => {
              const on = hover?.p.id === p.id;
              return (
                <circle
                  key={p.id}
                  cx={sx(p.risk!)}
                  cy={sy(p.vor!)}
                  r={on ? 6 : 4.5}
                  fill={POS_COLOR[pos]}
                  stroke={T.surface}
                  strokeWidth={2}
                  opacity={hover && !on ? 0.5 : 1}
                />
              );
            })}
          </svg>
          {hover && hover.pos === pos && (
            <div
              style={{
                position: "absolute",
                left: Math.min(hover.px + 10, FW - 150),
                top: Math.max(hover.py - 40, 0),
                background: T.surfaceRaised,
                border: `1px solid ${T.border}`,
                borderRadius: 3,
                padding: "6px 8px",
                pointerEvents: "none",
                fontFamily: SANS,
                fontSize: 10.5,
                color: T.textSecondary,
                width: 145,
                zIndex: 10,
              }}
            >
              <div style={{ color: T.textPrimary, fontWeight: 500 }}>{hover.p.player}</div>
              <div style={{ fontVariantNumeric: "tabular-nums" }}>
                VOR {fmt(hover.p.vor)} · risk {fmt(hover.p.risk)}
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ gridColumn: "1 / -1", fontFamily: SANS, fontSize: 10, color: T.textMuted, letterSpacing: "0.04em" }}>
        x: risk (5 ≈ typical, higher = sources & drafters disagree) · y: value over replacement · top 30 draft-relevant per position
      </div>
    </div>
  );
}
