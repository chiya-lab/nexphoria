import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, ArrowLeftRight, Activity, Droplets } from "lucide-react";

export const metadata: Metadata = {
  title: "Researcher tools | Nexphoria",
  description:
    "Calculators and converters we use at the bench: reconstitution, dose conversion, plasma half-life timelines, and bacteriostatic water planning. Free, no signup.",
  openGraph: {
    title: "Researcher tools — Nexphoria",
    description:
      "Reconstitution calculator, dose converter, half-life timeline, and bac-water calculator. Free, no signup.",
    url: "https://nexphoria.com/tools",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const TOOLS = [
  {
    href: "/tools/reconstitution",
    Icon: FlaskConical,
    name: "Reconstitution calculator",
    description: "Vial mg + bac water + target dose to concentration, draw volume, and U-100 units.",
  },
  {
    href: "/tools/dose-converter",
    Icon: ArrowLeftRight,
    name: "Dose converter",
    description: "mcg/mg, IU/mg, mL to syringe units, and mg/kg body-weight dosing.",
  },
  {
    href: "/tools/half-life",
    Icon: Activity,
    name: "Half-life timeline",
    description: "Plasma concentration over 30 days from a compound's half-life and dosing interval.",
  },
  {
    href: "/tools/bac-water",
    Icon: Droplets,
    name: "Bac-water calculator",
    description: "Plan total bacteriostatic water for a full protocol and what to order.",
  },
];

export default function ToolsPage() {
  return (
    <div style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>
      <section className="ppr-grid-hex px-6 pb-16 pt-32 md:pt-40">
        <div className="mx-auto max-w-[960px]">
          <p
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Free, no signup
          </p>
          <h1
            className="mt-3"
            style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.02 }}
          >
            Researcher tools.
          </h1>
          <p
            className="mt-5 max-w-[560px] text-[18px]"
            style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", lineHeight: 1.5 }}
          >
            Calculators and converters we use at the bench. Free, no signup.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[960px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {TOOLS.map(({ href, Icon, name, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-lg p-7 transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
              >
                <Icon size={28} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--accent)" }} />
                <h2
                  className="mt-5 transition-colors group-hover:text-[color:var(--accent)]"
                  style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
                >
                  {name}
                </h2>
                <p
                  className="mt-2 text-[14px]"
                  style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.55 }}
                >
                  {description}
                </p>
                <span
                  className="mt-5 text-[14px] font-medium"
                  style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
                >
                  Open &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
