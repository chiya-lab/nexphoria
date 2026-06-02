"use client";

import { useState } from "react";
import { Mail, Tag } from "lucide-react";

interface PprQuizEmailCaptureProps {
  onSubmit: (email: string) => void;
  onSkip: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PprQuizEmailCapture({ onSubmit, onSkip }: PprQuizEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = EMAIL_RE.test(email);

  return (
    <div className="flex flex-col gap-5">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
      >
        <Tag size={22} aria-hidden="true" style={{ color: "var(--accent)" }} />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-semibold lg:text-[30px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
          Get your protocol + 10% off
        </h2>
        <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          We&apos;ll email your recommended protocol with COA links and a one-time 10% code for the
          matched compounds. Optional — you can skip straight to your result.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid) onSubmit(email);
        }}
        className="flex flex-col gap-3"
      >
        <div className="relative">
          <Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--silver-2)" }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="you@lab.org"
            aria-label="Email address"
            aria-invalid={touched && !valid}
            className="w-full rounded-lg py-3.5 pl-11 pr-4 text-[15px] focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: "var(--ink)",
              border: `1px solid ${touched && !valid ? "var(--danger)" : "var(--steel)"}`,
              color: "var(--platinum)",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
        {touched && !valid && (
          <span className="text-[12px]" style={{ fontFamily: "var(--font-body)", color: "var(--danger)" }}>
            Enter a valid email, or skip to your result.
          </span>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="flex-1 rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
          >
            Email me my protocol
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md px-6 py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{ border: "1px solid var(--steel)", color: "var(--silver-1)", fontFamily: "var(--font-body)" }}
          >
            Skip to result
          </button>
        </div>
      </form>
      <p className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
        No spam. Unsubscribe anytime. For research use only.
      </p>
    </div>
  );
}
