import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Peptide Dosing Protocol Design: A Researcher's Guide | Nexphoria",
  description:
    "Comprehensive guide to peptide research protocol design: loading vs maintenance phases, GH axis timing, injection site rotation, cycle length (3 vs 6 months), washout periods, and record-keeping best practices.",
  openGraph: {
    title: "Peptide Dosing Protocol Design — Nexphoria Research",
    description:
      "General principles for designing rigorous peptide research protocols: loading phases, administration timing, cycle structure, washout periods, and documentation standards.",
    url: "https://nexphoria.com/guides/dosing-protocols",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peptide Dosing Protocol Design — Nexphoria",
    description:
      "How to design sound peptide research protocols. Loading phases, timing, cycles, washouts, and record-keeping for serious researchers.",
  },
};

const SECTIONS = [
  {
    id: "loading-vs-maintenance",
    title: "Loading vs. Maintenance Phases",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    content: [
      {
        heading: "Why a Loading Phase Exists",
        body: `Many research peptides require a period of initial saturation before steady-state plasma and receptor levels are achieved. A loading phase delivers higher doses or more frequent administrations during the first 1–2 weeks to accelerate tissue distribution and receptor occupancy — particularly relevant for peptides with slow peripheral compartment equilibration (e.g., BPC-157, TB-500) or those requiring upregulation of downstream signaling machinery (e.g., GH axis peptides building IGF-1 reservoir).

Loading phases are not universally necessary. For compounds with short half-lives and fast equilibration (e.g., ipamorelin, most GLP-1 analogs administered to steady state), initiating at the maintenance dose is scientifically appropriate.`,
      },
      {
        heading: "Typical Loading Structure",
        body: `A standard loading phase runs 5–14 days at 1.5–2× the maintenance dose or increased frequency (e.g., twice-daily instead of once-daily). The maintenance phase then drops to the target dose for the duration of the research cycle.

Example — BPC-157 research protocol:
• Loading (Weeks 1–2): 300 mcg twice daily
• Maintenance (Weeks 3–12): 250 mcg once daily

Example — CJC-1295 No DAC + Ipamorelin combination:
• Loading phase is generally not used. Begin at maintenance dose. Pulsatile GH release is the primary endpoint, not receptor upregulation.`,
      },
      {
        heading: "When to Skip the Loading Phase",
        body: `Omit a loading phase when: (1) the compound has a half-life under 2 hours, (2) the research endpoint is acute response rather than cumulative effect, (3) the study design requires controlled onset tracking from a defined starting point, or (4) the compound carries dose-dependent tolerability concerns that make upward titration more appropriate than loading.`,
      },
    ],
  },
  {
    id: "timing-administration",
    title: "Administration Timing Principles",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    content: [
      {
        heading: "GH Axis Peptides: Timing Is Pharmacology",
        body: `Growth hormone secretagogues (GHRH analogs, GHRPs, ghrelin mimetics) must be administered in alignment with the endogenous GH pulse rhythm to achieve maximal effect. Endogenous GH pulsatility follows a circadian pattern with the largest pulse occurring 1–2 hours after sleep onset, driven by decreased somatostatin tone during deep sleep.

Protocol guidance for GH axis peptides:
• Pre-sleep (60 min before bed): Optimal for maximizing natural GH pulse amplitude. Sermorelin, CJC-1295 No DAC, and ipamorelin all produce the strongest IGF-1 response in pre-sleep protocols (Vittone 1997; Sigalos 2018 meta-analysis).
• Post-exercise: A secondary optimal window. Exercise transiently reduces somatostatin tone. Administration within 30 minutes post-training captures elevated GHRH receptor sensitivity.
• Fasted morning: Acceptable for studies targeting daytime GH monitoring. Somatostatin tone is lower in the early morning than midday.
• Avoid midday/post-meal: Postprandial insulin elevation and elevated somatostatin tone significantly blunt GH response. Administering GH secretagogues within 90 minutes of a high-carbohydrate meal reduces response by 40–60% in murine models.`,
      },
      {
        heading: "GLP-1 / Metabolic Peptides",
        body: `Semaglutide, tirzepatide, and retatrutide have half-lives of 5–7 days (semaglutide), ~5 days (tirzepatide), and ~6 days (retatrutide), making precise administration timing less critical for steady-state endpoints. Weekly administration on a consistent day is standard for the DIO rodent models and human Phase 2/3 protocols.

For food intake and glycemic studies with acute endpoints, administration 30–60 minutes pre-meal is the published standard for GLP-1R agonists.`,
      },
      {
        heading: "Anti-Inflammatory & Repair Peptides",
        body: `BPC-157, TB-500, and GHK-Cu do not have strong circadian timing dependencies. Research protocols typically divide daily doses into AM/PM administrations for tissue saturation studies, or use a single daily administration for maintenance protocols. Consistency of timing across study days is more important than the specific time chosen.`,
      },
      {
        heading: "Neuropeptides",
        body: `Semax, Selank, DSIP, and oxytocin have behavioral and cognitive endpoints that interact with circadian cortisol curves. Protocols targeting anxiety-like behavior (EPM, open field) or cognitive endpoints (Morris Water Maze, novel object recognition) typically administer in the early active phase of the rodent light cycle (i.e., at lights-off for nocturnal rodents). Timing relative to behavioral testing is a critical design variable to specify in the protocol.`,
      },
    ],
  },
  {
    id: "injection-site-rotation",
    title: "Injection Site Rotation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
    ),
    content: [
      {
        heading: "Why Rotation Matters",
        body: `Repeated subcutaneous injections at the same site cause lipohypertrophy (fatty tissue fibrosis), compromised absorption kinetics, and local inflammatory artifact that confounds study endpoints. Systematic site rotation is not optional in multi-week research protocols — it is a design requirement for reproducible pharmacokinetics.`,
      },
      {
        heading: "Rotation Schema",
        body: `For human research protocols, standard rotation zones are: (1) periumbilical abdomen (left quadrant, right quadrant), (2) anterior/lateral thighs (left, right), and (3) dorsolateral upper arms.

A 6-zone rotation schema completes a full cycle before returning to the starting site, providing 6+ days of recovery per site — sufficient to prevent lipohypertrophic changes in most protocols.

For subcutaneous dosing in rodents, rotate between dorsal neck scruff (primary), interscapular, and lumbar-dorsal sites. Avoid consecutive injections within 1 cm of a prior site.`,
      },
      {
        heading: "Documentation",
        body: `Log each injection site in your protocol record. Format: [Date / Time / Site Code / Volume / Compound]. Example: "2026-01-15 / 08:00 / ABD-L / 0.10 mL / BPC-157 250 mcg". This enables retrospective analysis if site-specific absorption differences are observed.`,
      },
    ],
  },
  {
    id: "cycle-length",
    title: "Cycle Length: 3-Month vs. 6-Month Research Cycles",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    content: [
      {
        heading: "3-Month Research Cycle (12 Weeks)",
        body: `A 12-week cycle is the standard minimum duration for evaluating chronic tissue remodeling endpoints: collagen synthesis (BPC-157, GHK-Cu), bone mineral density changes (GHRH analogs, PTH fragments), body composition shifts (GLP-1 agonists, MOTS-c, MK-677), and baseline IGF-1 trajectory establishment.

12 weeks provides:
• 3 complete monthly biological rhythms (menstrual cycle data in female cohorts, cortisol circadian entrainment)
• Sufficient duration to separate transient acute effects from sustained remodeling responses
• Adequate time for blood biomarker stabilization (IGF-1 reaches new steady state within 4–6 weeks for GH axis peptides; 8–12 weeks for body composition endpoints)
• Standard duration aligned with published Phase 1/2 clinical protocols for most compound classes

Use a 3-month cycle when: studying acute-to-chronic transition, running proof-of-concept pilots, or evaluating compounds with well-documented rapid effects.`,
      },
      {
        heading: "6-Month Research Cycle (24 Weeks)",
        body: `A 24-week cycle is required for endpoints involving slower biological processes: bone remodeling (3–6 month turnover cycle), metabolic set-point adaptation, telomere dynamics (Epitalon protocols), cardiac structural remodeling, or cognitive neuroplasticity measures.

Notable published protocols using 24-week durations:
• Tesamorelin HIV-lipodystrophy trials (Lo 2010 NEJM): 26 weeks for stable VAT reduction
• Semaglutide SCALE trial: 56 weeks (two 6-month cycles)
• MK-677 long-term safety: 2-year protocol with 6-month interim analyses (Nass 2008)

6-month cycles also allow detection of delayed adverse effect profiles (e.g., insulin resistance signals with MK-677, CJC-1295 DAC GH blunting with continuous exposure) that may not manifest in shorter protocols.`,
      },
      {
        heading: "Monthly Billing and Mid-Cycle Ordering",
        body: `For multi-vial compounds requiring sequential reconstitution (any lyophilized peptide with ≤4 week reconstituted stability), monthly ordering intervals align with reconstitution cycles. Calculate your total monthly dose budget and order accordingly: 

Monthly vials needed = (Daily dose mcg × 30 days) ÷ (Vial size mcg × practical yield factor of 0.95)

The 0.95 factor accounts for the ~5% volume left in vials after normal aspirations and accounts for syringe dead space in 0.3 mL insulin syringes.`,
      },
    ],
  },
  {
    id: "washout",
    title: "Washout Period Guidelines",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12M12 12C12 12 8 9 8 6a4 4 0 0 1 8 0c0 3-4 6-4 6z" />
        <path d="M8.5 14.5S5 13 5 10" />
        <path d="M15.5 14.5S19 13 19 10" />
      </svg>
    ),
    content: [
      {
        heading: "Calculating Minimum Washout Periods",
        body: `Washout duration should be calculated as a multiple of the compound's half-life. Standard thresholds:
• 5 half-lives: ~97% clearance — sufficient for most research endpoints
• 7 half-lives: ~99.2% clearance — required when receptor baseline normalization is a study objective
• 10 half-lives: ~99.9% clearance — use when co-administration study crossover design requires complete prior-compound elimination

Examples:
• Ipamorelin (half-life 2 h): 5×2h = 10 hours minimum washout
• Semaglutide (half-life ~7 days): 5×7d = 35 days; 7×7d = 49 days for receptor baseline
• CJC-1295 DAC (half-life ~8 days): 5×8d = 40 days minimum
• Tesamorelin (half-life 26–30 min): 5×0.5h = 2.5 hours — essentially no carryover`,
      },
      {
        heading: "Biological Reset vs. Pharmacokinetic Clearance",
        body: `Pharmacokinetic clearance (plasma concentration) is not the same as biological endpoint normalization. For downstream marker studies:

• IGF-1 returns to baseline within 4–6 weeks after stopping GHRH analog protocols, regardless of compound half-life
• Body composition changes from GLP-1 agonists persist for months post-washout (weight regain trajectory studies are themselves valid research designs)
• Collagen remodeling initiated by BPC-157 or TB-500 may continue for weeks post-compound clearance due to fibroblast/TGF-β signaling cascade self-perpetuation
• Telomere length changes from Epitalon are a permanent endpoint — "washout" is not a relevant concept

Design your washout requirements based on the specific biomarker you intend to measure, not just plasma PK clearance.`,
      },
      {
        heading: "Between-Cycle Intervals in Long-Term Protocols",
        body: `For compounds with known receptor downregulation profiles (GHRPs: GHRP-2, GHRP-6, hexarelin show 50–80% GH response attenuation after 4–8 continuous weeks), cycle/off periods are incorporated to restore receptor sensitivity. 

Standard cycle structure for GHRP-containing protocols:
• On-cycle: 8–12 weeks
• Off/reduced interval: 4–6 weeks (or switch to GHRH-only during off weeks)
• Or: 5-days-on / 2-days-off weekly micro-cycling

Ipamorelin shows substantially less tachyphylaxis than hexarelin, GHRP-2, or GHRP-6, making it better suited for continuous protocols.`,
      },
    ],
  },
  {
    id: "record-keeping",
    title: "Record-Keeping Best Practices",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    content: [
      {
        heading: "Protocol Log Minimum Fields",
        body: `Every research record should capture, at minimum:
• Date and time of administration
• Compound name and lot/batch number (reference your COA)
• Dose (mcg or mg)
• Volume administered (mL)
• Concentration of reconstituted solution (mcg/mL)
• Route of administration (SC, IP, IV, intranasal, oral)
• Injection site (for injectable routes)
• Subject/animal ID
• Observations: any behavioral or physiological notes within 2 hours post-administration
• Vial storage condition (was it returned to fridge within 30 min?)`,
      },
      {
        heading: "Reconstituted Vial Labeling",
        body: `Label every reconstituted vial immediately upon mixing. Minimum label content:
• Compound name
• Reconstituted concentration (e.g., "5 mg/mL" or "500 mcg/0.1 mL")
• Date of reconstitution
• Expiry date (reconstituted vial expiry, not lyophilized expiry)
• Solvent used (BAC water / sterile water / acetic acid)
• Batch number from COA

Use waterproof labeling or wrap paper labels with clear tape. Pen on the rubber stopper alone is not sufficient for multi-week vials — condensation from refrigerator cycling will fade ink.`,
      },
      {
        heading: "Biomarker Baseline and Tracking",
        body: `For any protocol intended to produce measurable biomarker changes, capture a baseline before first administration and schedule interim measurements:

• IGF-1: Baseline → Week 4 → Week 8 → Week 12 (or end-of-cycle)
• Body composition (DEXA or BIA): Baseline → Week 6 → Week 12 (or end-of-cycle)
• Fasting glucose / insulin: Baseline → monthly (especially for MK-677, GLP-1 agonist, and MOTS-c protocols)
• Complete metabolic panel (CMP): Baseline → end-of-cycle for any 12-week+ protocol
• Lipid panel: Baseline → end-of-cycle for GLP-1, GH-axis, or MOTS-c protocols

Biomarker tracking converts a simple administration log into research-quality data. Without comparative endpoints, protocol execution is not research — it is administration.`,
      },
      {
        heading: "Digital vs. Physical Records",
        body: `Maintain records in both formats when possible. A spreadsheet (Google Sheets, Excel, or Airtable) enables filtering by date, compound, and batch — critical for identifying patterns across multiple protocols or detecting lot-to-lot variability across different Nexphoria shipments.

For institutional research, maintain records per your IRB/IACUC protocol data retention requirements (typically 3–7 years). For independent lab use, a simple timestamped spreadsheet exported to PDF monthly is sufficient documentation discipline.`,
      },
    ],
  },
  {
    id: "stacking-protocols",
    title: "Protocol Design for Compound Stacking",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    content: [
      {
        heading: "Synergistic Stacks vs. Additive Stacks",
        body: `Synergistic stacks produce a combined effect larger than the sum of parts — most commonly seen in GH axis combinations. GHRH + GHRP co-administration produces 8–12× the GH response of either compound alone (Bowers 1998), due to complementary mechanisms: GHRH drives cAMP/PKA transcription of GH, while GHRPs inhibit somatostatin and amplify GH pulse amplitude.

Additive stacks produce roughly the sum of individual effects — relevant for repair compounds (BPC-157 + TB-500 acting on complementary tissue repair pathways) and antioxidant/longevity compounds (NAD+ + GHK-Cu + Epitalon targeting different aging mechanisms without receptor overlap).

Identify whether your stack rationale is synergistic or additive before designing administration timing, since synergistic stacks often require co-timing within a narrow window (e.g., GHRP + GHRH within 5–10 minutes for maximum GH amplitude), while additive stacks do not.`,
      },
      {
        heading: "Managing Receptor Competition",
        body: `When multiple compounds share a receptor class, receptor competition or saturation can reduce individual compound efficacy. Key examples:

• Multiple GLP-1R agonists: Do not co-administer semaglutide and tirzepatide — receptor saturation provides no additional GLP-1R occupancy, while increasing peptide load and potential tolerability issues
• GH axis: Do not co-administer two GHRH analogs (e.g., CJC-1295 No DAC + tesamorelin). GHRH receptors saturate; no benefit, additive tachyphylaxis risk
• MC1R compounds: GHK-Cu and Melanotan II both interact with melanocortin receptor pathways; simultaneous protocols produce confounded endpoint attribution

When compounds share a receptor, compare their binding affinities (Ki values) and design sequential rather than simultaneous protocols if disambiguation is needed.`,
      },
      {
        heading: "Same-Day Injection Load",
        body: `Administering 4+ compounds by subcutaneous injection in a single day creates site rotation pressure, increases cumulative injection trauma risk, and can complicate adverse effect attribution. Best practices:

• Cap same-day SC injections at 3 compounds where possible
• Consider route diversification (intranasal for Semax/Selank, oral for MK-677, topical for GHK-Cu serum applications) to reduce SC injection load
• Use combination timing where half-life allows: GH axis protocols allow CJC-1295 DAC to be administered weekly while ipamorelin is administered daily — reducing daily injection count without sacrificing protocol design
• Stagger long-half-life compounds to different days of the week`,
      },
    ],
  },
];

