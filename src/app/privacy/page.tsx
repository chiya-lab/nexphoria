import Link from "next/link";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import LegalToc, { type TocItem } from "@/components/LegalToc";

export const metadata: Metadata = {
  title: "Privacy Policy | Nexphoria Research Peptides",
  description:
    "Nexphoria Privacy Policy — how we collect, use, protect, and handle your data. CCPA and GDPR-aligned. Research peptide supplier for qualified researchers.",
};

const TOC_ITEMS: TocItem[] = [
  { id: "information-collected", label: "1. Information We Collect" },
  { id: "how-we-use", label: "2. How We Use Information" },
  { id: "information-sharing", label: "3. Sharing & Disclosure" },
  { id: "cookies", label: "4. Cookies & Tracking" },
  { id: "data-security", label: "5. Data Security" },
  { id: "data-retention", label: "6. Data Retention" },
  { id: "your-rights", label: "7. Your Privacy Rights" },
  { id: "childrens-privacy", label: "8. Children's Privacy" },
  { id: "international", label: "9. International Data" },
  { id: "third-party-links", label: "10. Third-Party Links" },
  { id: "changes", label: "11. Changes to Policy" },
  { id: "contact", label: "12. Contact Us" },
];

export default function PrivacyPage() {
  const lastUpdated = "May 29, 2026";
  const effectiveDate = "May 1, 2026";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      {/* RUO Banner */}
      <div
        className="border-b py-3 px-6"
        style={{ backgroundColor: "#0f1a0f", borderColor: "rgba(34,197,94,0.3)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Lock className="h-4 w-4 shrink-0" style={{ color: "#22c55e" }} />
          <p className="text-xs font-medium" style={{ color: "#86efac" }}>
            FOR RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION. Nexphoria products are sold
            exclusively for qualified scientific research purposes and are not FDA-evaluated for
            human use.
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
              { label: "Privacy Policy" },
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
              <Shield className="h-6 w-6" style={{ color: "#d4af37" }} />
              <span
                className="text-xs tracking-widest uppercase font-medium"
                style={{ color: "#d4af37" }}
              >
                Legal
              </span>
            </div>
            <h1
              className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl"
              style={{ color: "#FDFCF8" }}
            >
              Privacy Policy
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 font-medium"
                style={{
                  backgroundColor: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.30)",
                  color: "#d4af37",
                }}
              >
                Last Updated: {lastUpdated}
              </span>
              <span
                className="inline-flex items-center rounded-full px-3 py-1"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#6B6B6B",
                }}
              >
                Effective: {effectiveDate}
              </span>
            </div>
          </div>

          {/* Two-column reading layout: sticky TOC + content */}
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            {/* Sticky TOC — desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky" style={{ top: "104px" }}>
                <LegalToc items={TOC_ITEMS} variant="dark" />
              </div>
            </aside>

            {/* Content column */}
            <div className="min-w-0" style={{ maxWidth: "48rem" }}>
          {/* Intro */}
          <div
            className="rounded-lg p-5 border mb-10 text-sm"
            style={{
              backgroundColor: "#111111",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#9CA3AF",
            }}
          >
            <p>
              Nexphoria LLC (&ldquo;Nexphoria,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) is committed to protecting the privacy of our customers and website
              visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard
              information when you visit nexphoria.com or purchase products from us. Please read
              this policy carefully. If you disagree with its terms, please discontinue use of our
              Site.
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>

            {/* Section 1 */}
            <section id="information-collected" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  1. Information We Collect
                </h2>
                <div className="space-y-4" style={{ color: "#9CA3AF" }}>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#FDFCF8" }}>
                      1.1 Information You Provide Directly
                    </h3>
                    <ul className="ml-5 list-disc space-y-1.5">
                      <li>Full name and contact information</li>
                      <li>Email address</li>
                      <li>Shipping and billing address</li>
                      <li>Phone number (if provided)</li>
                      <li>Research institution or organization affiliation</li>
                      <li>
                        Payment information (card data is processed securely through Stripe and is
                        never stored on Nexphoria servers)
                      </li>
                      <li>Communications with our support team</li>
                      <li>
                        Research interest information provided voluntarily (e.g., through the
                        Protocol Finder quiz)
                      </li>
                      <li>
                        Email address if you subscribe to research updates through our newsletter
                        form
                      </li>
                      <li>
                        Wholesale inquiry form data (name, institution, compounds of interest,
                        estimated monthly volume)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#FDFCF8" }}>
                      1.2 Information Collected Automatically
                    </h3>
                    <ul className="ml-5 list-disc space-y-1.5">
                      <li>IP address and approximate geographic location (country/region)</li>
                      <li>Browser type, version, and operating system</li>
                      <li>Pages visited, time on page, and click behavior</li>
                      <li>Referring website or URL</li>
                      <li>Device type and screen resolution</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      We use this data through Cloudflare (our CDN and hosting provider) standard
                      server-level analytics only. We do not currently use Google Analytics or
                      advertising tracking pixels.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "#FDFCF8" }}>
                      1.3 Information Stored Locally (Your Device)
                    </h3>
                    <p>
                      Some interactive research tools (Vial Inventory Tracker, Research Log,
                      Recently Viewed Products, Dosing Frequency Planner) store data exclusively in
                      your browser&rsquo;s localStorage. This data never leaves your device and
                      Nexphoria has no access to it.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="how-we-use" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  2. How We Use Your Information
                </h2>
                <p className="mb-3" style={{ color: "#9CA3AF" }}>
                  We use collected information for the following purposes:
                </p>
                <ul className="ml-5 list-disc space-y-1.5" style={{ color: "#9CA3AF" }}>
                  <li>Processing, fulfilling, and shipping your orders</li>
                  <li>Sending order confirmations, shipping notifications, and tracking updates</li>
                  <li>Verifying researcher eligibility and purchase compliance</li>
                  <li>Responding to inquiries and providing customer support</li>
                  <li>
                    Sending research updates and educational content (only if you have explicitly
                    opted in via our newsletter form)
                  </li>
                  <li>Processing wholesale and institutional inquiries</li>
                  <li>
                    Complying with legal obligations, including record-keeping requirements and law
                    enforcement requests
                  </li>
                  <li>Preventing fraud, unauthorized access, and prohibited purchases</li>
                  <li>
                    Improving Site functionality, content, and user experience based on aggregated
                    usage data
                  </li>
                  <li>Maintaining records required by applicable regulations</li>
                </ul>
                <p className="mt-3 text-xs" style={{ color: "#6B6B6B" }}>
                  We do not use your personal information for advertising, behavioral tracking, or
                  sale to third-party data brokers.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="information-sharing" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  3. Information Sharing and Disclosure
                </h2>
                <p className="mb-3" style={{ color: "#9CA3AF" }}>
                  <strong style={{ color: "#FDFCF8" }}>We do not sell, rent, or trade your
                  personal information to third parties.</strong> We may share information with:
                </p>
                <div className="space-y-3" style={{ color: "#9CA3AF" }}>
                  <div>
                    <strong style={{ color: "#FDFCF8" }}>Service Providers:</strong> Trusted
                    vendors who assist us in operating our Site and fulfilling orders, including:
                    <ul className="ml-5 list-disc space-y-1 mt-1 text-xs">
                      <li>Stripe (payment processing)</li>
                      <li>Cloudflare (hosting, CDN, and KV data storage)</li>
                      <li>Shipping carriers (UPS, FedEx, USPS) — limited to address and
                        order information required for delivery</li>
                      <li>n8n (automation workflows for order processing — self-hosted)</li>
                    </ul>
                    <p className="text-xs mt-1">
                      All service providers are bound by confidentiality obligations and may only
                      use your information as directed by Nexphoria.
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: "#FDFCF8" }}>Legal Requirements:</strong> We may
                    disclose information when required by applicable law, court order, subpoena, or
                    government regulation; when necessary to protect the rights, property, or safety
                    of Nexphoria, our customers, or others; or to prevent illegal activity.
                  </div>
                  <div>
                    <strong style={{ color: "#FDFCF8" }}>Business Transfers:</strong> In the event
                    of a merger, acquisition, or sale of assets, customer information may be
                    transferred as a business asset. We will notify you via email and/or Site notice
                    prior to such transfer.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="cookies" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  4. Cookies and Tracking Technologies
                </h2>
                <div className="space-y-3" style={{ color: "#9CA3AF" }}>
                  <p>
                    Our Site uses a minimal cookie footprint in keeping with our privacy-first
                    approach:
                  </p>
                  <ul className="ml-5 list-disc space-y-2">
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>Essential Cookies:</strong> Strictly
                      necessary for Site functionality (e.g., Cloudflare security cookies). These
                      cannot be disabled.
                    </li>
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>localStorage (Client-Side Only):</strong>{" "}
                      We use browser localStorage for interactive research tools. This data is stored
                      locally on your device and is not transmitted to our servers.
                    </li>
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>No Advertising Cookies:</strong> We do
                      not use advertising cookies, Facebook Pixel, Google Ads remarketing tags, or
                      similar behavioral tracking technologies.
                    </li>
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>No Third-Party Analytics:</strong> We
                      do not currently use Google Analytics or similar cross-site analytics
                      platforms.
                    </li>
                  </ul>
                  <p className="text-xs">
                    You can control cookies through your browser settings. Disabling essential
                    cookies may affect Site functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="data-security" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  5. Data Security
                </h2>
                <div className="space-y-2" style={{ color: "#9CA3AF" }}>
                  <p>
                    We implement appropriate technical and organizational security measures to protect
                    your personal information against unauthorized access, alteration, disclosure, or
                    destruction. These measures include:
                  </p>
                  <ul className="ml-5 list-disc space-y-1.5">
                    <li>TLS/SSL encryption for all data transmission (HTTPS)</li>
                    <li>Cloudflare DDoS protection and Web Application Firewall</li>
                    <li>
                      Payment card data processed exclusively through Stripe&rsquo;s PCI-DSS
                      compliant infrastructure — never stored on Nexphoria servers
                    </li>
                    <li>Access controls limiting internal access to customer data</li>
                    <li>Cloudflare KV encryption at rest for stored subscriber and order data</li>
                  </ul>
                  <p className="text-xs mt-2">
                    However, no method of electronic transmission or storage is 100% secure. While we
                    strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="data-retention" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  6. Data Retention
                </h2>
                <div className="space-y-2" style={{ color: "#9CA3AF" }}>
                  <p>We retain your personal information as follows:</p>
                  <ul className="ml-5 list-disc space-y-1.5">
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>Order records:</strong> Retained for a
                      minimum of 7 years to comply with applicable accounting and tax regulations
                    </li>
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>Email subscriber data:</strong> Retained
                      until you unsubscribe. To unsubscribe, email{" "}
                      <a href="mailto:privacy@nexphoria.com" style={{ color: "#d4af37" }}>
                        privacy@nexphoria.com
                      </a>
                    </li>
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>Support communications:</strong> Retained
                      for 2 years from last interaction
                    </li>
                    <li>
                      <strong style={{ color: "#FDFCF8" }}>Wholesale inquiry data:</strong> Retained
                      for 1 year unless an ongoing business relationship exists
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="your-rights" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  7. Your Privacy Rights
                </h2>
                <div className="space-y-3" style={{ color: "#9CA3AF" }}>
                  <p>
                    Depending on your jurisdiction, you may have the following rights regarding your
                    personal information:
                  </p>
                  <div>
                    <strong style={{ color: "#FDFCF8" }}>California Residents (CCPA/CPRA):</strong>
                    <ul className="ml-5 list-disc space-y-1 mt-1">
                      <li>Right to know what personal information we collect and how it is used</li>
                      <li>Right to request deletion of your personal information</li>
                      <li>Right to opt-out of sale of personal information (we do not sell data)</li>
                      <li>Right to non-discrimination for exercising your rights</li>
                      <li>Right to correct inaccurate personal information</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: "#FDFCF8" }}>General Rights (all users):</strong>
                    <ul className="ml-5 list-disc space-y-1 mt-1">
                      <li>Access the personal information we hold about you</li>
                      <li>Request correction of inaccurate information</li>
                      <li>Request deletion of your data (subject to legal retention requirements)</li>
                      <li>Withdraw consent for marketing communications at any time</li>
                      <li>Request restriction of certain data processing</li>
                    </ul>
                  </div>
                  <p className="text-sm">
                    To exercise any of these rights, contact us at{" "}
                    <a href="mailto:privacy@nexphoria.com" style={{ color: "#d4af37" }}>
                      privacy@nexphoria.com
                    </a>
                    . We will respond within 30 days. Identity verification may be required.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="childrens-privacy" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  8. Children&rsquo;s Privacy
                </h2>
                <p style={{ color: "#9CA3AF" }}>
                  Our Site and products are not directed to individuals under the age of 21. We do
                  not knowingly collect personal information from anyone under 21 years of age. If we
                  become aware that we have inadvertently collected information from a person under
                  21, we will delete such information promptly. If you believe we have collected
                  information from a minor, please contact us at{" "}
                  <a href="mailto:privacy@nexphoria.com" style={{ color: "#d4af37" }}>
                    privacy@nexphoria.com
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="international" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  9. Geographic Scope and International Data
                </h2>
                <div style={{ color: "#9CA3AF" }}>
                  <p className="mb-2">
                    Nexphoria operates exclusively within the United States and does not accept
                    orders from outside the U.S. Our servers and data storage are located within the
                    United States (Cloudflare infrastructure).
                  </p>
                  <p>
                    If you are accessing our Site from outside the United States (for informational
                    purposes only), be aware that your information may be transferred to, stored, and
                    processed in the United States, which may have different data protection laws than
                    your country. By using our Site, you consent to such transfer.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="third-party-links" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  10. Third-Party Links
                </h2>
                <p style={{ color: "#9CA3AF" }}>
                  Our Site may contain links to third-party websites including published research
                  references, journal articles, and scientific databases. We are not responsible for
                  the privacy practices or content of those external sites. We encourage you to review
                  the privacy policies of any website you visit.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="changes" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  11. Changes to This Privacy Policy
                </h2>
                <p style={{ color: "#9CA3AF" }}>
                  We may update this Privacy Policy periodically to reflect changes in our practices,
                  technology, legal requirements, or other factors. Changes will be posted on this
                  page with an updated &ldquo;Last Updated&rdquo; date. For material changes, we will
                  provide more prominent notice, such as an email notification to registered customers.
                  Your continued use of our Site after changes are posted constitutes acceptance of
                  the revised Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section id="contact" className="scroll-mt-24">
              <div
                className="rounded-lg p-6 border"
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: "#FDFCF8" }}>
                  12. Contact Us
                </h2>
                <div className="space-y-2" style={{ color: "#9CA3AF" }}>
                  <p>If you have questions, concerns, or requests regarding this Privacy Policy:</p>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <p>
                      <strong style={{ color: "#FDFCF8" }}>Privacy Inquiries:</strong>{" "}
                      <a href="mailto:privacy@nexphoria.com" style={{ color: "#d4af37" }}>
                        privacy@nexphoria.com
                      </a>
                    </p>
                    <p>
                      <strong style={{ color: "#FDFCF8" }}>General Inquiries:</strong>{" "}
                      <a href="mailto:research@nexphoria.com" style={{ color: "#d4af37" }}>
                        research@nexphoria.com
                      </a>
                    </p>
                    <p>
                      <strong style={{ color: "#FDFCF8" }}>Legal:</strong>{" "}
                      <a href="mailto:legal@nexphoria.com" style={{ color: "#d4af37" }}>
                        legal@nexphoria.com
                      </a>
                    </p>
                  </div>
                  <p className="text-xs mt-3">
                    We aim to respond to all privacy inquiries within 30 days.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer links */}
          <div
            className="mt-12 pt-8 border-t flex flex-wrap gap-4 text-sm"
            style={{ borderColor: "rgba(255,255,255,0.08)", color: "#6B6B6B" }}
          >
            <Link href="/terms" className="hover:underline" style={{ color: "#d4af37" }}>
              Terms of Service
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
