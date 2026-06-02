"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Brand ──────────────────────────────────────────────────────────────────
const GOLD = "#B8A44C";
const GOLD_HOVER = "#7A6B2A";

// ─── Types ──────────────────────────────────────────────────────────────────

type Option = {
  id: string;
  label: string;
  detail?: string;
  tags: string[];
};

type Question = {
  id: string;
  step: number;
  question: string;
  subtext?: string;
  options: Option[];
};

type ProductRec = {
  slug: string;
  name: string;
  category: string;
  price: number;
  size: string;
  tagline: string;
  why: string;
  tags: string[];
};

// ─── Product Catalog (subset relevant for recommendations) ────────────────────
// Prices and slugs verified against src/lib/products.ts.

const PRODUCTS: ProductRec[] = [
  { slug: "bpc-157", name: "BPC-157", category: "Recovery & Healing", price: 50, size: "5mg", tagline: "Body Protection Compound", why: "For recovery-model research: angiogenesis, NO-pathway modulation, and VEGFR2 activation are studied across the inflammatory-to-proliferative tissue-repair transition in rodent models.", tags: ["recovery", "tendon", "gi", "in-vitro", "animal", "endpoint-repair", "novice", "intermediate"] },
  { slug: "tb-500", name: "TB-500", category: "Recovery & Healing", price: 90, size: "5mg", tagline: "Thymosin Beta-4 Fragment", why: "For tissue-remodeling research: an actin-sequestering fragment studied for anti-inflammatory and angiogenic activity — frequently paired with BPC-157 in full-phase recovery study designs.", tags: ["recovery", "tendon", "cardiac", "animal", "endpoint-repair", "intermediate"] },
  { slug: "wolverine-blend", name: "Wolverine Blend", category: "Recovery & Healing", price: 120, size: "BPC-157 + TB-500 + GHK-Cu", tagline: "Triple Recovery Blend", why: "For multi-phase recovery-model research: combines anti-inflammatory, angiogenic, and ECM-remodeling mechanisms in one preparation for studies spanning all three repair phases.", tags: ["recovery", "tendon", "cardiac", "animal", "endpoint-repair", "intermediate", "advanced"] },
  { slug: "cjc-1295-ipamorelin", name: "CJC-1295 / Ipamorelin", category: "Growth Hormone", price: 90, size: "10mg", tagline: "GHRH + GHRP Combination", why: "For GH-axis research: a GHRH analog combined with a selective GHRP, a pairing studied for synergistic GH pulse amplitude relative to either compound alone (Bowers, 1998).", tags: ["gh-axis", "muscle", "endpoint-composition", "intermediate", "advanced"] },
  { slug: "ipamorelin", name: "Ipamorelin", category: "Growth Hormone", price: 50, size: "5mg", tagline: "Selective GHRP", why: "For GH-secretagogue research: among the most selective GHRPs studied, producing GH pulses without the cortisol, ACTH, or prolactin elevation seen with less selective secretagogues.", tags: ["gh-axis", "muscle", "endpoint-composition", "novice", "intermediate"] },
  { slug: "sermorelin", name: "Sermorelin", category: "Growth Hormone", price: 90, size: "5mg", tagline: "GHRH(1-29) Analog", why: "For GH-axis pulsatility research: a GHRH(1-29) analog with a short half-life studied for physiologically patterned, pulsatile GH stimulation in preclinical models.", tags: ["gh-axis", "longevity", "muscle", "endpoint-composition", "intermediate"] },
  { slug: "tesamorelin", name: "Tesamorelin", category: "Growth Hormone", price: 90, size: "5mg", tagline: "Stabilized GHRH Analog", why: "For metabolic GH-axis research: a stabilized GHRH analog studied for visceral-adipose endpoints and IGF-1 response in clinical and preclinical literature.", tags: ["gh-axis", "metabolic", "endpoint-composition", "advanced"] },
  { slug: "mk-677", name: "MK-677 (Ibutamoren)", category: "Growth Hormone", price: 90, size: "25mg x 30ct", tagline: "Oral GH Secretagogue", why: "For oral GH-secretagogue research: a non-peptide GHSR-1a agonist with a long half-life, studied for sustained IGF-1 elevation in extended-duration protocols.", tags: ["gh-axis", "muscle", "sleep", "endpoint-composition", "novice"] },
  { slug: "semaglutide", name: "Semaglutide", category: "Weight Management", price: 99, size: "5mg", tagline: "GLP-1 Receptor Agonist", why: "For metabolic research: a long-acting GLP-1 receptor agonist extensively characterized for body-weight and glycemic endpoints across the STEP and SELECT trial programs.", tags: ["metabolic", "endpoint-metabolic", "intermediate", "advanced"] },
  { slug: "tirzepatide", name: "Tirzepatide", category: "Weight Management", price: 180, size: "10mg", tagline: "GLP-1 / GIP Dual Agonist", why: "For dual-incretin research: a GIP/GLP-1 dual agonist studied for additive effects on body-weight and beta-cell endpoints relative to mono-agonists (SURMOUNT program).", tags: ["metabolic", "endpoint-metabolic", "advanced"] },
  { slug: "retatrutide", name: "Retatrutide", category: "Weight Management", price: 300, size: "10mg", tagline: "Triple Receptor Agonist", why: "For triple-incretin research: a GIP/GLP-1/glucagon agonist studied for body-weight and hepatic-fat endpoints across dose cohorts (NEJM Phase 2, 2023).", tags: ["metabolic", "endpoint-metabolic", "advanced"] },
  { slug: "aod-9604", name: "AOD-9604", category: "Weight Management", price: 90, size: "5mg", tagline: "hGH Fragment 176-191", why: "For lipolysis research: a C-terminal hGH fragment studied for adipose-tissue endpoints without the IGF-1 axis activity of full-length GH.", tags: ["metabolic", "endpoint-metabolic", "novice", "intermediate"] },
  { slug: "ghk-cu", name: "GHK-Cu", category: "Longevity", price: 90, size: "50mg", tagline: "Copper Peptide Complex", why: "For ECM and dermal-cosmetic research: a copper-binding tripeptide studied for gene-expression modulation across collagen synthesis, Nrf2 antioxidant defense, and tissue remodeling.", tags: ["longevity", "dermal", "recovery", "endpoint-repair", "endpoint-longevity", "novice"] },
  { slug: "glow-blend", name: "Glow Blend", category: "Longevity", price: 96, size: "GHK-Cu + BPC-157 + TB-500", tagline: "Dermal & Recovery Blend", why: "For dermal-cosmetic research: combines a copper peptide with repair-phase compounds for studies on ECM remodeling and skin-model endpoints.", tags: ["dermal", "recovery", "endpoint-repair", "endpoint-longevity", "novice", "intermediate"] },
  { slug: "nad-plus", name: "NAD+", category: "Longevity", price: 144, size: "100mg", tagline: "Nicotinamide Adenine Dinucleotide", why: "For longevity and energy-metabolism research: a foundational coenzyme studied for sirtuin activation, PARP-mediated DNA repair, and mitochondrial biogenesis via PGC-1alpha.", tags: ["longevity", "metabolic", "endpoint-longevity", "novice", "intermediate"] },
  { slug: "epitalon", name: "Epitalon", category: "Longevity", price: 90, size: "10mg", tagline: "Telomere Peptide", why: "For telomere-biology research: a tetrapeptide studied for telomerase activity and telomere-length endpoints in vitro and in rodent longevity models (Khavinson).", tags: ["longevity", "immune", "endpoint-longevity", "intermediate", "advanced"] },
  { slug: "mots-c", name: "MOTS-c", category: "Longevity", price: 240, size: "10mg", tagline: "Mitochondria-Derived Peptide", why: "For mitochondrial-metabolism research: a mitochondrial-encoded peptide studied for AMPK activation and GLUT4 translocation as an exercise-mimetic in metabolic models.", tags: ["longevity", "metabolic", "endpoint-longevity", "endpoint-metabolic", "advanced"] },
  { slug: "ss-31", name: "SS-31 (Elamipretide)", category: "Longevity", price: 144, size: "10mg", tagline: "Cardiolipin-Targeting Peptide", why: "For mitochondrial-protection research: a cardiolipin-targeting peptide studied for ischemia-reperfusion and cardiac-model endpoints (Szeto, 2008).", tags: ["longevity", "cardiac", "endpoint-longevity", "intermediate", "advanced"] },
  { slug: "selank", name: "Selank", category: "Cognitive", price: 60, size: "10mg", tagline: "Anxiolytic Tuftsin Analog", why: "For neuro and stress-model research: a non-GABAergic anxiolytic studied for BDNF upregulation and IL-6 immunomodulation without sedation in preclinical models.", tags: ["neuro", "immune", "endpoint-neuro", "novice", "intermediate"] },
  { slug: "semax", name: "Semax", category: "Cognitive", price: 84, size: "5mg", tagline: "ACTH(4-7)PGP Analog", why: "For neuroprotection research: an ACTH(4-10) fragment studied for BDNF and VEGF upregulation in cerebral-ischemia models without cortisol activation.", tags: ["neuro", "endpoint-neuro", "intermediate", "advanced"] },
  { slug: "dsip", name: "DSIP", category: "Cognitive", price: 144, size: "10mg", tagline: "Delta Sleep-Inducing Peptide", why: "For sleep-architecture research: a nonapeptide studied for delta-wave EEG promotion and HPA-axis modulation in preclinical sleep models.", tags: ["neuro", "endpoint-neuro", "intermediate"] },
  { slug: "thymosin-alpha-1", name: "Thymosin Alpha-1", category: "Immune", price: 119, size: "5mg", tagline: "Immune Modulator", why: "For immune-modulation research: a thymic peptide studied for TLR signaling, Th1 polarization, and NK-cell activation in antiviral and immune-senescence models.", tags: ["immune", "longevity", "endpoint-immune", "endpoint-longevity", "intermediate", "advanced"] },
  { slug: "ll-37", name: "LL-37", category: "Immune", price: 90, size: "5mg", tagline: "Cathelicidin Peptide", why: "For innate-immunity research: a human cathelicidin fragment studied for antimicrobial and immunomodulatory endpoints in host-defense models.", tags: ["immune", "endpoint-immune", "intermediate", "advanced"] },
  { slug: "kpv", name: "KPV", category: "Immune", price: 60, size: "10mg", tagline: "Alpha-MSH Tripeptide", why: "For inflammation research: an alpha-MSH-derived tripeptide studied for NF-kB pathway modulation in gut and mucosal inflammation models.", tags: ["immune", "gi", "endpoint-immune", "endpoint-repair", "novice", "intermediate"] },
];

