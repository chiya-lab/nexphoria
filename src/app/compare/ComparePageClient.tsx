"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";
import { hasProductPhoto, getProductImagePath } from "@/lib/product-images";
import { hasCoa, labPartnerFor } from "@/lib/coa";
import Breadcrumb from "@/components/Breadcrumb";
import { X, Plus, ArrowRight, ExternalLink } from "lucide-react";

const MAX = 4;

const ROW_DEFS: { label: string; key: string; badge?: boolean; strong?: boolean }[] = [
  { label: "Research Domain", key: "category" },
  { label: "Size", key: "size" },
  { label: "Price (from)", key: "basePrice", strong: true },
  { label: "Molecular Weight", key: "molecularWeight" },
  { label: "Purity", key: "purity", badge: true },
  { label: "CAS Number", key: "casNumber" },
  { label: "Lab-Partner Tested", key: "labPartner" },
  { label: "Storage", key: "storage" },
  { label: "Appearance", key: "appearance" },
];

type Product = (typeof products)[0];

function getBasePrice(p: Product): string {
  const base =
    p.dosages && p.dosages.length > 0
      ? Math.min(...p.dosages.map((d) => d.price))
      : p.price;
  return `$${base}`;
}

function getCellValue(p: Product, key: string): string {
  if (key === "basePrice") return getBasePrice(p);
  if (key === "labPartner") return hasCoa(p.slug) ? labPartnerFor(p.slug) : "—";
  const val = (p as Record<string, unknown>)[key];
  if (val === undefined || val === null) return "—";
  return String(val);
}

function ProductThumbnail({ product }: { product: Product }) {
  return (
    <div
      className="w-20 h-20 rounded-xl overflow-hidden mx-auto"
      style={{ backgroundColor: "#F0EDE7" }}
    >
      {hasProductPhoto(product.slug) ? (
        <img
          src={getProductImagePath(product.slug)}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2">
          <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: "#B8A44C" }}>
            {product.name}
          </span>
        </div>
      )}
    </div>
  );
}

interface AddSlotProps {
  onAdd: (slug: string) => void;
  existing: string[];
}
function AddSlot({ onAdd, existing }: AddSlotProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      !existing.includes(p.slug) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <td className="text-center px-4 py-4 align-top" style={{ minWidth: "180px" }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center gap-2 mx-auto group"
          style={{ color: "#666666" }}
        >
          <div
            className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors group-hover:border-[#C9A24B]"
            style={{ borderColor: "#ECEAE4" }}
          >
            <Plus size={20} style={{ color: "#BFBBAF" }} />
          </div>
          <span className="text-xs" style={{ color: "#BFBBAF" }}>Add compound</span>
        </button>
      ) : (
        <div className="flex flex-col gap-2 text-left" style={{ width: "160px" }}>
          <input
            autoFocus
            className="w-full px-2 py-1.5 text-xs rounded border outline-none"
            style={{
              backgroundColor: "#F5F3F0",
              borderColor: "#ECEAE4",
              color: "#333",
            }}
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="overflow-y-auto rounded border" style={{ maxHeight: "180px", borderColor: "#ECEAE4", backgroundColor: "#F9F9F9" }}>
            {filtered.length === 0 ? (
              <div className="text-xs px-3 py-2" style={{ color: "#666666" }}>No results</div>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.slug}
                  className="w-full text-left px-3 py-2 text-xs hover:opacity-70 border-b last:border-0"
                  style={{ color: "#333", borderColor: "#ECEAE4" }}
                  onClick={() => {
                    onAdd(p.slug);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {p.name}
                </button>
              ))
            )}
          </div>
          <button
            className="text-xs text-center"
            style={{ color: "#666666" }}
            onClick={() => { setOpen(false); setQuery(""); }}
          >
            Cancel
          </button>
        </div>
      )}
    </td>
  );
}

