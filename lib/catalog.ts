/**
 * Product catalogue.
 *
 * Names, prices, strengths, ingredients, pack sizes and directions come from the
 * pharmacy's existing product listings. Marketing and efficacy claims from the
 * old listings were left out on purpose. Availability is not listed because no
 * stock data exists: the pharmacy confirms it when an order comes in.
 */

export type CategoryId = "prescriptions" | "everyday" | "vitamins" | "skincare" | "devices";

/** 3D packaging used by the product viewer and home scene. */
export type PackagingModel = "bottle" | "dropper" | "jar" | "spray" | "blister" | "carton";

export type Category = {
  id: CategoryId;
  name: string;
  /** Short, plain description for the category page. */
  description: string;
  /** Band colour, used the way pharma cartons colour-code a range. */
  band: string;
};

export type Product = {
  slug: string;
  name: string;
  /** Brand or maker name when the listing includes one. */
  brand?: string;
  category: CategoryId;
  requiresPrescription: boolean;
  price: number;
  form: string;
  strength?: string;
  size?: string;
  ingredients?: string;
  summary: string;
  /** Directions from the listing. Never set for prescription medicines. */
  directions?: string;
  image: string;
  imageAlt: string;
  model?: PackagingModel;
  /** Label + packaging tint for the 3D model. */
  tint?: "amber" | "clear" | "frosted" | "mint" | "white";
  keywords?: string[];
  featured?: boolean;
};

export const categories: Category[] = [
  {
    id: "prescriptions",
    name: "Prescription medicines",
    description:
      "Medicines we can only supply against a valid prescription. Send your prescription and a pharmacist checks it before anything is prepared.",
    band: "#7A2418",
  },
  {
    id: "everyday",
    name: "Everyday medicines & first aid",
    description: "Medicines and first-aid products you can buy without a prescription.",
    band: "#2F6B58",
  },
  {
    id: "vitamins",
    name: "Vitamins & supplements",
    description: "Vitamins, minerals and supplements for your daily routine.",
    band: "#B9831C",
  },
  {
    id: "skincare",
    name: "Skincare",
    description: "Serums, creams and balms for face and body.",
    band: "#86769F",
  },
  {
    id: "devices",
    name: "Health devices",
    description: "Thermometers, blood pressure monitors and test kits for use at home.",
    band: "#4F5D66",
  },
];

