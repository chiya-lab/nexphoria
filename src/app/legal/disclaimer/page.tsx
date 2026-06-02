import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import LegalToc, { type TocItem } from "@/components/LegalToc";

export const metadata: Metadata = {
  title: "Research Use Disclaimer | Nexphoria",
  description:
    "Nexphoria compounds are for qualified research use only. Not for human consumption, diagnostic, or therapeutic use.",
  alternates: {
    canonical: "https://nexphoria.com/legal/disclaimer",
  },
  openGraph: {
    title: "Research Use Disclaimer | Nexphoria",
    description: "Nexphoria compounds are for qualified research use only. Not for human consumption, diagnostic, or therapeutic use.",
    url: "https://nexphoria.com/legal/disclaimer",
    siteName: "Nexphoria",
    type: "website",
  },
  robots: {
    index: true,
    follow: false,
  },
};

const sections = [
  {
    title: "Research Use Only",
    content:
      "Nexphoria compounds are sold exclusively for in vitro and in vivo laboratory research conducted by qualified researchers operating within the scope of applicable state and federal regulations. By purchasing from Nexphoria, the buyer represents and warrants that: (1) The buyer is a qualified researcher, licensed professional, or credentialed institution. (2) The compounds will be used solely for legitimate scientific research purposes. (3) The compounds will not be used for human or animal consumption. (4) The buyer holds all necessary licenses, permits, and authorizations required by applicable law. (5) The compounds will be stored, handled, and disposed of in accordance with applicable safety regulations.",
  },
  {
    title: "FDA Status",
    content:
      "These statements and products have not been evaluated by the Food and Drug Administration (FDA). Nexphoria products are not drugs and are not intended to diagnose, treat, cure, or prevent any disease or medical condition. Nexphoria does not make any medical claims regarding its compounds.",
  },
  {
    title: "Regulatory Compliance",
    content:
      "The buyer is solely responsible for compliance with all applicable federal, state, and local laws and regulations governing the purchase, possession, use, and disposal of research compounds. Laws and regulations vary by jurisdiction. Nexphoria makes no representations regarding the legal status of any compound in any specific jurisdiction. Nexphoria reserves the right to refuse any order that raises concerns about intended use or compliance with applicable law.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Nexphoria shall not be liable for any damages arising from the misuse, improper handling, or unauthorized use of its research compounds. The buyer assumes all risks associated with the purchase and use of Nexphoria products and agrees to indemnify and hold Nexphoria harmless from any claims arising from such use.",
  },
  {
    title: "Age Restriction",
    content:
      "You must be at least 18 years of age to purchase from Nexphoria. By placing an order, you confirm that you meet this age requirement and that all information provided is accurate and complete.",
  },
  {
    title: "Contact",
    content: "Questions regarding this disclaimer may be directed to legal@nexphoria.com.",
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

export default function DisclaimerPage() {
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
            { label: "Research Use Disclaimer" },
          ]}
        />
        <div className="mb-12">
          <span className="eyebrow mb-5 block">Legal</span>
          <h1
            className="font-medium leading-tight tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#1A1A1A" }}
          >
            Research Use
            <br />
            Disclaimer
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

        {/* Important Notice — RUO emphasis */}
        <div
          className="p-6 mb-12 rounded-lg"
          style={{
            backgroundColor: "#0F0F0E",
            color: "#F5F5F0",
            borderLeft: "4px solid #B8A44C",
          }}
        >
          <p
            className="text-label mb-3"
            style={{ color: "#B8A44C", letterSpacing: "0.2em" }}
          >
            Important Notice
          </p>
          <p className="leading-relaxed text-sm">
            All products and compounds offered by Nexphoria are intended strictly for qualified
            research purposes by licensed professionals in controlled laboratory settings. These
            products are{" "}
            <strong style={{ color: "#F5F5F0" }}>not intended for human or animal consumption</strong>,
            diagnostic use, therapeutic use, or any clinical application.
          </p>
        </div>

        {/* Two-column reading layout */}
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky" style={{ top: "104px" }}>
              <LegalToc items={TOC_ITEMS} variant="light" />
            </div>
          </aside>

          <div className="min-w-0" style={{ maxWidth: "44rem" }}>
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
