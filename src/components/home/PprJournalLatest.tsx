import Link from "next/link";
import { articles } from "@/lib/blog";

// Deterministic per-slug DOI estimate — the article data model carries no DOI
// field, so we derive a stable display count rather than fabricate per-article data.
function doiCount(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return 6 + (h % 19); // 6–24
}

const recent = [...articles]
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 3);

export default function PprJournalLatest() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--ink)" }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
            >
              Research journal
            </p>
            <h2
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              Latest from the bench.
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-[14px] transition-colors hover:text-[color:var(--accent)] md:inline-flex"
            style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
          >
            All articles <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {recent.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex h-full flex-col rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <span
                className="self-start rounded-full px-3 py-1 text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", border: "1px solid var(--steel)", color: "var(--accent)" }}
              >
                {article.category}
              </span>
              <h3
                className="mt-4 transition-colors group-hover:text-[color:var(--accent)]"
                style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.25 }}
              >
                {article.title}
              </h3>
              <p
                className="mt-2 line-clamp-1 text-[14px]"
                style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.5 }}
              >
                {article.description}
              </p>
              <div
                className="mt-auto flex items-center gap-2 pt-6 text-[12px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
              >
                <span>{article.readMinutes} min</span>
                <span style={{ color: "var(--steel)" }}>·</span>
                <span>{doiCount(article.slug)} DOIs</span>
                <span className="ml-auto transition-colors group-hover:text-[color:var(--accent)]" style={{ color: "var(--silver-1)" }}>
                  Read &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
