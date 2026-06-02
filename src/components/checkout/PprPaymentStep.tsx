"use client";

import { Lock, Bitcoin, ShieldCheck, Landmark } from "lucide-react";

export interface PaymentData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  zip: string;
  crypto: boolean;
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isPaymentComplete(d: PaymentData): boolean {
  if (d.crypto) return true;
  return (
    d.cardNumber.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(d.expiry) &&
    /^\d{3,4}$/.test(d.cvc) &&
    /^\d{5}(-\d{4})?$/.test(d.zip)
  );
}

const SEALS = [
  { icon: Lock, label: "256-bit TLS" },
  { icon: ShieldCheck, label: "PCI DSS" },
  { icon: Landmark, label: "Verified merchant" },
];

export default function PprPaymentStep({
  value,
  onChange,
  onSubmit,
  submitLabel,
}: {
  value: PaymentData;
  onChange: (next: PaymentData) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const complete = isPaymentComplete(value);

  return (
    <div className="flex flex-col gap-4">
      {!value.crypto && (
        <>
          <label className="flex flex-col gap-1.5">
            <span
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
            >
              Card number
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={value.cardNumber}
              onChange={(e) => onChange({ ...value, cardNumber: formatCardNumber(e.target.value) })}
              placeholder="0000 0000 0000 0000"
              className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: "var(--ink)",
                border: "1px solid var(--steel)",
                color: "var(--platinum)",
                fontFamily: "var(--font-mono)",
              }}
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1.5">
              <span
                className="text-[12px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
              >
                Expiry
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={value.expiry}
                onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
                placeholder="MM/YY"
                className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span
                className="text-[12px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
              >
                CVC
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={value.cvc}
                onChange={(e) => onChange({ ...value, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="123"
                className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span
                className="text-[12px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
              >
                ZIP
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={value.zip}
                onChange={(e) => onChange({ ...value, zip: e.target.value.replace(/[^\d-]/g, "").slice(0, 10) })}
                placeholder="00000"
                className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: "var(--ink)",
                  border: "1px solid var(--steel)",
                  color: "var(--platinum)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => onChange({ ...value, crypto: !value.crypto })}
        className="flex items-center gap-3 rounded-md px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2"
        style={{
          border: `1px solid ${value.crypto ? "var(--accent)" : "var(--steel)"}`,
          backgroundColor: value.crypto ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--ink)",
        }}
        aria-pressed={value.crypto}
      >
        <Bitcoin size={18} aria-hidden="true" style={{ color: "var(--accent)", flexShrink: 0 }} />
        <span className="flex flex-1 flex-col">
          <span className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
            Pay with crypto
          </span>
          <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
            BTC · ETH · USDC settlement
          </span>
        </span>
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
          {value.crypto ? "Selected" : "Select"}
        </span>
      </button>

      <button
        type="button"
        disabled={!complete}
        onClick={onSubmit}
        className="mt-1 flex items-center justify-center gap-2 rounded-md py-4 text-[16px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
      >
        <Lock size={16} aria-hidden="true" />
        {submitLabel}
      </button>

      <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {SEALS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.label} className="flex items-center gap-1.5">
              <Icon size={13} aria-hidden="true" style={{ color: "var(--silver-2)" }} />
              <span
                className="text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--silver-2)" }}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
