import Link from "next/link";
import type { Protocol } from "@/lib/mock-protocols";

interface PprProtocolCtaProps {
  protocol: Protocol;
}

export default function PprProtocolCta({ protocol }: PprProtocolCtaProps) {
  return (
    <section className="px-6 py-16 md:py-24" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
          Research use only
        </p>
        <h2
          className="text-2xl md:text-4xl mb-6"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--platinum)", lineHeight: 1.15 }}
        >
          Run {protocol.name} on your bench.
        </h2>
        <p className="text-sm mb-10 max-w-xl mx-auto" style={{ color: "var(--silver-2)", lineHeight: 1.7 }}>
          Add the full stack at catalog pricing, or open it in the stack builder to adjust pack
          sizes, dosing, and timing before ordering. All compounds are supplied for laboratory
          research only and make no medical claim.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm text-sm uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontWeight: 600 }}
          >
            Add full protocol to cart
          </Link>
          <Link
            href={`/stack-builder?preset=${protocol.slug}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm text-sm uppercase tracking-wide transition-colors hover:border-[var(--silver-2)]"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)" }}
          >
            Customize in stack builder
          </Link>
        </div>
      </div>
    </section>
  );
}
