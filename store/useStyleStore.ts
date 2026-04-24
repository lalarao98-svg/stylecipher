"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { KibbeType, SeasonKey, ArchetypeCode, StyleMeResult, Platform, Category } from "@/lib/types";
import { ARCHETYPES } from "@/lib/data";

type Weights = Partial<Record<ArchetypeCode, number>>;

interface StyleStore {
  /* Profile selections */
  selK: KibbeType | null;
  selS: SeasonKey | null;
  archWeights: Weights;
  archDone: boolean;
  archHistory: Weights[];

  /* Style Me */
  depopSize: string;
  platform: Platform;
  category: Category;
  vibes: string[];
  styleMeResults: StyleMeResult[][];

  /* Quiz UI state */
  kibbeStep: number;
  kibbeScores: Record<string, number>;
  kibbeMode: "quiz" | "measure";
  seasonStep: number;
  seasonScores: Record<string, number>;
  archStep: number;
  archUsed: number[];
  quizTab: "kibbe" | "season" | "arch";

  /* Actions */
  setSelK: (k: KibbeType | null) => void;
  setSelS: (s: SeasonKey | null) => void;
  setArchWeights: (w: Weights) => void;
  setArchDone: (d: boolean) => void;
  pushArchHistory: (w: Weights) => void;
  setDepopSize: (s: string) => void;
  setPlatform: (p: Platform) => void;
  setCategory: (c: Category) => void;
  toggleVibe: (v: string) => void;
  pushStyleMeResults: (r: StyleMeResult[]) => void;
  setKibbeStep: (n: number) => void;
  setKibbeScores: (sc: Record<string, number>) => void;
  setKibbeMode: (m: "quiz" | "measure") => void;
  setSeasonStep: (n: number) => void;
  setSeasonScores: (sc: Record<string, number>) => void;
  setArchStep: (n: number) => void;
  setArchUsed: (u: number[]) => void;
  setQuizTab: (t: "kibbe" | "season" | "arch") => void;
  resetQuiz: () => void;
}

const INITIAL_WEIGHTS: Weights = (() => {
  const w: Weights = {};
  for (const code of Object.keys(ARCHETYPES) as ArchetypeCode[]) {
    w[code] = 1 / 34;
  }
  return w;
})();

export const useStyleStore = create<StyleStore>()(
  persist(
    (set) => ({
      selK: null,
      selS: null,
      archWeights: INITIAL_WEIGHTS,
      archDone: false,
      archHistory: [],
      depopSize: "",
      platform: "all",
      category: "all",
      vibes: [],
      styleMeResults: [],
      kibbeStep: 0,
      kibbeScores: {},
      kibbeMode: "quiz",
      seasonStep: 0,
      seasonScores: {},
      archStep: 0,
      archUsed: [],
      quizTab: "kibbe",

      setSelK: (k) => set({ selK: k }),
      setSelS: (s) => set({ selS: s }),
      setArchWeights: (w) => set({ archWeights: w }),
      setArchDone: (d) => set({ archDone: d }),
      pushArchHistory: (w) => set((s) => ({ archHistory: [...s.archHistory, w] })),
      setDepopSize: (sz) => set({ depopSize: sz }),
      setPlatform: (p) => set({ platform: p }),
      setCategory: (c) => set({ category: c }),
      toggleVibe: (v) =>
        set((s) => ({
          vibes: s.vibes.includes(v) ? s.vibes.filter((x) => x !== v) : [...s.vibes, v],
        })),
      pushStyleMeResults: (r) => set((s) => ({ styleMeResults: [r, ...s.styleMeResults].slice(0, 10) })),
      setKibbeStep: (n) => set({ kibbeStep: n }),
      setKibbeScores: (sc) => set({ kibbeScores: sc }),
      setKibbeMode: (m) => set({ kibbeMode: m }),
      setSeasonStep: (n) => set({ seasonStep: n }),
      setSeasonScores: (sc) => set({ seasonScores: sc }),
      setArchStep: (n) => set({ archStep: n }),
      setArchUsed: (u) => set({ archUsed: u }),
      setQuizTab: (t) => set({ quizTab: t }),
      resetQuiz: () =>
        set({
          kibbeStep: 0,
          kibbeScores: {},
          kibbeMode: "quiz",
          seasonStep: 0,
          seasonScores: {},
          archStep: 0,
          archUsed: [],
          archWeights: INITIAL_WEIGHTS,
          archHistory: [],
          archDone: false,
        }),
    }),
    { name: "stylecipher-profile" },
  ),
);
