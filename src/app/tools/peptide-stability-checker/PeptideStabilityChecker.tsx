"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ── Types ────────────────────────────────────────────────────────────────────
type StorageCondition =
  | "room-temp"
  | "fridge"
  | "freezer"
  | "reconstituted-fridge"
  | "reconstituted-freezer";

type RiskLevel = "Low" | "Moderate" | "High" | "Very High";

interface StabilityProfile {
  slug: string;
  name: string;
  category: string;
  casNumber: string;
  mw: string;
  // Lyophilized shelf lives
  lyoRoomTemp: string;      // shelf life at room temp lyophilized
  lyoFridge: string;        // shelf life at 2-8°C lyophilized
  lyoFreezer: string;       // shelf life at -20°C lyophilized (ideal)
  // Reconstituted shelf lives
  reconFridge: string;      // shelf life reconstituted at 2-8°C
  reconFreezer: string;     // shelf life reconstituted at -20°C
  // Risk factors by condition
  riskFactors: Record<StorageCondition, string[]>;
  // Degradation risks
  riskLevel: Record<StorageCondition, RiskLevel>;
  // Special handling notes
  specialNotes: string[];
  // Recommended container
  container: string;
  // Light sensitive?
  lightSensitive: boolean;
  // Freeze-thaw cycles
  maxFreezeThaw: number;
}

