import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import LegalToc, { type TocItem } from "@/components/LegalToc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Nexphoria Privacy Policy — how we collect, use, and protect your data.",
};

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly, including: name and contact information, email address, institutional affiliation, order and transaction data, and communications with our team. We may also collect technical data such as IP address, browser type, and pages visited through standard server logging.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use collected information to: process and fulfill orders, verify researcher credentials and compliance, respond to inquiries, send order confirmations and shipping notifications, send research updates if you have opted in, comply with legal obligations, and prevent fraud and unauthorized use.",
  },
  {
    title: "Information Sharing",
    content:
      "We do not sell, rent, or trade your personal information to third parties. We may share information with trusted service providers who assist in operating our website and fulfilling orders, subject to confidentiality obligations. We may disclose information as required by law or to protect our legal rights.",
  },
  {
    title: "Data Security",
    content:
      "We implement reasonable technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage is fully secure.",
  },
  {
    title: "Data Retention",
    content:
      "We retain personal data for as long as necessary to fulfill the purposes described in this policy, including legal, accounting, and regulatory requirements. Order records are retained for a minimum of 7 years to comply with applicable laws.",
  },
  {
    title: "Your Rights",
    content:
      "Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact us at privacy@nexphoria.com. We will respond within 30 days.",
  },
  {
    title: "Cookies",
    content:
      "Our website may use essential cookies for functionality. We do not use advertising or tracking cookies. You can control cookie settings through your browser.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. Continued use of our website constitutes acceptance of the revised policy.",
  },
  {
    title: "Contact Us",
    content: "Privacy inquiries: privacy@nexphoria.com",
  },
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TOC_ITEMS: TocItem[] = sections.map((s) => ({
  id: slugify(s.title),
  label: s.title,
}));

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ backgroundColor: "#F9F9F9", color: "#1A1A1A" }} className="pt-36 pb-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Breadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Legal", href: "/legal/disclaimer" },
            { label: "Privacy Policy" },
          ]}
        />
        <div className="mb-12">
          <span className="eyebrow mb-5 block">Legal</span>
          <h1
            className="font-medium leading-tight tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#1A1A1A" }}
          >
            Privacy Policy
          </h1>
          <div className="mt-5">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: "rgba(184,164,76,0.12)",
                border: "1px solid rgba(184,164,76,0.35)",
                color: "#7A6B2A",
              }}
            >
              Last Updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Two-column reading layout */}
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky" style={{ top: "104px" }}>
              <LegalToc items={TOC_ITEMS} variant="light" />
            </div>
          </aside>

          <div className="min-w-0" style={{ maxWidth: "44rem" }}>
            <p className="mb-9 text-base" style={{ color: "#444", lineHeight: 1.75 }}>
              Nexphoria (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or place an order with us.
            </p>
            <div className="space-y-9" style={{ color: "#444" }}>
              {sections.map((section) => (
                <section
                  key={section.title}
                  id={slugify(section.title)}
                  className="scroll-mt-28"
                >
                  <h2 className="text-xl font-medium mb-3" style={{ color: "#1A1A1A" }}>
                    {section.title}
                  </h2>
                  <p className="text-sm" style={{ lineHeight: 1.75 }}>
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
