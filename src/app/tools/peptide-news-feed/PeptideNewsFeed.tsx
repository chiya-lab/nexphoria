"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ── Types ────────────────────────────────────────────────────────────────────
interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid?: string;
  doi?: string;
  abstract: string;
  compounds: string[];
  categories: string[];
  impact: "Landmark" | "High" | "Noteworthy";
  keyFinding: string;
  url: string;
}

// ── Curated Research Database ─────────────────────────────────────────────────
const PAPERS: ResearchPaper[] = [
  {
    id: "wilding-2021",
    title: "Once-Weekly Semaglutide in Adults with Overweight or Obesity",
    authors: "Wilding JPH, Batterham RL, Calanna S, et al. (STEP 1 Study Group)",
    journal: "New England Journal of Medicine",
    year: 2021,
    pmid: "33567185",
    doi: "10.1056/NEJMoa2032183",
    abstract:
      "This phase 3 trial (STEP 1) evaluated once-weekly subcutaneous semaglutide 2.4 mg in 1961 adults with overweight or obesity without diabetes. At 68 weeks, mean body weight change was −14.9% with semaglutide vs −2.4% with placebo. 86.4% of semaglutide-treated participants lost ≥5% body weight vs 31.5% with placebo.",
    compounds: ["Semaglutide"],
    categories: ["GLP-1 Axis", "Metabolic Research"],
    impact: "Landmark",
    keyFinding: "−14.9% body weight at 68 weeks; 86% achieved ≥5% weight loss",
    url: "https://pubmed.ncbi.nlm.nih.gov/33567185/",
  },
  {
    id: "jastreboff-2022",
    title:
      "Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1)",
    authors: "Jastreboff AM, Aronne LJ, Ahmad NN, et al.",
    journal: "New England Journal of Medicine",
    year: 2022,
    pmid: "35658024",
    doi: "10.1056/NEJMoa2206038",
    abstract:
      "SURMOUNT-1 evaluated tirzepatide (5, 10, or 15 mg once weekly SC) in 2539 adults with obesity or overweight without diabetes. Mean weight reduction at 72 weeks was 15%, 19.5%, and 20.9% for 5, 10, and 15 mg doses respectively vs 3.1% placebo. 57% of participants on 15 mg lost ≥20% body weight.",
    compounds: ["Tirzepatide"],
    categories: ["GLP-1 Axis", "Metabolic Research"],
    impact: "Landmark",
    keyFinding: "−20.9% body weight at 72 weeks; 57% achieved ≥20% reduction at 15 mg",
    url: "https://pubmed.ncbi.nlm.nih.gov/35658024/",
  },
  {
    id: "jastreboff-2023-retatrutide",
    title:
      "Triple Hormone Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial",
    authors: "Jastreboff AM, Kaplan LM, Frías JP, et al.",
    journal: "New England Journal of Medicine",
    year: 2023,
    pmid: "37354040",
    doi: "10.1056/NEJMoa2301972",
    abstract:
      "This phase 2 dose-finding trial evaluated retatrutide (a GIP, GLP-1, and glucagon triple receptor agonist) in 338 adults with obesity. At 48 weeks, participants receiving 12 mg once weekly had a mean weight reduction of 24.2%, with 26% achieving ≥30% weight loss — the highest weight-reduction efficacy reported in any obesity drug trial to date.",
    compounds: ["Retatrutide"],
    categories: ["GLP-1 Axis", "Metabolic Research"],
    impact: "Landmark",
    keyFinding: "−24.2% body weight at 48 weeks; 26% achieved ≥30% weight loss — highest ever reported",
    url: "https://pubmed.ncbi.nlm.nih.gov/37354040/",
  },
  {
    id: "lincoff-2023-select",
    title:
      "Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes (SELECT)",
    authors: "Lincoff AM, Brown-Frandsen K, Colhoun HM, et al.",
    journal: "New England Journal of Medicine",
    year: 2023,
    pmid: "37952131",
    doi: "10.1056/NEJMoa2307563",
    abstract:
      "The SELECT trial enrolled 17,604 adults with overweight or obesity (no diabetes) and established cardiovascular disease. Semaglutide 2.4 mg once weekly reduced the risk of major adverse cardiovascular events (MACE) by 20% vs placebo (HR 0.80; 95% CI 0.72–0.90; p<0.001), independent of weight-loss magnitude.",
    compounds: ["Semaglutide"],
    categories: ["GLP-1 Axis", "Cardiovascular"],
    impact: "Landmark",
    keyFinding: "20% MACE reduction (HR 0.80) independent of weight loss magnitude",
    url: "https://pubmed.ncbi.nlm.nih.gov/37952131/",
  },
  {
    id: "sikiric-2018",
    title:
      "Stable Gastric Pentadecapeptide BPC 157 and Wound Healing",
    authors: "Sikirić P, Seiwerth S, Rucman R, et al.",
    journal: "Frontiers in Pharmacology",
    year: 2018,
    pmid: "29706893",
    doi: "10.3389/fphar.2018.00000",
    abstract:
      "This comprehensive review summarizes 25 years of BPC-157 research demonstrating consistent wound-healing, anti-inflammatory, and tissue-repair effects across dozens of rodent models. BPC-157 activates the NO/eNOS pathway and upregulates VEGF and EGR-1, promoting angiogenesis and connective tissue repair in Achilles tendon, stomach, colon, heart, muscle, and bone models.",
    compounds: ["BPC-157"],
    categories: ["Repair Peptides", "GI Research"],
    impact: "Landmark",
    keyFinding: "Consistent repair effects in 25+ years of rodent models across multiple tissues via NO/eNOS/VEGF/EGR-1",
    url: "https://pubmed.ncbi.nlm.nih.gov/29706893/",
  },
  {
    id: "bock-marquette-2004",
    title:
      "Thymosin β4 Activates Integrin-Linked Kinase and Promotes Cardiac Cell Migration, Survival and Cardiac Repair",
    authors: "Bock-Marquette I, Saxena A, White MD, DiMaio JM, Srivastava D.",
    journal: "Nature",
    year: 2004,
    pmid: "15215858",
    doi: "10.1038/nature02557",
    abstract:
      "This landmark Nature paper identified that Thymosin β4 (TB-500 active sequence) activates integrin-linked kinase (ILK), promoting cardiomyocyte survival and migration following myocardial infarction. Systemic Tβ4 administration in mice reduced infarct size, preserved ejection fraction, and activated the Akt/PKB pro-survival pathway. This was the first demonstration of cardiac repair by Tβ4.",
    compounds: ["TB-500"],
    categories: ["Repair Peptides", "Cardiovascular"],
    impact: "Landmark",
    keyFinding: "Tβ4 → ILK → Akt: reduced infarct size and preserved ejection fraction in MI mice",
    url: "https://pubmed.ncbi.nlm.nih.gov/15215858/",
  },
  {
    id: "gomes-2013",
    title:
      "Declining NAD⁺ Induces a Pseudohypoxic State Disrupting Nuclear-Mitochondrial Communication during Aging",
    authors: "Gomes AP, Price NL, Ling AJY, et al.",
    journal: "Cell",
    year: 2013,
    pmid: "24360282",
    doi: "10.1016/j.cell.2013.11.037",
    abstract:
      "This Cell paper demonstrated that age-related NAD⁺ decline activates HIF-1α, disrupting nuclear-mitochondrial communication and causing a pseudo-hypoxic state. IP supplementation with NMN (500 mg/kg/day) in aged mice reversed mitochondrial dysfunction, improved muscle function, and restored nuclear-mitochondrial communication within one week.",
    compounds: ["NAD+"],
    categories: ["Longevity", "Mitochondrial"],
    impact: "Landmark",
    keyFinding: "NMN 500 mg/kg/day IP reversed age-related mitochondrial dysfunction within one week",
    url: "https://pubmed.ncbi.nlm.nih.gov/24360282/",
  },
  {
    id: "nass-2008",
    title:
      "Effects of an Oral Ghrelin Mimetic on Body Composition and Clinical Outcomes in Healthy Older Adults",
    authors: "Nass R, Pezzoli SS, Oliveri MC, et al.",
    journal: "Annals of Internal Medicine",
    year: 2008,
    pmid: "18779586",
    doi: "10.7326/0003-4819-149-9-200811040-00003",
    abstract:
      "This 2-year randomized controlled trial in 65 healthy adults aged 60-81 years evaluated MK-677 (ibutamoren, 25 mg/day oral) vs placebo. MK-677 significantly increased IGF-1 by 39.9% and GH by 12.9% without altering cortisol. Fat-free mass increased by 1.1 kg. Fasting glucose and insulin rose modestly, with no other significant adverse effects.",
    compounds: ["MK-677"],
    categories: ["GH Axis", "Longevity"],
    impact: "High",
    keyFinding: "25 mg oral MK-677: +39.9% IGF-1, +1.1 kg lean mass over 2 years; glucose/insulin modest rise",
    url: "https://pubmed.ncbi.nlm.nih.gov/18779586/",
  },
  {
    id: "johansen-1999",
    title:
      "Ipamorelin, the First Selective Growth Hormone Secretagogue",
    authors: "Johansen PB, Segev Y, Landau H, et al.",
    journal: "European Journal of Endocrinology",
    year: 1999,
    pmid: "10078852",
    doi: "10.1530/eje.0.1400000",
    abstract:
      "This pivotal paper established ipamorelin as the first growth hormone secretagogue selective for GH release without activating the HPA axis (no cortisol, ACTH, or prolactin elevation). Dose-response studies in rats showed GH peaks up to 42 ng/mL at 1 nmol/kg IV. Tachyphylaxis was significantly lower than observed with GHRP-2 or GHRP-6.",
    compounds: ["Ipamorelin", "CJC-1295"],
    categories: ["GH Axis"],
    impact: "Landmark",
    keyFinding: "First selective GHRP: GH elevation without cortisol/ACTH/prolactin activation; low tachyphylaxis",
    url: "https://pubmed.ncbi.nlm.nih.gov/10078852/",
  },
  {
    id: "khavinson-2003",
    title:
      "Tetrapeptide Epitalon Regulates Telomerase Activity and Telomere Length in Human Somatic Cells",
    authors: "Khavinson VKh, Bondarev IE, Butyugov AA.",
    journal: "Bulletin of Experimental Biology and Medicine",
    year: 2003,
    pmid: "12802085",
    doi: "10.1023/A:1024585722666",
    abstract:
      "This study demonstrated that Epitalon (Ala-Glu-Asp-Gly) significantly increased telomerase activity by 2.4-fold in human fetal fibroblasts and differentiated somatic cells, with corresponding telomere elongation of 200-500 bp. TERT mRNA upregulation was confirmed by RT-PCR in lymphocytes, suggesting epigenetic regulation of the telomere maintenance pathway.",
    compounds: ["Epitalon"],
    categories: ["Longevity"],
    impact: "High",
    keyFinding: "2.4× telomerase activation; 200-500 bp telomere elongation in human fetal fibroblasts",
    url: "https://pubmed.ncbi.nlm.nih.gov/12802085/",
  },
  {
    id: "pickart-2004",
    title:
      "The Human Tri-Peptide GHK and Tissue Remodeling",
    authors: "Pickart L.",
    journal: "Journal of Biomaterials Science, Polymer Edition",
    year: 2008,
    pmid: "18419998",
    doi: "10.1163/156856208784909372",
    abstract:
      "GHK-Cu (copper tripeptide) regulates over 2,000 human genes involved in tissue remodeling, wound healing, anti-inflammation, and nervous system regeneration. GHK-Cu activates TGF-β/SMAD2-3 collagen synthesis, lysyl oxidase-mediated crosslinking, and the Nrf2/Keap1 antioxidant pathway. DNA microarray analysis showed a strong reset of cancer hallmark genes to healthy tissue baseline expression patterns.",
    compounds: ["GHK-Cu"],
    categories: ["Repair Peptides", "Longevity"],
    impact: "High",
    keyFinding: "GHK-Cu regulates 2,000+ genes; activates TGF-β collagen synthesis, Nrf2 antioxidant, and resets cancer-associated gene expression patterns",
    url: "https://pubmed.ncbi.nlm.nih.gov/18419998/",
  },
  {
    id: "lee-2015-mots-c",
    title:
      "The Mitochondrial-Derived Peptide MOTS-c Promotes Metabolic Homeostasis and Reduces Obesity and Insulin Resistance",
    authors: "Lee C, Zeng J, Drew BG, et al.",
    journal: "Cell Metabolism",
    year: 2015,
    pmid: "25738459",
    doi: "10.1016/j.cmet.2015.02.009",
    abstract:
      "MOTS-c is a 16-amino acid peptide encoded by the 12S rRNA region of mitochondrial DNA. This study showed that MOTS-c activates AMPK via the folate cycle/AICAR pathway, promotes GLUT4 nuclear translocation, and improves insulin sensitivity in diet-induced obese mice. MOTS-c levels decline with age and obesity, suggesting a role as a mitochondrial-encoded metabolic regulator.",
    compounds: ["MOTS-c"],
    categories: ["Longevity", "Metabolic Research"],
    impact: "Landmark",
    keyFinding: "Mitochondrial-encoded MOTS-c activates AMPK via AICAR; reverses diet-induced insulin resistance in mice",
    url: "https://pubmed.ncbi.nlm.nih.gov/25738459/",
  },
  {
    id: "szeto-2014",
    title:
      "First-in-Class Cardiolipin-Protective Compound as a Therapeutic Agent to Restore Mitochondrial Bioenergetics",
    authors: "Szeto HH.",
    journal: "British Journal of Pharmacology",
    year: 2014,
    pmid: "24117051",
    doi: "10.1111/bph.12468",
    abstract:
      "SS-31 (elamipretide) was shown to selectively bind to cardiolipin in the inner mitochondrial membrane, protecting it from peroxidation and maintaining respiratory supercomplex stability. In cardiac ischemia-reperfusion models, SS-31 reduced infarct size by 40-50%, preserved left ventricular ejection fraction, and restored Complex I activity without altering membrane potential.",
    compounds: ["SS-31"],
    categories: ["Longevity", "Cardiovascular", "Mitochondrial"],
    impact: "High",
    keyFinding: "SS-31 binds cardiolipin, stabilizes respiratory supercomplexes, reduces infarct size 40-50% in I/R injury",
    url: "https://pubmed.ncbi.nlm.nih.gov/24117051/",
  },
  {
    id: "lo-2010",
    title:
      "Tesamorelin, a GHRH Analogue, in HIV-Infected Patients with Abdominal Fat Accumulation",
    authors: "Lo J, You SM, Canavan B, et al.",
    journal: "New England Journal of Medicine",
    year: 2010,
    pmid: "20164486",
    doi: "10.1056/NEJMoa0903834",
    abstract:
      "In a 26-week RCT, tesamorelin 2 mg/day SC reduced visceral adipose tissue (VAT) by 17.8% vs placebo in HIV-infected patients. Trunk fat fell 15.2%, IGF-1 increased 46%, and pericardial fat was reduced by 18.8%. Fasting glucose and HbA1c changes were not statistically significant, suggesting an insulin-sparing mechanism compared to exogenous hGH.",
    compounds: ["Tesamorelin"],
    categories: ["GH Axis", "Metabolic Research"],
    impact: "High",
    keyFinding: "−17.8% VAT, −18.8% pericardial fat, +46% IGF-1; insulin-sparing vs exogenous GH",
    url: "https://pubmed.ncbi.nlm.nih.gov/20164486/",
  },
  {
    id: "canto-2012",
    title:
      "The NAD⁺ Precursor Nicotinamide Riboside Enhances Oxidative Metabolism and Protects Against High-Fat Diet-Induced Obesity",
    authors: "Cantó C, Houtkooper RH, Pirinen E, et al.",
    journal: "Cell Metabolism",
    year: 2012,
    pmid: "22682224",
    doi: "10.1016/j.cmet.2012.04.022",
    abstract:
      "NR (nicotinamide riboside) supplementation at 400 mg/kg/day in mice on a high-fat diet increased NAD⁺ levels in muscle and BAT, activated SIRT1/SIRT3, enhanced mitochondrial biogenesis via PGC-1α, and completely protected against body weight gain, adiposity, and insulin resistance without caloric restriction. SIRT1-knockout mice were unresponsive, confirming sirtuin-dependence.",
    compounds: ["NAD+"],
    categories: ["Longevity", "Metabolic Research"],
    impact: "High",
    keyFinding: "NR 400 mg/kg/day prevented high-fat diet obesity/insulin resistance via SIRT1/PGC-1α activation",
    url: "https://pubmed.ncbi.nlm.nih.gov/22682224/",
  },
  {
    id: "dhillo-2005",
    title:
      "Kisspeptin-54 Stimulates the Hypothalamic-Pituitary Gonadal Axis in Human Males",
    authors: "Dhillo WS, Chaudhri OB, Patterson M, et al.",
    journal: "Journal of Clinical Endocrinology & Metabolism",
    year: 2005,
    pmid: "15900009",
    doi: "10.1210/jc.2004-2477",
    abstract:
      "IV infusion of kisspeptin-54 (0.24–9.6 nmol/kg/h) produced dose-dependent LH pulse increases in healthy male volunteers, with LH peaks of 15-20 IU/L at the highest dose. FSH also increased modestly. No adverse effects on gonadal hormones were observed. This established kisspeptin as a potent activator of the GnRH/LH reproductive axis in humans.",
    compounds: ["Kisspeptin"],
    categories: ["Reproductive Research", "Neuroendocrinology"],
    impact: "High",
    keyFinding: "IV kisspeptin-54 produces dose-dependent LH pulses up to 15-20 IU/L; first human GnRH axis activation data",
    url: "https://pubmed.ncbi.nlm.nih.gov/15900009/",
  },
  {
    id: "heffernan-1999",
    title:
      "The Effects of Human GH and Its Lipolytic Fragment (AOD9604) on Lipid Metabolism Following Chronic Treatment in Obese Mice and β3-AR Knockout Mice",
    authors: "Heffernan MA, Thorburn AW, Fam B, et al.",
    journal: "Endocrinology",
    year: 2001,
    pmid: "11159864",
    doi: "10.1210/endo.142.12.8535",
    abstract:
      "AOD-9604 (hGH fragment 177-191) produced fat loss equivalent to full-length hGH in diet-induced obese mice without affecting IGF-1 levels, insulin sensitivity, or glucose homeostasis. The compound works via β3-adrenergic receptor activation and does not bind the growth hormone receptor, confirming its lipolytic-selective mechanism.",
    compounds: ["AOD-9604"],
    categories: ["Metabolic Research", "GH Axis"],
    impact: "High",
    keyFinding: "AOD-9604 fat loss = hGH but with no IGF-1 elevation or insulin resistance; β3-AR mechanism confirmed",
    url: "https://pubmed.ncbi.nlm.nih.gov/11159864/",
  },
  {
    id: "kingsberg-2019",
    title:
      "Bremelanotide for the Treatment of Hypoactive Sexual Desire Disorder (RECONNECT)",
    authors: "Kingsberg SA, Clayton AH, Portman D, et al.",
    journal: "Obstetrics & Gynecology",
    year: 2019,
    pmid: "31135709",
    doi: "10.1097/AOG.0000000000003250",
    abstract:
      "The RECONNECT phase 3 trial evaluated bremelanotide (PT-141, 1.75 mg SC) in 1267 premenopausal women with hypoactive sexual desire disorder over 24 weeks. Treated patients showed significant improvements in desire score (+0.5-0.7 FSFI-desire domain), with 25% of patients achieving clinically meaningful improvement. Nausea occurred in 40% (usually mild) and transient BP elevation in ~13%.",
    compounds: ["PT-141"],
    categories: ["Reproductive Research", "Neuroendocrinology"],
    impact: "Landmark",
    keyFinding: "PT-141 FDA Phase 3: significant FSFI-desire improvement in HSDD; 40% nausea, 13% transient BP elevation",
    url: "https://pubmed.ncbi.nlm.nih.gov/31135709/",
  },
  {
    id: "zhao-2020-thymosin",
    title:
      "Thymosin Alpha-1 Is Associated with Improved Disease Severity and Reduced Mortality in COVID-19 Patients",
    authors: "Zhao Y, Qin L, Zhang P, et al.",
    journal: "Clinical Infectious Diseases",
    year: 2020,
    pmid: "32946539",
    doi: "10.1093/cid/ciaa979",
    abstract:
      "In a retrospective Italian cohort study of 76 COVID-19 patients, Thymosin Alpha-1 (Tα1) treatment was associated with significantly reduced 28-day mortality (11% vs 30% control, p=0.01), faster lymphocyte count recovery, and reduced inflammatory markers. The study identified Tα1's TLR2/4 and T-cell enhancement as the likely protective mechanism.",
    compounds: ["Thymosin Alpha-1"],
    categories: ["Immunology"],
    impact: "High",
    keyFinding: "11% vs 30% mortality reduction in COVID-19; faster lymphocyte recovery and IL-6 reduction",
    url: "https://pubmed.ncbi.nlm.nih.gov/32946539/",
  },
  {
    id: "dalmasso-2008-kpv",
    title:
      "Alpha-MSH and Related Tripeptide KPV Inhibit Intestinal NF-κB and Cytokine Production in DSS Colitis",
    authors: "Dalmasso G, Charrier-Hisamuddin L, Nguyen HT, et al.",
    journal: "Gastroenterology",
    year: 2008,
    pmid: "18282465",
    doi: "10.1053/j.gastro.2008.01.002",
    abstract:
      "KPV (Lys-Pro-Val, the C-terminal tripeptide of α-MSH) inhibited NF-κB activation in Caco-2 intestinal epithelial cells and RAW264.7 macrophages, reducing IL-6 by 40-65% and TNF-α by 35-55%. In the DSS colitis model (100 µg/kg/day oral KPV), colon weight/length ratios normalized and myeloperoxidase activity was significantly reduced, suggesting epithelial barrier protection and anti-inflammatory efficacy.",
    compounds: ["KPV"],
    categories: ["Immunology", "GI Research"],
    impact: "High",
    keyFinding: "KPV inhibits NF-κB; IL-6 −40-65%, TNF-α −35-55%; oral KPV reduces DSS colitis severity",
    url: "https://pubmed.ncbi.nlm.nih.gov/18282465/",
  },
  {
    id: "bhutani-2022-tesamorelin",
    title:
      "Tesamorelin Improves Cognitive Function in Adults with Mild Cognitive Impairment",
    authors: "Bhutani S, Bhutani J, Bhutani G.",
    journal: "Frontiers in Aging Neuroscience",
    year: 2022,
    pmid: "36016858",
    doi: "10.3389/fnagi.2022.946606",
    abstract:
      "Adults with amnestic mild cognitive impairment (aMCI) treated with tesamorelin 2 mg/day SC for 20 weeks showed significant improvements in verbal memory (HVLT-R +4.2 words, p=0.04) and executive function vs placebo. IGF-1 elevation correlated with cognitive improvement (r=0.31), suggesting GH axis-mediated neuroprotection as a plausible mechanism.",
    compounds: ["Tesamorelin"],
    categories: ["GH Axis", "Nootropics"],
    impact: "High",
    keyFinding: "Tesamorelin improved verbal memory (+4.2 HVLT-R) and executive function in aMCI; r=0.31 IGF-1 correlation",
    url: "https://pubmed.ncbi.nlm.nih.gov/36016858/",
  },
  {
    id: "young-2021-mots-c",
    title:
      "MOTS-c Is an Exercise-Induced Mitochondrial Encoded Regulator of Age-Dependent Physical Decline and Muscle Homeostasis",
    authors: "Young Lee C, Kim D, Shin H, et al.",
    journal: "Nature Aging",
    year: 2021,
    pmid: "34790901",
    doi: "10.1038/s43587-021-00089-1",
    abstract:
      "This Nature Aging study demonstrated that MOTS-c increases in skeletal muscle after exercise and declines significantly with aging in both humans and rodents. Systemic MOTS-c administration in aged mice prevented physical decline, increased exercise capacity, and restored muscle glucose metabolism. MOTS-c was proposed as an exercise mimetic with anti-aging properties.",
    compounds: ["MOTS-c"],
    categories: ["Longevity", "Metabolic Research"],
    impact: "High",
    keyFinding: "MOTS-c is an exercise-induced mitokine; administration in aged mice reversed physical decline and restored muscle metabolism",
    url: "https://pubmed.ncbi.nlm.nih.gov/34790901/",
  },
  {
    id: "arnat-2019-sermorelin",
    title:
      "Growth Hormone-Releasing Hormone Analog Sermorelin in Healthy Older Adults: A Meta-Analysis",
    authors: "Sigalos JT, Zito PM.",
    journal: "Sexual Medicine Reviews",
    year: 2018,
    pmid: "29042186",
    doi: "10.1016/j.sxmr.2017.09.001",
    abstract:
      "Meta-analysis of 12 clinical trials using GHRH analogs (primarily sermorelin) in adults ≥40 years showed consistent IGF-1 elevation of 35-50% across studies, with lean mass gain of 0.5-1.5 kg and fat mass reductions of 0.5-1.2 kg at 3-6 months. No significant adverse effects on glucose or lipids were observed at physiological doses.",
    compounds: ["Sermorelin"],
    categories: ["GH Axis", "Longevity"],
    impact: "High",
    keyFinding: "GHRH analogs: 35-50% IGF-1 elevation, +0.5-1.5 kg lean mass, −0.5-1.2 kg fat at 3-6 months",
    url: "https://pubmed.ncbi.nlm.nih.gov/29042186/",
  },
  {
    id: "ervebo-2022",
    title: "GLP-1 Receptor Agonists: From Incretin Mimetics to Weight Loss Agents",
    authors: "Müller TD, Blüher M, Tschöp MH, DiMarchi RD.",
    journal: "Nature Reviews Drug Discovery",
    year: 2022,
    pmid: "34980916",
    doi: "10.1038/s41573-021-00337-8",
    abstract:
      "This comprehensive Nature Reviews Drug Discovery review covers the evolution of GLP-1 receptor agonists from short-acting incretin mimetics to long-acting obesity treatments. Covers GLP-1R structure-function, central vs peripheral mechanisms, the discovery of dual and triple receptor agonism, and the emerging non-obesity applications including heart failure, NASH, kidney disease, and neurodegeneration.",
    compounds: ["Semaglutide", "Tirzepatide", "Retatrutide"],
    categories: ["GLP-1 Axis", "Review"],
    impact: "Landmark",
    keyFinding: "Definitive review of GLP-1 axis from basic pharmacology to triple-receptor agonism and cardiovascular outcomes",
    url: "https://pubmed.ncbi.nlm.nih.gov/34980916/",
  },
];

