import Link from "next/link";
import type { Protocol } from "@/lib/mock-protocols";

interface PprProtocolStackProps {
  protocol: Protocol;
}

export default function PprProtocolStack({ protocol }: PprProtocolStackProps) {
  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            The stack
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--platinum)" }}>
          Compounds &amp; schedule.
        </h2>

        <div className="space-y-4">
          {protocol.peptides.map((p) => {
            const content = (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                  <h3 className="text-lg" style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--platinum)" }}>
                    {p.name}
                  </h3>
                  <div className="flex gap-1.5">
                    {p.slots.map((slot) => (
                      <span
                        key={slot}
                        className="text-[0.625rem] uppercase tracking-wider px-2 py-1 rounded-sm"
                        style={{ color: "var(--accent)", backgroundColor: "rgba(184,224,79,0.08)", fontFamily: "var(--font-mono)" }}
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex gap-2">
                    <dt style={{ color: "var(--silver-3)" }}>Dose</dt>
                    <dd style={{ color: "var(--silver-1)" }}>{p.dose}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt style={{ color: "var(--silver-3)" }}>Schedule</dt>
                    <dd style={{ color: "var(--silver-1)" }}>{p.schedule}</dd>
                  </div>
                </dl>
                {p.productSlug && (
                  <span
                    className="inline-block mt-3 text-xs transition-colors group-hover:text-[var(--accent-glow)]"
                    style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
                  >
                    View product specification &rarr;
                  </span>
                )}
              </>
            );

            const cardStyle = {
              backgroundColor: "var(--ink)",
              border: "1px solid var(--steel)",
            } as const;

            return p.productSlug ? (
              <Link
                key={p.name}
                href={`/products/${p.productSlug}`}
                className="group block rounded-sm p-6 transition-colors hover:border-[var(--silver-3)]"
                style={cardStyle}
              >
                {content}
              </Link>
            ) : (
              <div key={p.name} className="rounded-sm p-6" style={cardStyle}>
                {content}
              </div>
            );
          })}
        </div>

        <p className="text-xs mt-6" style={{ color: "var(--silver-3)", lineHeight: 1.7 }}>
          Doses summarize typical research dosing observed in published literature. They are not a
          prescription and make no medical claim. For research use only.
        </p>
      </div>
    </section>
  );
}
