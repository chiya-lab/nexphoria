"use client";

import { useEffect, useState } from "react";
import { useStackStore, decodeStack } from "@/lib/stack-store";
import PprStackLibrary from "./PprStackLibrary";
import PprStackPresets from "./PprStackPresets";
import PprStackCanvas from "./PprStackCanvas";
import PprStackTimingChart from "./PprStackTimingChart";
import PprStackCompatibility from "./PprStackCompatibility";
import PprStackSummary from "./PprStackSummary";
import PprStackShareModal from "./PprStackShareModal";

type MobileTab = "library" | "protocol";

export default function PprStackShell() {
  const loadFromItems = useStackStore((s) => s.loadFromItems);
  const itemCount = useStackStore((s) => s.items.length);
  const [shareOpen, setShareOpen] = useState(false);
  const [tab, setTab] = useState<MobileTab>("library");

  // Hydrate from a shared ?stack= link on first mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("stack");
    if (!raw) return;
    const items = decodeStack(decodeURIComponent(raw));
    if (items.length > 0) {
      loadFromItems(items);
      setTab("protocol");
    }
  }, [loadFromItems]);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      {/* Mobile tab switcher */}
      <div className="mb-5 flex gap-2 lg:hidden" role="tablist" aria-label="Stack builder view">
        {(["library", "protocol"] as MobileTab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t)}
              className="flex-1 rounded px-3 py-2 text-[12px] uppercase transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
                border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                background: active ? "rgba(184,224,79,0.12)" : "transparent",
                color: active ? "var(--accent)" : "var(--silver-2)",
              }}
            >
              {t === "library" ? "Library" : `Protocol${itemCount > 0 ? ` (${itemCount})` : ""}`}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: library + presets */}
        <div className={`flex-col gap-8 ${tab === "library" ? "flex" : "hidden"} lg:flex`}>
          <PprStackPresets />
          <PprStackLibrary />
        </div>

        {/* Right: canvas + timing + compatibility + summary */}
        <div className={`flex-col gap-6 ${tab === "protocol" ? "flex" : "hidden"} lg:flex`}>
          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}>
              Your protocol
            </h2>
            <PprStackCanvas />
          </div>
          <PprStackTimingChart />
          <PprStackCompatibility />
          <div className="lg:sticky lg:top-6">
            <PprStackSummary onShare={() => setShareOpen(true)} />
          </div>
        </div>
      </div>

      <PprStackShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </section>
  );
}