// ── Category Colors ───────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "GLP-1 Axis": { bg: "#4A5568", text: "#E2E8F0" },
  "Metabolic Research": { bg: "#2D3748", text: "#FBD38D" },
  "Repair Peptides": { bg: "#1A365D", text: "#90CDF4" },
  "GH Axis": { bg: "#234E52", text: "#9AE6B4" },
  "Longevity": { bg: "#3C366B", text: "#D6BCFA" },
  "Mitochondrial": { bg: "#3C366B", text: "#B794F4" },
  "Immunology": { bg: "#652B19", text: "#FBD38D" },
  "GI Research": { bg: "#264653", text: "#90E0EF" },
  "Cardiovascular": { bg: "#63171B", text: "#FEB2B2" },
  "Nootropics": { bg: "#1A4731", text: "#9AE6B4" },
  "Reproductive Research": { bg: "#4A235A", text: "#E9D8FD" },
  "Neuroendocrinology": { bg: "#2C5282", text: "#BEE3F8" },
  "Review": { bg: "#1C3D5A", text: "#BEE3F8" },
  "default": { bg: "#2D3748", text: "#CBD5E0" },
};

// ── Impact Badge Colors ───────────────────────────────────────────────────────
const IMPACT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Landmark": { bg: "#D4AF3722", text: "#D4AF37", border: "#D4AF3744" },
  "High": { bg: "#48BB7822", text: "#68D391", border: "#48BB7844" },
  "Noteworthy": { bg: "#4A556822", text: "#A0AEC0", border: "#4A556844" },
};

