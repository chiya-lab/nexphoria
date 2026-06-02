"use client";

import { Reorder, useDragControls } from "framer-motion";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { useStackStore, TIMING_SLOTS, TIMING_LABEL, type StackItem, type TimingSlot } from "@/lib/stack-store";

const PACK_OPTIONS = [1, 3, 6];

function packPrice(slug: string, qty: number): number {
  const p = MOCK_PRODUCTS.find((m) => m.slug === slug);
  if (!p) return 0;
  return p.packPrices.find((pp) => pp.qty === qty)?.price ?? p.price * qty;
}

function CanvasRow({ item }: { item: StackItem }) {
  const controls = useDragControls();
  const remove = useStackStore((s) => s.remove);
  const setPackQty = useStackStore((s) => s.setPackQty);
  const setDose = useStackStore((s) => s.setDose);
  const setSlot = useStackStore((s) => s.setSlot);
  const product = MOCK_PRODUCTS.find((m) => m.slug === item.slug);
  if (!product) return null;

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="flex flex-col gap-3 rounded-lg p-4"
      style={{ background: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            aria-label={`Reorder ${product.name}`}
            onPointerDown={(e) => controls.start(e)}
            className="mt-0.5 cursor-grab touch-none select-none rounded px-1 py-0.5 active:cursor-grabbing focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--silver-3)" }}
          >
            <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: 14, lineHeight: 1 }}>
              ::
            </span>
          </button>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
              {product.name}
            </span>
            <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-3)" }}>
              {product.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[14px] tabular-nums" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
            ${packPrice(item.slug, item.packQty)}
          </span>
          <button
            type="button"
            onClick={() => remove(item.slug)}
            aria-label={`Remove ${product.name} from stack`}
            className="rounded px-2 py-1 text-[12px] uppercase transition-colors focus:outline-none focus-visible:ring-2"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", border: "1px solid var(--steel)", color: "var(--silver-2)" }}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}>
            Pack
          </span>
          <div className="flex gap-1" role="group" aria-label={`Pack size for ${product.name}`}>
            {PACK_OPTIONS.map((q) => {
              const active = item.packQty === q;
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => setPackQty(item.slug, q)}
                  aria-pressed={active}
                  className="rounded px-2.5 py-1 text-[12px] tabular-nums transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                    background: active ? "rgba(184,224,79,0.12)" : "transparent",
                    color: active ? "var(--accent)" : "var(--silver-2)",
                  }}
                >
                  {q === 1 ? "1 vial" : `${q}-vial`}
                </button>
              );
            })}
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}>
            Dose (mcg/day)
          </span>
          <input
            type="number"
            min={0}
            step={50}
            value={item.dosePerDay}
            onChange={(e) => setDose(item.slug, Number(e.target.value))}
            className="w-24 rounded px-2.5 py-1 text-[13px] tabular-nums focus:outline-none focus-visible:ring-2"
            style={{ fontFamily: "var(--font-mono)", background: "var(--ink-3)", border: "1px solid var(--steel)", color: "var(--platinum)" }}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-3)" }}>
            Timing
          </span>
          <div className="flex gap-1" role="group" aria-label={`Timing slot for ${product.name}`}>
            {TIMING_SLOTS.map((slot: TimingSlot) => {
              const active = item.slot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSlot(item.slug, slot)}
                  aria-pressed={active}
                  title={TIMING_LABEL[slot]}
                  className="rounded px-2.5 py-1 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                    background: active ? "rgba(184,224,79,0.12)" : "transparent",
                    color: active ? "var(--accent)" : "var(--silver-2)",
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </label>
      </div>
    </Reorder.Item>
  );
}

export default function PprStackCanvas() {
  const items = useStackStore((s) => s.items);
  const reorder = useStackStore((s) => s.reorder);

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-lg px-6 py-14 text-center"
        style={{ background: "var(--ink-2)", border: "1px dashed var(--steel)" }}
      >
        <span className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          Your protocol is empty.
        </span>
        <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-3)" }}>
          Add compounds from the library or load a preset to begin composing.
        </span>
      </div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={(next) => reorder(next.map((i) => i.slug))}
      className="flex flex-col gap-3"
    >
      {items.map((item) => (
        <CanvasRow key={item.slug} item={item} />
      ))}
    </Reorder.Group>
  );
}
