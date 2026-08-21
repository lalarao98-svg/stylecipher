"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import { DATASET, buildProjections, maxStarterCost, optimizeRoster } from "@/lib/fantasy";
import { useFantasyStore } from "@/store/useFantasyStore";
import { POS_COLOR, SANS, SERIF, T, fmt } from "@/components/fantasy/theme";

const subscribeNoop = () => () => {};
const yes = () => true;
const no = () => false;

const labelStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 10,
  fontWeight: 300,
  letterSpacing: "0.14em",
  color: T.textMuted,
  textTransform: "uppercase",
};

export default function OptimizerPage() {
  const { league, maxRisk, setMaxRisk, budget, setBudget, drafted, toggleDrafted, clearDrafted } = useFantasyStore();
  const [query, setQuery] = useState("");
  // False on the server-rendered pass, true once hydrated: the persisted
  // store may differ from defaults, so skip SSR markup for stateful content.
  const mounted = useSyncExternalStore(subscribeNoop, yes, no);

  const projections = useMemo(() => buildProjections(DATASET.players, league), [league]);
  const defaultBudget = maxStarterCost(league);
  const activeBudget = budget ?? defaultBudget;

  const solution = useMemo(
    () => optimizeRoster(projections, league, { maxRisk, budget: activeBudget, omit: new Set(drafted) }),
    [projections, league, maxRisk, activeBudget, drafted],
  );
  // The same lineup problem with the risk cap off — what safety costs you.
  const unconstrained = useMemo(
    () => optimizeRoster(projections, league, { maxRisk: Infinity, budget: activeBudget, omit: new Set(drafted) }),
    [projections, league, activeBudget, drafted],
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return projections
      .filter((p) => p.vor != null && p.player.toLowerCase().includes(q) && !drafted.includes(p.id))
      .sort((a, b) => b.vor! - a.vor!)
      .slice(0, 6);
  }, [query, projections, drafted]);

  const draftedPlayers = useMemo(
    () => drafted.map((id) => projections.find((p) => p.id === id)).filter(Boolean),
    [drafted, projections],
  );

  if (!mounted) return null;

  const budgetUsed = solution.totalCost / activeBudget;
  const riskPenalty = unconstrained.totalPoints - solution.totalPoints;

  const cell: React.CSSProperties = {
    padding: "8px 14px",
    fontFamily: SANS,
    fontSize: 12,
    fontWeight: 300,
    color: T.textSecondary,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 40px 64px" }}>
      <h1 style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, fontStyle: "italic", color: T.textPrimary }}>
        Auction Optimizer
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 300, color: T.textSecondary, marginTop: 4, marginBottom: 28, letterSpacing: "0.04em", maxWidth: 720, lineHeight: 1.6 }}>
        The exact lineup of {league.numTotalStarters} starters that maximizes projected points for your
        budget {`(${league.starters.QB} QB, at least ${league.starters.RB} RB, ${league.starters.WR} WR and ${league.starters.TE} TE)`}
        {" "}while every player stays under your risk tolerance. Mark players as drafted during your
        auction and re-optimize with what&rsquo;s left.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 3, padding: 16, display: "grid", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={labelStyle}>Max risk per player</span>
                <span style={{ fontFamily: SANS, fontSize: 12, color: T.textPrimary, fontVariantNumeric: "tabular-nums" }}>
                  {maxRisk >= 10 ? "no limit" : maxRisk.toFixed(1)}
                </span>
              </div>
              <input
                type="range" min={3.5} max={10} step={0.1} value={maxRisk}
                onChange={(e) => setMaxRisk(+e.target.value)}
                style={{ width: "100%", accentColor: T.accent, marginTop: 8 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 9, color: T.textMuted }}>
                <span>cautious</span><span>anything goes</span>
              </div>
            </div>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={labelStyle}>Starter budget ($)</span>
              <input
                type="number" min={league.numTotalStarters} max={league.leagueCap}
                value={activeBudget}
                onChange={(e) => setBudget(+e.target.value === defaultBudget ? null : Math.max(1, +e.target.value || 1))}
                style={{
                  fontFamily: SANS, fontSize: 12, padding: "4px 6px", width: 70, textAlign: "right",
                  background: T.bg, border: `1px solid ${T.border}`, borderRadius: 2, color: T.textPrimary, outline: "none",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
            </label>
            <p style={{ fontFamily: SANS, fontSize: 10, fontWeight: 300, color: T.textMuted, lineHeight: 1.5 }}>
              {`Default = $${league.leagueCap} cap − $1 for each of your ${league.numTotalPlayers - league.numTotalStarters} bench spots.`}
            </p>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 3, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={labelStyle}>Already drafted</span>
              {drafted.length > 0 && (
                <button onClick={clearDrafted} style={{ fontFamily: SANS, fontSize: 10, color: T.textMuted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  clear ({drafted.length})
                </button>
              )}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a name to remove them…"
              style={{
                width: "100%", marginTop: 10, fontFamily: SANS, fontSize: 12, padding: "6px 8px",
                background: T.bg, border: `1px solid ${T.border}`, borderRadius: 2, color: T.textPrimary, outline: "none",
              }}
            />
            {searchResults.length > 0 && (
              <div style={{ marginTop: 6, display: "grid" }}>
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { toggleDrafted(p.id); setQuery(""); }}
                    style={{
                      textAlign: "left", fontFamily: SANS, fontSize: 12, padding: "5px 8px", cursor: "pointer",
                      background: "transparent", border: "none", color: T.textSecondary, borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    {p.player} <span style={{ color: T.textMuted, fontSize: 10 }}>{p.pos} · {p.team}</span>
                  </button>
                ))}
              </div>
            )}
            {draftedPlayers.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {draftedPlayers.map((p) => (
                  <button
                    key={p!.id}
                    onClick={() => toggleDrafted(p!.id)}
                    title="Click to restore"
                    style={{
                      fontFamily: SANS, fontSize: 10, padding: "3px 8px", cursor: "pointer", borderRadius: 2,
                      background: "rgba(184,150,46,0.1)", border: `1px solid ${T.border}`, color: T.textSecondary,
                    }}
                  >
                    {p!.player} ✕
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 3, padding: 20 }}>
          {solution.feasible ? (
            <>
              <div style={{ display: "flex", gap: 32, alignItems: "baseline", flexWrap: "wrap" }}>
                <div>
                  <div style={labelStyle}>Projected points</div>
                  <div style={{ fontFamily: SANS, fontSize: 48, fontWeight: 600, color: T.textPrimary, lineHeight: 1.1 }}>
                    {solution.totalPoints.toFixed(0)}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Spent</div>
                  <div style={{ fontFamily: SANS, fontSize: 20, fontWeight: 500, color: T.textPrimary, fontVariantNumeric: "tabular-nums" }}>
                    ${solution.totalCost} <span style={{ color: T.textMuted, fontSize: 13 }}>of ${activeBudget}</span>
                  </div>
                </div>
                {riskPenalty > 0.5 && (
                  <div>
                    <div style={labelStyle}>Cost of playing safe</div>
                    <div style={{ fontFamily: SANS, fontSize: 20, fontWeight: 500, color: T.textSecondary, fontVariantNumeric: "tabular-nums" }}>
                      −{riskPenalty.toFixed(0)} pts <span style={{ color: T.textMuted, fontSize: 13 }}>vs. no risk cap</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Budget meter: filled = spent, track = same-ramp lighter step */}
              <div style={{ marginTop: 14, height: 6, borderRadius: 3, background: "rgba(184,150,46,0.18)", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, budgetUsed * 100)}%`, height: "100%", background: T.accent }} />
              </div>

              <div style={{ overflowX: "auto", marginTop: 20, border: `1px solid ${T.border}`, borderRadius: 3 }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      {["Player", "Points", "VOR", "Risk", "Cost"].map((h, i) => (
                        <th key={h} style={{ ...cell, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, textAlign: i === 0 ? "left" : "right", background: T.surfaceRaised }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {solution.players.map((p) => (
                      <tr key={p.id}>
                        <td style={{ ...cell, textAlign: "left" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: POS_COLOR[p.pos], flexShrink: 0 }} />
                            <span style={{ color: T.textPrimary, fontWeight: 400 }}>{p.player}</span>
                            <span style={{ color: T.textMuted, fontSize: 10.5 }}>{p.pos} · {p.team}</span>
                          </span>
                        </td>
                        <td style={{ ...cell, textAlign: "right", color: T.textPrimary }}>{fmt(p.points)}</td>
                        <td style={{ ...cell, textAlign: "right" }}>{fmt(p.vor)}</td>
                        <td style={{ ...cell, textAlign: "right" }}>{fmt(p.risk)}</td>
                        <td style={{ ...cell, textAlign: "right" }}>${p.inflatedCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p style={{ fontFamily: SANS, fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>
              No feasible lineup under these constraints — raise the risk limit or the budget, or restore some drafted players.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
