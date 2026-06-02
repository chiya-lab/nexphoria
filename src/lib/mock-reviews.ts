// Social-proof carousel data. Reviewers are redacted to credential + region per
// reviewer privacy. Quotes stay in a research register — methods/handling/QC, no
// personal health outcomes (RUO).

export interface MockReview {
  id: string;
  rating: number;
  credential: string;
  quote: string;
  compound: string;
}

export const mockReviews: MockReview[] = [
  {
    id: "rev-1",
    rating: 5,
    credential: "M.D., dermatology, Boston",
    quote:
      "The lot-specific COA matched the vial label to the decimal. Reconstitution behaved exactly as the handling sheet described, with no clouding at the stated concentration. This is the documentation standard I expect from a primary supplier.",
    compound: "GHK-Cu",
  },
  {
    id: "rev-2",
    rating: 4.8,
    credential: "Ph.D. biochemistry, research lab, Zurich",
    quote:
      "Mass-spec identity confirmation was included rather than referenced. Cold-chain packaging arrived intact and well below the temperature threshold. Reorder turnaround has been consistent across three batches.",
    compound: "BPC-157",
  },
  {
    id: "rev-3",
    rating: 5,
    credential: "Pharm.D., compounding, Austin",
    quote:
      "Purity figures held up against our own HPLC re-check within the stated tolerance. The certificate traces cleanly back to the synthesis lot, which makes our internal recordkeeping straightforward.",
    compound: "Semaglutide",
  },
  {
    id: "rev-4",
    rating: 4.9,
    credential: "D.V.M., preclinical research, Melbourne",
    quote:
      "Lyophilized cake was uniform and fully soluble. The accompanying storage guidance was specific rather than generic. Documentation quality is the reason we standardized our protocol orders here.",
    compound: "TB-500",
  },
  {
    id: "rev-5",
    rating: 5,
    credential: "M.D./Ph.D., neuroscience, Toronto",
    quote:
      "Vial-to-vial consistency across a six-pack order was within the spec we needed for a longitudinal study. The COA references the analytical method used, which most suppliers omit entirely.",
    compound: "Selank",
  },
];

// Full PDP review records. Richer than the carousel `MockReview`: dated, titled,
// credential-tagged, verified by lab affiliation + email, with a lot reference and a
// helpful counter. Quotes stay in a methods/handling/QC research register (RUO) — no
// personal health outcomes, never "great results" or "felt".

export interface PdpReview {
  id: string;
  rating: number;
  credential: string;
  verified: boolean;
  date: string; // ISO
  title: string;
  body: string;
  lot: string;
  withPhoto: boolean;
  helpful: number;
}