const QUICK_REFERENCE = [
  { label: "GH axis optimal timing", value: "Pre-sleep (60 min before bed) or post-exercise" },
  { label: "BPC-157 / TB-500 timing", value: "Any time; AM/PM split for loading phase" },
  { label: "GLP-1 analogs (sema/tirz)", value: "Weekly, consistent day; pre-meal for acute studies" },
  { label: "Loading phase duration", value: "5–14 days at 1.5–2× maintenance dose" },
  { label: "Minimum washout (most peptides)", value: "5 × half-life (≈97% clearance)" },
  { label: "Washout for receptor baseline", value: "7 × half-life (≈99.2% clearance)" },
  { label: "3-month cycle", value: "12 weeks — standard for most biomarker endpoints" },
  { label: "6-month cycle", value: "24 weeks — bone, cardiac, telomere, metabolic set-point" },
  { label: "Site rotation frequency", value: "6-zone rotation; ≥6 days between same-site injections" },
  { label: "Reconstituted vial expiry (BAC water)", value: "4–6 weeks at 2–8°C" },
  { label: "Reconstituted vial expiry (sterile water)", value: "5–7 days; single-use recommended" },
  { label: "GHRP tachyphylaxis management", value: "8–12 week on / 4–6 week off cycles; or 5-on/2-off" },
];

