import type { ArchetypeCode, ArchetypeData } from "@/lib/types";

// 4-colour palette representing each archetype's typical wardrobe palette
export const ARCHETYPE_PAL: Record<ArchetypeCode, [string, string, string, string]> = {
  "1a": ["#D4C9B2", "#9A8A78", "#7A8A9A", "#2A3A4A"], // oat · stone · slate · navy
  "1b": ["#F5EFE4", "#C8A87A", "#9A8A7A", "#5A5050"], // ivory · camel · mushroom · warm grey
  "1c": ["#FAFAFA", "#B0A8A0", "#5A5A5A", "#1A1A1A"], // white · ash · charcoal · black
  "1d": ["#F0EBE3", "#A8A090", "#6A7A8A", "#3A3A3A"], // cream · warm grey · dusty blue · stone
  "2a": ["#F5EFE4", "#1A2A5A", "#6B1E2E", "#C8A87A"], // ecru · breton navy · burgundy · camel
  "2b": ["#1A2A5A", "#FAFAFA", "#2A5A3A", "#6B1E2E"], // navy · white · hunter · burgundy
  "2c": ["#C8A87A", "#F5EFE4", "#A0A0A0", "#2A1A1A"], // camel · cream · grey · warm black
  "2d": ["#3A5A2A", "#8B2020", "#C8A87A", "#8A8A7A"], // forest · oxblood · camel · grey
  "3a": ["#3A3A3A", "#FAFAFA", "#C8A87A", "#1A2A5A"], // charcoal · white · camel · navy
  "3b": ["#1A1A1A", "#FAFAFA", "#6B1E2E", "#7A8A9A"], // black · white · burgundy · steel
  "3c": ["#8A7A6A", "#C8A87A", "#C89A88", "#D4C9B2"], // stone · camel · dusty rose · oat
  "4a": ["#E8C4B8", "#C89A88", "#A888B8", "#F5EFE4"], // blush · dusty rose · lavender · cream
  "4b": ["#5A1A5A", "#1A1A1A", "#6B1E2E", "#2A3A2A"], // deep plum · black · burgundy · forest
  "4c": ["#F07090", "#D0A0D0", "#FAFAFA", "#F5C0C8"], // bubblegum · lilac · white · blush
  "4d": ["#D4AE4A", "#2A6A3A", "#1A1A1A", "#F5EFE4"], // champagne · emerald · black · cream
  "5a": ["#C85A2A", "#C8A020", "#B86A4A", "#F0E8D0"], // rust · mustard · terracotta · cream
  "5b": ["#C86040", "#2A3A8A", "#D4A040", "#7A4A2A"], // terracotta · indigo · saffron · earth
  "5c": ["#E87040", "#E85060", "#3A9A9A", "#E8C040"], // orange · coral · turquoise · yellow
  "6a": ["#8AAABB", "#FAFAFA", "#D4C9B2", "#7A9A8A"], // soft blue · white · linen · sage
  "6b": ["#7A9A6A", "#6A7A3A", "#D4C9B2", "#C07040"], // sage · olive · oat · terracotta
  "6c": ["#5A7AA0", "#FAFAFA", "#C04040", "#B8986A"], // denim · white · faded red · tan
  "7a": ["#FAFAFA", "#A0A0A0", "#F0C0C0", "#1A1A1A"], // white · grey · blush · black
  "7b": ["#1A1A1A", "#3A3A3A", "#4A5A2A", "#2A5A9A"], // black · dark grey · olive · electric blue
  "7c": ["#3A9A3A", "#FAFAFA", "#1A2A5A", "#E8D000"], // kelly · white · navy · yellow
  "8a": ["#1A2A5A", "#C8A87A", "#F5EFE4", "#2A5A3A"], // navy · camel · cream · hunter
  "8b": ["#8B2020", "#4A2A10", "#F0E8D0", "#2A3A2A"], // oxblood · deep brown · cream · forest
  "8c": ["#C83030", "#FAFAFA", "#1A2A5A", "#E8C000"], // red · white · navy · yellow
  "9a": ["#C8A020", "#C85A2A", "#E87030", "#F0E8D0"], // mustard · rust · burnt orange · cream
  "9b": ["#D4B898", "#C0A888", "#F5EFE4", "#9A9080"], // nude · beige · ivory · dove grey
  "9c": ["#F07090", "#C0C8D0", "#FAFAFA", "#C0A0D0"], // bubblegum · silver · white · lavender
  "9d": ["#C82020", "#1A1A1A", "#FAFAFA", "#1A2A5A"], // cherry red · black · white · navy
  "10a":["#1A1A1A", "#2A2A2A", "#6A6A6A", "#5A1A2A"], // black · charcoal · grey · wine
  "10b":["#C82020", "#2A2A2A", "#B0B8C0", "#3A1A1A"], // tartan red · black · silver · dark
  "10c":["#1A1A1A", "#B0B8C0", "#5A5A5A", "#F0E8D0"], // black leather · silver · grey · off-white
  "10d":["#FAFAFA", "#1A1A1A", "#D4C8B0", "#7A7A7A"], // white · black · raw ecru · grey
  "11a":["#F0E8D0", "#9A8A78", "#1A1A1A", "#C8A87A"], // cream · stone · black · camel
  "11b":["#1A1A1A", "#5A5A5A", "#F0E8D0", "#E87030"], // black · grey · off-white · orange
  "11c":["#FAFAFA", "#7A7A7A", "#2A4AA0", "#40B040"], // white · grey · royal blue · electric green
};

