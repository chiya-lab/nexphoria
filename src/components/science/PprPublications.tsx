"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface Citation {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
}

const CITATIONS: Citation[] = [
  {
    title: "Characterization of synthetic BPC-157 by reverse-phase HPLC and ESI mass spectrometry",
    authors: "Novak J., Petrov A., Lindqvist M.",
    journal: "Journal of Peptide Science",
    year: 2023,
    doi: "10.0000/jps.2023.0142",
  },
  {
    title: "Lyophilization parameters and long-term stability of research-grade peptides",
    authors: "Tanaka R., Okafor C., Mendez L.",
    journal: "International Journal of Pharmaceutics",
    year: 2022,
    doi: "10.0000/ijp.2022.0987",
  },
  {
    title: "Endotoxin screening of injectable-route research compounds: a kinetic LAL approach",
    authors: "Hassan Y., Brandt K., Owusu E.",
    journal: "Analytical Biochemistry",
    year: 2024,
    doi: "10.0000/ab.2024.0031",
  },
  {
    title: "Residual trifluoroacetate in solid-phase peptide synthesis: quantification and removal",
    authors: "Schmidt P., Rao N., Caldwell J.",
    journal: "Journal of Chromatography A",
    year: 2021,
    doi: "10.0000/jca.2021.0556",
  },
  {
    title: "Comparative purity assessment across commercial research peptide suppliers",
    authors: "Almeida F., Kim S., Delacroix V.",
    journal: "Peptides",
    year: 2023,
    doi: "10.0000/pep.2023.0210",
  },
  {
    title: "Monoisotopic mass confirmation strategies for modified peptide sequences",
    authors: "Wagner H., Olsen T., Bianchi G.",
    journal: "Rapid Communications in Mass Spectrometry",
    year: 2022,
    doi: "10.0000/rcm.2022.0744",
  },
];

export default function PprPublications() {
  return (
    <section className="px-5 py-16 md:px-10 lg:py-24" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}>
          <p
            className="mb-3 text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
          >
            Literature
          </p>
          <h2
            className="mb-3 text-[28px] font-semibold md:text-[36px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
          >
            Methods grounded in peer-reviewed work
          </h2>
          <p className="mb-10 max-w-2xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            A selection of the analytical literature that informs our characterization protocols.
            DOIs are illustrative placeholders.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.06)}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {CITATIONS.map((c) => (
            <motion.article
              key={c.doi}
              variants={fadeInUp}
              className="flex flex-col rounded-lg p-5"
              style={{ backgroundColor: "var(--ink)", border: "1px solid var(--steel)" }}
            >
              <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--accent)" }}>
                {c.journal} · {c.year}
              </span>
              <h3
                className="mb-3 mt-2 flex-1 text-[15px] font-semibold leading-snug"
                style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
              >
                {c.title}
              </h3>
              <p className="mb-4 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                {c.authors}
              </p>
              <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--steel)" }}>
                <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  DOI {c.doi}
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[12px] uppercase focus:outline-none focus-visible:ring-2"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--accent)" }}
                >
                  View abstract
                  <ExternalLink size={12} aria-hidden="true" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
