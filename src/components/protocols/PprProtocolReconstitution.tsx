import { type Protocol, totalBacWaterMl } from "@/lib/mock-protocols";

interface PprProtocolReconstitutionProps {
  protocol: Protocol;
}

export default function PprProtocolReconstitution({ protocol }: PprProtocolReconstitutionProps) {
  const totalBac = totalBacWaterMl(protocol);

  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            Reconstitution &amp; storage
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--platinum)" }}>
          Bench preparation.
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-sm p-6" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)", borderTop: "2px solid var(--accent)" }}>
            <p className="text-[0.625rem] uppercase tracking-wider mb-2" style={{ color: "var(--silver-3)" }}>
              Total bacteriostatic water
            </p>
            <p className="text-3xl" style={{ color: "var(--platinum)", fontFamily: "var(--font-mono)", fontWeight: 300 }}>
              {totalBac} mL
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--silver-3)" }}>
              Summed across {protocol.peptides.length} vial{protocol.peptides.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-sm p-6 md:col-span-2" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}>
            <p className="text-[0.625rem] uppercase tracking-wider mb-3" style={{ color: "var(--silver-3)" }}>
              Per-vial reconstitution
            </p>
            <ul className="space-y-2">
              {protocol.peptides.map((p) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--silver-1)" }}>{p.name}</span>
                  <span style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>{p.bacWaterMl} mL</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-sm p-6" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}>
            <p className="text-[0.625rem] uppercase tracking-wider mb-2" style={{ color: "var(--silver-3)" }}>
              Syringes
            </p>
            <p className="text-sm" style={{ color: "var(--silver-1)", lineHeight: 1.6 }}>
              {protocol.syringes}
            </p>
          </div>
          <div className="rounded-sm p-6" style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}>
            <p className="text-[0.625rem] uppercase tracking-wider mb-2" style={{ color: "var(--silver-3)" }}>
              Storage
            </p>
            <p className="text-sm" style={{ color: "var(--silver-1)", lineHeight: 1.6 }}>
              {protocol.storageNote}
            </p>
          </div>
        </div>

        <p className="text-xs mt-6" style={{ color: "var(--silver-3)", lineHeight: 1.7 }}>
          Reconstitute each vial separately; do not combine compounds in a single vial. Add solvent
          slowly down the vial wall and swirl gently &mdash; do not vortex. Always defer to the values
          on each product specification page.
        </p>
      </div>
    </section>
  );
}
