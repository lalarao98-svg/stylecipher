import type { ArchetypeCode, BrandTiers } from "@/lib/types";

export const BRANDS: Partial<Record<ArchetypeCode, BrandTiers>> = {
  "1a": { investment: ["Toteme","Filippa K","Aeron"],            mid: ["COS","& Other Stories","Arket"],               accessible: ["Mango","Everlane","Quince"],              niche: ["Auralee","Baserange","Loulou Studio"] },
  "1b": { investment: ["The Row","Khaite","Loro Piana"],         mid: ["Toteme","Vince","Nili Lotan"],                  accessible: ["Quince","Everlane","Banana Republic"],   niche: ["Bite Studios","Arjé","Loulou Studio"] },
  "2a": { investment: ["Saint Laurent","Isabel Marant"],         mid: ["Sandro","Maje","Ba&sh","Claudie Pierlot"],      accessible: ["Sézane","Rouje","& Other Stories"],      niche: ["Musier Paris","Réalisation Par","Rouje"] },
  "3a": { investment: ["Jacquemus","Ami Paris","The Frankie Shop"],mid:["Anine Bing","Rag & Bone","Nili Lotan"],        accessible: ["Mango","H&M Studio","Zara"],             niche: ["Bianca Saunders","Tibi","Hanifa"] },
  "4a": { investment: ["Zimmermann","Cecilie Bahnsen","Ulla Johnson"],mid:["Doen","LoveShackFancy","Three Graces London"],accessible:["Reformation","For Love & Lemons","Faithfull"],niche:["Mille","Atelier Dré","Mabinta"] },
  "5a": { investment: ["Chloé","Isabel Marant","Ulla Johnson"],  mid: ["Ba&sh","Free People Elevated","Velvet"],        accessible: ["Free People","Anthropologie","Spell"],   niche: ["Cleobella","Natalie Martin","Jen's Pirate Booty"] },
  "8b": { investment: ["Burberry","Ralph Lauren Collection"],    mid: ["Massimo Dutti","Sandro","Club Monaco"],         accessible: ["J.Crew","L.L.Bean","Eddie Bauer"],       niche: ["Alex Mill","Drake's Women's","Percival"] },
  "10c":{ investment: ["Acne Studios","Saint Laurent","A.L.C."], mid: ["Anine Bing","AllSaints","Rag & Bone"],          accessible: ["H&M","Zara","ASOS"],                    niche: ["Deadwood","Nudie Jeans","Understated Leather"] },
};

export const DEFAULT_BRANDS: BrandTiers = {
  investment: ["The Row","Isabel Marant","Toteme"],
  mid:        ["Sandro","Ba&sh","Maje"],
  accessible: ["Mango","Sézane","Everlane"],
  niche:      ["Aeron","Loulou Studio","Bite Studios"],
};
