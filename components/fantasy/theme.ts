/* Visual theme for the fantasy analytics section.
 * Chart series colors are the dataviz reference palette's dark-mode steps,
 * validated (adjacent pairs, 4 slots) against the SURFACE color below. */

import type { Position } from "@/lib/fantasy/types";

export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SANS = "'Jost', system-ui, sans-serif";

export const T = {
  bg: "#0E0B0A",
  surface: "#14100E",
  surfaceRaised: "#1B1613",
  border: "rgba(200,184,152,0.12)",
  grid: "#241E19",
  textPrimary: "#F5EFE4",
  textSecondary: "#C0B29C",
  textMuted: "#8A7A68",
  accent: "#B8962E",
};

/** Fixed slot order (identity follows the position, never the filter). */
export const POS_COLOR: Record<Position, string> = {
  QB: "#3987E5",
  RB: "#D95926",
  WR: "#199E70",
  TE: "#C98500",
  K: "#8A7A68",
  DST: "#8A7A68",
};

export const POS_ORDER: Position[] = ["QB", "RB", "WR", "TE", "K", "DST"];

export function fmt(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "–";
  return n.toFixed(digits);
}
