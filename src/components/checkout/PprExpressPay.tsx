"use client";

const BUTTONS = [
  { id: "apple", label: "Apple Pay", bg: "#FFFFFF", fg: "#000000" },
  { id: "google", label: "Google Pay", bg: "#FFFFFF", fg: "#3C4043" },
  { id: "shop", label: "Shop Pay", bg: "#5A31F4", fg: "#FFFFFF" },
];

export default function PprExpressPay({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {BUTTONS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect?.(b.id)}
            className="rounded-md py-3 text-[14px] font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: b.bg, color: b.fg, fontFamily: "var(--font-body)" }}
            aria-label={`Pay with ${b.label}`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1" style={{ backgroundColor: "var(--steel)" }} />
        <span
          className="text-[11px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}
        >
          or pay by card
        </span>
        <span className="h-px flex-1" style={{ backgroundColor: "var(--steel)" }} />
      </div>
    </div>
  );
}
