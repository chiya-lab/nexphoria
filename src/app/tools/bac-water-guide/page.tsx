import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

export const metadata: Metadata = {
  title: "Bacteriostatic Water Guide: What It Is & How to Use It | Nexphoria",
  description:
    "Complete guide to bacteriostatic water (BAC water) for peptide reconstitution: what 0.9% benzyl alcohol does, how to mix, storage after opening, multi-use vial technique, and common mistakes.",
  openGraph: {
    title: "Bacteriostatic Water Guide — Nexphoria Research Tools",
    description:
      "Everything researchers need to know about BAC water: benzyl alcohol mechanism, reconstitution technique, storage after opening, and common mistakes to avoid.",
    url: "https://nexphoria.com/tools/bac-water-guide",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bacteriostatic Water Guide — Nexphoria",
    description:
      "Complete guide to bacteriostatic water for peptide reconstitution. Research use only.",
  },
};

const SECTIONS = [
  {
    id: "what-is",
    title: "What Is Bacteriostatic Water?",
  },
  {
    id: "benzyl-alcohol",
    title: "Why 0.9% Benzyl Alcohol?",
  },
  {
    id: "how-to-mix",
    title: "How to Reconstitute a Peptide Vial",
  },
  {
    id: "storage",
    title: "Storage After Reconstitution",
  },
  {
    id: "multi-use",
    title: "Multi-Use Vial Technique",
  },
  {
    id: "mistakes",
    title: "Common Mistakes",
  },
  {
    id: "bac-vs-sterile",
    title: "BAC Water vs. Sterile Water",
  },
  {
    id: "faq",
    title: "Quick Reference FAQ",
  },
];

