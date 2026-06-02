import Breadcrumb from "@/components/Breadcrumb";

export default function PprProtocolsHero() {
  return (
    <section className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-5xl mx-auto">
        <Breadcrumb
          variant="dark"
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Research Protocols" },
          ]}
        />
        <p
          className="text-xs uppercase tracking-widest mb-6"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
        >
          Pre-composed research protocols
        </p>
        <h1
          className="text-4xl md:text-6xl mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: "var(--platinum)",
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
          }}
        >
          Peer-reviewed research protocols, pre-composed for you.
        </h1>
        <p
          className="text-lg max-w-2xl"
          style={{ fontWeight: 300, lineHeight: 1.6, color: "var(--silver-2)" }}
        >
          Each protocol summarizes typical research dosing observed in published
          literature across a defined study window — peptides, schedule,
          reconstitution, monitoring metrics, and the references behind them.
          Composed for laboratory study. Research use only; no medical claims.
        </p>
      </div>
    </section>
  );
}