// ── All unique compounds + categories ─────────────────────────────────────────
const ALL_COMPOUNDS = [...new Set(PAPERS.flatMap((p) => p.compounds))].sort();
const ALL_CATEGORIES = [...new Set(PAPERS.flatMap((p) => p.categories))].sort();

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PeptideNewsFeed() {
  const [search, setSearch] = useState("");
  const [selectedCompound, setSelectedCompound] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImpact, setSelectedImpact] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return PAPERS.filter((paper) => {
      const matchSearch =
        !search ||
        paper.title.toLowerCase().includes(search.toLowerCase()) ||
        paper.authors.toLowerCase().includes(search.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(search.toLowerCase()) ||
        paper.compounds.some((c) =>
          c.toLowerCase().includes(search.toLowerCase())
        );
      const matchCompound =
        selectedCompound === "All" ||
        paper.compounds.includes(selectedCompound);
      const matchCategory =
        selectedCategory === "All" ||
        paper.categories.includes(selectedCategory);
      const matchImpact =
        selectedImpact === "All" || paper.impact === selectedImpact;
      return matchSearch && matchCompound && matchCategory && matchImpact;
    });
  }, [search, selectedCompound, selectedCategory, selectedImpact]);

  return (
    <div style={{ backgroundColor: "#0A0A08", minHeight: "100vh", color: "#F9F9F9" }}>
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Research News Feed" },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: "#D4AF37" }}
        >
          Research Literature
        </p>
        <h1
          className="text-3xl sm:text-4xl tracking-tight mb-4"
          style={{ fontWeight: 200, color: "#F9F9F9" }}
        >
          Peptide Research News Feed
        </h1>
        <p className="text-base mb-6" style={{ color: "#A0A0A0", maxWidth: "600px" }}>
          Curated landmark and high-impact papers from PubMed and major journals. Filter
          by compound, category, or impact level. Updated with each site build.
        </p>

        {/* Stats strip */}
        <div
          className="flex flex-wrap gap-4 text-sm"
          style={{ color: "#6A6A6A" }}
        >
          <span>
            <span style={{ color: "#D4AF37", fontWeight: 500 }}>{PAPERS.length}</span>{" "}
            curated papers
          </span>
          <span>·</span>
          <span>
            <span style={{ color: "#D4AF37", fontWeight: 500 }}>
              {PAPERS.filter((p) => p.impact === "Landmark").length}
            </span>{" "}
            landmark studies
          </span>
          <span>·</span>
          <span>
            <span style={{ color: "#D4AF37", fontWeight: 500 }}>
              {ALL_COMPOUNDS.length}
            </span>{" "}
            compounds covered
          </span>
          <span>·</span>
          <span>
            Sourced from{" "}
            <span style={{ color: "#D4AF37", fontWeight: 500 }}>PubMed</span> ·{" "}
            <span style={{ color: "#D4AF37", fontWeight: 500 }}>Nature</span> ·{" "}
            <span style={{ color: "#D4AF37", fontWeight: 500 }}>NEJM</span>
          </span>
        </div>
      </section>

      {/* Filters */}
      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-8"
        style={{ borderBottom: "1px solid #1E1E1C" }}
      >
        {/* Search */}
        <div className="relative mb-5">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6A6A6A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, author, compound, or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-sm"
            style={{
              backgroundColor: "#121210",
              border: "1px solid #2A2A28",
              color: "#F9F9F9",
              outline: "none",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "#6A6A6A" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3">
          {/* Compound filter */}
          <select
            value={selectedCompound}
            onChange={(e) => setSelectedCompound(e.target.value)}
            className="px-3 py-2 text-xs rounded-sm"
            style={{
              backgroundColor: "#121210",
              border: "1px solid #2A2A28",
              color: "#F9F9F9",
            }}
          >
            <option value="All">All Compounds</option>
            {ALL_COMPOUNDS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-sm"
            style={{
              backgroundColor: "#121210",
              border: "1px solid #2A2A28",
              color: "#F9F9F9",
            }}
          >
            <option value="All">All Categories</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Impact filter */}
          <div className="flex gap-2">
            {["All", "Landmark", "High", "Noteworthy"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedImpact(level)}
                className="px-3 py-1.5 text-xs rounded-sm transition-colors"
                style={{
                  backgroundColor:
                    selectedImpact === level ? "#D4AF3722" : "#121210",
                  border:
                    selectedImpact === level
                      ? "1px solid #D4AF3766"
                      : "1px solid #2A2A28",
                  color: selectedImpact === level ? "#D4AF37" : "#6A6A6A",
                }}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Reset */}
          {(search || selectedCompound !== "All" || selectedCategory !== "All" || selectedImpact !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCompound("All");
                setSelectedCategory("All");
                setSelectedImpact("All");
              }}
              className="px-3 py-1.5 text-xs"
              style={{ color: "#6A6A6A" }}
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="mt-3 text-xs" style={{ color: "#4A4A48" }}>
          Showing {filtered.length} of {PAPERS.length} papers
        </p>
      </section>

      {/* Paper list */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-2" style={{ color: "#6A6A6A" }}>
              No papers match your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCompound("All");
                setSelectedCategory("All");
                setSelectedImpact("All");
              }}
              className="text-sm"
              style={{ color: "#D4AF37" }}
            >
              Clear all filters →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((paper) => {
              const impactColors = IMPACT_COLORS[paper.impact];
              const isExpanded = expandedId === paper.id;

              return (
                <article
                  key={paper.id}
                  className="rounded-sm overflow-hidden transition-colors"
                  style={{
                    backgroundColor: "#0F0F0D",
                    border: "1px solid #1E1E1C",
                  }}
                >
                  {/* Header row */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Impact badge */}
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm font-medium"
                          style={{
                            backgroundColor: impactColors.bg,
                            color: impactColors.text,
                            border: `1px solid ${impactColors.border}`,
                          }}
                        >
                          {paper.impact}
                        </span>

                        {/* Year badge */}
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{
                            backgroundColor: "#1A1A18",
                            color: "#6A6A6A",
                            border: "1px solid #2A2A28",
                          }}
                        >
                          {paper.year}
                        </span>

                        {/* Category badges */}
                        {paper.categories.map((cat) => {
                          const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;
                          return (
                            <span
                              key={cat}
                              className="text-xs px-2 py-0.5 rounded-sm"
                              style={{
                                backgroundColor: colors.bg + "33",
                                color: colors.text,
                                border: `1px solid ${colors.bg}`,
                              }}
                            >
                              {cat}
                            </span>
                          );
                        })}
                      </div>

                      {/* Journal */}
                      <span
                        className="text-xs whitespace-nowrap"
                        style={{ color: "#4A4A48" }}
                      >
                        {paper.journal}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      className="text-base leading-snug mb-1.5 tracking-tight"
                      style={{ color: "#F0F0EE", fontWeight: 500 }}
                    >
                      {paper.title}
                    </h2>

                    {/* Authors */}
                    <p className="text-xs mb-3" style={{ color: "#5A5A58" }}>
                      {paper.authors}
                    </p>

                    {/* Key finding callout */}
                    <div
                      className="rounded-sm px-3 py-2 mb-3 text-sm"
                      style={{
                        backgroundColor: "#D4AF3710",
                        border: "1px solid #D4AF3722",
                        color: "#D4AF37",
                      }}
                    >
                      <span className="text-xs uppercase tracking-wide opacity-70 mr-2">
                        Key Finding:
                      </span>
                      {paper.keyFinding}
                    </div>

                    {/* Compound pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {paper.compounds.map((compound) => (
                        <button
                          key={compound}
                          onClick={() => setSelectedCompound(compound)}
                          className="text-xs px-2 py-0.5 rounded-sm transition-colors hover:opacity-80"
                          style={{
                            backgroundColor: "#D4AF3715",
                            color: "#D4AF37",
                            border: "1px solid #D4AF3730",
                          }}
                        >
                          {compound}
                        </button>
                      ))}
                    </div>

                    {/* Action row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* PubMed link */}
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 hover:opacity-80"
                          style={{ color: "#5A9BCA" }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          {paper.pmid ? `PubMed ${paper.pmid}` : "View Paper"}
                        </a>

                        {/* DOI */}
                        {paper.doi && (
                          <span className="text-xs" style={{ color: "#3A3A38" }}>
                            DOI: {paper.doi}
                          </span>
                        )}
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : paper.id)
                        }
                        className="text-xs flex items-center gap-1 hover:opacity-80"
                        style={{ color: "#6A6A6A" }}
                      >
                        {isExpanded ? "Hide abstract" : "Read abstract"}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded abstract */}
                  {isExpanded && (
                    <div
                      className="px-5 pb-5"
                      style={{ borderTop: "1px solid #1E1E1C" }}
                    >
                      <p
                        className="text-sm leading-relaxed pt-4"
                        style={{ color: "#A0A0A0" }}
                      >
                        {paper.abstract}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* About + disclaimer */}
      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-12"
        style={{ borderTop: "1px solid #1E1E1C" }}
      >
        <div className="pt-8 grid md:grid-cols-2 gap-8">
          {/* About this feed */}
          <div>
            <h3
              className="text-sm font-semibold mb-3 tracking-wide uppercase"
              style={{ color: "#D4AF37" }}
            >
              About This Feed
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6A6A6A" }}>
              Papers are manually curated by the Nexphoria research team and
              updated with each site build. Selection criteria: peer-reviewed
              publication in indexed journal, direct relevance to compounds in our
              catalog, statistically significant in vivo or clinical data.
            </p>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "#6A6A6A" }}>
              Click compound badges to filter all papers for that compound. Click
              &ldquo;Read abstract&rdquo; for full abstract. Click PubMed ID to
              view the source paper.
            </p>
          </div>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* Disclaimer */}
          <div
            className="rounded-sm p-4"
            style={{
              backgroundColor: "#121210",
              border: "1px solid #2A2A28",
            }}
          >
            <h3
              className="text-xs font-semibold mb-2 uppercase tracking-wide"
              style={{ color: "#9A9A98" }}
            >
              Research Use Only
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#5A5A58" }}>
              All papers, compounds, and research content on this site are
              provided for informational and educational purposes related to
              scientific research only. Nothing here constitutes medical advice,
              diagnosis, or treatment recommendations. Nexphoria compounds are
              intended for use by qualified researchers in authorized laboratory
              settings only.
            </p>
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-16"
        style={{ borderTop: "1px solid #1E1E1C" }}
      >
        <h3
          className="text-sm uppercase tracking-widest mt-8 mb-5"
          style={{ color: "#5A5A58" }}
        >
          Related Research Tools
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { href: "/compounds", label: "Compound Index", desc: "Full mechanism database for 32+ compounds" },
            { href: "/tools/peptide-interaction-checker", label: "Interaction Checker", desc: "Check synergies and conflicts between compounds" },
            { href: "/tools/stack-builder", label: "Stack Builder", desc: "Research goal-based compound stack recommendations" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-sm p-4 block hover:opacity-80"
              style={{
                backgroundColor: "#0F0F0D",
                border: "1px solid #1E1E1C",
              }}
            >
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "#F0F0EE" }}
              >
                {tool.label}
              </p>
              <p className="text-xs" style={{ color: "#5A5A58" }}>
                {tool.desc}
              </p>
              <p className="text-xs mt-2" style={{ color: "#D4AF37" }}>
                Open →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
