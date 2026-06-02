export interface Citation {
  authors: string;
  title: string;
  journal: string;
  year: number;
  detail: string;
  doi: string;
}

// Representative peer-reviewed references for BPC-157 research literature.
// Vancouver-style; rendered by PprCitations. Default set for the PDP.
export const BPC157_CITATIONS: Citation[] = [
  {
    authors: "Sikiric P, Seiwerth S, Rucman R, et al.",
    title: "Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract.",
    journal: "Curr Pharm Des",
    year: 2011,
    detail: "17(16):1612-1632",
    doi: "10.2174/138161211796196954",
  },
  {
    authors: "Chang CH, Tsai WC, Lin MS, et al.",
    title: "The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration.",
    journal: "J Appl Physiol",
    year: 2011,
    detail: "110(3):774-780",
    doi: "10.1152/japplphysiol.00945.2010",
  },
  {
    authors: "Gwyer D, Wragg NM, Wilson SL.",
    title: "Gastric pentadecapeptide body protection compound BPC 157 and its role in accelerating musculoskeletal soft tissue healing.",
    journal: "Cell Tissue Res",
    year: 2019,
    detail: "377(2):153-159",
    doi: "10.1007/s00441-019-03016-8",
  },
  {
    authors: "Seiwerth S, Brcic L, Vuletic LB, et al.",
    title: "BPC 157 and blood vessels.",
    journal: "Curr Pharm Des",
    year: 2014,
    detail: "20(7):1121-1125",
    doi: "10.2174/13816128113199990421",
  },
  {
    authors: "Tkalcevic VI, Cuzic S, Brajsa K, et al.",
    title: "Enhancement by PL 14736 of granulation and collagen organization in healing wounds and the potential role of egr-1 expression.",
    journal: "Eur J Pharmacol",
    year: 2007,
    detail: "570(1-3):212-221",
    doi: "10.1016/j.ejphar.2007.05.072",
  },
  {
    authors: "Chang CH, Tsai WC, Hsu YH, Pang JH.",
    title: "Pentadecapeptide BPC 157 enhances the growth hormone receptor expression in tendon fibroblasts.",
    journal: "Molecules",
    year: 2014,
    detail: "19(11):19066-19077",
    doi: "10.3390/molecules191119066",
  },
  {
    authors: "Sikiric P, Hahm KB, Blagaic AB, et al.",
    title: "Stable gastric pentadecapeptide BPC 157, Robert's stomach cytoprotection/adaptive cytoprotection/organoprotection, and Selye's stress coping response.",
    journal: "Inflammopharmacology",
    year: 2020,
    detail: "28(5):1131-1142",
    doi: "10.1007/s10787-020-00750-2",
  },
  {
    authors: "Vukojevic J, Siroglavic M, Kasnik K, et al.",
    title: "Rat inferior caval vein (ICV) ligature and particular new insights with the stable gastric pentadecapeptide BPC 157.",
    journal: "Vascul Pharmacol",
    year: 2018,
    detail: "106:54-66",
    doi: "10.1016/j.vph.2018.02.005",
  },
];

/** Resolve a list of DOIs to Citation records, preserving input order. */
export function citationsByDoi(dois: string[]): Citation[] {
  const index = new Map(BPC157_CITATIONS.map((c) => [c.doi, c]));
  return dois
    .map((doi) => index.get(doi))
    .filter((c): c is Citation => c !== undefined);
}
