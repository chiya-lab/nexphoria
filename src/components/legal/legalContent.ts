/**
 * Legal/policy content as a plain (non-"use client") data module so both the
 * client TOC/shell and the server page (WebPage JSON-LD + dateModified) read
 * one source. Exporting these arrays from a "use client" file and importing
 * them into a server component breaks at build collect time.
 */

export type CalloutTone = "info" | "warning" | "critical";

export interface LegalCallout {
  tone: CalloutTone;
  title: string;
  body: string;
}

export interface LegalSection {
  /** Anchor id used by the TOC and IntersectionObserver. */
  id: string;
  /** TOC label + H2 heading. */
  heading: string;
  /** Paragraph strings rendered as prose. */
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
  /** Optional callout box rendered at the top of the section. */
  callout?: LegalCallout;
}

export interface LegalPage {
  slug: string;
  route: string;
  title: string;
  eyebrow: string;
  /** Short lede under the title. */
  intro: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  metaTitle: string;
  metaDescription: string;
  sections: LegalSection[];
}

const ENTITY = "Nexphoria LLC";
const CONTACT = "legal@nexphoria.com";

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "terms",
    route: "/terms",
    title: "Terms of Service",
    eyebrow: "Legal · Binding agreement",
    intro:
      "These Terms govern the sale of research compounds and your use of this Site. Read them in full before purchasing. All products are supplied for laboratory research use only.",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-06-02",
    version: "3.1",
    metaTitle: "Terms of Service — Nexphoria",
    metaDescription:
      "Terms of Service for Nexphoria research compounds. 21+, US-only, research use only. Purchase terms, returns, arbitration, governing law, and limitation of liability.",
    sections: [
      {
        id: "acceptance",
        heading: "1. Acceptance of Terms",
        paragraphs: [
          `By accessing nexphoria.com (the "Site") or purchasing products from ${ENTITY} ("Nexphoria," "we," "us," or "our"), you ("Purchaser" or "Researcher") agree to be bound by these Terms of Service. If you do not agree to every provision, you may not access the Site or place an order.`,
          "These Terms constitute a legally binding agreement between you and Nexphoria. We recommend you read them in their entirety, retain a copy for your records, and review them periodically, as they may be amended in accordance with the Modifications section below.",
        ],
      },
      {
        id: "research-use-only",
        heading: "2. Research Use Only — Not for Human or Animal Consumption",
        callout: {
          tone: "critical",
          title: "Research use only",
          body:
            "All compounds sold by Nexphoria are intended exclusively for in-vitro laboratory research and analytical reference. They are not drugs, foods, cosmetics, or dietary products, and are not intended to diagnose, treat, cure, or prevent any condition.",
        },
        paragraphs: [
          "Products are sold solely to qualified researchers, institutions, and laboratory professionals for legitimate scientific investigation. By placing an order you represent that you are acquiring the products for research use only and that you will not administer them to humans or animals.",
          "You assume full responsibility for the safe handling, storage, and lawful use of all products following accepted laboratory practice and all applicable institutional, local, state, and federal requirements. Nexphoria makes no representation that any product is suitable for any particular purpose beyond research reference.",
        ],
      },
      {
        id: "eligibility",
        heading: "3. Eligibility — 21+ and United States Only",
        paragraphs: [
          "You must be at least twenty-one (21) years of age and accessing the Site from within the United States to place an order. Nexphoria sells and ships only to destinations within the United States and does not accept international orders.",
          "We may, at our discretion, request documentation verifying your age, research affiliation, or institutional status, and may decline or cancel any order where eligibility cannot be reasonably established.",
        ],
      },
      {
        id: "orders-pricing",
        heading: "4. Orders, Pricing, and Payment",
        paragraphs: [
          "All orders are offers to purchase and are subject to acceptance by Nexphoria. We may refuse or cancel any order for reasons including suspected resale, ineligibility, pricing error, or inventory limitation. Prices are stated in U.S. dollars and may change without notice prior to order acceptance.",
          "Payment must be received and cleared before an order ships. You represent that you are authorized to use the payment method provided and that the billing information supplied is accurate.",
        ],
      },
      {
        id: "shipping-returns",
        heading: "5. Shipping and Returns",
        paragraphs: [
          "Shipping methods, cold-chain handling, and transit estimates are described on our Shipping page. Because these are research reagents with integrity and chain-of-custody requirements, returns are limited.",
          "Unopened, seal-intact vials may be eligible for return within the window stated on our Returns page, subject to lot verification. Opened vials, reconstituted material, and items with compromised seals are not eligible for return. Refer to the Returns policy for the full process and exclusions.",
        ],
      },
      {
        id: "intellectual-property",
        heading: "6. Intellectual Property",
        paragraphs: [
          "The Site and its contents — including text, specifications, certificates, graphics, logos, and the compilation thereof — are owned by Nexphoria or its licensors and are protected by intellectual-property laws. You are granted a limited, revocable, non-exclusive license to access the Site for your own research-procurement purposes.",
          "You may not reproduce, redistribute, systematically collect, or create derivative works from Site content without prior written consent, except as permitted by applicable law.",
        ],
      },
      {
        id: "disclaimers",
        heading: "7. Disclaimers and Limitation of Liability",
        callout: {
          tone: "warning",
          title: "Limitation of liability",
          body:
            "To the maximum extent permitted by law, Nexphoria's aggregate liability arising out of or relating to the products or these Terms shall not exceed the amount you paid for the product giving rise to the claim.",
        },
        paragraphs: [
          'Products are provided "as is" and "as available." Except for the certificate-of-analysis specifications expressly provided for a given lot, Nexphoria disclaims all warranties, express or implied, including merchantability and fitness for a particular purpose.',
          "In no event shall Nexphoria be liable for indirect, incidental, special, consequential, or punitive damages, or for any misuse of products contrary to their research-use-only designation. Some jurisdictions do not allow certain limitations, so portions of this section may not apply to you.",
        ],
      },
      {
        id: "dispute-resolution",
        heading: "8. Dispute Resolution and Arbitration",
        paragraphs: [
          "Any dispute arising out of or relating to these Terms or your purchases shall be resolved by binding individual arbitration administered under the rules of a recognized arbitration body, rather than in court, except that either party may bring an individual claim in small-claims court where eligible.",
          "You and Nexphoria waive any right to a jury trial and agree that claims may be brought only in an individual capacity and not as part of any class or representative proceeding, to the extent permitted by applicable law.",
        ],
      },
      {
        id: "governing-law",
        heading: "9. Governing Law and Severability",
        paragraphs: [
          "These Terms are governed by the laws of the State of Delaware, without regard to its conflict-of-laws principles. If any provision is held unenforceable, that provision will be limited or severed to the minimum extent necessary, and the remaining provisions will remain in full force and effect.",
          "Our failure to enforce any provision is not a waiver of our right to do so later. These Terms, together with the policies referenced herein, constitute the entire agreement between you and Nexphoria regarding their subject matter.",
        ],
      },
      {
        id: "modifications",
        heading: "10. Modifications and Contact",
        paragraphs: [
          "We may revise these Terms at any time by posting an updated version with a new effective date. Material changes will be reflected in the version indicator at the top of this page. Your continued use of the Site after changes take effect constitutes acceptance of the revised Terms.",
          `Questions regarding these Terms may be directed to ${CONTACT}.`,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    route: "/privacy",
    title: "Privacy Policy",
    eyebrow: "Legal · Data protection",
    intro:
      "This policy explains what personal information we collect, how we use and retain it, with whom we share it, and the rights available to you under applicable privacy law, including the CCPA/CPRA and GDPR.",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-06-02",
    version: "2.4",
    metaTitle: "Privacy Policy — Nexphoria",
    metaDescription:
      "How Nexphoria collects, uses, retains, and shares personal information. CCPA/CPRA and GDPR-aware. Your data rights and how to contact our data protection contact.",
    sections: [
      {
        id: "scope",
        heading: "1. Scope of This Policy",
        paragraphs: [
          `This Privacy Policy applies to personal information processed by ${ENTITY} in connection with the Site, account registration, order fulfillment, and customer support. It describes our practices as a business and, where applicable, as a data controller.`,
          "By using the Site you acknowledge the practices described here. Where required by law, we obtain consent before processing certain categories of information, as described below.",
        ],
      },
      {
        id: "information-we-collect",
        heading: "2. Information We Collect",
        paragraphs: [
          "We collect information you provide directly and information generated automatically as you use the Site.",
        ],
        bullets: [
          "Account information: name, email address, password hash, and institutional or research affiliation where provided.",
          "Order information: billing and shipping address, items purchased, lot references, and order history.",
          "Payment information: processed by our payment providers; we do not store full card numbers on our systems.",
          "Browsing information: IP address, device and browser metadata, pages viewed, and interactions, collected via cookies and similar technologies.",
          "Communications: support messages, wholesale inquiries, and correspondence you send to us.",
        ],
      },
      {
        id: "how-we-use",
        heading: "3. How We Use Information",
        paragraphs: [
          "We use personal information to process and ship orders, maintain accounts, provide customer support, prevent fraud and misuse, comply with legal obligations, and improve the Site and our services.",
          "Where we rely on legitimate interests or consent as a legal basis, you may object to or withdraw consent for certain processing as described in the Your Rights section. We do not use order content to make decisions producing legal effects without human involvement.",
        ],
      },
      {
        id: "sharing",
        heading: "4. How We Share Information",
        paragraphs: [
          "We share personal information only as necessary to operate our business and as described here. We do not sell personal information for monetary consideration.",
        ],
        bullets: [
          "Shipping carriers, to deliver orders and provide tracking.",
          "Payment processors, to authorize and settle transactions.",
          "Service providers for hosting, analytics, fraud prevention, and email delivery, bound by contractual confidentiality and data-protection obligations.",
          "Legal and safety recipients, where disclosure is required by law or to protect rights, property, or safety.",
        ],
      },
      {
        id: "retention",
        heading: "5. Data Retention",
        paragraphs: [
          "We retain personal information for as long as necessary to fulfill the purposes described in this policy, including maintaining order and tax records, resolving disputes, and enforcing agreements. Retention periods vary by data type and applicable legal requirement.",
          "When information is no longer required, we delete or de-identify it using reasonable measures appropriate to the sensitivity of the data.",
        ],
      },
      {
        id: "security",
        heading: "6. Security",
        paragraphs: [
          "We maintain administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, disclosure, alteration, and destruction. These include encryption in transit, access controls, and least-privilege practices.",
          "No method of transmission or storage is completely secure. While we work to protect your information, we cannot guarantee absolute security and encourage you to use a strong, unique password for your account.",
        ],
      },
      {
        id: "your-rights",
        heading: "7. Your Privacy Rights",
        paragraphs: [
          "Depending on your jurisdiction, you may have rights to access, correct, delete, or port your personal information; to opt out of certain processing; and to lodge a complaint with a supervisory authority. California residents have additional rights described on our Do Not Sell or Share page.",
          "To exercise your rights, contact us using the details below. We will verify your request and respond within the timeframe required by applicable law. We will not discriminate against you for exercising your rights.",
        ],
      },
      {
        id: "contact-dpo",
        heading: "8. Contact and Data Protection",
        paragraphs: [
          `Questions about this policy or our handling of personal information may be directed to our data protection contact at ${CONTACT}. For residents of jurisdictions requiring a designated representative, requests submitted to this address will be routed appropriately.`,
          "We will update this policy as our practices or legal obligations change, and will reflect material changes in the version indicator above.",
        ],
      },
    ],
  },
  {
    slug: "research-use-policy",
    route: "/research-use-policy",
    title: "Research Use Policy",
    eyebrow: "Compliance · Research use only",
    intro:
      "This policy defines who may purchase Nexphoria compounds, the permitted scope of use, prohibited conduct, and the enforcement measures we apply to protect the integrity of research-only distribution.",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-06-02",
    version: "1.6",
    metaTitle: "Research Use Policy — Nexphoria",
    metaDescription:
      "Nexphoria research use policy: eligible purchasers, permitted laboratory use, prohibited human or animal use and resale, and enforcement including account suspension.",
    sections: [
      {
        id: "purpose",
        heading: "1. Purpose and Designation",
        callout: {
          tone: "critical",
          title: "For research use only",
          body:
            "Every compound Nexphoria sells is designated for research use only (RUO). Products are not approved for human or veterinary use and must never be administered to people or animals.",
        },
        paragraphs: [
          "This Research Use Policy operates alongside our Terms of Service and governs the conditions under which compounds may be purchased and used. It exists to ensure that products are obtained and handled by qualified parties for legitimate scientific purposes.",
          "By placing an order you affirm that you have read, understood, and agree to comply with this policy in full.",
        ],
      },
      {
        id: "eligible-purchasers",
        heading: "2. Eligible Purchasers",
        paragraphs: [
          "Purchasing is restricted to qualified researchers, academic and commercial laboratories, and institutional buyers operating within the United States who are at least twenty-one (21) years of age.",
        ],
        bullets: [
          "Academic and research institutions and their authorized personnel.",
          "Commercial and analytical laboratories conducting in-vitro research.",
          "Independent researchers able to attest to legitimate research purpose and proper handling capability.",
        ],
      },
      {
        id: "permitted-use",
        heading: "3. Permitted Use",
        paragraphs: [
          "Compounds may be used solely for in-vitro laboratory research, analytical reference, method development, and similar non-clinical scientific activities conducted under appropriate laboratory controls.",
          "Purchasers are responsible for determining the suitability of a compound for their intended research application and for conducting that research in accordance with accepted scientific and safety standards.",
        ],
      },
      {
        id: "prohibited-uses",
        heading: "4. Prohibited Uses",
        callout: {
          tone: "warning",
          title: "Strictly prohibited",
          body:
            "The following uses are prohibited without exception and may result in immediate account termination and referral to authorities where warranted.",
        },
        paragraphs: [
          "The following conduct is strictly prohibited:",
        ],
        bullets: [
          "Administration to, or consumption by, humans or animals in any form.",
          "Any clinical, therapeutic, diagnostic, cosmetic, or dietary use.",
          "Resale, redistribution, or repackaging for sale to end consumers.",
          "Use that misrepresents the research-only nature of the products.",
          "Any use that violates applicable local, state, or federal law.",
        ],
      },
      {
        id: "handling-responsibility",
        heading: "5. Handling and Storage Responsibility",
        paragraphs: [
          "Purchasers must store and handle compounds according to documented laboratory practice, including appropriate cold-chain storage, reconstitution procedures, labeling, and disposal. Certificates of analysis describe lot-specific specifications and should be retained with research records.",
          "Nexphoria is not responsible for outcomes resulting from improper handling, storage, or use contrary to this policy.",
        ],
      },
      {
        id: "enforcement",
        heading: "6. Enforcement and Account Suspension",
        paragraphs: [
          "We monitor ordering patterns and may request documentation to confirm eligibility and research purpose. Where we identify conduct inconsistent with this policy — including suspected resale, consumption, or misrepresentation — we may decline orders, suspend or terminate accounts, withhold shipment, and retain associated records.",
          "We reserve the right to cooperate with regulatory and law-enforcement authorities and to take any action reasonably necessary to protect the integrity of research-only distribution.",
        ],
      },
      {
        id: "acknowledgement",
        heading: "7. Acknowledgement",
        paragraphs: [
          "Completion of a purchase constitutes your acknowledgement that you are an eligible purchaser, that you will use products solely for permitted research, and that you accept the enforcement measures described above.",
          `Questions regarding this policy may be directed to ${CONTACT}.`,
        ],
      },
    ],
  },
  {
    slug: "cookies",
    route: "/cookies",
    title: "Cookie Policy",
    eyebrow: "Legal · Tracking technologies",
    intro:
      "This policy explains the cookies and similar technologies we use, the categories they fall into, the providers involved, and how you can control them through your browser and our consent manager.",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-06-02",
    version: "1.3",
    metaTitle: "Cookie Policy — Nexphoria",
    metaDescription:
      "How Nexphoria uses cookies: essential, analytics, and marketing categories, the providers involved, and how to opt out via your browser or our consent manager.",
    sections: [
      {
        id: "what-are-cookies",
        heading: "1. What Cookies Are",
        paragraphs: [
          "Cookies are small text files stored on your device when you visit a website. They allow a site to recognize your device, remember preferences, and understand how the site is used. We also use related technologies such as local storage and pixels, referred to collectively here as cookies.",
          "Cookies may be set by us (first-party) or by service providers acting on our behalf (third-party).",
        ],
      },
      {
        id: "essential",
        heading: "2. Essential Cookies",
        callout: {
          tone: "info",
          title: "Always active",
          body:
            "Essential cookies are required for the Site to function and cannot be switched off in our systems. They do not store personally identifying information beyond what is necessary to operate the Site.",
        },
        paragraphs: [
          "These cookies enable core functionality such as maintaining your session, remembering items in your cart, applying security protections, and recording your cookie preferences. Without them, parts of the Site will not work correctly.",
        ],
      },
      {
        id: "analytics",
        heading: "3. Analytics Cookies",
        paragraphs: [
          "Analytics cookies help us understand how visitors interact with the Site so we can improve performance and usability. They collect information in aggregate, such as pages visited, time on page, and navigation paths.",
          "These cookies are set only where permitted by your consent settings. Providers may include privacy-conscious analytics services configured to limit data collection.",
        ],
      },
      {
        id: "marketing",
        heading: "4. Marketing Cookies",
        paragraphs: [
          "Marketing cookies may be used to measure the effectiveness of campaigns and to limit the number of times you see a given message. They are set only with your consent and can be withdrawn at any time.",
          "We do not use marketing cookies to make decisions that produce legal effects, and we honor opt-out preferences communicated through recognized browser signals where applicable.",
        ],
      },
      {
        id: "managing",
        heading: "5. Managing Your Preferences",
        paragraphs: [
          "You can manage non-essential cookies through our consent manager, accessible from the cookie banner and the link in the Site footer. You may also control cookies through your browser settings, including blocking or deleting cookies already stored.",
          "Restricting cookies may affect the functionality of the Site. Because preferences are stored in a cookie, clearing your cookies will reset your choices.",
        ],
      },
      {
        id: "providers",
        heading: "6. Providers and Updates",
        paragraphs: [
          "The specific providers we engage may change over time as we add or remove services. Categories of providers include hosting and content delivery, analytics, fraud prevention, and email delivery. Each is bound by contractual data-protection obligations.",
          `We will update this policy to reflect changes in the technologies we use. Questions may be directed to ${CONTACT}.`,
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    route: "/accessibility",
    title: "Accessibility Statement",
    eyebrow: "Commitment · Inclusive design",
    intro:
      "We are committed to making this Site usable by the widest possible audience, including researchers who rely on assistive technologies. This statement describes our target standard, ongoing work, and how to request assistance.",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-06-02",
    version: "1.2",
    metaTitle: "Accessibility Statement — Nexphoria",
    metaDescription:
      "Nexphoria's accessibility commitment: WCAG 2.2 AA target, ongoing improvements, alternate-format requests, and how to contact us about accessibility barriers.",
    sections: [
      {
        id: "commitment",
        heading: "1. Our Commitment",
        paragraphs: [
          "Nexphoria is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards to the design and development of this Site.",
          "Accessibility is treated as an ongoing responsibility rather than a one-time project, and is considered as part of our design and engineering process.",
        ],
      },
      {
        id: "standard",
        heading: "2. Conformance Target",
        callout: {
          tone: "info",
          title: "WCAG 2.2 Level AA",
          body:
            "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA, which define requirements for making web content more accessible to a broad range of users.",
        },
        paragraphs: [
          "Conformance means the Site is designed and built to meet these success criteria, including sufficient color contrast, keyboard operability, meaningful structure, and text alternatives for non-text content. We measure progress through automated checks and manual review.",
        ],
      },
      {
        id: "measures",
        heading: "3. Measures We Take",
        paragraphs: [
          "We incorporate accessibility into our development workflow through the following measures:",
        ],
        bullets: [
          "Semantic structure and landmark regions to support assistive technologies.",
          "Keyboard-operable interactive components with visible focus indicators.",
          "Sufficient contrast between text and background in our dark interface.",
          "Text alternatives for meaningful images and iconography.",
          "Periodic review using automated tooling and manual testing.",
        ],
      },
      {
        id: "limitations",
        heading: "4. Known Limitations",
        paragraphs: [
          "Despite our efforts, some content may not yet fully conform to our target standard. Third-party components and dynamic interactive tools may present areas for improvement, which we prioritize as they are identified.",
          "If you encounter a barrier that is not described here, we welcome your report so we can address it.",
        ],
      },
      {
        id: "alternate-formats",
        heading: "5. Alternate Formats and Assistance",
        paragraphs: [
          "If you need information from this Site in an alternate format, or require assistance completing a task such as placing an order or accessing a certificate of analysis, we will work with you to provide a reasonable accommodation.",
          "Please contact us with a description of the assistance you need and your preferred method of contact, and we will respond promptly.",
        ],
      },
      {
        id: "feedback",
        heading: "6. Feedback and Contact",
        paragraphs: [
          `We welcome feedback on the accessibility of this Site. If you experience difficulty or wish to suggest an improvement, contact us at ${CONTACT} and describe the issue and the page or feature involved.`,
          "We aim to acknowledge accessibility feedback promptly and to use it to guide ongoing improvements.",
        ],
      },
    ],
  },
  {
    slug: "do-not-sell",
    route: "/do-not-sell",
    title: "Do Not Sell or Share My Personal Information",
    eyebrow: "California privacy · CCPA/CPRA",
    intro:
      "California residents may exercise rights under the CCPA/CPRA, including the right to opt out of the sale or sharing of personal information. This page explains those rights and how to submit a request.",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-06-02",
    version: "1.1",
    metaTitle: "Do Not Sell or Share My Personal Information — Nexphoria",
    metaDescription:
      "California CCPA/CPRA rights at Nexphoria: opt out of sale or sharing of personal information, authorized-agent requests, and identity verification.",
    sections: [
      {
        id: "your-rights",
        heading: "1. Your California Privacy Rights",
        paragraphs: [
          "Under the California Consumer Privacy Act, as amended by the California Privacy Rights Act, California residents have the right to know what personal information is collected, to access and delete it, to correct inaccuracies, and to opt out of the sale or sharing of personal information.",
          "You also have the right not to receive discriminatory treatment for exercising any of these rights.",
        ],
      },
      {
        id: "sale-sharing",
        heading: "2. Our Position on Sale and Sharing",
        callout: {
          tone: "info",
          title: "We do not sell personal information",
          body:
            "Nexphoria does not sell personal information for monetary consideration. Where certain analytics or advertising technologies may constitute sharing under California law, you may opt out using the request below.",
        },
        paragraphs: [
          "To the extent that any use of cookies or similar technologies is considered sharing for cross-context behavioral purposes under California law, you may direct us not to share your personal information by submitting a request and by configuring your preferences in our consent manager.",
        ],
      },
      {
        id: "submit-request",
        heading: "3. How to Submit a Request",
        paragraphs: [
          "You may submit an opt-out or related rights request using the form below. Provide the information needed for us to locate your records and to communicate our response. Submitting a request does not require you to create an account.",
          "We will process opt-out requests promptly and other rights requests within the timeframe required by law.",
        ],
      },
      {
        id: "authorized-agent",
        heading: "4. Authorized Agent Requests",
        paragraphs: [
          "You may use an authorized agent to submit a request on your behalf. We may require the agent to provide proof of authorization and may require you to verify your own identity directly with us, as permitted by law.",
          "Requests submitted without sufficient authorization or verification may be delayed or declined until the necessary information is provided.",
        ],
      },
      {
        id: "verification",
        heading: "5. Identity Verification",
        paragraphs: [
          "To protect your information, we verify the identity of the requester before fulfilling certain requests. Verification typically involves matching information you provide against information already in our records.",
          "The level of verification corresponds to the sensitivity of the request and the risk of harm from unauthorized disclosure. We will not use information collected for verification for any unrelated purpose.",
        ],
      },
      {
        id: "contact",
        heading: "6. Contact",
        paragraphs: [
          `For questions about your California privacy rights or to follow up on a submitted request, contact us at ${CONTACT}. Please reference any confirmation provided when your request was submitted.`,
          "We will update this page as our practices or legal obligations change.",
        ],
      },
    ],
  },
  {
    slug: "coa-compliance",
    route: "/coa-compliance",
    title: "Certificate of Analysis and Compliance",
    eyebrow: "Quality · Documentation",
    intro:
      "This page explains how certificates of analysis are issued, the analytical methodology behind them, how long records are retained, our redaction practices, and how customers access lot documentation.",
    effectiveDate: "2026-01-01",
    lastUpdated: "2026-06-02",
    version: "1.4",
    metaTitle: "Certificate of Analysis and Compliance — Nexphoria",
    metaDescription:
      "How Nexphoria issues certificates of analysis: methodology, identity and purity testing, record retention, redaction policy, and customer access to lot documentation.",
    sections: [
      {
        id: "what-is-coa",
        heading: "1. What a Certificate of Analysis Is",
        paragraphs: [
          "A certificate of analysis (CoA) is a document summarizing the analytical testing performed on a specific production lot. It reports identity and purity results against the specifications applicable to that compound, allowing researchers to evaluate suitability for reference and method development.",
          "Each CoA is tied to a lot number so that documentation can be matched to the material received.",
        ],
      },
      {
        id: "issuance",
        heading: "2. How CoAs Are Issued",
        paragraphs: [
          "CoAs are generated for each lot as part of our intake and quality process. Testing is performed before a lot is released for sale, and the resulting certificate is associated with the lot record in our systems.",
          "Where testing is performed by a third-party laboratory, the certificate identifies the analytical context so that results can be interpreted appropriately.",
        ],
      },
      {
        id: "methodology",
        heading: "3. Analytical Methodology",
        callout: {
          tone: "info",
          title: "Identity and purity",
          body:
            "Typical analyses include identity confirmation by mass spectrometry and purity determination by high-performance liquid chromatography, reported as a percentage against the lot specification.",
        },
        paragraphs: [
          "Methodology is selected to suit the compound and the specification being verified. Reported values reflect the analytical methods and conditions in effect at the time of testing and should be interpreted within the limits of those methods.",
          "Specifications describe acceptance criteria; a result within specification indicates the lot met the stated criteria at the time of testing.",
        ],
      },
      {
        id: "retention",
        heading: "4. Record Retention",
        paragraphs: [
          "We retain CoAs and associated lot records for a period consistent with our quality and recordkeeping obligations, so that documentation remains available for reference after a lot has shipped.",
          "Retention enables traceability between the material received and the testing performed, supporting the integrity of research conducted with our compounds.",
        ],
      },
      {
        id: "redaction",
        heading: "5. Redaction Policy",
        paragraphs: [
          "Certificates made available to customers may have certain information redacted to protect confidential business information, supplier relationships, or proprietary methodology, while preserving the identity and purity results relevant to the researcher.",
          "Redaction does not alter the reported analytical results applicable to the lot; it limits disclosure of information unrelated to the customer's evaluation of the material.",
        ],
      },
      {
        id: "customer-access",
        heading: "6. Customer Access",
        paragraphs: [
          "Lot-specific certificates are made available through the product documentation linked from each product page and, where applicable, through your account. If you cannot locate the certificate for a lot you received, contact us with the lot number and we will assist.",
          `Questions about CoAs or our compliance practices may be directed to ${CONTACT}.`,
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return LEGAL_PAGES.find((p) => p.slug === slug);
}

export const LEGAL_CONTACT_EMAIL = CONTACT;
