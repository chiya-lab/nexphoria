"use client";

import { Check } from "lucide-react";

export interface ContactData {
  email: string;
  createAccount: boolean;
}

export default function PprContactStep({
  value,
  onChange,
  onContinue,
}: {
  value: ContactData;
  onChange: (next: ContactData) => void;
  onContinue: () => void;
}) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
        >
          Email
        </span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          placeholder="researcher@lab.org"
          className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
          style={{
            backgroundColor: "var(--ink)",
            border: "1px solid var(--steel)",
            color: "var(--platinum)",
            fontFamily: "var(--font-body)",
          }}
        />
        <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
          Order confirmation and COA delivery
        </span>
      </label>

      <button
        type="button"
        onClick={() => onChange({ ...value, createAccount: !value.createAccount })}
        className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2"
        aria-pressed={value.createAccount}
      >
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
          style={{
            backgroundColor: value.createAccount ? "var(--accent)" : "transparent",
            border: `1px solid ${value.createAccount ? "var(--accent)" : "var(--steel)"}`,
          }}
          aria-hidden="true"
        >
          {value.createAccount && <Check size={13} style={{ color: "var(--ink)" }} />}
        </span>
        <span className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
          Create an account to track lots, reorder protocols, and store COAs
        </span>
      </button>

      <button
        type="button"
        disabled={!emailValid}
        onClick={onContinue}
        className="mt-1 rounded-md py-3.5 text-[15px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
      >
        Continue as {value.createAccount ? "member" : "guest"}
      </button>
    </div>
  );
}
