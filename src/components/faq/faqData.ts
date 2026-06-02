export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  related?: { label: string; href: string }[];
  popular?: boolean;
}

export interface FaqCategory {
  id: string;
  label: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "quality", label: "Product Quality" },
  { id: "shipping", label: "Shipping & Returns" },
  { id: "reconstitution", label: "Reconstitution" },
  { id: "storage", label: "Storage" },
  { id: "compliance", label: "Compliance / RUO" },
  { id: "payment", label: "Payment" },
  { id: "wholesale", label: "Wholesale" },
];

export const FAQ_ITEMS: FaqItem[] = [
  // ---- Product Quality ----
  {
    id: "q-purity",
    category: "quality",
    question: "What purity grade do your peptides ship at?",
    answer:
      "Released lots are graded by reverse-phase HPLC peak area. Standard lots clear at ≥95%, Research lots at ≥98%, and Reference lots at ≥99%. The grade and the measured value for the specific lot you receive are printed on its certificate of analysis.",
    related: [
      { label: "Purity standards", href: "/science" },
      { label: "View COAs", href: "/coa" },
    ],
    popular: true,
  },
  {
    id: "q-coa",
    category: "quality",
    question: "Is a certificate of analysis included with every order?",
    answer:
      "Yes. Every released lot carries a per-lot COA documenting HPLC purity, mass-spectrometry identity, and (where applicable) endotoxin and residual-solvent results. The COA is matched to the lot number stamped on your vial — it is not a generic catalog document.",
    related: [{ label: "Sample COA walkthrough", href: "/science" }],
    popular: true,
  },
  {
    id: "q-identity",
    category: "quality",
    question: "How is peptide identity confirmed?",
    answer:
      "Identity is confirmed by mass spectrometry against the theoretical monoisotopic mass for the sequence. The observed mass and the expected mass are both reported on the COA so you can verify the match yourself.",
  },
  {
    id: "q-endotoxin",
    category: "quality",
    question: "Do you test for endotoxin?",
    answer:
      "Lots intended for sensitive in-vitro work are screened by the LAL (Limulus amebocyte lysate) method and reported in EU/mg. If endotoxin data is required for your protocol, confirm availability for the specific catalog item before ordering.",
  },
  {
    id: "q-residual",
    category: "quality",
    question: "What about residual solvents like TFA?",
    answer:
      "Trifluoroacetic acid is a common counter-ion from reverse-phase purification. Residual TFA is quantified by the methods listed on the COA. Acetate-exchanged material is available on request for protocols sensitive to TFA.",
    related: [{ label: "Analytical methods", href: "/science" }],
  },
  {
    id: "q-net-peptide",
    category: "quality",
    question: "Does the labeled mass mean net peptide content?",
    answer:
      "The vial label reflects gross fill weight. Net peptide content — the fraction that is peptide versus counter-ions and bound water — is a separate figure reported on the COA when available. Account for net content when calculating molar concentrations.",
  },
  {
    id: "q-batch-variation",
    category: "quality",
    question: "Will purity vary between lots of the same product?",
    answer:
      "Minor lot-to-lot variation within the grade specification is normal. The release threshold is a floor, not a target — a Research-grade lot will always be ≥98% but the exact value is lot-specific and stated on its COA.",
  },

  // ---- Shipping & Returns ----
  {
    id: "s-cold-chain",
    category: "shipping",
    question: "How are temperature-sensitive peptides shipped?",
    answer:
      "Lyophilized peptides are stable for short transit windows at ambient temperature, but heat-sensitive items ship on gel packs or dry ice with an insulated mailer. A temperature logger is included where the protocol requires documented cold-chain integrity.",
    related: [{ label: "Cold-chain handling", href: "/manufacturing" }],
    popular: true,
  },
  {
    id: "s-transit",
    category: "shipping",
    question: "How long does shipping take?",
    answer:
      "Domestic orders typically arrive within 2–4 business days of dispatch. Cold-chain shipments are timed to avoid weekend layovers in transit. A tracking number is issued at dispatch.",
  },
  {
    id: "s-international",
    category: "shipping",
    question: "Do you ship internationally?",
    answer:
      "International availability depends on the destination's import rules for research chemicals. The recipient is responsible for confirming that import is permitted and for any customs documentation. Some catalog items are restricted to domestic shipping.",
  },
  {
    id: "s-warm-arrival",
    category: "shipping",
    question: "My cold-chain package arrived warm — what should I do?",
    answer:
      "Lyophilized powder tolerates brief temperature excursions far better than reconstituted material. If the logger shows an out-of-range excursion or the gel packs arrived fully thawed, document it and contact research support before use so we can assess and replace the lot.",
    related: [{ label: "Contact research support", href: "/contact" }],
  },
  {
    id: "s-returns",
    category: "shipping",
    question: "What is your return policy on opened vials?",
    answer:
      "For sterility and chain-of-custody reasons, opened or reconstituted vials cannot be returned. Unopened, properly stored items may be eligible for return within the stated window. Lots that arrive damaged or out of cold-chain spec are replaced.",
  },
  {
    id: "s-damaged",
    category: "shipping",
    question: "A vial arrived broken. How is that handled?",
    answer:
      "Photograph the packaging and the vial as received and contact research support within 48 hours of delivery. Documented transit damage is replaced at no cost.",
    related: [{ label: "Contact research support", href: "/contact" }],
  },
  {
    id: "s-discreet",
    category: "shipping",
    question: "Is packaging discreet and unlabeled?",
    answer:
      "Outer packaging carries no product description. Internal labeling and the COA reference the catalog item and lot number for your records.",
  },

  // ---- Reconstitution ----
  {
    id: "r-solvent",
    category: "reconstitution",
    question: "Which solvent should I use to reconstitute?",
    answer:
      "Bacteriostatic or sterile water is the common diluent for most water-soluble peptides. Hydrophobic sequences may require a small fraction of acetic acid, ammonium bicarbonate, or DMSO as a carrier. The product page lists a suggested diluent per item; the choice ultimately depends on your downstream assay.",
    related: [{ label: "Browse peptides", href: "/products" }],
    popular: true,
  },
  {
    id: "r-concentration",
    category: "reconstitution",
    question: "How do I calculate the concentration after reconstitution?",
    answer:
      "Divide the net peptide mass in the vial by the volume of diluent added. For example, 5 mg net peptide in 2.5 mL of diluent yields 2 mg/mL. Use the net content from the COA, not the gross fill weight, for accurate molarity.",
  },
  {
    id: "r-mixing",
    category: "reconstitution",
    question: "Should I shake the vial to dissolve the powder?",
    answer:
      "Avoid vigorous shaking, which can shear and denature peptides. Direct the diluent down the vial wall, then let it stand or swirl gently until fully dissolved. Do not inject diluent directly onto the powder pellet at force.",
  },
  {
    id: "r-incomplete",
    category: "reconstitution",
    question: "The peptide won't fully dissolve. What now?",
    answer:
      "Incomplete dissolution usually points to solubility limits or pH. Try gentle warming to room temperature, adjusting pH within the peptide's stable range, or adding a small fraction of an appropriate co-solvent. Filtering before quantification is recommended if particulates remain.",
  },
  {
    id: "r-filter",
    category: "reconstitution",
    question: "Do I need to filter after reconstitution?",
    answer:
      "For cell-culture or other sensitive in-vitro work, sterile-filtering the reconstituted solution through a 0.22 µm membrane is good practice. Account for minor adsorptive loss on the membrane when working at very low concentrations.",
  },
  {
    id: "r-aliquot",
    category: "reconstitution",
    question: "Should I aliquot the reconstituted stock?",
    answer:
      "Yes. Aliquoting into single-use volumes avoids repeated freeze-thaw cycles, which are a leading cause of degradation. Label each aliquot with the lot number and reconstitution date.",
    related: [{ label: "Storage guidance", href: "/faq" }],
  },

  // ---- Storage ----
  {
    id: "st-lyophilized",
    category: "storage",
    question: "How should I store lyophilized peptide before opening?",
    answer:
      "Store the sealed, lyophilized vial at −20°C protected from light and moisture. Allow the vial to equilibrate to room temperature before opening to prevent atmospheric moisture condensing onto the cold powder.",
    popular: true,
  },
  {
    id: "st-reconstituted",
    category: "storage",
    question: "How long is reconstituted peptide stable?",
    answer:
      "Reconstituted peptide in solution is far less stable than the lyophilized form. Most reconstituted stocks are best used within days to a few weeks when refrigerated at 2–8°C, and longer when frozen in aliquots. Stability is sequence-dependent — consult the product page.",
    related: [{ label: "Stability data", href: "/science" }],
  },
  {
    id: "st-freeze-thaw",
    category: "storage",
    question: "How many freeze-thaw cycles can a stock tolerate?",
    answer:
      "Each freeze-thaw cycle risks aggregation and bond cleavage. Minimize cycles by aliquoting before freezing. If repeated access is unavoidable, store working aliquots at 2–8°C and reserve the frozen master stock.",
  },
  {
    id: "st-condensation",
    category: "storage",
    question: "Why does temperature equilibration matter before opening?",
    answer:
      "Opening a cold vial in warm, humid air draws condensation onto the powder. Absorbed moisture accelerates hydrolysis and degradation. Let the sealed vial reach room temperature first, then open.",
  },
  {
    id: "st-light",
    category: "storage",
    question: "Are peptides light-sensitive?",
    answer:
      "Sequences containing tryptophan, tyrosine, or methionine can be photosensitive and prone to oxidation. Store protected from light and minimize bench exposure during handling.",
  },
  {
    id: "st-long-term",
    category: "storage",
    question: "What is the expected shelf life under correct storage?",
    answer:
      "Lyophilized peptide stored at −20°C is typically stable for the retest window stated on the COA — often 24 months or more depending on the sequence. The expiry segment of the lot number decodes the retest date.",
    related: [{ label: "Batch traceability", href: "/manufacturing" }],
  },

  // ---- Compliance / RUO ----
  {
    id: "c-ruo",
    category: "compliance",
    question: "What does 'Research Use Only' mean?",
    answer:
      "All products are labeled and sold strictly for in-vitro laboratory research. They are not drugs, foods, cosmetics, or articles intended for human or veterinary use, and may not be administered to humans or animals. Purchasers are responsible for lawful use in their jurisdiction.",
    popular: true,
  },
  {
    id: "c-eligibility",
    category: "compliance",
    question: "Who is eligible to purchase?",
    answer:
      "Purchasers must be qualified researchers, institutions, or businesses acquiring materials for legitimate research purposes. An age and research-use acknowledgement is required at first visit and at checkout.",
  },
  {
    id: "c-verification",
    category: "compliance",
    question: "Do I need to verify my research credentials?",
    answer:
      "Certain restricted catalog items and wholesale accounts require documentation of institutional or business affiliation. Standard catalog orders require acknowledgement of the research-use terms at checkout.",
    related: [{ label: "Contact research support", href: "/contact" }],
  },
  {
    id: "c-claims",
    category: "compliance",
    question: "Can you advise on dosing or therapeutic use?",
    answer:
      "No. We cannot provide dosing, administration, or therapeutic guidance of any kind. Our documentation is limited to analytical specifications, handling, and storage of the research material.",
  },
  {
    id: "c-msds",
    category: "compliance",
    question: "Is a safety data sheet available?",
    answer:
      "A safety data sheet covering handling, hazard, and disposal information is available for catalog items. Request the SDS for a specific product through research support.",
    related: [{ label: "Contact research support", href: "/contact" }],
  },

  // ---- Payment ----
  {
    id: "p-methods",
    category: "payment",
    question: "Which payment methods do you accept?",
    answer:
      "Major credit and debit cards are accepted at checkout. Institutional purchase orders and bank transfer are available for qualified accounts. Available methods are shown at checkout for your region.",
  },
  {
    id: "p-po",
    category: "payment",
    question: "Can my institution pay by purchase order?",
    answer:
      "Yes. Qualified institutional and business accounts can transact by PO with net terms after approval. Contact research support to set up an account.",
    related: [{ label: "Contact research support", href: "/contact" }],
  },
  {
    id: "p-security",
    category: "payment",
    question: "Is my payment information secure?",
    answer:
      "Card data is handled by a PCI-compliant payment processor and is not stored on our servers. The checkout connection is encrypted end to end.",
  },
  {
    id: "p-currency",
    category: "payment",
    question: "What currency are prices listed in?",
    answer:
      "Catalog prices are listed in US dollars. International cards are billed in USD; your issuer applies any conversion at its prevailing rate.",
  },
  {
    id: "p-tax",
    category: "payment",
    question: "Will I be charged tax, and can it be exempted?",
    answer:
      "Applicable sales tax is calculated at checkout based on the ship-to location. Tax-exempt institutions can submit exemption documentation to research support to have it applied to qualifying orders.",
  },

  // ---- Wholesale ----
  {
    id: "w-pricing",
    category: "wholesale",
    question: "Do you offer bulk or wholesale pricing?",
    answer:
      "Yes. Tiered pricing applies to bulk-lot quantities and standing supply agreements. Pricing depends on the compound, quantity, and required documentation. Contact research support with your requirements for a quote.",
    related: [{ label: "Wholesale inquiries", href: "/contact" }],
    popular: true,
  },
  {
    id: "w-custom",
    category: "wholesale",
    question: "Can you synthesize a custom sequence?",
    answer:
      "Custom solid-phase synthesis is available for many sequences, with purity, scale, and modification options quoted per project. Provide the sequence, required purity, and scale to research support to begin a feasibility review.",
    related: [{ label: "Contact research support", href: "/contact" }],
  },
  {
    id: "w-coa-bulk",
    category: "wholesale",
    question: "Do bulk lots include full documentation?",
    answer:
      "Every bulk lot ships with its per-lot COA and, on request, supporting analytical data and an SDS. Standing accounts can receive documentation packages on a recurring basis.",
    related: [{ label: "View COAs", href: "/coa" }],
  },
  {
    id: "w-lead-time",
    category: "wholesale",
    question: "What is the lead time for large or custom orders?",
    answer:
      "In-stock bulk quantities ship on the standard timeline. Custom synthesis and large made-to-order lots are quoted with a project-specific lead time based on sequence complexity and scale.",
  },
  {
    id: "w-account",
    category: "wholesale",
    question: "How do I open a wholesale account?",
    answer:
      "Reach out to research support with your institution or business details and anticipated volume. Account setup includes verification of research-use eligibility and, where applicable, net-terms approval.",
    related: [{ label: "Wholesale inquiries", href: "/contact" }],
  },
];
