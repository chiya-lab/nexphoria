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
