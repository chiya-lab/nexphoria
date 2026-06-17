import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/blog";
import Breadcrumb from "@/components/Breadcrumb";
import { categoryToSlug } from "./category/[category]/page";
import BlogIndexClient, { type BlogCardData } from "./BlogIndexClient";

export const metadata: Metadata = {
  title: "Research Blog | Nexphoria",
  description:
    "Research-focused articles on peptide biochemistry, quality testing, handling protocols, and sourcing standards. Written for researchers, by researchers.",
  openGraph: {
    title: "Research Blog | Nexphoria",
    description:
      "Research-focused articles on peptide biochemistry, quality testing, handling protocols, and sourcing standards.",
    url: "https://nexphoria.com/blog",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Nexphoria Research Blog",
  url: "https://nexphoria.com/blog",
  description:
    "Research-focused articles on peptide biochemistry, quality testing, cold-chain logistics, and compound handling.",
  publisher: {
    "@type": "Organization",
    name: "Nexphoria",
    url: "https://nexphoria.com",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const categoryColors: Record<string, string> = {
  "Research Fundamentals": "#B8A44C",
  "Quality & Testing": "#B8A44C",
  "Handling & Storage": "#B8A44C",
  "Compound Profiles": "#B8A44C",
};

export default function BlogIndexPage() {
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const [featured, ...rest] = sorted;

  const cardData: BlogCardData[] = rest.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    categorySlug: categoryToSlug(a.category),
    readMinutes: a.readMinutes,
    publishedAt: a.publishedAt,
    publishedLabel: formatDate(a.publishedAt),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div style={{ backgroundColor: "#F9F9F9" }}>
        {/* Hero */}
        <section
          className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20"
          style={{ backgroundColor: "#010101" }}
        >
          <div className="max-w-6xl mx-auto">
            <Breadcrumb
              variant="dark"
              className="mb-6"
              items={[
                { label: "Home", href: "/" },
                { label: "Research Journal" },
              ]}
            />
            <p
              className="eyebrow mb-5"
              style={{ color: "#B8A44C" }}
            >
              Nexphoria Research
            </p>
            <h1
              className="text-4xl md:text-5xl mb-6"
              style={{
                fontWeight: 500,
                color: "#F9F9F9",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              The research journal.
            </h1>
            <p
              className="text-lg max-w-2xl"
              style={{ fontWeight: 300, lineHeight: 1.6, color: "#A0A0A0" }}
            >
              Technical articles on peptide biochemistry, quality standards,
              handling protocols, and the science behind the compounds we
              supply.
            </p>
          </div>
        </section>

        {/* Featured article */}
        <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "#EAE7E3" }}>
          <div className="max-w-6xl mx-auto">
            <p
              className="text-xs uppercase tracking-widest mb-6"
              style={{ color: "#B8A44C" }}
            >
              Featured Article
            </p>
            <div
              className="rounded-2xl overflow-hidden group card-shadow"
              style={{
                border: "1px solid rgba(0,0,0,0.06)",
                borderTop: `3px solid ${categoryColors[featured.category] || "#C9DD69"}`,
                backgroundColor: "#F9F9F9",
              }}
            >
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Link
                    href={`/blog/category/${categoryToSlug(featured.category)}`}
                    className="text-xs uppercase tracking-widest px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor:
                        categoryColors[featured.category] || "#C9DD69",
                      color: "#010101",
                    }}
                  >
                    {featured.category}
                  </Link>
                  <span className="text-xs" style={{ color: "#A0A0A0" }}>
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="text-xs" style={{ color: "#A0A0A0" }}>
                    {featured.readMinutes} min read
                  </span>
                </div>
                <h2
                  className="text-2xl md:text-3xl mb-4"
                  style={{
                    fontWeight: 500,
                    color: "#010101",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: "inherit" }}
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p
                  className="text-base mb-6 max-w-2xl"
                  style={{ color: "#555", lineHeight: 1.7, fontWeight: 300 }}
                >
                  {featured.description}
                </p>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="text-sm inline-flex items-center gap-2"
                  style={{ color: "#B8923A", fontWeight: 500 }}
                >
                  Read article
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filterable article grid with load-more */}
        <BlogIndexClient articles={cardData} />

        {/* Bottom CTA */}
        <section
          className="px-6 py-20 md:py-28"
          style={{ backgroundColor: "#EAE7E3" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "#B8A44C" }}
            >
              Research Catalog
            </p>
            <h2
              className="text-3xl md:text-4xl mb-5 font-medium tracking-tight"
              style={{
                color: "#010101",
              }}
            >
              Ready to source?
            </h2>
            <p
              className="text-base mb-8 max-w-xl mx-auto"
              style={{ color: "#555", lineHeight: 1.7, fontWeight: 300 }}
            >
              Every compound in our catalog ships with lot-specific COAs from
              independent laboratories. ≥99% HPLC purity, verified identity,
              cold-chain handled.
            </p>
            <Link
              href="/products"
              className="btn-primary"
            >
              Browse the Catalog
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