const RELATED_TOOLS = [
  { href: "/tools/half-life-calculator", label: "Half-Life Calculator", desc: "Calculate clearance milestones and dosing intervals for any compound" },
  { href: "/tools/dosing-frequency-planner", label: "Dosing Frequency Planner", desc: "Build a weekly injection calendar for your full stack" },
  { href: "/tools/reconstitution-calculator", label: "Reconstitution Calculator", desc: "Calculate BAC water volume, doses per vial, and volume per dose" },
  { href: "/tools/stack-builder", label: "Research Stack Builder", desc: "Curated multi-compound protocols with synergy rationale" },
  { href: "/tools/igf-1-calculator", label: "IGF-1 Response Estimator", desc: "Estimate IGF-1 % elevation from GH secretagogue combinations" },
  { href: "/guides/storage", label: "Storage Guide", desc: "Temperature and stability requirements for every compound" },
];

export default function DosingProtocolsGuide() {
  return (
    <main
      style={{ backgroundColor: "#131312", minHeight: "100vh", color: "#E8E4DA" }}
    >
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1a1a18 0%, #1e1e1b 50%, #131312 100%)", borderBottom: "1px solid rgba(212,175,55,0.15)", paddingTop: "80px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/tools" },
              { label: "Dosing Protocols" },
            ]}
          />
          <div style={{ marginTop: "28px", marginBottom: "12px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "20px", padding: "4px 14px" }}>
            <span style={{ color: "#d4af37", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Research Guide</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, marginTop: "12px", marginBottom: "16px" }}>
            Peptide Dosing Protocol Design
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#B8A44C", lineHeight: 1.7, maxWidth: "680px", marginBottom: "24px" }}>
            General principles for structuring rigorous research protocols: when to use loading phases, how to time administration for GH axis compounds, injection site rotation, cycle length selection, washout period calculation, and documentation standards.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#8a9070" }}>
            <span>~1,500 words · 12 min read</span>
            <span style={{ color: "rgba(212,175,55,0.4)" }}>|</span>
            <span>Last updated: May 2026</span>
            <span style={{ color: "rgba(212,175,55,0.4)" }}>|</span>
            <span style={{ color: "#c0392b", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em" }}>FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION</span>
          </div>
        </div>
      </section>

      {/* Quick Reference Strip */}
      <section style={{ background: "#1a1a18", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "32px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4af37", marginBottom: "18px" }}>
            Quick Reference — Key Protocol Parameters
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px" }}>
            {QUICK_REFERENCE.map((row) => (
              <div key={row.label} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 14px" }}>
                <span style={{ fontSize: "11px", color: "#8a9070", letterSpacing: "0.05em", marginBottom: "3px" }}>{row.label}</span>
                <span style={{ fontSize: "13px", color: "#E8E4DA", fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "12px", padding: "24px 28px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "#d4af37", marginBottom: "14px" }}>
            Table of Contents
          </h2>
          <ol style={{ listStyle: "decimal", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} style={{ color: "#c8c3b5", fontSize: "14px", textDecoration: "none" }}>
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Main Sections */}
      <article style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        {SECTIONS.map((section, si) => (
          <section
            key={section.id}
            id={section.id}
            style={{
              marginBottom: "64px",
              paddingBottom: "64px",
              borderBottom: si < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}
          >
            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.20)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4af37", flexShrink: 0 }}>
                {section.icon}
              </div>
              <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 700, letterSpacing: "-0.01em", color: "#E8E4DA", margin: 0 }}>
                {section.title}
              </h2>
            </div>

            {/* Subsections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {section.content.map((block) => (
                <div key={block.heading}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#d4af37", marginBottom: "10px", letterSpacing: "-0.01em" }}>
                    {block.heading}
                  </h3>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.75,
                      color: "#c0bbb0",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {block.body}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Research Use Disclaimer */}
        <div style={{ background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: "12px", padding: "20px 24px", marginBottom: "48px" }}>
          <p style={{ fontSize: "13px", color: "#c0392b", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            <strong>Research Use Only.</strong> All information in this guide is provided for research and educational purposes only. Nexphoria compounds are sold exclusively for in vitro and preclinical research. This guide does not constitute medical advice and should not be applied to human use. All research must comply with applicable regulations.
          </p>
        </div>
      </article>

      {/* Related Tools */}
      <section style={{ background: "#1a1a18", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4af37", marginBottom: "8px" }}>
            Related Tools & Resources
          </h2>
          <p style={{ fontSize: "14px", color: "#8a9070", marginBottom: "28px" }}>
            Apply the principles in this guide with Nexphoria&apos;s interactive research tools.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {RELATED_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "18px 20px", cursor: "pointer" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#E8E4DA", marginBottom: "6px" }}>{tool.label}</div>
                  <div style={{ fontSize: "12px", color: "#8a9070", lineHeight: 1.5 }}>{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
