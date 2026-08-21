"use client";
import { useState } from "react";
import type { ScoringSettings, VorPosition } from "@/lib/fantasy/types";
import { VOR_POSITIONS } from "@/lib/fantasy/types";
import { useFantasyStore } from "@/store/useFantasyStore";
import { SANS, T } from "./theme";

const SCORING_FIELDS: { key: keyof ScoringSettings; label: string }[] = [
  { key: "passYds", label: "Pts / pass yd" },
  { key: "passTds", label: "Pass TD" },
  { key: "passInt", label: "Interception" },
  { key: "rushYds", label: "Pts / rush yd" },
  { key: "rushTds", label: "Rush TD" },
  { key: "rec", label: "Reception" },
  { key: "recYds", label: "Pts / rec yd" },
  { key: "recTds", label: "Rec TD" },
  { key: "twoPts", label: "2-pt conv" },
  { key: "fumbles", label: "Fumble" },
];

const inputStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 12,
  padding: "4px 6px",
  width: 64,
  background: "#0E0B0A",
  border: `1px solid ${T.border}`,
  borderRadius: 2,
  color: T.textPrimary,
  outline: "none",
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
};

const labelStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 11,
  fontWeight: 300,
  color: T.textSecondary,
  letterSpacing: "0.04em",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

/** League + scoring settings; every change re-runs the projection pipeline live. */
export default function SettingsPanel() {
  const { league, setLeague, setStarters, setScoring, resetLeague } = useFantasyStore();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 3, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", color: T.textPrimary }}>
          LEAGUE SETTINGS
        </h3>
        <button
          onClick={resetLeague}
          style={{ ...labelStyle, background: "none", border: "none", cursor: "pointer", color: T.textMuted, textDecoration: "underline" }}
        >
          reset
        </button>
      </div>

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <Row label="Teams">
          <input
            type="number" min={4} max={20} style={inputStyle}
            value={league.numTeams}
            onChange={(e) => setLeague({ numTeams: Math.max(2, +e.target.value || 2) })}
          />
        </Row>
        {VOR_POSITIONS.map((pos: VorPosition) => (
          <Row key={pos} label={`${pos} starters`}>
            <input
              type="number" min={pos === "QB" ? 1 : 0} max={5} style={inputStyle}
              value={league.starters[pos]}
              onChange={(e) => setStarters(pos, Math.max(pos === "QB" ? 1 : 0, +e.target.value || 0))}
            />
          </Row>
        ))}
        <Row label="Total starters (incl. flex)">
          <input
            type="number" min={4} max={12} style={inputStyle}
            value={league.numTotalStarters}
            onChange={(e) => setLeague({ numTotalStarters: Math.max(4, +e.target.value || 4) })}
          />
        </Row>
        <Row label="Roster size">
          <input
            type="number" min={league.numTotalStarters} max={30} style={inputStyle}
            value={league.numTotalPlayers}
            onChange={(e) => setLeague({ numTotalPlayers: Math.max(league.numTotalStarters, +e.target.value || league.numTotalStarters) })}
          />
        </Row>
        <Row label="Auction cap ($)">
          <input
            type="number" min={50} max={1000} style={inputStyle}
            value={league.leagueCap}
            onChange={(e) => setLeague({ leagueCap: Math.max(10, +e.target.value || 10) })}
          />
        </Row>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          marginTop: 14,
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: "0.12em",
          padding: "5px 0",
          width: "100%",
          background: "transparent",
          border: `1px solid ${T.border}`,
          borderRadius: 2,
          color: T.textSecondary,
          cursor: "pointer",
        }}
      >
        {open ? "HIDE SCORING ▴" : "SCORING RULES ▾"}
      </button>
      {open && (
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {SCORING_FIELDS.map((f) => (
            <Row key={f.key} label={f.label}>
              <input
                type="number" step={0.01} style={inputStyle}
                value={Number(league.scoring[f.key].toFixed(3))}
                onChange={(e) => setScoring({ [f.key]: +e.target.value || 0 })}
              />
            </Row>
          ))}
          <p style={{ ...labelStyle, color: T.textMuted, fontSize: 10, lineHeight: 1.5 }}>
            Yardage fields are points per yard (0.04 = 1 pt / 25 yds). Kicker & DST scoring is fixed.
          </p>
        </div>
      )}
    </div>
  );
}
