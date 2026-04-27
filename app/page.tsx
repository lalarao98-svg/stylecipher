// @ts-nocheck
"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Jost:wght@200;300;400;500;600&display=swap";

/* ─── PALETTE ─── */
const C = {
  white:     "#FFFFFF",
  cream:     "#F2EBE0",
  parchment: "#E8DDD0",
  bone:      "#DDD0B8",
  sand:      "#C8B898",
  taupe:     "#8A7A68",
  stone:     "#6A5A4A",
  umber:     "#4A3828",
  espresso:  "#221516",
  burgundy:  "#3B0510",
  wine:      "#6B1E2E",
  chocolate: "#4A2318",
  blue:      "#4A6B8A",
  blueDark:  "#2C4A63",
  olive:     "#5A6012",
  gold:      "#A87828",
  goldLight: "#C49838",
};

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'Jost', system-ui, sans-serif";

/* ─── ARCHETYPE COLORS (used for placeholder tiles) ─── */
const ARCH_COLORS = {
  "1a":"#7A8B9A","1b":"#9B8B76","1c":"#5A5A5A","1d":"#6A7A8A",
  "2a":"#8B5A5A","2b":"#4A6A4A","2c":"#9B7A5A","2d":"#7A6B4A",
  "3a":"#6B7A8B","3b":"#3A3A3A","3c":"#8B7A6B",
  "4a":"#B8887A","4b":"#6A3A7A","4c":"#B87090","4d":"#7A5A8B",
  "5a":"#9B6A4A","5b":"#8B5A3A","5c":"#B87A3A",
  "6a":"#6A8A8B","6b":"#6A7A5A","6c":"#7A6B5A",
  "7a":"#8A8AAA","7b":"#4A5A6A","7c":"#5A8A5A",
  "8a":"#6A7A4A","8b":"#6B4A2A","8c":"#B83A4A",
  "9a":"#9B6A2A","9b":"#8B7A6A","9c":"#B86A8A","9d":"#B83A3A",
  "10a":"#3A3A4A","10b":"#8B2A2A","10c":"#5A3A7A","10d":"#2A2A4A",
  "11a":"#7A6A5A","11b":"#B85A2A","11c":"#5A2AB8",
};

const KIBBE_COLORS = {
  Dramatic:"#3A4A6B", SoftDramatic:"#6B3A5D", Classic:"#8B6F47",
  SoftClassic:"#C4948A", DramaticClassic:"#6B7A8D", Natural:"#7A9A6D",
  SoftNatural:"#B87333", FlamboyantNatural:"#A0522D", Romantic:"#C4616C",
  TheatricalRomantic:"#9B4DCA", Gamine:"#5A8F8F", SoftGamine:"#E0829B",
  FlamboyantGamine:"#2C3E50",
};

