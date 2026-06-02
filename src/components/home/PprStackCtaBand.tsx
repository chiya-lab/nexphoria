import Link from "next/link";

export default function PprStackCtaBand() {
  return (
    <section
      className="ppr-grid-hex px-6 py-28 md:py-36"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <div className="mx-auto max-w-[860px] text-center">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(34px, 6vw, 56px)",
            fontWeight: 600,
            color: "var(--platinum)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
          }}
        >
          Design your protocol. One vial at a time.
        </h2>
        <p
          className="mx-auto mt-5 max-w-[560px]"
          style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--silver-1)", lineHeight: 1.55 }}
        >
          A short intake maps your research targets to compounds, dosing references,
          and a subscribe cadence. No account required to start.
        </p>
        <div className="mt-9">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[15px] font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
          >
            Start the intake <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
