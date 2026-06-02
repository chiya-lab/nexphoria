import type { Metadata } from "next";
import Script from "next/script";
import ProductsClient from "./client";
import Breadcrumb from "@/components/Breadcrumb";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

export const metadata: Metadata = {
  title: "Catalog — Research Compounds | Nexphoria",
  description:
    "14 research compounds. Lot-traceable. Cold-chain shipped. HPLC-verified purity with full Certificate of Analysis. BPC-157, TB-500, Semaglutide, GHK-Cu, and more. Research use only.",
  alternates: {
    canonical: "https://nexphoria.com/products",
  },
  openGraph: {
    title: "Catalog — Research Compounds | Nexphoria",
    description:
      "14 research compounds. Lot-traceable. Cold-chain shipped. HPLC-verified purity with full Certificate of Analysis.",
    url: "https://nexphoria.com/products",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Research Compound Catalog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalog — Research Compounds | Nexphoria",
    description: "14 research compounds with HPLC-verified purity and Certificate of Analysis.",
    images: ["/og-image.jpg"],
  },
};

export default function ProductsPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nexphoria Research Compound Catalog",
    description:
      "Catalog of research compounds with HPLC-verified purity and Certificate of Analysis.",
    numberOfItems: MOCK_PRODUCTS.length,
    itemListElement: MOCK_PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://nexphoria.com/products/${p.slug}`,
      name: p.name,
      item: {
        "@type": "Product",
        name: p.name,
        sku: p.slug,
        category: p.category,
        url: `https://nexphoria.com/products/${p.slug}`,
        brand: { "@type": "Brand", name: "Nexphoria" },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: p.price.toFixed(2),
          availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `https://nexphoria.com/products/${p.slug}`,
        },
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nexphoria.com" },
      { "@type": "ListItem", position: 2, name: "Catalog", item: "https://nexphoria.com/products" },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Catalog — Research Compounds",
    description: "Nexphoria research compound catalog. Lot-traceable, cold-chain shipped.",
    url: "https://nexphoria.com/products",
    isPartOf: { "@type": "WebSite", url: "https://nexphoria.com" },
  };

  return (
    <main style={{ backgroundColor: "var(--ink)" }}>
      <Script
        id="products-itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Script
        id="products-collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <Script
        id="products-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Header band */}
      <section className="ppr-grid-hex px-6 pt-32 pb-12 md:pt-40 md:pb-16" style={{ borderBottom: "1px solid var(--steel)" }}>
        <div className="mx-auto max-w-[1280px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Catalog" }]} variant="dark" className="mb-6" />
          <span
            className="mb-5 block text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Research Compounds
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 7vw, 56px)",
              fontWeight: 600,
              color: "var(--platinum)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            Catalog
          </h1>
          <p
            className="mt-4 text-[15px]"
            style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", maxWidth: 560, lineHeight: 1.6 }}
          >
            {MOCK_PRODUCTS.length} research compounds. Lot-traceable. Cold-chain shipped.
          </p>
        </div>
      </section>

      {/* RUO disclaimer band */}
      <div style={{ borderBottom: "1px solid var(--steel)", backgroundColor: "var(--ink-2)" }}>
        <div className="mx-auto max-w-[1280px] px-6 py-3">
          <p
            className="text-center text-[10px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--silver-3)" }}
          >
            All compounds for qualified research use only — not for human consumption, diagnostic, or therapeutic use.
          </p>
        </div>
      </div>

      <div className="pt-12">
        <ProductsClient />
      </div>
    </main>
  );
}
