import type { Protocol, TimingSlot } from "@/lib/mock-protocols";

interface PprProtocolTimelineProps {
  protocol: Protocol;
}

const SLOT_ORDER: TimingSlot[] = ["AM", "PWO", "PM"];
const SLOT_LABEL: Record<TimingSlot, string> = {
  AM: "AM",
  PWO: "Post-workout",
  PM: "PM",
};

// Deterministic accent shades per peptide index for bar fills.
const BAR_COLORS = ["var(--accent)", "var(--accent-glow)", "var(--ok)", "var(--warn)"];

export default function PprProtocolTimeline({ protocol }: PprProtocolTimelineProps) {
  const weeks = protocol.durationWeeks;
  const weekLabels = Array.from({ length: weeks }, (_, i) => i + 1);

  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "var(--ink)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            Timeline
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--platinum)" }}>
          {weeks}-week dosing window.
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--silver-2)", lineHeight: 1.6 }}>
          Each bar spans the full window; the timing bands below show which part of the day each
          compound occupies. Cyclic compounds are dosed in repeated short cycles within the window.
        </p>

        {/* Gantt-style bars */}
        <div className="rounded-sm p-6 overflow-x-auto" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
          <div style={{ minWidth: 480 }}>
            {/* Week ruler */}
            <div className="flex items-center mb-4" style={{ paddingLeft: 140 }}>
              <div className="flex flex-1 justify-between">
                {weekLabels.map((w) => (
                  <span key={w} className="text-[0.625rem]" style={{ color: "var(--silver-3)", fontFamily: "var(--font-mono)" }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {protocol.peptides.map((p, idx) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span
                    className="text-xs truncate"
                    style={{ width: 128, color: "var(--silver-1)", fontFamily: "var(--font-mono)" }}
                    title={p.name}
                  >
                    {p.name}
                  </span>
                  <div className="relative flex-1 h-7 rounded-sm" style={{ backgroundColor: "var(--ink)" }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-sm flex items-center px-3"
                      style={{
                        width: "100%",
                        backgroundColor: BAR_COLORS[idx % BAR_COLORS.length],
                        opacity: 0.22,
                        border: `1px solid ${BAR_COLORS[idx % BAR_COLORS.length]}`,
                      }}
                    >
                      <span className="text-[0.625rem] uppercase tracking-wider" style={{ color: "var(--platinum)", fontFamily: "var(--font-mono)" }}>
                        {p.slots.join(" / ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timing-band view */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {SLOT_ORDER.map((slot) => {
            const inSlot = protocol.peptides.filter((p) => p.slots.includes(slot));
            return (
              <div key={slot} className="rounded-sm p-5" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                  {SLOT_LABEL[slot]}
                </p>
                {inSlot.length > 0 ? (
                  <ul className="space-y-2">
                    {inSlot.map((p) => (
                      <li key={p.name} className="text-sm" style={{ color: "var(--silver-1)" }}>
                        {p.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: "var(--silver-3)" }}>
                    &mdash;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