export const ARCHETYPES: Record<ArchetypeCode, ArchetypeData> = {
  "1a": { name: "Scandi Minimalist",    family: "Minimalist", desc: "Relaxed, oat/stone/navy, thrown-on precision",              c: "#7A8B9A" },
  "1b": { name: "Quiet Luxury",         family: "Minimalist", desc: "Architectural cashmere, exact proportions",                  c: "#9B8B76" },
  "1c": { name: "Japanese Minimalist",  family: "Minimalist", desc: "Volume play, dropped shoulders, matte textures",             c: "#5A5A5A" },
  "1d": { name: "Modern Minimalist",    family: "Minimalist", desc: "Clean lines, softness, creative director energy",            c: "#6A7A8A" },
  "2a": { name: "Parisian Classic",     family: "Classic",    desc: "Breton, trench, cigarette pant, effortlessly undone",        c: "#8B5A5A" },
  "2b": { name: "Ivy / American Classic",family:"Classic",    desc: "Tailored blazers, oxfords, heritage colours",                c: "#4A6A4A" },
  "2c": { name: "Modern Classic",       family: "Classic",    desc: "Camel coat, cashmere crew, neutral spectrum",                c: "#9B7A5A" },
  "2d": { name: "Heritage / Countryside",family:"Classic",    desc: "Waxed jackets, tweed, olive and oxblood",                   c: "#7A6B4A" },
  "3a": { name: "Menswear-Inspired",    family: "Tailored",   desc: "Oversized blazer, wide-leg, tucked shirt",                  c: "#6B7A8B" },
  "3b": { name: "Sharp Power Suit",     family: "Tailored",   desc: "Nipped waist, sharp shoulder, authority coded",             c: "#3A3A3A" },
  "3c": { name: "Soft Tailoring",       family: "Tailored",   desc: "Unstructured blazer, fluid pant, earth tones",              c: "#8B7A6B" },
  "4a": { name: "Ethereal Romantic",    family: "Romantic",   desc: "Tiered, prairie, cotton voile, photographs in gardens",     c: "#B8887A" },
  "4b": { name: "Dark Romantic",        family: "Romantic",   desc: "Volume, asymmetry, black florals, romance with darkness",   c: "#6A3A7A" },
  "4c": { name: "Girlcore / Coquette",  family: "Romantic",   desc: "Bows, babydoll, balletcore, self-aware girlhood",           c: "#B87090" },
  "4d": { name: "Old Hollywood",        family: "Romantic",   desc: "Bias cut, mermaid, champagne and emerald",                  c: "#7A5A8B" },
  "5a": { name: "70s Boho Revival",     family: "Bohemian",   desc: "Maxi, suede, fringe, rust and gold",                       c: "#9B6A4A" },
  "5b": { name: "Artisan Craft",        family: "Bohemian",   desc: "Handwoven, embroidered, terracotta and indigo",             c: "#8B5A3A" },
  "5c": { name: "Festival / Free-Spirited",family:"Bohemian", desc: "Crochet, flutter sleeves, sunset tones",                    c: "#B87A3A" },
  "6a": { name: "Coastal Grandmother",  family: "Natural",    desc: "Wide-leg linen, oversized knit, cold beach walk",           c: "#6A8A8B" },
  "6b": { name: "Earth Mother",         family: "Natural",    desc: "Draped unstructured, oat and moss, artist energy",          c: "#6A7A5A" },
  "6c": { name: "Americana Casual",     family: "Natural",    desc: "Denim, chambray, tees, clogs",                              c: "#7A6B5A" },
  "7a": { name: "Elevated Sport",       family: "Sporty",     desc: "Leggings, tennis skirts, Pilates-to-brunch",               c: "#8A8AAA" },
  "7b": { name: "Techwear",             family: "Sporty",     desc: "Shells, cargos, taped seams, weather-ready",               c: "#4A5A6A" },
  "7c": { name: "Preppy Sport",         family: "Sporty",     desc: "Polos, tennis dresses, kelly green, country club",         c: "#5A8A5A" },
  "8a": { name: "Old Money",            family: "Preppy",     desc: "Cable knits, pleated skirts, Nantucket",                   c: "#6A7A4A" },
  "8b": { name: "Dark Academia",        family: "Preppy",     desc: "Tweed, turtlenecks, oxford shoes, library energy",         c: "#6B4A2A" },
  "8c": { name: "Modern Preppy",        family: "Preppy",     desc: "Rugby shirts, chinos, quilted jackets",                    c: "#B83A4A" },
  "9a": { name: "70s Vintage",          family: "Vintage",    desc: "Flares, high-waist, pussybow, mustard and rust",           c: "#9B6A2A" },
  "9b": { name: "90s Minimalism",       family: "Vintage",    desc: "Slip dress, tank, low-rise, nude palette",                 c: "#8B7A6A" },
  "9c": { name: "Y2K",                  family: "Vintage",    desc: "Low-rise, baby tee, rhinestones, pink and silver",         c: "#B86A8A" },
  "9d": { name: "Rockabilly",           family: "Vintage",    desc: "Circle skirts, halters, red lip, polka dots",              c: "#B83A3A" },
  "10a":{ name: "Gothic / Rick Owens",  family: "Edgy",       desc: "Drapey asymmetric, all-black, architectural",              c: "#3A3A4A" },
  "10b":{ name: "Punk / Hardcore",      family: "Edgy",       desc: "Tartan, studs, safety pins, subversion",                   c: "#8B2A2A" },
  "10c":{ name: "Moto / Hardware",      family: "Edgy",       desc: "Leather jacket, skinny jean, band tee, French-rock",       c: "#5A3A7A" },
  "10d":{ name: "Avant-Garde",          family: "Edgy",       desc: "Unfinished edges, exposed seams, sculptural",              c: "#2A2A4A" },
  "11a":{ name: "Luxury Streetwear",    family: "Streetwear", desc: "Oversized hoodie, drop-crotch, Fear of God codes",         c: "#7A6A5A" },
  "11b":{ name: "Skate Street",         family: "Streetwear", desc: "Baggy pant, graphic tee, skate sneaker",                   c: "#B85A2A" },
  "11c":{ name: "Hype / Collector",     family: "Streetwear", desc: "Sneaker-first, drops, collabs",                            c: "#5A2AB8" },
};

