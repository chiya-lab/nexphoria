"use client";

import { useState, useMemo } from "react";
import { products, getProduct, type Product } from "@/lib/products";
import { hasProductPhoto, getProductImagePath } from "@/lib/product-images";
import { useCart } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import RUOBanner from "@/components/RUOBanner";
import {
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Snowflake,
  ArrowRight,
  Beaker,
} from "lucide-react";

const GOLD = "#B8A44C";

// Research-framed mechanistic context for stack pairings, keyed by slug.
// Falls back to product.mechanism when a slug is not listed here.
const MECH_CONTEXT: Record<string, string> = {
  "bpc-157":
    "Studied for angiogenesis and the inflammatory-to-proliferative repair transition in tissue-injury models.",
  "tb-500":
    "Actin-sequestering fragment studied for cell migration and anti-inflammatory activity — a common repair-phase complement.",
  "ghk-cu":
    "Copper-binding tripeptide studied for ECM remodeling and antioxidant gene expression.",
  "wolverine-blend":
    "Combines anti-inflammatory, angiogenic, and ECM-remodeling mechanisms for multi-phase recovery designs.",
  "cjc-1295-ipamorelin":
    "GHRH + selective GHRP pairing studied for synergistic GH pulse amplitude in GH-axis research.",
  ipamorelin:
    "Selective GHRP studied for clean GH pulses without cortisol or prolactin elevation.",
  "cjc-1295":
    "GHRH analog studied for sustained elevation of GH-axis signaling.",
  sermorelin:
    "GHRH(1-29) analog studied for physiologically patterned, pulsatile GH stimulation.",
  tesamorelin:
    "Stabilized GHRH analog studied for visceral-adipose and IGF-1 endpoints.",
  "mk-677":
    "Oral GHSR-1a agonist studied for sustained IGF-1 elevation in extended protocols.",
  semaglutide:
    "Long-acting GLP-1 receptor agonist characterized for body-weight and glycemic endpoints.",
  tirzepatide:
    "GIP/GLP-1 dual agonist studied for additive metabolic effects over mono-agonists.",
  retatrutide:
    "GIP/GLP-1/glucagon triple agonist studied for body-weight and hepatic-fat endpoints.",
  "aod-9604":
    "hGH fragment studied for adipose-tissue endpoints without IGF-1 axis activity.",
  "nad-plus":
    "Coenzyme studied for sirtuin activation, DNA repair, and mitochondrial biogenesis.",
  epitalon:
    "Tetrapeptide studied for telomerase activity and telomere-length endpoints.",
  "mots-c":
    "Mitochondrial-encoded peptide studied for AMPK activation as an exercise-mimetic.",
  "ss-31":
    "Cardiolipin-targeting peptide studied for mitochondrial protection in I/R models.",
  selank:
    "Non-GABAergic anxiolytic studied for BDNF upregulation without sedation.",
  semax:
    "ACTH(4-10) fragment studied for BDNF/VEGF upregulation in ischemia models.",
  dsip: "Nonapeptide studied for delta-wave EEG promotion and HPA-axis modulation.",
  "thymosin-alpha-1":
    "Thymic peptide studied for Th1 polarization and NK-cell activation.",
  "ll-37":
    "Cathelicidin fragment studied for antimicrobial and immunomodulatory endpoints.",
  kpv: "Alpha-MSH tripeptide studied for NF-kB modulation in mucosal inflammation models.",
  "glow-blend":
    "Copper peptide combined with repair-phase compounds for dermal-model endpoints.",
  "klw-blend":
    "Immune-focused blend studied for host-defense and mucosal endpoints.",
  "pt-141":
    "Melanocortin agonist studied for central nervous system signaling endpoints.",
  oxytocin:
    "Neuropeptide studied for social-behavior and HPA-axis circuits.",
  kisspeptin:
    "Studied as a master regulator of GnRH pulse frequency in reproductive-axis research.",
};

function mechFor(p: Product): string {
  return MECH_CONTEXT[p.slug] ?? p.mechanism;
}

type SelectedMap = Map<string, number>; // slug -> vial quantity

