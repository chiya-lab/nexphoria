import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Shipping & Cold-Chain | Nexphoria Research Peptides",
  description:
    "How Nexphoria ships research peptides: cold-chain packaging, overnight delivery, processing times, order tracking, and returns for damaged shipments.",
  openGraph: {
    title: "Shipping & Cold-Chain | Nexphoria",
    description:
      "Learn how we protect compound integrity from our lab to your door. Dry-ice cold packs, overnight insulated shipping, and full COA documentation with every order.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Cold-Chain | Nexphoria",
    description:
      "Cold-chain shipping for research peptides. Overnight delivery, dry-ice packs, tamper-evident seals.",
    images: ["/og-image.jpg"],
  },
};

const steps = [
  {
    number: "01",
    title: "Order Confirmed",
    body: "Once payment is cleared, your order enters our fulfillment queue. You'll receive an email confirmation with your order number within minutes.",
  },
  {
    number: "02",
    title: "Lab Preparation",
    body: "A technician pulls your compounds from cold storage, verifies the lot number against your COA, and inspects the vial seal before packaging.",
  },
  {
    number: "03",
    title: "Cold-Pack Assembly",
    body: "Each vial is wrapped in protective foam and nested inside our insulated shipping box with a gel-ice or dry-ice cold pack sized for your transit time.",
  },
  {
    number: "04",
    title: "Tamper-Evident Sealing",
    body: "The outer box is sealed with tamper-evident security tape. If the seal is broken on arrival, do not accept the shipment.",
  },
  {
    number: "05",
    title: "Carrier Pickup",
    body: "Packages are handed to the carrier with a printed packing slip. Tracking information is emailed to you as soon as the label is scanned.",
  },
  {
    number: "06",
    title: "Delivered to Your Door",
    body: "Most domestic orders arrive within 1–2 business days of shipment. Cold-pack integrity is maintained for 48–72 hours from pack time.",
  },
];

const shippingOptions = [
  {
    method: "Standard (Ground)",
    transit: "3–5 business days",
    coldPack: "Gel-ice pack (48 h rated)",
    notes: "Suitable for cooler months and northern climates. Not recommended for summer heat.",
    badge: null,
  },
  {
    method: "Priority Overnight",
    transit: "Next business day",
    coldPack: "Dry ice (72 h rated)",
    notes: "Our recommended method for all peptide orders. Maintains temperature throughout transit.",
    badge: "Recommended",
  },
  {
    method: "2-Day Express",
    transit: "2 business days",
    coldPack: "High-density gel-ice pack (60 h rated)",
    notes: "Good balance of speed and cost. Add-on insulated liner included.",
    badge: null,
  },
];

const faqItems = [
  {
    q: "What temperature do you ship at?",
    a: "Lyophilized peptides are stable at room temperature for short periods, but we ship with cold packs as a precaution. Our target internal box temperature is 2–8°C for gel-ice shipments and ≤ −20°C surface contact for dry-ice overnight orders. This ensures maximum stability regardless of ambient conditions.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship within the contiguous United States only. We do not ship internationally, to Alaska, Hawaii, or US territories at this time. All orders require a valid US shipping address for a licensed research institution or verified professional address.",
  },
  {
    q: "How long does order processing take?",
    a: "Orders placed before 12:00 PM ET on business days (Monday–Friday, excluding US federal holidays) typically ship same day. Orders placed after 12:00 PM ET ship the next business day. We do not ship on weekends or federal holidays.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Tracking information is emailed to the address on file as soon as the carrier scans your label. You can also look up your order at nexphoria.com/account/orders using your email address and Stripe session ID.",
  },
  {
    q: "What if my order arrives warm or damaged?",
    a: "Document the condition immediately with photos. Email support at research@nexphoria.com within 24 hours of delivery with your order number and images. We will assess and, if the cold-chain integrity was clearly compromised in transit, issue a replacement at no charge. We do not offer refunds on compounds — only replacements for verified transit damage.",
  },
  {
    q: "Do you require a signature on delivery?",
    a: "Priority Overnight orders require an adult signature by default to ensure compounds are received promptly. If no one is available, the carrier will leave a pickup notice. We strongly recommend shipping to an address where someone will be present during delivery hours.",
  },
  {
    q: "How should I store compounds immediately on arrival?",
    a: "Transfer lyophilized vials to −20°C freezer storage as soon as possible after arrival. Do not leave compounds in a warm car or office for extended periods. Reconstituted vials should be refrigerated at 2–8°C and used within the stability window noted on the product page.",
  },
  {
    q: "What is your return policy?",
    a: "We do not accept returns on research compounds. All sales are final. We will replace orders confirmed lost in transit (after carrier investigation) or orders with verified cold-chain compromise. If you received the wrong compound, contact us within 48 hours with lot documentation.",
  },
];

