// Protocols-teaser data. `skus` are display chips; `monthlySubPrice` is the
// subscribe-cadence per-shipment price for the bundle.

export interface MockProtocol {
  slug: string;
  name: string;
  durationDays: number;
  skus: string[];
  monthlySubPrice: number;
}

export const mockProtocols: MockProtocol[] = [
  {
    slug: "recovery-90",
    name: "Recovery 90",
    durationDays: 90,
    skus: ["BPC-157", "TB-500"],
    monthlySubPrice: 94,
  },
  {
    slug: "metabolic-90",
    name: "Metabolic 90",
    durationDays: 90,
    skus: ["Semaglutide", "AOD-9604"],
    monthlySubPrice: 128,
  },
  {
    slug: "dermal-glow-90",
    name: "Dermal Glow 90",
    durationDays: 90,
    skus: ["GHK-Cu", "Epitalon"],
    monthlySubPrice: 84,
  },
];

// ---------------------------------------------------------------------------
// Rich protocol model — drives the /protocols index and /protocols/[slug] pages.
// Framed as typical research dosing observed in published literature. RUO only.
// ---------------------------------------------------------------------------

export type ProtocolCategory =
  | "Tissue repair"
  | "Metabolic"
  | "Anti-aging"
  | "Performance"
  | "Sleep";

export type TimingSlot = "AM" | "PM" | "PWO";

export interface ProtocolPeptide {
  /** Product slug for PDP linking, when a matching catalog item exists. */
  productSlug?: string;
  name: string;
  /** Typical research dosing observed in literature — not a prescription. */
  dose: string;
  /** Human-readable schedule, e.g. "Once daily, AM". */
  schedule: string;
  /** Which timing bands this compound occupies in the weekly view. */
  slots: TimingSlot[];
  /** Days of a 7-day week this is dosed (0 = Mon … 6 = Sun). */
  daysOfWeek: number[];
  /** Reconstitution volume per vial, in mL of bacteriostatic water. */
  bacWaterMl: number;
}

export interface ProtocolMonitoringItem {
  metric: string;
  cadence: string;
  note: string;
}

export interface ProtocolFaqItem {
  q: string;
  a: string;
}

export interface Protocol {
  slug: string;
  name: string;
  category: ProtocolCategory;
  /** One-line positioning for cards and hero. */
  tagline: string;
  durationWeeks: number;
  /** 1–5; renders the intensity meter. */
  intensity: number;
  /** Estimated total compound cost across the protocol window (USD). */
  estCost: number;
  /** Short chips shown on the card. */
  pairingTags: string[];
  peptides: ProtocolPeptide[];
  monitoring: ProtocolMonitoringItem[];
  /** DOIs into mock-citations registry. */
  citationDois: string[];
  faq: ProtocolFaqItem[];
  /** Syringe count guidance for the full window. */
  syringes: string;
  storageNote: string;
}

export const PROTOCOL_CATEGORIES: ProtocolCategory[] = [
  "Tissue repair",
  "Metabolic",
  "Anti-aging",
  "Performance",
  "Sleep",
];

const DAILY = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [0, 1, 2, 3, 4];