// ─── Quiz Questions ───────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "domain",
    step: 1,
    question: "What is your primary research domain?",
    subtext: "Select the area your study is investigating.",
    options: [
      { id: "recovery", label: "Recovery & tissue repair", detail: "Wound, tendon, GI, and connective-tissue models", tags: ["recovery", "tendon"] },
      { id: "metabolic", label: "Metabolic & body composition", detail: "Adipose, glycemic, and GH-axis endpoints", tags: ["metabolic"] },
      { id: "neuro", label: "Neuro & cognition", detail: "BDNF, anxiolytic, and neuroprotection models", tags: ["neuro"] },
      { id: "immune", label: "Immune modulation", detail: "Innate defense and immune-senescence models", tags: ["immune"] },
      { id: "longevity", label: "Longevity & mitochondrial", detail: "Telomere, NAD+, and mitochondrial endpoints", tags: ["longevity"] },
      { id: "dermal", label: "Dermal & cosmetic", detail: "ECM remodeling and skin-model endpoints", tags: ["dermal"] },
    ],
  },
  {
    id: "study",
    step: 2,
    question: "What study type are you running?",
    subtext: "This shapes which preparations and formats fit your protocol.",
    options: [
      { id: "in-vitro", label: "In vitro", detail: "Cell culture and biochemical assays", tags: ["in-vitro"] },
      { id: "animal", label: "Animal model", detail: "Rodent or other preclinical in vivo models", tags: ["animal"] },
      { id: "both", label: "Both in vitro and animal", detail: "Translational study spanning both", tags: ["in-vitro", "animal"] },
    ],
  },
  {
    id: "endpoint",
    step: 3,
    question: "What is your priority endpoint?",
    subtext: "We weight recommendations toward compounds characterized for this readout.",
    options: [], // Dynamically populated based on domain
  },
  {
    id: "experience",
    step: 4,
    question: "Your experience with this compound class?",
    subtext: "This helps us match protocol complexity to your methodology.",
    options: [
      { id: "novice", label: "New to this compound class", detail: "Prefer well-characterized, single-mechanism compounds", tags: ["novice"] },
      { id: "intermediate", label: "Some prior experience", detail: "Comfortable with reconstitution and dosing math", tags: ["intermediate"] },
      { id: "advanced", label: "Advanced", detail: "Running multi-compound or dose-response designs", tags: ["advanced"] },
    ],
  },
];

