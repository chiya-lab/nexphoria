"use client";

import { useMemo, useState } from "react";
import {
  IMAGE_SLOTS,
  placeholderSvg,
  slotCounts,
  type ImageSlot,
  type ImageSlotKind,
  type ImageState,
} from "@/lib/image-placeholders";
import { StatusBadge, FilterChip, SearchInput } from "./adminTableUi";

const KINDS: { key: ImageSlotKind | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hero", label: "Hero" },
  { key: "product", label: "Product" },
  { key: "editorial", label: "Editorial" },
  { key: "banner", label: "Banner" },
  { key: "social", label: "Social" },
];

function stateTone(s: ImageState): "ok" | "accent" | "neutral" {
  if (s === "real") return "ok";
  if (s === "svg") return "accent";
  return "neutral";
}

function stateLabel(s: ImageState): string {
  if (s === "real") return "real asset";
  if (s === "svg") return "svg placeholder";
  return "TBD";
}

export default function PprAdminImageBriefs() {
  const counts = slotCounts();
  const [kind, setKind] = useState<ImageSlotKind | "all">("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const slots = useMemo(() => {
    const q = query.trim().toLowerCase();
    return IMAGE_SLOTS.filter((s) => {
      if (kind !== "all" && s.kind !== kind) return false;
      if (!q) return true;
      return (
        s.location.toLowerCase().includes(q) ||
        s.prompt.toLowerCase().includes(q) ||
        (s.slug ?? "").toLowerCase().includes(q)
      );
    });
  }, [kind, query]);

  async function copyPrompt(slot: ImageSlot) {
    const payload =
      `${slot.prompt}\n\nCamera: ${slot.cameraSpec}\nNegative: ${slot.negativePrompt}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedId(slot.id);
      setTimeout(() => setCopiedId((c) => (c === slot.id ? null : c)), 1600);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Counts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          ["Total slots", counts.total],
          ["Real assets", counts.real],
          ["SVG placeholder", counts.svg],
          ["TBD", counts.tbd],
        ] as const).map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg p-3"
            style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
          >
            <div className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-3)" }}>
              {label}
            </div>
            <div className="mt-1 text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <FilterChip key={k.key} active={kind === k.key} label={k.label} onClick={() => setKind(k.key)} />
          ))}
        </div>
        <div className="sm:w-72">
          <SearchInput value={query} onChange={setQuery} placeholder="Search location, prompt, SKU…" />
        </div>
      </div>

      {/* Slot cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {slots.map((slot) => (
          <article
            key={slot.id}
            className="flex flex-col gap-3 rounded-xl p-4 sm:flex-row"
            style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
          >
            {/* Placeholder preview */}
            <div
              className="shrink-0 self-start overflow-hidden rounded"
              style={{ width: 120, border: "1px solid var(--steel)" }}
              // The SVG is generated from a static, escaped registry — no user input.
              dangerouslySetInnerHTML={{ __html: placeholderSvg(slot) }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                    {slot.location}
                  </h3>
                  <div className="mt-0.5 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                    {slot.id} · {slot.aspect}
                  </div>
                </div>
                <StatusBadge label={stateLabel(slot.state)} tone={stateTone(slot.state)} />
              </div>

              <p className="mt-2 text-[13px]" style={{ color: "var(--silver-1)" }}>
                {slot.intent}
              </p>

              <p
                className="mt-2 line-clamp-3 text-[12px]"
                style={{ color: "var(--silver-2)" }}
                title={slot.prompt}
              >
                {slot.prompt}
              </p>

              <div className="mt-2 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                {slot.cameraSpec}
              </div>

              <button
                type="button"
                onClick={() => copyPrompt(slot)}
                className="mt-3 rounded px-3 py-1.5 text-[12px] font-medium transition-colors"
                style={{
                  color: copiedId === slot.id ? "var(--ink)" : "var(--accent)",
                  backgroundColor: copiedId === slot.id ? "var(--accent)" : "transparent",
                  border: "1px solid var(--accent)",
                }}
              >
                {copiedId === slot.id ? "Copied" : "Copy prompt"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {slots.length === 0 && (
        <div className="rounded-xl p-8 text-center text-sm" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)", color: "var(--silver-2)" }}>
          No image slots match this filter.
        </div>
      )}
    </div>
  );
}