export default function ComparePageClient({ initialSlugs }: { initialSlugs: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [slugs, setSlugs] = useState<string[]>(() => {
    const raw = initialSlugs || "";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && products.some((p) => p.slug === s))
      .slice(0, MAX);
  });

  // Sync URL when slugs change
  useEffect(() => {
    const current = searchParams.get("slugs") ?? "";
    const next = slugs.join(",");
    if (current !== next) {
      const url = slugs.length > 0 ? `/compare?slugs=${next}` : `/compare`;
      router.replace(url, { scroll: false });
    }
  }, [slugs, router, searchParams]);

  const addSlug = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (prev.includes(slug) || prev.length >= MAX) return prev;
      return [...prev, slug];
    });
  }, []);

  const removeSlug = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const compared = slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));

  const emptySlots = Math.max(0, MAX - compared.length);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/compare?slugs=${slugs.join(",")}`
      : `https://nexphoria.com/compare?slugs=${slugs.join(",")}`;

  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard
      .writeText(shareUrl)
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = shareUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      })
      .finally(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      {/* Hero */}
      <div
        className="pt-36 pb-12 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="container-nex">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/products" },
              { label: "Compare" },
            ]}
            variant="dark"
            className="mb-6"
          />
          <span className="eyebrow mb-5 block" style={{ color: "#C9A24B" }}>
            Side-by-Side Analysis
          </span>
          <h1
            className="font-bold tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#F9F9F9",
              lineHeight: 1.05,
            }}
          >
            Compare Compounds
          </h1>
          <p className="max-w-xl leading-relaxed" style={{ color: "#8A8A86" }}>
            Select up to {MAX} research compounds to compare purity, molecular weight, storage
            requirements, pricing, and more — side by side.
          </p>
        </div>
      </div>

      {/* Actions bar */}
      <div
        className="border-b sticky top-0 z-20"
        style={{ backgroundColor: "#111", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="container-nex py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "#C9A24B" }}
            >
              ← Back to catalog
            </Link>
            {compared.length > 0 && (
              <button
                onClick={() => setSlugs([])}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: "#666666" }}
              >
                Clear all
              </button>
            )}
          </div>
          {compared.length >= 2 && (
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors hover:opacity-80"
              style={{ backgroundColor: "rgba(201,162,75,0.15)", color: "#C9A24B", border: "1px solid rgba(201,162,75,0.3)" }}
            >
              <ExternalLink size={12} />
              {copied ? "Copied!" : "Share comparison"}
            </button>
          )}
        </div>
      </div>

      {/* Main comparison table */}
      <div className="container-nex py-12 overflow-x-auto">
        {compared.length === 0 ? (
          // Empty state
          <div className="text-center py-24">
            <div
              className="w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center mx-auto mb-6"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <Plus size={32} style={{ color: "#555" }} />
            </div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "#F9F9F9" }}>
              No compounds selected
            </h2>
            <p className="text-sm mb-8" style={{ color: "#666" }}>
              Start by adding compounds from the catalog to compare.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
              style={{ backgroundColor: "#C9A24B", color: "#010101" }}
            >
              Browse catalog <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#F9F9F9" }}>
            <table className="w-full min-w-[560px] border-collapse">
              {/* Product header */}
              <thead>
                <tr>
                  <th
                    className="text-left text-xs font-medium uppercase tracking-wider px-6 py-5 sticky left-0"
                    style={{
                      color: "#666666",
                      backgroundColor: "#F5F3F0",
                      width: "160px",
                      borderBottom: "1px solid #ECEAE4",
                    }}
                  >
                    Attribute
                  </th>
                  {compared.map((p) => (
                    <th
                      key={p.slug}
                      className="text-center px-4 py-5 relative"
                      style={{ borderBottom: "1px solid #ECEAE4", minWidth: "200px" }}
                    >
                      <button
                        onClick={() => removeSlug(p.slug)}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-black/10"
                        style={{ backgroundColor: "#ECEAE4", color: "#666" }}
                        aria-label={`Remove ${p.name}`}
                      >
                        <X size={10} />
                      </button>
                      <ProductThumbnail product={p} />
                      <div className="mt-3">
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-sm font-semibold hover:opacity-70 transition-opacity block"
                          style={{ color: "#010101" }}
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs mt-1 leading-tight" style={{ color: "#666666" }}>
                          {p.tagline.slice(0, 60)}{p.tagline.length > 60 ? "…" : ""}
                        </p>
                        <span
                          className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: "#F0EDE7", color: "#7F7F7D" }}
                        >
                          {p.category}
                        </span>
                      </div>
                    </th>
                  ))}
                  {/* Add slot(s) */}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <AddSlot key={`slot-${i}`} onAdd={addSlug} existing={slugs} />
                  ))}
                </tr>
              </thead>

              {/* Data rows */}
              <tbody>
                {ROW_DEFS.map((row, rowIdx) => (
                  <tr
                    key={row.label}
                    style={{ backgroundColor: rowIdx % 2 === 0 ? "#F9F9F9" : "#F9F8F4" }}
                  >
                    <td
                      className="px-6 py-3 text-xs font-medium sticky left-0"
                      style={{
                        color: "#666666",
                        backgroundColor: rowIdx % 2 === 0 ? "#F5F3F0" : "#EEECE8",
                        borderBottom: "1px solid #ECEAE4",
                      }}
                    >
                      {row.label}
                    </td>
                    {compared.map((p) => {
                      const val = getCellValue(p, row.key);
                      return (
                        <td
                          key={p.slug}
                          className="px-4 py-3 text-sm text-center"
                          style={{ color: "#333", borderBottom: "1px solid #ECEAE4" }}
                        >
                          {row.badge ? (
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
                            >
                              {val}
                            </span>
                          ) : row.strong ? (
                            <span className="font-semibold text-base">{val}</span>
                          ) : (
                            val
                          )}
                        </td>
                      );
                    })}
                    {/* Empty cells for add slots */}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <td
                        key={`empty-${i}`}
                        className="px-4 py-3"
                        style={{ borderBottom: "1px solid #ECEAE4" }}
                      />
                    ))}
                  </tr>
                ))}

                {/* CTA row */}
                <tr style={{ backgroundColor: "#F5F3F0" }}>
                  <td
                    className="px-6 py-4 text-xs font-medium sticky left-0"
                    style={{ color: "#666666", backgroundColor: "#EEECE8" }}
                  >
                    &nbsp;
                  </td>
                  {compared.map((p) => (
                    <td key={p.slug} className="px-4 py-4 text-center">
                      <Link
                        href={`/products/${p.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors hover:opacity-80"
                        style={{ backgroundColor: "#010101", color: "#F9F9F9" }}
                      >
                        View details <ArrowRight size={10} />
                      </Link>
                    </td>
                  ))}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <td key={`empty-cta-${i}`} className="px-4 py-4" />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="container-nex pb-16">
        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "#111", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <h3 className="font-semibold mb-4" style={{ color: "#F9F9F9" }}>
            Tips for Comparing Research Compounds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Purity matters",
                body: "All Nexphoria compounds are HPLC-verified. Higher purity reduces confounders in research models.",
              },
              {
                title: "Check storage compatibility",
                body: "When combining compounds in a protocol, ensure storage requirements are aligned — most peptides require −20°C lyophilized.",
              },
              {
                title: "Use the Protocol Tools",
                body: "Once you've selected your compounds, use the Reconstitution Calculator and Dosing Planner to design your protocol.",
              },
            ].map((tip) => (
              <div key={tip.title}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#C9A24B" }}>
                  {tip.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#666" }}>
                  {tip.body}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/tools/reconstitution-calculator"
              className="text-xs px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: "rgba(201,162,75,0.15)", color: "#C9A24B", border: "1px solid rgba(201,162,75,0.3)" }}
            >
              Reconstitution Calculator
            </Link>
            <Link
              href="/tools/dosing-frequency-planner"
              className="text-xs px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: "rgba(201,162,75,0.15)", color: "#C9A24B", border: "1px solid rgba(201,162,75,0.3)" }}
            >
              Dosing Planner
            </Link>
            <Link
              href="/tools/stack-builder"
              className="text-xs px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: "rgba(201,162,75,0.15)", color: "#C9A24B", border: "1px solid rgba(201,162,75,0.3)" }}
            >
              Stack Builder
            </Link>
            <Link
              href="/compounds"
              className="text-xs px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: "rgba(201,162,75,0.15)", color: "#C9A24B", border: "1px solid rgba(201,162,75,0.3)" }}
            >
              Compounds Index
            </Link>
          </div>
        </div>
      </div>

      {/* Popular comparisons */}
      <div className="container-nex pb-16">
        <h3
          className="font-semibold mb-6"
          style={{ color: "#F9F9F9", fontFamily: "var(--font-display)" }}
        >
          Popular Comparisons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "BPC-157 vs TB-500", slugs: "bpc-157,tb-500" },
            { label: "Semaglutide vs Tirzepatide", slugs: "semaglutide,tirzepatide" },
            { label: "Semaglutide vs Tirzepatide vs Retatrutide", slugs: "semaglutide,tirzepatide,retatrutide" },
            { label: "CJC-1295 vs Sermorelin vs Tesamorelin", slugs: "cjc-1295-no-dac,sermorelin,tesamorelin" },
            { label: "Ipamorelin vs GHRP-2 vs GHRP-6", slugs: "ipamorelin,ghrp-2,ghrp-6" },
            { label: "NAD+ vs Epitalon vs MOTS-c", slugs: "nad-plus,epitalon,mots-c" },
          ].map((preset) => (
            <Link
              key={preset.slugs}
              href={`/compare?slugs=${preset.slugs}`}
              onClick={() => {
                const newSlugs = preset.slugs.split(",").filter((s) => products.some((p) => p.slug === s));
                setSlugs(newSlugs);
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl border transition-colors hover:border-[#C9A24B] group"
              style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#111" }}
            >
              <span className="text-sm" style={{ color: "#F9F9F9" }}>
                {preset.label}
              </span>
              <ArrowRight size={14} style={{ color: "#555" }} className="group-hover:text-[#C9A24B] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* RUO disclaimer */}
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="container-nex py-6">
          <p className="text-xs text-center" style={{ color: "#555" }}>
            All compounds are for research use only. Not for human or veterinary diagnostic, therapeutic, or clinical use.
          </p>
        </div>
      </div>
    </div>
  );
}