export const ARCHETYPE_IMG: Record<ArchetypeCode, string> = {
  "1a": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=75",
  "1b": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=75",
  "1c": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75",
  "1d": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=75",
  "2a": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=75",
  "2b": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=75",
  "2c": "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=75",
  "2d": "https://images.unsplash.com/photo-1506634572416-48cdfe7d4c6a?w=400&q=75",
  "3a": "https://images.unsplash.com/photo-1594938298603-c8148c4b4543?w=400&q=75",
  "3b": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=75",
  "3c": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=75",
  "4a": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=75",
  "4b": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=75",
  "4c": "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&q=75",
  "4d": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=75",
  "5a": "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=400&q=75",
  "5b": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=75",
  "5c": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=75",
  "6a": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=75",
  "6b": "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=75",
  "6c": "https://images.unsplash.com/photo-1472417583565-62e7bdeda490?w=400&q=75",
  "7a": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=75",
  "7b": "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&q=75",
  "7c": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=75",
  "8a": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=75",
  "8b": "https://images.unsplash.com/photo-1519682577862-22b62b24cb12?w=400&q=75",
  "8c": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=75",
  "9a": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=75",
  "9b": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=75",
  "9c": "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&q=75",
  "9d": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=75",
  "10a":"https://images.unsplash.com/photo-1594938298603-c8148c4b4543?w=400&q=75",
  "10b":"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=75",
  "10c":"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=75",
  "10d":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75",
  "11a":"https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&q=75",
  "11b":"https://images.unsplash.com/photo-1472417583565-62e7bdeda490?w=400&q=75",
  "11c":"https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=75",
};
