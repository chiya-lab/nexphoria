"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const PLATFORMS = ["YouTube", "X", "Instagram", "TikTok", "Blog", "Podcast"];
const FOCUS = [
  "Technical reviews",
  "Reconstitution guides",
  "Research literature",
  "Longevity science",
  "COA breakdowns",
  "Protocol education",
  "Explainer content",
];
const TAX_FORMS = ["W-9 (US)", "W-8BEN (International)"];

interface PlatformEntry {
  url: string;
  followers: string;
}

interface FormState {
  name: string;
  email: string;
  platforms: Record<string, PlatformEntry>;
  focus: string[];
  plan: string;
  taxForm: string;
  ackRuo: boolean;
  ackFtc: boolean;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  platforms: {},
  focus: [],
  plan: "",
  taxForm: "",
  ackRuo: false,
  ackFtc: false,
};

const STEPS = ["Contact", "Platforms", "Content focus", "Promotion plan", "Tax info", "Compliance"];

const inputStyle = {
  backgroundColor: "var(--ink)",
  border: "1px solid var(--steel)",
  color: "var(--platinum)",
  fontFamily: "var(--font-body)",
} as const;

const labelStyle = { fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PprAffiliateApplicationForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const togglePlatform = (p: string) => {
    setState((prev) => {
      const next = { ...prev.platforms };
      if (next[p]) {
        delete next[p];
      } else {
        next[p] = { url: "", followers: "" };
      }
      return { ...prev, platforms: next };
    });
    setError(null);
  };

  const setPlatformField = (p: string, field: keyof PlatformEntry, value: string) => {
    setState((prev) => ({
      ...prev,
      platforms: { ...prev.platforms, [p]: { ...prev.platforms[p], [field]: value } },
    }));
  };

  const toggleFocus = (f: string) => {
    setState((prev) => ({
      ...prev,
      focus: prev.focus.includes(f) ? prev.focus.filter((x) => x !== f) : [...prev.focus, f],
    }));
    setError(null);
  };

  function validateStep(): string | null {
    switch (step) {
      case 0:
        if (!state.name.trim()) return "Enter your name or handle.";
        if (!EMAIL_RE.test(state.email.trim())) return "Enter a valid email address.";
        return null;
      case 1:
        if (Object.keys(state.platforms).length === 0) return "Select at least one platform.";
        for (const [p, entry] of Object.entries(state.platforms)) {
          if (!entry.url.trim()) return `Add a URL for ${p}.`;
        }
        return null;
      case 2:
        if (state.focus.length === 0) return "Select at least one content focus.";
        return null;
      case 3:
        if (state.plan.trim().length < 20) return "Describe your promotion plan in a sentence or two.";
        return null;
      case 4:
        if (!state.taxForm) return "Select a tax form.";
        return null;
      case 5:
        if (!state.ackRuo || !state.ackFtc) return "Both acknowledgements are required.";
        return null;
      default:
        return null;
    }
  }

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-16">
        <div
          className="flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--accent)" }}
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={36} aria-hidden="true" style={{ color: "var(--accent)" }} />
          <h2 className="text-[24px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Application received
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Thanks, {state.name.trim()}. We review applications for research-content fit and FTC compliance, typically
            within two business days. You will hear from us at {state.email.trim()}.
          </p>
          <p className="mt-2 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            This is a demo. No data is transmitted or stored. For research use only.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-12 lg:py-16">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-7">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Partner application
        </span>
        <h1 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Join the affiliate program
        </h1>
      </motion.div>

      {/* Step indicator */}
      <ol className="mb-6 flex flex-wrap gap-1.5" aria-label="Application progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-1.5">
            <span
              className="flex h-6 items-center gap-1.5 rounded px-2 text-[11px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: i === step ? "var(--ink)" : i < step ? "var(--accent)" : "var(--silver-3)",
                backgroundColor: i === step ? "var(--accent)" : "transparent",
                border: `1px solid ${i <= step ? "var(--accent)" : "var(--steel)"}`,
              }}
            >
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-2xl p-6 lg:p-8" style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }} noValidate>
        {step === 0 && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase" style={labelStyle}>Name or handle</span>
              <input
                type="text"
                value={state.name}
                onChange={(e) => update("name", e.target.value)}
                className="rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus-visible:ring-2"
                style={inputStyle}
                placeholder="lab.notes"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase" style={labelStyle}>Email</span>
              <input
                type="email"
                value={state.email}
                onChange={(e) => update("email", e.target.value)}
                className="rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus-visible:ring-2"
                style={inputStyle}
                placeholder="you@example.com"
              />
            </label>
          </>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <span className="text-[11px] uppercase" style={labelStyle}>Where do you publish?</span>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const selected = Boolean(state.platforms[p]);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    aria-pressed={selected}
                    className="rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus-visible:ring-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: selected ? "var(--ink)" : "var(--silver-1)",
                      backgroundColor: selected ? "var(--accent)" : "transparent",
                      border: `1px solid ${selected ? "var(--accent)" : "var(--steel)"}`,
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            {Object.keys(state.platforms).map((p) => (
              <div key={p} className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr]">
                <input
                  type="url"
                  value={state.platforms[p].url}
                  onChange={(e) => setPlatformField(p, "url", e.target.value)}
                  className="rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus-visible:ring-2"
                  style={inputStyle}
                  placeholder={`${p} URL`}
                  aria-label={`${p} URL`}
                />
                <input
                  type="text"
                  value={state.platforms[p].followers}
                  onChange={(e) => setPlatformField(p, "followers", e.target.value)}
                  className="rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus-visible:ring-2"
                  style={inputStyle}
                  placeholder="Followers"
                  aria-label={`${p} follower count`}
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase" style={labelStyle}>Content focus (select all that apply)</span>
            <div className="flex flex-wrap gap-2">
              {FOCUS.map((f) => {
                const selected = state.focus.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFocus(f)}
                    aria-pressed={selected}
                    className="rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus-visible:ring-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: selected ? "var(--ink)" : "var(--silver-1)",
                      backgroundColor: selected ? "var(--accent)" : "transparent",
                      border: `1px solid ${selected ? "var(--accent)" : "var(--steel)"}`,
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] uppercase" style={labelStyle}>How do you plan to promote?</span>
            <textarea
              value={state.plan}
              onChange={(e) => update("plan", e.target.value)}
              rows={5}
              className="rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus-visible:ring-2"
              style={inputStyle}
              placeholder="Describe your audience, content format, and how research compounds fit your work."
            />
            <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
              Research-context content only. No medical claims.
            </span>
          </label>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase" style={labelStyle}>Tax documentation</span>
            <div className="flex flex-col gap-2">
              {TAX_FORMS.map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-3.5 py-2.5 text-[14px]"
                  style={{ ...inputStyle, borderColor: state.taxForm === t ? "var(--accent)" : "var(--steel)" }}
                >
                  <input
                    type="radio"
                    name="taxForm"
                    checked={state.taxForm === t}
                    onChange={() => update("taxForm", t)}
                    style={{ accentColor: "var(--accent)" }}
                  />
                  <span style={{ color: "var(--silver-1)" }}>{t}</span>
                </label>
              ))}
            </div>
            <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
              Placeholder only — no document is uploaded in this demo. Payouts are held until tax docs are on file.
            </span>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase" style={labelStyle}>Compliance acknowledgement</span>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-3.5 py-3 text-[14px]" style={{ ...inputStyle, borderColor: state.ackRuo ? "var(--accent)" : "var(--steel)" }}>
              <input type="checkbox" checked={state.ackRuo} onChange={(e) => update("ackRuo", e.target.checked)} style={{ accentColor: "var(--accent)", marginTop: 3 }} />
              <span style={{ color: "var(--silver-1)" }}>
                I will present all Nexphoria compounds as research use only and will not make medical, therapeutic, or personal-outcome claims.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-3.5 py-3 text-[14px]" style={{ ...inputStyle, borderColor: state.ackFtc ? "var(--accent)" : "var(--steel)" }}>
              <input type="checkbox" checked={state.ackFtc} onChange={(e) => update("ackFtc", e.target.checked)} style={{ accentColor: "var(--accent)", marginTop: 3 }} />
              <span style={{ color: "var(--silver-1)" }}>
                I will include a clear FTC affiliate disclosure on every placement that uses my referral links.
              </span>
            </label>
          </div>
        )}

        {error && (
          <p className="text-[13px]" role="alert" style={{ fontFamily: "var(--font-body)", color: "var(--danger)" }}>
            {error}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
              style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-md px-5 py-2.5 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
              style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
            >
              Continue
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md px-5 py-2.5 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
              style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
            >
              Submit application
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
