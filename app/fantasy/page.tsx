"use client";
import { useMemo, useSyncExternalStore } from "react";
import { DATASET, buildProjections } from "@/lib/fantasy";
import type { ProjectedPlayer } from "@/lib/fantasy/types";
import { useFantasyStore } from "@/store/useFantasyStore";
import VorChart from "@/components/fantasy/VorChart";
import RiskScatter from "@/components/fantasy/RiskScatter";
import RankingsTable from "@/components/fantasy/RankingsTable";
import SettingsPanel from "@/components/fantasy/SettingsPanel";
import { SANS, SERIF, T, fmt } from "@/components/fantasy/theme";

const subscribeNoop = () => () => {};
const yes = () => true;
const no = () => false;

function StatTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 3, padding: "14px 18px", flex: 1, minWidth: 180 }}>
      <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 300, letterSpacing: "0.14em", color: T.textMuted, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 20, fontWeight: 500, color: T.textPrimary, marginTop: 4 }}>{value}</div>
      <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 300, color: T.textSecondary, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
        {detail}
      </div>
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, fontStyle: "italic", color: T.textPrimary }}>{children}</h2>
      {sub && <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 300, color: T.textMuted, marginTop: 2, letterSpacing: "0.04em" }}>{sub}</p>}
    </div>
  );
}

export default function DraftBoardPage() {
  const league = useFantasyStore((s) => s.league);
  // False on the server-rendered pass, true once hydrated: the persisted
  // store may differ from defaults, so skip SSR markup for stateful content.
  const mounted = useSyncExternalStore(subscribeNoop, yes, no);

  const projections: ProjectedPlayer[] = useMemo(
    () => buildProjections(DATASET.players, league),
    [league],
  );

  const tiles = useMemo(() => {
    const startable = projections.filter((p) => p.vor != null && p.vor >= 0);
    const topValue = [...startable].sort((a, b) => b.vor! - a.vor!)[0];
    const withRisk = startable.filter((p) => p.risk != null);
    const safest = [...withRisk].sort((a, b) => a.risk! - b.risk!)[0];
    const boomBust = [...withRisk].sort((a, b) => b.risk! - a.risk!)[0];
    return { startable, topValue, safest, boomBust };
  }, [projections]);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 40px 64px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, fontStyle: "italic", color: T.textPrimary }}>
          Draft Board
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 300, color: T.textSecondary, marginTop: 4, letterSpacing: "0.04em", maxWidth: 720, lineHeight: 1.6 }}>
          Projections from {Object.keys(DATASET.sources).length} sources ({Object.values(DATASET.sources).join(", ")}) are scored under your league
          settings, combined with a robust average, and ranked by value over a replacement-level starter. Risk measures
          how much the sources and real drafters disagree about a player.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
        {tiles.topValue && (
          <StatTile
            label="Top value"
            value={tiles.topValue.player}
            detail={`VOR ${fmt(tiles.topValue.vor)} · ${fmt(tiles.topValue.points)} pts`}
          />
        )}
        {tiles.safest && (
          <StatTile
            label="Safest starter"
            value={tiles.safest.player}
            detail={`risk ${fmt(tiles.safest.risk)} · VOR ${fmt(tiles.safest.vor)}`}
          />
        )}
        {tiles.boomBust && (
          <StatTile
            label="Boom or bust"
            value={tiles.boomBust.player}
            detail={`risk ${fmt(tiles.boomBust.risk)} · VOR ${fmt(tiles.boomBust.vor)}`}
          />
        )}
        <StatTile
          label="Draftable players"
          value={String(tiles.startable.length)}
          detail="projected above replacement level"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 24, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 40 }}>
          <section style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 3, padding: 20, overflowX: "auto" }}>
            <SectionTitle sub="Points above a typical waiver-wire replacement at the position — the honest draft currency.">
              Value over replacement
            </SectionTitle>
            <VorChart players={projections} />
          </section>
          <section style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 3, padding: 20, overflowX: "auto" }}>
            <SectionTitle sub="Right of center: projection sources and drafters disagree — draft-day lottery tickets.">
              Risk vs. value
            </SectionTitle>
            <RiskScatter players={projections} />
          </section>
        </div>
        <SettingsPanel />
      </div>

      <section style={{ marginTop: 40 }}>
        <SectionTitle sub="Robust-average projections with Walsh-interval floor–ceiling, VOR, risk, ADP and inflated auction cost.">
          Rankings
        </SectionTitle>
        <RankingsTable players={projections} />
      </section>
    </div>
  );
}
