"use client";
import { useEffect, useRef, useState } from "react";
import { useStyleStore } from "@/store/useStyleStore";
import { loadProfile, saveProfile } from "@/lib/supabase";
import type { KibbeType, SeasonKey, ArchetypeCode } from "@/lib/types";

const UID_KEY = "stylecipher-uid";

function getOrCreateUid(): string {
  if (typeof window === "undefined") return "";
  let uid = localStorage.getItem(UID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(UID_KEY, uid);
  }
  return uid;
}

export default function SupabaseSync() {
  const {
    selK, selS, archWeights, archHistory, depopSize, styleMeResults,
    setSelK, setSelS, setArchWeights, setArchDone,
  } = useStyleStore();

  const uidRef = useRef("");
  const [hydrated, setHydrated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // One-time load from Supabase on mount
  useEffect(() => {
    const uid = getOrCreateUid();
    uidRef.current = uid;
    if (!uid || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setHydrated(true);
      return;
    }
    loadProfile(uid)
      .then((profile) => {
        if (!profile) return;
        if (profile.kibbe_type)  setSelK(profile.kibbe_type as KibbeType);
        if (profile.color_season) setSelS(profile.color_season as SeasonKey);
        if (profile.archetype_weights && Object.keys(profile.archetype_weights).length > 0) {
          setArchWeights(profile.archetype_weights as Partial<Record<ArchetypeCode, number>>);
          setArchDone(true);
        }
      })
      .catch(() => { /* Supabase unreachable — localStorage fallback is fine */ })
      .finally(() => setHydrated(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save whenever profile changes (only after initial hydration)
  useEffect(() => {
    if (!hydrated || !uidRef.current || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveProfile(uidRef.current, {
        kibbe_type:        selK,
        color_season:      selS,
        archetype_weights: archWeights as Record<ArchetypeCode, number>,
        archetype_history: archHistory as Array<Record<ArchetypeCode, number>>,
        size_letter:       (depopSize || null) as "XS" | "S" | "M" | "L" | "XL" | null,
        style_me_history:  styleMeResults,
      }).catch(() => { /* silent — localStorage is the primary persistence */ });
    }, 1200);
    return () => clearTimeout(timerRef.current);
  }, [hydrated, selK, selS, archWeights, depopSize, styleMeResults]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
