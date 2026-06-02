"use client";

import { useState } from "react";

type RequestType = "opt-out" | "delete" | "access" | "correct";

const REQUEST_OPTIONS: { value: RequestType; label: string }[] = [
  { value: "opt-out", label: "Opt out of sale or sharing" },
  { value: "access", label: "Access my personal information" },
  { value: "delete", label: "Delete my personal information" },
  { value: "correct", label: "Correct my personal information" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PprDoNotSellForm() {
  const [requestType, setRequestType] = useState<RequestType>("opt-out");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  function validate(): boolean {
    const next: { fullName?: string; email?: string } = {};
    if (fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // Mock submission — no network call per spec. Request would be routed to
    // the privacy intake queue and acknowledged by email.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Request received
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--silver-2)" }}>
          We have logged your request. We will verify your identity and respond within the
          timeframe required by applicable law. You will receive an acknowledgement at the email
          address provided.
        </p>
      </div>
    );
  }

  const fieldStyle = { borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" };
  const labelStyle = { fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border p-6"
      style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="dns-type" className="mb-1.5 block text-[11px] uppercase" style={labelStyle}>
            Request type
          </label>
          <select
            id="dns-type"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value as RequestType)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-1"
            style={fieldStyle}
          >
            {REQUEST_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dns-name" className="mb-1.5 block text-[11px] uppercase" style={labelStyle}>
            Full name
          </label>
          <input
            id="dns-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            aria-invalid={!!errors.fullName}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-1"
            style={fieldStyle}
          />
          {errors.fullName && (
            <p className="mt-1 text-[12px]" style={{ color: "var(--danger)" }}>
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dns-email" className="mb-1.5 block text-[11px] uppercase" style={labelStyle}>
            Email address
          </label>
          <input
            id="dns-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-1"
            style={fieldStyle}
          />
          {errors.email && (
            <p className="mt-1 text-[12px]" style={{ color: "var(--danger)" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            id="dns-agent"
            type="checkbox"
            checked={isAgent}
            onChange={(e) => setIsAgent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0"
            style={{ accentColor: "var(--accent)" }}
          />
          <label htmlFor="dns-agent" className="text-sm" style={{ color: "var(--silver-1)" }}>
            I am an authorized agent submitting this request on behalf of a California resident.
          </label>
        </div>

        <div>
          <label htmlFor="dns-details" className="mb-1.5 block text-[11px] uppercase" style={labelStyle}>
            Additional details {isAgent ? "(include proof of authorization)" : "(optional)"}
          </label>
          <textarea
            id="dns-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-1"
            style={fieldStyle}
          />
        </div>

        <button
          type="submit"
          className="rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", backgroundColor: "var(--accent)", color: "var(--ink)" }}
        >
          Submit request
        </button>
      </div>
    </form>
  );
}
