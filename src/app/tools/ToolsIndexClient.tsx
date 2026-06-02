"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

type ToolGroup =
  | "Calculators"
  | "Protocol & Planning"
  | "Reference & Data"
  | "Trackers & Logs"
  | "Guides";

interface Tool {
  href: string;
  title: string;
  desc: string;
  badge: string;
  group: ToolGroup;
  icon: React.ReactNode;
}

const GROUP_ORDER: ToolGroup[] = [
  "Calculators",
  "Protocol & Planning",
  "Reference & Data",
  "Trackers & Logs",
  "Guides",
];

const GROUP_BLURB: Record<ToolGroup, string> = {
  Calculators: "Compute reconstitution, dosing, conversions, and study budgets.",
  "Protocol & Planning": "Design cycles, schedules, stacks, and printable protocols.",
  "Reference & Data": "Look up half-lives, biomarkers, purity specs, and literature.",
  "Trackers & Logs": "Keep records of vials, inventory, and research observations.",
  Guides: "In-depth written references on handling, storage, and verification.",
};

const TOOLS: Tool[] = [
  {
    href: "/quiz",
    title: "Protocol Finder Quiz",
    desc: "Answer 5 questions about your research focus, experience, and budget — get 3 compound recommendations matched to your study design.",
    badge: "Quiz",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
      </svg>
    ),
  },
  {
    href: "/tools/reconstitution-calculator",
    title: "Reconstitution Calculator",
    desc: "Calculate BAC water volume, dose volume (mL + syringe units), and doses per vial for any lyophilized peptide.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
      </svg>
    ),
  },
  {
    href: "/tools/water-volume-calculator",
    title: "BAC Water Volume Calculator",
    desc: "Enter vial size and desired concentration — get the exact mL of bacteriostatic water to add. Includes multi-concentration comparison table.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    href: "/tools/half-life-calculator",
    title: "Half-Life & Dosing Calculator",
    desc: "Calculate plasma half-life, clearance milestones, dosing frequency, and decay curve for 30+ research peptides.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: "/tools/unit-converter",
    title: "Unit Converter",
    desc: "Convert mcg/mg/g/IU, mL to insulin syringe units, nmol/L to ng/mL, and dilution factor (C₁V₁=C₂V₂) for any compound.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    ),
  },
  {
    href: "/tools/molarity-calculator",
    title: "Molarity Calculator",
    desc: "Convert between molar (nM/μM/mM/M) and mass (mg/mL/μg/mL) concentration for any peptide. Enter MW or select from 30+ catalog compounds.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    href: "/tools/body-weight-dose-calculator",
    title: "Body Weight Dose Calculator",
    desc: "Convert mg/kg or mcg/kg rodent-study dosing to absolute doses for any subject weight. Pre-loaded with published data for 30+ compounds.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
    ),
  },
  {
    href: "/tools/allometric-scaling-calculator",
    title: "Allometric Scaling Calculator",
    desc: "Convert rodent study doses to human-equivalent doses (HED) using FDA Km-based allometric scaling. Cross-species comparison table.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    href: "/tools/igf-1-calculator",
    title: "IGF-1 Response Estimator",
    desc: "Estimate IGF-1 % elevation from GHRH analog + GHRP stacking based on published data. Includes synergy multipliers and duration modifiers.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 4-6" />
      </svg>
    ),
  },
  {
    href: "/tools/cost-per-dose-calculator",
    title: "Cost Per Dose Calculator",
    desc: "Enter compound, vial size, dose, and frequency to calculate cost per dose, doses per vial, weekly spend, and monthly research budget.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-roi-calculator",
    title: "Research ROI Calculator",
    desc: "Estimate total compound cost for any peptide study design — by study type, subject count, and stack. Ideal for grant budget planning.",
    badge: "Calculator",
    group: "Calculators",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-research-planner",
    title: "Peptide Research Planner",
    desc: "All-in-one 4-step protocol wizard. Select your goal, set cycle dates, configure doses, then generate a complete printable research protocol.",
    badge: "Super-Tool",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    href: "/tools/stack-builder",
    title: "Research Stack Builder",
    desc: "Select a research goal and get a synergistic compound stack with mechanistic rationale, weekly schedule, and monthly cost estimate.",
    badge: "Planner",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    href: "/tools/dosing-frequency-planner",
    title: "Dosing Frequency Planner",
    desc: "Plan a weekly injection schedule across multiple compounds with auto-distribute, stacking warnings, and exportable protocol summary.",
    badge: "Planner",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-cycle-planner",
    title: "Peptide Cycle Planner",
    desc: "Calendar-based planner for 3-month and 6-month research cycles. Assign compounds to weeks, set washout periods, and print your protocol.",
    badge: "Planner",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-dose-response-planner",
    title: "Dose-Response Study Planner",
    desc: "Design multi-arm preclinical dose-response studies: log-spaced groups, powered group sizes, effect sizes, and printable protocol export.",
    badge: "Planner",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16 10 10 14 7 18 5" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    href: "/tools/protocol-template-generator",
    title: "Protocol Template Generator",
    desc: "Select compounds, doses, routes, and cycle length — generate a printable research protocol with reconstitution notes and schedule grid.",
    badge: "Generator",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-label-generator",
    title: "Vial Label Generator",
    desc: 'Generate printable 1"×2.5" cryo vial labels: compound, concentration, lot number, reconstitution date, storage temp, and initials.',
    badge: "Generator",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-interaction-checker",
    title: "Peptide Interaction Checker",
    desc: "Select 2–5 compounds to analyze receptor overlap, mechanism synergies, timing conflicts, and compatibility across a 30-compound database.",
    badge: "Checker",
    group: "Protocol & Planning",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="16" r="3" />
        <path d="M10.5 10.5 13.5 13.5" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-safety-checker",
    title: "Peptide Safety Checker",
    desc: "Side-effect profiles, receptor agonism/antagonism summary, contraindicated co-administration, and handling notes for 20+ research peptides.",
    badge: "Checker",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-stability-checker",
    title: "Peptide Stability Checker",
    desc: "Select a compound and storage condition for shelf-life estimates, degradation risk, key risk factors, and container recommendations.",
    badge: "Checker",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/tools/purity-checker",
    title: "Purity Checker & COA Guide",
    desc: "Look up HPLC purity specs for 28+ compounds. Learn how to read a Certificate of Analysis and the red flags that signal a fraudulent COA.",
    badge: "Reference",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    href: "/tools/compound-half-life-reference",
    title: "Peptide Half-Life Reference Table",
    desc: "Static reference table for 35+ research peptides: half-life, Tmax, dosing frequency, and route — sourced from published PK data.",
    badge: "Reference",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/tools/biomarker-reference",
    title: "Biomarker Reference",
    desc: "30+ lab biomarkers with normal ranges, compound interactions, and testing-frequency guidance: IGF-1, HbA1c, lipids, thyroid, and more.",
    badge: "Reference",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-news-feed",
    title: "Peptide Research News Feed",
    desc: "Curated landmark and high-impact PubMed papers on key research compounds. Filter by compound, category, or impact level.",
    badge: "Reference",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v8a2 2 0 0 1-2 2z" />
        <polyline points="17 2 17 8 23 8" />
      </svg>
    ),
  },
  {
    href: "/tools/injection-site-diagram",
    title: "Injection Site Diagram",
    desc: "Interactive body diagram with clickable zones — needle length, insertion angle, volume limits, rotation advice, and SC vs IM comparison.",
    badge: "Reference",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/tools/research-log",
    title: "Research Log",
    desc: "Daily research journal: log compounds, doses, routes, and observations. Stored locally in your browser. Filter, export CSV, or print.",
    badge: "Tracker",
    group: "Trackers & Logs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    href: "/tools/vial-inventory-tracker",
    title: "Vial Inventory Tracker",
    desc: "Track vials: lot numbers, quantities, reconstitution dates, and stability timelines. Low-stock alerts, expiry display, and CSV export.",
    badge: "Tracker",
    group: "Trackers & Logs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H15M9 3V6.5L6 14C5.5 16 6.5 19.5 12 20C17.5 20 18.5 16 18 14L15 6.5V3M9 3H15M9 12H15" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-inventory-tracker",
    title: "Peptide Inventory Tracker",
    desc: "Track research vials, monitor expiry dates, set alerts, mark as used, and export to CSV. All data stored locally in your browser.",
    badge: "Tracker",
    group: "Trackers & Logs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
      </svg>
    ),
  },
  {
    href: "/tools/peptide-timer",
    title: "Peptide Injection Timer",
    desc: "Track injection timing for multiple compounds. Live countdown to next dose, dosing-window status, and per-compound interval progress.",
    badge: "Tracker",
    group: "Trackers & Logs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/tools/bac-water-guide",
    title: "Bacteriostatic Water Guide",
    desc: "What BAC water is, why 0.9% benzyl alcohol matters, how to mix vials, storage after opening, and common mistakes.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2v6l-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8l-2-2V2" />
        <line x1="9" y1="2" x2="15" y2="2" />
      </svg>
    ),
  },
  {
    href: "/guides/storage",
    title: "Peptide Storage Guide",
    desc: "Storage reference for all catalog compounds: lyophilized vs reconstituted stability, temperature classes, freeze-thaw limits, and aliquoting.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    href: "/guides/reconstitution",
    title: "Reconstitution Guide",
    desc: "Written guide to reconstituting research peptides: solvent selection, injection technique, concentration math, labeling, and disposal.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
      </svg>
    ),
  },
  {
    href: "/guides/peptide-glossary",
    title: "Peptide Glossary",
    desc: "50+ research terms defined: lyophilization, reconstitution, HPLC, COA, half-life, GHSR-1a, GLP-1R, and more. Alphabetically indexed.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
      </svg>
    ),
  },
  {
    href: "/guides/coa-verification",
    title: "COA Verification Guide",
    desc: "Authenticate peptide COAs: ISO 17025 accreditation, lot matching, HPLC chromatograms, MS molecular mass, LAL endotoxin. 12-point checklist.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M7.5 9l1.5 1.5 3-3" />
      </svg>
    ),
  },
  {
    href: "/guides/dosing-protocols",
    title: "Dosing Protocol Design Guide",
    desc: "Written guide to protocol design: loading vs maintenance phases, GH axis timing, site rotation, cycle length, washout, and record-keeping.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: "/protocols",
    title: "Research Cycle Protocols",
    desc: "Understand 3-month and 6-month research cycles — supply alignment, reconstitution guidance, and storage requirements.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/compounds",
    title: "Compound Index",
    desc: "Index of all catalog compounds — mechanisms, CAS numbers, molecular weight, storage, and related literature.",
    badge: "Reference",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/faq",
    title: "Research FAQ",
    desc: "Q&As covering what research peptides are, ordering, cold-chain shipping, COA verification, reconstitution, and returns.",
    badge: "Guide",
    group: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    href: "/blog",
    title: "Research Journal",
    desc: "Peer-referenced articles on peptide biochemistry, compound profiles, quality testing, and cold-chain logistics.",
    badge: "Articles",
    group: "Reference & Data",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

export default function ToolsIndexClient() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<ToolGroup | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      const matchesGroup = activeGroup === "All" || t.group === activeGroup;
      const matchesQuery =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.badge.toLowerCase().includes(q) ||
        t.group.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [query, activeGroup]);

  const grouped = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      tools: filtered.filter((t) => t.group === group),
    })).filter((g) => g.tools.length > 0);
  }, [filtered]);

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of TOOLS) counts[t.group] = (counts[t.group] ?? 0) + 1;
    return counts;
  }, []);

  return (
    <div style={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20"
        style={{ backgroundColor: "#010101" }}
      >
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[{ label: "Home", href: "/" }, { label: "Research Tools" }]}
          />
          <p className="eyebrow mb-5" style={{ color: "#C9DD69" }}>
            Resources
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            Research Tools
          </h1>
          <p
            className="text-base md:text-lg max-w-xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Calculators, planners, reference data, and guides for researchers
            working with peptide compounds. Free to use — every output is a
            research-planning estimate.
          </p>
        </div>
      </section>

      {/* Search + group filter */}
      <section
        className="sticky top-0 z-20 px-6 py-5"
        style={{
          backgroundColor: "rgba(249,249,249,0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #ECEAE4",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-4">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#999" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools — reconstitution, half-life, molarity…"
              aria-label="Search research tools"
              className="w-full rounded-sm text-sm"
              style={{
                padding: "12px 16px 12px 44px",
                border: "1px solid #DDDBD5",
                backgroundColor: "#FFFFFF",
                color: "#000",
                outline: "none",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setActiveGroup("All")}
              className="text-xs px-4 py-2 rounded-full transition-colors"
              style={
                activeGroup === "All"
                  ? { backgroundColor: "#B8A44C", border: "1px solid #B8A44C", color: "#010101", fontWeight: 600 }
                  : { backgroundColor: "transparent", border: "1px solid #DDDBD5", color: "#555" }
              }
            >
              All ({TOOLS.length})
            </button>
            {GROUP_ORDER.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className="text-xs px-4 py-2 rounded-full transition-colors"
                style={
                  activeGroup === group
                    ? { backgroundColor: "#B8A44C", border: "1px solid #B8A44C", color: "#010101", fontWeight: 600 }
                    : { backgroundColor: "transparent", border: "1px solid #DDDBD5", color: "#555" }
                }
              >
                {group} ({groupCounts[group]})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grouped tool cards */}
      <section className="px-6 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          {grouped.length === 0 ? (
            <div
              className="rounded-sm p-12 text-center"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #ECEAE4" }}
            >
              <p className="text-sm" style={{ color: "#666" }}>
                No tools match{" "}
                <span style={{ color: "#000", fontWeight: 500 }}>
                  &ldquo;{query}&rdquo;
                </span>
                . Try a different term or clear the search.
              </p>
            </div>
          ) : (
            grouped.map(({ group, tools }, gi) => (
              <div key={group} className={gi > 0 ? "mt-16" : ""}>
                <div className="mb-6">
                  <h2
                    className="text-xl md:text-2xl tracking-tight"
                    style={{ fontWeight: 500, color: "#010101" }}
                  >
                    {group}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "#777" }}>
                    {GROUP_BLURB[group]}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group block rounded-sm p-7 transition-all hover:-translate-y-0.5"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #ECEAE4",
                        textDecoration: "none",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-0.5" style={{ color: "#B8A44C" }}>
                          {tool.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3
                              className="text-base font-medium group-hover:opacity-70 transition-opacity"
                              style={{ color: "#000" }}
                            >
                              {tool.title}
                            </h3>
                            <span
                              className="text-xs px-2 py-0.5 rounded-sm"
                              style={{
                                backgroundColor: "#B8A44C22",
                                color: "#7A8A60",
                                border: "1px solid #B8A44C44",
                                fontWeight: 500,
                              }}
                            >
                              {tool.badge}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
                            {tool.desc}
                          </p>
                          <p className="text-xs mt-3 font-medium" style={{ color: "#B8A44C" }}>
                            Open →
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* CTA to catalog */}
          <div
            className="mt-16 rounded-sm p-8 text-center"
            style={{ backgroundColor: "#010101", border: "1px solid #2A2A28" }}
          >
            <p className="eyebrow mb-4" style={{ color: "#C9DD69" }}>
              Ready to Order?
            </p>
            <h3
              className="text-2xl mb-3 tracking-tight"
              style={{ fontWeight: 200, color: "#F9F9F9" }}
            >
              Research-grade compounds, independently verified.
            </h3>
            <p className="text-sm mb-6" style={{ color: "#A0A0A0" }}>
              Every lot tested by independent laboratories. A lot-specific COA ships with every order.
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