export const protocols: Protocol[] = [
  {
    slug: "soft-tissue-repair-8w",
    name: "Soft-Tissue Repair 8W",
    category: "Tissue repair",
    tagline: "A repair-axis pairing studied for tendon, ligament, and gut-lining models.",
    durationWeeks: 8,
    intensity: 2,
    estCost: 410,
    pairingTags: ["BPC-157 + TB-500", "Repair axis"],
    peptides: [
      {
        productSlug: "bpc-157",
        name: "BPC-157",
        dose: "250–500 mcg/day (typical research dosing)",
        schedule: "Once daily, AM",
        slots: ["AM"],
        daysOfWeek: DAILY,
        bacWaterMl: 2,
      },
      {
        productSlug: "tb-500",
        name: "TB-500",
        dose: "2–2.5 mg, twice weekly (typical research dosing)",
        schedule: "Twice weekly, PM",
        slots: ["PM"],
        daysOfWeek: [0, 3],
        bacWaterMl: 2,
      },
    ],
    monitoring: [
      { metric: "Range of motion", cadence: "Weekly", note: "Photograph or goniometer reading at a fixed joint angle." },
      { metric: "Subjective pain index", cadence: "Daily", note: "0–10 scale logged at the same time each day." },
      { metric: "Bodyweight", cadence: "Weekly", note: "Fasted, same scale, to normalize dose-per-kg observations." },
    ],
    citationDois: [
      "10.1152/japplphysiol.00945.2010",
      "10.1007/s00441-019-03016-8",
      "10.3390/molecules191119066",
    ],
    faq: [
      { q: "Why are the two compounds dosed on different cadences?", a: "Published models commonly study BPC-157 daily and TB-500 a few times weekly, reflecting their differing observed half-lives in the literature." },
      { q: "Is a fasted state required?", a: "No fasted-state requirement is associated with this pairing in the research literature. Timing is for protocol consistency, not metabolic state." },
      { q: "Can the window be extended past 8 weeks?", a: "Many comparative designs run an 8-week observation window before a washout. Extending is a study-design choice; the catalog supports continued supply." },
      { q: "Are the compounds reconstituted together?", a: "No. Each compound is reconstituted in its own vial with its own bacteriostatic water volume, then drawn separately." },
      { q: "What purity should I expect?", a: "Each released lot ships with a per-lot certificate of analysis reporting HPLC purity and mass-spec identity." },
      { q: "Does this protocol make any health claim?", a: "No. It summarizes dosing observed in published research for laboratory study only. It is not medical advice and makes no health claim." },
    ],
    syringes: "~70 insulin syringes (U-100, 0.5 mL) across the window",
    storageNote: "Store lyophilized vials at −20°C; refrigerate reconstituted solution at 2–8°C and use within the stated window.",
  },
  {
    slug: "metabolic-recomposition-12w",
    name: "Metabolic Recomposition 12W",
    category: "Metabolic",
    tagline: "A metabolic-axis design pairing an incretin analog with a lipolytic fragment.",
    durationWeeks: 12,
    intensity: 4,
    estCost: 980,
    pairingTags: ["Incretin + fragment", "12-week titration"],
    peptides: [
      {
        productSlug: "semaglutide",
        name: "Semaglutide",
        dose: "0.25 mg/week, titrated (typical research dosing)",
        schedule: "Once weekly, AM",
        slots: ["AM"],
        daysOfWeek: [0],
        bacWaterMl: 2,
      },
      {
        productSlug: "aod-9604",
        name: "AOD-9604",
        dose: "300 mcg/day, fasted (typical research dosing)",
        schedule: "Once daily, fasted AM",
        slots: ["AM"],
        daysOfWeek: DAILY,
        bacWaterMl: 2,
      },
    ],
    monitoring: [
      { metric: "Bodyweight", cadence: "Weekly", note: "Fasted, same scale and time of day." },
      { metric: "Waist circumference", cadence: "Every 2 weeks", note: "Measured at the navel, exhaled, fixed tape tension." },
      { metric: "Fasting glucose", cadence: "Weekly", note: "Where bloodwork is part of the study design." },
      { metric: "Resting heart rate", cadence: "Daily", note: "On waking, before rising." },
    ],
    citationDois: ["10.2174/138161211796196954"],
    faq: [
      { q: "Why is the incretin analog titrated?", a: "Published metabolic research commonly starts low and steps the dose to characterize tolerance across a window. The first weeks observe the lowest dose." },
      { q: "Does AOD-9604 require a fasted state?", a: "The lipolytic fragment is commonly studied fasted in the literature; this protocol schedules it in the fasted AM band for that reason." },
      { q: "Can the two be combined in one syringe?", a: "No. They are reconstituted and drawn separately; cadences differ (weekly vs daily)." },
      { q: "What does the est. cost include?", a: "It estimates compound supply across the 12-week window at catalog pricing and excludes consumables and shipping." },
      { q: "Is this protocol a weight-loss program?", a: "No. It is a research dosing summary for laboratory study only and makes no health or weight outcome claim." },
      { q: "How is lot continuity handled over 12 weeks?", a: "Where possible, supply is drawn from consistent lots to reduce batch variability; each shipment carries its own COA." },
    ],
    syringes: "~95 insulin syringes (U-100, 0.5 mL) across the window",
    storageNote: "Store lyophilized vials at −20°C; refrigerate reconstituted solution at 2–8°C and avoid freeze-thaw cycles.",
  },
  {
    slug: "longevity-axis-16w",
    name: "Longevity Axis 16W",
    category: "Anti-aging",
    tagline: "A long-window anti-aging design built around telomere- and dermal-model compounds.",
    durationWeeks: 16,
    intensity: 2,
    estCost: 620,
    pairingTags: ["Epitalon + GHK-Cu", "Cyclic dosing"],
    peptides: [
      {
        productSlug: "epitalon",
        name: "Epitalon",
        dose: "5–10 mg/day, 10-day cycles (typical research dosing)",
        schedule: "Daily during cycle weeks, PM",
        slots: ["PM"],
        daysOfWeek: DAILY,
        bacWaterMl: 3,
      },
      {
        productSlug: "ghk-cu",
        name: "GHK-Cu",
        dose: "1–2 mg/day (typical research dosing)",
        schedule: "Once daily, AM",
        slots: ["AM"],
        daysOfWeek: DAILY,
        bacWaterMl: 3,
      },
    ],
    monitoring: [
      { metric: "Skin elasticity (cutometer or photo)", cadence: "Every 4 weeks", note: "Fixed lighting and angle for photographic comparison." },
      { metric: "Sleep duration", cadence: "Daily", note: "Tracker or log; relevant to the PM compound timing." },
      { metric: "Bodyweight", cadence: "Weekly", note: "Fasted, same scale." },
    ],
    citationDois: ["10.2174/13816128113199990421"],
    faq: [
      { q: "Why is one compound dosed in cycles?", a: "Telomere-model research commonly studies Epitalon in short repeated cycles rather than continuously; the timeline reflects that cyclic structure." },
      { q: "Are the AM and PM timings important?", a: "The copper peptide is placed in the AM band and the telomere-model compound in the PM band for protocol consistency across the long window." },
      { q: "Does GHK-Cu stain skin or surfaces?", a: "Copper peptide solutions are blue-tinted; use polypropylene where adsorption matters and avoid contact with light-colored surfaces." },
      { q: "How much bacteriostatic water is needed?", a: "The reconstitution panel auto-calculates total volume from the per-vial values in this protocol." },
      { q: "Is 16 weeks a fixed requirement?", a: "No. Longevity designs vary; 16 weeks is a representative comparative window. Supply can continue or stop at a washout." },
      { q: "Does this claim anti-aging benefits?", a: "No. It summarizes research dosing for laboratory study only and makes no anti-aging or health claim." },
    ],
    syringes: "~110 insulin syringes (U-100, 0.5 mL) across the window",
    storageNote: "GHK-Cu is light- and temperature-sensitive — refrigerate at 2–8°C; store other vials lyophilized at −20°C.",
  },
  {
    slug: "gh-axis-performance-10w",
    name: "GH-Axis Performance 10W",
    category: "Performance",
    tagline: "A secretagogue pairing studied for pulsatile GH-axis research models.",
    durationWeeks: 10,
    intensity: 3,
    estCost: 540,
    pairingTags: ["CJC-1295 + Ipamorelin", "Pulsatile"],
    peptides: [
      {
        productSlug: "cjc-1295",
        name: "CJC-1295 (no DAC)",
        dose: "100 mcg, post-workout & PM (typical research dosing)",
        schedule: "Post-workout and pre-sleep",
        slots: ["PWO", "PM"],
        daysOfWeek: DAILY,
        bacWaterMl: 2,
      },
      {
        productSlug: "ipamorelin",
        name: "Ipamorelin",
        dose: "100 mcg, post-workout & PM (typical research dosing)",
        schedule: "Post-workout and pre-sleep",
        slots: ["PWO", "PM"],
        daysOfWeek: DAILY,
        bacWaterMl: 2,
      },
    ],
    monitoring: [
      { metric: "Training performance", cadence: "Per session", note: "Log primary lifts or output metrics." },
      { metric: "Sleep score", cadence: "Daily", note: "Relevant to the pre-sleep dose timing." },
      { metric: "Bodyweight & waist", cadence: "Weekly", note: "Fasted, same scale and tape tension." },
    ],
    citationDois: ["10.1016/j.vph.2018.02.005"],
    faq: [
      { q: "Why post-workout and pre-sleep timing?", a: "Secretagogue research commonly studies dosing around natural GH pulses — post-exercise and early sleep — which the PWO and PM bands represent." },
      { q: "Can the two be drawn in one syringe?", a: "They are frequently co-administered in research and may be drawn together if reconstituted to compatible volumes; many protocols still draw separately for dosing accuracy." },
      { q: "Is a fasted state needed at the PWO dose?", a: "A short window without food is commonly observed around secretagogue dosing in the literature to limit blunting; follow your study design." },
      { q: "What is the intensity meter based on?", a: "It reflects dosing frequency and handling burden relative to other catalog protocols, not any physiological effect." },
      { q: "How many syringes will I need?", a: "Roughly two draws per dosing day across 10 weeks; the hero lists the full-window estimate." },
      { q: "Does this protocol promise performance gains?", a: "No. It is a research dosing summary for laboratory study only and makes no performance or health claim." },
    ],
    syringes: "~140 insulin syringes (U-100, 0.5 mL) across the window",
    storageNote: "Store lyophilized vials at −20°C; refrigerate reconstituted solution at 2–8°C and use within the stated window.",
  },
  {
    slug: "sleep-recovery-6w",
    name: "Sleep & Recovery 6W",
    category: "Sleep",
    tagline: "A short PM-band design pairing a secretagogue with a pineal-model compound.",
    durationWeeks: 6,
    intensity: 1,
    estCost: 290,
    pairingTags: ["Ipamorelin + Epitalon", "PM only"],
    peptides: [
      {
        productSlug: "ipamorelin",
        name: "Ipamorelin",
        dose: "100 mcg, pre-sleep (typical research dosing)",
        schedule: "Once daily, PM",
        slots: ["PM"],
        daysOfWeek: DAILY,
        bacWaterMl: 2,
      },
      {
        productSlug: "epitalon",
        name: "Epitalon",
        dose: "5 mg/day, 10-day cycle (typical research dosing)",
        schedule: "Daily during cycle, PM",
        slots: ["PM"],
        daysOfWeek: DAILY,
        bacWaterMl: 3,
      },
    ],
    monitoring: [
      { metric: "Sleep score / duration", cadence: "Daily", note: "Primary metric for this PM-band design." },
      { metric: "Time to sleep onset", cadence: "Daily", note: "Self-reported or tracker-derived." },
      { metric: "Morning resting heart rate", cadence: "Daily", note: "On waking, before rising." },
    ],
    citationDois: ["10.1007/s10787-020-00750-2"],
    faq: [
      { q: "Why is everything in the PM band?", a: "Both compounds are commonly studied near sleep onset in the literature; consolidating to the PM band keeps the protocol simple." },
      { q: "Is 6 weeks enough to observe anything?", a: "Sleep-metric research often uses short windows with daily logging; 6 weeks is a representative observation period." },
      { q: "Does the pineal-model compound run continuously?", a: "It is scheduled in a 10-day cycle within the window, consistent with common research designs." },
      { q: "Can I move the dose earlier in the evening?", a: "Timing is a study-design choice; the PM band represents pre-sleep dosing observed in the literature." },
      { q: "What consumables are needed?", a: "Bacteriostatic water and insulin syringes; the reconstitution panel computes the totals." },
      { q: "Does this claim to improve sleep?", a: "No. It summarizes research dosing for laboratory study only and makes no sleep or health claim." },
    ],
    syringes: "~50 insulin syringes (U-100, 0.5 mL) across the window",
    storageNote: "Store lyophilized vials at −20°C; refrigerate reconstituted solution at 2–8°C and avoid freeze-thaw cycles.",
  },
  {
    slug: "gut-repair-6w",
    name: "Gut-Lining Repair 6W",
    category: "Tissue repair",
    tagline: "A focused single-axis design studied in gastrointestinal-lining models.",
    durationWeeks: 6,
    intensity: 1,
    estCost: 210,
    pairingTags: ["BPC-157 mono", "Oral or injectable"],
    peptides: [
      {
        productSlug: "bpc-157",
        name: "BPC-157",
        dose: "250–500 mcg/day (typical research dosing)",
        schedule: "Twice daily, AM and PM",
        slots: ["AM", "PM"],
        daysOfWeek: DAILY,
        bacWaterMl: 2,
      },
    ],
    monitoring: [
      { metric: "Digestive symptom index", cadence: "Daily", note: "0–10 scale at fixed times." },
      { metric: "Bodyweight", cadence: "Weekly", note: "Fasted, same scale." },
      { metric: "Subjective energy", cadence: "Daily", note: "Logged on a fixed scale." },
    ],
    citationDois: [
      "10.2174/138161211796196954",
      "10.1016/j.ejphar.2007.05.072",
    ],
    faq: [
      { q: "Why split the dose AM and PM?", a: "Gastrointestinal-model research commonly splits the daily amount across two administrations; the timeline reflects that." },
      { q: "Is the single-compound design less effective?", a: "Effectiveness is not claimed. A focused single-axis design isolates one variable, which some research questions prefer." },
      { q: "How much bacteriostatic water per vial?", a: "2 mL per vial in this protocol; the reconstitution panel totals it across the window." },
      { q: "Can this be extended or repeated?", a: "Yes, as a study-design choice; a washout is commonly observed between repeated windows." },
      { q: "What documentation ships with it?", a: "A per-lot certificate of analysis with HPLC purity and mass-spec identity accompanies the released lot." },
      { q: "Does this treat any condition?", a: "No. It is a research dosing summary for laboratory study only and makes no medical claim." },
    ],
    syringes: "~85 insulin syringes (U-100, 0.5 mL) across the window",
    storageNote: "Store lyophilized vials at −20°C; refrigerate reconstituted solution at 2–8°C and use within the stated window.",
  },
];

export function getProtocol(slug: string): Protocol | undefined {
  return protocols.find((p) => p.slug === slug);
}

/** Total bacteriostatic water across the stack, summed per peptide vial. */
export function totalBacWaterMl(protocol: Protocol): number {
  return protocol.peptides.reduce((sum, p) => sum + p.bacWaterMl, 0);
}
