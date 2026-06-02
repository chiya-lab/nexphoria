import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import RUOBanner from "@/components/RUOBanner";

export const metadata: Metadata = {
  title: "Research Compounds, Not Clinical Services | Nexphoria",
  description:
    "Nexphoria supplies research-grade peptide compounds for qualified in vitro and animal-model research only. We do not provide clinical services, prescriptions, or conduct human studies.",
  alternates: {
    canonical: "https://nexphoria.com/clinical",
  },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Research Compounds, Not Clinical Services | Nexphoria",
    description:
      "Nexphoria supplies research-grade peptide compounds for qualified research use only. We do not provide clinical services or conduct human studies.",
    url: "https://nexphoria.com/clinical",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const clarifications = [
  {
    heading: "What Nexphoria provides",
    body: "Lyophilized, research-grade peptide compounds for qualified in vitro and animal-model research. Every lot ships with a lot-specific Certificate of Analysis documenting independent HPLC purity and ESI-MS identity verification.",
  },
  {
    heading: "What Nexphoria does not provide",
    body: "We do not offer clinical programs, telehealth consultations, prescriptions, or compounded medications. We do not conduct human studies, and nothing on this site is medical advice or guidance for use in or on the human body.",
  },
  {
    heading: "Who our materials are for",
    body: "Credentialed researchers, licensed professionals, and qualified institutions conducting laboratory research. All compounds are supplied strictly for research use only (RUO).",
  },
];

export default function ClinicalPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F0F0E" }}>
      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b" style={{ borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Research Compounds Only" }]}
            variant="dark"
            className="mb-6"
          />
          <span className="eyebrow mb-5 block" style={{ color: "#B8A44C" }}>
            Compliance Notice
          </span>
          <h1
            className="font-bold tracking-tight mb-6 max-w-3xl leading-tight"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.1,
              color: "#FDFCF8",
            }}
          >
            Research Compounds.{" "}
            <em className="italic" style={{ color: "#B8A44C" }}>
              Not Clinical Services.
            </em>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed text-secondary">
            Nexphoria manufactures and supplies research-grade peptide compounds for qualified
            in vitro and animal-model research. We do not provide clinical services, write
            prescriptions, or conduct human studies.
          </p>
        </div>
      </section>

      {/* Clarifications */}
      <section className="py-24" style={{ backgroundColor: "#1A1A18" }}>
        <div className="container-nex">
          <div className="grid md:grid-cols-3 gap-px border" style={{ backgroundColor: "#2A2A28", borderColor: "#2A2A28" }}>
            {clarifications.map((c) => (
              <div key={c.heading} className="p-8" style={{ backgroundColor: "#1C1C1A" }}>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: "Georgia, serif", color: "#FDFCF8" }}
                >
                  {c.heading}
                </h2>
                <p className="text-sm leading-relaxed text-secondary">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to go next */}
      <section className="py-24 border-t" style={{ backgroundColor: "#0F0F0E", borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow mb-4 block" style={{ color: "#B8A44C" }}>
              What You May Be Looking For
            </span>
            <h2
              className="font-bold tracking-tight"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                color: "#FDFCF8",
              }}
            >
              Explore Our Research Resources
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href="/science"
              className="block p-8 border rounded-2xl transition-colors"
              style={{ borderColor: "#2A2A28", backgroundColor: "#1C1C1A" }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#FDFCF8" }}>
                Testing &amp; Methodology
              </h3>
              <p className="text-sm leading-relaxed text-secondary mb-4">
                How we verify every compound — independent HPLC / ESI-MS, what a COA shows, and how
                to read one.
              </p>
              <span className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: "#B8A44C" }}>
                View the science &rarr;
              </span>
            </Link>

            <Link
              href="/research"
              className="block p-8 border rounded-2xl transition-colors"
              style={{ borderColor: "#2A2A28", backgroundColor: "#1C1C1A" }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#FDFCF8" }}>
                Research Methods
              </h3>
              <p className="text-sm leading-relaxed text-secondary mb-4">
                Study-design considerations for in vitro and animal-model work, and how to cite
                Nexphoria materials in research.
              </p>
              <span className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: "#B8A44C" }}>
                Research framing &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: "#1A1A18" }}>
        <div className="container-nex flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="font-bold tracking-tight mb-2"
              style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#FDFCF8" }}
            >
              Browse the research catalog
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Every compound ships with a lot-specific COA and full technical documentation.
            </p>
          </div>
          <Link href="/products" className="btn-outline-gold whitespace-nowrap">
            Browse Compounds &rarr;
          </Link>
        </div>
      </section>

      {/* RUO */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <RUOBanner variant="card" tone="dark" />
        </div>
      </section>
    </div>
  );
}
