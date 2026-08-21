"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LeagueSettings, Position, ScoringSettings, VorPosition } from "@/lib/fantasy/types";
import { DEFAULT_LEAGUE } from "@/lib/fantasy/scoring";

interface FantasyStore {
  league: LeagueSettings;
  /** Draft board position filter ("ALL" or a position). */
  posFilter: Position | "ALL";
  /* Optimizer inputs */
  maxRisk: number;
  budget: number | null; // null = derive from league cap
  drafted: string[];     // player ids already off the board

  setScoring: (patch: Partial<ScoringSettings>) => void;
  setLeague: (patch: Partial<Omit<LeagueSettings, "scoring" | "starters">>) => void;
  setStarters: (pos: VorPosition, n: number) => void;
  resetLeague: () => void;
  setPosFilter: (p: Position | "ALL") => void;
  setMaxRisk: (r: number) => void;
  setBudget: (b: number | null) => void;
  toggleDrafted: (id: string) => void;
  clearDrafted: () => void;
}

export const useFantasyStore = create<FantasyStore>()(
  persist(
    (set) => ({
      league: DEFAULT_LEAGUE,
      posFilter: "ALL",
      maxRisk: 10,
      budget: null,
      drafted: [],

      setScoring: (patch) =>
        set((s) => ({ league: { ...s.league, scoring: { ...s.league.scoring, ...patch } } })),
      setLeague: (patch) => set((s) => ({ league: { ...s.league, ...patch } })),
      setStarters: (pos, n) =>
        set((s) => {
          const starters = { ...s.league.starters, [pos]: n };
          const minTotal = starters.QB + starters.RB + starters.WR + starters.TE;
          return {
            league: {
              ...s.league,
              starters,
              numTotalStarters: Math.max(s.league.numTotalStarters, minTotal),
            },
          };
        }),
      resetLeague: () => set({ league: DEFAULT_LEAGUE }),
      setPosFilter: (posFilter) => set({ posFilter }),
      setMaxRisk: (maxRisk) => set({ maxRisk }),
      setBudget: (budget) => set({ budget }),
      toggleDrafted: (id) =>
        set((s) => ({
          drafted: s.drafted.includes(id) ? s.drafted.filter((d) => d !== id) : [...s.drafted, id],
        })),
      clearDrafted: () => set({ drafted: [] }),
    }),
    { name: "fantasy-store" },
  ),
);
