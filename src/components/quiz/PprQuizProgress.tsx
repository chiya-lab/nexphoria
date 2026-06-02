"use client";

interface PprQuizProgressProps {
  current: number; // 1-based current step
  total: number;
}

export default function PprQuizProgress({ current, total }: PprQuizProgressProps) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
        >
          Step {current} of {total}
        </span>
        <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
          {pct}%
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--steel)" }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Quiz progress: step ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: "var(--accent)",
            transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
}
