import Link from "next/link";
import { ArrowLeft, AlertTriangle, Shield, Scale } from "lucide-react";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import LegalToc, { type TocItem } from "@/components/LegalToc";

export const metadata: Metadata = {
  title: "Terms of Service | Nexphoria Research Peptides",
  description:
    "Terms of Service for Nexphoria — research peptide supplier. For Research Use Only. Not for human consumption. Full purchase terms, refund policy, and legal conditions.",
};

const sections = [
  {
    id: "acceptance",
    number: "1",
    title: "Acceptance of Terms",
    content: (
      <>
        <p className="mb-3">
          By accessing or using nexphoria.com (&ldquo;Site&rdquo;) or purchasing products from
          Nexphoria LLC (&ldquo;Nexphoria,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;), you (&ldquo;Purchaser,&rdquo; &ldquo;Researcher,&rdquo; or
          &ldquo;you&rdquo;) agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If
          you do not agree to all of these Terms, you may not access or use this Site or purchase
          products from Nexphoria.
        </p>
        <p>
          These Terms constitute a legally binding agreement. We recommend you read them carefully
          in their entirety before making any purchase.
        </p>
      </>
    ),
  },
  {
    id: "research-use-only",
    number: "2",
    title: "RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION",
    highlight: true,
    content: (
      <>
        <p className="mb-3 font-semibold" style={{ color: "#d4af37" }}>
          ALL NEXPHORIA PRODUCTS ARE SOLD STRICTLY FOR IN VITRO AND IN VIVO LABORATORY RESEARCH USE
          ONLY. THEY ARE NOT FOR HUMAN OR ANIMAL CONSUMPTION, THERAPEUTIC USE, DIAGNOSTIC USE, OR
          ANY PURPOSE OTHER THAN LEGITIMATE SCIENTIFIC RESEARCH.
        </p>
        <p className="mb-3">By placing an order, you represent, warrant, and agree that:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            All products are purchased exclusively for qualified scientific research conducted in
            an appropriate laboratory setting
          </li>
          <li>
            Products will not be used for human consumption, self-administration, or administration
            to any animal outside of an approved research protocol
          </li>
          <li>
            Products are not intended to diagnose, treat, cure, or prevent any disease or medical
            condition
          </li>
          <li>
            Products have not been evaluated by the U.S. Food and Drug Administration (FDA) or any
            other regulatory agency for safety or efficacy in humans
          </li>
          <li>
            You understand the inherent risks of research compounds and will follow all applicable
            laboratory safety protocols
          </li>
          <li>
            You will store, handle, use, and dispose of all products in strict compliance with
            applicable federal, state, and local laws and regulations
          </li>
          <li>
            You hold all necessary licenses, permits, and institutional authorizations required
            for the research use of these compounds
          </li>
        </ul>
        <p className="mt-4 text-sm font-medium" style={{ color: "#ef4444" }}>
          Misuse of research compounds for human consumption or non-research purposes may violate
          federal and state law and is strictly prohibited. Nexphoria reserves the right to refuse
          or cancel any order at our sole discretion.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    number: "3",
    title: "Eligibility and Age Verification",
    content: (
      <>
        <p className="mb-3">
          To purchase from Nexphoria, you must meet <strong>all</strong> of the following
          eligibility requirements:
        </p>
        <ul className="ml-6 list-disc space-y-2 mb-4">
          <li>
            <strong>Age:</strong> You must be at least 21 years of age. By placing an order, you
            represent and certify under penalty of perjury that you are 21 years of age or older.
            We reserve the right to require age verification documentation at any time.
          </li>
          <li>
            <strong>Qualified Researcher:</strong> You must be a credentialed researcher, licensed
            professional, or authorized representative of a registered research institution,
            university, pharmaceutical company, or equivalent organization.
          </li>
          <li>
            <strong>Lawful Purpose:</strong> Your intended use must comply with all applicable
            federal, state, and local laws in your jurisdiction.
          </li>
          <li>
            <strong>Geographic Restriction:</strong> Products are sold and shipped only within the
            United States. You must be located in the United States to purchase. Nexphoria does not
            ship internationally at this time. If you are located outside the United States, you
            may not purchase from Nexphoria.
          </li>
        </ul>
        <p className="text-sm" style={{ color: "#ef4444" }}>
          Any person who does not meet these requirements is expressly prohibited from purchasing
          from Nexphoria. Misrepresentation of eligibility may result in order cancellation and
          legal action.
        </p>
      </>
    ),
  },
  {
    id: "no-medical-claims",
    number: "4",
    title: "No Medical Claims — FDA Disclaimer",
    content: (
      <>
        <p className="mb-3">
          <strong>
            These statements and products have not been evaluated by the Food and Drug Administration
            (FDA).
          </strong>{" "}
          Nexphoria products are not drugs, medicines, or pharmaceutical agents. They are not
          intended to diagnose, treat, cure, or prevent any disease, condition, or medical
          symptom.
        </p>
        <p className="mb-3">
          Nexphoria makes no claims regarding the safety, efficacy, or fitness of any compound for
          human use. All product descriptions, research references, and educational content on this
          Site are provided solely for informational and research reference purposes and do not
          constitute medical advice.
        </p>
        <p className="mb-3">
          Any clinical or scientific data referenced on this Site is drawn from third-party
          published research and is presented for educational purposes only. Nexphoria does not
          represent that such studies are applicable to human subjects or that any compound is safe
          or effective for human use.
        </p>
        <p className="text-sm font-medium" style={{ color: "#d4af37" }}>
          If you are experiencing a medical condition or seeking treatment, consult a licensed
          physician or healthcare professional. This Site is not a substitute for professional
          medical advice.
        </p>
      </>
    ),
  },
  {
    id: "jurisdictional-restrictions",
    number: "5",
    title: "Jurisdictional Restrictions and Compliance",
    content: (
      <>
        <p className="mb-3">
          <strong>United States Only.</strong> Nexphoria sells and ships exclusively within the
          United States. Orders from outside the U.S. will be rejected. Attempting to circumvent
          this restriction through the use of freight forwarding services, U.S.-based addresses for
          international delivery, or other means is a violation of these Terms.
        </p>
        <p className="mb-3">
          The legal status of research peptides and research compounds varies significantly by
          state, locality, and jurisdiction. <strong>You, the Purchaser, are solely responsible
          for determining whether the purchase, possession, and use of any Nexphoria product is
          lawful in your jurisdiction.</strong> Nexphoria makes no representations or warranties
          regarding the legal status of any compound in any specific state or locality.
        </p>
        <p className="mb-3">
          Some compounds may be regulated, restricted, or classified as controlled substances in
          certain jurisdictions. It is your responsibility to:
        </p>
        <ul className="ml-6 list-disc space-y-2 mb-3">
          <li>Verify legality in your specific state and locality before purchasing</li>
          <li>
            Obtain all required permits, licenses, and regulatory approvals before possession or
            use
          </li>
          <li>
            Comply with all applicable DEA, FDA, state pharmacy board, and institutional review
            board requirements
          </li>
          <li>Comply with all applicable OSHA, EPA, and laboratory safety regulations</li>
          <li>Dispose of compounds in accordance with applicable hazardous waste regulations</li>
        </ul>
        <p className="text-sm" style={{ color: "#ef4444" }}>
          Nexphoria reserves the right to refuse any order from states or localities where we
          believe the sale may be unlawful or where compliance cannot be reasonably verified.
        </p>
      </>
    ),
  },
  {
    id: "orders-payment",
    number: "6",
    title: "Orders, Payment, and Pricing",
    content: (
      <>
        <p className="mb-3">
          All orders are subject to acceptance by Nexphoria. We reserve the right to refuse,
          cancel, or limit any order for any reason, including but not limited to: product
          availability, suspected misuse, inability to verify researcher eligibility, suspected
          fraud, or compliance concerns.
        </p>
        <p className="mb-3">
          <strong>Pricing:</strong> All prices are listed in U.S. Dollars (USD) and are subject to
          change without notice. The price charged will be the price in effect at the time of order
          placement.
        </p>
        <p className="mb-3">
          <strong>Payment Processing:</strong> Payment is processed securely through Stripe. By
          providing payment information, you authorize Nexphoria to charge the full order amount.
          Nexphoria does not store credit card information on our servers.
        </p>
        <p className="mb-3">
          <strong>Subscriptions:</strong> Subscription orders (3-Month Research Cycle and 6-Month
          Research Cycle) are billed on a recurring monthly basis until cancelled. You may cancel
          your subscription at any time by contacting us at{" "}
          <a href="mailto:research@nexphoria.com" style={{ color: "#d4af37" }}>
            research@nexphoria.com
          </a>{" "}
          at least 5 business days before the next billing date. Cancellations do not result in
          refunds for the current billing period.
        </p>
        <p>
          <strong>Order Confirmation:</strong> An order confirmation email will be sent to the
          email address provided at checkout. This confirmation does not guarantee fulfillment.
          Orders may be cancelled if eligibility cannot be verified or if products become
          unavailable.
        </p>
      </>
    ),
  },
  {
    id: "shipping-delivery",
    number: "7",
    title: "Shipping and Cold-Chain Delivery",
    content: (
      <>
        <p className="mb-3">
          Nexphoria ships all temperature-sensitive products using cold-chain packaging (insulated
          containers, ice packs, or dry ice as appropriate). We are committed to maintaining
          product integrity during transit.
        </p>
        <p className="mb-3">
          <strong>Risk of Loss:</strong> Title to and risk of loss for products passes to you upon
          delivery to the shipping carrier. Nexphoria is not responsible for delays, damage, or
          losses caused by shipping carriers, weather events, or circumstances beyond our control.
        </p>
        <p className="mb-3">
          <strong>Damaged Shipments:</strong> If products arrive visibly damaged, at improper
          temperature, or otherwise compromised, you must contact us within 48 hours of delivery
          with photographic evidence. We will assess on a case-by-case basis and may offer a
          replacement or store credit at our sole discretion.
        </p>
        <p>
          <strong>Delivery Address:</strong> You are responsible for providing an accurate delivery
          address. Nexphoria is not responsible for failed deliveries due to incorrect address
          information.
        </p>
      </>
    ),
  },
  {
    id: "refund-policy",
    number: "8",
    title: "Returns, Refunds, and Dispute Resolution",
    content: (
      <>
        <p className="mb-3">
          <strong>All Sales Final:</strong> Due to the temperature-sensitive and regulated nature
          of research compounds, all sales are final. Products cannot be returned once shipped.
          This policy exists to maintain chain-of-custody integrity and product quality assurance.
        </p>
        <p className="mb-3">
          <strong>Exceptions:</strong> We will consider replacements or store credit only in the
          following circumstances:
        </p>
        <ul className="ml-6 list-disc space-y-2 mb-4">
          <li>Products arrive visibly damaged, reported within 48 hours with photographic evidence</li>
          <li>Incorrect product sent (verified by Nexphoria internal records)</li>
          <li>
            Products fail to meet stated purity specifications (requires independent third-party
            HPLC analysis submitted to Nexphoria)
          </li>
        </ul>
        <p className="mb-3">
          <strong>Chargebacks and Disputes:</strong> If you dispute a charge with your bank or
          credit card issuer, Nexphoria reserves the right to provide transaction records,
          correspondence, and usage information to the card network or bank to contest the
          chargeback. Fraudulent chargebacks may result in account suspension and legal action.
        </p>
        <p>
          <strong>Contact for Order Issues:</strong> Contact{" "}
          <a href="mailto:research@nexphoria.com" style={{ color: "#d4af37" }}>
            research@nexphoria.com
          </a>{" "}
          with your order number and issue description. We respond within 1–2 business days.
        </p>
      </>
    ),
  },
  {
    id: "product-information",
    number: "9",
    title: "Product Information and Accuracy",
    content: (
      <p>
        Nexphoria strives to provide accurate product information, including purity specifications,
        molecular weight, CAS numbers, and certificates of analysis. However, we do not warrant that
        all product descriptions or other content on this Site is error-free, complete, current, or
        suitable for any particular research purpose. Certificates of Analysis are batch-specific;
        actual analytical results may differ slightly between batches. We recommend independently
        verifying specifications critical to your research prior to use.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    number: "10",
    title: "Intellectual Property",
    content: (
      <p>
        All content on this Site, including text, graphics, logos, product images, research
        articles, tools, and educational materials, is the property of Nexphoria and is protected
        by U.S. and international copyright, trademark, and intellectual property laws. You may not
        reproduce, distribute, modify, create derivative works, publicly display, republish,
        download, store, or transmit any of our content without our express prior written
        permission. Limited personal, non-commercial use is permitted for direct research reference
        purposes.
      </p>
    ),
  },
  {
    id: "disclaimer-warranties",
    number: "11",
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p className="mb-3">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXPHORIA PRODUCTS AND SERVICES ARE
          PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT ANY WARRANTIES OF ANY
          KIND, EXPRESS OR IMPLIED. NEXPHORIA EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT
          LIMITED TO:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Implied warranties of merchantability and fitness for a particular purpose</li>
          <li>Warranties that products will meet your research requirements</li>
          <li>Warranties regarding the accuracy or completeness of website content</li>
          <li>Warranties that the Site will be uninterrupted, error-free, or virus-free</li>
        </ul>
      </>
    ),
  },
  {
    id: "limitation-liability",
    number: "12",
    title: "Limitation of Liability",
    content: (
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, NEXPHORIA SHALL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM OR RELATED
        TO YOUR USE OF OUR PRODUCTS OR SITE, INCLUDING BUT NOT LIMITED TO: RESEARCH FAILURE,
        REGULATORY VIOLATIONS, PERSONAL INJURY, PROPERTY DAMAGE, OR LOSS OF PROFITS. IN NO EVENT
        SHALL NEXPHORIA&rsquo;S TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU FOR THE SPECIFIC
        ORDER GIVING RISE TO THE CLAIM IN THE THREE (3) MONTHS PRECEDING THE CLAIM.
      </p>
    ),
  },
  {
    id: "indemnification",
    number: "13",
    title: "Indemnification",
    content: (
      <p>
        You agree to indemnify, defend, and hold harmless Nexphoria and its officers, directors,
        employees, agents, and successors from and against any and all claims, liabilities, damages,
        losses, costs, and expenses (including reasonable attorneys&rsquo; fees) arising from: (a)
        your use or misuse of Nexphoria products; (b) your violation of these Terms; (c) your
        violation of any applicable law, regulation, or third-party right; (d) any misrepresentation
        you make regarding your eligibility, intended use, or identity.
      </p>
    ),
  },
  {
    id: "governing-law",
    number: "14",
    title: "Governing Law and Dispute Resolution",
    content: (
      <>
        <p className="mb-3">
          These Terms are governed by and construed in accordance with the laws of the United
          States and the State of Delaware, without regard to its conflict of law provisions.
        </p>
        <p className="mb-3">
          <strong>Mandatory Arbitration:</strong> Any dispute arising from or relating to these
          Terms or your use of our products shall be resolved by binding arbitration conducted by
          the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The
          arbitration shall be conducted in English, and the arbitrator&rsquo;s decision shall be
          final and binding.
        </p>
        <p className="mb-3">
          <strong>Class Action Waiver:</strong> You waive any right to participate in a class
          action lawsuit or class-wide arbitration against Nexphoria.
        </p>
        <p>
          <strong>Exception:</strong> Either party may seek emergency injunctive or other equitable
          relief from a court of competent jurisdiction to prevent irreparable harm pending
          arbitration.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "15",
    title: "Changes to Terms",
    content: (
      <p>
        Nexphoria reserves the right to modify these Terms of Service at any time at our sole
        discretion. Changes will be effective immediately upon posting to this page with an updated
        &ldquo;Last Updated&rdquo; date. Your continued use of the Site or purchase of products
        after any changes constitutes acceptance of the revised Terms. We encourage you to review
        these Terms periodically.
      </p>
    ),
  },
  {
    id: "contact",
    number: "16",
    title: "Contact Information",
    content: (
      <div className="space-y-1">
        <p>
          <strong>Legal Inquiries:</strong>{" "}
          <a href="mailto:legal@nexphoria.com" style={{ color: "#d4af37" }}>
            legal@nexphoria.com
          </a>
        </p>
        <p>
          <strong>Order Support:</strong>{" "}
          <a href="mailto:research@nexphoria.com" style={{ color: "#d4af37" }}>
            research@nexphoria.com
          </a>
        </p>
        <p>
          <strong>Privacy Inquiries:</strong>{" "}
          <a href="mailto:privacy@nexphoria.com" style={{ color: "#d4af37" }}>
            privacy@nexphoria.com
          </a>
        </p>
      </div>
    ),
  },
];

const TOC_ITEMS: TocItem[] = sections.map((s) => ({
  id: s.id,
  label: `${s.number}. ${s.title.length > 32 ? s.title.slice(0, 32) + "…" : s.title}`,
}));

export default function TermsPage() {
  const lastUpdated = "May 29, 2026";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      {/* RUO Banner — prominently placed at top */}
      <div
        className="border-b py-4 px-6"
        style={{
          backgroundColor: "#1a0a0a",
          borderColor: "#ef4444",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#ef4444" }} />
          <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>
            FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION. All Nexphoria products are sold
            exclusively for qualified scientific research. Not intended to diagnose, treat, cure, or
            prevent any disease. Not FDA-evaluated. Not for use in humans or animals outside an
            approved research protocol.
          </p>
        </div>
      </div>

      <div style={{ paddingTop: "80px" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          <Breadcrumb
            variant="dark"
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Terms of Service" },
            ]}
          />
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#6B6B6B" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6" style={{ color: "#d4af37" }} />
              <span className="text-xs tracking-widest uppercase font-medium" style={{ color: "#d4af37" }}>
                Legal
              </span>
            </div>
            <h1
              className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl"
              style={{ color: "#FDFCF8" }}
            >
              Terms of Service
            </h1>
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: "rgba(212,175,55,0.10)",
                border: "1px solid rgba(212,175,55,0.30)",
                color: "#d4af37",
              }}
            >
              Last Updated: {lastUpdated}
            </span>
          </div>

          {/* Two-column reading layout: sticky TOC + content */}
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            {/* Sticky TOC — desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky" style={{ top: "104px" }}>
                <LegalToc items={TOC_ITEMS} variant="dark" title="Sections" />
              </div>
            </aside>

            {/* Content column */}
            <div className="min-w-0" style={{ maxWidth: "48rem" }}>

          {/* Mobile quick nav — collapsible list shown only on small screens */}
          <details
            className="lg:hidden mb-8 rounded-lg border"
            style={{ backgroundColor: "#111111", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <summary
              className="cursor-pointer px-5 py-3 text-xs font-semibold tracking-wider uppercase"
              style={{ color: "#d4af37" }}
            >
              Jump to Section
            </summary>
            <div className="grid grid-cols-1 gap-1.5 px-5 pb-4">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-xs py-1 transition-colors hover:underline"
                  style={{ color: "#9CA3AF" }}
                >
                  {s.number}. {s.title.length > 38 ? s.title.slice(0, 38) + "…" : s.title}
                </a>
              ))}
            </div>
          </details>

          {/* Sections */}
          <div className="space-y-10 text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <div
                  className={`rounded-lg p-6 border ${section.highlight ? "border-yellow-600/30" : ""}`}
                  style={{
                    backgroundColor: section.highlight ? "#1a1400" : "#111111",
                    borderColor: section.highlight
                      ? "rgba(212,175,55,0.3)"
                      : "rgba(255,255,255,0.06)",
                  }}
                >
                  <h2
                    className="text-lg font-bold mb-4 flex items-center gap-2"
                    style={{ color: section.highlight ? "#d4af37" : "#FDFCF8" }}
                  >
                    {section.highlight && (
                      <Shield className="h-4 w-4 shrink-0" style={{ color: "#d4af37" }} />
                    )}
                    {section.number}. {section.title}
                  </h2>
                  <div style={{ color: "#9CA3AF" }}>{section.content}</div>
                </div>
              </section>
            ))}
          </div>

          {/* Footer links */}
          <div
            className="mt-12 pt-8 border-t flex flex-wrap gap-4 text-sm"
            style={{ borderColor: "rgba(255,255,255,0.08)", color: "#6B6B6B" }}
          >
            <Link href="/privacy" className="hover:underline" style={{ color: "#d4af37" }}>
              Privacy Policy
            </Link>
            <Link href="/legal/disclaimer" className="hover:underline" style={{ color: "#d4af37" }}>
              Research Use Disclaimer
            </Link>
            <Link href="/legal/shipping-returns" className="hover:underline" style={{ color: "#d4af37" }}>
              Shipping & Returns Policy
            </Link>
            <Link href="/faq" className="hover:underline" style={{ color: "#d4af37" }}>
              FAQ
            </Link>
            <Link href="/contact" className="hover:underline" style={{ color: "#d4af37" }}>
              Contact
            </Link>
          </div>
            </div>
            {/* end content column */}
          </div>
          {/* end reading grid */}
        </div>
      </div>
    </div>
  );
}
