"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, Download, ShieldCheck, ArrowRight } from "lucide-react";
import { easing } from "@/lib/motion";
import {
  lookupLot,
  SAMPLE_LOT_NUMBERS,
  type CoaLot,
  type ChromatogramPeak,
} from "./lots";

type Status = "idle" | "found" | "not-found";

export default function CoaLookupClient() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [lot, setLot] = useState<CoaLot | null>(null);
  const [attempted, setAttempted] = useState("");

  const runLookup = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    const match = lookupLot(value);
    setAttempted(value.toUpperCase());
    if (match) {
      setLot(match);
      setStatus("found");
    } else {
      setLot(null);
      setStatus("not-found");
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runLookup(query);
  };

  const selectChip = (value: string) => {
    setQuery(value);
    runLookup(value);
  };

  const reset = () => {
    setStatus("idle");
    setLot(null);
    setQuery("");
    setAttempted("");
  };

  return (
    <main style={{ backgroundColor: "var(--ink)", color: "var(--platinum)" }}>
      {status === "found" && lot ? (
        <LotResult lot={lot} onReset={reset} />
      ) : (
        <LookupView
          query={query}
          setQuery={setQuery}
          onSubmit={onSubmit}
          onChip={selectChip}
          notFound={status === "not-found"}
          attempted={attempted}
        />
      )}

      <EditorialSection />
      <LotReleaseOptIn />
    </main>
  );
}

/* ─────────────────────────── Hero + lookup form ─────────────────────────── */

function LookupView({
  query,
  setQuery,
  onSubmit,
  onChip,
  notFound,
  attempted,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onChip: (v: string) => void;
  notFound: boolean;
  attempted: string;
}) {
  return (
    <section className="ppr-grid-hex px-6 pb-20 pt-24 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--platinum)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
          className="text-[44px] sm:text-[56px] lg:text-[64px]"
        >
          Every lot, every COA.
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl text-[17px]"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", lineHeight: 1.55 }}
        >
          Enter a lot number. We publish the chromatogram, mass spec, and water content
          for every batch we ship.
        </p>

        <form onSubmit={onSubmit} className="mx-auto mt-10 w-full" style={{ maxWidth: 540 }}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--silver-2)" }}
              />
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Lot number"
                placeholder="NX-241-A · NX-240-C · NX-239-B"
                className="w-full rounded-md py-3.5 pl-11 pr-4 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink-2)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
            <button
              type="submit"
              className="whitespace-nowrap rounded-md px-6 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--ink)",
                fontFamily: "var(--font-display)",
              }}
            >
              Look up &rarr;
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-3)" }}
            >
              Try it:
            </span>
            {SAMPLE_LOT_NUMBERS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => onChip(sample)}
                className="rounded-full px-3 py-1 text-[13px] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                style={{
                  fontFamily: "var(--font-mono)",
                  border: "1px solid var(--steel)",
                  color: "var(--silver-1)",
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </form>

        <AnimatePresence>
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: easing.easeOut }}
              className="mx-auto mt-8 rounded-md p-5 text-left"
              style={{
                maxWidth: 540,
                backgroundColor: "var(--ink-2)",
                border: "1px solid var(--danger)",
              }}
              role="status"
            >
              <p style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", fontSize: 16 }}>
                Lot <span style={{ fontFamily: "var(--font-mono)", color: "var(--danger)" }}>{attempted}</span> not found.
              </p>
              <p className="mt-1 text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                Need help? Email{" "}
                <a href="mailto:research@nexphoria.com" style={{ color: "var(--accent)" }}>
                  research@nexphoria.com
                </a>
              </p>
              <p
                className="mt-3 text-[12px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "var(--silver-3)" }}
              >
                Try one of our sample lots
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SAMPLE_LOT_NUMBERS.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => onChip(sample)}
                    className="rounded-full px-3 py-1 text-[13px] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      border: "1px solid var(--steel)",
                      color: "var(--silver-1)",
                    }}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Lot result ─────────────────────────────── */

