"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Droplet, Clock, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { easing, duration } from "@/lib/motion";

const UPSELL_PRICE = 14;
const COUNTDOWN_SECONDS = 60;

function UpsellBody() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("order") ?? "NX-000000";
  const toggleBacWater = useCart((s) => s.toggleBacWater);
  const bacWaterIncluded = useCart((s) => s.bacWaterIncluded);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [decided, setDecided] = useState(false);

  const successHref = `/checkout/success?order=${orderId}`;

  useEffect(() => {
    if (decided) return;
    if (seconds <= 0) {
      router.push(successHref);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, decided, router, successHref]);

  function accept() {
    setDecided(true);
    if (!bacWaterIncluded) toggleBacWater();
    router.push(successHref);
  }

  function decline() {
    setDecided(true);
    router.push(successHref);
  }

  const pct = (seconds / COUNTDOWN_SECONDS) * 100;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: easing.easeOut }}
        className="rounded-lg p-7"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--accent)" }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Clock size={14} aria-hidden="true" style={{ color: "var(--accent)" }} />
          <span
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}
          >
            One-time offer — {seconds}s
          </span>
        </div>
        <div className="mb-5 h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--steel)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>

        <div className="mb-5 flex items-start gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
          >
            <Droplet size={26} style={{ color: "var(--accent)" }} aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <h1
              className="text-[24px] font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
            >
              Add bacteriostatic water, 30 mL
            </h1>
            <p className="mt-1.5 text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
              Lab-grade 0.9% benzyl-alcohol diluent for reconstitution. Add it to this order for
              ${UPSELL_PRICE} — no re-entering your card.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={accept}
            className="flex items-center justify-center gap-2 rounded-md py-3.5 text-[15px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            <Check size={16} aria-hidden="true" />
            Yes, add it for ${UPSELL_PRICE}
          </button>
          <button
            type="button"
            onClick={decline}
            className="rounded-md py-3 text-[14px] focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-2)", fontFamily: "var(--font-body)" }}
          >
            No thanks, complete my order
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function UpsellPage() {
  return (
    <Suspense fallback={null}>
      <UpsellBody />
    </Suspense>
  );
}
