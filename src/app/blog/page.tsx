import type { Metadata } from "next";
import { articles } from "@/lib/blog";
import { EmailCapture } from "@/components/email-capture";
import { categoryToSlug } from "./category/[category]/page";
import PprJournalIndex, { type JournalCard } from "@/components/journal/PprJournalIndex";
import { estimateCitations } from "@/lib/journal-meta";

export const metadata: Metadata = {
  title: "Journal | Nexphoria",
  description:
    "Methodology, compound deep-dives, and primary-literature reviews. The Nexphoria research journal, written for the bench.",
  openGraph: {
    title: "Journal | Nexphoria",
    description:
      "Methodology, compound deep-dives, and primary-literature reviews from the Nexphoria research team.",
    url: "https://nexphoria.com/blog",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Nexphoria Journal",
  url: "https://nexphoria.com/blog",
  description:
    "Methodology, compound deep-dives, and primary-literature reviews from the Nexphoria research team.",
  publisher: {
    "@type": "Organization",
    name: "Nexphoria",
    url: "https://nexphoria.com",
  },
};

export default function JournalIndexPage() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const cards: JournalCard[] = sorted.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    category: a.category,
    categorySlug: categoryToSlug(a.category),
    readMinutes: a.readMinutes,
    publishedAt: a.publishedAt,
    citations: estimateCitations(a.slug, a.readMinutes),
  }));

  // Real categories present in the data, ordered by article count (desc).
  const counts = new Map<string, number>();
  for (const a of articles) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  const categories = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <main style={{ backgroundColor: "var(--ink)" }}>
        {/* Header band */}
        <section className="ppr-grid-hex px-6 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-[1200px]">
            <p
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
            >
              Nexphoria Research
            </p>
            <h1
              className="mt-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 9vw, 80px)",
                fontWeight: 600,
                color: "var(--platinum)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
              }}
            >
              Journal
            </h1>
            <p
              className="mt-5 max-w-[640px] text-[18px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", lineHeight: 1.55 }}
            >
              Methodology, compound deep-dives, and primary-literature reviews.
            </p>
          </div>
        </section>

        {/* Filters + search + grid (client) */}
        <section className="pb-24">
          <PprJournalIndex articles={cards} categories={categories} />
        </section>

        {/* Newsletter capture */}
        <section className="px-6 py-24" style={{ backgroundColor: "var(--ink-2)" }}>
          <div className="mx-auto max-w-[640px] text-center">
            <p
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
            >
              Lab notes, monthly
            </p>
            <h2
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
            >
              Primary literature, summarized for the bench.
            </h2>
            <p
              className="mx-auto mt-4 max-w-[520px] text-[15px]"
              style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.55 }}
            >
              New compound reviews and methodology notes, first Monday of every month. No promotions.
            </p>
            <div className="mx-auto mt-8 max-w-[480px]">
              <EmailCapture variant="dark" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
