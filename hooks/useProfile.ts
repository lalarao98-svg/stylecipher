"use client";

import { useState, useCallback } from "react";
import type { KibbeType, SeasonKey, ArchetypeCode, StyleProfile } from "@/lib/types";

type ArchWeights = Partial<Record<ArchetypeCode, number>>;

const EMPTY: StyleProfile = {
  kibbe_type:        null,
  color_season:      null,
  archetype_weights: {} as Record<ArchetypeCode, number>,
  archetype_history: [],
  size_letter:       null,
  style_me_history:  [],
};

export function useProfile() {
  const [profile, setProfile] = useState<StyleProfile>(EMPTY);

  const setKibbeType = useCallback((t: KibbeType | null) =>
    setProfile((p) => ({ ...p, kibbe_type: t })), []);

  const setColorSeason = useCallback((s: SeasonKey | null) =>
    setProfile((p) => ({ ...p, color_season: s })), []);

  const setArchWeights = useCallback((
    w: ArchWeights | ((prev: ArchWeights) => ArchWeights),
  ) => setProfile((p) => ({
    ...p,
    archetype_weights: typeof w === "function"
      ? w(p.archetype_weights) as Record<ArchetypeCode, number>
      : w as Record<ArchetypeCode, number>,
  })), []);

  const pushArchHistory = useCallback((snapshot: ArchWeights) =>
    setProfile((p) => ({
      ...p,
      archetype_history: [...p.archetype_history, snapshot as Record<ArchetypeCode, number>],
    })), []);

  const setSizeLetter = useCallback((sz: StyleProfile["size_letter"]) =>
    setProfile((p) => ({ ...p, size_letter: sz })), []);

  const reset = useCallback(() => setProfile(EMPTY), []);

  return {
    profile,
    setKibbeType,
    setColorSeason,
    setArchWeights,
    pushArchHistory,
    setSizeLetter,
    reset,
  };
}
