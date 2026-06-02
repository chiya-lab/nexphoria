import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { products } from "@/lib/products";
import PprProductDetail from "@/components/pdp/PprProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// Slugs that have dedicated OG images
const OG_IMAGE_SLUGS = new Set([
  "bpc-157",
  "semaglutide",
  "tirzepatide",
  "retatrutide",
  "mk-677",
  "tb-500",
  "nad-plus",
  "ghk-cu",
  "cjc-1295-ipamorelin",
  "pt-141",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  const ogImage = OG_IMAGE_SLUGS.has(slug)
    ? `https://nexphoria.com/og/products/${slug}.png`
    : "https://nexphoria.com/og-image.jpg";

  return {
    title: `${product.name} ${product.size} — ${product.category}`,
    description: `${product.tagline} CAS ${product.casNumber}. ${product.purity} purity by HPLC. Research-grade peptides for qualified laboratories.`,
    openGraph: {
      title: `${product.name} — Nexphoria Research`,
      description: `${product.tagline} CAS ${product.casNumber}. ${product.purity} purity. Research-grade.`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${product.name} research peptide`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Nexphoria Research`,
      description: `${product.tagline} CAS ${product.casNumber}.`,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = product.relatedSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const ogImage = OG_IMAGE_SLUGS.has(slug)
    ? `https://nexphoria.com/og/products/${slug}.png`
    : "https://nexphoria.com/og-image.jpg";

  // Determine the active price (first dosage price or base price)
  const activePrice = product.dosages?.[0]?.price ?? product.price;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nexphoria.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://nexphoria.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `https://nexphoria.com/products?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `https://nexphoria.com/products/${product.slug}`,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: `${product.tagline} ${product.description}`,
    image: ogImage,
    url: `https://nexphoria.com/products/${product.slug}`,
    sku: product.slug,
    mpn: product.casNumber,
    brand: {
      "@type": "Brand",
      name: "Nexphoria",
    },
    offers: {
      "@type": "Offer",
      url: `https://nexphoria.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: activePrice.toFixed(2),
      availability: product.comingSoon
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Nexphoria",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Purity",
        value: product.purity,
      },
      {
        "@type": "PropertyValue",
        name: "CAS Number",
        value: product.casNumber,
      },
      {
        "@type": "PropertyValue",
        name: "Molecular Weight",
        value: product.molecularWeight,
      },
      {
        "@type": "PropertyValue",
        name: "Storage",
        value: product.storage,
      },
      {
        "@type": "PropertyValue",
        name: "Appearance",
        value: product.appearance,
      },
    ],
  };

  return (
    <>
      <Script
        id={`product-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id={`product-breadcrumb-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <PprProductDetail product={product} paired={related} />
    </>
  );
}