/* ─── COLOR TILE (replaces images) ─── */
function ColorTile({ color, width = "100%", height = 120, style = {}, children }) {
  return (
    <div style={{
      width, height,
      background: color || C.bone,
      position: "relative",
      flexShrink: 0,
      overflow: "hidden",
      ...style,
    }}>
      {/* Subtle noise texture via gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 40%, ${color}CC 0%, ${color}88 60%, ${color}44 100%)`,
        mixBlendMode: "multiply",
      }}/>
      {children}
    </div>
  );
}

/* ─── DATA ─── */
const ARCHETYPES = {
  "1a":{ name:"Scandi Minimalist",   family:"Minimalist", desc:"Relaxed, oat/stone/navy, thrown-on precision. Toteme, COS." },
  "1b":{ name:"Quiet Luxury",         family:"Minimalist", desc:"Architectural cashmere, exact proportions. The Row, Khaite." },
  "1c":{ name:"Japanese Minimalist",  family:"Minimalist", desc:"Volume play, dropped shoulders, matte textures. Lemaire." },
  "1d":{ name:"Modern Minimalist",    family:"Minimalist", desc:"Clean lines with softness. Phoebe-era Celine." },
  "2a":{ name:"Parisian Classic",     family:"Classic",    desc:"Breton, trench, cigarette pant, effortlessly undone." },
  "2b":{ name:"Ivy / American",       family:"Classic",    desc:"Tailored blazers, oxfords, heritage colours. Ralph Lauren." },
  "2c":{ name:"Modern Classic",       family:"Classic",    desc:"Camel coat, cashmere crew, neutral spectrum. Max Mara." },
  "2d":{ name:"Heritage / Country",   family:"Classic",    desc:"Waxed jackets, tweed, olive and oxblood. Barbour." },
  "3a":{ name:"Menswear-Inspired",    family:"Tailored",   desc:"Oversized blazer, wide-leg, tucked shirt." },
  "3b":{ name:"Sharp Power Suit",     family:"Tailored",   desc:"Nipped waist, sharp shoulder, authority coded. Mugler." },
  "3c":{ name:"Soft Tailoring",       family:"Tailored",   desc:"Unstructured blazer, fluid pant. Gabriela Hearst." },
  "4a":{ name:"Ethereal Romantic",    family:"Romantic",   desc:"Tiered, prairie, cotton voile. Zimmermann, Doen." },
  "4b":{ name:"Dark Romantic",        family:"Romantic",   desc:"Volume, asymmetry, black florals. Simone Rocha." },
  "4c":{ name:"Girlcore / Coquette",  family:"Romantic",   desc:"Bows, babydoll, balletcore. Sandy Liang, Miu Miu." },
  "4d":{ name:"Old Hollywood",        family:"Romantic",   desc:"Bias cut, mermaid, champagne. Oscar de la Renta." },
  "5a":{ name:"70s Boho Revival",     family:"Bohemian",   desc:"Maxi, suede, fringe, rust and gold. Chloé." },
  "5b":{ name:"Artisan Craft",        family:"Bohemian",   desc:"Handwoven, embroidered, terracotta. Ulla Johnson." },
  "5c":{ name:"Festival",             family:"Bohemian",   desc:"Crochet, flutter sleeves, sunset tones." },
  "6a":{ name:"Coastal Grandmother",  family:"Natural",    desc:"Wide-leg linen, oversized knit. Nili Lotan." },
  "6b":{ name:"Earth Mother",         family:"Natural",    desc:"Draped unstructured, oat and moss. Eileen Fisher." },
  "6c":{ name:"Americana Casual",     family:"Natural",    desc:"Denim, chambray, tees, clogs. Madewell." },
  "7a":{ name:"Elevated Sport",       family:"Sporty",     desc:"Leggings, tennis skirts, Pilates-to-brunch. Alo." },
  "7b":{ name:"Techwear",             family:"Sporty",     desc:"Shells, cargos, taped seams. Arc'teryx." },
  "7c":{ name:"Preppy Sport",         family:"Sporty",     desc:"Polos, tennis dresses, kelly green. Lacoste." },
  "8a":{ name:"Old Money",            family:"Preppy",     desc:"Cable knits, pleated skirts, Nantucket." },
  "8b":{ name:"Dark Academia",        family:"Preppy",     desc:"Tweed, turtlenecks, oxford shoes. Massimo Dutti." },
  "8c":{ name:"Modern Preppy",        family:"Preppy",     desc:"Rugby shirts, chinos, quilted jackets. J.Crew." },
  "9a":{ name:"70s Vintage",          family:"Vintage",    desc:"Flares, high-waist, pussybow, mustard." },
  "9b":{ name:"90s Minimalism",       family:"Vintage",    desc:"Slip dress, tank, low-rise, nude. CK archive." },
  "9c":{ name:"Y2K",                  family:"Vintage",    desc:"Low-rise, baby tee, rhinestones. Blumarine." },
  "9d":{ name:"Rockabilly",           family:"Vintage",    desc:"Circle skirts, halters, red lip, polka dots." },
  "10a":{ name:"Gothic / Rick Owens", family:"Edgy",       desc:"Drapey asymmetric, all-black, architectural." },
  "10b":{ name:"Punk / Hardcore",     family:"Edgy",       desc:"Tartan, studs, safety pins. Vivienne Westwood." },
  "10c":{ name:"Moto / Hardware",     family:"Edgy",       desc:"Leather jacket, skinny jean, band tee. Acne." },
  "10d":{ name:"Avant-Garde",         family:"Edgy",       desc:"Unfinished edges, exposed seams. Margiela." },
  "11a":{ name:"Luxury Streetwear",   family:"Streetwear", desc:"Oversized hoodie, drop-crotch. Fear of God." },
  "11b":{ name:"Skate Street",        family:"Streetwear", desc:"Baggy pant, graphic tee, skate sneaker. Stüssy." },
  "11c":{ name:"Hype / Collector",    family:"Streetwear", desc:"Sneaker-first, drops, collabs. Supreme." },
};

const BRANDS = {
  "1b":{ investment:["The Row","Khaite","Loro Piana"],          mid:["Toteme","Vince","Nili Lotan"],              accessible:["Quince","Everlane","Banana Republic"],       niche:["Bite Studios","Arjé","Loulou Studio"] },
  "2a":{ investment:["Saint Laurent","Isabel Marant"],           mid:["Sandro","Maje","Ba&sh","Claudie Pierlot"],   accessible:["Sézane","Rouje","& Other Stories"],          niche:["Musier Paris","Réalisation Par"] },
  "1a":{ investment:["Toteme","Filippa K","Aeron"],              mid:["COS","& Other Stories","Arket"],             accessible:["Mango","Everlane","Quince"],                  niche:["Auralee","Baserange","Loulou Studio"] },
  "4a":{ investment:["Zimmermann","Cecilie Bahnsen","Ulla Johnson"], mid:["Doen","LoveShackFancy","Three Graces"], accessible:["Reformation","For Love & Lemons"],            niche:["Mille","Atelier Dré"] },
  "10c":{ investment:["Acne Studios","Saint Laurent"],           mid:["Anine Bing","AllSaints","Rag & Bone"],       accessible:["H&M","Zara","ASOS"],                         niche:["Deadwood","Understated Leather"] },
  "8b":{ investment:["Burberry","Ralph Lauren Collection"],       mid:["Massimo Dutti","Sandro","Club Monaco"],      accessible:["J.Crew","L.L.Bean","Eddie Bauer"],           niche:["Alex Mill","Drake's Women's"] },
  "5a":{ investment:["Chloé","Isabel Marant","Ulla Johnson"],    mid:["Ba&sh","Free People Elevated"],              accessible:["Free People","Anthropologie","Spell"],       niche:["Cleobella","Natalie Martin"] },
  "3a":{ investment:["Jacquemus","Ami Paris","The Frankie Shop"],mid:["Anine Bing","Rag & Bone","Nili Lotan"],      accessible:["Mango","H&M Studio","Zara"],                 niche:["Bianca Saunders","Tibi"] },
  "2c":{ investment:["Max Mara","Loro Piana","Akris"],           mid:["Theory","Vince","Lafayette 148"],            accessible:["Banana Republic","Talbots","Quince"],        niche:["Apiece Apart","Wren + Glory"] },
  "4c":{ investment:["Miu Miu","Simone Rocha","Sandy Liang"],    mid:["Ganni","Shrimps","House of Sunny"],          accessible:["ASOS Design","Zara","Urban Outfitters"],     niche:["Shushu/Tong","Batsheva","Selkie"] },
};
const DEFAULT_BRANDS = {
  investment:["The Row","Isabel Marant","Toteme"],
  mid:["Sandro","Ba&sh","Maje"],
  accessible:["Mango","Sézane","Everlane"],
  niche:["Aeron","Loulou Studio","Bite Studios"],
};

const KIBBE = {
  Dramatic:         { short:"Sharp Yang",       desc:"Long, angular, narrow. Strong vertical lines.",      sil:["Column Dress","Straight-Leg Trouser","Sharp Blazer","Long Coat"],              fab:["Crisp linen","Gabardine","Heavy silk","Leather"],      neck:["V-neck","Asymmetric","High collar","Square"],      avoid:["Ruffles","Clingy jersey","Rounded shapes"],  jewel:"Long pendants, geometric earrings, angular cuffs" },
  SoftDramatic:     { short:"Yang + Curves",    desc:"Bold bone structure draped in soft flesh.",          sil:["Wrap Dress","Wide-Leg + Fitted Top","Draped Gown","Plunge Neckline"],          fab:["Flowing silk","Jersey","Soft leather","Chiffon"],     neck:["Deep V","Cowl","Off-shoulder","Sweetheart"],       avoid:["Boxy shapes","Stiff fabrics","Small prints"],jewel:"Bold statement pieces, large hoops, dramatic pendants" },
  Classic:          { short:"Balanced",         desc:"Perfectly balanced yin and yang.",                   sil:["Sheath Dress","A-Line Skirt","Tailored Blazer","Straight Trouser"],            fab:["Medium wool","Silk blend","Cotton twill"],             neck:["Crew","Boat","Moderate V","Round"],                avoid:["Extremes","Very trendy","Very casual"],       jewel:"Understated quality. Pearl studs, delicate chains" },
  SoftClassic:      { short:"Balanced + Soft",  desc:"Classic balance with added softness.",               sil:["Soft A-Line","Wrap Dress","Rounded Blazer","Pencil Skirt"],                   fab:["Cashmere","Silk crepe","Soft knit"],                   neck:["Scoop","Soft V","Round","Draped"],                 avoid:["Sharp edges","Oversized","Bold geometrics"], jewel:"Soft gold, pearls, rounded shapes" },
  DramaticClassic:  { short:"Balanced + Sharp", desc:"Classic balance with angular edge.",                 sil:["Structured Sheath","Tailored Pants","Crisp Shirt","Angular Shift"],           fab:["Crisp cotton","Structured silk","Light wool"],        neck:["Square","High round","Notch collar"],              avoid:["Overly drapey","Ruffles","Unstructured"],    jewel:"Architectural pieces, clean geometric, polished metal" },
  Natural:          { short:"Soft Yang",        desc:"Broad, blunt bone structure. Athletic.",             sil:["T-Shirt Dress","Straight Jeans","Soft Blazer","Tunic Top"],                   fab:["Denim","Raw cotton","Suede","Nubby knits"],            neck:["Open crew","Scoop","Boat","V-neck"],               avoid:["Overly fitted","Fussy details"],              jewel:"Organic shapes, matte metals, leather, natural stone" },
  SoftNatural:      { short:"Soft Yang + Yin",  desc:"Broad blunt frame with soft body.",                 sil:["Wrap Dress","Wide-Leg Pant","Off-Shoulder Top","A-Line Midi"],                fab:["Soft cotton","Drapey jersey","Light linen"],          neck:["Scoop","Off-shoulder","Wide V","Boat"],            avoid:["Bodycon","Sharp tailoring","Very ornate"],   jewel:"Warm metals, organic shapes, medium scale" },
  FlamboyantNatural:{ short:"Bold Soft Yang",   desc:"Broad and angular with strong vertical.",            sil:["Palazzo Pants","Oversized Blazer","Maxi Dress","Long Scarf Layer"],           fab:["Heavy cotton","Coarse linen","Thick knits"],          neck:["Deep open","Wide scoop","Off-shoulder"],           avoid:["Delicate fabrics","Very fitted","Short hems"],jewel:"Bold, oversized, chunky, ethnic-inspired" },
  Romantic:         { short:"Full Yin",         desc:"Soft, rounded, lush curves. Everything flows.",     sil:["Hourglass Dress","Peplum Top","Pencil Skirt","Sweetheart Dress"],            fab:["Silk","Velvet","Lace","Chiffon"],                      neck:["Sweetheart","Scoop","Off-shoulder","Round"],       avoid:["Sharp angles","Oversized","Stiff fabrics"],  jewel:"Ornate, rounded, sparkly. Rose gold, pearls, vintage" },
  TheatricalRomantic:{ short:"Yin + Sharp",     desc:"Romantic softness with dramatic sharpness.",        sil:["Corset-Style Top","Fitted Mini","High-Low Dress","Bold Neckline"],            fab:["Embellished silk","Sequins","Rich lace"],             neck:["Sweetheart","Halter","Deep V","Corset"],           avoid:["Oversized","Casual/sporty","Plain fabrics"],  jewel:"Lavish, sparkly, statement. Chandelier earrings" },
  Gamine:           { short:"Compact Contrast", desc:"Compact mix. Youthful, playful, energetic.",        sil:["Cropped Jacket","Mini Skirt","Fitted Pants","Peter Pan Collar"],              fab:["Crisp cotton","Light denim","Polished knit"],         neck:["Peter Pan","Crew","Bateau","Round collar"],        avoid:["Long flowing","Oversized","Heavy draping"],  jewel:"Fun, compact, mixed metals, playful studs" },
  SoftGamine:       { short:"Compact + Soft",   desc:"Petite compact with softness.",                     sil:["Fit-and-Flare","Puff Sleeves","High-Waist Skirt","Cropped Cardigan"],         fab:["Soft knits","Eyelet","Light cotton"],                 neck:["Scoop","Round","Sweetheart","Puff collar"],        avoid:["Long flowing","Oversized","Sharp tailoring"],jewel:"Cute, small, playful. Studs, delicate chains, charms" },
  FlamboyantGamine: { short:"Compact + Angular","desc":"Petite compact with angularity.",                 sil:["Shift Mini Dress","Slim Pants","Cropped Moto","Color Block"],                 fab:["Structured denim","Leather","Crisp cotton"],         neck:["Angular V","Square","High neck","Asymmetric"],     avoid:["Long flowing","Soft draping","Ornate details"],jewel:"Geometric, edgy, mixed metals, bold studs" },
};

const SEASONS = {
  BrightSpring: { fam:"Spring",  label:"Bright Spring",  sub:"Bright + Warm",  pal:["#FF6B35","#FFC857","#2EC4B6","#E71D36","#FF9F1C","#44AF69","#F15BB5","#00BBF9"], neut:["#FFFCF2","#5D4037","#212121"], metals:"Bright gold, rose gold",          avoid:"Muted, dusty, very dark",        desc:"Clear vivid saturated warm" },
  TrueSpring:   { fam:"Spring",  label:"True Spring",    sub:"Warm + Bright",  pal:["#E8871E","#D4A03C","#7CB342","#FF7043","#FFB300","#689F38","#F4511E","#FDD835"], neut:["#FFF8E1","#795548","#3E2723"], metals:"Yellow gold, copper, bronze",     avoid:"Cool, icy, muted",               desc:"Intensely warm and saturated" },
  LightSpring:  { fam:"Spring",  label:"Light Spring",   sub:"Light + Warm",   pal:["#FFB3BA","#FFDFBA","#BAFFC9","#BAE1FF","#FFE4B5","#FFDAB9","#E6E6FA","#FFF0DB"], neut:["#FFFEF7","#C4A882","#8B7D6B"], metals:"Light gold, rose gold",           avoid:"Dark, heavy, very saturated",    desc:"Warm delicate pastels" },
  LightSummer:  { fam:"Summer",  label:"Light Summer",   sub:"Light + Cool",   pal:["#B2DFDB","#F8BBD0","#B3E5FC","#D1C4E9","#DCEDC8","#FFE0B2","#F0F4C3","#CFD8DC"], neut:["#FAFAFA","#9E9E9E","#607D8B"], metals:"Silver, white gold, platinum",    avoid:"Dark, warm, highly saturated",   desc:"Cool light gentle" },
  TrueSummer:   { fam:"Summer",  label:"True Summer",    sub:"Cool + Muted",   pal:["#7986CB","#4DB6AC","#F48FB1","#81D4FA","#A1887F","#90A4AE","#CE93D8","#80CBC4"], neut:["#ECEFF1","#78909C","#455A64"], metals:"Silver, pewter",                  avoid:"Warm, bright, intense",          desc:"Cool and toned down" },
  SoftSummer:   { fam:"Summer",  label:"Soft Summer",    sub:"Muted + Cool",   pal:["#A0AEC0","#B2A4D4","#9DB5B2","#C9A0A0","#A8B8A0","#B0B0C0","#C4B0A0","#90A0A0"], neut:["#F0EDE8","#8B8680","#5A5550"], metals:"Brushed silver, pewter",          avoid:"Bright, warm, high-contrast",    desc:"Extremely soft muted" },
  SoftAutumn:   { fam:"Autumn",  label:"Soft Autumn",    sub:"Muted + Warm",   pal:["#C9B89A","#A6927A","#8BA089","#C7A78E","#B8A090","#9CAF88","#C4956A","#A0B0A0"], neut:["#F5F0E8","#8B7E6B","#4A4035"], metals:"Antique gold, brushed gold",      avoid:"Bright, cool, high-contrast",    desc:"Muted earthy warmth" },
  TrueAutumn:   { fam:"Autumn",  label:"True Autumn",    sub:"Warm + Muted",   pal:["#BF6415","#C4882B","#6B7F2A","#8B4513","#D4A03C","#A0522D","#CC7722","#556B2F"], neut:["#FFF5E6","#6B4226","#3B2716"], metals:"Yellow gold, bronze, copper",     avoid:"Cool, bright, pastel",           desc:"Rich warm earthy harvest" },
  DarkAutumn:   { fam:"Autumn",  label:"Dark Autumn",    sub:"Dark + Warm",    pal:["#8B0000","#2F4F4F","#8B4513","#556B2F","#800020","#704214","#3B5323","#6B3A2A"], neut:["#D4C4A8","#5A4A3A","#2A1F14"], metals:"Antique gold, bronze, dark copper",avoid:"Light pastels, cool brights",    desc:"Deep rich warm" },
  BrightWinter: { fam:"Winter",  label:"Bright Winter",  sub:"Bright + Cool",  pal:["#E91E63","#2196F3","#00BCD4","#FF5722","#9C27B0","#4CAF50","#FF1744","#651FFF"], neut:["#FFFFFF","#424242","#000000"], metals:"Bright silver, platinum",         avoid:"Muted, dusty, warm",             desc:"Vivid cool electric" },
  TrueWinter:   { fam:"Winter",  label:"True Winter",    sub:"Cool + Bright",  pal:["#D32F2F","#1976D2","#7B1FA2","#00897B","#C2185B","#303F9F","#00695C","#AD1457"], neut:["#FFFFFF","#616161","#000000"], metals:"Silver, platinum, chrome",        avoid:"Warm, muted, earthy",            desc:"Icy bold maximum contrast" },
  DarkWinter:   { fam:"Winter",  label:"Dark Winter",    sub:"Dark + Cool",    pal:["#880E4F","#1A237E","#004D40","#4A148C","#B71C1C","#0D47A1","#1B5E20","#311B92"], neut:["#F5F5F5","#424242","#0D0D0D"], metals:"Silver, gunmetal",                avoid:"Light pastels, warm/muted",      desc:"Deep cool dramatic" },
};
const SFAM = { Spring:"#C4882B", Summer:"#5A7A9B", Autumn:"#8B5A1A", Winter:"#2A4A7A" };

/* ─── QUIZ DATA ─── */
const KQ=[
  {cat:"Bone Structure",q:"Your vertical line — overall height impression?",opts:[{l:"Long and narrow — I look taller than I am",sc:{D:3,SD:2,FN:2}},{l:"Moderately long, slightly broad",sc:{FN:3,N:2}},{l:"Moderate — balanced, neither long nor short",sc:{C:3,DC:2,SC:2}},{l:"Small and compact with some width",sc:{SG:2,G:2,FG:2}},{l:"Short and soft/rounded",sc:{R:3,TR:2,SG:1}}]},
  {cat:"Bone Structure",q:"Your shoulders?",opts:[{l:"Narrow, sharp, angular",sc:{D:3,DC:2,FG:2}},{l:"Broad, blunt, slightly wide",sc:{N:3,SN:3,FN:2}},{l:"Moderate, even, balanced",sc:{C:3,SC:1,DC:1}},{l:"Sloped, rounded, tapered",sc:{R:3,SC:2,TR:1}},{l:"Sharp but small/narrow frame",sc:{TR:3,FG:2,G:1}}]},
  {cat:"Bone Structure",q:"Arms and legs relative to height?",opts:[{l:"Long, narrow, elongated",sc:{D:3,SD:2,FN:1}},{l:"Long but slightly wide",sc:{FN:3,N:2}},{l:"Moderate length, proportional",sc:{C:3,DC:1,SC:1}},{l:"Short relative to torso, slightly wide",sc:{SG:2,R:2,SN:1}},{l:"Small, delicate, petite",sc:{G:2,TR:2,SG:2}}]},
  {cat:"Bone Structure",q:"Hands and feet?",opts:[{l:"Long, narrow, elegant",sc:{D:3,SD:1,FN:1}},{l:"Large, broad, wide",sc:{N:3,FN:2,SN:1}},{l:"Moderate, proportional",sc:{C:3,DC:1,SC:1}},{l:"Small, slightly wide or fleshy",sc:{R:2,SN:1,SG:1}},{l:"Small, narrow, delicate",sc:{TR:2,G:2,FG:2}}]},
  {cat:"Body Flesh",q:"Overall body shape/silhouette?",opts:[{l:"Long, lean, straight — minimal curves",sc:{D:3,FG:2,FN:1}},{l:"Broad, muscular-leaning, strong frame",sc:{N:3,FN:2}},{l:"Moderate, balanced proportions",sc:{C:3,DC:2}},{l:"Soft, slightly curvy, rounded edges",sc:{SC:2,SN:2,SG:2}},{l:"Very curvy, hourglass, lush",sc:{R:3,SD:3,TR:2}}]},
  {cat:"Body Flesh",q:"Bust line / upper torso?",opts:[{l:"Flat to moderate, taut",sc:{D:3,FG:2,G:1}},{l:"Moderate, wide across chest",sc:{N:2,FN:2,C:1}},{l:"Moderate, balanced",sc:{C:2,DC:2,SC:1}},{l:"Full, rounded, curved",sc:{R:3,SD:2,SN:1}},{l:"Full relative to frame, prominent",sc:{TR:3,SD:2,SG:1}}]},
  {cat:"Body Flesh",q:"Waist definition?",opts:[{l:"Elongated, not very defined",sc:{D:3,FN:2,FG:1}},{l:"Moderate, slightly defined",sc:{C:2,N:2,DC:1}},{l:"Defined, visible waistline",sc:{SC:2,SN:2,G:1}},{l:"Very defined, cinched, hourglass",sc:{R:3,TR:3,SD:2}},{l:"Short-waisted, compact",sc:{SG:2,G:2}}]},
  {cat:"Body Flesh",q:"Hip line?",opts:[{l:"Narrow, straight, tapered",sc:{D:3,FG:2}},{l:"Moderate, slightly straight",sc:{C:2,N:2,DC:1,FN:1}},{l:"Rounded, slightly wide, soft",sc:{SC:2,SN:2,SG:1}},{l:"Very rounded, full, curved",sc:{R:3,SD:2,TR:2}},{l:"Wide relative to frame / compact",sc:{SG:2,G:1}}]},
  {cat:"Body Flesh",q:"Overall flesh / body texture?",opts:[{l:"Taut, lean",sc:{D:3,FG:2,DC:1}},{l:"Muscular / firm",sc:{N:2,FN:2}},{l:"Moderate, even",sc:{C:2,DC:1}},{l:"Soft, fleshy, rounded even when thin",sc:{R:3,SN:3,SC:2,SD:2,SG:1}},{l:"Slight, delicate flesh",sc:{TR:2,G:2}}]},
  {cat:"Facial Features",q:"Jawline and chin?",opts:[{l:"Sharp, angular, prominent jawline",sc:{D:3,DC:2,FG:2}},{l:"Broad, blunt, wide jaw",sc:{N:3,FN:2,SN:1}},{l:"Moderate, balanced, even",sc:{C:3,SC:1}},{l:"Round, soft, tapered",sc:{R:3,SC:2,SG:1}},{l:"Delicate, small, slightly sharp",sc:{TR:3,G:2}}]},
  {cat:"Facial Features",q:"Cheekbones?",opts:[{l:"Prominent, angular, high and sharp",sc:{D:3,DC:2,TR:1}},{l:"Wide, broad, blunt",sc:{N:2,FN:2,SN:1}},{l:"Moderate, symmetrical",sc:{C:3,SC:1}},{l:"Round, full, fleshy",sc:{R:3,SN:1,SG:1}},{l:"Delicate, small, slightly defined",sc:{G:2,FG:2,TR:1}}]},
  {cat:"Facial Features",q:"Eyes?",opts:[{l:"Narrow, straight, small, closely set",sc:{D:3,DC:1}},{l:"Moderate to large, wide-set",sc:{N:2,FN:1,SN:1}},{l:"Moderate, evenly spaced, balanced",sc:{C:3,SC:1}},{l:"Large, round, luminous",sc:{R:3,SG:2,TR:1}},{l:"Large and vivid OR small and bright",sc:{TR:2,G:2,FG:1,SD:1}}]},
  {cat:"Facial Features",q:"Lips?",opts:[{l:"Thin, straight, narrow",sc:{D:3,DC:1,FG:1}},{l:"Moderate, straight, neither full nor thin",sc:{C:2,N:2}},{l:"Moderate, slightly full, soft",sc:{SC:2,SN:1}},{l:"Full, round, lush",sc:{R:3,SD:2,SG:1}},{l:"Full for face size",sc:{TR:3,G:1}}]},
  {cat:"Facial Features",q:"Nose?",opts:[{l:"Narrow, sharp, prominent",sc:{D:3,DC:1}},{l:"Broad, blunt, wide",sc:{N:3,FN:1,SN:1}},{l:"Moderate, balanced",sc:{C:3,SC:1}},{l:"Round, small, soft tip",sc:{R:2,SG:2}},{l:"Small, delicate, refined",sc:{TR:2,G:2,FG:1}}]},
];
const SQ=[
  {q:"Which metal looks best against your skin?",opts:[{l:"Gold / rose gold",sc:{warm:3}},{l:"Silver / platinum",sc:{cool:3}},{l:"Both work equally",sc:{warm:1,cool:1}}]},
  {q:"Vein colour on inner wrist?",opts:[{l:"Green / olive tones",sc:{warm:2}},{l:"Blue / purple tones",sc:{cool:2}},{l:"Mix of both",sc:{warm:1,cool:1}}]},
  {q:"Natural hair colour?",opts:[{l:"Golden blonde / strawberry / auburn",sc:{warm:2,light:1}},{l:"Ash blonde / mouse brown / cool brown",sc:{cool:2,light:1}},{l:"Dark brown / black with warm undertone",sc:{warm:1,dark:2}},{l:"Dark brown / black with cool undertone",sc:{cool:1,dark:2}},{l:"Red / copper",sc:{warm:3}}]},
  {q:"Eye colour and pattern?",opts:[{l:"Warm brown / hazel / amber / green-gold",sc:{warm:2}},{l:"Cool blue / grey / steel green / dark brown-black",sc:{cool:2}},{l:"Bright and vivid — high contrast with whites",sc:{bright:3}},{l:"Soft and muted — gentle, low contrast",sc:{muted:3}}]},
  {q:"Skin tone depth?",opts:[{l:"Fair / light",sc:{light:3}},{l:"Light-medium",sc:{light:1,medium:1}},{l:"Medium",sc:{medium:2}},{l:"Medium-deep / olive",sc:{dark:1,medium:1}},{l:"Deep / dark",sc:{dark:3}}]},
  {q:"Pure white vs off-white near your face?",opts:[{l:"Pure bright white looks great",sc:{cool:2,bright:1}},{l:"Off-white / cream / ivory is better",sc:{warm:2}},{l:"Soft muted tones suit me more",sc:{muted:2}},{l:"I need high contrast",sc:{bright:2,dark:1}}]},
  {q:"Bright saturated colours on you?",opts:[{l:"They energise my face — I come alive",sc:{bright:3}},{l:"They overwhelm me — too much",sc:{muted:3}},{l:"Warm brights yes, cool brights no",sc:{warm:1,bright:1}},{l:"Cool brights yes, warm brights no",sc:{cool:1,bright:1}}]},
  {q:"Earth tones on you?",opts:[{l:"Rich and grounded — they complement me",sc:{warm:2,muted:1}},{l:"Washed out or sallow",sc:{cool:2,bright:1}},{l:"Okay but lighter versions are better",sc:{light:2}}]},
  {q:"Contrast between hair, skin, and eyes?",opts:[{l:"High contrast — very vivid features",sc:{bright:2,dark:1}},{l:"Low contrast — everything similar depth",sc:{muted:2,light:1}},{l:"Medium contrast",sc:{medium:1}}]},
  {q:"Overall colouring impression?",opts:[{l:"Fresh and warm — sunny golden glow",sc:{warm:3}},{l:"Cool and gentle — soft silvery quality",sc:{cool:2,muted:1}},{l:"Rich and warm — deep earthy grounded",sc:{warm:2,dark:2}},{l:"Vivid and cool — dramatic clear striking",sc:{cool:2,bright:2}},{l:"Soft and blended — muted, nothing pops",sc:{muted:3}}]},
];
const AQ=[
  {q:"When you walk into a furniture store, which piece pulls you first?",opts:[{l:"A heavy walnut library desk with brass hardware",sig:{"8b":0.5,"2d":0.3,"2b":0.2}},{l:"A cream bouclé armchair with rounded arms",sig:{"4a":0.4,"1b":0.4,"2c":0.2}},{l:"A black Barcelona chair on a concrete floor",sig:{"10a":0.4,"1c":0.4,"3b":0.2}},{l:"An oak mid-century credenza with tapered legs",sig:{"1a":0.5,"1d":0.3,"9b":0.2}}]},
  {q:"Pick a Saturday morning.",opts:[{l:"Farmers market in wide-leg linen and clogs",sig:{"6a":0.4,"6b":0.3,"6c":0.3}},{l:"Gallery opening, then natural wine bar",sig:{"1d":0.4,"3a":0.3,"1c":0.3}},{l:"Flea market hunting for vintage",sig:{"5a":0.3,"9a":0.3,"9b":0.2,"10c":0.2}},{l:"Tennis, then brunch with the girls",sig:{"7c":0.4,"8a":0.3,"8c":0.3}}]},
  {q:"Which coat do you reach for first every autumn?",opts:[{l:"Camel wool, past-the-knee, belt tied at back",sig:{"2c":0.4,"1b":0.3,"2a":0.3}},{l:"Vintage leather moto jacket",sig:{"10c":0.5,"9b":0.3,"4c":0.2}},{l:"Barbour waxed with plaid lining",sig:{"2d":0.6,"8a":0.3,"2b":0.1}},{l:"Oversized menswear blazer as outerwear",sig:{"3a":0.5,"1d":0.3,"3c":0.2}}]},
  {q:"Your jewellery box leans toward:",opts:[{l:"Chunky gold chains, vintage signet ring, pearl earrings",sig:{"2a":0.4,"9b":0.3,"2c":0.3}},{l:"Silver hoops, layered delicate chains, one signature ring",sig:{"1a":0.4,"1b":0.3,"1d":0.3}},{l:"Statement drop earrings, cocktail rings, velvet chokers",sig:{"4d":0.4,"4b":0.3,"9a":0.3}},{l:"Barely anything. Small studs, thin watch, done.",sig:{"1c":0.4,"3b":0.3,"6b":0.3}}]},
  {q:"Pick your ideal hotel.",opts:[{l:"A 1920s Paris hotel with ornate mouldings and velvet",sig:{"2a":0.3,"4d":0.3,"9a":0.2,"4b":0.2}},{l:"A Cotswolds manor with tartan throws and a fireplace",sig:{"2d":0.4,"8a":0.3,"2b":0.3}},{l:"A Kyoto ryokan, minimalist tatami, outdoor onsen",sig:{"1c":0.6,"6b":0.3,"1a":0.1}},{l:"A whitewashed Mykonos villa, blue shutters, linen",sig:{"6a":0.5,"4a":0.3,"5c":0.2}}]},
  {q:"Shoes you reach for on a normal weekday.",opts:[{l:"Ballet flats or loafers",sig:{"2a":0.3,"4c":0.3,"8c":0.2,"2c":0.2}},{l:"Worn-in leather boots, ankle or knee-high",sig:{"10c":0.4,"5a":0.3,"9a":0.3}},{l:"Fresh white sneakers or minimalist trainers",sig:{"1a":0.4,"1d":0.3,"6c":0.3}},{l:"Clogs or mules, Birkenstock-adjacent",sig:{"6a":0.4,"6b":0.3,"6c":0.3}}]},
  {q:"Which palette feels most like home?",opts:[{l:"Cream, camel, chocolate, ivory, soft grey",sig:{"1b":0.4,"2c":0.3,"1a":0.3}},{l:"Black, white, occasional burgundy or navy",sig:{"3b":0.3,"1c":0.3,"10a":0.2,"9b":0.2}},{l:"Rust, mustard, forest, oxblood, cream",sig:{"5a":0.3,"2d":0.3,"8b":0.2,"5b":0.2}},{l:"Pink, red, baby blue, cream, butter yellow",sig:{"4c":0.4,"4a":0.3,"9c":0.3}}]},
  {q:"Which bag style is yours?",opts:[{l:"Structured top-handle, maybe vintage Hermès or Polène",sig:{"2a":0.4,"2c":0.3,"1b":0.3}},{l:"Soft slouchy leather hobo, lived-in",sig:{"5a":0.4,"6a":0.3,"10c":0.3}},{l:"Tiny box bag, charm-covered, basically jewellery",sig:{"4c":0.5,"4d":0.3,"9c":0.2}},{l:"Canvas tote or technical cross-body",sig:{"6b":0.3,"7b":0.3,"1a":0.2,"11b":0.2}}]},
  {q:"Dress code says cocktail attire. You wear:",opts:[{l:"Little black silk slip with pointed heels",sig:{"9b":0.4,"1b":0.3,"3b":0.3}},{l:"Floral midi with puff sleeves and heeled sandals",sig:{"4a":0.5,"2a":0.3,"5a":0.2}},{l:"Vintage lace dress with satin heels and red lip",sig:{"4b":0.3,"4d":0.3,"9a":0.2,"9d":0.2}},{l:"Sharp tuxedo suit, no shirt, statement earrings",sig:{"3a":0.4,"3b":0.4,"10c":0.2}}]},
  {q:"Your relationship to trends:",opts:[{l:"I mostly ignore them. I know what works on me.",sig:{"2c":0.4,"1b":0.3,"2b":0.3}},{l:"I absorb them slowly, usually after they've settled",sig:{"1a":0.3,"2a":0.3,"1d":0.2,"3c":0.2}},{l:"I track them closely and commit quickly",sig:{"9c":0.3,"4c":0.3,"11b":0.2,"11c":0.2}},{l:"I actively resist them",sig:{"10a":0.3,"1c":0.3,"10d":0.2,"6b":0.2}}]},
  {q:"Fabric you love on your body:",opts:[{l:"Cashmere, silk crepe, heavy wool",sig:{"1b":0.4,"2c":0.3,"3c":0.3}},{l:"Denim, leather, waxed cotton",sig:{"10c":0.3,"6c":0.3,"2d":0.2,"11b":0.2}},{l:"Chiffon, lace, silk organza, ribbon detail",sig:{"4a":0.4,"4d":0.3,"4c":0.3}},{l:"Raw linen, thick knit, nubby wool",sig:{"6a":0.3,"6b":0.3,"1a":0.2,"5b":0.2}}]},
  {q:"A celebrity whose style you'd happily steal:",opts:[{l:"Carolyn Bessette-Kennedy",sig:{"1b":0.5,"2a":0.3,"9b":0.2}},{l:"Alexa Chung",sig:{"2a":0.3,"2b":0.3,"8b":0.2,"9a":0.2}},{l:"Zoë Kravitz",sig:{"3a":0.3,"10c":0.3,"1b":0.2,"9b":0.2}},{l:"Florence Welch",sig:{"4b":0.4,"5a":0.3,"4a":0.3}}]},
  {q:"Home decor vibe:",opts:[{l:"Neutral linens, natural wood, ceramic",sig:{"6a":0.3,"6b":0.3,"1a":0.2,"5b":0.2}},{l:"Chesterfield sofa, leather-bound books, Persian rug",sig:{"8b":0.4,"2d":0.3,"2b":0.3}},{l:"Mid-century leather, travertine table, art books",sig:{"1d":0.4,"1b":0.3,"9b":0.3}},{l:"Bold colour, maximalist art, velvet, brass",sig:{"4d":0.3,"9a":0.3,"4b":0.2,"5a":0.2}}]},
  {q:"Go-to top for a normal workday:",opts:[{l:"White button-down, sleeves rolled",sig:{"2a":0.3,"1b":0.2,"1d":0.2,"3a":0.3}},{l:"Cashmere crewneck in cream or camel",sig:{"2c":0.4,"1b":0.3,"8a":0.3}},{l:"Breton stripe tee",sig:{"2a":0.5,"6c":0.3,"8c":0.2}},{l:"Oversized vintage tee tucked into something",sig:{"10c":0.3,"9b":0.3,"6c":0.2,"11b":0.2}}]},
  {q:"The colour you wear most:",opts:[{l:"Black — everything is easier in black",sig:{"10a":0.3,"3b":0.3,"1c":0.2,"9b":0.2}},{l:"Cream / white / ivory / oatmeal",sig:{"1b":0.3,"6a":0.3,"1a":0.2,"2c":0.2}},{l:"Navy / grey / neutrals with structure",sig:{"2a":0.3,"2b":0.3,"2c":0.2,"3a":0.2}},{l:"Actual colour — rust, pink, green, red",sig:{"5a":0.3,"4c":0.3,"2b":0.2,"4d":0.2}}]},
  {q:"Someone describes your aesthetic in one word. You hope they say:",opts:[{l:"Refined",sig:{"1b":0.3,"2c":0.3,"1d":0.2,"2a":0.2}},{l:"Effortless",sig:{"2a":0.3,"1a":0.3,"6a":0.2,"1d":0.2}},{l:"Soft",sig:{"4a":0.3,"4c":0.3,"1b":0.2,"6a":0.2}},{l:"Cool",sig:{"10c":0.3,"3a":0.3,"11a":0.2,"9b":0.2}}]},
  {q:"Which of these would you never wear?",opts:[{l:"A floral prairie maxi dress",sig:{"4a":-0.4,"5a":-0.2,"5c":-0.2}},{l:"A leather moto jacket with distressed denim",sig:{"10c":-0.4,"10b":-0.2,"9b":-0.1,"11b":-0.1}},{l:"A minimalist grey sack dress, no accessories",sig:{"1c":-0.4,"1a":-0.2,"6b":-0.2}},{l:"A short pink babydoll dress with a bow",sig:{"4c":-0.5,"9c":-0.2,"4a":-0.1}}]},
  {q:"Pick your ideal city to live in.",opts:[{l:"Paris",sig:{"2a":0.4,"1b":0.3,"1d":0.3}},{l:"Copenhagen",sig:{"1a":0.5,"1c":0.3,"6b":0.2}},{l:"Tokyo",sig:{"1c":0.4,"10d":0.3,"11a":0.3}},{l:"Charleston or Savannah",sig:{"2b":0.3,"4a":0.3,"6a":0.2,"8a":0.2}}]},
  {q:"Pick a film where you loved the costumes.",opts:[{l:"Call Me By Your Name — 1980s Italy, linen, faded denim",sig:{"2a":0.3,"6a":0.3,"9a":0.2,"2c":0.2}},{l:"The Virgin Suicides — 70s suburban, prairie dresses",sig:{"4a":0.4,"5a":0.3,"9a":0.3}},{l:"The Matrix — all-black, leather, sharp sunglasses",sig:{"10a":0.4,"3b":0.3,"10d":0.3}},{l:"Atonement — 1930s English country house",sig:{"2d":0.3,"4d":0.3,"8a":0.2,"9b":0.2}}]},
  {q:"Pick the statement piece you most want to own.",opts:[{l:"A head-to-toe cashmere set that cost everything",sig:{"1b":0.6,"2c":0.3,"1a":0.1}},{l:"A vintage 70s YSL Le Smoking tuxedo",sig:{"3b":0.4,"9a":0.3,"10c":0.3}},{l:"A hand-embroidered Ulla Johnson gown",sig:{"5b":0.5,"4a":0.3,"5a":0.2}},{l:"A Simone Rocha dress with pearls sewn into the hem",sig:{"4b":0.5,"4a":0.3,"4d":0.2}}]},
  {q:"Your dream vacation wardrobe core piece:",opts:[{l:"Crisp white linen shirtdress",sig:{"6a":0.4,"2a":0.3,"1b":0.3}},{l:"Silk slip dress in cream",sig:{"9b":0.4,"1b":0.3,"4d":0.3}},{l:"Peasant blouse and long skirt",sig:{"5a":0.4,"5b":0.3,"4a":0.3}},{l:"Swim shorts and a vintage band tee",sig:{"10c":0.3,"6c":0.3,"11b":0.2,"9b":0.2}}]},
  {q:"Which designer's world do you want to live in?",opts:[{l:"The Row",sig:{"1b":0.6,"2c":0.2,"1a":0.2}},{l:"Ralph Lauren",sig:{"2b":0.4,"2d":0.3,"8a":0.3}},{l:"Chloé (Phoebe Philo era)",sig:{"5a":0.4,"1d":0.3,"5b":0.3}},{l:"Miu Miu (current)",sig:{"4c":0.4,"9c":0.3,"11c":0.3}}]},
  {q:"Accessory you always come back to:",opts:[{l:"A silk scarf — neck, hair, bag handle, anywhere",sig:{"2a":0.4,"2c":0.3,"2d":0.3}},{l:"Stacked bracelets or a chunky cuff",sig:{"5a":0.3,"6b":0.3,"5b":0.2,"10c":0.2}},{l:"A belt — it's always about the waist",sig:{"4b":0.3,"9d":0.3,"2a":0.2,"3b":0.2}},{l:"Sunglasses — they make the outfit",sig:{"10c":0.3,"1d":0.3,"3a":0.2,"11a":0.2}}]},
  {q:"How you want to walk into a room:",opts:[{l:"Quietly, polished, 'who is she'",sig:{"1b":0.4,"2c":0.3,"1a":0.3}},{l:"Sharp, noticed, in-control",sig:{"3b":0.4,"10c":0.3,"4d":0.3}},{l:"Soft, warm, approachable",sig:{"4a":0.4,"4c":0.3,"6a":0.3}},{l:"Cool, aloof, interesting",sig:{"10a":0.3,"1c":0.3,"10d":0.2,"11a":0.2}}]},
  {q:"Your closet's secret fantasy piece:",opts:[{l:"A custom-tailored suit",sig:{"3a":0.4,"3b":0.3,"2c":0.3}},{l:"A hand-beaded gown",sig:{"4d":0.5,"4b":0.3,"5b":0.2}},{l:"Vintage leather trench",sig:{"10c":0.4,"9b":0.3,"2a":0.3}},{l:"Floor-length hand-embroidered caftan",sig:{"5b":0.5,"5a":0.3,"4a":0.2}}]},
];
const SCORE_MAP={D:"Dramatic",SD:"SoftDramatic",C:"Classic",SC:"SoftClassic",DC:"DramaticClassic",N:"Natural",SN:"SoftNatural",FN:"FlamboyantNatural",R:"Romantic",TR:"TheatricalRomantic",G:"Gamine",SG:"SoftGamine",FG:"FlamboyantGamine"};

/* ─── ALGORITHMS ─── */
function updateW(w,sig,alpha){
  const n={...w};
  Object.entries(sig).forEach(([c,d])=>{n[c]=(n[c]||0)+alpha*d;if(n[c]<0)n[c]=0;});
  const t=Object.values(n).reduce((a,b)=>a+b,0);
  if(t>0)Object.keys(n).forEach(k=>{n[k]/=t;});
  return n;
}
function pickRound(w,used){
  const av=AQ.map((_,i)=>i).filter(i=>!used.includes(i));
  if(!av.length)return null;
  const sc=av.map(i=>{let s=0;AQ[i].opts.forEach(o=>{Object.entries(o.sig).forEach(([c,m])=>{const wc=w[c]||0;s+=Math.abs(m)*(wc+Math.abs(0.03-wc)*0.5);});});return{i,s:s+Math.random()*0.3};});
  return sc.sort((a,b)=>b.s-a.s)[0].i;
}
function stop(hist){
  if(hist.length<10)return false;if(hist.length>=20)return true;
  const top=(h,k)=>Object.entries(h).sort((a,b)=>b[1]-a[1]).slice(0,k).map(x=>x[0]);
  const cur=top(hist[hist.length-1],5);
  for(let i=1;i<=3;i++){
    const past=top(hist[hist.length-1-i],5);
    if(cur.join(",")!==past.join(","))return false;
    const md=Math.max(...cur.map(c=>Math.abs((hist[hist.length-1][c]||0)-(hist[hist.length-1-i][c]||0))));
    if(md>0.05)return false;
  }
  return true;
}
function families(w){
  const f={};
  Object.entries(w).forEach(([c,wt])=>{const a=ARCHETYPES[c];if(!a)return;f[a.family]=(f[a.family]||0)+wt;});
  return f;
}
function calcSeason(sc){
  const w=sc.warm||0,co=sc.cool||0,l=sc.light||0,d=sc.dark||0,m=sc.medium||0,b=sc.bright||0,mu=sc.muted||0;
  const iW=w>co;
  if(iW){if(b>=mu&&b>=3)return"BrightSpring";if(l>d&&l>m)return"LightSpring";if(mu>b){if(d>l)return"DarkAutumn";if(mu>=4)return"SoftAutumn";return"TrueAutumn";}if(d>l+2)return"DarkAutumn";if(d>l)return"TrueAutumn";return"TrueSpring";}
  else{if(b>=mu&&b>=3)return"BrightWinter";if(l>d&&l>m)return"LightSummer";if(mu>b){if(d>l)return"DarkWinter";if(mu>=4)return"SoftSummer";return"TrueSummer";}if(d>l+2)return"DarkWinter";if(d>l)return"TrueWinter";return"TrueSummer";}
}
function inferKibbe(m){
  const h=parseFloat(m.height)||0,bu=parseFloat(m.bust)||0,wa=parseFloat(m.waist)||0,hi=parseFloat(m.hips)||0;
  if(!h&&!bu)return null;
  let sc={};Object.keys(KIBBE).forEach(k=>sc[k]=0);
  if(h>=67){sc.Dramatic+=3;sc.SoftDramatic+=2;sc.FlamboyantNatural+=3;}
  else if(h>=64){sc.Classic+=2;sc.SoftClassic+=2;sc.DramaticClassic+=2;sc.Natural+=2;sc.SoftNatural+=2;}
  else{sc.Romantic+=2;sc.TheatricalRomantic+=2;sc.Gamine+=3;sc.SoftGamine+=3;sc.FlamboyantGamine+=3;}
  const av=(bu+hi)/2,wd=av-wa;
  if(wd>8){sc.Romantic+=3;sc.TheatricalRomantic+=2;sc.SoftDramatic+=2;}
  else if(wd>5){sc.SoftClassic+=2;sc.SoftNatural+=1;}
  else{sc.Dramatic+=2;sc.Natural+=2;sc.FlamboyantGamine+=1;}
  if(m.shoulderShape==="narrow"){sc.Dramatic+=2;sc.DramaticClassic+=1;}
  else if(m.shoulderShape==="wide"){sc.Natural+=3;sc.SoftNatural+=3;sc.FlamboyantNatural+=2;}
  if(m.bodyFlesh==="soft"){sc.Romantic+=2;sc.SoftNatural+=2;}
  else if(m.bodyFlesh==="lean"){sc.Dramatic+=2;}
  if(m.faceShape==="angular"){sc.Dramatic+=2;}
  else if(m.faceShape==="round"){sc.Romantic+=2;}
  const sorted=Object.entries(sc).sort((a,b)=>b[1]-a[1]);
  return{type:sorted[0][0],runner:sorted[1][0]};
}

/* ─── GLOBAL CSS ─── */
const CSS = `
@import url('${FONT_URL}');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;background:${C.white};overflow:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:${C.sand};}

.app{height:100vh;display:flex;flex-direction:column;font-family:${SANS};}

/* Header */
.hdr{height:52px;background:${C.white};border-bottom:1px solid ${C.bone};display:flex;align-items:center;padding:0 28px;flex-shrink:0;gap:0;}
.wordmark{font-family:${SERIF};font-weight:700;font-style:italic;font-size:20px;color:${C.espresso};letter-spacing:-0.01em;margin-right:36px;flex-shrink:0;}
.nav{display:flex;height:100%;border-right:1px solid ${C.bone};margin-right:24px;flex-shrink:0;}
.nav-btn{height:100%;padding:0 18px;border:none;background:transparent;font-family:${SANS};font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${C.taupe};border-bottom:2px solid transparent;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
.nav-btn:hover{color:${C.espresso};}
.nav-btn.on{color:${C.burgundy};border-bottom-color:${C.burgundy};}
.profile-chips{display:flex;gap:0;overflow:hidden;}
.chip-item{padding:0 14px;border-right:1px solid ${C.bone};display:flex;flex-direction:column;justify-content:center;}
.chip-label{font-family:${SANS};font-size:7px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:${C.taupe};margin-bottom:1px;}
.chip-val{font-family:${SERIF};font-style:italic;font-size:13px;line-height:1.1;}

/* Main layout */
.main{flex:1;display:flex;overflow:hidden;}

/* Left nav panel (Find My Type only) */
.left-panel{width:220px;flex-shrink:0;border-right:1px solid ${C.bone};background:${C.white};display:flex;flex-direction:column;overflow:hidden;}
.step-btn{display:flex;align-items:center;gap:12px;padding:18px 20px;border:none;background:transparent;cursor:pointer;border-bottom:1px solid ${C.bone};transition:background 0.15s;text-align:left;width:100%;}
.step-btn:hover{background:${C.cream};}
.step-btn.on{background:${C.cream};border-left:3px solid ${C.burgundy};}
.step-num{font-family:${SERIF};font-weight:300;font-style:italic;font-size:32px;color:${C.blue};opacity:0.5;line-height:1;flex-shrink:0;width:32px;}
.step-info{}
.step-title{font-family:${SANS};font-size:9px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${C.taupe};margin-bottom:2px;}
.step-val{font-family:${SERIF};font-style:italic;font-size:13px;color:${C.espresso};line-height:1.2;}
.step-pending{font-family:${SANS};font-size:10px;font-weight:300;color:${C.bone};}
.done-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-left:auto;}

/* Quiz content area */
.quiz-content{flex:1;overflow-y:auto;background:${C.cream};}

/* Style Guide layout */
.guide-layout{flex:1;display:grid;grid-template-columns:260px 1fr;overflow:hidden;}
.guide-left{border-right:1px solid ${C.bone};background:${C.white};overflow-y:auto;padding:28px 24px;}
.guide-right{overflow-y:auto;padding:36px 40px;background:${C.cream};}

/* Style Me layout */
.styleme-layout{flex:1;display:grid;grid-template-columns:200px 1fr;overflow:hidden;}
.styleme-sidebar{border-right:1px solid ${C.bone};background:${C.white};overflow-y:auto;padding:20px 16px;}
.styleme-main{overflow-y:auto;padding:32px 36px;background:${C.cream};}

/* Inspo layout */
.inspo-layout{flex:1;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;gap:0;}
.inspo-left{border-right:1px solid ${C.bone};background:${C.white};overflow-y:auto;padding:32px 36px;display:flex;flex-direction:column;}
.inspo-right{background:${C.cream};overflow-y:auto;padding:32px 36px;}

/* Typography */
.t-display{font-family:${SERIF};font-weight:700;font-style:italic;line-height:0.9;color:${C.espresso};}
.t-heading{font-family:${SERIF};font-weight:600;color:${C.espresso};line-height:1.1;}
.t-subheading{font-family:${SERIF};font-weight:400;font-style:italic;color:${C.stone};}
.t-label{font-family:${SANS};font-weight:500;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:${C.taupe};}
.t-body{font-family:${SANS};font-weight:300;font-size:12px;line-height:1.75;color:${C.stone};}

/* Section rules */
.rule{height:3px;width:100%;margin-bottom:0;}
.rule-thin{height:1px;background:${C.bone};width:100%;}

/* Buttons */
.btn-p{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:${C.burgundy};color:${C.cream};font-family:${SANS};font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;border:none;cursor:pointer;transition:background 0.18s;}
.btn-p:hover{background:${C.espresso};}
.btn-p:disabled{background:${C.sand};cursor:not-allowed;}
.btn-g{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:transparent;color:${C.burgundy};font-family:${SANS};font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;border:1.5px solid ${C.burgundy};cursor:pointer;transition:all 0.18s;}
.btn-g:hover{background:${C.burgundy};color:${C.cream};}
.btn-t{background:none;border:none;font-family:${SANS};font-size:9px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:${C.taupe};cursor:pointer;text-decoration:underline;text-underline-offset:3px;transition:color 0.15s;}
.btn-t:hover{color:${C.wine};}

/* Quiz options */
.q-opt{width:100%;padding:15px 20px;background:${C.white};border:1px solid ${C.bone};border-left:3px solid transparent;font-family:${SERIF};font-size:16px;font-weight:400;color:${C.espresso};text-align:left;line-height:1.4;cursor:pointer;transition:all 0.14s;margin-bottom:6px;}
.q-opt:hover{border-left-color:${C.burgundy};background:${C.parchment};}

/* Type chips */
.type-chip{padding:5px 11px;border:1px solid ${C.bone};background:${C.white};font-family:${SANS};font-size:9px;font-weight:400;letter-spacing:0.06em;color:${C.stone};cursor:pointer;transition:all 0.13s;white-space:nowrap;display:inline-block;margin:0 4px 4px 0;}
.type-chip:hover{border-color:${C.wine};color:${C.wine};}
.type-chip.on{background:${C.burgundy};color:${C.cream};border-color:${C.burgundy};}

/* Platform / filter buttons */
.plat-btn{padding:9px 16px;border:1.5px solid ${C.bone};background:transparent;font-family:${SANS};font-size:10px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:${C.stone};cursor:pointer;transition:all 0.13s;margin:0 5px 5px 0;}
.plat-btn:hover{border-color:${C.espresso};color:${C.espresso};}
.plat-btn.on{background:${C.espresso};color:${C.cream};border-color:${C.espresso};}

/* Vibe pills */
.vibe-pill{padding:7px 14px;border:1px solid ${C.bone};background:transparent;font-family:${SERIF};font-size:14px;font-style:italic;color:${C.stone};cursor:pointer;transition:all 0.13s;margin:0 5px 5px 0;}
.vibe-pill:hover{border-color:${C.wine};color:${C.wine};}
.vibe-pill.on{background:${C.wine};color:${C.cream};border-color:${C.wine};}

/* Progress */
.prog{display:flex;gap:3px;margin-bottom:20px;}
.prog-seg{flex:1;height:2px;transition:background 0.3s;}

/* Arch card */
.arch-card{position:relative;overflow:hidden;cursor:pointer;border:1px solid ${C.bone};transition:border-color 0.15s;}
.arch-card:hover{border-color:${C.wine};}
.arch-card.on{border:2px solid ${C.burgundy};}
.arch-overlay{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(34,21,22,0.82));padding:18px 10px 8px;}

/* Result cards */
.result-card{background:${C.white};border:1px solid ${C.bone};transition:border-color 0.15s;overflow:hidden;}
.result-card:hover{border-color:${C.wine};}

/* Fade up */
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.fade-up{animation:fadeUp 0.28s ease forwards;}

/* Weight bar */
.wbar-track{height:2px;background:${C.bone};width:100%;}
.wbar-fill{height:2px;transition:width 0.4s ease;}

/* Meas input */
.m-input{width:100%;padding:9px 10px;border:none;border-bottom:1.5px solid ${C.bone};background:transparent;font-family:${SANS};font-size:13px;color:${C.espresso};outline:none;transition:border-color 0.15s;}
.m-input:focus{border-bottom-color:${C.burgundy};}

/* Depop box */
.depop-box{background:${C.white};border:1px solid ${C.bone};border-left:3px solid ${C.wine};padding:14px 18px;margin-bottom:16px;}

/* Palette display */
.pal-row{display:flex;gap:4px;margin-bottom:6px;}
.pal-swatch{border:1px solid rgba(0,0,0,0.05);}
`;

/* ─── SMALL COMPONENTS ─── */
const Rule = ({color=C.burgundy,thickness=3,style={}}) => (
  <div style={{height:thickness,background:color,width:"100%",...style}}/>
);
const ThinRule = ({style={}}) => <div className="rule-thin" style={style}/>;
const Label = ({children,color=C.taupe,style={}}) => (
  <div className="t-label" style={{color,...style}}>{children}</div>
);
const Wbar = ({value,color}) => (
  <div className="wbar-track">
    <div className="wbar-fill" style={{width:`${Math.min(value*100,100)}%`,background:color||C.burgundy}}/>
  </div>
);

function PaletteDisplay({pal,neut}){
  return(
    <div>
      <div className="pal-row">
        {pal.map((c,i)=>(
          <div key={i} className="pal-swatch" style={{
            flex:i<3?2.2:1,
            height:i<3?80:52,
            background:c,
          }}/>
        ))}
      </div>
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        <Label style={{marginRight:8}}>Neutrals</Label>
        {neut.map((c,i)=><div key={i} className="pal-swatch" style={{width:34,height:34,background:c}}/>)}
      </div>
    </div>
  );
}

function ArchTile({code,selected,onClick,h=96}){
  const a=ARCHETYPES[code];
  const color=ARCH_COLORS[code]||C.bone;
  return(
    <div className={`arch-card${selected?" on":""}`} onClick={onClick}>
      <ColorTile color={color} height={h} style={{width:"100%"}}>
        <div className="arch-overlay">
          <div style={{fontFamily:SANS,fontSize:7,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(240,232,216,0.55)",marginBottom:2}}>{a.family}</div>
          <div style={{fontFamily:SERIF,fontSize:12,color:"#F2EBE0",lineHeight:1.2}}>{a.name}</div>
        </div>
      </ColorTile>
    </div>
  );
}

/* ─── PROFILE SIDEBAR (Style Me / Inspo) ─── */
function ProfileSidebar({selK,selS,topArch}){
  const k=selK?KIBBE[selK]:null;
  const s=selS?SEASONS[selS]:null;
  const displayK=selK?selK.replace(/([A-Z])/g," $1").trim():"";

  return(
    <div className="styleme-sidebar">
      <Label style={{marginBottom:18,color:C.blue}}>Your Profile</Label>

      {k&&(
        <div style={{marginBottom:20}}>
          <Rule color={C.burgundy} thickness={2} style={{marginBottom:10}}/>
          <div style={{fontFamily:SERIF,fontSize:16,fontStyle:"italic",fontWeight:600,color:C.espresso,marginBottom:2}}>{displayK}</div>
          <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.taupe,marginBottom:10}}>{k.short}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,marginBottom:10}}>
            {k.sil.slice(0,4).map((si,i)=>(
              <ColorTile key={i} color={KIBBE_COLORS[selK]||C.bone} height={52} style={{width:"100%"}}>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"3px 6px",background:"rgba(34,21,22,0.6)"}}>
                  <div style={{fontFamily:SANS,fontSize:7.5,color:C.cream,fontWeight:400}}>{si}</div>
                </div>
              </ColorTile>
            ))}
          </div>
          <div style={{borderLeft:`2px solid ${C.wine}`,paddingLeft:8}}>
            <Label style={{color:C.wine,marginBottom:3}}>Avoid</Label>
            {k.avoid.slice(0,3).map(a=><div key={a} style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.wine,lineHeight:1.7}}>{a}</div>)}
          </div>
        </div>
      )}

      {s&&(
        <div style={{marginBottom:20}}>
          <Rule color={C.blue} thickness={2} style={{marginBottom:10}}/>
          <div style={{fontFamily:SERIF,fontSize:15,fontStyle:"italic",fontWeight:600,color:C.espresso,marginBottom:2}}>{s.label}</div>
          <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.taupe,marginBottom:8}}>{s.sub}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3,marginBottom:6}}>
            {s.pal.map((c,i)=><div key={i} style={{height:20,background:c,border:"1px solid rgba(0,0,0,0.05)"}}/>)}
          </div>
          <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.gold}}>{s.metals}</div>
          <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.wine,marginTop:2}}>Avoid: {s.avoid}</div>
        </div>
      )}

      {topArch.length>0&&(
        <div>
          <Rule color={C.olive} thickness={2} style={{marginBottom:10}}/>
          <Label style={{marginBottom:10,color:C.olive}}>Aesthetic</Label>
          {topArch.slice(0,4).map(([code,w])=>(
            <div key={code} style={{marginBottom:10}}>
              <ColorTile color={ARCH_COLORS[code]} height={44} style={{width:"100%",marginBottom:4}}>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-end",padding:"4px 6px"}}>
                  <div style={{fontFamily:SERIF,fontSize:10,color:C.cream}}>{ARCHETYPES[code].name}</div>
                </div>
              </ColorTile>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <div style={{fontFamily:SANS,fontSize:9,fontWeight:300,color:C.stone,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(w*100).toFixed(0)}%</div>
              </div>
              <Wbar value={w} color={ARCH_COLORS[code]}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── RESULT CARD ─── */
function ResultCard({ r }) {
  const [img, setImg] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    if (!r.url?.startsWith("http")) { setImgLoading(false); return; }
    fetch(`/api/og-image?url=${encodeURIComponent(r.url)}`)
      .then(res => res.json())
      .then(data => { setImg(data.imageUrl || null); })
      .catch(() => {})
      .finally(() => setImgLoading(false));
  }, [r.url]);

  const isRTR = r.platform === "RTR" || r.platform === "Rent the Runway";
  const isNuuly = r.platform === "Nuuly";
  const isDepop = r.platform === "Depop";
  const isFP = r.platform === "FashionPass";
  const isRent = r.type === "rent" || isRTR || isNuuly || isFP || isDepop;
  const pc = isRTR ? C.burgundy : isNuuly ? C.olive : isDepop ? C.wine : C.blue;

  return (
    <div className="result-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Image area */}
      <div style={{ position: "relative", height: 180, flexShrink: 0, background: "#C8B898", overflow: "hidden" }}>
        {imgLoading && (
          <div style={{ position: "absolute", inset: 0, background: "#C8B898" }} />
        )}
        {!imgLoading && img && (
          <img
            src={img}
            alt={r.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={() => setImg(null)}
          />
        )}
        {/* Rent / Buy badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: isRent ? C.burgundy : C.olive,
          padding: "2px 8px",
        }}>
          <span style={{ fontFamily: SANS, fontSize: 7, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.white }}>
            {isRent ? "RENT" : "BUY"}
          </span>
        </div>
      </div>

      {/* 4px platform border */}
      <div style={{ height: 4, background: pc, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div style={{ flex: 1, marginRight: 8 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, color: C.espresso, lineHeight: 1.2, marginBottom: 3 }}>{r.name}</div>
            <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.taupe }}>{r.brand}</div>
          </div>
          {r.price && (
            <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.espresso, flexShrink: 0 }}>{r.price}</div>
          )}
        </div>

        <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 11, color: C.stone, lineHeight: 1.7, flex: 1, marginBottom: 10 }}>{r.match}</div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: pc }} />
            <span style={{ fontFamily: SANS, fontSize: 8, letterSpacing: "0.1em", color: C.taupe }}>{r.platform}</span>
          </div>
          {r.url?.startsWith("http") && (
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: SANS, fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", color: C.burgundy, textDecoration: "underline", textUnderlineOffset: "2px" }}>
              View →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function App(){
  const[page,setPage]=useState("quiz");
  const[selK,setSelK]=useState("");
  const[selS,setSelS]=useState("");
  const[archW,setArchW]=useState({});
  const[archDone,setArchDone]=useState(false);
  const[quizStep,setQuizStep]=useState(1);

  // Kibbe quiz
  const[kMode,setKMode]=useState("quiz"); // quiz | measure
  const[kStep,setKStep]=useState(-1);
  const[kScores,setKScores]=useState({});
  const[meas,setMeas]=useState({height:"",bust:"",waist:"",hips:"",shoulders:"",shoulderShape:"",bodyFlesh:"",faceShape:""});

  // Season quiz
  const[sStep,setSStep]=useState(-1);
  const[sScores,setSScores]=useState({});

  // Arch quiz
  const[archHist,setArchHist]=useState([]);
  const[archRound,setArchRound]=useState(null);
  const[archUsed,setArchUsed]=useState([]);

  // Style Me
  const[platform,setPlatform]=useState("all");
  const[cat,setCat]=useState("all");
  const[vibe,setVibe]=useState("");
  const[depopSize,setDepopSize]=useState("S");
  const[searching,setSearching]=useState(false);
  const[results,setResults]=useState(null);

  // Inspo
  const[inspoImg,setInspoImg]=useState(null);
  const[inspoB64,setInspoB64]=useState(null);
  const fileRef=useRef();

  useEffect(()=>{
    const l=document.createElement("link");l.href=FONT_URL;l.rel="stylesheet";document.head.appendChild(l);
  },[]);

  const k=selK?KIBBE[selK]:null;
  const s=selS?SEASONS[selS]:null;
  const displayK=selK?selK.replace(/([A-Z])/g," $1").trim():"";

  const topArch=useMemo(()=>
    Object.entries(archW).filter(([,w])=>w>0).sort((a,b)=>b[1]-a[1]).slice(0,7)
  ,[archW]);
  const archFam=useMemo(()=>families(archW),[archW]);
  const brands=useMemo(()=>{
    if(!topArch.length)return DEFAULT_BRANDS;
    return BRANDS[topArch[0][0]]||DEFAULT_BRANDS;
  },[topArch]);

  function startArch(){
    setArchW({});setArchHist([]);setArchUsed([]);setArchDone(false);
    setArchRound(pickRound({},[]),);
  }
  function answerArch(optIdx){
    const r=AQ[archRound];
    const alpha=Math.max(0.4,0.8-archHist.length*0.02);
    let next;
    if(optIdx==="none"){
      next={...archW};
      r.opts.forEach(o=>{Object.entries(o.sig).forEach(([c,m])=>{next[c]=Math.max(0,(next[c]||0)-0.2*Math.abs(m));});});
      const t=Object.values(next).reduce((a,b)=>a+b,0);
      if(t>0)Object.keys(next).forEach(k=>{next[k]/=t;});
    }else{
      next=updateW(archW,r.opts[optIdx].sig,alpha);
    }
    setArchW(next);
    const nh=[...archHist,next];
    setArchHist(nh);
    const nu=[...archUsed,archRound];
    setArchUsed(nu);
    if(stop(nh)){setArchDone(true);setArchRound(null);return;}
    const nr=pickRound(next,nu);
    if(nr===null){setArchDone(true);setArchRound(null);}else setArchRound(nr);
  }

  async function doSearch(useInspo){
    setSearching(true);
    try{
      const resp=await fetch("/api/style-me",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          kibbeType:selK||null,
          colorSeason:selS||null,
          archetypes:topArch.slice(0,3).map(([c])=>ARCHETYPES[c].name),
          platform,
          category:cat,
          vibes:vibe?[vibe]:[],
          depopSize,
          inspoImage:useInspo&&inspoB64?inspoB64:undefined,
          inspoMode:useInspo&&!!inspoB64,
        })
      });
      const data=await resp.json();
      if(!resp.ok&&Array.isArray(data)&&data[0]?.match){
        setResults(data);
      }else{
        setResults(Array.isArray(data)?data:[{name:"Error",brand:"",platform:"",price:"",match:JSON.stringify(data).slice(0,200),url:""}]);
      }
    }catch(e){
      setResults([{name:"Error",brand:"",platform:"",price:"",match:"Connection failed.",url:""}]);
    }
    setSearching(false);
  }

  /* ══════════════════════════════════════════════════════════
     FIND MY TYPE — Left panel nav + right content
  ══════════════════════════════════════════════════════════ */
  const FindMyType = () => {
    const kDone=!!selK, sDone=!!selS, aDone=archDone&&topArch.length>0;
    const allDone=kDone&&sDone&&aDone;

    const steps=[
      {n:"01",title:"Kibbe Body Type",done:kDone,val:kDone?displayK:null,color:C.burgundy,step:1},
      {n:"02",title:"Colour Season",done:sDone,val:sDone?s?.label:null,color:C.blue,step:2},
      {n:"03",title:"Style Archetype",done:aDone,val:aDone&&topArch[0]?ARCHETYPES[topArch[0][0]]?.name:null,color:C.olive,step:3},
    ];

    return(
      <div className="main">
        {/* Left step nav */}
        <div className="left-panel">
          {/* Header area */}
          <div style={{padding:"28px 20px 20px",borderBottom:`1px solid ${C.bone}`}}>
            <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:28,color:C.espresso,lineHeight:0.9,marginBottom:8}}>Find Your Type</div>
            <div style={{fontFamily:SANS,fontWeight:300,fontSize:11,color:C.taupe,lineHeight:1.6}}>Three lenses. Body, colour, aesthetic.</div>
          </div>

          {/* Step buttons */}
          <div style={{flex:1}}>
            {steps.map(st=>(
              <button key={st.step} className={`step-btn${quizStep===st.step?" on":""}`} onClick={()=>setQuizStep(st.step)}>
                <div className="step-num" style={{color:st.done?st.color:C.bone,opacity:st.done?0.8:0.3}}>{st.n}</div>
                <div className="step-info" style={{flex:1,minWidth:0}}>
                  <div className="step-title" style={{color:st.done?st.color:C.taupe}}>{st.title}</div>
                  {st.val
                    ?<div className="step-val" style={{color:st.done?st.color:C.espresso,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{st.val}</div>
                    :<div className="step-pending">Not yet</div>
                  }
                </div>
                {st.done&&<div className="done-dot" style={{background:st.color}}/>}
              </button>
            ))}
          </div>

          {/* Complete CTA */}
          {allDone&&(
            <div style={{padding:"16px 20px",borderTop:`1px solid ${C.bone}`}}>
              <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.stone,marginBottom:10,lineHeight:1.6}}>Profile complete. Ready to shop.</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <button className="btn-p" style={{width:"100%",justifyContent:"center"}} onClick={()=>setPage("guide")}>Style Guide →</button>
                <button className="btn-g" style={{width:"100%",justifyContent:"center"}} onClick={()=>setPage("search")}>Style Me →</button>
              </div>
            </div>
          )}
        </div>

        {/* Right quiz content */}
        <div className="quiz-content">

          {/* ── KIBBE ── */}
          {quizStep===1&&(
            <div style={{padding:"40px 48px",maxWidth:720}} className="fade-up">
              <div style={{height:3,background:C.burgundy,marginBottom:0}}/>
              <div style={{display:"grid",gridTemplateColumns:"52px 1fr",gap:28,paddingTop:28,marginBottom:32}}>
                <div style={{fontFamily:SERIF,fontWeight:300,fontStyle:"italic",fontSize:56,color:C.blue,opacity:0.5,lineHeight:1}}>01</div>
                <div>
                  <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:38,color:C.espresso,lineHeight:0.88,marginBottom:10}}>Kibbe Body Type</div>
                  <div style={{fontFamily:SANS,fontWeight:300,fontSize:12,color:C.stone,lineHeight:1.7,maxWidth:480,marginBottom:24}}>Kibbe types define what physically flatters your bone structure. Independent of size or weight.</div>

                  {/* Mode toggle */}
                  <div style={{display:"flex",gap:0,marginBottom:28,borderBottom:`2px solid ${C.bone}`,width:"fit-content"}}>
                    {[["quiz","Take the Quiz"],["measure","Enter Measurements"]].map(([m,l])=>(
                      <button key={m} onClick={()=>setKMode(m)} style={{padding:"8px 18px",background:"none",border:"none",fontFamily:SANS,fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:kMode===m?C.burgundy:C.taupe,borderBottom:`2px solid ${kMode===m?C.burgundy:"transparent"}`,marginBottom:-2,cursor:"pointer",transition:"all 0.15s"}}>{l}</button>
                    ))}
                  </div>

                  {/* Measurements mode */}
                  {kMode==="measure"&&(
                    <div className="fade-up">
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
                        {[["height","Height (in)"],["bust","Bust"],["waist","Waist"],["hips","Hips"],["shoulders","Shoulders"]].map(([k2,l])=>(
                          <div key={k2}>
                            <Label style={{marginBottom:6}}>{l}</Label>
                            <input value={meas[k2]} onChange={e=>setMeas(p=>({...p,[k2]:e.target.value}))} placeholder="—" className="m-input"/>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
                        {[["shoulderShape","Shoulders",["narrow","moderate","wide","sloped"]],["bodyFlesh","Body flesh",["lean","moderate","soft"]],["faceShape","Face shape",["angular","round","blunt","mixed"]]].map(([k2,l,opts])=>(
                          <div key={k2}>
                            <Label style={{marginBottom:8}}>{l}</Label>
                            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                              {opts.map(o=><button key={o} className={`type-chip${meas[k2]===o?" on":""}`} onClick={()=>setMeas(p=>({...p,[k2]:o}))}>{o}</button>)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        <button className="btn-p" onClick={()=>{const r=inferKibbe(meas);if(r)setSelK(r.type);}}>Analyse</button>
                        {selK&&<button className="btn-g" onClick={()=>setQuizStep(2)}>Next: Colour Season →</button>}
                      </div>
                      {selK&&(
                        <div style={{marginTop:14,padding:"10px 14px",background:C.white,borderLeft:`3px solid ${KIBBE_COLORS[selK]}`}}>
                          <Label style={{marginBottom:4}}>Result</Label>
                          <div style={{fontFamily:SERIF,fontStyle:"italic",fontSize:18,color:C.espresso}}>{displayK}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quiz mode */}
                  {kMode==="quiz"&&(
                    <div className="fade-up">
                      {kStep<0?(
                        <div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:24}}>
                            {["Bone Structure","Body Flesh","Facial Features"].map((cat,i)=>(
                              <div key={cat} style={{borderTop:`3px solid ${[C.burgundy,C.blue,C.olive][i]}`,paddingTop:12}}>
                                <div style={{fontFamily:SANS,fontSize:8,fontWeight:500,letterSpacing:"0.18em",textTransform:"uppercase",color:[C.burgundy,C.blue,C.olive][i],marginBottom:4}}>{cat}</div>
                                <div style={{fontFamily:SERIF,fontSize:22,color:C.espresso}}>{KQ.filter(q=>q.cat===cat).length}</div>
                                <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.taupe}}>questions</div>
                              </div>
                            ))}
                          </div>
                          <button className="btn-p" onClick={()=>{setKStep(0);setKScores({});}}>Begin — 14 Questions</button>
                        </div>
                      ):kStep<KQ.length?(
                        <div>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                            <Label style={{color:C.burgundy}}>{KQ[kStep].cat}</Label>
                            <Label>{kStep+1} / {KQ.length}</Label>
                          </div>
                          <div className="prog">
                            {KQ.map((_,i)=><div key={i} className="prog-seg" style={{background:i<kStep?C.burgundy:i===kStep?C.wine+"80":C.bone}}/>)}
                          </div>
                          <div style={{fontFamily:SERIF,fontWeight:600,fontSize:20,color:C.espresso,marginBottom:20,lineHeight:1.3}}>{KQ[kStep].q}</div>
                          <div>
                            {KQ[kStep].opts.map((o,oi)=>(
                              <button key={oi} className="q-opt" onClick={()=>{
                                const n={...kScores};Object.entries(o.sc).forEach(([k2,v])=>{n[k2]=(n[k2]||0)+v;});
                                setKScores(n);
                                if(kStep<KQ.length-1)setKStep(kStep+1);
                                else{const s2=Object.entries(n).sort((a,b)=>b[1]-a[1]);setSelK(SCORE_MAP[s2[0][0]]||"SoftNatural");setKStep(KQ.length);}
                              }}>{o.l}</button>
                            ))}
                          </div>
                          {kStep>0&&<button className="btn-t" onClick={()=>setKStep(kStep-1)} style={{marginTop:10}}>← Previous</button>}
                        </div>
                      ):(
                        <div className="fade-up">
                          <div style={{padding:"18px 22px",background:C.espresso,marginBottom:18}}>
                            <Label style={{color:"rgba(240,232,216,0.45)",marginBottom:6}}>Your Kibbe Type</Label>
                            <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:32,color:C.cream,marginBottom:4}}>{displayK}</div>
                            <div style={{fontFamily:SANS,fontWeight:300,fontSize:12,color:"rgba(240,232,216,0.65)"}}>{k?.desc}</div>
                          </div>
                          <div style={{display:"flex",gap:10}}>
                            <button className="btn-p" onClick={()=>setQuizStep(2)}>Next: Colour Season →</button>
                            <button className="btn-t" onClick={()=>{setKStep(-1);setKScores({});setSelK("");}}>Retake</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Manual select */}
              <ThinRule style={{marginBottom:20}}/>
              <Label style={{marginBottom:12}}>Or select directly</Label>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                {Object.entries(KIBBE).map(([id,data])=>(
                  <button key={id} className={`type-chip${selK===id?" on":""}`} onClick={()=>setSelK(id)}
                    style={selK===id?{background:data.c,borderColor:data.c,color:C.cream}:{}}>{id.replace(/([A-Z])/g," $1").trim()}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── SEASON ── */}
          {quizStep===2&&(
            <div style={{padding:"40px 48px",maxWidth:720}} className="fade-up">
              <div style={{height:3,background:C.blue,marginBottom:0}}/>
              <div style={{display:"grid",gridTemplateColumns:"52px 1fr",gap:28,paddingTop:28,marginBottom:32}}>
                <div style={{fontFamily:SERIF,fontWeight:300,fontStyle:"italic",fontSize:56,color:C.blue,opacity:0.5,lineHeight:1}}>02</div>
                <div>
                  <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:38,color:C.espresso,lineHeight:0.88,marginBottom:10}}>Colour Season</div>
                  <div style={{fontFamily:SANS,fontWeight:300,fontSize:12,color:C.stone,lineHeight:1.7,maxWidth:480,marginBottom:28}}>Ten questions about undertone, depth, and clarity. Lands on one of twelve seasons.</div>

                  {/* Season manual select */}
                  <div style={{marginBottom:28}}>
                    <Label style={{marginBottom:14}}>Select directly</Label>
                    {["Spring","Summer","Autumn","Winter"].map(fam=>(
                      <div key={fam} style={{marginBottom:12}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:SFAM[fam]}}/>
                          <Label style={{color:SFAM[fam]}}>{fam}</Label>
                        </div>
                        <div>
                          {Object.entries(SEASONS).filter(([,v])=>v.fam===fam).map(([id,data])=>(
                            <button key={id} className={`type-chip${selS===id?" on":""}`} onClick={()=>setSelS(id)}
                              style={selS===id?{background:SFAM[fam],borderColor:SFAM[fam],color:C.cream}:{}}>{data.label.replace(fam+" ","")}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <ThinRule style={{marginBottom:20}}/>
                  <Label style={{marginBottom:12}}>Or take the quiz</Label>

                  {sStep<0?(
                    <button className="btn-p" style={{background:C.blue}} onClick={()=>{setSStep(0);setSScores({});}}>Begin — 10 Questions</button>
                  ):sStep<SQ.length?(
                    <div className="fade-up">
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <Label style={{color:C.blue}}>Colour Season</Label>
                        <Label>{sStep+1} / {SQ.length}</Label>
                      </div>
                      <div className="prog">
                        {SQ.map((_,i)=><div key={i} className="prog-seg" style={{background:i<sStep?C.blue:i===sStep?C.blue+"70":C.bone}}/>)}
                      </div>
                      <div style={{fontFamily:SERIF,fontWeight:600,fontSize:20,color:C.espresso,marginBottom:20,lineHeight:1.3}}>{SQ[sStep].q}</div>
                      <div>
                        {SQ[sStep].opts.map((o,oi)=>(
                          <button key={oi} className="q-opt" onClick={()=>{
                            const n={...sScores};Object.entries(o.sc).forEach(([k2,v])=>{n[k2]=(n[k2]||0)+v;});
                            setSScores(n);
                            if(sStep<SQ.length-1)setSStep(sStep+1);else{setSelS(calcSeason(n));setSStep(SQ.length);}
                          }}>{o.l}</button>
                        ))}
                      </div>
                      {sStep>0&&<button className="btn-t" onClick={()=>setSStep(sStep-1)} style={{marginTop:10}}>← Previous</button>}
                    </div>
                  ):(
                    <div className="fade-up">
                      <div style={{padding:"18px 22px",background:SFAM[s?.fam]||C.blue,marginBottom:16}}>
                        <Label style={{color:"rgba(255,255,255,0.5)",marginBottom:6}}>Your Colour Season</Label>
                        <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:28,color:C.cream,marginBottom:8}}>{s?.label}</div>
                        <div style={{display:"flex",gap:3}}>
                          {s?.pal.map((c,i)=><div key={i} style={{flex:1,height:16,background:c}}/>)}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        <button className="btn-p" onClick={()=>setQuizStep(3)}>Next: Style Archetype →</button>
                        <button className="btn-t" onClick={()=>{setSStep(-1);setSScores({});setSelS("");}}>Retake</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ARCHETYPE ── */}
          {quizStep===3&&(
            <div style={{padding:"40px 48px"}} className="fade-up">
              <div style={{height:3,background:C.olive,marginBottom:0}}/>
              <div style={{display:"grid",gridTemplateColumns:"52px 1fr",gap:28,paddingTop:28,marginBottom:28}}>
                <div style={{fontFamily:SERIF,fontWeight:300,fontStyle:"italic",fontSize:56,color:C.olive,opacity:0.5,lineHeight:1}}>03</div>
                <div>
                  <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:38,color:C.espresso,lineHeight:0.88,marginBottom:10}}>Style Archetype</div>
                  <div style={{fontFamily:SANS,fontWeight:300,fontSize:12,color:C.stone,lineHeight:1.7,maxWidth:480,marginBottom:24}}>Your aesthetic identity — what you're drawn to, independent of body type or colour. Adaptive quiz stops when your profile stabilises.</div>
                </div>
              </div>

              {/* Archetype grid */}
              {!archRound&&!archDone&&(
                <div style={{marginBottom:24}}>
                  <Label style={{marginBottom:14}}>Browse all 34 archetypes — select one directly</Label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:5}}>
                    {Object.entries(ARCHETYPES).map(([code])=>(
                      <ArchTile key={code} code={code} selected={topArch[0]?.[0]===code} onClick={()=>{setArchW({[code]:1.0});setArchDone(true);}} h={80}/>
                    ))}
                  </div>
                </div>
              )}

              <ThinRule style={{marginBottom:20}}/>

              {/* Adaptive quiz */}
              {!archRound&&!archDone&&(
                <button className="btn-p" style={{background:C.olive}} onClick={startArch}>Take Adaptive Quiz — 10–20 Rounds</button>
              )}

              {archRound!==null&&(
                <div style={{maxWidth:600}} className="fade-up">
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <Label style={{color:C.olive}}>Round {archHist.length+1} · {archHist.length>=10?"Stabilising":"Building profile"}</Label>
                    <button className="btn-t" onClick={()=>{setArchW({});setArchHist([]);setArchRound(null);setArchUsed([]);setArchDone(false);}}>Restart</button>
                  </div>
                  <div style={{height:2,background:C.bone,marginBottom:24}}>
                    <div style={{height:2,width:`${Math.min((archHist.length/15)*100,100)}%`,background:C.olive,transition:"width 0.4s"}}/>
                  </div>
                  <div style={{fontFamily:SERIF,fontWeight:600,fontSize:20,color:C.espresso,marginBottom:20,lineHeight:1.3}}>{AQ[archRound].q}</div>
                  <div>
                    {AQ[archRound].opts.map((o,oi)=>(
                      <button key={oi} className="q-opt" onClick={()=>answerArch(oi)}>{o.l}</button>
                    ))}
                  </div>
                  <button onClick={()=>answerArch("none")} style={{width:"100%",padding:"11px",border:`1px dashed ${C.bone}`,background:"transparent",fontFamily:SANS,fontSize:10,fontWeight:400,letterSpacing:"0.12em",color:C.taupe,cursor:"pointer",marginTop:6}}>None of these</button>

                  {/* Live preview */}
                  {topArch.length>0&&(
                    <div style={{marginTop:20,paddingTop:20,borderTop:`1px solid ${C.bone}`}}>
                      <Label style={{marginBottom:12,color:C.olive}}>Emerging profile</Label>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
                        {topArch.slice(0,4).map(([code,w])=>(
                          <div key={code}>
                            <ColorTile color={ARCH_COLORS[code]} height={44} style={{width:"100%",marginBottom:3}}>
                              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-end",padding:"3px 5px"}}>
                                <div style={{fontFamily:SERIF,fontSize:9,color:C.cream}}>{ARCHETYPES[code].name}</div>
                              </div>
                            </ColorTile>
                            <div style={{fontFamily:SANS,fontSize:8,color:C.taupe,textAlign:"center"}}>{(w*100).toFixed(0)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Done state */}
              {archDone&&topArch.length>0&&(
                <div style={{maxWidth:600}} className="fade-up">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                    <div>
                      <Label style={{color:C.olive,marginBottom:6}}>Archetype Profile · {archHist.length} rounds</Label>
                      <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:32,color:C.espresso}}>{ARCHETYPES[topArch[0][0]].name}</div>
                    </div>
                    <ColorTile color={ARCH_COLORS[topArch[0][0]]} height={64} style={{width:64}}/>
                  </div>

                  {topArch.map(([code,w])=>(
                    <div key={code} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <ColorTile color={ARCH_COLORS[code]} height={28} style={{width:28,flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <div style={{fontFamily:SANS,fontSize:11,color:C.espresso}}>{ARCHETYPES[code].name}</div>
                          <div style={{fontFamily:SANS,fontSize:9,fontWeight:300,color:C.taupe}}>{(w*100).toFixed(0)}%</div>
                        </div>
                        <Wbar value={w} color={ARCH_COLORS[code]}/>
                      </div>
                    </div>
                  ))}

                  <div style={{display:"flex",gap:10,marginTop:16}}>
                    <button className="btn-p" onClick={()=>setPage("guide")}>View Style Guide</button>
                    <button className="btn-g" onClick={()=>setPage("search")}>Style Me</button>
                    <button className="btn-t" onClick={()=>{setArchW({});setArchHist([]);setArchRound(null);setArchUsed([]);setArchDone(false);}}>Retake</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     STYLE GUIDE — Left profile summary + Right scrolling content
  ══════════════════════════════════════════════════════════ */
  const StyleGuide = () => {
    if(!k&&!s) return(
      <div className="main" style={{alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
        <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:36,color:C.espresso}}>Complete a quiz first</div>
        <button className="btn-p" onClick={()=>setPage("quiz")}>Find My Type</button>
      </div>
    );

    return(
      <div className="guide-layout">
        {/* Left — fixed profile summary */}
        <div className="guide-left">
          {k&&(
            <div style={{marginBottom:24}}>
              <Rule color={C.burgundy} thickness={2} style={{marginBottom:12}}/>
              <Label style={{color:C.burgundy,marginBottom:6}}>Kibbe Body Type</Label>
              <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:22,color:C.espresso,marginBottom:4}}>{displayK}</div>
              <div style={{fontFamily:SANS,fontWeight:300,fontSize:11,color:C.stone,lineHeight:1.6,marginBottom:12}}>{k.desc}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                {k.sil.map((si,i)=>(
                  <ColorTile key={i} color={KIBBE_COLORS[selK]} height={48} style={{flex:"1 0 calc(50% - 2px)"}}>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"3px 6px",background:"rgba(34,21,22,0.65)"}}>
                      <div style={{fontFamily:SANS,fontSize:8,color:C.cream}}>{si}</div>
                    </div>
                  </ColorTile>
                ))}
              </div>
              <div style={{borderLeft:`2px solid ${C.wine}`,paddingLeft:10,marginBottom:10}}>
                <Label style={{color:C.wine,marginBottom:4}}>Avoid</Label>
                {k.avoid.map(a=><div key={a} style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.wine,lineHeight:1.7}}>{a}</div>)}
              </div>
            </div>
          )}
          {s&&(
            <div style={{marginBottom:24}}>
              <Rule color={SFAM[s.fam]||C.blue} thickness={2} style={{marginBottom:12}}/>
              <Label style={{color:SFAM[s.fam],marginBottom:6}}>Colour Season</Label>
              <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:20,color:C.espresso,marginBottom:8}}>{s.label}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3,marginBottom:6}}>
                {s.pal.map((c,i)=><div key={i} style={{height:20,background:c}}/>)}
              </div>
              <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.gold}}>{s.metals}</div>
              <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.wine,marginTop:2}}>Avoid: {s.avoid}</div>
            </div>
          )}
          {topArch.length>0&&(
            <div>
              <Rule color={C.olive} thickness={2} style={{marginBottom:12}}/>
              <Label style={{color:C.olive,marginBottom:10}}>Style Archetype</Label>
              {topArch.slice(0,5).map(([code,w])=>(
                <div key={code} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <div style={{fontFamily:SANS,fontSize:10,color:C.espresso}}>{ARCHETYPES[code].name}</div>
                    <div style={{fontFamily:SANS,fontSize:9,fontWeight:300,color:C.taupe}}>{(w*100).toFixed(0)}%</div>
                  </div>
                  <Wbar value={w} color={ARCH_COLORS[code]}/>
                </div>
              ))}
            </div>
          )}
          <div style={{marginTop:24,paddingTop:16,borderTop:`1px solid ${C.bone}`}}>
            <button className="btn-p" style={{width:"100%",justifyContent:"center"}} onClick={()=>setPage("search")}>Style Me →</button>
          </div>
        </div>

        {/* Right — scrolling guide content */}
        <div className="guide-right">
          {/* Hero */}
          <div style={{marginBottom:36}}>
            <div style={{fontFamily:SANS,fontWeight:200,fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",color:C.taupe,marginBottom:10}}>Style Guide</div>
            <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:48,color:C.espresso,lineHeight:0.88,marginBottom:10}}>
              {displayK}{s&&<><span style={{color:C.sand}}> ×</span> {s.label}</>}{topArch.length>0&&<><br/><span style={{fontSize:32,color:ARCH_COLORS[topArch[0][0]]||C.stone}}>{ARCHETYPES[topArch[0][0]].name}</span></>}
            </div>
          </div>

          {/* Silhouettes */}
          {k&&(
            <>
              <Rule color={C.burgundy} thickness={3} style={{marginBottom:16}}/>
              <Label style={{color:C.burgundy,marginBottom:14}}>Flattering Silhouettes</Label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
                {k.sil.map((si,i)=>(
                  <div key={i} style={{background:C.white,border:`1px solid ${C.bone}`,borderTop:`2px solid ${C.burgundy}`}}>
                    <ColorTile color={KIBBE_COLORS[selK]} height={80} style={{width:"100%"}}/>
                    <div style={{padding:"8px 10px"}}>
                      <div style={{fontFamily:SERIF,fontSize:13,color:C.espresso}}>{si}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:28}}>
                {[
                  {label:"Best Fabrics",items:k.fab,color:C.olive},
                  {label:"Necklines",items:k.neck,color:C.blue},
                  {label:"Avoid",items:k.avoid,color:C.wine},
                ].map(({label,items,color})=>(
                  <div key={label} style={{borderTop:`3px solid ${color}`,paddingTop:12}}>
                    <Label style={{color,marginBottom:10}}>{label}</Label>
                    {items.map((item,i)=>(
                      <div key={i} style={{fontFamily:SERIF,fontSize:13,color:color===C.wine?C.wine:C.espresso,padding:"4px 0",borderBottom:`1px solid ${C.parchment}`}}>{item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Palette */}
          {s&&(
            <>
              <Rule color={SFAM[s.fam]} thickness={3} style={{marginBottom:16}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
                <Label style={{color:SFAM[s.fam]}}>Colour Palette · {s.label}</Label>
                <div style={{fontFamily:SERIF,fontStyle:"italic",fontSize:12,color:C.taupe}}>{s.desc}</div>
              </div>
              <div style={{background:C.white,border:`1px solid ${C.bone}`,padding:"16px",marginBottom:10}}>
                <PaletteDisplay pal={s.pal} neut={s.neut}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
                  <div style={{borderTop:`3px solid ${C.gold}`,paddingTop:10}}>
                    <Label style={{color:C.gold,marginBottom:6}}>Best Metals</Label>
                    <div style={{fontFamily:SERIF,fontSize:14,color:C.espresso}}>{s.metals}</div>
                  </div>
                  <div style={{borderTop:`3px solid ${C.wine}`,paddingTop:10}}>
                    <Label style={{color:C.wine,marginBottom:6}}>Avoid</Label>
                    <div style={{fontFamily:SERIF,fontSize:14,color:C.wine}}>{s.avoid}</div>
                  </div>
                </div>
              </div>
              {k&&(
                <div style={{borderLeft:`3px solid ${C.gold}`,paddingLeft:16,marginBottom:28}}>
                  <Label style={{color:C.gold,marginBottom:6}}>Jewellery Guidance</Label>
                  <div style={{fontFamily:SERIF,fontStyle:"italic",fontWeight:500,fontSize:17,color:C.espresso,lineHeight:1.5}}>{k.jewel}</div>
                </div>
              )}
            </>
          )}

          {/* Archetypes */}
          {topArch.length>0&&(
            <>
              <Rule color={C.olive} thickness={3} style={{marginBottom:16}}/>
              <Label style={{color:C.olive,marginBottom:14}}>Aesthetic Profile</Label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:28}}>
                {topArch.slice(0,4).map(([code,w])=>(
                  <div key={code} style={{background:C.white,border:`1px solid ${C.bone}`,overflow:"hidden"}}>
                    <ColorTile color={ARCH_COLORS[code]} height={100} style={{width:"100%"}}>
                      <div style={{position:"absolute",inset:0,background:`linear-gradient(transparent 40%, rgba(34,21,22,0.8))`,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"8px 10px"}}>
                        <div style={{fontFamily:SANS,fontSize:7,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(240,232,216,0.5)"}}>{ARCHETYPES[code].family}</div>
                        <div style={{fontFamily:SERIF,fontSize:13,color:C.cream}}>{ARCHETYPES[code].name}</div>
                      </div>
                    </ColorTile>
                    <div style={{padding:"8px 10px"}}>
                      <div style={{height:2,background:C.bone}}><div style={{height:2,width:`${(w*100).toFixed(0)}%`,background:ARCH_COLORS[code]}}/></div>
                      <div style={{fontFamily:SANS,fontSize:9,fontWeight:300,color:C.taupe,marginTop:4}}>{(w*100).toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Brands */}
          <Rule color={C.chocolate} thickness={3} style={{marginBottom:16}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
            <Label style={{color:C.chocolate}}>Brand Universe</Label>
            {topArch.length>0&&<div style={{fontFamily:SERIF,fontStyle:"italic",fontSize:11,color:C.taupe}}>{ARCHETYPES[topArch[0][0]].name} aesthetic</div>}
          </div>
          <div style={{background:C.white,border:`1px solid ${C.bone}`,padding:"16px 20px",marginBottom:28}}>
            {[
              {key:"investment",label:"Investment",color:C.gold},
              {key:"mid",label:"Mid-Range",color:C.blue},
              {key:"accessible",label:"Accessible",color:C.olive},
              {key:"niche",label:"Niche / Independent",color:C.wine},
            ].map((tier,i)=>(
              <div key={tier.key} style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:14,padding:"12px 0",borderBottom:i<3?`1px solid ${C.bone}`:"none"}}>
                <div>
                  <div style={{width:3,height:3,borderRadius:"50%",background:tier.color,marginBottom:3}}/>
                  <Label style={{color:tier.color}}>{tier.label}</Label>
                </div>
                <div style={{fontFamily:SERIF,fontStyle:"italic",fontSize:13,color:C.espresso,lineHeight:1.9}}>
                  {(brands[tier.key]||[]).join("  ·  ")}
                </div>
              </div>
            ))}
          </div>

          {/* Sister seasons */}
          {s&&(
            <>
              <ThinRule style={{marginBottom:16}}/>
              <Label style={{marginBottom:14}}>Sister Seasons</Label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:28}}>
                {Object.entries(SEASONS).filter(([,v])=>v.fam===s.fam).map(([id,data])=>(
                  <div key={id} onClick={()=>setSelS(id)} style={{borderTop:`3px solid ${selS===id?SFAM[s.fam]:C.bone}`,paddingTop:10,cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{fontFamily:SERIF,fontSize:14,fontStyle:"italic",color:selS===id?SFAM[s.fam]:C.espresso,marginBottom:3}}>{data.label}</div>
                    <div style={{fontFamily:SANS,fontSize:9,fontWeight:300,color:C.taupe,marginBottom:8}}>{data.sub}</div>
                    <div style={{display:"flex",gap:2}}>
                      {data.pal.slice(0,6).map((c,i)=><div key={i} style={{flex:1,height:10,background:c}}/>)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════
     STYLE ME — Profile sidebar left + main content right
  ══════════════════════════════════════════════════════════ */
  const StyleMe = () => (
    <div className="styleme-layout">
      <ProfileSidebar selK={selK} selS={selS} topArch={topArch}/>
      <div className="styleme-main">
        {!k&&!s?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,height:"100%"}}>
            <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:32,color:C.espresso}}>Set your profile first</div>
            <button className="btn-p" onClick={()=>setPage("quiz")}>Find My Type</button>
          </div>
        ):(
          <>
            <Rule color={C.burgundy} thickness={3} style={{marginBottom:16}}/>
            <div style={{marginBottom:24}}>
              <Label style={{color:C.burgundy,marginBottom:6}}>Style Me</Label>
              <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:36,color:C.espresso,lineHeight:0.88,marginBottom:6}}>{displayK}{s&&` · ${s.label}`}</div>
              <div style={{fontFamily:SANS,fontWeight:300,fontSize:12,color:C.stone}}>Your stylist curates pieces across platforms tailored to your exact profile.</div>
            </div>

            <div style={{background:C.white,border:`1px solid ${C.bone}`,padding:"20px 22px",marginBottom:20}}>
              {/* Platform */}
              <div style={{marginBottom:16}}>
                <Label style={{marginBottom:10}}>Platform</Label>
                <div>
                  {["all","RTR","Nuuly","FashionPass","Depop"].map(p=>(
                    <button key={p} className={`plat-btn${platform===p?" on":""}`} onClick={()=>setPlatform(p)}>
                      {p==="all"?"All":p==="RTR"?"Rent the Runway":p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Depop filters */}
              {platform==="Depop"&&(
                <div className="depop-box fade-up">
                  <Label style={{color:C.wine,marginBottom:10}}>Depop Filters</Label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                    <div>
                      <Label style={{marginBottom:6,fontSize:8}}>Size (US Letter)</Label>
                      <select value={depopSize} onChange={e=>setDepopSize(e.target.value)} style={{width:"100%",padding:"8px 10px",border:`1px solid ${C.bone}`,background:C.white,fontFamily:SANS,fontSize:12,color:C.espresso,outline:"none"}}>
                        {["XS","S","M","L","XL"].map(sz=><option key={sz} value={sz}>{sz}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label style={{marginBottom:6,fontSize:8}}>Condition</Label>
                      <div style={{padding:"9px 10px",border:`1px solid ${C.bone}`,fontFamily:SANS,fontSize:12,color:C.taupe}}>Good and above</div>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-end"}}>
                      <div style={{fontFamily:SANS,fontSize:10,fontWeight:300,color:C.taupe,lineHeight:1.6}}>Vintage sizing runs small — Claude accounts for this.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category */}
              <div style={{marginBottom:16}}>
                <Label style={{marginBottom:10}}>Category</Label>
                <div>
                  {["all","Dresses","Tops","Bottoms","Outerwear","Sets"].map(c=>(
                    <button key={c} className={`plat-btn${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c==="all"?"Any":c}</button>
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div style={{marginBottom:20}}>
                <Label style={{marginBottom:10}}>Occasion / Vibe</Label>
                <div>
                  {["My aesthetic","London chic","Date night","Cocktail party","Brunch","Work event","Wedding guest","Summer vacation","Night out","Weekend"].map(v=>(
                    <button key={v} className={`vibe-pill${vibe===v?" on":""}`} onClick={()=>setVibe(vibe===v?"":v)}>{v}</button>
                  ))}
                </div>
              </div>

              <button className="btn-p" onClick={()=>doSearch(false)} disabled={searching} style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:11,letterSpacing:"0.22em"}}>
                {searching?"Finding your pieces…":"Style Me"}
              </button>
            </div>

            {/* Results */}
            {results&&(
              <div className="fade-up">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Rule color={C.burgundy} thickness={3} style={{width:18}}/>
                    <Label>{results.length} Curated Picks</Label>
                  </div>
                  <button className="btn-t" onClick={()=>doSearch(false)} disabled={searching}>Restyle</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {results.map((r,i)=><ResultCard key={i} r={r}/>)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     MATCH INSPO — True 50/50 split
  ══════════════════════════════════════════════════════════ */
  const MatchInspo = () => (
    <div className="inspo-layout">
      {/* Left — upload */}
      <div className="inspo-left">
        <Rule color={C.blue} thickness={3} style={{marginBottom:16}}/>
        <Label style={{color:C.blue,marginBottom:8}}>Match Inspo</Label>
        <div style={{fontFamily:SERIF,fontWeight:700,fontStyle:"italic",fontSize:32,color:C.espresso,lineHeight:0.88,marginBottom:8}}>Upload a Mood Board</div>
        <div style={{fontFamily:SANS,fontWeight:300,fontSize:12,color:C.stone,marginBottom:20,lineHeight:1.7}}>Your stylist analyses the image and finds rental pieces that capture the aesthetic — adapted for your body type and colouring.</div>

        <label style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`1px dashed ${C.sand}`,background:inspoImg?"transparent":C.cream,cursor:"pointer",overflow:"hidden",minHeight:240,marginBottom:16}}>
          {inspoImg?(
            <img src={inspoImg} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          ):(
            <div style={{textAlign:"center",padding:40}}>
              <div style={{fontFamily:SERIF,fontStyle:"italic",fontWeight:500,fontSize:20,color:C.taupe,marginBottom:6}}>Drop your inspo here</div>
              <div style={{fontFamily:SANS,fontWeight:300,fontSize:11,color:C.faint||C.sand,letterSpacing:"0.08em"}}>Outfit photo · Mood board · Pinterest screenshot</div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
            const f=e.target.files[0];if(!f)return;
            const r=new FileReader();r.onload=ev=>{setInspoImg(ev.target.result);setInspoB64(ev.target.result.split(",")[1]);setResults(null);};r.readAsDataURL(f);
          }}/>
        </label>

        {inspoImg&&(
          <div style={{display:"flex",gap:8}}>
            <button className="btn-p" onClick={()=>doSearch(true)} disabled={searching} style={{flex:1,justifyContent:"center"}}>{searching?"Analysing…":"Style This Look"}</button>
            <button className="btn-g" onClick={()=>{setInspoImg(null);setInspoB64(null);setResults(null);}}>Change</button>
          </div>
        )}
      </div>

      {/* Right — results */}
      <div className="inspo-right">
        {!results?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:8}}>
            <div style={{fontFamily:SERIF,fontStyle:"italic",fontSize:22,color:C.sand}}>Results appear here</div>
            <div style={{fontFamily:SANS,fontWeight:300,fontSize:11,color:C.bone}}>Upload an image and hit Style This Look</div>
          </div>
        ):(
          <div className="fade-up">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
              <Rule color={C.blue} thickness={3} style={{width:18}}/>
              <Label>Stylist's Picks · {results.length} items</Label>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {results.map((r,i)=><ResultCard key={i} r={r}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     SHELL
  ══════════════════════════════════════════════════════════ */
  return(
    <div className="app">
      <style>{CSS}</style>

      {/* Header */}
      <div className="hdr">
        <div className="wordmark">StyleCipher</div>
        <nav className="nav">
          {[["quiz","Find My Type"],["guide","Style Guide"],["search","Style Me"],["inspo","Match Inspo"]].map(([id,lb])=>(
            <button key={id} className={`nav-btn${page===id?" on":""}`} onClick={()=>setPage(id)}>{lb}</button>
          ))}
        </nav>
        <div className="profile-chips">
          {selK&&(
            <div className="chip-item">
              <div className="chip-label">Kibbe</div>
              <div className="chip-val" style={{color:C.espresso}}>{displayK}</div>
            </div>
          )}
          {selS&&(
            <div className="chip-item">
              <div className="chip-label">Season</div>
              <div className="chip-val" style={{color:SFAM[s?.fam]||C.espresso}}>{s?.label}</div>
            </div>
          )}
          {topArch.length>0&&(
            <div className="chip-item">
              <div className="chip-label">Archetype</div>
              <div className="chip-val" style={{color:ARCH_COLORS[topArch[0][0]]||C.espresso}}>{ARCHETYPES[topArch[0][0]]?.name}</div>
            </div>
          )}
        </div>
      </div>

      {/* Page content */}
      {page==="quiz"&&<FindMyType/>}
      {page==="guide"&&<div className="main"><StyleGuide/></div>}
      {page==="search"&&<div className="main"><StyleMe/></div>}
      {page==="inspo"&&<div className="main"><MatchInspo/></div>}
    </div>
  );
}
