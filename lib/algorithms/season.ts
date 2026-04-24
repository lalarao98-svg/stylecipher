import type { SeasonKey } from "@/lib/types";

type SeasonScores = Partial<Record<string, number>>;

export function calcSeason(sc: SeasonScores): SeasonKey {
  const w  = sc.warm   ?? 0;
  const co = sc.cool   ?? 0;
  const l  = sc.light  ?? 0;
  const d  = sc.dark   ?? 0;
  const m  = sc.medium ?? 0;
  const b  = sc.bright ?? 0;
  const mu = sc.muted  ?? 0;

  const isWarm = w > co;

  if (isWarm) {
    if (b >= mu && b >= 3)      return "BrightSpring";
    if (l > d && l > m)         return "LightSpring";
    if (mu > b) {
      if (d > l)                return "DarkAutumn";
      if (mu >= 4)              return "SoftAutumn";
                                return "TrueAutumn";
    }
    if (d > l + 2)              return "DarkAutumn";
    if (d > l)                  return "TrueAutumn";
                                return "TrueSpring";
  } else {
    if (b >= mu && b >= 3)      return "BrightWinter";
    if (l > d && l > m)         return "LightSummer";
    if (mu > b) {
      if (d > l)                return "DarkWinter";
      if (mu >= 4)              return "SoftSummer";
                                return "TrueSummer";
    }
    if (d > l + 2)              return "DarkWinter";
    if (d > l)                  return "TrueWinter";
                                return "TrueSummer";
  }
}
