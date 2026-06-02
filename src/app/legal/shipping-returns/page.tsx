import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import LegalToc, { type TocItem } from "@/components/LegalToc";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy",
  description: "Nexphoria shipping, handling, and returns policy for research compound orders.",
};

const sections = [
  {
    title: "Shipping Overview",
    content:
      "Nexphoria ships within the continental United States only. All orders are shipped with proper cold-chain handling for temperature-sensitive compounds. Orders are processed within 1–3 business days of receipt and verification.",
  },
  {
    title: "Shipping Methods",
    content:
      "Standard shipping (5–7 business days) is available for stable compounds. Expedited (2-day) and overnight shipping are available for temperature-sensitive compounds requiring cold-chain handling. Shipping method and carrier selection are at Nexphoria's discretion to ensure compound integrity.",
  },
  {
    title: "Packaging and Cold Chain",
    content:
      "Temperature-sensitive compounds are shipped with insulated packaging and appropriate cold packs. Cold-chain integrity during transit is our responsibility through delivery. Upon receipt, it is the buyer's responsibility to follow storage protocols as specified in the product's MSDS.",
  },
  {
    title: "Order Tracking",
    content:
      "Tracking information is provided via email upon shipment. Nexphoria is not responsible for delays caused by carrier, weather, or events outside our control.",
  },
  {
    title: "Signature Requirement",
    content:
      "Adult signature (18+) may be required upon delivery. If delivery is missed, the carrier will hold the package per their policy. Nexphoria is not responsible for compounds held or damaged due to missed delivery.",
  },
  {
    title: "Returns Policy",
    content:
      "Due to the nature of research compounds and regulatory considerations, all sales are final. Returns are not accepted except in the case of: (1) demonstrable product quality issues supported by independent analytical testing, or (2) order fulfillment errors (wrong compound shipped). Return requests must be submitted within 5 business days of receipt.",
  },
  {
    title: "Quality Disputes",
    content:
      "If you believe a compound does not meet the specifications stated in its Certificate of Analysis, contact us at orders@nexphoria.com within 5 business days of receipt with lot number and documentation of the discrepancy. We will work with you to resolve legitimate quality issues.",
  },
  {
    title: "Restricted Areas",
    content:
      "We do not ship to P.O. boxes, international addresses, or addresses where the purchase or possession of research compounds may be restricted. It is the buyer's responsibility to verify local regulations.",
  },
  {
    title: "Contact",
    content: "Shipping and order inquiries: orders@nexphoria.com",
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

export default function ShippingReturnsPage() {
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
            { label: "Shipping & Returns" },
          ]}
        />
        <div className="mb-12">
          <span className="eyebrow mb-5 block">Legal</span>
          <h1
            className="font-medium leading-tight tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#1A1A1A" }}
          >
            Shipping &amp; Returns
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
