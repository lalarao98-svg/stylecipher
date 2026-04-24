import { KIBBE } from "@/lib/data";
import type { KibbeType, KibbeMeasurements } from "@/lib/types";

export function inferKibbe(
  m: KibbeMeasurements,
): { type: KibbeType; runner: KibbeType } | null {
  const h  = parseFloat(m.height)    || 0;
  const bu = parseFloat(m.bust)      || 0;
  const wa = parseFloat(m.waist)     || 0;
  const hi = parseFloat(m.hips)      || 0;
  const sh = parseFloat(m.shoulders) || 0;

  if (!h && !bu) return null;

  const sc: Record<string, number> = {};
  for (const k of Object.keys(KIBBE)) sc[k] = 0;

  // Height
  if (h >= 67) {
    sc.Dramatic += 3; sc.SoftDramatic += 2; sc.FlamboyantNatural += 3;
  } else if (h >= 64) {
    sc.Classic += 2; sc.SoftClassic += 2; sc.DramaticClassic += 2;
    sc.Natural += 2; sc.SoftNatural += 2;
  } else {
    sc.Romantic += 2; sc.TheatricalRomantic += 2;
    sc.Gamine += 3; sc.SoftGamine += 3; sc.FlamboyantGamine += 3;
  }

  // Curve ratio
  const avg = (bu + hi) / 2;
  const wd  = avg - wa;
  if (wd > 8) {
    sc.Romantic += 3; sc.TheatricalRomantic += 2; sc.SoftDramatic += 2;
  } else if (wd > 5) {
    sc.SoftClassic += 2; sc.SoftNatural += 1;
  } else {
    sc.Dramatic += 2; sc.Natural += 2; sc.FlamboyantGamine += 1;
  }

  // Shoulder shape
  if (m.shoulderShape === "narrow") {
    sc.Dramatic += 2; sc.DramaticClassic += 1;
  } else if (m.shoulderShape === "wide") {
    sc.Natural += 3; sc.SoftNatural += 3; sc.FlamboyantNatural += 2;
  } else if (m.shoulderShape === "sloped") {
    sc.Romantic += 2; sc.SoftClassic += 1;
  }

  // Body flesh
  if (m.bodyFlesh === "soft") {
    sc.Romantic += 2; sc.SoftNatural += 2; sc.SoftClassic += 1; sc.SoftDramatic += 1;
  } else if (m.bodyFlesh === "lean") {
    sc.Dramatic += 2; sc.FlamboyantGamine += 1;
  }

  // Face shape
  if (m.faceShape === "angular") {
    sc.Dramatic += 2; sc.DramaticClassic += 1;
  } else if (m.faceShape === "round") {
    sc.Romantic += 2; sc.SoftNatural += 1; sc.SoftGamine += 1;
  } else if (m.faceShape === "blunt") {
    sc.Natural += 2; sc.SoftNatural += 1;
  }

  // Shoulder vs hip width
  if (sh && hi && sh > hi + 1) {
    sc.Natural += 2; sc.SoftNatural += 2;
  }

  const sorted = Object.entries(sc).sort((a, b) => b[1] - a[1]);
  return {
    type:   sorted[0][0] as KibbeType,
    runner: sorted[1][0] as KibbeType,
  };
}
