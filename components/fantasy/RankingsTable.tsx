"use client";
import { useMemo, useState } from "react";
import type { Position, ProjectedPlayer } from "@/lib/fantasy/types";
import { useFantasyStore } from "@/store/useFantasyStore";
import { POS_COLOR, POS_ORDER, SANS, T, fmt } from "./theme";

type SortKey = "overallRank" | "points" | "vor" | "risk" | "pick" | "inflatedCost";

const COLS: { key: SortKey | "player" | "range"; label: string; sortable: boolean }[] = [
  { key: "overallRank", label: "Rank", sortable: true },
  { key: "player", label: "Player", sortable: false },
  { key: "points", label: "Points", sortable: true },
  { key: "range", label: "Floor–Ceiling", sortable: false },
  { key: "vor", label: "VOR", sortable: true },
  { key: "risk", label: "Risk", sortable: true },
  { key: "pick", label: "ADP", sortable: true },
  { key: "inflatedCost", label: "$", sortable: true },
];

const FILTERS: (Position | "ALL")[] = ["ALL", ...POS_ORDER];

export default function RankingsTable({ players }: { players: ProjectedPlayer[] }) {
  const { posFilter, setPosFilter } = useFantasyStore();
  const [sortKey, setSortKey] = useState<SortKey>("vor");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(75);

  const rows = useMemo(() => {
    let out = players.filter((p) => p.points > 0);
    if (posFilter !== "ALL") out = out.filter((p) => p.pos === posFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((p) => p.player.toLowerCase().includes(q) || p.team.toLowerCase().includes(q));
    }
    out = [...out].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1; // nulls last regardless of direction
      if (bv == null) return -1;
      return (av - bv) * sortDir;
    });
    return out;
  }, [players, posFilter, query, sortKey, sortDir]);

  const shown = rows.slice(0, limit);

  function clickSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(key === "overallRank" || key === "pick" || key === "inflatedCost" ? 1 : -1);
    }
  }

  const cellStyle: React.CSSProperties = {
    padding: "7px 12px",
    fontFamily: SANS,
    fontSize: 12,
    fontWeight: 300,
    color: T.textSecondary,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        {FILTERS.map((f) => {
          const on = posFilter === f;
          return (
            <button
              key={f}
              onClick={() => setPosFilter(f)}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: "0.1em",
                padding: "4px 12px",
                borderRadius: 2,
                cursor: "pointer",
                border: `1px solid ${on ? T.accent : T.border}`,
                background: on ? "rgba(184,150,46,0.12)" : "transparent",
                color: on ? T.textPrimary : T.textMuted,
              }}
            >
              {f}
            </button>
          );
        })}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search player or team…"
          style={{
            marginLeft: "auto",
            fontFamily: SANS,
            fontSize: 12,
            padding: "5px 10px",
            background: T.surfaceRaised,
            border: `1px solid ${T.border}`,
            borderRadius: 2,
            color: T.textPrimary,
            outline: "none",
            width: 200,
          }}
        />
      </div>
      <div style={{ overflowX: "auto", border: `1px solid ${T.border}`, borderRadius: 3, background: T.surface }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  onClick={c.sortable ? () => clickSort(c.key as SortKey) : undefined}
                  style={{
                    ...cellStyle,
                    color: sortKey === c.key ? T.textPrimary : T.textMuted,
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: 10,
                    textAlign: c.key === "player" ? "left" : "right",
                    cursor: c.sortable ? "pointer" : "default",
                    position: "sticky",
                    top: 0,
                    background: T.surfaceRaised,
                    userSelect: "none",
                  }}
                >
                  {c.label}
                  {sortKey === c.key ? (sortDir === -1 ? " ↓" : " ↑") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td style={{ ...cellStyle, textAlign: "right", color: T.textMuted }}>{p.overallRank || "–"}</td>
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: POS_COLOR[p.pos], flexShrink: 0 }} />
                    <span style={{ color: T.textPrimary, fontWeight: 400 }}>{p.player}</span>
                    <span style={{ color: T.textMuted, fontSize: 10.5 }}>
                      {p.pos}
                      {p.positionRank ? p.positionRank : ""} · {p.team}
                    </span>
                  </span>
                </td>
                <td style={{ ...cellStyle, textAlign: "right", color: T.textPrimary }}>{fmt(p.points)}</td>
                <td style={{ ...cellStyle, textAlign: "right" }}>
                  {fmt(p.pointsLo, 0)}–{fmt(p.pointsHi, 0)}
                </td>
                <td style={{ ...cellStyle, textAlign: "right", color: (p.vor ?? -1) >= 0 ? T.textPrimary : T.textMuted }}>{fmt(p.vor)}</td>
                <td style={{ ...cellStyle, textAlign: "right" }}>{fmt(p.risk)}</td>
                <td style={{ ...cellStyle, textAlign: "right" }}>{fmt(p.pick, 0)}</td>
                <td style={{ ...cellStyle, textAlign: "right" }}>{p.avgCost > 1 || p.inflatedCost > 1 ? p.inflatedCost : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > limit && (
        <button
          onClick={() => setLimit((l) => l + 75)}
          style={{
            marginTop: 10,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: "0.1em",
            padding: "6px 16px",
            background: "transparent",
            border: `1px solid ${T.border}`,
            borderRadius: 2,
            color: T.textSecondary,
            cursor: "pointer",
          }}
        >
          SHOW MORE ({rows.length - limit} REMAINING)
        </button>
      )}
    </div>
  );
}
