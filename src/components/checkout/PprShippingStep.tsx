"use client";

import { Check } from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export interface ShippingData {
  firstName: string;
  lastName: string;
  institution: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  method: ShippingMethodId;
}

export type ShippingMethodId = "standard" | "expedited" | "overnight";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  detail: string;
  price: number;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: "standard", label: "Standard cold-chain", detail: "3–5 business days", price: 0 },
  { id: "expedited", label: "Expedited", detail: "2 business days", price: 14 },
  { id: "overnight", label: "Overnight priority", detail: "Next business day", price: 34 },
];

function field(
  label: string,
  key: keyof ShippingData,
  value: ShippingData,
  onChange: (next: ShippingData) => void,
  opts: { autoComplete?: string; placeholder?: string; required?: boolean } = {},
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="text-[12px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
      >
        {label}
        {opts.required === false && <span style={{ color: "var(--silver-2)" }}> (optional)</span>}
      </span>
      <input
        type="text"
        autoComplete={opts.autoComplete}
        placeholder={opts.placeholder}
        value={value[key] as string}
        onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: "var(--ink)",
          border: "1px solid var(--steel)",
          color: "var(--platinum)",
          fontFamily: "var(--font-body)",
        }}
      />
    </label>
  );
}

export function isShippingComplete(d: ShippingData): boolean {
  return Boolean(d.firstName && d.lastName && d.address1 && d.city && d.state && /^\d{5}(-\d{4})?$/.test(d.zip));
}

export default function PprShippingStep({
  value,
  onChange,
  onContinue,
}: {
  value: ShippingData;
  onChange: (next: ShippingData) => void;
  onContinue: () => void;
}) {
  const complete = isShippingComplete(value);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {field("First name", "firstName", value, onChange, { autoComplete: "given-name" })}
        {field("Last name", "lastName", value, onChange, { autoComplete: "family-name" })}
      </div>
      {field("Institution / lab", "institution", value, onChange, {
        autoComplete: "organization",
        required: false,
        placeholder: "Optional",
      })}
      {field("Address", "address1", value, onChange, { autoComplete: "address-line1" })}
      {field("Apt, suite, unit", "address2", value, onChange, {
        autoComplete: "address-line2",
        required: false,
        placeholder: "Optional",
      })}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        {field("City", "city", value, onChange, { autoComplete: "address-level2" })}
        <label className="flex flex-col gap-1.5">
          <span
            className="text-[12px] uppercase"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
          >
            State
          </span>
          <select
            autoComplete="address-level1"
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
            className="rounded-md px-3 py-3 text-[15px] focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: "var(--ink)",
              border: "1px solid var(--steel)",
              color: value.state ? "var(--platinum)" : "var(--silver-2)",
              fontFamily: "var(--font-body)",
            }}
          >
            <option value="">—</option>
            {US_STATES.map((s) => (
              <option key={s} value={s} style={{ color: "#000" }}>
                {s}
              </option>
            ))}
          </select>
        </label>
        {field("ZIP", "zip", value, onChange, { autoComplete: "postal-code" })}
      </div>

      {/* Shipping method selector */}
      <div className="mt-1 flex flex-col gap-2">
        <span
          className="text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}
        >
          Shipping method
        </span>
        {SHIPPING_METHODS.map((m) => {
          const active = value.method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange({ ...value, method: m.id })}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                backgroundColor: active ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--ink)",
              }}
              aria-pressed={active}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: active ? "var(--accent)" : "transparent",
                  border: `1px solid ${active ? "var(--accent)" : "var(--steel)"}`,
                }}
                aria-hidden="true"
              >
                {active && <Check size={11} style={{ color: "var(--ink)" }} />}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                  {m.label}
                </span>
                <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  {m.detail}
                </span>
              </span>
              <span className="text-[14px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)" }}>
                {m.price === 0 ? "FREE" : `$${m.price.toFixed(2)}`}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!complete}
        onClick={onContinue}
        className="mt-1 rounded-md py-3.5 text-[15px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
      >
        Continue to payment
      </button>
    </div>
  );
}
