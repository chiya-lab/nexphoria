import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program Terms | Nexphoria",
  description:
    "Terms governing participation in the Nexphoria affiliate and influencer program — commissions, attribution, promotion rules, and FTC compliance. Research use only.",
  alternates: { canonical: "https://nexphoria.com/affiliates/terms" },
};

const SECTIONS = [
  {
    title: "Eligibility",
    content:
      "Participation is open to researchers, educators, and content creators whose work is compatible with a research-use-only context. You must be at least 18 years of age. Nexphoria reviews each application for content fit and compliance and may decline or revoke participation at its discretion.",
  },
  {
    title: "Commissions and tiers",
    content:
      "Commission rates range from 15% to 30% based on your tier, which is determined by trailing 30-day referred sales. A conversion is attributed to the most recent qualifying referral link clicked within your tier's cookie window. Commissions are calculated on the net order subtotal, excluding shipping, taxes, and other credits.",
  },
  {
    title: "Attribution and tracking",
    content:
      "Attribution relies on referral links carrying your unique code. Cookie windows are 30 days (Researcher), 60 days (Creator), 90 days (Pro), and 120 days (Elite). Orders later cancelled, refunded, or found to be fraudulent are reversed and deducted from your balance.",
  },
  {
    title: "Payouts and taxes",
    content:
      "Approved commissions are paid monthly via your selected method (ACH, PayPal, wire, or USDC), subject to your tier's minimum balance. Payouts are held until valid tax documentation (W-9 for US partners, W-8BEN for international partners) is on file. You are responsible for any taxes owed on commissions earned.",
  },
  {
    title: "Promotion rules",
    content:
      "All Nexphoria compounds must be presented as research use only. You may not make medical, therapeutic, or personal-outcome claims; use before/after imagery; target minors or non-research consumer audiences; or bid on Nexphoria trademark terms in paid search. Self-referral, coupon stacking, and cookie stuffing are prohibited.",
  },
  {
    title: "FTC disclosure",
    content:
      "You must include a clear and conspicuous affiliate disclosure on every placement that uses your referral links, consistent with FTC guidance. Provided creative assets carry this disclosure; if you create your own, the disclosure remains your responsibility.",
  },
  {
    title: "Brand and content",
    content:
      "Use only approved Nexphoria assets and on-voice messaging. Do not misrepresent the brand, fabricate specifications, or imply endorsement beyond the affiliate relationship. Nexphoria may request removal of any non-compliant content.",
  },
  {
    title: "Termination",
    content:
      "Either party may end the relationship at any time. Violations may result in withheld commissions and removal from the program. Earned, compliant commissions accrued before termination remain payable subject to these terms.",
  },
];

export default function AffiliateTermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
      <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
        Program terms
      </span>
      <h1 className="mt-2 text-[32px] font-semibold lg:text-[44px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
        Affiliate program terms
      </h1>
      <p className="mt-3 text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
        These terms govern participation in the Nexphoria affiliate and influencer program. By applying, you agree to them.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              {s.title}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              {s.content}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-12 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        All Nexphoria products are for research use only. Earnings figures shown across the program are illustrative. This is a demo and not a binding agreement.
      </p>
    </main>
  );
}
