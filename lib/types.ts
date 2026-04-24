/* ── Core type identifiers ── */

export type KibbeType =
  | "Dramatic" | "SoftDramatic" | "Classic" | "SoftClassic" | "DramaticClassic"
  | "Natural"  | "SoftNatural"  | "FlamboyantNatural"
  | "Romantic" | "TheatricalRomantic"
  | "Gamine"   | "SoftGamine"   | "FlamboyantGamine";

export type SeasonKey =
  | "BrightSpring" | "TrueSpring"  | "LightSpring"
  | "LightSummer"  | "TrueSummer"  | "SoftSummer"
  | "SoftAutumn"   | "TrueAutumn"  | "DarkAutumn"
  | "BrightWinter" | "TrueWinter"  | "DarkWinter";

export type SeasonFamily = "Spring" | "Summer" | "Autumn" | "Winter";

export type ArchetypeCode =
  | "1a" | "1b" | "1c" | "1d"
  | "2a" | "2b" | "2c" | "2d"
  | "3a" | "3b" | "3c"
  | "4a" | "4b" | "4c" | "4d"
  | "5a" | "5b" | "5c"
  | "6a" | "6b" | "6c"
  | "7a" | "7b" | "7c"
  | "8a" | "8b" | "8c"
  | "9a" | "9b" | "9c" | "9d"
  | "10a"| "10b"| "10c"| "10d"
  | "11a"| "11b"| "11c";

/* ── Data shapes ── */

export interface KibbeData {
  short: string;
  desc:  string;
  sil:   Array<{ n: string }>;
  fab:   string[];
  neck:  string[];
  avoid: string[];
  jewel: string;
  c:     string; // accent color
}

export interface SeasonData {
  fam:    SeasonFamily;
  label:  string;
  sub:    string;
  pal:    string[]; // 8 hex colors
  neut:   string[]; // 3 hex neutrals
  metals: string;
  avoid:  string;
  desc:   string;
}

export interface ArchetypeData {
  name:   string;
  family: string;
  desc:   string;
  c:      string; // accent color
}

export interface BrandTiers {
  investment: string[];
  mid:        string[];
  accessible: string[];
  niche:      string[];
}

/* ── Quiz shapes ── */

export interface KibbeQuizQuestion {
  cat:  string;
  q:    string;
  opts: Array<{ l: string; sc: Partial<Record<string, number>> }>;
}

export interface SeasonQuizQuestion {
  q:    string;
  opts: Array<{ l: string; sc: Partial<Record<string, number>> }>;
}

export interface ArchetypeQuizRound {
  q:    string;
  opts: Array<{ l: string; sig: Partial<Record<ArchetypeCode, number>> }>;
}

/* ── Profile (persisted to Supabase) ── */

export interface StyleProfile {
  id?:               string;
  kibbe_type:        KibbeType | null;
  color_season:      SeasonKey | null;
  archetype_weights: Record<ArchetypeCode, number>;
  archetype_history: Array<Record<ArchetypeCode, number>>;
  size_letter:       "XS" | "S" | "M" | "L" | "XL" | null;
  style_me_history:  StyleMeResult[][];
}

/* ── Style Me ── */

export type Platform = "all" | "RTR" | "Nuuly" | "FashionPass" | "Depop";
export type Category = "all" | "Dresses" | "Tops" | "Bottoms" | "Outerwear" | "Sets";

export interface StyleMeResult {
  name:         string;
  brand:        string;
  platform:     string;
  price:        string;
  match:        string;
  url?:         string;
  search_query?: string; // Depop only
  era?:         string;  // Depop vintage
}

/* ── Depop API ── */

export interface DepopProduct {
  id:        string;
  slug:      string;
  title:     string;
  price:     { currencyCode: string; priceAmount: string };
  condition: number; // 3=Good 4=Like New 5=New
  size:      string;
  pictures:  Array<{ url: string }>;
  seller:    { username: string };
  url:       string;
}

/* ── Measurements (for inferKibbe) ── */

export interface KibbeMeasurements {
  height:       string;
  bust:         string;
  waist:        string;
  hips:         string;
  shoulders:    string;
  shoulderShape: "narrow" | "moderate" | "wide" | "sloped" | "";
  bodyFlesh:    "lean" | "moderate" | "soft" | "muscular" | "";
  faceShape:    "angular" | "round" | "blunt" | "mixed" | "";
}
