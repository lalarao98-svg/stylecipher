import { AQ, ARCHETYPES } from "@/lib/data";
import type { ArchetypeCode } from "@/lib/types";

type Weights = Partial<Record<ArchetypeCode, number>>;

export function updateArchWeights(
  weights: Weights,
  sig: Partial<Record<ArchetypeCode, number>>,
  alpha: number,
): Weights {
  const next = { ...weights };
  for (const [code, delta] of Object.entries(sig) as [ArchetypeCode, number][]) {
    next[code] = Math.max(0, (next[code] ?? 0) + alpha * delta);
  }
  const total = Object.values(next).reduce((a, b) => a + (b ?? 0), 0);
  if (total > 0) {
    for (const k of Object.keys(next) as ArchetypeCode[]) {
      next[k] = (next[k] ?? 0) / total;
    }
  }
  return next;
}

export function pickNextRound(weights: Weights, used: number[]): number | null {
  const available = AQ.map((_, i) => i).filter((i) => !used.includes(i));
  if (!available.length) return null;
  const scored = available.map((i) => {
    let s = 0;
    AQ[i].opts.forEach((o) => {
      for (const [code, mag] of Object.entries(o.sig) as [ArchetypeCode, number][]) {
        const wc = weights[code] ?? 0;
        s += Math.abs(mag) * (wc + Math.abs(0.03 - wc) * 0.5);
      }
    });
    return { i, s: s + Math.random() * 0.3 };
  });
  return scored.sort((a, b) => b.s - a.s)[0].i;
}

export function shouldStop(history: Weights[]): boolean {
  if (history.length < 10) return false;
  if (history.length >= 20) return true;
  const top = (h: Weights, k: number) =>
    Object.entries(h)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .slice(0, k)
      .map((x) => x[0]);
  const cur = top(history[history.length - 1], 5);
  for (let i = 1; i <= 3; i++) {
    const past = top(history[history.length - 1 - i], 5);
    if (cur.join(",") !== past.join(",")) return false;
    const maxDelta = Math.max(
      ...cur.map((c) =>
        Math.abs(
          (history[history.length - 1][c as ArchetypeCode] ?? 0) -
          (history[history.length - 1 - i][c as ArchetypeCode] ?? 0),
        ),
      ),
    );
    if (maxDelta > 0.05) return false;
  }
  return true;
}

export function rollupFamilies(weights: Weights): Record<string, number> {
  const families: Record<string, number> = {};
  for (const [code, wt] of Object.entries(weights) as [ArchetypeCode, number][]) {
    const arch = ARCHETYPES[code];
    if (!arch) continue;
    families[arch.family] = (families[arch.family] ?? 0) + (wt ?? 0);
  }
  return families;
}
