import type { Protocol } from "@/lib/mock-protocols";

interface PprProtocolMonitoringProps {
  protocol: Protocol;
}

export default function PprProtocolMonitoring({ protocol }: PprProtocolMonitoringProps) {
  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            Monitoring
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--platinum)" }}>
          Metrics to log across the window.
        </h2>

        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--steel)" }}>
          <div
            className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 text-[0.625rem] uppercase tracking-wider"
            style={{ backgroundColor: "var(--ink-2)", color: "var(--silver-3)" }}
          >
            <span className="col-span-4">Metric</span>
            <span className="col-span-2">Cadence</span>
            <span className="col-span-6">Note</span>
          </div>
          {protocol.monitoring.map((m, idx) => (
            <div
              key={m.metric}
              className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-6 py-4"
              style={{
                backgroundColor: idx % 2 === 0 ? "var(--ink)" : "var(--ink-2)",
                borderTop: idx === 0 ? "none" : "1px solid var(--steel)",
              }}
            >
              <span className="sm:col-span-4 text-sm" style={{ color: "var(--silver-1)" }}>
                {m.metric}
              </span>
              <span className="sm:col-span-2 text-sm" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {m.cadence}
              </span>
              <span className="sm:col-span-6 text-sm" style={{ color: "var(--silver-2)", lineHeight: 1.55 }}>
                {m.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
