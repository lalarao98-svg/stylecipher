import type { SeasonData, SeasonKey, SeasonFamily } from "@/lib/types";

export const SEASONS: Record<SeasonKey, SeasonData> = {
  BrightSpring: {
    fam: "Spring", label: "Bright Spring", sub: "Bright + Warm",
    pal:  ["#FF6B35","#FFC857","#2EC4B6","#E71D36","#FF9F1C","#44AF69","#F15BB5","#00BBF9"],
    neut: ["#FFFCF2","#5D4037","#212121"],
    metals: "Bright gold, rose gold", avoid: "Muted, dusty, very dark",
    desc: "Clear vivid saturated warm",
  },
  TrueSpring: {
    fam: "Spring", label: "True Spring", sub: "Warm + Bright",
    pal:  ["#E8871E","#D4A03C","#7CB342","#FF7043","#FFB300","#689F38","#F4511E","#FDD835"],
    neut: ["#FFF8E1","#795548","#3E2723"],
    metals: "Yellow gold, copper, bronze", avoid: "Cool, icy, muted",
    desc: "Intensely warm and saturated",
  },
  LightSpring: {
    fam: "Spring", label: "Light Spring", sub: "Light + Warm",
    pal:  ["#FFB3BA","#FFDFBA","#BAFFC9","#BAE1FF","#FFE4B5","#FFDAB9","#E6E6FA","#FFF0DB"],
    neut: ["#FFFEF7","#C4A882","#8B7D6B"],
    metals: "Light gold, rose gold", avoid: "Dark, heavy, very saturated",
    desc: "Warm delicate pastels",
  },
  LightSummer: {
    fam: "Summer", label: "Light Summer", sub: "Light + Cool",
    pal:  ["#B2DFDB","#F8BBD0","#B3E5FC","#D1C4E9","#DCEDC8","#FFE0B2","#F0F4C3","#CFD8DC"],
    neut: ["#FAFAFA","#9E9E9E","#607D8B"],
    metals: "Silver, white gold, platinum", avoid: "Dark, warm, highly saturated",
    desc: "Cool light gentle",
  },
  TrueSummer: {
    fam: "Summer", label: "True Summer", sub: "Cool + Muted",
    pal:  ["#7986CB","#4DB6AC","#F48FB1","#81D4FA","#A1887F","#90A4AE","#CE93D8","#80CBC4"],
    neut: ["#ECEFF1","#78909C","#455A64"],
    metals: "Silver, pewter", avoid: "Warm, bright, intense",
    desc: "Cool and toned down",
  },
  SoftSummer: {
    fam: "Summer", label: "Soft Summer", sub: "Muted + Cool",
    pal:  ["#A0AEC0","#B2A4D4","#9DB5B2","#C9A0A0","#A8B8A0","#B0B0C0","#C4B0A0","#90A0A0"],
    neut: ["#F0EDE8","#8B8680","#5A5550"],
    metals: "Brushed silver, pewter", avoid: "Bright, warm, high-contrast",
    desc: "Extremely soft muted",
  },
  SoftAutumn: {
    fam: "Autumn", label: "Soft Autumn", sub: "Muted + Warm",
    pal:  ["#C9B89A","#A6927A","#8BA089","#C7A78E","#B8A090","#9CAF88","#C4956A","#A0B0A0"],
    neut: ["#F5F0E8","#8B7E6B","#4A4035"],
    metals: "Antique gold, brushed gold", avoid: "Bright, cool, high-contrast",
    desc: "Muted earthy warmth",
  },
  TrueAutumn: {
    fam: "Autumn", label: "True Autumn", sub: "Warm + Muted",
    pal:  ["#BF6415","#C4882B","#6B7F2A","#8B4513","#D4A03C","#A0522D","#CC7722","#556B2F"],
    neut: ["#FFF5E6","#6B4226","#3B2716"],
    metals: "Yellow gold, bronze, copper", avoid: "Cool, bright, pastel",
    desc: "Rich warm earthy harvest",
  },
  DarkAutumn: {
    fam: "Autumn", label: "Dark Autumn", sub: "Dark + Warm",
    pal:  ["#8B0000","#2F4F4F","#8B4513","#556B2F","#800020","#704214","#3B5323","#6B3A2A"],
    neut: ["#D4C4A8","#5A4A3A","#2A1F14"],
    metals: "Antique gold, bronze, dark copper", avoid: "Light pastels, cool brights",
    desc: "Deep rich warm",
  },
  BrightWinter: {
    fam: "Winter", label: "Bright Winter", sub: "Bright + Cool",
    pal:  ["#E91E63","#2196F3","#00BCD4","#FF5722","#9C27B0","#4CAF50","#FF1744","#651FFF"],
    neut: ["#FFFFFF","#424242","#000000"],
    metals: "Bright silver, platinum", avoid: "Muted, dusty, warm",
    desc: "Vivid cool electric",
  },
  TrueWinter: {
    fam: "Winter", label: "True Winter", sub: "Cool + Bright",
    pal:  ["#D32F2F","#1976D2","#7B1FA2","#00897B","#C2185B","#303F9F","#00695C","#AD1457"],
    neut: ["#FFFFFF","#616161","#000000"],
    metals: "Silver, platinum, chrome", avoid: "Warm, muted, earthy",
    desc: "Icy bold maximum contrast",
  },
  DarkWinter: {
    fam: "Winter", label: "Dark Winter", sub: "Dark + Cool",
    pal:  ["#880E4F","#1A237E","#004D40","#4A148C","#B71C1C","#0D47A1","#1B5E20","#311B92"],
    neut: ["#F5F5F5","#424242","#0D0D0D"],
    metals: "Silver, gunmetal", avoid: "Light pastels, warm/muted",
    desc: "Deep cool dramatic",
  },
};

export const SFAM: Record<SeasonFamily, string> = {
  Spring: "#C4882B",
  Summer: "#5A7A9B",
  Autumn: "#8B5A1A",
  Winter: "#2A4A7A",
};
