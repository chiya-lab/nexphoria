"use client";

import { useState } from "react";
import { MOCK_PAYMENT_METHODS, type PaymentMethod } from "@/lib/mock-account";

const BRANDS: PaymentMethod["brand"][] = ["Visa", "Mastercard", "Amex"];

export default function PprPaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [showForm, setShowForm] = useState(false);
  const [brand, setBrand] = useState<PaymentMethod["brand"]>("Visa");
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");

  function setDefault(id: string) {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  }
  function remove(id: string) {
    setMethods((prev) => {
      const next = prev.filter((m) => m.id !== id);
      // Keep a default if one existed.
      if (next.length > 0 && !next.some((m) => m.isDefault)) next[0].isDefault = true;
      return [...next];
    });
  }
  function add(e: React.FormEvent) {
    e.preventDefault();
    const last4 = number.replace(/\D/g, "").slice(-4);
    const [mm, yy] = exp.split("/").map((s) => s.trim());
    const expMonth = Number.parseInt(mm, 10);
    const expYear = yy && yy.length === 2 ? 2000 + Number.parseInt(yy, 10) : Number.parseInt(yy, 10);
    if (last4.length !== 4 || Number.isNaN(expMonth) || Number.isNaN(expYear)) return;
    setMethods((prev) => [
      ...prev,
      { id: `pm-${Date.now()}`, brand, last4, expMonth, expYear, isDefault: prev.length === 0 },
    ]);
    setNumber("");
    setExp("");
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {methods.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {m.brand} ···· {m.last4}
                {m.isDefault && (
                  <span className="ml-2 rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", border: "1px solid var(--steel)" }}>Default</span>
                )}
              </p>
              <p className="mt-1 text-[12px]" style={{ color: "var(--silver-2)", fontFamily: "var(--font-mono)" }}>
                Exp {String(m.expMonth).padStart(2, "0")}/{m.expYear}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>
              {!m.isDefault && <button type="button" onClick={() => setDefault(m.id)} className="uppercase" style={{ color: "var(--silver-2)" }}>Set default</button>}
              <button type="button" onClick={() => remove(m.id)} className="uppercase" style={{ color: "var(--danger)" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide focus:outline-none focus-visible:ring-2"
          style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
        >
          Add card
        </button>
      )}

      {showForm && (
        <form onSubmit={add} className="rounded-xl border p-5" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
          <h3 className="mb-4 text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>New card</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Brand</span>
              <select value={brand} onChange={(e) => setBrand(e.target.value as PaymentMethod["brand"])} className="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink)", color: "var(--platinum)" }}>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Card number</span>
              <input inputMode="numeric" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink)", color: "var(--platinum)" }} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Exp (MM/YY)</span>
              <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="06/28" className="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink)", color: "var(--platinum)" }} />
            </label>
          </div>
          <p className="mt-3 text-[11px]" style={{ color: "var(--silver-3)" }}>
            Demonstration only — no card data is transmitted or stored.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2" style={{ fontFamily: "var(--font-mono)", backgroundColor: "var(--accent)", color: "var(--ink)" }}>Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