export default function ShippingPage() {
  return (
    <div style={{ backgroundColor: "#F5F2EB", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1A1A18", paddingTop: "80px" }}
      >
        <div className="container-nex py-16 md:py-20">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shipping" },
            ]}
            variant="dark"
          />
          <div className="mt-8 max-w-3xl">
            <p
              className="eyebrow mb-4"
              style={{ color: "#B8A44C" }}
            >
              Cold-Chain Logistics
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
              style={{ color: "#F5F2EB" }}
            >
              Shipping &{" "}
              <span style={{ color: "#d4af37" }}>Cold-Chain</span>
            </h1>
            <p className="body-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
              Compound integrity doesn&apos;t end at synthesis. Our packaging,
              cold-pack selection, and carrier relationships are designed to
              deliver your research compounds in the same condition they left
              our freezer.
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10">
            {[
              { stat: "48–72h", label: "Cold-pack duration" },
              { stat: "1–2 days", label: "Avg. transit time (overnight)" },
              { stat: "12 PM ET", label: "Same-day cutoff" },
              { stat: "100%", label: "Tamper-evident sealed" },
            ].map((item) => (
              <div key={item.stat}>
                <div
                  className="text-2xl font-bold tracking-tight mb-1"
                  style={{ color: "#d4af37" }}
                >
                  {item.stat}
                </div>
                <div
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it ships: step-by-step */}
      <section className="container-nex py-20">
        <div className="max-w-3xl mx-auto mb-14">
          <p className="eyebrow mb-3" style={{ color: "#8A9A6A" }}>
            The Process
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: "#1A1A18" }}
          >
            From Freezer to Your Door
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-7 rounded-xl border border-black/8"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div
                className="text-4xl font-bold tracking-tight mb-4"
                style={{ color: "rgba(0,0,0,0.08)" }}
              >
                {step.number}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "#1A1A18" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#5A5A52" }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shipping options table */}
      <section style={{ backgroundColor: "#EDEAE0" }}>
        <div className="container-nex py-20">
          <div className="max-w-3xl mb-12">
            <p className="eyebrow mb-3" style={{ color: "#8A9A6A" }}>
              Delivery Methods
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: "#1A1A18" }}
            >
              Shipping Options
            </h2>
            <p className="body-base mt-4" style={{ color: "#5A5A52" }}>
              All methods include cold-pack packaging. Cold-pack type is
              selected based on rated transit time and current ambient
              temperature at origin.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr
                  className="text-left border-b"
                  style={{ borderColor: "rgba(0,0,0,0.1)" }}
                >
                  {["Method", "Transit Time", "Cold Pack", "Notes"].map(
                    (h) => (
                      <th
                        key={h}
                        className="pb-3 pr-6 text-xs uppercase tracking-widest font-semibold"
                        style={{ color: "#8A9A6A" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {shippingOptions.map((opt) => (
                  <tr
                    key={opt.method}
                    className="border-b"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <td className="py-5 pr-6">
                      <span
                        className="font-semibold"
                        style={{ color: "#1A1A18" }}
                      >
                        {opt.method}
                      </span>
                      {opt.badge && (
                        <span
                          className="ml-2 px-2 py-0.5 text-[10px] rounded font-semibold uppercase tracking-wider"
                          style={{
                            backgroundColor: "rgba(212,175,55,0.15)",
                            color: "#9A7B10",
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </td>
                    <td
                      className="py-5 pr-6"
                      style={{ color: "#3A3A32" }}
                    >
                      {opt.transit}
                    </td>
                    <td
                      className="py-5 pr-6"
                      style={{ color: "#3A3A32" }}
                    >
                      {opt.coldPack}
                    </td>
                    <td
                      className="py-5 text-xs leading-relaxed"
                      style={{ color: "#5A5A52" }}
                    >
                      {opt.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs mt-6" style={{ color: "#8A8A80" }}>
            Shipping rates are calculated at checkout based on order weight,
            destination ZIP code, and selected method. Free shipping is available
            on qualifying orders over $299.
          </p>
        </div>
      </section>

      {/* Cold-chain detail section */}
      <section className="container-nex py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          <div>
            <p className="eyebrow mb-3" style={{ color: "#8A9A6A" }}>
              Packaging
            </p>
            <h2
              className="text-3xl font-bold tracking-tight mb-6"
              style={{ color: "#1A1A18" }}
            >
              What&apos;s Inside Every Box
            </h2>
            <ul className="space-y-4">
              {[
                {
                  title: "Insulated Liner",
                  desc: "EPS foam or foil-bubble insulation rated to maintain internal temperature 48–72 hours from pack time, depending on external ambient conditions.",
                },
                {
                  title: "Gel-Ice or Dry-Ice Cold Pack",
                  desc: "Overnight shipments use dry-ice packs. Ground shipments use pharmaceutical-grade gel packs. Pack size is matched to box volume and expected transit time.",
                },
                {
                  title: "Protective Foam Wrapping",
                  desc: "Each vial is individually wrapped in closed-cell foam to absorb shock during transit and prevent direct ice contact on reconstituted samples.",
                },
                {
                  title: "Packing Slip with Lot Numbers",
                  desc: "A printed packing slip lists every compound, lot number, and vial count for easy cross-reference with your COA documents.",
                },
                {
                  title: "Tamper-Evident Security Seal",
                  desc: "The outer box is sealed with a tamper-evident label. A broken seal is a clear signal to document the condition and contact us before use.",
                },
                {
                  title: "Research Use Only Notice",
                  desc: "Every package includes a prominent RUO notice confirming the contents are for qualified laboratory research use only.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: "#B8A44C" }}
                  />
                  <div>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "#1A1A18" }}
                    >
                      {item.title}
                    </span>
                    <p
                      className="text-sm leading-relaxed mt-0.5"
                      style={{ color: "#5A5A52" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div
              className="p-8 rounded-xl border border-black/8"
              style={{ backgroundColor: "#1A1A18" }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: "#F5F2EB" }}
              >
                Processing Times
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Order cutoff (same-day)",
                    value: "12:00 PM ET",
                  },
                  { label: "Business days", value: "Mon–Fri" },
                  { label: "Holidays observed", value: "US Federal" },
                  { label: "Avg. fulfillment time", value: "4–6 hours" },
                  { label: "Weekend processing", value: "Not available" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-2 border-b border-white/10"
                  >
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {row.label}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#B8A44C" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <h3
                className="text-base font-semibold mb-3"
                style={{ color: "#8A6B00" }}
              >
                Why Cold-Chain Matters
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#5A4A10" }}>
                Peptide bonds are susceptible to hydrolysis and oxidation at
                elevated temperatures. A single 24-hour exposure above 25°C can
                reduce purity by 1–3% in sensitive compounds. Our cold-chain
                protocol ensures the compound you receive matches the purity
                on your COA — not something lower due to a warm truck or
                postal delay.
              </p>
              <Link
                href="/blog/cold-chain-shipping"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "#9A7B10" }}
              >
                Read the cold-chain research article
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            <div
              className="p-8 rounded-xl border border-black/8"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <h3
                className="text-base font-semibold mb-3"
                style={{ color: "#1A1A18" }}
              >
                On Arrival Checklist
              </h3>
              <ol className="space-y-2">
                {[
                  "Inspect tamper-evident seal before opening",
                  "Confirm internal box temperature (should feel cool/cold)",
                  "Cross-reference packing slip lot numbers with COA documents",
                  "Transfer lyophilized vials to −20°C storage immediately",
                  "Document arrival condition with photos if any concerns",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{ color: "#3A3A32" }}>
                    <span
                      className="font-bold text-xs mt-0.5 shrink-0"
                      style={{ color: "#B8A44C" }}
                    >
                      {i + 1}.
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: "#EDEAE0" }}>
        <div className="container-nex py-20">
          <div className="max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3" style={{ color: "#8A9A6A" }}>
              Shipping FAQ
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: "#1A1A18" }}
            >
              Common Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqItems.map((item) => (
              <div
                key={item.q}
                className="p-7 rounded-xl"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h3
                  className="font-semibold mb-3 text-sm"
                  style={{ color: "#1A1A18" }}
                >
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5A5A52" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Returns / damaged shipment */}
      <section className="container-nex py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="eyebrow mb-3" style={{ color: "#8A9A6A" }}>
              Problems & Returns
            </p>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: "#1A1A18" }}
            >
              Damaged or Lost Orders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Damaged in Transit",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z" />
                  </svg>
                ),
                steps: [
                  "Photograph the package, seal, and vials immediately",
                  "Email research@nexphoria.com within 24 hours of delivery",
                  "Include your order number and all photos",
                  "We'll assess and ship a replacement if damage is verified",
                ],
              },
              {
                title: "Lost in Transit",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75h.008v.008H12v-.008z" />
                  </svg>
                ),
                steps: [
                  "Check your tracking link for last-known location",
                  "Wait 24 hours past expected delivery (carriers sometimes scan late)",
                  "Contact us — we'll open a carrier trace",
                  "If confirmed lost, we reship at no additional charge",
                ],
              },
              {
                title: "Wrong Item",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" />
                  </svg>
                ),
                steps: [
                  "Verify compound name and lot number on your packing slip",
                  "Do not open or use any compound you believe is incorrect",
                  "Email us within 48 hours with your order number and lot #",
                  "We'll arrange a priority replacement and correct shipment",
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-7 rounded-xl border border-black/8"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(164,176,138,0.15)", color: "#5A7A3A" }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-semibold mb-4"
                  style={{ color: "#1A1A18" }}
                >
                  {card.title}
                </h3>
                <ol className="space-y-2">
                  {card.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: "#5A5A52" }}>
                      <span
                        className="text-xs font-semibold shrink-0 mt-0.5"
                        style={{ color: "#B8A44C" }}
                      >
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div
            className="mt-10 p-6 rounded-xl text-sm"
            style={{
              backgroundColor: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "#5A5A52",
            }}
          >
            <strong style={{ color: "#3A3A32" }}>Return Policy:</strong> All
            sales are final. We do not accept returns on research compounds.
            Replacements are issued for verified transit damage, confirmed lost
            shipments, and fulfillment errors. Compounds that have been opened,
            reconstituted, or used are not eligible for replacement or credit.
            Contact{" "}
            <a
              href="mailto:research@nexphoria.com"
              style={{ color: "#5A7A3A" }}
              className="underline"
            >
              research@nexphoria.com
            </a>{" "}
            within the time windows above.
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section
        style={{ backgroundColor: "#1A1A18" }}
        className="py-16"
      >
        <div className="container-nex flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight mb-2"
              style={{ color: "#F5F2EB" }}
            >
              Ready to Order?
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Browse the full catalog. Cold-chain shipping included on every order.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="px-6 py-3 rounded text-sm font-semibold transition-all"
              style={{ backgroundColor: "#B8A44C", color: "#1A1A18" }}
            >
              Browse Compounds
            </Link>
            <Link
              href="/faq"
              className="px-6 py-3 rounded text-sm font-semibold border transition-all"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
            >
              Read FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
