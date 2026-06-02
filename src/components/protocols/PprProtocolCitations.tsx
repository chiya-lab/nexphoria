import { citationsByDoi } from "@/lib/mock-citations";

interface PprProtocolCitationsProps {
  dois: string[];
}

export default function PprProtocolCitations({ dois }: PprProtocolCitationsProps) {
  const citations = citationsByDoi(dois);
  if (citations.length === 0) return null;

  return (
    <section className="px-6 py-16 md:py-20" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            References
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--platinum)" }}>
          Selected literature.
        </h2>

        <ol className="space-y-5">
          {citations.map((c, idx) => (
            <li key={c.doi} className="flex gap-4">
              <span
                className="flex-shrink-0 text-sm"
                style={{ color: "var(--silver-3)", fontFamily: "var(--font-mono)", width: 24 }}
              >
                {idx + 1}.
              </span>
              <div className="text-sm" style={{ lineHeight: 1.6 }}>
                <span style={{ color: "var(--silver-1)" }}>{c.authors} </span>
                <span style={{ color: "var(--platinum)" }}>{c.title} </span>
                <span style={{ color: "var(--silver-2)", fontStyle: "italic" }}>{c.journal}</span>
                <span style={{ color: "var(--silver-2)" }}>. {c.year};{c.detail}. </span>
                <a
                  href={`https://doi.org/${c.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--accent-glow)]"
                  style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
                >
                  doi:{c.doi}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