export const products: Product[] = [
  // Prescription medicines
  {
    slug: "amoxicillin-500mg-capsules",
    name: "Amoxicillin 500 mg capsules",
    category: "prescriptions",
    requiresPrescription: true,
    price: 34,
    form: "Capsules",
    strength: "500 mg",
    ingredients: "Amoxicillin",
    summary: "An antibiotic supplied only against a valid prescription.",
    image: "/products/amoxicillin-500mg-capsules.webp",
    imageAlt: "Amber pharmacy bottle labelled Amoxicillin 500 mg capsules",
    model: "bottle",
    tint: "amber",
    keywords: ["antibiotic", "amoxicillin"],
    featured: true,
  },
  {
    slug: "metformin-500mg-tablets",
    name: "Metformin hydrochloride 500 mg",
    category: "prescriptions",
    requiresPrescription: true,
    price: 45,
    form: "Extended-release tablets",
    strength: "500 mg",
    ingredients: "Metformin hydrochloride",
    summary: "Extended-release tablets supplied only against a valid prescription.",
    image: "/products/metformin-500mg-tablets.webp",
    imageAlt: "Amber pharmacy bottle labelled Metformin 500 mg",
    model: "bottle",
    tint: "amber",
    keywords: ["metformin", "diabetes"],
  },
  {
    slug: "rosuvastatin-10mg-tablets",
    name: "Rosuvastatin 10 mg",
    category: "prescriptions",
    requiresPrescription: true,
    price: 68,
    form: "Tablets",
    strength: "10 mg",
    ingredients: "Rosuvastatin calcium",
    summary: "A statin supplied only against a valid prescription.",
    image: "/products/rosuvastatin-10mg-tablets.webp",
    imageAlt: "Amber pharmacy bottle labelled Rosuvastatin 10 mg",
    model: "bottle",
    tint: "amber",
    keywords: ["statin", "cholesterol", "rosuvastatin"],
  },
  {
    slug: "ibuprofen-paracetamol-tablets",
    name: "Ibuprofen 400 mg + paracetamol 325 mg",
    category: "prescriptions",
    requiresPrescription: true,
    price: 34,
    form: "Tablets in a blister strip",
    strength: "400 mg / 325 mg",
    size: "10 tablets",
    ingredients: "Ibuprofen, paracetamol",
    summary: "Combination pain-relief tablets, supplied against a valid prescription.",
    image: "/products/ibuprofen-paracetamol-tablets.webp",
    imageAlt: "Blister strip of ten white tablets",
    model: "blister",
    keywords: ["pain", "ibuprofen", "paracetamol", "acetaminophen"],
  },
  {
    slug: "sublingual-peptide-drops",
    name: "Sublingual peptide drops",
    category: "prescriptions",
    requiresPrescription: true,
    price: 78,
    form: "Oral drops",
    strength: "25 mg/ml",
    ingredients: "Peptide complex",
    summary: "Oral drops in an amber glass dropper bottle, supplied against a valid prescription.",
    image: "/products/sublingual-peptide-drops.webp",
    imageAlt: "Amber glass dropper bottle with a black bulb",
    model: "dropper",
    tint: "amber",
    keywords: ["drops", "sublingual"],
  },

  // Everyday medicines & first aid
  {
    slug: "cetirizine-10mg-tablets",
    name: "Cetirizine 10 mg tablets",
    brand: "Aller-Clear",
    category: "everyday",
    requiresPrescription: false,
    price: 24.5,
    form: "Tablets",
    strength: "10 mg",
    ingredients: "Cetirizine hydrochloride 10 mg",
    summary: "Antihistamine tablets.",
    directions: "Take 1 tablet once daily.",
    image: "/products/cetirizine-10mg-tablets.webp",
    imageAlt: "Aller-Clear cetirizine carton",
    model: "carton",
    keywords: ["allergy", "antihistamine", "hay fever", "cetirizine"],
    featured: true,
  },
  {
    slug: "chlorhexidine-antiseptic-spray",
    name: "Antiseptic spray",
    brand: "Clinical Derma-Spray",
    category: "everyday",
    requiresPrescription: false,
    price: 18,
    form: "Spray",
    ingredients: "Chlorhexidine gluconate 0.5%, pro-vitamin B5",
    summary: "Antiseptic spray for minor cuts and scrapes.",
    directions: "Spray onto the affected area from about 10 cm away and let it air dry.",
    image: "/products/chlorhexidine-antiseptic-spray.webp",
    imageAlt: "White spray bottle labelled antiseptic spray",
    model: "spray",
    tint: "white",
    keywords: ["first aid", "antiseptic", "cuts", "chlorhexidine"],
  },

  // Vitamins & supplements
  {
    slug: "magnesium-l-threonate",
    name: "Magnesium L-threonate",
    category: "vitamins",
    requiresPrescription: false,
    price: 42,
    form: "Capsules",
    ingredients: "Magnesium L-threonate (Magtein®) 144 mg",
    summary: "Magnesium supplement in capsule form.",
    directions: "Take 2 capsules in the afternoon and 1 capsule two hours before bed, with water.",
    image: "/products/magnesium-l-threonate.webp",
    imageAlt: "Amber supplement bottle labelled Magnesium L-threonate",
    model: "bottle",
    tint: "amber",
    keywords: ["magnesium", "mineral"],
    featured: true,
  },
  {
    slug: "vitamin-d3-k2",
    name: "Vitamin D3 + K2",
    category: "vitamins",
    requiresPrescription: false,
    price: 36,
    form: "Softgels",
    ingredients: "Cholecalciferol (D3) 5000 IU, menaquinone-7 (K2) 100 mcg",
    summary: "Vitamin D3 and K2 in a softgel.",
    directions: "Take 1 softgel daily with a meal.",
    image: "/products/vitamin-d3-k2.webp",
    imageAlt: "Amber supplement bottle labelled Vitamin D3 and K2",
    model: "bottle",
    tint: "amber",
    keywords: ["vitamin d", "vitamin k", "d3", "k2"],
  },
  {
    slug: "bio-mineral-dual-capsule",
    name: "Bio-mineral dual capsule",
    brand: "Essential",
    category: "vitamins",
    requiresPrescription: false,
    price: 22,
    form: "Capsules",
    ingredients: "Magnesium, zinc and B-complex vitamins",
    summary: "Daily mineral and B-vitamin capsule.",
    directions: "Take 1 capsule in the morning.",
    image: "/products/bio-mineral-dual-capsule.webp",
    imageAlt: "Amber supplement bottle labelled Bio-mineral dual capsule",
    model: "bottle",
    tint: "amber",
    keywords: ["zinc", "magnesium", "b vitamins", "multivitamin"],
  },
  {
    slug: "sleep-complex",
    name: "Sleep complex",
    brand: "Circadian",
    category: "vitamins",
    requiresPrescription: false,
    price: 38,
    form: "Vegetable capsules",
    ingredients: "Melatonin 1 mg, L-theanine 200 mg, passionflower",
    summary: "Melatonin, L-theanine and passionflower in a vegetable capsule.",
    directions: "Take 2 capsules 45 minutes before bed.",
    image: "/products/sleep-complex.webp",
    imageAlt: "Amber supplement bottle labelled Sleep complex",
    model: "bottle",
    tint: "amber",
    keywords: ["sleep", "melatonin"],
  },

  // Skincare
  {
    slug: "nura-hydration-serum",
    name: "Hydration serum",
    brand: "Nura",
    category: "skincare",
    requiresPrescription: false,
    price: 46,
    form: "Serum",
    ingredients: "Hyaluronic acid, mint, aloe",
    summary: "A light hydrating serum with hyaluronic acid.",
    directions: "Apply 3–4 drops to freshly cleansed skin.",
    image: "/products/nura-hydration-serum.webp",
    imageAlt: "Nura hydration serum in a mint glass dropper bottle",
    model: "dropper",
    tint: "mint",
    keywords: ["serum", "hyaluronic", "face"],
    featured: true,
  },
  {
    slug: "vitamin-c-serum",
    name: "Vitamin C 20% serum",
    brand: "Vitality C+",
    category: "skincare",
    requiresPrescription: false,
    price: 89,
    form: "Serum",
    ingredients: "L-ascorbic acid 20%, ferulic acid 0.5%",
    summary: "Vitamin C serum for morning use.",
    directions:
      "Apply 4–5 drops to clean, dry skin each morning before moisturiser. Follow with a broad-spectrum sunscreen.",
    image: "/products/vitamin-c-serum.webp",
    imageAlt: "Amber dropper bottle labelled Vitamin C 20% serum",
    model: "dropper",
    tint: "amber",
    keywords: ["vitamin c", "serum", "face"],
  },
  {
    slug: "retinoid-night-balm",
    name: "Retinoid night balm",
    brand: "Retin-Oval",
    category: "skincare",
    requiresPrescription: false,
    price: 76,
    form: "Balm",
    ingredients: "Hydroxypinacolone retinoate 2%, squalane",
    summary: "A retinoid balm for evening use.",
    directions: "Apply a thin layer to face and neck at night. Start twice a week and build up gradually.",
    image: "/products/retinoid-night-balm.webp",
    imageAlt: "Amber glass jar labelled Retinoid night balm",
    model: "jar",
    tint: "amber",
    keywords: ["retinoid", "retinol", "night"],
  },
  {
    slug: "ceramide-cream",
    name: "Ceramide cream",
    brand: "Hydra-Cell",
    category: "skincare",
    requiresPrescription: false,
    price: 95,
    form: "Cream",
    ingredients: "Ceramides 3%, hyaluronic acid",
    summary: "A ceramide moisturising cream in a frosted glass jar.",
    directions: "Massage a pea-sized amount into clean skin morning and evening.",
    image: "/products/ceramide-cream.webp",
    imageAlt: "Frosted glass jar labelled Ceramide cream",
    model: "jar",
    tint: "frosted",
    keywords: ["moisturiser", "ceramide", "cream"],
    featured: true,
  },
  {
    slug: "derma-fine-calming-cream",
    name: "Calming repair cream",
    brand: "Derma-Fine",
    category: "skincare",
    requiresPrescription: false,
    price: 32,
    form: "Cream",
    size: "50 ml",
    ingredients: "Ceramide NP, squalane",
    summary: "A calming repair cream for sensitive skin.",
    directions: "Apply a pea-sized amount morning and night.",
    image: "/products/derma-fine-calming-cream.webp",
    imageAlt: "Derma-Fine calming repair cream in a pale pink tube",
    keywords: ["sensitive", "cream", "ceramide"],
  },
  {
    slug: "natures-alchemy-healing-balm",
    name: "Healing balm",
    brand: "Nature's Alchemy",
    category: "skincare",
    requiresPrescription: false,
    price: 19.5,
    form: "Ointment",
    size: "60 ml",
    ingredients: "Beeswax, calendula",
    summary: "A beeswax and calendula balm for dry skin.",
    directions: "Apply to dry skin as needed.",
    image: "/products/natures-alchemy-healing-balm.webp",
    imageAlt: "Nature's Alchemy healing balm in an amber jar with a gold lid",
    model: "jar",
    tint: "amber",
    keywords: ["balm", "dry skin", "beeswax"],
  },

  // Health devices
  {
    slug: "medtemp-digital-thermometer",
    name: "Digital thermometer",
    brand: "MedTemp",
    category: "devices",
    requiresPrescription: false,
    price: 28.5,
    form: "Device",
    summary: "Digital thermometer for oral or underarm use, with a backlit display and fever alert.",
    image: "/products/medtemp-digital-thermometer.webp",
    imageAlt: "MedTemp digital thermometer with a blue tip",
    keywords: ["thermometer", "temperature", "fever"],
  },
  {
    slug: "omron-wrist-blood-pressure-monitor",
    name: "Wrist blood pressure monitor",
    brand: "Omron",
    category: "devices",
    requiresPrescription: false,
    price: 89,
    form: "Device",
    summary: "Wrist cuff monitor that reads blood pressure and pulse, with an irregular heartbeat indicator and Bluetooth sync.",
    image: "/products/omron-wrist-blood-pressure-monitor.webp",
    imageAlt: "Omron wrist blood pressure monitor showing a reading",
    keywords: ["blood pressure", "bp", "monitor", "heart"],
    featured: true,
  },
  {
    slug: "diagcheck-a1c-kit",
    name: "A1c monitor kit",
    brand: "DiagCheck",
    category: "devices",
    requiresPrescription: false,
    price: 59.99,
    form: "Test kit",
    summary: "Home kit for checking HbA1c (glycated haemoglobin).",
    image: "/products/diagcheck-a1c-kit.webp",
    imageAlt: "DiagCheck A1c monitor kit carton",
    model: "carton",
    keywords: ["a1c", "hba1c", "diabetes", "test"],
  },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsIn = (id: CategoryId) => products.filter((p) => p.category === id);
export const featuredProducts = () => products.filter((p) => p.featured);

export const displayName = (p: Product) => (p.brand ? `${p.brand} ${p.name}` : p.name);

/** Simple ranked text search over the fields a customer would type. */
export function searchProducts(query: string, list: Product[] = products): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return list;
  const scored = list
    .map((p) => {
      const fields: [string, number][] = [
        [p.name, 5],
        [p.brand ?? "", 4],
        [(p.keywords ?? []).join(" "), 3],
        [p.ingredients ?? "", 3],
        [p.form, 2],
        [getCategory(p.category)?.name ?? "", 1],
        [p.summary, 1],
      ];
      let score = 0;
      for (const t of terms) {
        let hit = 0;
        for (const [text, weight] of fields) {
          if (text.toLowerCase().includes(t)) hit = Math.max(hit, weight);
        }
        if (!hit) return { p, score: 0 };
        score += hit;
      }
      return { p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((s) => s.p);
}