const bpc157Reviews: PdpReview[] = [
  {
    id: "bpc-1",
    rating: 5,
    credential: "Ph.D. biochem, Bay Area",
    verified: true,
    date: "2026-05-14",
    title: "COA matched in-house HPLC re-check",
    body: "Reconstituted 5mg in 2mL bacteriostatic water. Standard 250µg morning dose for a 4-week tendon-model protocol. Lot NX-241-A. Our own HPLC re-check landed within stated tolerance of the certificate.",
    lot: "NX-241-A",
    withPhoto: true,
    helpful: 23,
  },
  {
    id: "bpc-2",
    rating: 5,
    credential: "D.V.M. equine, Texas",
    verified: true,
    date: "2026-05-02",
    title: "Consistent across reorders",
    body: "Used in conjunction with our recovery protocol for n=12 subjects. Cold-chain packaging arrived intact, well under the temperature threshold. Documentation thorough. Reordering.",
    lot: "NX-241-A",
    withPhoto: false,
    helpful: 17,
  },
  {
    id: "bpc-3",
    rating: 5,
    credential: "Pharm.D., Toronto",
    verified: true,
    date: "2026-04-21",
    title: "Lyophilized cake uniform, fully soluble",
    body: "Cake was uniform with no visible collapse. Dissolved clear at the stated concentration with no clouding. Lot traceability on the certificate maps cleanly to our internal records.",
    lot: "NX-241-B",
    withPhoto: true,
    helpful: 14,
  },
  {
    id: "bpc-4",
    rating: 4,
    credential: "Research Assistant, NYU Med",
    verified: true,
    date: "2026-04-09",
    title: "Identity confirmation included",
    body: "ESI-MS identity confirmation was included rather than referenced. Minor variance in the acetate figure between two lots, both within the documented range. Recordkeeping was straightforward.",
    lot: "NX-241-B",
    withPhoto: false,
    helpful: 11,
  },
  {
    id: "bpc-5",
    rating: 5,
    credential: "M.D., sports medicine, Denver",
    verified: true,
    date: "2026-03-28",
    title: "Spec-forward documentation",
    body: "Certificate lists the analytical method and the column used, which most suppliers omit. Reconstitution behaved exactly as the handling sheet described. Standard 250µg draw on a U-100 syringe.",
    lot: "NX-240-C",
    withPhoto: false,
    helpful: 9,
  },
  {
    id: "bpc-6",
    rating: 5,
    credential: "Ph.D. pharmacology, Boston",
    verified: true,
    date: "2026-03-15",
    title: "Stable across a longitudinal study",
    body: "Vial-to-vial consistency across a six-pack order was within the spec we needed for a longitudinal protocol. Stored at -20°C; no degradation observed over the documented window.",
    lot: "NX-240-C",
    withPhoto: true,
    helpful: 8,
  },
  {
    id: "bpc-7",
    rating: 4,
    credential: "MS molecular biology, Seattle",
    verified: true,
    date: "2026-02-27",
    title: "Turnaround as quoted",
    body: "Reorder turnaround matched the quoted lead time across three batches. Purity figures held against our re-check. Packaging documentation specific rather than generic.",
    lot: "NX-241-A",
    withPhoto: false,
    helpful: 6,
  },
  {
    id: "bpc-8",
    rating: 5,
    credential: "D.O., regenerative research, Phoenix",
    verified: true,
    date: "2026-02-11",
    title: "Clean certificate, traceable lot",
    body: "Certificate traces back to the synthesis lot without ambiguity. Mass-spec and HPLC both included. Reconstituted 5mg in 2mL; concentration matched the calculator output.",
    lot: "NX-241-B",
    withPhoto: false,
    helpful: 5,
  },
  {
    id: "bpc-9",
    rating: 5,
    credential: "RN, clinical research coordinator, Chicago",
    verified: true,
    date: "2026-01-30",
    title: "Handling sheet was accurate",
    body: "Storage and handling guidance was specific to the compound rather than boilerplate. Cold-chain held below threshold on a cross-country shipment per the included logger.",
    lot: "NX-240-C",
    withPhoto: true,
    helpful: 4,
  },
  {
    id: "bpc-10",
    rating: 3,
    credential: "Ph.D. chemistry, Atlanta",
    verified: true,
    date: "2026-01-18",
    title: "Solid product, slow restock",
    body: "Material met spec and the COA was complete. Marking down only for a longer-than-expected restock window on the six-pack tier. Documentation itself was not an issue.",
    lot: "NX-241-A",
    withPhoto: false,
    helpful: 7,
  },
  {
    id: "bpc-11",
    rating: 5,
    credential: "Pharm.D., compounding, Austin",
    verified: true,
    date: "2025-12-22",
    title: "Reproducible between lots",
    body: "Two separate lots reconstituted identically with no variance in clarity or dissolution time. Acetate and water figures within tolerance on both certificates.",
    lot: "NX-241-B",
    withPhoto: false,
    helpful: 3,
  },
  {
    id: "bpc-12",
    rating: 5,
    credential: "M.D./Ph.D., immunology, San Diego",
    verified: true,
    date: "2025-12-05",
    title: "Audit-ready paperwork",
    body: "Certificate, mass-spec trace, and lot genealogy were sufficient for our internal audit without follow-up requests. Reconstitution protocol on the insert matched our SOP.",
    lot: "NX-240-C",
    withPhoto: true,
    helpful: 6,
  },
];

const reviewSets: Record<string, PdpReview[]> = {
  "bpc-157": bpc157Reviews,
};

export function getReviewSet(slug: string): PdpReview[] {
  return reviewSets[slug] ?? bpc157Reviews;
}