// Priority-endpoint options by research domain.
const ENDPOINT_MAP: Record<string, Option[]> = {
  recovery: [
    { id: "repair", label: "Tissue repair rate", detail: "Healing kinetics, angiogenesis, ECM", tags: ["endpoint-repair"] },
    { id: "inflammation", label: "Inflammation markers", detail: "Cytokine and inflammatory readouts", tags: ["endpoint-repair", "endpoint-immune"] },
    { id: "gi", label: "GI / mucosal protection", detail: "Gut epithelium and mucosal models", tags: ["endpoint-repair", "gi"] },
  ],
  metabolic: [
    { id: "weight", label: "Body-weight / adiposity", detail: "Adipose mass and lipolysis endpoints", tags: ["endpoint-metabolic"] },
    { id: "glycemic", label: "Glycemic control", detail: "Insulin sensitivity and glucose handling", tags: ["endpoint-metabolic"] },
    { id: "composition", label: "Lean-mass / GH axis", detail: "IGF-1 and body-composition readouts", tags: ["endpoint-composition"] },
  ],
  neuro: [
    { id: "cognition", label: "Cognition & memory", detail: "BDNF and learning-model endpoints", tags: ["endpoint-neuro"] },
    { id: "anxiety", label: "Anxiety / stress models", detail: "Anxiolytic and HPA-axis readouts", tags: ["endpoint-neuro"] },
    { id: "neuroprotect", label: "Neuroprotection", detail: "Ischemia and injury-model endpoints", tags: ["endpoint-neuro"] },
  ],
  immune: [
    { id: "modulation", label: "Immune modulation", detail: "Th1/NK and cytokine endpoints", tags: ["endpoint-immune"] },
    { id: "antimicrobial", label: "Host defense", detail: "Antimicrobial and innate-immunity models", tags: ["endpoint-immune"] },
    { id: "senescence", label: "Immune senescence", detail: "Aging-related immune endpoints", tags: ["endpoint-immune", "endpoint-longevity"] },
  ],
  longevity: [
    { id: "telomere", label: "Telomere biology", detail: "Telomerase and telomere-length endpoints", tags: ["endpoint-longevity"] },
    { id: "mito", label: "Mitochondrial function", detail: "Bioenergetic and cardiolipin endpoints", tags: ["endpoint-longevity"] },
    { id: "nad", label: "NAD+ / sirtuin pathway", detail: "Coenzyme and sirtuin-activation endpoints", tags: ["endpoint-longevity", "endpoint-metabolic"] },
  ],
  dermal: [
    { id: "collagen", label: "Collagen / ECM remodeling", detail: "Dermal matrix synthesis endpoints", tags: ["endpoint-repair", "endpoint-longevity"] },
    { id: "antioxidant", label: "Antioxidant defense", detail: "Nrf2 and oxidative-stress endpoints", tags: ["endpoint-longevity"] },
    { id: "repair-skin", label: "Skin repair", detail: "Wound-closure and skin-model endpoints", tags: ["endpoint-repair"] },
  ],
};

