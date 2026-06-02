"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Package, ArrowRight, FlaskConical } from "lucide-react";
import { useCart, getItemUnitPrice } from "@/lib/cart";
import { buildItem, trackPurchase } from "@/lib/analytics";
import { easing, duration } from "@/lib/motion";
import PprReferral from "@/components/post-purchase/PprReferral";

const NEXT_STEPS = [
  "Order confirmation and receipt sent to your email",
  "Identity and purity verification, then cold-chain packaging (4–8 hours)",
  "Discreet, unmarked shipment dispatched with tracking (within 24 hours)",
  "Certificate of Analysis (COA) included with every lot",
];

function SuccessBody() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "NX-000000";
  const clearCart = useCart((s) => s.clearCart);
  const items = useCart((s) => s.items);
  const getTotalPrice = useCart((s) => s.getTotalPrice);
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      const ga4Items = items.map((item) =>
        buildItem({
          slug: item.product.slug,
          name: item.product.name,
          category: item.product.category,
          price: getItemUnitPrice(item),
          quantity: item.quantity,
          format: item.format,
        }),
      );
      if (ga4Items.length > 0) {
        trackPurchase({ transactionId: orderId, items: ga4Items, value: getTotalPrice() });
      }
      clearCart();
      cleared.current = true;
    }
  }, [clearCart]); // eslint-disable-line react-hooks/exhaustive-deps

  const referralCode = `RESEARCH-${orderId.replace("NX-", "")}`;

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easing.easeOut }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, duration: duration.base, ease: easing.easeOut }}
          className="mb-7 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 18%, transparent)" }}
        >
          <Check size={32} style={{ color: "var(--accent)" }} aria-hidden="true" />
        </motion.div>

        <span
          className="mb-2 text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-2)" }}
        >
          Order {orderId}
        </span>
        <h1
          className="mb-4 text-[32px] font-semibold lg:text-[40px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Order confirmed
        </h1>
        <p
          className="mb-10 max-w-md text-[15px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
        >
          Your research compounds are entering quality verification. Tracking will follow at the
          email on file.
        </p>
      </motion.div>

      {/* What's next */}
      <section
        className="mb-6 rounded-lg p-6"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <div className="mb-4 flex items-center gap-2.5">
          <Package size={18} aria-hidden="true" style={{ color: "var(--accent)" }} />
          <h2
            className="text-[16px] font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            What happens next
          </h2>
        </div>
        <ul className="flex flex-col gap-3">
          {NEXT_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]"
                style={{ backgroundColor: "var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-mono)" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                {step}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Reconstitution guide link */}
      <Link
        href="/protocols/reconstitution"
        className="mb-6 flex items-center gap-3 rounded-lg p-5 transition-colors focus:outline-none focus-visible:ring-2"
        style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
      >
        <FlaskConical size={20} aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0 }} />
        <span className="flex flex-1 flex-col">
          <span className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Reconstitution protocol guide
          </span>
          <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
            Bacteriostatic water ratios, storage, and handling
          </span>
        </span>
        <ArrowRight size={18} aria-hidden="true" style={{ color: "var(--silver-2)" }} />
      </Link>

      {/* Refer a researcher */}
      <div className="mb-8">
        <PprReferral code={referralCode} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Continue researching
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessBody />
    </Suspense>
  );
}