export default function BuildYourStackClient() {
  const { addItem, openDrawer } = useCart();

  const composable = useMemo(
    () => products.filter((p) => !p.comingSoon && !p.slug.startsWith("sterile-water")),
    []
  );

  const [primarySlug, setPrimarySlug] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedMap>(new Map());

  const primary = primarySlug ? getProduct(primarySlug) : undefined;

  // Complementary compounds derived from the primary's real relatedSlugs,
  // padded with same-category compounds so there are always options to show.
  const complementary = useMemo(() => {
    if (!primary) return [];
    const out: Product[] = [];
    const seen = new Set<string>([primary.slug]);

    primary.relatedSlugs.forEach((slug) => {
      const p = getProduct(slug);
      if (p && !p.comingSoon && !seen.has(p.slug) && !p.slug.startsWith("sterile-water")) {
        out.push(p);
        seen.add(p.slug);
      }
    });

    composable
      .filter((p) => p.category === primary.category && !seen.has(p.slug))
      .forEach((p) => {
        if (out.length < 6) {
          out.push(p);
          seen.add(p.slug);
        }
      });

    return out.slice(0, 6);
  }, [primary, composable]);

  function choosePrimary(slug: string) {
    setPrimarySlug(slug);
    setSelected(new Map([[slug, 1]]));
  }

  function adjust(slug: string, delta: number) {
    setSelected((prev) => {
      const next = new Map(prev);
      const current = next.get(slug) ?? 0;
      const updated = current + delta;
      if (updated <= 0) {
        if (slug === primarySlug) {
          next.set(slug, 1); // keep at least one of the primary
        } else {
          next.delete(slug);
        }
      } else {
        next.set(slug, updated);
      }
      return next;
    });
  }

  function toggleComplementary(slug: string) {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.set(slug, 1);
      }
      return next;
    });
  }

  const lineItems = useMemo(() => {
    const items: { product: Product; qty: number }[] = [];
    selected.forEach((qty, slug) => {
      const p = getProduct(slug);
      if (p) items.push({ product: p, qty });
    });
    return items;
  }, [selected]);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
    [lineItems]
  );

  const vialCount = useMemo(
    () => lineItems.reduce((sum, { qty }) => sum + qty, 0),
    [lineItems]
  );

  function addStackToCart() {
    lineItems.forEach(({ product, qty }) => {
      for (let i = 0; i < qty; i++) {
        addItem(product, "vial");
      }
    });
    openDrawer();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9F9F9", paddingTop: "72px" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Build Your Stack" }]} />
      </div>

      {/* Header + persistent RUO chip */}
      <div className="border-b" style={{ borderColor: "#E8E5E0", backgroundColor: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-medium text-black mb-3 tracking-tight">
                Build Your Stack
              </h1>
              <p className="text-lg text-[#555]">
                Choose a primary research compound, then add complementary compounds with mechanistic
                context. Every vial ships cold-chain with a lot-specific Certificate of Analysis.
              </p>
            </div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest"
              style={{ border: `1px solid ${GOLD}55`, backgroundColor: `${GOLD}14`, color: GOLD }}
            >
              <ShieldCheck size={13} />
              For Research Use Only
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Step 1: pick primary */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <StepDot active={!primary} done={!!primary} n={1} />
                <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight">
                  Choose your primary compound
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {composable.map((p) => {
                  const isPrimary = p.slug === primarySlug;
                  return (
                    <button
                      key={p.slug}
                      onClick={() => choosePrimary(p.slug)}
                      className="text-left bg-white rounded-2xl p-5 transition-all"
                      style={{
                        border: isPrimary ? `2px solid ${GOLD}` : "1px solid #E8E5E0",
                        backgroundColor: isPrimary ? `${GOLD}0D` : "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                          style={{ backgroundColor: "#F7F4EE" }}
                        >
                          {hasProductPhoto(p.slug) ? (
                            <Image
                              src={getProductImagePath(p.slug)}
                              alt={p.name}
                              width={48}
                              height={48}
                              loading="lazy"
                              className="object-contain"
                            />
                          ) : (
                            <Beaker size={20} className="text-[#8A8075]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs uppercase tracking-wider text-[#8A8075] mb-0.5">
                            {p.category}
                          </div>
                          <div className="font-medium text-black truncate">{p.name}</div>
                          <div className="text-sm text-[#555]">
                            {p.size} · ${p.price}
                          </div>
                        </div>
                        {isPrimary && (
                          <span className="ml-auto flex-shrink-0">
                            <Check size={18} style={{ color: GOLD }} />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: complementary compounds */}
            <AnimatePresence>
              {primary && (
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <StepDot active n={2} />
                    <h2 className="text-2xl md:text-3xl font-medium text-black tracking-tight">
                      Add complementary compounds
                    </h2>
                  </div>
                  <p className="text-[#555] mb-8">
                    Compounds frequently studied alongside{" "}
                    <span className="font-medium text-black">{primary.name}</span>, with the mechanistic
                    rationale for each pairing.
                  </p>

                  {complementary.length === 0 ? (
                    <p className="text-[#8A8075] text-sm">
                      No complementary compounds are catalogued for this primary yet. You can still order
                      it on its own below.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {complementary.map((p) => {
                        const inStack = selected.has(p.slug);
                        return (
                          <div
                            key={p.slug}
                            className="bg-white rounded-2xl p-5 flex flex-col"
                            style={{
                              border: inStack ? `2px solid ${GOLD}` : "1px solid #E8E5E0",
                              backgroundColor: inStack ? `${GOLD}0D` : "#fff",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            }}
                          >
                            <div className="flex items-start gap-4 mb-3">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                                style={{ backgroundColor: "#F7F4EE" }}
                              >
                                {hasProductPhoto(p.slug) ? (
                                  <Image
                                    src={getProductImagePath(p.slug)}
                                    alt={p.name}
                                    width={40}
                                    height={40}
                                    loading="lazy"
                                    className="object-contain"
                                  />
                                ) : (
                                  <Beaker size={18} className="text-[#8A8075]" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/products/${p.slug}`}
                                  className="font-medium text-black hover:underline"
                                >
                                  {p.name}
                                </Link>
                                <div className="text-sm text-[#555]">
                                  {p.size} · ${p.price}
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-[#555] leading-relaxed mb-4 flex-1">
                              {mechFor(p)}
                            </p>

                            <button
                              onClick={() => toggleComplementary(p.slug)}
                              className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                              style={
                                inStack
                                  ? { border: `1px solid ${GOLD}`, color: GOLD, backgroundColor: "#fff" }
                                  : { backgroundColor: GOLD, color: "#0F0F0E" }
                              }
                            >
                              {inStack ? (
                                <>
                                  <Check size={15} /> In stack
                                </>
                              ) : (
                                <>
                                  <Plus size={15} /> Add to stack
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div
                className="bg-white rounded-2xl p-6 border"
                style={{ borderColor: "#E8E5E0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <h3 className="text-2xl font-medium text-black mb-6">Your Stack</h3>

                {!primary ? (
                  <p className="text-[#8A8075] text-sm">
                    Choose a primary compound to start building your stack.
                  </p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {lineItems.map(({ product, qty }) => (
                        <div key={product.slug} className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-black truncate">
                              {product.name}
                              {product.slug === primarySlug && (
                                <span className="ml-2 text-[10px] uppercase tracking-wider" style={{ color: GOLD }}>
                                  Primary
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-[#8A8075]">{product.size}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => adjust(product.slug, -1)}
                                className="w-7 h-7 rounded-full border flex items-center justify-center text-[#555] hover:border-[#B8A44C] transition-colors"
                                style={{ borderColor: "#E8E5E0" }}
                                aria-label={`Remove one ${product.name}`}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="text-sm font-semibold text-black w-5 text-center">{qty}</span>
                              <button
                                onClick={() => adjust(product.slug, 1)}
                                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                style={{ backgroundColor: GOLD, color: "#0F0F0E" }}
                                aria-label={`Add one ${product.name}`}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="font-semibold text-black whitespace-nowrap">
                            ${product.price * qty}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 mb-5 border-t" style={{ borderColor: "#E8E5E0" }}>
                      <div>
                        <p className="text-sm text-[#555]">Subtotal</p>
                        <p className="text-xs text-[#8A8075]">
                          {vialCount} vial{vialCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <p className="text-2xl font-medium text-black">${subtotal}</p>
                    </div>

                    {/* Cold-chain note */}
                    <div
                      className="flex items-start gap-2.5 rounded-lg p-3 mb-5 text-xs leading-relaxed"
                      style={{ backgroundColor: "#F2F4EC", color: "#4A4A40" }}
                    >
                      <Snowflake size={15} style={{ color: GOLD }} className="flex-shrink-0 mt-0.5" />
                      <span>
                        Cold-chain packed on every shipment. Final shipping is calculated at checkout.
                      </span>
                    </div>

                    <button
                      onClick={addStackToCart}
                      className="w-full py-4 rounded-lg font-semibold text-sm uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: GOLD, color: "#0F0F0E" }}
                    >
                      Add stack to cart
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>

              <RUOBanner variant="card" tone="light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDot({ n, active, done }: { n: number; active?: boolean; done?: boolean }) {
  const filled = active || done;
  return (
    <span
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
      style={{
        backgroundColor: filled ? GOLD : "#E8E5E0",
        color: filled ? "#0F0F0E" : "#8A8075",
      }}
    >
      {done ? <Check size={15} /> : n}
    </span>
  );
}