// ─── Scoring Logic ────────────────────────────────────────────────────────────

function scoreProducts(answers: Record<string, string[]>): ProductRec[] {
  const allTags = new Set(Object.values(answers).flat());

  const scored = PRODUCTS.map((p) => {
    let score = 0;
    p.tags.forEach((tag) => {
      if (allTags.has(tag)) score += 2;
    });
    // Bonus: exact domain match
    const domain = answers["domain"]?.[0];
    if (domain && p.tags.includes(domain)) score += 3;
    // Priority endpoint is heavily weighted.
    const endpointTags = answers["endpoint"] ?? [];
    endpointTags.forEach((t) => {
      if (p.tags.includes(t)) score += 3;
    });
    // Experience match
    const exp = answers["experience"]?.[0];
    if (exp && p.tags.includes(exp)) score += 2;
    return { ...p, score };
  });

  return scored
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

// ─── Persistent RUO chip ──────────────────────────────────────────────────────

function RUOChip() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
      For Research Use Only
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuizClient() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [results, setResults] = useState<ProductRec[] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSteps = QUESTIONS.length;

  function getQuestion(index: number): Question {
    const q = QUESTIONS[index];
    if (q.id === "endpoint") {
      const domain = answers["domain"]?.[0];
      const endpointOptions = domain ? ENDPOINT_MAP[domain] ?? [] : [];
      return { ...q, options: endpointOptions };
    }
    return q;
  }

  function handleStart() {
    setCurrentStep(1);
  }

  function handleSelect(optionId: string) {
    setSelectedOption(optionId);
  }

  function handleNext() {
    if (!selectedOption) return;

    const q = getQuestion(currentStep - 1);
    const option = q.options.find((o) => o.id === selectedOption);
    if (!option) return;

    const newAnswers = { ...answers, [q.id]: option.tags };

    setIsAnimating(true);
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (currentStep >= totalSteps) {
        const recs = scoreProducts(newAnswers);
        setResults(recs);
        setCurrentStep(totalSteps + 1);
      } else {
        setCurrentStep(currentStep + 1);
      }
      setIsAnimating(false);
    }, 200);
  }

  function handleBack() {
    if (currentStep <= 1) return;
    setSelectedOption(null);
    setCurrentStep(currentStep - 1);
  }

  function handleRetake() {
    setCurrentStep(0);
    setAnswers({});
    setSelectedOption(null);
    setResults(null);
  }

  const progress = currentStep > 0 && currentStep <= totalSteps ? (currentStep / totalSteps) * 100 : 0;

  // ── Intro Screen ──
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <div className="max-w-5xl mx-auto px-6 pt-8 w-full">
          <nav className="text-sm text-zinc-500">
            <a href="/" className="hover:text-zinc-300 transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-zinc-300">Protocol Finder</span>
          </nav>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-2xl w-full text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-8"
              style={{ borderColor: `${GOLD}55`, backgroundColor: `${GOLD}1A`, color: GOLD }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1l1.2 3.6H11L8.4 6.8l1 3.2L6 8l-3.4 2 1-3.2L1 4.6h3.8z" fill="currentColor" />
              </svg>
              Protocol Finder
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Find Your Research Protocol
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Four questions about your research domain, study type, and priority endpoint.
              We map your answers to the research compounds best characterized for your study design.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-12 text-left">
              {[
                { num: "4", label: "Questions", sub: "About 60 seconds" },
                { num: "Up to 4", label: "Compounds", sub: "Matched by endpoint" },
                { num: "COA", label: "On every lot", sub: "HPLC / ESI-MS verified" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold mb-1" style={{ color: GOLD }}>{item.num}</div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="inline-flex items-center gap-3 px-8 py-4 font-semibold text-sm uppercase tracking-widest rounded-lg transition-colors"
              style={{ backgroundColor: GOLD, color: "#0F0F0E" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GOLD_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GOLD)}
            >
              Begin
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="mt-8 flex justify-center">
              <RUOChip />
            </div>
            <p className="text-zinc-600 text-xs mt-4">
              Recommendations are for in vitro / preclinical research purposes only. Not for human or veterinary use.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Results Screen ──
  if (currentStep === totalSteps + 1 && results) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Your Protocol Is Ready
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Recommended Compounds
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Matched to your research domain, study type, and priority endpoint. Each compound below ships
              with a lot-specific Certificate of Analysis.
            </p>
            <div className="mt-6 flex justify-center">
              <RUOChip />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid gap-8 md:grid-cols-2 mb-16">
            {results.map((product, i) => (
              <div
                key={product.slug}
                className="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden transition-colors hover:border-white/30"
              >
                {i === 0 && (
                  <div
                    className="absolute top-4 right-4 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded"
                    style={{ backgroundColor: GOLD, color: "#0F0F0E" }}
                  >
                    Best Match
                  </div>
                )}
                <div className="bg-zinc-800 h-40 flex items-center justify-center relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/products/${product.slug}.png`}
                    alt={product.name}
                    className="h-32 object-contain"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="text-zinc-600 text-xs font-mono absolute">{product.slug}</div>
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-zinc-400 text-xs mb-4">{product.tagline}</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">{product.why}</p>

                  {/* Verification reinforcement */}
                  <div className="flex items-center gap-2 mb-6 text-[11px] text-zinc-500 font-medium">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 1l5.5 2.4v3.6c0 3.4-2.3 6.6-5.5 7.5-3.2-.9-5.5-4.1-5.5-7.5V3.4z" stroke={GOLD} strokeWidth="1.2" />
                      <path d="M5.5 8l1.7 1.7L10.8 6" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    HPLC / ESI-MS verified · lot-specific COA
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">${product.price}</div>
                      <div className="text-zinc-500 text-xs">{product.size}</div>
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                      style={{ backgroundColor: GOLD, color: "#0F0F0E" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GOLD_HOVER)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GOLD)}
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Protocol Summary */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 mb-10">
            <h2 className="text-xl font-bold mb-4">Your Study Parameters</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(answers).map(([key, tags]) => {
                const q = QUESTIONS.find((qq) => qq.id === key);
                const qLabel = q ? q.question.replace("?", "") : key;
                const question = key === "endpoint"
                  ? { ...QUESTIONS[2], options: ENDPOINT_MAP[answers["domain"]?.[0]] ?? [] }
                  : QUESTIONS.find((qq) => qq.id === key);
                const optionLabel = question?.options.find((o) =>
                  o.tags.some((t) => tags.includes(t))
                )?.label ?? tags.join(", ");
                return (
                  <div key={key}>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{qLabel}</div>
                    <div className="text-sm font-medium text-white">{optionLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={handleRetake}
              className="px-6 py-3 border border-white/20 text-zinc-300 text-sm font-medium rounded-lg hover:border-white/40 hover:text-white transition-colors"
            >
              Retake
            </button>
            <Link
              href="/products"
              className="px-6 py-3 border border-white/20 text-zinc-300 text-sm font-medium rounded-lg hover:border-white/40 hover:text-white transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              href="/build-your-stack"
              className="px-6 py-3 text-sm font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: GOLD, color: "#0F0F0E" }}
            >
              Build a Full Stack
            </Link>
          </div>

          <p className="text-center text-zinc-600 text-xs mt-12 max-w-2xl mx-auto">
            For Research Use Only. Not for human or veterinary use. Recommendations are generated
            algorithmically from published research literature and are intended for in vitro / preclinical
            research purposes only. They do not describe or imply any health outcome.
          </p>
        </div>
      </div>
    );
  }

  // ── Question Screen ──
  const question = getQuestion(currentStep - 1);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors whitespace-nowrap">
            Nexphoria
          </a>
          <RUOChip />
          <div className="text-xs text-zinc-500 font-medium whitespace-nowrap">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: GOLD }}
        />
      </div>

      {/* Question content — single question per screen */}
      <div className={`flex-1 flex flex-col items-center justify-center px-6 py-12 transition-opacity duration-200 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
        <div className="max-w-2xl w-full">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: GOLD }}>
            Question {currentStep}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {question.question}
          </h2>
          {question.subtext && (
            <p className="text-zinc-400 mb-8">{question.subtext}</p>
          )}

          {/* Options — large tap targets */}
          <div className="grid gap-3 sm:grid-cols-2 mb-10">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className="text-left px-5 py-4 rounded-xl border transition-all min-h-[64px]"
                  style={
                    isSelected
                      ? { borderColor: GOLD, backgroundColor: `${GOLD}1A`, color: "#fff" }
                      : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }
                  }
                >
                  <div className="font-medium text-sm text-white">{option.label}</div>
                  {option.detail && (
                    <div className="text-xs text-zinc-400 mt-1 leading-snug">{option.detail}</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-5 py-4 rounded-xl border border-white/15 text-zinc-300 text-sm font-medium hover:border-white/35 hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className="flex-1 py-4 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all"
              style={
                selectedOption
                  ? { backgroundColor: GOLD, color: "#0F0F0E" }
                  : { backgroundColor: "rgba(255,255,255,0.05)", color: "#71717a", cursor: "not-allowed" }
              }
            >
              {currentStep === totalSteps ? "See My Recommendations" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