function LotResult({ lot, onReset }: { lot: CoaLot; onReset: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easing.easeOut }}
      className="px-6 pb-16 pt-12 sm:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onReset}
          className="mb-6 text-[13px] transition-colors hover:text-[color:var(--platinum)]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
        >
          &larr; Look up another lot
        </button>

        {/* Lot header card */}
        <div
          className="rounded-lg p-6 sm:p-8"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded px-2 py-0.5 text-[12px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--accent)",
                border: "1px solid var(--steel)",
                letterSpacing: "0.06em",
              }}
            >
              Lot {lot.lot}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[12px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--ok)", border: "1px solid var(--steel)" }}
            >
              <Check size={13} aria-hidden="true" /> Released
            </span>
          </div>

          <h2
            className="mt-4 text-[32px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
          >
            {lot.compound}
          </h2>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            <HeaderField label="Molecular weight" value={lot.sequenceMw} />
            <HeaderField label="Manufactured" value={lot.manufactured} />
            <HeaderField label="Released" value={lot.released} />
            <HeaderField label="QC by" value={lot.qcInitials} />
          </dl>
        </div>

        {/* Test results panel */}
        <Panel title="Test results">
          <div className="overflow-hidden rounded-md" style={{ border: "1px solid var(--steel)" }}>
            {lot.results.map((r, i) => (
              <div
                key={r.label}
                className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-4"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--steel)",
                  backgroundColor: i % 2 === 1 ? "var(--ink-3)" : "transparent",
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", fontSize: 15 }}>
                    {r.label}
                  </p>
                  <p
                    className="text-[12px]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}
                  >
                    {r.method}
                  </p>
                </div>
                <p
                  className="text-[14px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}
                >
                  {r.value}
                  <span style={{ color: "var(--silver-3)" }}> · target {r.spec}</span>
                </p>
                <span
                  className="inline-flex w-fit items-center gap-1 rounded px-2 py-0.5 text-[12px]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: r.pass ? "var(--ok)" : "var(--danger)",
                    border: `1px solid ${r.pass ? "var(--ok)" : "var(--danger)"}`,
                  }}
                >
                  <Check size={12} aria-hidden="true" /> Pass
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* HPLC chromatogram */}
        <Panel title="HPLC chromatogram" subtitle="RP-HPLC · UV 214 nm · representative trace">
          <Chromatogram peaks={lot.chromatogram} />
        </Panel>

        {/* Mass spec table */}
        <Panel title="Mass spectrometry" subtitle="ESI-MS · observed vs. expected">
          <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--steel)" }}>
            <table className="w-full border-collapse text-left text-[13px]" style={{ fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr style={{ color: "var(--silver-3)" }}>
                  <th className="px-4 py-2 font-medium">Species</th>
                  <th className="px-4 py-2 font-medium">Observed (Da)</th>
                  <th className="px-4 py-2 font-medium">Expected (Da)</th>
                  <th className="px-4 py-2 font-medium">Δ (Da)</th>
                </tr>
              </thead>
              <tbody>
                {lot.massSpec.map((row, i) => (
                  <tr
                    key={row.species}
                    style={{
                      borderTop: "1px solid var(--steel)",
                      backgroundColor: i % 2 === 1 ? "var(--ink-3)" : "transparent",
                      color: "var(--silver-1)",
                    }}
                  >
                    <td className="px-4 py-2">{row.species}</td>
                    <td className="px-4 py-2">{row.observed}</td>
                    <td className="px-4 py-2">{row.expected}</td>
                    <td className="px-4 py-2" style={{ color: "var(--accent)" }}>{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Download buttons */}
        <Panel title="Documents">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <DownloadButton primary label="Download full COA (PDF, 1.2 MB)" />
            <DownloadButton label="Download chromatogram (PNG)" />
            <button
              type="button"
              disabled
              title="Premium feature — coming soon"
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md px-5 py-3 text-[14px]"
              style={{
                fontFamily: "var(--font-display)",
                border: "1px dashed var(--steel)",
                color: "var(--silver-3)",
              }}
            >
              <ShieldCheck size={16} aria-hidden="true" /> Verify on blockchain
              <span
                className="ml-1 rounded px-1.5 py-0.5 text-[10px] uppercase"
                style={{ border: "1px solid var(--steel)", letterSpacing: "0.08em" }}
              >
                Premium
              </span>
            </button>
          </div>
        </Panel>

        {/* Chain of custody */}
        <Panel title="Chain of custody">
          <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
            {lot.custody.map((step, i) => (
              <li key={step.label} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                <div className="flex flex-col items-center sm:w-full sm:flex-row">
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px]"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--ink)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  {i < lot.custody.length - 1 && (
                    <span
                      className="ml-1 hidden h-px flex-1 sm:block"
                      style={{ backgroundColor: "var(--steel)" }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="pb-6 sm:pb-0 sm:pt-3">
                  <p style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", fontSize: 14 }}>
                    {step.label}
                  </p>
                  <p className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
                    {step.date}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </motion.section>
  );
}

function HeaderField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        className="text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-3)" }}
      >
        {label}
      </dt>
      <dd className="mt-1 text-[14px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
        {value}
      </dd>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h3
          className="text-[13px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <span className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function DownloadButton({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        /* Static reference build — file generation is wired in a later milestone. */
      }}
      className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
      style={
        primary
          ? { backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }
          : {
              backgroundColor: "transparent",
              color: "var(--silver-1)",
              border: "1px solid var(--steel)",
              fontFamily: "var(--font-display)",
            }
      }
    >
      <Download size={16} aria-hidden="true" /> {label}
    </button>
  );
}

/* ───────────────────────────── Chromatogram SVG ──────────────────────────── */

