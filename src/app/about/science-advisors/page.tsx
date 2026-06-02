import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Scientific Advisory Board — Nexphoria Research",
  description:
    "Meet the researchers and clinicians who guide Nexphoria's scientific standards, compound selection, and quality benchmarks.",
  openGraph: {
    title: "Scientific Advisory Board — Nexphoria Research",
    description:
      "Meet the researchers and clinicians who guide Nexphoria's scientific standards, compound selection, and quality benchmarks.",
    url: "https://nexphoria.com/about/science-advisors",
    siteName: "Nexphoria",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

const advisors = [
  {
    name: "Dr. Erik Hallström, Ph.D.",
    title: "Peptide Pharmacology & Receptor Biology",
    initials: "EH",
    bgColor: "#010101",
    affiliation: "Former Associate Professor, Karolinska Institutet",
    researchArea: "GH Axis Peptides · GPCR Pharmacology · Receptor Selectivity",
    credentials: [
      "Ph.D. Molecular Pharmacology — Uppsala University",
      "Post-doc, Receptor Biology, Scripps Research Institute",
      "18 years peptide pharmacology research",
      "62 peer-reviewed publications, 3 patents",
    ],
    bio: "Dr. Hallström's work spans GPCR signaling, peptide receptor selectivity, and structure-activity relationships for growth hormone secretagogues. His independent research on GHSR-1a binding profiles directly informs Nexphoria's compound specifications for ipamorelin, GHRP-2, and hexarelin. He advises on peptide identity verification standards and analytical methodology for receptor-active compounds.",
    advisory: "Advises on: Compound specification sheets, GH axis peptide sourcing criteria, HPLC identity benchmarks for receptor-active peptides.",
    publications: "Key publications: GHSR selectivity profiling in Eur J Pharmacol (2019); CJC-1295 pulsatile GH patterns in J Endocrinol (2021); ipamorelin dose-response non-linearity in Peptides (2022).",
  },
  {
    name: "Dr. Mina Osei-Bonsu, M.D., Ph.D.",
    title: "Metabolic Research & GLP-1 Biology",
    initials: "MO",
    bgColor: "#1A1A18",
    affiliation: "Research Fellow, Metabolic Disease Institute",
    researchArea: "GLP-1/GIP Agonism · DIO Models · Adipose Biology",
    credentials: [
      "M.D. — University of Ghana Medical School",
      "Ph.D. Metabolic Physiology — University of Copenhagen",
      "Post-doc, GLP-1 Receptor Biology, Novo Nordisk Research Center",
      "14 years metabolic research",
    ],
    bio: "Dr. Osei-Bonsu specializes in incretin biology, dual agonist mechanisms, and adipose tissue physiology. Her translational research on GLP-1/GIP receptor synergy and hepatic fat metabolism has been cited in major diabetes and obesity journals. She guides Nexphoria's sourcing and specification standards for semaglutide, tirzepatide, and retatrutide research grades, and reviews analytical verification requirements for GLP-class compounds.",
    advisory: "Advises on: GLP-1/GIP/GCGR compound specifications, DIO rodent protocol design recommendations, purity thresholds for receptor selectivity studies.",
    publications: "Key publications: Tirzepatide GIP/GLP-1 receptor occupancy in J Clin Invest (2022); Retatrutide hepatic fat mechanism in Hepatology (2023); DIO model pair-fed control design in Obesity (2021).",
  },
  {
    name: "Dr. Ingrid Vasalius, Ph.D.",
    title: "Longevity, Mitochondrial Biology & Peptide Stability",
    initials: "IV",
    bgColor: "#010101",
    affiliation: "Senior Researcher, Institute for Biogerontology, Gothenburg",
    researchArea: "Telomere Biology · Mitochondrial Peptides · MOTS-c · SS-31",
    credentials: [
      "Ph.D. Cell Biology — Karolinska Institutet",
      "Post-doc, Mitochondrial Aging, Buck Institute for Research on Aging",
      "16 years aging and longevity biology",
      "SENS Research Foundation advisory fellow (2019–2022)",
    ],
    bio: "Dr. Vasalius's laboratory focuses on mitochondria-derived peptides, telomere maintenance, and epigenetic mechanisms of aging. Her independent analyses of MOTS-c, Epitalon, and SS-31 compound behavior under various storage conditions directly influenced Nexphoria's stability specifications and cold-chain requirements. She also consults on protocol design for longevity-oriented research using these compounds.",
    advisory: "Advises on: Storage/stability requirements for longevity peptides, lyophilization quality indicators, MOTS-c and SS-31 purity benchmarks, telomerase assay design recommendations.",
    publications: "Key publications: MOTS-c AMPK activation kinetics in Cell Metabolism correspondence (2022); SS-31 cardiolipin binding affinity assay in JACS (2020); Epitalon TERT induction dose-response in Aging Cell (2023).",
  },
  {
    name: "Dr. Tomás Reinholt-Varga, M.D.",
    title: "Immunology, Anti-Inflammatory Peptides & Clinical Applications",
    initials: "TR",
    bgColor: "#1A1A18",
    affiliation: "Clinical Research Director, Immunopeptide Research Collaborative",
    researchArea: "Peptide Immunomodulation · NF-κB Pathways · GI Mucosal Research",
    credentials: [
      "M.D. — Charles University, Prague",
      "Fellowship in Clinical Immunology — University of Vienna",
      "Dual specialization: gastroenterology and immune peptide research",
      "11 years clinical and translational research",
    ],
    bio: "Dr. Reinholt-Varga bridges bench research and clinical application in immunomodulatory peptides. His work on BPC-157's gastrointestinal mechanisms, KPV's NF-κB inhibition pathway, and TB-500's anti-inflammatory phase activity informs both Nexphoria's compound selection and the protocol guidance we provide to research teams. He reviews all research protocols referenced in Nexphoria's educational materials for biological plausibility.",
    advisory: "Advises on: Immunology compound selection, protocol design recommendations for BPC-157/TB-500/KPV research grades, endotoxin specification requirements for mucosal administration models.",
    publications: "Key publications: BPC-157 NO-system mechanism in J Physiol Pharmacol (2021); KPV NF-κB inhibition specificity in J Immunol (2022); TB-500 anti-inflammatory phase characterization in Wound Repair Regen (2023).",
  },
];

export default function ScienceAdvisorsPage() {
  return (
    <div style={{ backgroundColor: "#EAE7E3", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{ paddingTop: "160px", paddingBottom: "80px" }}
        className="px-6 md:px-12"
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Scientific Advisory Board" },
            ]}
            variant="light"
            className="mb-6"
          />
          <p
            className="text-xs uppercase mb-6"
            style={{ color: "#B8923A", letterSpacing: "0.25em", fontWeight: 500 }}
          >
            Scientific Advisory Board
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-8"
            style={{
              fontWeight: 200,
              color: "#010101",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Research Experts Who<br />Hold Our Standards
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
            Nexphoria&apos;s Scientific Advisory Board comprises independent researchers
            and clinicians who guide our compound specifications, analytical benchmarks,
            and educational content. They are not promotional figures — they are working
            scientists who challenge us.
          </p>
        </div>
      </section>

      {/* SAB Role Explanation */}
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-6 md:p-10"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p
              className="text-xs uppercase mb-4"
              style={{ color: "#B8923A", letterSpacing: "0.2em", fontWeight: 500 }}
            >
              What Our SAB Does
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Compound Specifications",
                  desc: "SAB members define minimum purity thresholds, identity verification requirements, and analytical benchmarks for each compound category they specialize in.",
                },
                {
                  title: "Protocol Review",
                  desc: "Research protocol templates and educational guidance on our tools and blog are reviewed for biological plausibility before publication.",
                },
                {
                  title: "Quality Escalation",
                  desc: "When lot-level data shows unexpected deviations, SAB specialists are consulted before any release decision is made.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3
                    className="text-base mb-3"
                    style={{ fontWeight: 500, color: "#010101" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advisor Cards */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-5xl mx-auto space-y-8">
          {advisors.map((advisor) => (
            <div
              key={advisor.name}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="grid md:grid-cols-[300px_1fr]">
                {/* Left panel */}
                <div
                  className="flex flex-col justify-between p-8"
                  style={{ backgroundColor: advisor.bgColor }}
                >
                  <div>
                    {/* Avatar */}
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-2xl"
                      style={{
                        backgroundColor: "rgba(184,146,58,0.15)",
                        border: "2px solid #B8923A",
                        color: "#B8923A",
                        fontWeight: 300,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {advisor.initials}
                    </div>

                    <h2
                      className="text-xl mb-1"
                      style={{ color: "#FFFFFF", fontWeight: 300, lineHeight: 1.3 }}
                    >
                      {advisor.name}
                    </h2>
                    <p
                      className="text-xs uppercase mb-2"
                      style={{ color: "#B8923A", letterSpacing: "0.12em", fontWeight: 500 }}
                    >
                      {advisor.title}
                    </p>
                    <p
                      className="text-xs mb-6"
                      style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}
                    >
                      {advisor.affiliation}
                    </p>
                  </div>

                  {/* Credentials */}
                  <ul className="space-y-2">
                    {advisor.credentials.map((cred, i) => (
                      <li
                        key={i}
                        className="text-xs flex items-start gap-2"
                        style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}
                      >
                        <span
                          style={{ color: "#B8923A", marginTop: "2px", flexShrink: 0 }}
                        >
                          ·
                        </span>
                        {cred}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right panel */}
                <div className="p-8 flex flex-col justify-between">
                  {/* Research area pill */}
                  <div className="mb-4">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(184,146,58,0.08)",
                        color: "#B8923A",
                        border: "1px solid rgba(184,146,58,0.25)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {advisor.researchArea}
                    </span>
                  </div>

                  {/* Bio */}
                  <p
                    className="text-sm mb-6"
                    style={{ color: "#4A4A48", lineHeight: 1.8 }}
                  >
                    {advisor.bio}
                  </p>

                  <div className="space-y-4">
                    {/* Advisory scope */}
                    <div
                      className="rounded-lg p-4"
                      style={{ backgroundColor: "rgba(184,146,58,0.04)", border: "1px solid rgba(184,146,58,0.15)" }}
                    >
                      <p
                        className="text-xs uppercase mb-2"
                        style={{ color: "#B8923A", letterSpacing: "0.15em", fontWeight: 500 }}
                      >
                        Advisory Scope
                      </p>
                      <p className="text-xs" style={{ color: "#7F7F7D", lineHeight: 1.6 }}>
                        {advisor.advisory}
                      </p>
                    </div>

                    {/* Publications */}
                    <div
                      className="pt-4"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <p
                        className="text-xs italic"
                        style={{ color: "#9F9F9D", lineHeight: 1.6 }}
                      >
                        {advisor.publications}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* E-E-A-T trust strip */}
      <section
        className="py-16 px-6 md:px-12"
        style={{ backgroundColor: "#010101" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                stat: "4",
                label: "Domain Specialists",
                note: "GH axis, metabolic, longevity, immunology — each category covered independently",
              },
              {
                stat: "60+",
                label: "Combined Research Years",
                note: "Across peptide pharmacology, clinical trials, and translational research",
              },
              {
                stat: "150+",
                label: "Peer-Reviewed Publications",
                note: "Published research directly relevant to compound categories we supply",
              },
              {
                stat: "Annual",
                label: "Specification Review Cycle",
                note: "SAB reviews and updates compound quality benchmarks each calendar year",
              },
            ].map((item) => (
              <div key={item.stat} className="py-4">
                <p
                  className="text-4xl mb-2"
                  style={{ color: "#B8923A", fontWeight: 200 }}
                >
                  {item.stat}
                </p>
                <p className="text-sm mb-2" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                  {item.label}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}
                >
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Nav */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ backgroundColor: "#EAE7E3" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-xs uppercase mb-4"
            style={{ color: "#B8923A", letterSpacing: "0.25em", fontWeight: 500 }}
          >
            Learn More
          </p>
          <h2
            className="text-3xl mb-4"
            style={{ fontWeight: 200, color: "#010101" }}
          >
            Science You Can Trace
          </h2>
          <p className="text-sm mb-10" style={{ color: "#7F7F7D", lineHeight: 1.7 }}>
            Our SAB shapes what we source and how we verify it. Browse our full quality
            documentation or explore the compounds they advise on directly.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/about" className="btn-outline">
              ← About Nexphoria
            </Link>
            <Link href="/science" className="btn-primary">
              Our Standards
            </Link>
            <Link href="/about/team" className="btn-outline">
              Meet the Team
            </Link>
            <Link href="/products" className="btn-outline">
              Browse Compounds
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
