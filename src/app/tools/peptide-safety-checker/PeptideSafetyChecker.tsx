"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ── Types ────────────────────────────────────────────────────────────────────
type SeverityLevel = "Low" | "Moderate" | "High" | "Critical";

interface SideEffect {
  effect: string;
  mechanism: string;
  incidence: string; // e.g. "30-40% at research doses" or "Rare (<5%)"
  severity: SeverityLevel;
  notes?: string;
}

interface ContraindPair {
  compound: string;
  reason: string;
  severity: "Caution" | "Warning" | "Avoid";
}

interface SafetyProfile {
  slug: string;
  name: string;
  category: string;
  receptors: string[];        // primary receptor targets
  mechanismSummary: string;   // 1-2 sentence mechanism
  sideEffects: SideEffect[];
  contraindications: ContraindPair[];
  handlingWarnings: string[];
  specialNotes: string[];
  riskLevel: SeverityLevel;   // overall research risk tier
  sources: string[];
}

// ── Safety Database ──────────────────────────────────────────────────────────
const SAFETY_DATA: SafetyProfile[] = [
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1 Agonists",
    receptors: ["GLP-1R (Gs/cAMP/PKA)"],
    mechanismSummary: "GLP-1 receptor agonist with C18 fatty diacid albumin binding (~168h half-life). Activates Gs/cAMP/PKA/CREB signaling; central anorexigenic via ARC NPY/AgRP inhibition.",
    riskLevel: "Moderate",
    sideEffects: [
      {
        effect: "Nausea / vomiting",
        mechanism: "GLP-1R activation at area postrema (dorsal vagal complex) — dose-dependent emetic reflex",
        incidence: "30–50% at effective doses in rodent models; typically peaks early in protocol",
        severity: "Moderate",
        notes: "Use dose-escalation schedule (4-week titration steps) to mitigate. Monitor food intake as confound.",
      },
      {
        effect: "Hypophagia / weight loss confound",
        mechanism: "Central NPY/AgRP inhibition + gastric emptying delay → caloric restriction",
        incidence: "Near-universal at therapeutic doses",
        severity: "Moderate",
        notes: "Pair-fed control group required to distinguish direct vs weight-mediated effects.",
      },
      {
        effect: "Insulin resistance worsening at supraphysiological doses",
        mechanism: "Paradoxical glucagonotropic effect at very high doses (>3 mg/kg/week in rodents)",
        incidence: "Rare; observed at doses >5× therapeutic range",
        severity: "Low",
      },
      {
        effect: "Tachyphylaxis (reduced response over time)",
        mechanism: "GLP-1R downregulation/desensitization at sustained high concentrations",
        incidence: "Partial attenuation at >1 mg/kg; monitor IGF-1/BW weekly",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "Tirzepatide", reason: "Dual GLP-1R/GIPR agonism in same study arm — receptor saturation confounds mechanistic dissection", severity: "Warning" },
      { compound: "Retatrutide", reason: "Triple agonist shares GLP-1R — competitive mechanism confound", severity: "Warning" },
      { compound: "Exendin-4 / Liraglutide", reason: "Same receptor class — additive nausea + emesis risk, redundant mechanism", severity: "Caution" },
    ],
    handlingWarnings: [
      "Store reconstituted semaglutide at 4°C, max 4 weeks; use amber vials — light degrades the C18 fatty diacid linker",
      "Use low-bind tubes for dilute solutions (<0.1 mg/mL); significant adsorption to standard polypropylene",
      "No vortex mixing — amphipathic structure prone to interface aggregation",
      "BAC water is standard reconstitution vehicle for SC rodent dosing (5 mg/mL stock)",
      "Monitor body weight and fasting glucose weekly — GLP-1R agonists alter both metabolic endpoints",
    ],
    specialNotes: [
      "GLP-1R-KO controls or Exendin(9-39) antagonist required for receptor specificity confirmation",
      "Pair-fed design is mandatory for body composition studies — do not attribute fat loss to direct compound effects without pair-fed arm",
      "Sex differences: female C57BL/6J show greater GLP-1R-mediated weight loss — pre-stratify by sex",
    ],
    sources: ["Wilding 2021 NEJM (STEP 1)", "Lincoff 2023 NEJM (SELECT)", "Drucker DJ 2018 Cell Metab"],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1 Agonists",
    receptors: ["GLP-1R (Gs/cAMP/PKA)", "GIPR (Gs/cAMP)"],
    mechanismSummary: "Dual GLP-1R/GIPR agonist (GIP-scaffold peptide, 39aa). Biased GLP-1R agonism + balanced GIPR full agonism. ~5-day half-life via C20 fatty diacid albumin binding.",
    riskLevel: "Moderate",
    sideEffects: [
      {
        effect: "Nausea / vomiting",
        mechanism: "GLP-1R + GIPR co-activation at area postrema; GIPR may partially attenuate GLP-1 nausea at area postrema",
        incidence: "20–35% at effective doses — lower than equipotent semaglutide due to GIPR area postrema effect",
        severity: "Moderate",
      },
      {
        effect: "Hypophagia / caloric restriction",
        mechanism: "Dual hypothalamic ARC inhibition (GLP-1R) + GIPR peripheral adipose lipid clearance",
        incidence: "Near-universal",
        severity: "Moderate",
        notes: "Pair-fed control mandatory.",
      },
      {
        effect: "Lean mass reduction at highest doses",
        mechanism: "Caloric restriction at extreme doses may catabolize lean tissue; monitor DEXA",
        incidence: "Dose-dependent, primarily at >5 mg/kg/week rodent doses",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "Semaglutide", reason: "GLP-1R saturation — competing receptor occupation; mechanistic confound", severity: "Warning" },
      { compound: "Retatrutide", reason: "GLP-1R + GIPR overlap — redundant mechanism, cannot dissect GCGR contribution", severity: "Warning" },
    ],
    handlingWarnings: [
      "Use low-bind tubes for dilute preparations (<0.1 mg/mL) — GIPR-active at subnanomolar concentrations, adsorption losses critical",
      "BAC water 5 mg/mL stock; amber vials; 4°C working solution ≤4 weeks",
      "GIP receptor expression is highly sex- and tissue-dependent — confirm GIPR expression in your model system",
    ],
    specialNotes: [
      "GIPR-KO or GIPR antagonist (GIP(3-30)-NH2) required alongside GLP-1R-KO/Ex-9-39 for full mechanistic dissection",
      "Hepatic fat endpoint (MRI-PDFF or MRS) highly recommended — GCGR-independent hepatic effect via GIPR",
    ],
    sources: ["Jastreboff 2022 NEJM (SURMOUNT-1)", "Frias 2021 NEJM", "Samms 2020 Cell Metab"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "GLP-1 Agonists",
    receptors: ["GLP-1R", "GIPR", "GCGR (Gs/cAMP)"],
    mechanismSummary: "Triple GLP-1R/GIPR/GCGR agonist (26aa). GCGR arm adds hepatic CPT1-mediated fat oxidation + energy expenditure. ~6-day half-life.",
    riskLevel: "Moderate",
    sideEffects: [
      {
        effect: "Nausea / vomiting",
        mechanism: "GLP-1R area postrema agonism (same as semaglutide/tirzepatide)",
        incidence: "20–40% at effective doses",
        severity: "Moderate",
      },
      {
        effect: "Hepatic glucose output elevation in insulin-deficient models",
        mechanism: "GCGR agonism increases hepatic glycogenolysis and gluconeogenesis — dangerous in STZ-diabetic or GLP-1R-KO models",
        incidence: "High in insulin-insufficient models; negligible in intact obese DIO mice",
        severity: "High",
        notes: "Do NOT use in STZ diabetic or insulin-deficient rodent models without careful glucose monitoring.",
      },
      {
        effect: "Lean mass catabolism at high doses",
        mechanism: "GCGR-mediated protein catabolism (amino acid gluconeogenesis) at supraphysiological GCGR activation",
        incidence: "Observed at >3 mg/kg/week; DEXA required",
        severity: "Moderate",
      },
    ],
    contraindications: [
      { compound: "Semaglutide", reason: "GLP-1R overlap — cannot isolate GCGR or GIP-specific effects", severity: "Warning" },
      { compound: "Tirzepatide", reason: "GLP-1R + GIPR overlap — GCGR arm cannot be dissected", severity: "Warning" },
      { compound: "Glucagon", reason: "GCGR receptor competition at pharmacological doses", severity: "Caution" },
    ],
    handlingWarnings: [
      "Store at -20°C lyophilized; 4°C reconstituted (BAC water 5 mg/mL); amber low-bind vials",
      "GCGR signaling is highly sensitive to ambient glycemia — always control for fasting status (4h fast minimum)",
      "Hepatic endpoint (liver weight, TG content, MRI-PDFF) essential for GCGR arm characterization",
    ],
    specialNotes: [
      "Three-arm design minimum: GLP-1R agonist control + GIPR agonist control + full retatrutide for GCGR-component dissection",
      "GCGR antagonist (LY2409021 or REMD-477 30 mg/kg) required as mechanistic control",
    ],
    sources: ["Jastreboff 2023 NEJM (Phase 2)", "Finan 2015 Sci Transl Med (triple agonist concept)"],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Repair Peptides",
    receptors: ["eNOS pathway (indirect)", "VEGFR2 (indirect via EGR-1)", "FAK/paxillin"],
    mechanismSummary: "Gastric pentadecapeptide. Acts via eNOS upregulation, VEGFR2/VEGF-mediated angiogenesis, and FAK/paxillin cytoskeletal pathway. No known cognate GPCR identified.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Minimal adverse effects at research doses",
        mechanism: "No known cognate receptor; wide therapeutic window in published rodent studies",
        incidence: "No significant adverse effects reported at 10–100 μg/kg IP in published literature",
        severity: "Low",
      },
      {
        effect: "Potential blood pressure modulation",
        mechanism: "eNOS upregulation → NO-mediated vasodilation; may lower BP in hypertensive models",
        incidence: "Observed in hypertensive rodent models; not a concern in normotensive animals",
        severity: "Low",
        notes: "Include blood pressure as a monitoring endpoint in cardiovascular research models.",
      },
    ],
    contraindications: [
      { compound: "L-NAME (NOS inhibitor)", reason: "Mechanistic control — expected to attenuate BPC-157 angiogenic effects; include as positive control, not avoid", severity: "Caution" },
    ],
    handlingWarnings: [
      "Acetate salt (DLPC) is more stable and preferred for reproducibility vs arginate form",
      "Reconstitute in BAC water (500 μg/mL to 2 mg/mL); amber vials; 4°C for ≤21 days",
      "Some batches sensitive to oxidation — note any discoloration (should be colorless to pale yellow)",
    ],
    specialNotes: [
      "Both IP and SC routes produce systemic effects — injection site ≠ target tissue",
      "Acetate vs arginate salt form: confirm on COA — different MW (1419.5 vs 1424.5 g/mol)",
    ],
    sources: ["Sikiric 2018 Curr Pharm Des", "Sikiric 2014 J Physiol Pharmacol"],
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin β-4)",
    category: "Repair Peptides",
    receptors: ["G-actin (LKKETQ domain)", "ILK (integrin-linked kinase)", "Akt/NF-κB"],
    mechanismSummary: "Actin-sequestering peptide; LKKETQ domain binds G-actin, releasing it from F-actin pool. Downstream ILK/Akt/NF-κB cascade drives anti-inflammatory, angiogenic, and pro-survival effects.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "No significant adverse effects at research doses",
        mechanism: "Endogenous peptide (stored in platelets); well-tolerated at 150–600 μg/kg SC in rodents",
        incidence: "No adverse effects reported in published studies",
        severity: "Low",
      },
      {
        effect: "Potential tumor promotion in oncology models",
        mechanism: "ILK/Akt pro-survival signaling could theoretically support tumor cell survival",
        incidence: "Theoretical concern; not demonstrated in published literature at research doses",
        severity: "Moderate",
        notes: "Avoid using in tumor-bearing animal models without appropriate controls. Do not use in cancer biology studies without justification.",
      },
    ],
    contraindications: [
      { compound: "KP-392 (ILK inhibitor)", reason: "Mechanistic control compound — expected to attenuate TB-500 effects; use as specificity control, not avoid", severity: "Caution" },
    ],
    handlingWarnings: [
      "43-aa peptide prone to aggregation — do NOT vortex; swirl gently",
      "BAC water or sterile saline; optimal pH 5.5–7.0; dorsal scruff SC preferred injection site for rodents",
      "Flash-freeze aliquots at -80°C for long-term storage of reconstituted stock",
      "N-terminal acetylation required for full activity — verify on COA (acetyl-SDKPDMAEIEKS...)",
    ],
    specialNotes: [
      "FAK inhibitor PF-573228 should NOT attenuate TB-500 effects — use to confirm FAK-independent mechanism vs BPC-157",
      "N-terminal acetylation verification critical: non-acetylated form has significantly reduced G-actin affinity",
    ],
    sources: ["Bock-Marquette 2004 Nature", "Ehrlich 2012 Wound Repair Regen"],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Tripeptide)",
    category: "Repair Peptides",
    receptors: ["TGF-β1/SMAD2-3 (indirect)", "Nrf2/Keap1 (indirect)", "Lysyl oxidase (copper-dependent)"],
    mechanismSummary: "Copper-chelated tripeptide (Gly-His-Lys·Cu²⁺). Copper is essential for activity — free GHK lacks most effects. TGF-β1/SMAD2-3 collagen synthesis + Nrf2/GCLC antioxidant + VEGF/VEGFR2 angiogenesis.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Copper toxicity at supraphysiological doses",
        mechanism: "Cu²⁺ accumulation in liver/kidney at doses far exceeding research range (>50 mg/kg/day systemic)",
        incidence: "Not observed at published research doses (1–10 mg/kg SC); theoretical concern at extreme overdose",
        severity: "High",
        notes: "Keep doses within published range. CuSO4 control group required to distinguish copper vs peptide effects.",
      },
      {
        effect: "Blue-violet discoloration at injection site",
        mechanism: "Cu²⁺ chelate color; transient, not harmful",
        incidence: "Common at injection sites; cosmetic only",
        severity: "Low",
      },
      {
        effect: "Prooxidant activity at very high concentrations (in vitro)",
        mechanism: "Cu²⁺/Cu⁺ Fenton-like chemistry at very high concentrations in reducing environments",
        incidence: "In vitro concern only at >100 μM; not observed in vivo at research doses",
        severity: "Low",
        notes: "Relevant for cell culture experiments — use physiologically relevant concentrations (1–100 nM in vitro).",
      },
    ],
    contraindications: [
      { compound: "EDTA / chelating agents", reason: "EDTA strips Cu²⁺ from GHK — destroys activity. Never co-administer or use EDTA in reconstitution vehicle", severity: "Avoid" },
      { compound: "DTT / reducing agents", reason: "Dithiothreitol reduces Cu²⁺ to Cu⁺ — destabilizes copper complex, reduces activity", severity: "Avoid" },
      { compound: "Acidic vehicles (pH <3.5)", reason: "Protonation of His imidazole disrupts Cu coordination at low pH", severity: "Warning" },
    ],
    handlingWarnings: [
      "CRITICAL: Never use EDTA-containing buffers — will chelate copper and inactivate the compound",
      "Blue-violet color of reconstituted solution is a quality indicator — colorless solution may indicate copper loss",
      "Store lyophilized at -20°C; reconstituted in sterile saline (preferred) or BAC water at 4°C, ≤14 days",
      "Amber vials essential — UV degrades the His imidazole–copper complex",
      "No vortex — Cu²⁺ complexes are sensitive to mechanical shear; swirl gently",
      "CuSO4 control group (equimolar copper) required in all experiments to attribute effects to the peptide vs copper alone",
    ],
    specialNotes: [
      "MW of authentic GHK-Cu = 403.9 g/mol (includes Cu²⁺); free GHK = 340.4 g/mol — verify on COA",
      "Cu content should be ~15.7% by weight — some low-grade suppliers ship free GHK labeled as GHK-Cu",
      "For topical experiments: sterile saline vehicle preferred over BAC water for skin application",
    ],
    sources: ["Pickart 2012 J Aging Res (gene expression database)", "Leyden 2004 J Am Acad Dermatol"],
  },
  {
    slug: "nad-plus",
    name: "NAD+ (β-Nicotinamide Adenine Dinucleotide)",
    category: "Longevity",
    receptors: ["SIRT1/SIRT3 (deacetylase cofactor)", "PARP1 (substrate)", "CD38 (hydrolase substrate)"],
    mechanismSummary: "Redox coenzyme and SIRT1/SIRT3 substrate. NAD+ depletion drives mitochondrial dysfunction and aging. Repletion activates PGC-1α biogenesis, SOD2 deacetylation, IDH2 activation.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Transient flushing (IV/IP high-dose)",
        mechanism: "NAD+ hydrolysis to nicotinamide → niacin flush pathway at high bolus doses",
        incidence: "Mild at IP 250–500 mg/kg; monitor behavioral distress signs in rodents",
        severity: "Low",
      },
      {
        effect: "Insulin resistance confound",
        mechanism: "Very high doses may activate CD38 pathway generating cADPR — secondary Ca²⁺ effects on insulin signaling",
        incidence: "Theoretical at supraphysiological doses; not relevant at published research doses",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "BAC water (for reconstitution)", reason: "Benzyl alcohol acts as mild oxidant for the nicotinamide ring at extended storage; use sterile saline or PBS instead", severity: "Warning" },
      { compound: "FK866 / APO866 (NAMPT inhibitor)", reason: "Mechanistic control — depletes endogenous NAD+ to confirm rescue experiment; use as positive control, not avoid", severity: "Caution" },
      { compound: "Nicotinamide (NAM) vehicle", reason: "NAM is a SIRT1 inhibitor — if using NAM-reconstituted NAD+, NAM vehicle control is mandatory to avoid false negatives", severity: "Warning" },
    ],
    handlingWarnings: [
      "CRITICAL: Reconstitute in sterile saline or PBS — NOT BAC water (benzyl alcohol oxidizes nicotinamide ring)",
      "Amber vials mandatory — UV photodegradation at 259 nm is rapid; wrap bench solutions in foil",
      "Prepare fresh for each use — free NAD+ degrades within hours in aqueous solution at room temperature",
      "For multi-day studies: prepare aliquots and store at -80°C; minimize freeze-thaw cycles (≤2)",
      "Use neutral pH (7.0–7.4) — acidic conditions (pH <5) hydrolyze the glycosidic bond",
    ],
    specialNotes: [
      "Verify NAD+ (oxidized form) vs NADH (reduced form) — COA should specify which; research typically uses oxidized NAD+",
      "Tissue NAD+ measurement requires flash-freeze in liquid N2 immediately after harvest — postmortem NAD+ decline is rapid",
      "NAM vehicle control group is critical: NAM itself inhibits SIRT1/SIRT2/SIRT3 — equimolar NAM from NAD+ hydrolysis must be accounted for",
    ],
    sources: ["Gomes 2013 Cell (SIRT1 muscle aging)", "Yoshino 2011 Cell Metab (NMN DIO)", "Rajman 2018 Cell Metab (review)"],
  },
  {
    slug: "mk-677",
    name: "MK-677 (Ibutamoren)",
    category: "GH Secretagogues",
    receptors: ["GHSR-1a (full agonist, non-peptide mimetic)"],
    mechanismSummary: "Oral GHSR-1a full agonist (non-peptide spiroindoline). ~24h half-life via oral bioavailability. Increases GH pulse amplitude and IGF-1. Does not require injection.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Insulin resistance / fasting glucose elevation",
        mechanism: "IGF-1 elevation → IRS-1 pathway → hepatic insulin resistance; also direct GH counter-regulatory effect",
        incidence: "Observed at 10–30 mg/kg oral in rodents; requires glucose/insulin monitoring",
        severity: "Moderate",
        notes: "Include GTT and HOMA-IR as endpoints in all MK-677 metabolic studies. Pre-existing IR models may be significantly worsened.",
      },
      {
        effect: "Hyperphagia (increased food intake)",
        mechanism: "GHSR-1a activation in arcuate nucleus upregulates orexigenic NPY/AgRP pathway",
        incidence: "Consistent orexigenic effect at therapeutic doses",
        severity: "Low",
        notes: "Food intake must be recorded daily. Use pair-fed controls for body composition endpoints.",
      },
      {
        effect: "Water retention / edema",
        mechanism: "IGF-1-mediated sodium retention; GH anti-natriuretic peptide effect",
        incidence: "Mild; more pronounced at high doses (>25 mg/kg)",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "Ipamorelin / GHRP-2 / GHRP-6", reason: "GHSR-1a competition — MK-677 occupies the same receptor, attenuating injectable GHRP response; do not combine in same study arm", severity: "Warning" },
      { compound: "Insulin / metformin", reason: "Opposing metabolic effects: MK-677 elevates fasting glucose while insulin lowers it — confounds metabolic endpoint interpretation", severity: "Caution" },
    ],
    handlingWarnings: [
      "Oral gavage or drinking water administration possible due to oral bioavailability — confirm vehicle (DMSO:PEG400 or simple water suspension)",
      "DMSO concentration in vehicle must be ≤1% to avoid DMSO-mediated artifacts; include vehicle control",
      "Monitor weekly: body weight, food intake, fasting glucose, IGF-1 — all four change with MK-677 treatment",
    ],
    specialNotes: [
      "Unlike injectable GHRPs, MK-677 produces tonic rather than pulsatile GH elevation — choose based on research question",
      "Do NOT combine with ipamorelin or other GHRPs in the same arm; GHSR-1a competition attenuates both compounds",
      "Tachyphylaxis: <10% GH attenuation even at 6–12 weeks — unusual among GHSR-1a agonists due to 24h continuous occupancy",
    ],
    sources: ["Nass 2008 Ann Intern Med", "Chapman 1996 J Clin Endocrinol", "Copinschi 1997 Sleep"],
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "GH Secretagogues",
    receptors: ["GHSR-1a (Gαq/IP3/Ca²⁺) — highly selective"],
    mechanismSummary: "D-2-Nal² GHRP analog. Most selective GHSR-1a agonist — no cortisol, ACTH, or prolactin elevation at therapeutic doses. Synergizes with GHRH analogs (CJC-1295 No DAC) for 8–12× GH amplification.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Minimal: no HPA axis activation at therapeutic doses",
        mechanism: "D-2-Nal² modification eliminates GHRP-2/GHRP-6 HPA co-activation",
        incidence: "No cortisol/ACTH elevation in published data (Johansen 1999)",
        severity: "Low",
      },
      {
        effect: "Tachyphylaxis (20–30% GH attenuation at 4 weeks)",
        mechanism: "GHSR-1a internalization via GRK2/beta-arrestin-2; slower than GHRP-2/GHRP-6/hexarelin",
        incidence: "20–30% at 4 weeks; use washout or dose holiday at 12-week mark",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "MK-677", reason: "GHSR-1a competition — MK-677 occupies the receptor with 24h sustained binding; attenuates pulsatile ipamorelin response", severity: "Warning" },
      { compound: "Hexarelin", reason: "Same receptor; higher affinity hexarelin (Ki 0.3–0.5 nM vs ipamorelin Ki 4–8 nM) outcompetes ipamorelin; do not combine", severity: "Warning" },
    ],
    handlingWarnings: [
      "Reconstitute with BAC water (1–2 mg/mL); amber vials; 4°C for ≤14 days",
      "SC or IP injection; timing matters — pre-sleep (ZT12) injection exploits nocturnal GH pulse for maximum effect",
      "3× daily pulsatile dosing protocol recommended for peak IGF-1 elevation (every 6–8h)",
    ],
    specialNotes: [
      "GHSR-1a antagonist D-[Lys³]-GHRP-6 (1–3 mg/kg IP) required for receptor specificity control",
      "Always compare to ipamorelin-alone arm when studying CJC-1295+ipamorelin combination — establishes synergy contribution",
    ],
    sources: ["Johansen 1999 Growth Horm IGF Res", "Bowers 1998 Am J Physiol"],
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 No DAC (Mod GRF 1-29)",
    category: "GH Secretagogues",
    receptors: ["GHRHr (class B1 GPCR, Gs/cAMP/PKA)"],
    mechanismSummary: "Stabilized GHRH(1-29) fragment with four-point substitution for DPP-4 resistance. ~30 min half-life, pulsatile GH stimulation. Synergizes with ipamorelin via Gs/cAMP + Gq/IP3 orthogonal pathways.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Minimal at research doses",
        mechanism: "Physiologically normal pathway; mimics endogenous GHRH pulsatility",
        incidence: "No adverse effects in published rodent studies at 100–300 μg/kg SC",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "CJC-1295 DAC (with Drug Affinity Complex)", reason: "Do not combine in same study arm — No DAC creates pulsatile GH vs DAC creates sustained tonic GH; different physiological profiles, confounds endpoint interpretation", severity: "Warning" },
    ],
    handlingWarnings: [
      "BAC water (1–2 mg/mL); amber vials; 4°C ≤14 days; -20°C lyophilized for long-term storage",
      "Inject concomitantly with ipamorelin when combining — orthogonal signaling requires simultaneous receptor engagement",
    ],
    specialNotes: [
      "Requires functional pituitary reserve — confirm GH-secreting capacity in animal model before using",
      "No DAC vs DAC selection: choose No DAC for pulsatile GH patterns; DAC for sustained GH elevation (different research questions)",
    ],
    sources: ["Bowers 1998 Am J Physiol", "Arvat 1997 Eur J Endocrinol"],
  },
  {
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "Melanocortin Peptides",
    receptors: ["MC1R", "MC3R", "MC4R (primary arousal target)"],
    mechanismSummary: "Cyclic heptapeptide melanocortin agonist. MC4R/PVN oxytocinergic pathway mediates sexual arousal effects (CNS mechanism vs PDE5 peripheral mechanism). Non-selective — activates MC1R/MC3R as well.",
    riskLevel: "Moderate",
    sideEffects: [
      {
        effect: "Nausea / vomiting",
        mechanism: "MC3R/area postrema activation — dose-dependent emetic reflex",
        incidence: "60–80% in human studies (RECONNECT trial); lower in rodents due to vomit reflex absence (rodents cannot vomit)",
        severity: "Moderate",
        notes: "Area postrema MC3R nausea is the primary dose-limiting factor in primate research.",
      },
      {
        effect: "Blood pressure elevation",
        mechanism: "MC4R activation → sympathetic nervous system → transient pressor response",
        incidence: "~40 mmHg transient increase in clinical data (Bremelanotide product insert)",
        severity: "High",
        notes: "CRITICAL: Monitor blood pressure in all PT-141 studies. Avoid in hypertensive models or with vasoconstrictive co-compounds.",
      },
      {
        effect: "Facial flushing",
        mechanism: "MC1R cutaneous vasodilation",
        incidence: "Common at therapeutic doses",
        severity: "Low",
      },
      {
        effect: "Skin pigmentation (MC1R melanogenesis)",
        mechanism: "MC1R/cAMP/PKA/MITF/tyrosinase activation",
        incidence: "At higher doses / prolonged studies; monitor coat color in rodents",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "Melanotan II", reason: "Same receptor class (MC1R/MC3R/MC4R) — additive nausea + BP elevation; mechanistic redundancy; do not combine", severity: "Avoid" },
      { compound: "Antihypertensives / vasodilators", reason: "PT-141 BP elevation may be masked or paradoxically exacerbated depending on compound class", severity: "Warning" },
    ],
    handlingWarnings: [
      "Amber vials essential — aromatic residues (Trp, His) sensitive to UV oxidation",
      "Reconstitute with BAC water (1–2 mg/mL); 4°C reconstituted ≤14 days; -20°C lyophilized",
      "Monitor blood pressure as primary safety endpoint in all PT-141 studies",
      "Sex-differentiated behavioral endpoints: separate male/female animals for arousal studies",
    ],
    specialNotes: [
      "MC4R antagonist HS024 (1 mg/kg IP) or SHU9119 required for receptor specificity control",
      "MC1R-null control (B6-MC1Re/e agouti mice) differentiates MC1R (pigmentation) from MC4R (arousal) effects",
      "For sexual behavior studies: pair-housed, sexually naive animals required; estrous cycle synchronization for females",
    ],
    sources: ["Kingsberg 2019 Obstet Gynecol (RECONNECT)", "Pfaus 2004 Eur J Pharmacol"],
  },
  {
    slug: "melanotan-2",
    name: "Melanotan II",
    category: "Melanocortin Peptides",
    receptors: ["MC1R (pigmentation)", "MC3R", "MC4R (arousal/appetite)"],
    mechanismSummary: "Cyclic lactam heptapeptide, Ac-Nle⁴-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH₂. Non-selective melanocortin agonist. MC1R/melanogenesis + MC4R/oxytocinergic arousal + MC3R/area postrema nausea.",
    riskLevel: "Moderate",
    sideEffects: [
      {
        effect: "Nausea (MC3R/area postrema)",
        mechanism: "MC3R activation at area postrema dorsal vagal complex",
        incidence: "Significant at therapeutic doses in primates; pica behavior in rodents (kaolin consumption) as surrogate nausea marker",
        severity: "Moderate",
        notes: "Use pica scoring (kaolin intake) as nausea readout in rodent studies.",
      },
      {
        effect: "Blood pressure elevation",
        mechanism: "MC4R sympathoadrenal activation → transient pressor response",
        incidence: "Transient BP elevation at 80–160 μg/kg SC in rodents",
        severity: "High",
        notes: "Monitor blood pressure; same concern as PT-141.",
      },
      {
        effect: "Skin/coat pigmentation",
        mechanism: "MC1R/cAMP/PKA/MITF/tyrosinase eumelanin upregulation",
        incidence: "Dose- and duration-dependent; monitor for darkening of rodent coat/skin",
        severity: "Low",
        notes: "Include photographic documentation of coat color changes. MC1R-null control differentiates pigmentation from other effects.",
      },
    ],
    contraindications: [
      { compound: "PT-141", reason: "Additive MC4R/MC3R activation — combined BP elevation and nausea risk; do not use in same study arm", severity: "Avoid" },
    ],
    handlingWarnings: [
      "CRITICAL: Use amber vials — aromatic residue (Trp, D-Phe) UV photodegradation is rapid",
      "BAC water 1–2 mg/mL; 4°C reconstituted ≤14 days",
      "Pica kaolin jar must be present in all MT-II rodent cages for nausea monitoring",
      "Monitor blood pressure with tail-cuff every 30 min for first 2h post-injection",
    ],
    specialNotes: [
      "MC4R antagonist SHU9119 (0.5–1 mg/kg IP) required for receptor specificity dissection",
      "Pica scoring protocol: provide kaolin block, weigh kaolin consumed over 24h post-injection",
    ],
    sources: ["Dorr 1998 J Allergy Clin Immunol", "Wikberg 1999 Pharmacol Res"],
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1 (Tα1)",
    category: "Immunology",
    receptors: ["TLR2", "TLR4", "TLR9 (indirect co-agonism)"],
    mechanismSummary: "N-terminal acetylated 28aa peptide from prothymosin-α. TLR2/4/9 co-agonist → IFN-α/γ + IL-12 + dendritic cell maturation + NK activation. Th1 polarization without Th2 suppression.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Pro-inflammatory cytokine surge at high doses",
        mechanism: "TLR activation at supraphysiological doses could drive excessive IFN-α/IL-12 production",
        incidence: "Not observed at published research doses (0.1–1 mg/kg SC); theoretical at >10× therapeutic dose",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "LPS (Lipopolysaccharide)", reason: "Both activate TLR4 — additive pro-inflammatory cytokine induction; LPS is a positive control, not a co-treatment", severity: "Caution" },
      { compound: "Immunosuppressants (e.g., dexamethasone)", reason: "Opposing immunomodulatory effects — glucocorticoids suppress the immune activation Tα1 is meant to induce", severity: "Caution" },
    ],
    handlingWarnings: [
      "Reconstitute in sterile saline or BAC water; 4°C reconstituted ≤14 days",
      "Polymyxin B neutralization control required in all TLR4-involving experiments (to confirm LPS endotoxin is not the actual activator)",
      "Heat-inactivated Tα1 (95°C, 5 min) serves as denatured negative control",
    ],
    specialNotes: [
      "Polymyxin B control (5 μg/mL) is critical to rule out endotoxin contamination as source of TLR4 activation",
      "TLR9-KO mice or TLR9 inhibitor ODN2088 required if studying pDC IFN-α activation",
    ],
    sources: ["Zhao 2020 Clin Infect Dis (COVID-19 cohort)", "Li 2017 Antivir Ther (HBV meta-analysis)"],
  },
  {
    slug: "kpv",
    name: "KPV (α-MSH 11-13 fragment)",
    category: "Immunology",
    receptors: ["MC1R", "MC3R (no MC2R/MC4R)"],
    mechanismSummary: "C-terminal tripeptide of α-MSH. MC1R/MC3R selective without MC2R (no cortisol) or MC4R (no appetite) activation. NF-κB inhibition via IκBα stabilization → IL-6/TNF-α suppression.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Minimal adverse effects",
        mechanism: "MC1R/MC3R selective without MC2R (ACTH-like cortisol) or MC4R (sympathoadrenal/arousal) activation",
        incidence: "No significant adverse effects in published IBD/colitis models",
        severity: "Low",
      },
      {
        effect: "Mild pigmentation (MC1R activation)",
        mechanism: "MC1R/MITF/tyrosinase eumelanin upregulation at high doses",
        incidence: "Minimal at 100 μg/kg/day range; not a concern in typical protocols",
        severity: "Low",
      },
    ],
    contraindications: [],
    handlingWarnings: [
      "pH 7.0 PBS or BAC water reconstitution; 4°C; ≤21 days reconstituted",
      "MC1R-null control required to confirm anti-inflammatory effects are MC1R-mediated vs off-target",
    ],
    specialNotes: [
      "PDTC (100 mg/kg IP) or MG-132 proteasome inhibitor controls required for NF-κB IκBα pathway dissection",
      "MC1R-null control (e/e agouti mice): confirms MC1R vs MC3R relative contribution to NF-κB effects",
    ],
    sources: ["Mandal 2009 Inflammatory Bowel Dis", "Dalmasso 2008 Am J Physiol GI"],
  },
  {
    slug: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "Longevity",
    receptors: ["Cardiolipin (inner mitochondrial membrane binding)", "No canonical receptor"],
    mechanismSummary: "Szeto-Schiller tetrapeptide (D-Arg-2',6'-Dmt-Lys-Phe-NH₂). 1000× mitochondrial accumulation via charge gradient. Cardiolipin binding stabilizes respiratory supercomplexes, reduces ROS, restores Complex I.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Injection site reactions (SC)",
        mechanism: "Cationic peptide may cause mild local irritation at injection site",
        incidence: "Mild and transient; rotate injection sites",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "DMSO vehicle", reason: "DMSO disrupts mitochondrial membrane potential — confounds mitochondrial endpoint interpretation. Use sterile saline or PBS vehicle only", severity: "Avoid" },
      { compound: "BAC water (for IV use)", reason: "Benzyl alcohol is IV-toxic — use sterile saline or PBS for IV/IP administration; BAC water acceptable for SC only", severity: "Warning" },
    ],
    handlingWarnings: [
      "Reconstitute in sterile saline or PBS for IP/IV use; BAC water acceptable for SC only",
      "No DMSO — will confound mitochondrial endpoint measurements (MitoSOX, JC-1, Seahorse)",
      "Flash-freeze aliquots at -80°C for studies >14 days; minimize freeze-thaw",
      "Acute I/R studies: administer IV bolus 15 min before reperfusion for maximal cardioprotection",
    ],
    specialNotes: [
      "CsA (cyclosporine A 10 mg/kg IV) is complementary mPTP control, NOT antagonist — they protect via different mechanisms (cardiolipin vs CypD)",
      "NAO fluorescence staining verifies cardiolipin binding target specificity in cell experiments",
      "For acute cardiac I/R: 3 mg/kg IV 15 min pre-reperfusion is the published standard protocol",
    ],
    sources: ["Szeto 2014 J Mol Cell Cardiol", "Siegel 2013 Aging Cell"],
  },
  {
    slug: "epitalon",
    name: "Epitalon (Epithalon)",
    category: "Longevity",
    receptors: ["TERT (telomerase activator, indirect)", "Pineal gland AANAT enzyme (melatonin pathway)"],
    mechanismSummary: "Ala-Glu-Asp-Gly tetrapeptide. Activates telomerase (TRAP assay 2.4×, Khavinson 2003), upregulates TERT mRNA. Restores pineal AANAT → melatonin in aged animals.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Theoretical pro-oncogenic concern (telomerase activation)",
        mechanism: "Telomerase activation could theoretically support cancer cell proliferation in tumor-bearing animals",
        incidence: "Not demonstrated at published research doses in published literature; rodent lifespan studies showed REDUCED cancer incidence (C3H mammary tumor model)",
        severity: "Moderate",
        notes: "Do NOT use in tumor-bearing animals or cancer research models without established justification and appropriate controls.",
      },
    ],
    contraindications: [
      { compound: "Luzindole (melatonin receptor antagonist)", reason: "Mechanistic control — expected to block melatonin-mediated effects of Epitalon; include as mechanistic control, not avoid", severity: "Caution" },
    ],
    handlingWarnings: [
      "Reconstitute in sterile saline ONLY — no BAC water; simple tetrapeptide, no preservative needed",
      "10-day pulsatile course protocol (1 μg/mouse/day SC) from Khavinson studies; do not use continuously",
      "Store lyophilized at -20°C; reconstituted at 4°C ≤21 days",
    ],
    specialNotes: [
      "Epitalon = Epithalon: same compound (Ala-Glu-Asp-Gly), different transliteration; CAS 307297-39-8 for both",
      "TRAP assay controls: heat-inactivated sample (positive inhibitor), 100 nM BIBR1532 TERT inhibitor for specificity",
      "Pulsatile 10-day course better recapitulates Khavinson methodology than continuous dosing",
    ],
    sources: ["Khavinson 2003 Bull Exp Biol Med (TRAP assay)", "Khavinson 2002 Ann NY Acad Sci (lifespan)"],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Longevity",
    receptors: ["AMPK (indirect activation via AICAR-like folate cycle mechanism)", "GLUT4 (nuclear translocation)"],
    mechanismSummary: "Mitochondria-derived 16aa peptide (12S rRNA sORF). AMPK activation via AICAR/folate cycle → GLUT4 nuclear translocation → insulin sensitization. Exercise mimetic in DIO models.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Hypoglycemia at supraphysiological doses in normoglycemic animals",
        mechanism: "AMPK-mediated GLUT4 upregulation → enhanced glucose uptake",
        incidence: "Not observed at published research doses (5–10 mg/kg IP); theoretical concern at higher doses",
        severity: "Low",
        notes: "Monitor fasting glucose at each time point; include insulin clamp if metabolic endpoints are primary.",
      },
    ],
    contraindications: [],
    handlingWarnings: [
      "SC or IP injection; sterile saline or BAC water vehicle; 4°C reconstituted ≤14 days",
      "Monitor fasting glucose weekly in metabolic models",
    ],
    specialNotes: [
      "Compound C (AMPK inhibitor, 20 mg/kg IP) required for AMPK specificity confirmation",
      "Metformin (positive control, 250 mg/kg oral) provides AMPK-activation benchmark for comparison",
    ],
    sources: ["Lee 2015 Cell Metab (MOTS-c discovery)", "Young 2021 Nature Aging (exercise mimetic)"],
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Nootropics",
    receptors: ["Tuftsin receptor (Thr-Lys-Pro-Arg sequence)", "Presynaptic GABA modulation (indirect)", "BDNF upregulation (indirect)"],
    mechanismSummary: "Heptapeptide tuftsin analog (TKPRPGP). Non-GABAergic anxiolytic via tuftsin receptor. Upregulates BDNF via IL-6 immunomodulation. No sedation or dependence potential.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Minimal adverse effects",
        mechanism: "Endogenous tuftsin analog; high therapeutic index",
        incidence: "No significant adverse effects in published rodent or human studies",
        severity: "Low",
      },
    ],
    contraindications: [
      { compound: "Benzodiazepines", reason: "Selank is non-GABAergic; combining with GABAergic compounds confounds anxiolytic mechanism dissection", severity: "Caution" },
    ],
    handlingWarnings: [
      "Intranasal delivery preferred for CNS effects: 5 μL/nostril in mice, 25 μL/nostril in rats",
      "BAC water or sterile saline; 4°C reconstituted ≤21 days",
      "Handling habituation protocol (daily 5-min handling for 7 days) required before behavioral endpoints — stress activates same pathways",
    ],
    specialNotes: [
      "Anti-IgG tuftsin antibody or splenectomized controls can partially address receptor specificity (tuftsin receptor expressed on macrophages/lymphocytes)",
      "BDNF ELISA sampling should be from hippocampus (not serum) for CNS endpoint relevance",
    ],
    sources: ["Kozlovskaya 2002 Bull Exp Biol Med", "Semenova 2010 Neurochem Res"],
  },
  {
    slug: "semax",
    name: "Semax",
    category: "Nootropics",
    receptors: ["Melanocortin receptors (ACTH(4-7) core)", "BDNF receptor TrkB (indirect upregulation)", "VEGF (upregulation in ischemia)"],
    mechanismSummary: "ACTH(4-7)PGP heptapeptide analog. Melanocortin binding without cortisol/ACTH activation (no MC2R). BDNF and VEGF upregulation in CNS; nootropic effects via hippocampal neurogenesis.",
    riskLevel: "Low",
    sideEffects: [
      {
        effect: "Minimal adverse effects",
        mechanism: "MC2R-sparing design prevents cortisol/ACTH activation; wide therapeutic index",
        incidence: "No significant adverse effects in published studies",
        severity: "Low",
      },
    ],
    contraindications: [],
    handlingWarnings: [
      "Intranasal delivery for CNS effects: 5 μL/nostril mice; pH 4.5–5.5 saline vehicle",
      "BAC water or pH-adjusted saline; 4°C ≤21 days; protect from light",
    ],
    specialNotes: [
      "Include ACTH and cortisol ELISA to confirm no MC2R activation (HPA sparing)",
      "BDNF ELISA: hippocampal tissue preferred over serum for CNS relevance",
    ],
    sources: ["Dolotov 2006 J Neurochem", "Agapova 2007 Eur J Neurosci"],
  },
  {
    slug: "oxytocin",
    name: "Oxytocin",
    category: "Nootropics",
    receptors: ["OTR (oxytocin receptor, Gq/PLC-β/IP3-DAG)", "V1aR (cross-reactivity at >1 mg/kg IP)"],
    mechanismSummary: "Posterior pituitary nonapeptide. OTR Gq signaling in hypothalamus/limbic system. HPA dampening via PVN OTR. Requires intranasal delivery for CNS behavioral effects — peripheral OT does not cross BBB.",
    riskLevel: "Moderate",
    sideEffects: [
      {
        effect: "Vasopressin V1a cross-reactivity at high IP doses",
        mechanism: "Structural homology with vasopressin (9-aa; 2-residue difference); V1aR binding at >1 mg/kg IP",
        incidence: "Relevant at doses >1 mg/kg IP systemic; negligible at intranasal doses",
        severity: "Moderate",
        notes: "Always include V1a receptor antagonist control or use intranasal delivery to isolate OTR-specific effects.",
      },
      {
        effect: "Inverted-U dose-response (behavioral)",
        mechanism: "High OTR occupancy may desensitize or paradoxically reduce prosocial behavior",
        incidence: "Consistently observed in behavioral studies — too much OT can worsen social memory",
        severity: "Moderate",
        notes: "Run at minimum 3 dose groups. Do not assume 'more is better'.",
      },
    ],
    contraindications: [
      { compound: "BAC water (for intranasal use)", reason: "Benzyl alcohol irritates nasal mucosa and disrupts olfactory transport pathway — must use pH 4.5–5.5 saline (isotonic, preservative-free)", severity: "Avoid" },
    ],
    handlingWarnings: [
      "CRITICAL for intranasal: reconstitute in isotonic saline pH 4.5–5.5 — NOT BAC water; NOT neutral PBS",
      "Volume limit: 5 μL/nostril in mice; 25 μL/nostril in rats; head tilted 45° with nasal delivery",
      "IP doses do NOT reliably elevate CSF oxytocin — Neumann/Stroud validation data required for claim of central action",
      "OTR-KO mice (B6.129P2-Oxtr, JAX #008471) required for receptor specificity",
      "Low-bind polypropylene vials essential — OT adsorbs to standard plastic at ng/mL concentrations",
    ],
    specialNotes: [
      "L-368,899 (OTR antagonist, 10–20 mg/kg IP) for behavioral specificity control; atosiban (OTR-selective) to differentiate OTR from V1a",
      "Estrous cycle synchronization or OVX + E2 replacement required for female rodents — E2 upregulates OTR expression (ERE promoter)",
      "Inverted-U dose-response: test 0.1/1.0/10 μg/kg IN minimum to characterize dose curve",
    ],
    sources: ["Neumann 2013 J Neuroendocrinol", "Dölen 2013 Nature"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const CATEGORIES = Array.from(new Set(SAFETY_DATA.map((p) => p.category))).sort();

const SEVERITY_COLORS: Record<SeverityLevel, { bg: string; text: string; border: string }> = {
  Low:      { bg: "#0F2718", text: "#4ADE80", border: "#166534" },
  Moderate: { bg: "#1C1500", text: "#FCD34D", border: "#854D0E" },
  High:     { bg: "#1F0808", text: "#F87171", border: "#991B1B" },
  Critical: { bg: "#2A0014", text: "#F472B6", border: "#9D174D" },
};

const CONTRAIND_COLORS: Record<"Caution" | "Warning" | "Avoid", { bg: string; text: string }> = {
  Caution: { bg: "#B8A44C22", text: "#D4AF37" },
  Warning: { bg: "#F8731422", text: "#F87114" },
  Avoid:   { bg: "#F8141422", text: "#F87171" },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function PeptideSafetyChecker() {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [expandedEffect, setExpandedEffect] = useState<number | null>(null);

  const filteredCompounds = useMemo(() => {
    return SAFETY_DATA.filter((p) => {
      const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.mechanismSummary.toLowerCase().includes(q) ||
        p.receptors.some((r) => r.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, search]);

  const selected = SAFETY_DATA.find((p) => p.slug === selectedSlug) || null;

  return (
    <div style={{ backgroundColor: "#0A0A09", minHeight: "100vh", color: "#F9F9F9" }}>
      {/* Hero */}
      <section
        className="px-6 py-16 md:py-20"
        style={{ borderBottom: "1px solid #1E1E1C" }}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Research Tools", href: "/tools" },
              { label: "Peptide Safety Checker" },
            ]}
          />
          <p
            className="text-xs uppercase tracking-widest mb-4 mt-8"
            style={{ color: "#C9DD69" }}
          >
            Research Tools
          </p>
          <h1
            className="text-4xl md:text-5xl mb-4 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9" }}
          >
            Peptide Safety Checker
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Research-grade safety profiles for 20+ compounds: side effects at research doses, receptor agonism/antagonism summary, contraindicated co-administration, and special handling warnings.
          </p>
          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* RUO disclaimer */}
          <div
            className="mt-6 px-4 py-3 rounded-sm text-xs"
            style={{ backgroundColor: "#1A0A00", border: "1px solid #5A2D00", color: "#D4874E", lineHeight: 1.6 }}
          >
            <strong>Research Use Only (RUO).</strong> All data is provided for qualified laboratory research purposes only. This tool is not medical advice and does not constitute guidance for human use. Compounds listed are not approved for human administration. Adverse effect profiles are derived from published preclinical and clinical research data cited within each compound entry.
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Search + Category filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search compound, receptor, or mechanism..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedSlug(""); }}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-sm"
                style={{
                  backgroundColor: "#161614",
                  border: "1px solid #2A2A28",
                  color: "#F9F9F9",
                  outline: "none",
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setSelectedSlug(""); }}
                  className="text-xs px-3 py-1.5 rounded-sm transition-colors"
                  style={{
                    backgroundColor: categoryFilter === cat ? "#B8A44C" : "#1A1A18",
                    color: categoryFilter === cat ? "#000" : "#A0A0A0",
                    border: "1px solid " + (categoryFilter === cat ? "#B8A44C" : "#2A2A28"),
                    fontWeight: categoryFilter === cat ? 500 : 400,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Compound list */}
          {!selectedSlug && (
            <div className="grid md:grid-cols-2 gap-3 mb-10">
              {filteredCompounds.map((p) => {
                const col = SEVERITY_COLORS[p.riskLevel];
                return (
                  <button
                    key={p.slug}
                    onClick={() => { setSelectedSlug(p.slug); setExpandedEffect(null); }}
                    className="text-left rounded-sm p-5 transition-all hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "#161614",
                      border: "1px solid #2A2A28",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-sm font-medium" style={{ color: "#F9F9F9" }}>{p.name}</h3>
                        <p className="text-xs mt-0.5" style={{ color: "#666" }}>{p.category}</p>
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: col.bg, color: col.text, border: `1px solid ${col.border}` }}
                      >
                        {p.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#888", WebkitLineClamp: 2, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical" }}>
                      {p.mechanismSummary}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {p.receptors.slice(0, 2).map((r, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#1E1E1C", color: "#A0A0A0", border: "1px solid #2A2A28" }}>
                          {r.split("(")[0].trim()}
                        </span>
                      ))}
                      {p.sideEffects.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "#1E1E1C", color: "#888", border: "1px solid #2A2A28" }}>
                          {p.sideEffects.length} effects
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
              {filteredCompounds.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <p style={{ color: "#666" }}>No compounds match your search.</p>
                  <button onClick={() => { setSearch(""); setCategoryFilter("All"); }} className="text-xs mt-2" style={{ color: "#B8A44C" }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Compound detail panel */}
          {selected && (
            <div>
              {/* Back */}
              <button
                onClick={() => setSelectedSlug("")}
                className="flex items-center gap-2 text-sm mb-6"
                style={{ color: "#B8A44C" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                All compounds
              </button>

              {/* Header */}
              <div
                className="rounded-sm p-6 mb-6"
                style={{ backgroundColor: "#161614", border: "1px solid #2A2A28" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-light tracking-tight" style={{ color: "#F9F9F9" }}>{selected.name}</h2>
                    <p className="text-sm mt-1" style={{ color: "#B8A44C" }}>{selected.category}</p>
                  </div>
                  <span
                    className="text-sm px-3 py-1 rounded-sm"
                    style={{
                      backgroundColor: SEVERITY_COLORS[selected.riskLevel].bg,
                      color: SEVERITY_COLORS[selected.riskLevel].text,
                      border: `1px solid ${SEVERITY_COLORS[selected.riskLevel].border}`,
                    }}
                  >
                    Overall Risk: {selected.riskLevel}
                  </span>
                </div>
                <p className="text-sm mt-4 leading-relaxed" style={{ color: "#C0C0C0" }}>{selected.mechanismSummary}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selected.receptors.map((r, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-sm" style={{ backgroundColor: "#1A1A18", color: "#A0A0A0", border: "1px solid #2A2A28" }}>{r}</span>
                  ))}
                </div>
              </div>

              {/* Side Effects */}
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>Side Effects at Research Doses</h3>
                <div className="space-y-3">
                  {selected.sideEffects.map((effect, idx) => {
                    const col = SEVERITY_COLORS[effect.severity];
                    const isOpen = expandedEffect === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-sm overflow-hidden"
                        style={{ border: "1px solid #2A2A28" }}
                      >
                        <button
                          onClick={() => setExpandedEffect(isOpen ? null : idx)}
                          className="w-full text-left px-5 py-4 flex items-start gap-3"
                          style={{ backgroundColor: "#161614" }}
                        >
                          <span
                            className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: col.bg, color: col.text, border: `1px solid ${col.border}` }}
                          >
                            {effect.severity}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: "#F9F9F9" }}>{effect.effect}</p>
                            <p className="text-xs mt-1" style={{ color: "#888" }}>{effect.incidence}</p>
                          </div>
                          <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="flex-shrink-0 mt-0.5 transition-transform"
                            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4" style={{ backgroundColor: "#131311", borderTop: "1px solid #2A2A28" }}>
                            <p className="text-xs mt-3" style={{ color: "#A0A0A0" }}>
                              <span style={{ color: "#B8A44C" }}>Mechanism: </span>{effect.mechanism}
                            </p>
                            {effect.notes && (
                              <p className="text-xs mt-2 p-2 rounded-sm" style={{ backgroundColor: "#1A1A18", color: "#C0C0C0", border: "1px solid #2A2A28" }}>
                                ⚠ {effect.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contraindications */}
              {selected.contraindications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>Contraindicated Co-Administration</h3>
                  <div className="space-y-2">
                    {selected.contraindications.map((c, idx) => {
                      const col = CONTRAIND_COLORS[c.severity];
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-sm px-4 py-3"
                          style={{ backgroundColor: "#161614", border: "1px solid #2A2A28" }}
                        >
                          <span
                            className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: col.bg, color: col.text, border: `1px solid ${col.text}33` }}
                          >
                            {c.severity}
                          </span>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "#F9F9F9" }}>{c.compound}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#888" }}>{c.reason}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Handling Warnings */}
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>Special Handling Warnings</h3>
                <div
                  className="rounded-sm p-5 space-y-2"
                  style={{ backgroundColor: "#0F0F0D", border: "1px solid #2A2A28" }}
                >
                  {selected.handlingWarnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-0.5" style={{ color: "#D4AF37" }}>▸</span>
                      <p className="text-sm" style={{ color: "#C0C0C0" }}>{w}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Design Notes */}
              {selected.specialNotes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-widest mb-4" style={{ color: "#C9DD69" }}>Research Design Notes</h3>
                  <div
                    className="rounded-sm p-5 space-y-2"
                    style={{ backgroundColor: "#0A110A", border: "1px solid #1A3A1A" }}
                  >
                    {selected.specialNotes.map((n, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5" style={{ color: "#4ADE80" }}>✓</span>
                        <p className="text-sm" style={{ color: "#C0C0C0" }}>{n}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest mb-3" style={{ color: "#C9DD69" }}>Key Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.sources.map((s, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-sm" style={{ backgroundColor: "#161614", color: "#888", border: "1px solid #2A2A28" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product CTA */}
              <div
                className="rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                style={{ backgroundColor: "#161614", border: "1px solid #2A2A28" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F9F9F9" }}>View {selected.name} in Catalog</p>
                  <p className="text-xs mt-1" style={{ color: "#888" }}>≥99% purity, COA included, independent lab verification</p>
                </div>
                <Link
                  href={`/products/${selected.slug}`}
                  className="text-sm px-5 py-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: "#B8A44C", color: "#000", fontWeight: 500 }}
                >
                  View Product →
                </Link>
              </div>
            </div>
          )}

          {/* Related tools */}
          <div
            className="mt-12 rounded-sm p-6"
            style={{ backgroundColor: "#161614", border: "1px solid #2A2A28" }}
          >
            <h3 className="text-sm uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>Related Research Tools</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { href: "/tools/peptide-interaction-checker", title: "Interaction Checker", desc: "Compound compatibility matrix and receptor overlap warnings" },
                { href: "/tools/peptide-stability-checker", title: "Stability Checker", desc: "Shelf life and degradation risk by compound and storage condition" },
                { href: "/tools/half-life-calculator", title: "Half-Life Calculator", desc: "Plasma half-life, clearance milestones, and dosing frequency" },
                { href: "/tools/reconstitution-calculator", title: "Reconstitution Calculator", desc: "BAC water volume, dose volume, and doses per vial" },
                { href: "/guides/storage", title: "Storage Guide", desc: "Temperature requirements and freeze-thaw limits per compound" },
                { href: "/tools/vial-inventory-tracker", title: "Vial Inventory Tracker", desc: "Track reconstituted vials with expiry alerts" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-sm p-4 block transition-colors"
                  style={{ backgroundColor: "#111110", border: "1px solid #2A2A28" }}
                >
                  <p className="text-sm font-medium" style={{ color: "#F9F9F9" }}>{tool.title}</p>
                  <p className="text-xs mt-1" style={{ color: "#666" }}>{tool.desc}</p>
                  <p className="text-xs mt-2" style={{ color: "#B8A44C" }}>Open →</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
