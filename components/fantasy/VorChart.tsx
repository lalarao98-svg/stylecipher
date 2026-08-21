"use client";
import { useMemo, useState } from "react";
import type { ProjectedPlayer } from "@/lib/fantasy/types";
import { POS_COLOR, SANS, T, fmt } from "./theme";

const ROW_H = 22;
const BAR_H = 14;
const LABEL_W = 148;
const VALUE_W = 46;
const PAD_TOP = 8;

/** Horizontal bar chart: top players by value over replacement, colored by position. */
export default function VorChart({ players, width = 560 }: { players: ProjectedPlayer[]; width?: number }) {
  const data = useMemo(
    () => players.filter((p) => p.vor != null).sort((a, b) => b.vor! - a.vor!).slice(0, 25),
    [players],
  );
  const [hover, setHover] = useState<number | null>(null);

  if (!data.length) return null;
  const maxVor = data[0].vor!;
  const plotW = width - LABEL_W - VALUE_W;
  const height = PAD_TOP + data.length * ROW_H + 24;
  const x = (v: number) => (v / maxVor) * plotW;

  // Clean gridline steps.
  const step = maxVor > 120 ? 50 : maxVor > 60 ? 25 : 10;
  const ticks: number[] = [];
  for (let t = 0; t <= maxVor; t += step) ticks.push(t);

  // Direct-label only the best player at each position; tooltips carry the rest.
  const firstOfPos = new Set<string>();
  const labeled = new Set<string>();
  for (const p of data) {
    if (!firstOfPos.has(p.pos)) {
      firstOfPos.add(p.pos);
      labeled.add(p.id);
    }
  }

  const seen = [...new Set(data.map((d) => d.pos))];

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height} role="img" aria-label="Top 25 players by value over replacement">
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={LABEL_W + x(t)}
              x2={LABEL_W + x(t)}
              y1={PAD_TOP}
              y2={PAD_TOP + data.length * ROW_H}
              stroke={T.grid}
              strokeWidth={1}
            />
            <text
              x={LABEL_W + x(t)}
              y={PAD_TOP + data.length * ROW_H + 14}
              textAnchor="middle"
              fill={T.textMuted}
              fontFamily={SANS}
              fontSize={10}
            >
              {t}
            </text>
          </g>
        ))}
        {data.map((p, i) => {
          const y = PAD_TOP + i * ROW_H;
          const w = Math.max(2, x(p.vor!));
          const r = Math.min(4, w / 2);
          const isHover = hover === i;
          return (
            <g key={p.id}>
              <text
                x={LABEL_W - 8}
                y={y + BAR_H / 2 + 7}
                textAnchor="end"
                fill={isHover ? T.textPrimary : T.textSecondary}
                fontFamily={SANS}
                fontSize={11}
                fontWeight={isHover ? 500 : 300}
              >
                {p.player}
              </text>
              {/* rounded data-end, square at the baseline */}
              <path
                d={`M ${LABEL_W} ${y + 4} H ${LABEL_W + w - r} Q ${LABEL_W + w} ${y + 4} ${LABEL_W + w} ${y + 4 + r} V ${y + 4 + BAR_H - r} Q ${LABEL_W + w} ${y + 4 + BAR_H} ${LABEL_W + w - r} ${y + 4 + BAR_H} H ${LABEL_W} Z`}
                fill={POS_COLOR[p.pos]}
                opacity={hover == null || isHover ? 1 : 0.45}
              />
              {(labeled.has(p.id) || isHover) && (
                <text
                  x={LABEL_W + w + 6}
                  y={y + BAR_H / 2 + 7}
                  fill={T.textPrimary}
                  fontFamily={SANS}
                  fontSize={10}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {fmt(p.vor)}
                </text>
              )}
              {/* full-row hover hit target, larger than the mark */}
              <rect
                x={0}
                y={y}
                width={width}
                height={ROW_H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}
      </svg>
      {/* Legend: identity is never color-alone */}
      <div style={{ display: "flex", gap: 16, paddingLeft: LABEL_W, marginTop: 2 }}>
        {seen.map((pos) => (
          <span key={pos} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: SANS, fontSize: 10, letterSpacing: "0.08em", color: T.textSecondary }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: POS_COLOR[pos] }} />
            {pos}
          </span>
        ))}
      </div>
      {hover != null && (
        <div
          style={{
            position: "absolute",
            left: Math.min(LABEL_W + x(Math.max(0, data[hover].vor!)) + 12, width - 190),
            top: PAD_TOP + hover * ROW_H - 8,
            background: T.surfaceRaised,
            border: `1px solid ${T.border}`,
            borderRadius: 3,
            padding: "8px 10px",
            pointerEvents: "none",
            fontFamily: SANS,
            fontSize: 11,
            color: T.textSecondary,
            width: 180,
            zIndex: 10,
          }}
        >
          <div style={{ color: T.textPrimary, fontWeight: 500, marginBottom: 2 }}>
            {data[hover].player} <span style={{ color: T.textMuted }}>{data[hover].pos} · {data[hover].team}</span>
          </div>
          <div style={{ fontVariantNumeric: "tabular-nums" }}>
            {fmt(data[hover].points)} pts ({fmt(data[hover].pointsLo, 0)}–{fmt(data[hover].pointsHi, 0)})<br />
            VOR {fmt(data[hover].vor)} · risk {fmt(data[hover].risk)}
          </div>
        </div>
      )}
    </div>
  );
}