function Chromatogram({ peaks }: { peaks: ChromatogramPeak[] }) {
  const W = 600;
  const H = 200;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const baseY = padT + plotH;
  const maxRt = 28;

  const xFor = (rt: number) => padL + (rt / maxRt) * plotW;
  const yFor = (h: number) => baseY - h * plotH;

  // Build a smooth-ish trace: baseline with gaussian-like bumps at each peak.
  const samples: string[] = [];
  for (let px = 0; px <= plotW; px += 3) {
    const rt = (px / plotW) * maxRt;
    let h = 0.01;
    for (const peak of peaks) {
      const sigma = peak.height > 0.5 ? 0.6 : 0.4;
      const d = rt - peak.rt;
      h += peak.height * Math.exp(-(d * d) / (2 * sigma * sigma));
    }
    samples.push(`${padL + px},${yFor(Math.min(h, 1))}`);
  }
  const trace = `M ${samples.join(" L ")}`;
  const fillPath = `${trace} L ${padL + plotW},${baseY} L ${padL},${baseY} Z`;

  return (
    <div
      className="rounded-md p-4"
      style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="HPLC chromatogram trace">
        <defs>
          <linearGradient id="ppr-coa-chroma" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Axes */}
        <line x1={padL} y1={baseY} x2={W - padR} y2={baseY} stroke="var(--steel)" strokeWidth="1" />
        <line x1={padL} y1={padT} x2={padL} y2={baseY} stroke="var(--steel)" strokeWidth="1" />

        {/* X ticks */}
        {[0, 7, 14, 21, 28].map((t) => (
          <g key={t}>
            <line x1={xFor(t)} y1={baseY} x2={xFor(t)} y2={baseY + 4} stroke="var(--silver-3)" strokeWidth="1" />
            <text
              x={xFor(t)}
              y={baseY + 16}
              fontSize="10"
              fill="var(--silver-3)"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              {t}
            </text>
          </g>
        ))}
        <text x={padL + plotW / 2} y={H - 2} fontSize="10" fill="var(--silver-3)" textAnchor="middle" fontFamily="var(--font-mono)">
          Retention time (min)
        </text>

        {/* Trace */}
        <path d={fillPath} fill="url(#ppr-coa-chroma)" />
        <path d={trace} fill="none" stroke="var(--accent)" strokeWidth="1.5" />

        {/* Peak labels */}
        {peaks
          .filter((p) => p.areaPct >= 0.1)
          .map((p) => (
            <g key={p.rt}>
              <text
                x={xFor(p.rt)}
                y={yFor(p.height) - 6}
                fontSize="9"
                fill={p.areaPct > 90 ? "var(--accent)" : "var(--silver-2)"}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
              >
                {p.areaPct > 90 ? `${p.areaPct}%` : `${p.rt}m`}
              </text>
            </g>
          ))}
      </svg>
    </div>
  );
}

/* ──────────────────────────── Editorial section ─────────────────────────── */

function EditorialSection() {
  return (
    <section className="px-6 py-20 sm:px-8" style={{ borderTop: "1px solid var(--steel)" }}>
      <div className="mx-auto max-w-3xl">
        <h2
          className="text-[32px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
        >
          Why we publish every COA
        </h2>
        <div className="mt-6 space-y-5 text-[16px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", lineHeight: 1.65 }}>
          <p>
            A certificate of analysis is only meaningful if you can read the one that matches the
            vial in your hand. Lot-to-lot variation is real: a compound that assays at 99.4% in one
            batch may carry a different impurity profile in the next. Publishing a single
            representative document hides exactly the information a careful researcher needs.
          </p>
          <p>
            So we publish the analytical record for every lot we release — the HPLC chromatogram,
            the mass spectrum with observed and expected ion masses, Karl Fischer water content,
            acetate, microbial count, and endotoxin. Each result is reported against its acceptance
            criterion, with the QC analyst who released the batch named on the record.
          </p>
          <p>
            Transparency is not a marketing posture; it is a precondition for reproducible work.
            When the underlying data travels with the lot number, results can be traced, methods can
            be scrutinized, and conclusions can be defended. That is the standard we hold ourselves
            to, lot after lot.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Lot-release email opt-in ──────────────────────── */

function LotReleaseOptIn() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="px-6 py-20 sm:px-8" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-[32px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1 }}
        >
          Subscribe to lot release notifications
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-[16px]"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", lineHeight: 1.55 }}
        >
          Every new lot we release triggers an email to opt-in researchers — lot number, compound,
          and a direct link to its published COA.
        </p>

        {submitted ? (
          <p
            className="mt-8 inline-flex items-center gap-2 text-[15px]"
            style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
            role="status"
          >
            <Check size={16} aria-hidden="true" /> You are on the list. Watch for the next lot release.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              placeholder="researcher@institution.edu"
              className="flex-1 rounded-md px-4 py-3 text-[14px] focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: "var(--ink)",
                border: "1px solid var(--steel)",
                color: "var(--platinum)",
                fontFamily: "var(--font-body)",
              }}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
            >
              Notify me <ArrowRight size={15} aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
