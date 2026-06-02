"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const TOPICS = [
  "Research support",
  "Certificate of analysis",
  "Order status",
  "Wholesale & lab accounts",
  "Custom synthesis",
  "Press & partnerships",
  "Other",
];

interface FormState {
  name: string;
  email: string;
  org: string;
  topic: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: "", email: "", org: "", topic: "", message: "" };

const inputStyle = {
  backgroundColor: "var(--ink)",
  border: "1px solid var(--steel)",
  color: "var(--platinum)",
  fontFamily: "var(--font-body)",
} as const;

const labelStyle = {
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.06em",
  color: "var(--silver-2)",
} as const;

function validate(state: FormState): Errors {
  const errors: Errors = {};
  if (!state.name.trim()) errors.name = "Name is required.";
  if (!state.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) errors.email = "Enter a valid email address.";
  if (!state.topic) errors.topic = "Select a topic.";
  if (!state.message.trim()) errors.message = "Message is required.";
  else if (state.message.trim().length < 10) errors.message = "Please add a little more detail.";
  return errors;
}

export default function PprContactForm() {
  const [state, setState] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
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
    <section id="contact-form" className="mx-auto max-w-3xl px-5 py-12" style={{ scrollMarginTop: "6rem" }}>
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Send a message
        </span>
        <h2 className="mt-2 text-[24px] font-semibold lg:text-[30px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Reach research support
        </h2>
      </motion.div>

      {submitted ? (
        <div
          className="mt-6 flex flex-col items-center gap-3 rounded-xl px-6 py-12 text-center"
          style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--accent)" }}
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={32} aria-hidden="true" style={{ color: "var(--accent)" }} />
          <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            Message received
          </h3>
          <p className="max-w-md text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
            Thank you, {state.name.split(" ")[0] || "researcher"}. Our team will respond within one business
            day at {state.email}.
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
            Send another message
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="name" label="Name" error={errors.name}>
              <input
                id="name"
                type="text"
                value={state.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={!!errors.name}
                className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                style={inputStyle}
              />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input
                id="email"
                type="email"
                value={state.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={!!errors.email}
                className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field id="org" label="Organization (optional)">
            <input
              id="org"
              type="text"
              value={state.org}
              onChange={(e) => update("org", e.target.value)}
              className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
              style={inputStyle}
            />
          </Field>

          <Field id="topic" label="Topic" error={errors.topic}>
            <select
              id="topic"
              value={state.topic}
              onChange={(e) => update("topic", e.target.value)}
              aria-invalid={!!errors.topic}
              className="w-full rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
              style={inputStyle}
            >
              <option value="">Select a topic…</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field id="message" label="Message" error={errors.message}>
            <textarea
              id="message"
              rows={5}
              value={state.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={!!errors.message}
              className="w-full resize-y rounded-md px-3.5 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
              style={inputStyle}
            />
          </Field>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            Send message
          </button>
          <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            For research use only. We cannot provide dosing, administration, or therapeutic guidance.
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
