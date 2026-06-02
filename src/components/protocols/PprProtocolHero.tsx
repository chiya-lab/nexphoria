import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import type { Protocol } from "@/lib/mock-protocols";

interface PprProtocolHeroProps {
  protocol: Protocol;
}

function IntensityMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Intensity ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          className="block rounded-sm"
          style={{
            width: 22,
            height: 6,
            backgroundColor: n <= value ? "var(--accent)" : "var(--steel)",
          }}
        />
      ))}
    </div>
  );
}

export default function PprProtocolHero({ protocol }: PprProtocolHeroProps) {
  return (
    <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-5xl mx-auto">
        <Breadcrumb
          variant="dark"
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Research Protocols", href: "/protocols" },
            { label: protocol.name },
          ]}
        />
        <p
          className="text-xs uppercase tracking-widest mb-5"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
        >
          {protocol.category} &middot; {protocol.durationWeeks}-week window
        </p>
        <h1
          className="text-4xl md:text-6xl mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: "var(--platinum)",
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
          }}
        >
          {protocol.name}
        </h1>
        <p className="text-lg max-w-2xl mb-10" style={{ fontWeight: 300, lineHeight: 1.6, color: "var(--silver-2)" }}>
          {protocol.tagline}
        </p>

        <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mb-10">
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider mb-2" style={{ color: "var(--silver-3)" }}>
              Duration
            </p>
            <p className="text-2xl" style={{ color: "var(--platinum)", fontFamily: "var(--font-mono)", fontWeight: 300 }}>
              {protocol.durationWeeks}w
            </p>
          </div>
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider mb-2" style={{ color: "var(--silver-3)" }}>
              Intensity
            </p>
            <div className="pt-2">
              <IntensityMeter value={protocol.intensity} />
            </div>
          </div>
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider mb-2" style={{ color: "var(--silver-3)" }}>
              Est. compound cost
            </p>
            <p className="text-2xl" style={{ color: "var(--platinum)", fontFamily: "var(--font-mono)", fontWeight: 300 }}>
              ${protocol.estCost}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/stack-builder?preset=${protocol.slug}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm text-sm uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontWeight: 600 }}
          >
            Load into stack builder
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm text-sm uppercase tracking-wide transition-colors hover:border-[var(--silver-2)]"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
          >
            Add all to cart
          </Link>
        </div>
      </div>
    </section>
  );
}
