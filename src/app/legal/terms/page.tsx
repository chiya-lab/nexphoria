import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import LegalToc, { type TocItem } from "@/components/LegalToc";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Nexphoria Terms of Use — conditions governing access to our website and purchase of research compounds.",
};

const sections = [
  {
    title: "Eligibility",
    content:
      "You must be at least 18 years of age and a qualified researcher, licensed professional, or authorized representative of a credentialed institution to purchase from Nexphoria. By purchasing, you represent that you meet these requirements.",
  },
  {
    title: "Research Use Only",
    content:
      "All Nexphoria products are sold for qualified scientific research purposes only. You may not purchase, possess, or use Nexphoria products for human or animal consumption, therapeutic use, diagnostic use, or any purpose other than legitimate scientific research. Misuse of research compounds may be illegal and is strictly prohibited.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content on this Site, including text, graphics, logos, and images, is the property of Nexphoria and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
  },
  {
    title: "Orders and Payment",
    content:
      "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Prices are subject to change without notice. Payment is due at time of order.",
  },
  {
    title: "Disclaimer of Warranties",
    content:
      "Nexphoria products are provided \"as is\" for research purposes. We make no warranties, express or implied, regarding fitness for any particular purpose beyond the stated research use. Research compounds carry inherent risks; appropriate safety protocols must be followed at all times.",
  },
  {
    title: "Limitation of Liability",
    content:
      "To the fullest extent permitted by law, Nexphoria shall not be liable for any indirect, incidental, consequential, or punitive damages arising from use of our products or website. Our total liability shall not exceed the amount paid for the specific order giving rise to the claim.",
  },
  {
    title: "Indemnification",
    content:
      "You agree to indemnify, defend, and hold harmless Nexphoria and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our products or violation of these Terms.",
  },
  {
    title: "Governing Law",
    content:
      "These Terms are governed by the laws of the United States and the state in which Nexphoria is incorporated. Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.",
  },
  {
    title: "Changes to Terms",
    content:
      "We may modify these Terms at any time. Continued use of the Site or purchase of products after changes are posted constitutes acceptance of the revised Terms.",
  },
  {
    title: "Contact",
    content: "Legal inquiries: legal@nexphoria.com",
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

export default function TermsPage() {
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
            { label: "Terms of Use" },
          ]}
        />
        <div className="mb-12">
          <span className="eyebrow mb-5 block">Legal</span>
          <h1
            className="font-medium leading-tight tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#1A1A1A" }}
          >
            Terms of Use
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
              By accessing or using nexphoria.com (&ldquo;Site&rdquo;) or purchasing products from
              Nexphoria, you agree to be bound by these Terms of Use. If you do not agree, do not use
              this Site or purchase our products.
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