// ── Stability Database ───────────────────────────────────────────────────────
const stabilityData: StabilityProfile[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Repair Peptides",
    casNumber: "137525-51-0",
    mw: "1419.5 Da",
    lyoRoomTemp: "6–12 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days (single freeze)",
    riskFactors: {
      "room-temp": ["Oxidation at Met residue", "Moisture ingress", "Thermal peptide bond stress"],
      "fridge": ["Moisture condensation risk on vial cap", "Minor oxidation over time"],
      "freezer": ["Freeze-thaw mechanical stress if cycled", "Container integrity"],
      "reconstituted-fridge": ["pH drift in BAC water", "Microbial contamination if BAC exhausted", "Oxidative degradation"],
      "reconstituted-freezer": ["Ice crystal formation damages peptide matrix", "Concentration changes on freeze", "Volume accuracy on thaw"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Moderate",
    },
    specialNotes: ["Acetate salt form is more stable than arginate", "Reconstitute with BAC water for multi-use", "Amber/opaque vials preferred"],
    container: "Amber borosilicate glass vial, rubber septum",
    lightSensitive: true,
    maxFreezeThaw: 3,
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin β-4)",
    category: "Repair Peptides",
    casNumber: "77591-33-4",
    mw: "4963.5 Da",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24+ months",
    reconFridge: "21–30 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["43-aa peptide prone to aggregation at elevated temp", "Oxidation of Met-6 residue"],
      "fridge": ["Minor aggregation risk over months", "Protect from moisture"],
      "freezer": ["Very stable; main risk is improper sealing"],
      "reconstituted-fridge": ["Aggregation in non-BAC solutions", "pH-dependent stability (optimal pH 5.5–7)"],
      "reconstituted-freezer": ["Aggregation on slow freeze", "Use flash-freeze in liquid N2 or -80°C if available"],
    },
    riskLevel: {
      "room-temp": "High",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Large peptide — aggregation is primary degradation pathway", "Avoid vortexing; swirl gently", "1–2 mg/mL maximum reconstitution concentration recommended"],
    container: "Type I borosilicate glass, low-binding",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    category: "Cosmetic Peptides",
    casNumber: "89030-95-5",
    mw: "340.4 Da (tripeptide) + Cu",
    lyoRoomTemp: "6–9 months (sealed)",
    lyoFridge: "18–24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "60–90 days",
    riskFactors: {
      "room-temp": ["Copper dissociation in humid air", "Oxidation of His imidazole-Cu complex"],
      "fridge": ["Very stable; minor humidity risk"],
      "freezer": ["Highly stable lyophilized; copper complex intact"],
      "reconstituted-fridge": ["Copper precipitation at neutral-alkaline pH", "Discoloration (green→brown) indicates degradation"],
      "reconstituted-freezer": ["Copper complex can dissociate on freeze-thaw"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Moderate",
    },
    specialNotes: ["Color change (blue-green → colorless/brown) indicates Cu dissociation", "Reconstitute in slightly acidic BAC water", "Avoid metal instruments — use plastic syringes"],
    container: "Amber glass or HDPE vial; avoid metal contact",
    lightSensitive: true,
    maxFreezeThaw: 2,
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "GLP-1 Agonists",
    casNumber: "910463-68-2",
    mw: "4113.6 Da",
    lyoRoomTemp: "1–3 months",
    lyoFridge: "18 months",
    lyoFreezer: "24 months",
    reconFridge: "28–56 days",
    reconFreezer: "Not recommended",
    riskFactors: {
      "room-temp": ["Fatty acid side chain hydrolysis", "Aggregation at elevated temp", "C18 chain oxidation"],
      "fridge": ["Stable; some aggregation risk over 2+ years"],
      "freezer": ["Very stable; avoid freeze-thaw cycling"],
      "reconstituted-fridge": ["Gradual aggregation (main degradation route)", "pH matters — optimal 7.0–7.4"],
      "reconstituted-freezer": ["NOT recommended — freeze-thaw causes irreversible aggregation of fatty acid-conjugated peptide"],
    },
    riskLevel: {
      "room-temp": "High",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Very High",
    },
    specialNotes: ["Fatty acid conjugate makes freeze-thaw particularly damaging", "Commercial Ozempic pen stored at room temp after first use (28 days)", "Reconstituted: do NOT freeze"],
    container: "Type I borosilicate glass, pH-neutral",
    lightSensitive: true,
    maxFreezeThaw: 1,
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "GLP-1 Agonists",
    casNumber: "2023788-19-2",
    mw: "4813.5 Da",
    lyoRoomTemp: "1–3 months",
    lyoFridge: "18 months",
    lyoFreezer: "24 months",
    reconFridge: "28 days",
    reconFreezer: "Not recommended",
    riskFactors: {
      "room-temp": ["C20 fatty diacid chain hydrolysis", "Aggregation", "UV degradation of Aib residues"],
      "fridge": ["Stable; aggregation check before use"],
      "freezer": ["Stable lyophilized"],
      "reconstituted-fridge": ["Aggregation over 4+ weeks", "pH drift"],
      "reconstituted-freezer": ["Fatty acid conjugate freezing causes irreversible aggregation"],
    },
    riskLevel: {
      "room-temp": "High",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Very High",
    },
    specialNotes: ["Similar stability profile to semaglutide; both GLP-1R fatty acid conjugates", "Do not freeze reconstituted solution", "Discard if solution appears cloudy or contains particles"],
    container: "Amber Type I glass; pH 4.5–5.5 in commercial formulation",
    lightSensitive: true,
    maxFreezeThaw: 1,
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "GLP-1 Agonists",
    casNumber: "2381722-16-1",
    mw: "4759.5 Da",
    lyoRoomTemp: "1–2 months",
    lyoFridge: "12–18 months",
    lyoFreezer: "24 months",
    reconFridge: "14–28 days",
    reconFreezer: "Not recommended",
    riskFactors: {
      "room-temp": ["Triple receptor; complex folding prone to unfolding at temp", "C18 fatty acid hydrolysis", "GCGR-binding domain oxidation"],
      "fridge": ["Most stable condition for lyophilized"],
      "freezer": ["Very stable"],
      "reconstituted-fridge": ["Aggregation risk; triple receptor structure", "pH drift accelerates degradation"],
      "reconstituted-freezer": ["Irreversible aggregation on freeze — avoid"],
    },
    riskLevel: {
      "room-temp": "Very High",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Very High",
    },
    specialNotes: ["Newer compound — stability data still emerging from Phase 2/3", "More sensitive than semaglutide due to triple receptor complexity", "Keep lyophilized until day of use when possible"],
    container: "Amber Type I glass, -80°C ideal for long-term research stock",
    lightSensitive: true,
    maxFreezeThaw: 1,
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Longevity",
    casNumber: "53-84-9",
    mw: "663.4 Da",
    lyoRoomTemp: "3–6 months (sealed, desiccated)",
    lyoFridge: "12–18 months",
    lyoFreezer: "24 months",
    reconFridge: "7–14 days (pH sensitive)",
    reconFreezer: "30 days (if pH controlled)",
    riskFactors: {
      "room-temp": ["Hydrolysis of glycosidic bond", "Highly hygroscopic — moisture absorption triggers rapid degradation", "Temperature-accelerated hydrolysis"],
      "fridge": ["Hydrolysis risk if moisture present", "Must be fully desiccated"],
      "freezer": ["Stable with proper desiccation", "Avoid frost-free freezers (humidity cycling)"],
      "reconstituted-fridge": ["Rapid hydrolysis at neutral pH — half-life <24h at pH 7", "Optimal pH 3–5 extends to days", "Use immediately or aliquot"],
      "reconstituted-freezer": ["More stable than fridge", "Flash-freeze immediately after reconstitution"],
    },
    riskLevel: {
      "room-temp": "High",
      "fridge": "Moderate",
      "freezer": "Low",
      "reconstituted-fridge": "Very High",
      "reconstituted-freezer": "Moderate",
    },
    specialNotes: ["Most labile common research compound — use immediately after reconstitution", "Reconstitute in cold sterile water pH ~5–6, NOT BAC water", "Yellow color is normal; cloudiness indicates degradation", "NMN/NR are more stable alternatives for some research models"],
    container: "Amber glass with desiccant; seal under inert gas (N2/Ar) ideal",
    lightSensitive: true,
    maxFreezeThaw: 3,
  },
  {
    slug: "mk-677",
    name: "MK-677 (Ibutamoren)",
    category: "GH Axis",
    casNumber: "159634-47-6",
    mw: "624.8 Da",
    lyoRoomTemp: "12–18 months (powder)",
    lyoFridge: "24+ months",
    lyoFreezer: "24+ months",
    reconFridge: "30–60 days",
    reconFreezer: "6–12 months (aqueous)",
    riskFactors: {
      "room-temp": ["Moisture uptake in humid climates", "Non-peptide small molecule — more robust than most peptides"],
      "fridge": ["Very stable; minor moisture risk"],
      "freezer": ["Highly stable; small molecule robustness"],
      "reconstituted-fridge": ["More stable than peptides; some solvent evaporation over time"],
      "reconstituted-freezer": ["Very stable; standard freeze-thaw tolerated"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Non-peptide GHS — significantly more stable than peptide GHRPs", "Often dissolved in DMSO or acidified water for stock solutions", "Oral bioavailability makes liquid formulations practical"],
    container: "Standard amber glass or HDPE; desiccant optional",
    lightSensitive: false,
    maxFreezeThaw: 10,
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "GH Axis",
    casNumber: "170851-70-4",
    mw: "711.9 Da",
    lyoRoomTemp: "6–12 months",
    lyoFridge: "24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["D-2-Nal residue adds conformational stability vs natural peptides", "Still susceptible to moisture-driven oxidation"],
      "fridge": ["Very stable; recommended for daily-use vials"],
      "freezer": ["Optimal for long-term storage"],
      "reconstituted-fridge": ["Good stability in BAC water at pH 5–7", "Avoid alkaline pH"],
      "reconstituted-freezer": ["Stable; D-amino acid protects against proteolytic degradation"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["D-amino acid residue confers proteolytic resistance and stability", "Among the most stable GHRP-class compounds", "Suitable for extended fridge storage reconstituted"],
    container: "Standard borosilicate glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "GH Axis",
    casNumber: "86168-78-7",
    mw: "3357.9 Da",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24 months",
    reconFridge: "7–14 days",
    reconFreezer: "60–90 days",
    riskFactors: {
      "room-temp": ["29-aa peptide oxidizes at Met-27", "Thermal denaturation at >30°C", "Humidity accelerates hydrolysis"],
      "fridge": ["Stable; small oxidation risk"],
      "freezer": ["Very stable"],
      "reconstituted-fridge": ["Met-27 oxidation primary risk", "Use within 2 weeks"],
      "reconstituted-freezer": ["Stable; minor aggregation on repeated freeze-thaw"],
    },
    riskLevel: {
      "room-temp": "High",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Shorter half-life (11 min) than CJC-1295; less potent but more physiologic", "Met residue oxidation confirmed major in-solution degradation pathway", "Protect from oxygen exposure during reconstitution"],
    container: "Amber borosilicate glass, rubber stopper",
    lightSensitive: false,
    maxFreezeThaw: 3,
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin Blend",
    category: "GH Axis",
    casNumber: "N/A (blend)",
    mw: "3647.2 Da (CJC) + 711.9 Da (Ipa)",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24 months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["Two-compound blend; stability limited by least stable component (CJC)", "Potential for CJC macrolactam ring opening at temperature"],
      "fridge": ["CJC DAC albumin bond stable at 2-8°C"],
      "freezer": ["Very stable"],
      "reconstituted-fridge": ["Separate degradation pathways for each compound", "CJC albumin binding may affect ipamorelin activity"],
      "reconstituted-freezer": ["Stable blend; single freeze recommended"],
    },
    riskLevel: {
      "room-temp": "High",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Blend stability = stability of weakest component", "CJC-1295 with DAC has 8-day half-life in vivo; lyophilized stability is standard peptide range", "If separating compounds: ipamorelin stores longer"],
    container: "Amber borosilicate glass",
    lightSensitive: false,
    maxFreezeThaw: 3,
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 No DAC (Mod GRF 1-29)",
    category: "GH Axis",
    casNumber: "863288-34-0",
    mw: "3367.9 Da",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24 months",
    reconFridge: "7–14 days",
    reconFreezer: "60–90 days",
    riskFactors: {
      "room-temp": ["Aib substitutions improve stability vs native GHRH", "Still susceptible to Met oxidation at Met-27"],
      "fridge": ["Very stable; preferred for short-term research use"],
      "freezer": ["Optimal for research stock"],
      "reconstituted-fridge": ["Met-27 oxidation; use within 2 weeks", "Gentle handling required"],
      "reconstituted-freezer": ["Stable; Aib residues resist freeze-thaw peptide bond hydrolysis"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["4 Aib substitutions dramatically improve proteolytic stability vs native GHRH", "30-min half-life means reconstituted vial is viable for weeks (degradation pathway is chemical, not enzymatic)", "Preferred over DAC for pulsatile GH research models"],
    container: "Standard borosilicate glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "GH Axis",
    casNumber: "218949-48-9",
    mw: "5134.4 Da",
    lyoRoomTemp: "2–4 months",
    lyoFridge: "18 months",
    lyoFreezer: "24 months",
    reconFridge: "14 days (per Egrifta label)",
    reconFreezer: "Not recommended (commercial)",
    riskFactors: {
      "room-temp": ["trans-3-hexenoic acid conjugate susceptible to thermal hydrolysis", "Larger peptide — aggregation risk at >25°C"],
      "fridge": ["Stable; recommended condition"],
      "freezer": ["Very stable lyophilized"],
      "reconstituted-fridge": ["Aggregation after 14 days", "pH-sensitive stability (pH 7)"],
      "reconstituted-freezer": ["Conjugated GHRH analog may aggregate on freeze; limited data"],
    },
    riskLevel: {
      "room-temp": "High",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Moderate",
    },
    specialNotes: ["FDA-approved Egrifta requires refrigerated storage 2-8°C", "Reconstituted solution: 14-day max even at 2-8°C (per commercial data)", "Most stable of all GHRH analogs when lyophilized at -20°C"],
    container: "Type I borosilicate glass, rubber stopper",
    lightSensitive: true,
    maxFreezeThaw: 2,
  },
  {
    slug: "epitalon",
    name: "Epitalon",
    category: "Longevity",
    casNumber: "307297-39-8",
    mw: "390.4 Da",
    lyoRoomTemp: "12–18 months",
    lyoFridge: "24+ months",
    lyoFreezer: "24+ months",
    reconFridge: "21–30 days",
    reconFreezer: "6 months",
    riskFactors: {
      "room-temp": ["Tetrapeptide — very robust; minor moisture risk", "Protect from humidity"],
      "fridge": ["Highly stable"],
      "freezer": ["Optimal; tetrapeptides are among most stable class"],
      "reconstituted-fridge": ["Very stable in aqueous solution", "Normal peptide degradation timeline"],
      "reconstituted-freezer": ["Excellent stability; small tetrapeptide tolerates freeze-thaw well"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Ala-Glu-Asp-Gly tetrapeptide — four amino acids, exceptional stability", "Among easiest compounds to store correctly", "Minimal special handling required beyond desiccation"],
    container: "Standard glass or HDPE vial",
    lightSensitive: false,
    maxFreezeThaw: 10,
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Nootropics",
    casNumber: "129954-34-3",
    mw: "751.9 Da",
    lyoRoomTemp: "6–12 months",
    lyoFridge: "24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["Tuftsin analog — relatively stable 7-mer", "Moderate moisture sensitivity"],
      "fridge": ["Stable"],
      "freezer": ["Very stable"],
      "reconstituted-fridge": ["Stable in BAC water", "Intranasal formulation has shorter stability than injectable"],
      "reconstituted-freezer": ["Stable; standard freeze-thaw acceptable"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Intranasal research use: reconstitute in saline, use within 7 days", "Pro-Gly-Pro tuftsin analog — well-studied stability profile", "Stable enough for typical research multi-week protocols"],
    container: "Standard glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "semax",
    name: "Semax",
    category: "Nootropics",
    casNumber: "80714-61-0",
    mw: "813.0 Da",
    lyoRoomTemp: "6–12 months",
    lyoFridge: "24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["ACTH(4-7)PGP — relatively stable modified peptide", "Heptapeptide robustness"],
      "fridge": ["Very stable"],
      "freezer": ["Optimal"],
      "reconstituted-fridge": ["Stable in BAC water or sterile saline"],
      "reconstituted-freezer": ["Standard freeze-thaw acceptable"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Pro-Gly-Pro C-terminal extension protects from exopeptidase degradation", "Russian research compound with well-understood stability", "Intranasal use: reconstitute in sterile saline, refrigerate, use within 7–10 days"],
    container: "Standard glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "Cosmetic Peptides",
    casNumber: "189691-06-3",
    mw: "1025.2 Da",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24 months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["Cyclic heptapeptide with disulfide bridge — bridge can oxidize/reduce improperly", "Met residue oxidation"],
      "fridge": ["Disulfide bond stable", "Protect from light"],
      "freezer": ["Very stable"],
      "reconstituted-fridge": ["Disulfide bridge stability depends on pH — optimal 4–6", "Avoid alkaline conditions"],
      "reconstituted-freezer": ["Stable; cyclic structure tolerates freeze-thaw better than linear"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Cyclic structure via disulfide bridge (Cys4-Cys10 equivalent) — avoid reducing agents", "Blood pressure elevation property unrelated to stability", "Slightly acidic reconstitution solution (~pH 5) recommended"],
    container: "Amber glass vial, avoid reducing agents",
    lightSensitive: true,
    maxFreezeThaw: 3,
  },
  {
    slug: "melanotan-ii",
    name: "Melanotan II",
    category: "Cosmetic Peptides",
    casNumber: "121062-08-6",
    mw: "1024.2 Da",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24 months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["Cyclic structure with D-Phe — more stable than linear analogs", "Light exposure darkens and oxidizes His residue"],
      "fridge": ["Protect from light; otherwise very stable"],
      "freezer": ["Highly stable at -20°C"],
      "reconstituted-fridge": ["His-Phe disulfide macrolactam; pH 5–7 optimal", "UV light degrades rapidly once in solution"],
      "reconstituted-freezer": ["Stable; protect from light during thaw"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Moderate",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["CRITICAL: protect from UV/visible light at all storage stages", "Darkening of solution indicates His oxidation — discard", "Amber vials mandatory; handle under yellow/amber light if possible"],
    container: "Amber borosilicate glass — mandatory",
    lightSensitive: true,
    maxFreezeThaw: 3,
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "Weight Management",
    casNumber: "221231-10-3",
    mw: "1815.1 Da",
    lyoRoomTemp: "6–12 months",
    lyoFridge: "24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["hGH fragment; disulfide bridge between Cys-182 and Cys-189 equivalent", "Bridge oxidation at higher temperatures"],
      "fridge": ["Very stable"],
      "freezer": ["Optimal"],
      "reconstituted-fridge": ["Disulfide intact at pH 5–7", "Avoid basic pH"],
      "reconstituted-freezer": ["Stable; minor freeze-thaw disulfide risk"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Disulfide bridge — avoid reducing agents (DTT, BME)", "More stable than full-length hGH due to smaller size", "No IGF-1 activity means degradation profile is straightforward"],
    container: "Standard borosilicate glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Immune Support",
    casNumber: "62304-98-7",
    mw: "3108.5 Da",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24+ months",
    reconFridge: "21–30 days",
    reconFreezer: "6 months",
    riskFactors: {
      "room-temp": ["28-aa peptide with N-terminal acetyl group; acetyl protects slightly", "Moisture-accelerated hydrolysis"],
      "fridge": ["Very stable; commercial Zadaxin stored at 2-8°C"],
      "freezer": ["Optimal for research stock"],
      "reconstituted-fridge": ["Very stable in aqueous solution", "N-terminal acetyl prevents exopeptidase attack"],
      "reconstituted-freezer": ["Stable; freezing does not affect acetyl group"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["N-terminal acetylation provides extra proteolytic stability vs unmodified peptides", "Commercial Zadaxin stored 2-8°C; room temp stability is limited", "Well-characterized stability profile from decades of clinical use"],
    container: "Standard Type I glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "Longevity",
    casNumber: "736992-21-5",
    mw: "639.8 Da",
    lyoRoomTemp: "6–12 months",
    lyoFridge: "24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["D-Arg and Dmt residues provide exceptional stability", "Minimal degradation at room temp if desiccated"],
      "fridge": ["Very stable"],
      "freezer": ["Highly stable; D-amino acids resist hydrolysis"],
      "reconstituted-fridge": ["Stable in aqueous solution; small MW tetrapeptide"],
      "reconstituted-freezer": ["Excellent; tetrapeptide with D-amino acids is freeze-thaw resistant"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["D-Arg-Dmt-Lys-Phe-NH2 — two D-amino acids and C-terminal amide = extraordinary stability", "Among the most stable research peptides available", "C-terminal amide prevents exopeptidase attack from C-terminus"],
    container: "Standard glass vial",
    lightSensitive: false,
    maxFreezeThaw: 10,
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Longevity",
    casNumber: "1627580-64-6",
    mw: "2173.5 Da",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["16-aa peptide; standard stability profile", "Moisture sensitivity"],
      "fridge": ["Stable"],
      "freezer": ["Very stable"],
      "reconstituted-fridge": ["Stable in BAC water"],
      "reconstituted-freezer": ["Standard stability"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Mitochondria-derived peptide encoded from 12S rRNA", "Limited commercial stability data; treat as standard 16-aa linear peptide", "Keep frozen for research stock; use fridge for active research period"],
    container: "Standard borosilicate glass",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "dsip",
    name: "DSIP",
    category: "Nootropics",
    casNumber: "62697-59-0",
    mw: "848.9 Da",
    lyoRoomTemp: "6–12 months",
    lyoFridge: "24 months",
    lyoFreezer: "24+ months",
    reconFridge: "21–30 days",
    reconFreezer: "6 months",
    riskFactors: {
      "room-temp": ["D-Ala residue provides proteolytic resistance", "Very stable nonapeptide"],
      "fridge": ["Highly stable"],
      "freezer": ["Optimal"],
      "reconstituted-fridge": ["Excellent stability in BAC water"],
      "reconstituted-freezer": ["D-amino acid ensures minimal freeze-thaw degradation"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["D-Ala residue dramatically extends proteolytic half-life vs native DSIP", "Among the most stable nootropic peptides", "Standard storage practices are more than sufficient"],
    container: "Standard glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "kisspeptin",
    name: "Kisspeptin",
    category: "Reproductive Research",
    casNumber: "374683-24-6",
    mw: "1302.5 Da (KP-10)",
    lyoRoomTemp: "3–6 months",
    lyoFridge: "18–24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "90 days",
    riskFactors: {
      "room-temp": ["RF-amide C-terminus provides some stability", "Standard moisture sensitivity"],
      "fridge": ["Stable"],
      "freezer": ["Very stable"],
      "reconstituted-fridge": ["Stable in BAC or sterile water"],
      "reconstituted-freezer": ["Standard stability"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["C-terminal amide of KP-10 provides stability benefit", "KP-54 (full length) less stable than KP-10 due to larger size", "Pulsatile dosing research: fridge storage for active protocol period"],
    container: "Standard borosilicate glass vial",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "oxytocin",
    name: "Oxytocin",
    category: "Nootropics",
    casNumber: "50-56-6",
    mw: "1007.2 Da",
    lyoRoomTemp: "6–12 months (desiccated)",
    lyoFridge: "24 months",
    lyoFreezer: "24+ months",
    reconFridge: "14–21 days",
    reconFreezer: "6 months",
    riskFactors: {
      "room-temp": ["Cyclic disulfide Cys1-Cys6 bridge — stable but room temp accelerates oxidation over months", "Moisture ingress → disulfide scrambling"],
      "fridge": ["2-8°C: industry standard for commercial oxytocin products"],
      "freezer": ["Highly stable; clinical stock stored at -20°C"],
      "reconstituted-fridge": ["Disulfide intact at pH 3.5–5.5 (commercial pH)", "pH >7 risks disulfide oxidation"],
      "reconstituted-freezer": ["Stable; cyclic peptide tolerates freeze-thaw"],
    },
    riskLevel: {
      "room-temp": "Moderate",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Commercial Pitocin maintained at pH 3.5–5.5 for optimal stability", "Disulfide bridge is critical for OTR binding — protect from reducing agents", "Intranasal research: reconstitute in sterile saline pH 5, use within 14 days"],
    container: "Standard glass vial; keep pH acidic when reconstituted",
    lightSensitive: false,
    maxFreezeThaw: 5,
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Immune Support",
    casNumber: "108467-07-2",
    mw: "369.4 Da",
    lyoRoomTemp: "12–18 months",
    lyoFridge: "24+ months",
    lyoFreezer: "24+ months",
    reconFridge: "21–30 days",
    reconFreezer: "6 months",
    riskFactors: {
      "room-temp": ["Tripeptide — highly stable", "Minimal degradation at room temp if sealed"],
      "fridge": ["Very stable"],
      "freezer": ["Optimal"],
      "reconstituted-fridge": ["Excellent aqueous stability"],
      "reconstituted-freezer": ["Tripeptide is freeze-thaw resistant"],
    },
    riskLevel: {
      "room-temp": "Low",
      "fridge": "Low",
      "freezer": "Low",
      "reconstituted-fridge": "Low",
      "reconstituted-freezer": "Low",
    },
    specialNotes: ["Lys-Pro-Val tripeptide — extraordinary stability profile", "Oral stability demonstrated in research (GI mucosal research)", "One of the most stable compounds in the Nexphoria catalog"],
    container: "Standard glass or HDPE vial",
    lightSensitive: false,
    maxFreezeThaw: 10,
  },
  {
    slug: "ll-37",
    name: "LL-37",
    category: "Immune Support",
    casNumber: "154947-66-7",
    mw: "4493.3 Da",
    lyoRoomTemp: "2–4 months",
    lyoFridge: "12–18 months",
    lyoFreezer: "24 months",
    reconFridge: "7–14 days",
    reconFreezer: "60–90 days",
    riskFactors: {
      "room-temp": ["37-aa cationic amphipathic helix — aggregation-prone at elevated temperature", "Self-associates into multimers — concentration dependent"],
      "fridge": ["Stable but aggregation still possible at high concentrations"],
      "freezer": ["Optimal; dilute stock preferred"],
      "reconstituted-fridge": ["Aggregation major concern at >0.5 mg/mL", "Activity loss with aggregation (not degradation)"],
      "reconstituted-freezer": ["Keep dilute; concentrated solutions aggregate on freeze"],
    },
    riskLevel: {
      "room-temp": "Very High",
      "fridge": "Moderate",
      "freezer": "Low",
      "reconstituted-fridge": "High",
      "reconstituted-freezer": "Moderate",
    },
    specialNotes: ["Aggregation, not degradation, is primary stability concern for LL-37", "Keep reconstituted concentration ≤0.1–0.5 mg/mL to prevent self-assembly", "Pre-make dilute aliquots; freeze immediately; use each aliquot once"],
    container: "Low-binding polypropylene or silanized glass; avoid standard glass (adsorption)",
    lightSensitive: false,
    maxFreezeThaw: 2,
  },
];

// ── Condition metadata ───────────────────────────────────────────────────────
const conditionLabels: Record<StorageCondition, string> = {
  "room-temp": "Room Temp (15–25°C)",
  "fridge": "Refrigerated (2–8°C)",
  "freezer": "Frozen (−20°C)",
  "reconstituted-fridge": "Reconstituted — Fridge",
  "reconstituted-freezer": "Reconstituted — Frozen",
};

const conditionIcons: Record<StorageCondition, string> = {
  "room-temp": "🌡",
  "fridge": "❄",
  "freezer": "🧊",
  "reconstituted-fridge": "💉❄",
  "reconstituted-freezer": "💉🧊",
};

const riskColors: Record<RiskLevel, string> = {
  "Low": "text-green-400",
  "Moderate": "text-yellow-400",
  "High": "text-orange-400",
  "Very High": "text-red-400",
};

const riskBgColors: Record<RiskLevel, string> = {
  "Low": "bg-green-400/10 border-green-400/30",
  "Moderate": "bg-yellow-400/10 border-yellow-400/30",
  "High": "bg-orange-400/10 border-orange-400/30",
  "Very High": "bg-red-400/10 border-red-400/30",
};

const riskBarWidths: Record<RiskLevel, string> = {
  "Low": "w-1/4",
  "Moderate": "w-2/4",
  "High": "w-3/4",
  "Very High": "w-full",
};

const riskBarBg: Record<RiskLevel, string> = {
  "Low": "bg-green-400",
  "Moderate": "bg-yellow-400",
  "High": "bg-orange-400",
  "Very High": "bg-red-400",
};

// ── Shelf life from condition ─────────────────────────────────────────────────
function getShelfLife(p: StabilityProfile, condition: StorageCondition): string {
  switch (condition) {
    case "room-temp": return p.lyoRoomTemp;
    case "fridge": return p.lyoFridge;
    case "freezer": return p.lyoFreezer;
    case "reconstituted-fridge": return p.reconFridge;
    case "reconstituted-freezer": return p.reconFreezer;
  }
}

// ── Category list ────────────────────────────────────────────────────────────
const categories = Array.from(new Set(stabilityData.map((p) => p.category))).sort();

// ── Main Component ───────────────────────────────────────────────────────────
export default function PeptideStabilityChecker() {
  const [selectedSlug, setSelectedSlug] = useState<string>("bpc-157");
  const [selectedCondition, setSelectedCondition] = useState<StorageCondition>("freezer");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompounds = stabilityData.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const selected = stabilityData.find((p) => p.slug === selectedSlug);
  const shelfLife = selected ? getShelfLife(selected, selectedCondition) : "";
  const risk = selected ? selected.riskLevel[selectedCondition] : "Low";
  const riskFactors = selected ? selected.riskFactors[selectedCondition] : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="bg-zinc-900 border-b border-white/10 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6 justify-center"
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "Peptide Stability Checker" },
            ]}
          />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-[#d4af37] mb-3 font-medium">
            Research Tools
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Peptide Stability Checker
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Select a compound and storage condition to get compound-specific shelf life estimates,
            degradation risk level, and storage recommendations.
          </p>
          <p className="mt-4 text-xs text-zinc-500">
            For Research Use Only — stability data derived from published literature and manufacturer specifications.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Compound Selector */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-5">1. Select Compound</h2>

          {/* Search + category filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search compounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Compound grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredCompounds.map((p) => {
              const overallRisk = Object.values(p.riskLevel).some(r => r === "Very High") ? "Very High"
                : Object.values(p.riskLevel).some(r => r === "High") ? "High"
                : Object.values(p.riskLevel).some(r => r === "Moderate") ? "Moderate"
                : "Low";
              return (
                <button
                  key={p.slug}
                  onClick={() => setSelectedSlug(p.slug)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedSlug === p.slug
                      ? "border-[#d4af37] bg-[#d4af37]/10"
                      : "border-white/10 bg-zinc-800 hover:border-white/30"
                  }`}
                >
                  <div className="text-sm font-medium leading-snug">{p.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{p.category}</div>
                  <div className={`text-xs mt-1 font-medium ${riskColors[overallRisk]}`}>
                    {overallRisk === "Low" ? "▲ Stable" : overallRisk === "Very High" ? "⚠ Sensitive" : `● ${overallRisk}`}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCompounds.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              No compounds match your search. <button onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }} className="text-[#d4af37] hover:underline">Clear filters</button>
            </div>
          )}
        </div>

        {/* Storage Condition Selector */}
        {selected && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-5">2. Select Storage Condition</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(Object.keys(conditionLabels) as StorageCondition[]).map((cond) => {
                const condRisk = selected.riskLevel[cond];
                return (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`flex flex-col items-center p-4 rounded-xl border transition-all text-center ${
                      selectedCondition === cond
                        ? "border-[#d4af37] bg-[#d4af37]/10"
                        : "border-white/10 bg-zinc-800 hover:border-white/30"
                    }`}
                  >
                    <span className="text-2xl mb-2">{conditionIcons[cond]}</span>
                    <span className="text-xs font-medium leading-tight">{conditionLabels[cond]}</span>
                    <span className={`text-xs mt-1 font-semibold ${riskColors[condRisk]}`}>{condRisk}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Panel */}
        {selected && (
          <div className={`border rounded-2xl p-6 ${riskBgColors[risk]}`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selected.name}</h2>
                <p className="text-zinc-400 text-sm mt-1">{selected.category} · MW: {selected.mw} · CAS: {selected.casNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">Degradation Risk</div>
                <div className={`text-2xl font-bold ${riskColors[risk]}`}>{risk}</div>
              </div>
            </div>

            {/* Risk bar */}
            <div className="mb-6">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${riskBarBg[risk]} ${riskBarWidths[risk]}`} />
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>Low</span><span>Moderate</span><span>High</span><span>Very High</span>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900/60 rounded-xl p-4 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Est. Shelf Life</div>
                <div className="text-xl font-bold text-white">{shelfLife}</div>
              </div>
              <div className="bg-zinc-900/60 rounded-xl p-4 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Storage Condition</div>
                <div className="text-base font-semibold">{conditionLabels[selectedCondition]}</div>
              </div>
              <div className="bg-zinc-900/60 rounded-xl p-4 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Max Freeze-Thaw</div>
                <div className="text-xl font-bold text-white">{selected.maxFreezeThaw}×</div>
              </div>
            </div>

            {/* Risk factors */}
            {riskFactors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                  Degradation Risk Factors Under This Condition
                </h3>
                <ul className="space-y-2">
                  {riskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 shrink-0 ${riskColors[risk]}`}>•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Special notes */}
            {selected.specialNotes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">
                  Compound-Specific Storage Notes
                </h3>
                <ul className="space-y-2">
                  {selected.specialNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[#d4af37] mt-0.5 shrink-0">→</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Container + light sensitive */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-zinc-900/60 rounded-xl p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Recommended Container</div>
                <div className="text-sm">{selected.container}</div>
              </div>
              <div className="bg-zinc-900/60 rounded-xl p-4 flex flex-col items-center justify-center min-w-[120px]">
                <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Light Sensitive</div>
                {selected.lightSensitive ? (
                  <div className="text-yellow-400 font-semibold text-sm">⚠ Yes</div>
                ) : (
                  <div className="text-green-400 font-semibold text-sm">✓ No</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Conditions Comparison Table */}
        {selected && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-5">
              {selected.name} — All Conditions Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left pb-3 text-zinc-400 font-medium">Condition</th>
                    <th className="text-left pb-3 text-zinc-400 font-medium">Shelf Life</th>
                    <th className="text-left pb-3 text-zinc-400 font-medium">Risk Level</th>
                    <th className="text-left pb-3 text-zinc-400 font-medium hidden md:table-cell">Risk Factors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(Object.keys(conditionLabels) as StorageCondition[]).map((cond) => {
                    const condRisk = selected.riskLevel[cond];
                    const condShelf = getShelfLife(selected, cond);
                    return (
                      <tr
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`cursor-pointer transition-colors hover:bg-white/5 ${selectedCondition === cond ? "bg-[#d4af37]/5" : ""}`}
                      >
                        <td className="py-3 pr-4">
                          <span className="mr-2">{conditionIcons[cond]}</span>
                          <span className={selectedCondition === cond ? "text-[#d4af37]" : ""}>{conditionLabels[cond]}</span>
                        </td>
                        <td className="py-3 pr-4 text-zinc-300">{condShelf}</td>
                        <td className="py-3 pr-4">
                          <span className={`font-semibold ${riskColors[condRisk]}`}>{condRisk}</span>
                        </td>
                        <td className="py-3 text-zinc-500 text-xs hidden md:table-cell">
                          {selected.riskFactors[cond].slice(0, 1).join(", ")}
                          {selected.riskFactors[cond].length > 1 && ` +${selected.riskFactors[cond].length - 1} more`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Tools */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Related Research Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Reconstitution Calculator",
                desc: "Calculate BAC water volume, doses per vial, and volume per dose",
                href: "/tools/reconstitution-calculator",
              },
              {
                title: "BAC Water Guide",
                desc: "Complete guide to bacteriostatic water, mixing technique, and storage",
                href: "/tools/bac-water-guide",
              },
              {
                title: "Peptide Storage Guide",
                desc: "Comprehensive per-compound storage reference with temperature classes",
                href: "/guides/storage",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block p-4 bg-zinc-800 rounded-xl border border-white/10 hover:border-[#d4af37]/50 transition-colors group"
              >
                <div className="font-medium text-sm group-hover:text-[#d4af37] transition-colors">
                  {tool.title}
                </div>
                <div className="text-xs text-zinc-500 mt-1">{tool.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Catalog rail */}
        <ToolCatalogCTA className="py-2" />

        {/* Disclaimer */}
        <p className="text-xs text-zinc-600 text-center pb-6">
          Stability data is research-reference only. Shelf life estimates are based on published literature,
          manufacturer specifications, and analogous compound data. Actual stability may vary based on
          exact formulation, container quality, and storage conditions. Nexphoria products are for
          research use only — not for human or veterinary use.
        </p>
      </div>
    </div>
  );
}