export default function BacWaterGuidePage() {
  return (
    <div style={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="relative px-6 pt-32 pb-16 md:pt-40 md:pb-20"
        style={{ backgroundColor: "#010101" }}
      >
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: "BAC Water Guide" },
            ]}
          />
          <p
            className="text-xs uppercase tracking-widest mb-5"
            style={{ color: "#C9DD69" }}
          >
            Research Tools / Guide
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            Bacteriostatic Water
            <br />
            <span style={{ color: "#C9DD69" }}>Complete Research Guide</span>
          </h1>
          <p
            className="text-base md:text-lg max-w-xl mb-8"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            What BAC water is, why 0.9% benzyl alcohol matters, how to mix peptide vials correctly, and how to avoid the most common reconstitution errors.
          </p>
          <div
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-sm"
            style={{
              backgroundColor: "#1A1A18",
              border: "1px solid #2A2A28",
              color: "#A0A0A0",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            For research and laboratory use only
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="px-6 py-8 border-b" style={{ borderColor: "#ECEAE4", backgroundColor: "#FAFAF4" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#666666" }}>
            In This Guide
          </p>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm px-3 py-1.5 rounded-sm transition-colors"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DDDBD5",
                  color: "#333",
                  textDecoration: "none",
                }}
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-20">

          {/* 1. What Is BAC Water */}
          <section id="what-is">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              What Is Bacteriostatic Water?
            </h2>
            <div className="prose-custom space-y-4">
              <p className="text-base leading-relaxed" style={{ color: "#444", lineHeight: 1.75 }}>
                Bacteriostatic water (BAC water) is sterile water for injection that contains <strong>0.9% benzyl alcohol</strong> (9 mg/mL) as a preservative. Unlike plain sterile water, which is single-use only, BAC water is designed to be withdrawn from multiple times without compromising sterility.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#444", lineHeight: 1.75 }}>
                In peptide research, BAC water is the standard diluent for reconstituting lyophilized (freeze-dried) peptide vials. The benzyl alcohol preservative inhibits bacterial growth in the vial between uses, which is critical when a researcher needs to draw multiple doses from a single reconstituted vial over days or weeks.
              </p>

              {/* Info box */}
              <div
                className="rounded-sm p-5 mt-6"
                style={{
                  backgroundColor: "#F7F7F0",
                  border: "1px solid #DDDBD5",
                  borderLeft: "3px solid #B8A44C",
                }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: "#333" }}>Key Specification</p>
                <p className="text-sm" style={{ color: "#555", lineHeight: 1.65 }}>
                  BAC water: <strong>Sterile Water for Injection USP + 0.9% Benzyl Alcohol (9 mg/mL)</strong>. pH is typically 5.0–7.0. Packaged in rubber-septum multi-dose vials of 30 mL.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Benzyl Alcohol */}
          <section id="benzyl-alcohol">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              Why 0.9% Benzyl Alcohol Matters
            </h2>
            <div className="space-y-4">
              <p className="text-base leading-relaxed" style={{ color: "#444", lineHeight: 1.75 }}>
                Benzyl alcohol disrupts bacterial cell membranes and denatures microbial proteins, producing a broad-spectrum bacteriostatic effect. At 0.9% concentration, it effectively inhibits growth of common contaminants (<em>Staphylococcus epidermidis</em>, <em>Pseudomonas aeruginosa</em>, etc.) that may be introduced when a needle penetrates the vial septum.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#444", lineHeight: 1.75 }}>
                Importantly, it is <em>bacteriostatic</em>, not bactericidal — it halts bacterial replication rather than killing existing organisms. This is why aseptic technique during needle insertion remains essential even when using BAC water.
              </p>

              {/* Mechanism table */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#010101", color: "#F9F9F9" }}>
                      <th className="px-4 py-3 text-left font-medium">Property</th>
                      <th className="px-4 py-3 text-left font-medium">Value</th>
                      <th className="px-4 py-3 text-left font-medium">Research Relevance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Benzyl alcohol concentration", "0.9% (9 mg/mL)", "Standard antimicrobial concentration for multi-dose vials"],
                      ["Mechanism", "Membrane disruption / protein denaturation", "Broad-spectrum bacteriostatic, not bactericidal"],
                      ["Effective against", "Gram+ and Gram- bacteria, some fungi", "Covers common lab and skin contaminants"],
                      ["pH range", "5.0 – 7.0", "Compatible with most peptides; check pH-sensitive compounds"],
                      ["Shelf life (sealed)", "2–3 years", "Store at room temperature, away from light"],
                      ["Shelf life (opened)", "28 days", "Label vial with open date; discard after 28 days"],
                    ].map(([prop, val, note], i) => (
                      <tr
                        key={i}
                        style={{
                          backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F7F7F0",
                          borderBottom: "1px solid #ECEAE4",
                        }}
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: "#222" }}>{prop}</td>
                        <td className="px-4 py-3" style={{ color: "#444" }}>{val}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#666" }}>{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 3. How to Mix */}
          <section id="how-to-mix">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              How to Reconstitute a Peptide Vial
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#444", lineHeight: 1.75 }}>
              Proper reconstitution preserves peptide integrity and prevents denaturation. Follow these steps in order.
            </p>

            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Gather materials",
                  detail: "Lyophilized peptide vial, BAC water vial, insulin syringe (1 mL, 28–31G), alcohol swabs (70% isopropyl). Work on a clean surface. Wash hands thoroughly.",
                },
                {
                  step: "02",
                  title: "Wipe both vial septa",
                  detail: "Swab the rubber stopper of both the peptide vial and the BAC water vial with fresh alcohol swabs. Allow to air-dry for 10–15 seconds before inserting any needle. Do not blow on the surface or touch after swabbing.",
                },
                {
                  step: "03",
                  title: "Draw BAC water",
                  detail: "Insert the insulin syringe into the BAC water vial and draw the required volume of BAC water. Refer to your product's reconstitution instructions or use the Reconstitution Calculator for exact volume. Common: 1–2 mL per vial.",
                },
                {
                  step: "04",
                  title: "Inject along the vial wall — slowly",
                  detail: "Insert the syringe into the peptide vial at an angle and direct the stream of BAC water along the inner glass wall, not directly onto the lyophilized powder. This is the most commonly skipped step. Direct injection onto the powder causes localized turbulence that can denature fragile peptide bonds.",
                },
                {
                  step: "05",
                  title: "Gently swirl — do not vortex",
                  detail: "Slowly rotate the vial between your fingertips. A gentle figure-8 motion works well. Do NOT shake or vortex. Vigorous agitation introduces air bubbles and can mechanically shear peptide chains. Allow 30–60 seconds for complete dissolution.",
                },
                {
                  step: "06",
                  title: "Inspect for clarity",
                  detail: "A properly reconstituted peptide solution should be clear and colorless (or very faintly yellow for some compounds). Cloudiness, visible particles, or unusual color may indicate degradation or contamination. Discard if in doubt.",
                },
                {
                  step: "07",
                  title: "Label and store immediately",
                  detail: "Write the date and time of reconstitution on the vial label. Refrigerate immediately at 2–8°C. Do not leave reconstituted peptides at room temperature. See storage guidelines below.",
                },
              ].map(({ step, title, detail }) => (
                <div
                  key={step}
                  className="flex gap-5 p-5 rounded-sm"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECEAE4",
                  }}
                >
                  <div
                    className="flex-shrink-0 text-2xl font-light w-10 text-right"
                    style={{ color: "#C9DD69", fontWeight: 200, lineHeight: 1 }}
                  >
                    {step}
                  </div>
                  <div>
                    <p className="font-medium mb-1" style={{ color: "#111" }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#555", lineHeight: 1.7 }}>
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA to calculator */}
            <div
              className="mt-8 p-5 rounded-sm flex items-center justify-between gap-4"
              style={{
                backgroundColor: "#010101",
                border: "1px solid #2A2A28",
              }}
            >
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#F9F9F9" }}>
                  Not sure how much BAC water to add?
                </p>
                <p className="text-xs" style={{ color: "#A0A0A0" }}>
                  Use the free Reconstitution Calculator to get exact volumes and doses per vial.
                </p>
              </div>
              <Link
                href="/tools/reconstitution-calculator"
                className="flex-shrink-0 text-xs font-medium px-4 py-2 rounded-sm whitespace-nowrap"
                style={{
                  backgroundColor: "#C9DD69",
                  color: "#010101",
                  textDecoration: "none",
                }}
              >
                Open Calculator
              </Link>
            </div>
          </section>

          {/* 4. Storage */}
          <section id="storage">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              Storage After Reconstitution
            </h2>

            <p className="text-base leading-relaxed mb-6" style={{ color: "#444", lineHeight: 1.75 }}>
              Once a lyophilized peptide has been reconstituted, it is far more vulnerable to degradation. The following guidelines apply to most research peptides reconstituted in BAC water.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: "Refrigerated (2–8°C)",
                  duration: "14–30 days",
                  note: "Primary storage for reconstituted peptides. Inhibits enzymatic degradation. Protects most compounds for the duration of a typical research cycle.",
                  color: "#3B82F6",
                },
                {
                  label: "Frozen (−20°C)",
                  duration: "3–6 months",
                  note: "Long-term storage for reconstituted solution. Aliquot into single-dose volumes before freezing to avoid repeated freeze-thaw cycles on the whole vial.",
                  color: "#8B5CF6",
                },
                {
                  label: "Room Temperature",
                  duration: "Hours only",
                  note: "Not suitable for storage. Reconstituted peptide solutions should never be left at room temperature for more than 2–4 hours. Enzymatic activity and oxidation accelerate significantly above 8°C.",
                  color: "#EF4444",
                },
              ].map(({ label, duration, note, color }) => (
                <div
                  key={label}
                  className="p-5 rounded-sm"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECEAE4",
                    borderTop: `3px solid ${color}`,
                  }}
                >
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#666666" }}>{label}</p>
                  <p className="text-xl font-light mb-3" style={{ color: "#111" }}>{duration}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#666", lineHeight: 1.65 }}>{note}</p>
                </div>
              ))}
            </div>

            <div
              className="p-5 rounded-sm"
              style={{
                backgroundColor: "#FFF8F0",
                border: "1px solid #F0DCC8",
                borderLeft: "3px solid #F59E0B",
              }}
            >
              <p className="text-sm font-medium mb-2" style={{ color: "#92400E" }}>
                Freeze-Thaw Cycles
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#78350F", lineHeight: 1.65 }}>
                Each freeze-thaw cycle degrades peptide potency. As a best practice, aliquot reconstituted solution into individual-dose volumes (e.g., using 0.3 mL insulin syringes) and freeze each aliquot separately. Thaw only what you need for the current use. Most peptides tolerate 2–3 freeze-thaw cycles; some (particularly long-chain peptides like GHK-Cu) show accelerated degradation after even one cycle.
              </p>
            </div>
          </section>

          {/* 5. Multi-Use Technique */}
          <section id="multi-use">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              Multi-Use Vial Technique
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "#444", lineHeight: 1.75 }}>
              The benzyl alcohol in BAC water makes multi-use reconstituted vials possible, but only when proper aseptic technique is maintained on every withdrawal.
            </p>

            <div className="space-y-3">
              {[
                {
                  icon: "✓",
                  good: true,
                  text: "Swab the vial septum with a fresh alcohol swab before every needle insertion, every time.",
                },
                {
                  icon: "✓",
                  good: true,
                  text: "Use a fresh, sterile needle for every withdrawal. Never reuse needles between sessions.",
                },
                {
                  icon: "✓",
                  good: true,
                  text: "Always insert the needle with the bevel up at a shallow angle to minimize coring (physical damage to the rubber septum that creates particles).",
                },
                {
                  icon: "✓",
                  good: true,
                  text: "Refrigerate the vial immediately after each use. Never leave it out.",
                },
                {
                  icon: "✓",
                  good: true,
                  text: "Write the reconstitution date on the vial. Discard after the compound-specific stability window (typically 14–30 days at 2–8°C).",
                },
                {
                  icon: "✗",
                  good: false,
                  text: "Do not return any solution drawn into a syringe back into the vial — this risks contamination.",
                },
                {
                  icon: "✗",
                  good: false,
                  text: "Do not use a vial that appears cloudy, discolored, or has visible particulate matter.",
                },
                {
                  icon: "✗",
                  good: false,
                  text: "Do not use the same needle to enter both the peptide vial and the BAC water vial without changing needles.",
                },
              ].map(({ icon, good, text }, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 rounded-sm text-sm"
                  style={{
                    backgroundColor: good ? "#F0FDF4" : "#FFF1F2",
                    border: `1px solid ${good ? "#BBF7D0" : "#FECDD3"}`,
                    color: good ? "#166534" : "#9F1239",
                    lineHeight: 1.65,
                  }}
                >
                  <span className="flex-shrink-0 font-bold mt-0.5" style={{ fontSize: "12px" }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Common Mistakes */}
          <section id="mistakes">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              Common Mistakes
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#444", lineHeight: 1.75 }}>
              These are the most frequently encountered errors in peptide reconstitution that compromise compound integrity or research validity.
            </p>

            <div className="space-y-4">
              {[
                {
                  mistake: "Injecting BAC water directly onto the powder",
                  impact: "High",
                  explanation: "Direct high-velocity contact between the water stream and the lyophilized cake causes turbulence that mechanically disrupts peptide structure. Always aim along the inner vial wall and let the water slide down to the powder.",
                },
                {
                  mistake: "Vortexing or shaking the vial",
                  impact: "High",
                  explanation: "Vigorous mechanical agitation denatures peptides through air-liquid interface stress and shear forces. Gently swirl only. If powder is not dissolving, allow more time — some peptides require 2–5 minutes of gentle rotation.",
                },
                {
                  mistake: "Using sterile water instead of BAC water for multi-dose vials",
                  impact: "High",
                  explanation: "Plain sterile water has no preservative. Once the septum is punctured, microbial contamination risk increases with every subsequent withdrawal. Use BAC water for any vial that will be accessed more than once.",
                },
                {
                  mistake: "Storing reconstituted peptides in the freezer door",
                  impact: "Medium",
                  explanation: "Freezer doors experience repeated temperature fluctuations every time the door is opened. This subjects peptides to micro-freeze-thaw cycles. Store reconstituted and lyophilized peptides in the back of the freezer on a fixed shelf.",
                },
                {
                  mistake: "Not labeling the reconstitution date",
                  impact: "Medium",
                  explanation: "Without a date, there is no way to know when to discard. Most reconstituted peptides are stable for 14–30 days at 2–8°C. Using degraded peptide introduces confounds into research data.",
                },
                {
                  mistake: "Adding too much BAC water",
                  impact: "Medium",
                  explanation: "Over-dilution results in concentrations too low to be practical, requiring very large injection volumes per dose. Use the Reconstitution Calculator to determine the correct volume before reconstituting.",
                },
                {
                  mistake: "Skipping the alcohol swab between uses",
                  impact: "Medium",
                  explanation: "Even brief skin contact or air exposure can introduce contamination. Swab the septum before every needle insertion — no exceptions, even for consecutive same-session withdrawals.",
                },
              ].map(({ mistake, impact, explanation }) => (
                <div
                  key={mistake}
                  className="p-5 rounded-sm"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECEAE4",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-medium" style={{ color: "#111" }}>{mistake}</p>
                    <span
                      className="flex-shrink-0 text-xs px-2 py-0.5 rounded-sm font-medium"
                      style={{
                        backgroundColor: impact === "High" ? "#FEE2E2" : "#FEF3C7",
                        color: impact === "High" ? "#991B1B" : "#92400E",
                        border: `1px solid ${impact === "High" ? "#FECACA" : "#FDE68A"}`,
                      }}
                    >
                      {impact} Impact
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#555", lineHeight: 1.7 }}>
                    {explanation}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. BAC vs Sterile */}
          <section id="bac-vs-sterile">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              BAC Water vs. Sterile Water: When to Use Which
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "#444", lineHeight: 1.75 }}>
              Both are used in peptide research, but they serve different purposes. Choosing the wrong one can compromise either sterility or compound stability.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#010101", color: "#F9F9F9" }}>
                    <th className="px-4 py-3 text-left font-medium">Characteristic</th>
                    <th className="px-4 py-3 text-left font-medium">BAC Water</th>
                    <th className="px-4 py-3 text-left font-medium">Sterile Water (USP)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Preservative", "0.9% benzyl alcohol", "None"],
                    ["Multi-dose use", "Yes — up to 28 days after first use", "No — single-use only"],
                    ["pH", "5.0–7.0", "5.0–7.0"],
                    ["Shelf life opened", "28 days", "Discard immediately after use"],
                    ["Best for", "Multi-dose research protocols (peptide vials accessed repeatedly)", "Single-use dilutions, benzyl alcohol-sensitive compounds"],
                    ["Compatibility", "Compatible with most peptides; some may show faster degradation with BA", "Universal compatibility"],
                    ["Benzyl alcohol-sensitive compounds", "Avoid (use sterile water + single-use aliquots)", "Use this instead"],
                    ["Cost", "Slightly higher", "Lower"],
                  ].map(([prop, bac, sterile], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F7F7F0",
                        borderBottom: "1px solid #ECEAE4",
                      }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: "#222" }}>{prop}</td>
                      <td className="px-4 py-3" style={{ color: "#444" }}>{bac}</td>
                      <td className="px-4 py-3" style={{ color: "#444" }}>{sterile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="mt-6 p-5 rounded-sm"
              style={{
                backgroundColor: "#F7F7F0",
                border: "1px solid #DDDBD5",
                borderLeft: "3px solid #B8A44C",
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: "#333" }}>Practical Rule of Thumb</p>
              <p className="text-sm" style={{ color: "#555", lineHeight: 1.65 }}>
                Use <strong>BAC water</strong> for any reconstituted vial you will access more than once. Use <strong>sterile water</strong> only for single-use or if a specific compound has documented benzyl alcohol incompatibility. When in doubt, reconstitute with BAC water and aliquot into single-dose volumes to freeze.
              </p>
            </div>
          </section>

          {/* 8. FAQ */}
          <section id="faq">
            <h2
              className="text-2xl md:text-3xl mb-6 tracking-tight"
              style={{ fontWeight: 300, color: "#111" }}
            >
              Quick Reference FAQ
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: "How long does BAC water last after opening?",
                  a: "28 days. Write the open date on the vial and discard after 28 days regardless of remaining volume. The benzyl alcohol preservative maintains antimicrobial activity for this window under proper storage conditions.",
                },
                {
                  q: "Can I use saline instead of BAC water?",
                  a: "Bacteriostatic normal saline (0.9% NaCl + 0.9% benzyl alcohol) is an alternative. Plain saline (no preservative) should be treated as single-use only. Some peptides may precipitate in isotonic saline — always verify compatibility for the specific compound.",
                },
                {
                  q: "Does benzyl alcohol degrade peptides?",
                  a: "In general, no — at 0.9% concentration benzyl alcohol is well-tolerated by most research peptides. However, a small number of compounds show accelerated degradation in the presence of benzyl alcohol. Always check your compound's specific storage and reconstitution recommendations.",
                },
                {
                  q: "What if my peptide won't dissolve in BAC water?",
                  a: "Allow more time with gentle swirling. Some peptides require acidic or alkaline conditions — 0.1% acetic acid (for peptides like GHRP-6) or dilute sodium hydroxide solution may be needed. Refer to the compound-specific reconstitution protocol. Never increase temperature to speed dissolution.",
                },
                {
                  q: "Is it safe to mix two peptides in the same syringe?",
                  a: "Only if they are in compatible vehicles and neither compound interferes with the other. In general, peptides are best drawn separately and administered individually unless there is specific literature supporting co-administration stability. Cross-contamination of vials must be avoided.",
                },
                {
                  q: "My reconstituted solution looks slightly cloudy. Is it still good?",
                  a: "Minor cloudiness immediately after reconstitution may resolve with gentle swirling. Persistent cloudiness, white precipitate, or any particulate matter are signs of degradation or contamination. Discard and do not use. Protein aggregation (visible cloudiness) indicates the peptide has denatured.",
                },
                {
                  q: "How do I store BAC water itself?",
                  a: "Store unopened BAC water vials at room temperature, away from direct light and heat. Do not refrigerate or freeze — crystallization of benzyl alcohol can occur at low temperatures. Once opened, store at room temperature and use within 28 days.",
                },
                {
                  q: "How much BAC water should I add to a 5 mg peptide vial?",
                  a: "It depends on the desired working concentration. For a 5 mg vial: adding 1 mL gives 5 mg/mL (5,000 mcg/mL); adding 2 mL gives 2.5 mg/mL (2,500 mcg/mL). Use the Reconstitution Calculator to determine the exact volume based on your desired dose and concentration.",
                },
              ].map(({ q, a }, i) => (
                <details
                  key={i}
                  className="group rounded-sm overflow-hidden"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #ECEAE4",
                  }}
                >
                  <summary
                    className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium"
                    style={{ color: "#111", listStyle: "none" }}
                  >
                    <span>{q}</span>
                    <svg
                      className="flex-shrink-0 ml-4 transition-transform group-open:rotate-180"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "#666666" }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "#555", lineHeight: 1.7 }}>{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom CTAs */}
          <section>
            <div
              className="rounded-sm p-8"
              style={{
                backgroundColor: "#010101",
                border: "1px solid #2A2A28",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: "#C9DD69" }}
              >
                Continue Your Research
              </p>
              <h3
                className="text-2xl mb-6 tracking-tight"
                style={{ fontWeight: 200, color: "#F9F9F9" }}
              >
                More research tools and resources
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    href: "/tools/reconstitution-calculator",
                    label: "Reconstitution Calculator",
                    desc: "Exact BAC water volume and dose volumes",
                  },
                  {
                    href: "/tools/half-life-calculator",
                    label: "Half-Life Calculator",
                    desc: "Plasma decay curves and dosing intervals",
                  },
                  {
                    href: "/protocols",
                    label: "Research Cycle Protocols",
                    desc: "3-Month and 6-Month cycle guides",
                  },
                  {
                    href: "/compounds",
                    label: "Compound Index",
                    desc: "Mechanisms, CAS, MW for all 32 compounds",
                  },
                  {
                    href: "/faq",
                    label: "Research FAQ",
                    desc: "18 questions on ordering, shipping, and storage",
                  },
                  {
                    href: "/products?category=Accessories",
                    label: "BAC Water & Accessories",
                    desc: "3 mL and 10 mL vials in catalog",
                  },
                ].map(({ href, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block p-4 rounded-sm transition-opacity hover:opacity-70"
                    style={{
                      backgroundColor: "#1A1A18",
                      border: "1px solid #2A2A28",
                      textDecoration: "none",
                    }}
                  >
                    <p className="text-sm font-medium mb-1" style={{ color: "#F9F9F9" }}>{label}</p>
                    <p className="text-xs" style={{ color: "#A0A0A0" }}>{desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2" />

          {/* Disclaimer */}
          <div
            className="text-xs leading-relaxed p-5 rounded-sm"
            style={{
              backgroundColor: "#F7F7F0",
              border: "1px solid #DDDBD5",
              color: "#666666",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#555" }}>Research Use Only.</strong> All information on this page is provided for educational and research purposes only. Nexphoria products are not intended for human or veterinary use. This content does not constitute medical advice. Consult applicable research protocols and regulatory guidelines for your jurisdiction.
          </div>
        </div>
      </article>
    </div>
  );
}
