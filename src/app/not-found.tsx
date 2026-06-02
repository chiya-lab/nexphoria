"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/products";
import { hasProductPhoto, getProductImagePath } from "@/lib/product-images";
import VialSVG from "@/components/VialSVG";
import { getCategoryColor } from "@/lib/vial-colors";
import { useCart } from "@/lib/cart";

// Curated recommended slugs — POPULAR picks + category diversity
const RECOMMENDED_SLUGS = [
  "bpc-157",
  "semaglutide",
  "cjc-1295-ipamorelin",
  "tb-500",
  "sermorelin",
  "mk-677",
];

function RecommendedCard({ product }: { product: (typeof products)[0] }) {
  const { addItem, openDrawer } = useCart();
  const basePrice =
    product.dosages && product.dosages.length > 0
      ? Math.min(...product.dosages.map((d) => d.price))
      : product.price;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, "vial", product.dosages?.[0], 1);
    openDrawer();
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      style={{ textDecoration: "none" }}
    >
      <div
        className="flex flex-col h-full transition-all duration-300"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "6px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#B8A44C";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 24px rgba(196,162,101,0.10)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E5E5";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Product image */}
        <div
          className="w-full overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{
            height: "160px",
            backgroundColor: hasProductPhoto(product.slug) ? "#F7F7F7" : "#1A1A18",
            borderRadius: "5px 5px 0 0",
          }}
        >
          {hasProductPhoto(product.slug) ? (
            <img
              src={getProductImagePath(product.slug)}
              alt={product.name}
              width={280}
              height={160}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full p-6">
              <VialSVG
                name={product.name}
                size={product.dosages?.[0]?.size || product.size || "5mg"}
                capColor={getCategoryColor(product.category)}
                className="max-h-full"
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
          <p
            className="text-[9px] uppercase font-medium mb-1.5"
            style={{ letterSpacing: "0.16em", color: "#B8A44C" }}
          >
            {product.category}
          </p>
          <h3
            className="text-sm font-normal mb-1 leading-snug"
            style={{
              color: "#1A1A1A",
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 400,
            }}
          >
            {product.name}
          </h3>
          <p
            className="text-xs leading-relaxed mb-3 flex-1 line-clamp-2"
            style={{ color: "#888" }}
          >
            {product.tagline}
          </p>

          {/* Price + CTA */}
          <div
            className="pt-3 flex items-center justify-between"
            style={{ borderTop: "1px solid #EBEBEB" }}
          >
            <span className="text-sm font-medium" style={{ color: "#B8A44C" }}>
              {product.dosages && product.dosages.length > 1 ? "From " : ""}$
              {basePrice}
            </span>
            <button
              onClick={handleAdd}
              className="text-[9px] font-medium uppercase px-3.5 py-2 transition-all duration-200"
              style={{
                letterSpacing: "0.15em",
                color: "#1A1A1A",
                border: "1px solid #1A1A1A",
                borderRadius: "999px",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#1A1A1A";
                (e.currentTarget as HTMLButtonElement).style.color = "#F9F9F9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A";
              }}
              aria-label={`Add ${product.name} to order`}
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Animated 404 digit counter
function AnimatedDigit({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 900;
    const raf = requestAnimationFrame(function tick(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return <>{value}</>;
}

export default function NotFound() {
  const recommended = RECOMMENDED_SLUGS
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as (typeof products)[0][];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F9F9" }}
    >
      {/* Hero section */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: "60vh",
          backgroundColor: "#0F0F0E",
          paddingTop: "7rem",
          paddingBottom: "5rem",
        }}
      >
        {/* Subtle radial glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(196,162,101,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Thin top rule */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "80px",
            background:
              "linear-gradient(to bottom, transparent, rgba(196,162,101,0.5))",
          }}
        />

        {/* Gold label */}
        <p
          className="uppercase tracking-widest text-xs font-light mb-8"
          style={{ color: "#B8A44C", letterSpacing: "0.35em" }}
        >
          Error 404
        </p>

        {/* Animated large 404 */}
        <div
          aria-hidden
          className="select-none font-light leading-none mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 20vw, 14rem)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(196,162,101,0.25)",
            letterSpacing: "-0.03em",
          }}
        >
          <AnimatedDigit target={4} />
          <AnimatedDigit target={0} />
          <AnimatedDigit target={4} />
        </div>

        <h1
          className="font-light text-center mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
            color: "#F5F0E8",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          Compound Not Found
        </h1>

        <p
          className="text-center max-w-sm mx-auto leading-relaxed mb-10 px-6"
          style={{ color: "#7A7065", fontSize: "0.95rem" }}
        >
          This pathway doesn&rsquo;t exist in our catalog — or it may have been
          relocated. Browse our verified research compounds below.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase transition-all duration-200"
            style={{
              letterSpacing: "0.18em",
              color: "#0F0F0E",
              backgroundColor: "#B8A44C",
              padding: "12px 28px",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#A88B50";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#B8A44C";
            }}
          >
            Browse Catalog
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-light uppercase transition-all duration-200"
            style={{
              letterSpacing: "0.18em",
              color: "#B8A44C",
              border: "1px solid rgba(196,162,101,0.35)",
              padding: "12px 28px",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "#B8A44C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(196,162,101,0.35)";
            }}
          >
            Return Home
          </Link>
        </div>

        {/* Secondary quick links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 px-6">
          {[
            { href: "/products", label: "Catalog" },
            { href: "/science", label: "The Science" },
            { href: "/blog", label: "Research Journal" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase font-light transition-opacity duration-200 hover:opacity-100"
              style={{
                letterSpacing: "0.18em",
                color: "#7A7065",
                opacity: 0.85,
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom divider line */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "48px",
            background:
              "linear-gradient(to bottom, rgba(196,162,101,0.3), transparent)",
          }}
        />
      </section>

      {/* Recommended compounds section */}
      {recommended.length > 0 && (
        <section
          className="container-nex"
          style={{ paddingTop: "5rem", paddingBottom: "6rem" }}
        >
          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div
              aria-hidden
              style={{
                width: "32px",
                height: "1px",
                backgroundColor: "#B8A44C",
                marginBottom: "1.25rem",
              }}
            />
            <p
              className="uppercase text-[10px] font-medium tracking-widest mb-3"
              style={{ color: "#B8A44C", letterSpacing: "0.3em" }}
            >
              Recommended
            </p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                color: "#1A1A1A",
                letterSpacing: "-0.01em",
              }}
            >
              Most-Researched Compounds
            </h2>
            <p
              className="mt-3 max-w-xs mx-auto text-sm leading-relaxed"
              style={{ color: "#888" }}
            >
              While you&rsquo;re here — explore our most active research
              compounds, verified ≥99% purity.
            </p>
          </div>

          {/* Product grid */}
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {recommended.map((product) => (
              <RecommendedCard key={product.slug} product={product} />
            ))}
          </div>

          {/* View all link */}
          <div className="flex justify-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase transition-opacity duration-200 hover:opacity-60"
              style={{
                letterSpacing: "0.2em",
                color: "#1A1A1A",
                textDecoration: "none",
              }}
            >
              View Full Catalog
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <line
                  x1="2"
                  y1="7"
                  x2="12"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <polyline
                  points="8,3 12,7 8,11"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
