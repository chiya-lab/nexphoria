import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { protocols, getProtocol } from "@/lib/mock-protocols";
import ProtocolDetailClient from "./client";

export function generateStaticParams() {
  return protocols.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const protocol = getProtocol(slug);
  if (!protocol) return {};

  const url = `https://nexphoria.com/protocols/${protocol.slug}`;
  const description = `${protocol.tagline} A ${protocol.durationWeeks}-week research protocol summarizing typical research dosing observed in published literature. For research use only.`;

  return {
    title: `${protocol.name} | Nexphoria Research Protocols`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${protocol.name} | Nexphoria`,
      description,
      url,
      siteName: "Nexphoria",
      type: "website",
      images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: `${protocol.name} research protocol` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${protocol.name} | Nexphoria`,
      description,
      images: ["https://nexphoria.com/og-image.jpg"],
    },
  };
}

export default async function ProtocolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = getProtocol(slug);
  if (!protocol) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nexphoria.com/" },
      { "@type": "ListItem", position: 2, name: "Research Protocols", item: "https://nexphoria.com/protocols" },
      { "@type": "ListItem", position: 3, name: protocol.name },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://nexphoria.com/protocols/${protocol.slug}#faq`,
    url: `https://nexphoria.com/protocols/${protocol.slug}`,
    mainEntity: protocol.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ProtocolDetailClient protocol={protocol} />
    </>
  );
}
