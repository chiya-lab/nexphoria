"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Check } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const VOLUMES = ["Under $5k / month", "$5k–$15k / month", "$15k–$50k / month", "$50k+ / month"];
const PEPTIDES = ["BPC-157", "TB-500", "GHK-Cu", "Semaglutide (RUO)", "Tirzepatide (RUO)", "Ipamorelin", "CJC-1295", "Custom sequence"];

interface FormState {
  org: string;
  role: string;
  email: string;
  ein: string;
  volume: string;
  peptides: string[];
  message: string;
}

type Errors = Partial<Record<"org" | "role" | "email" | "volume", string>>;

const EMPTY: FormState = { org: "", role: "", email: "", ein: "", volume: "", peptides: [], message: "" };

const inputStyle = {
  backgroundColor: "var(--ink)",
  border: "1px solid var(--steel)",
  color: "var(--platinum)",
  fontFamily: "var(--font-body)",
} as const;

const labelStyle = { fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" } as const;

function validate(state: FormState): Errors {
  const errors: Errors = {};
  if (!state.org.trim()) errors.org = "Organization is required.";
  if (!state.role.trim()) errors.role = "Role is required.";
  if (!state.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) errors.email = "Enter a valid email address.";
  if (!state.volume) errors.volume = "Select an estimated monthly volume.";
  return errors;
}

export default function PprWholesaleForm() {
  const [state, setState] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const togglePeptide = (p: string) => {
    setState((prev) => ({
      ...prev,
      peptides: prev.peptides.includes(p) ? prev.peptides.filter((x) => x !== p) : [...prev.peptides, p],
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(state);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="wholesale-form" className="mx-auto max-w-3xl px-5 py-12" style={{ scrollMarginTop: "6rem" }}>
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mb-6">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Account application
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Apply for a lab account
        </h2>
      </motion.div>

      {submitted ? (
        <div
          className="flex flex-col items-center gap-3 rounded-xl px-6 py-12 text-center"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--accent)" }}
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={32} aria-hidden="true" style={{ color: "var(--accent)" }} />
          <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Application received
          </h3>
          <p className="max-w-md text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Thank you. The accounts desk will review {state.org} and respond within 24 hours at {state.email}.
          </p>
          <button
            type="button"
            onClick={() => {
              setState(EMPTY);
              setSubmitted(false);
            }}
            className="mt-1 rounded-md px-4 py-2 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            Submit another application
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="org" label="Organization" error={errors.org}>
              <input id="org" type="text" value={state.org} onChange={(e) => update("org", e.target.value)} aria-invalid={!!errors.org} className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
            </Field>
            <Field id="role" label="Your role" error={errors.role}>
              <input id="role" type="text" value={state.role} onChange={(e) => update("role", e.target.value)} aria-invalid={!!errors.role} className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="email" label="Work email" error={errors.email}>
              <input id="email" type="email" value={state.email} onChange={(e) => update("email", e.target.value)} aria-invalid={!!errors.email} className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
            </Field>
            <Field id="ein" label="EIN (optional)">
              <input id="ein" type="text" inputMode="numeric" value={state.ein} onChange={(e) => update("ein", e.target.value)} placeholder="00-0000000" className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
            </Field>
          </div>

          <Field id="volume" label="Estimated monthly volume" error={errors.volume}>
            <select id="volume" value={state.volume} onChange={(e) => update("volume", e.target.value)} aria-invalid={!!errors.volume} className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2" style={inputStyle}>
              <option value="">Select a range…</option>
              {VOLUMES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-1 text-[11px] uppercase" style={labelStyle}>
              Peptides of interest (optional)
            </legend>
            <div className="flex flex-wrap gap-2">
              {PEPTIDES.map((p) => {
                const selected = state.peptides.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePeptide(p)}
                    aria-pressed={selected}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors focus:outline-none focus-visible:ring-2"
                    style={{
                      backgroundColor: selected ? "var(--accent)" : "var(--ink)",
                      border: `1px solid ${selected ? "var(--accent)" : "var(--steel)"}`,
                      color: selected ? "var(--ink)" : "var(--silver-1)",
                      fontFamily: "var(--font-body)",
                      fontWeight: selected ? 600 : 400,
                    }}
                  >
                    {selected && <Check size={13} aria-hidden="true" />}
                    {p}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Field id="message" label="Message (optional)">
            <textarea id="message" rows={4} value={state.message} onChange={(e) => update("message", e.target.value)} className="w-full resize-y rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2" style={inputStyle} />
          </Field>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            Submit application
          </button>
          <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            US-only. Accounts are subject to research-use eligibility verification. For research use only.
          </p>
        </form>
      )}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase" style={labelStyle}>
        {label}
      </span>
      {children}
      {error && (
        <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--danger)" }} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
