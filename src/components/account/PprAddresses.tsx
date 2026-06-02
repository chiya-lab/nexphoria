"use client";

import { useState } from "react";
import { MOCK_ADDRESSES, type Address } from "@/lib/mock-account";

type Draft = Omit<Address, "id" | "isDefaultShip" | "isDefaultBill">;

const EMPTY_DRAFT: Draft = {
  label: "",
  recipient: "",
  organization: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>
        {label}{required && " *"}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
        style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink)", color: "var(--platinum)" }}
      />
    </label>
  );
}

export default function PprAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [showForm, setShowForm] = useState(false);

  function setDefaultShip(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefaultShip: a.id === id })));
  }
  function setDefaultBill(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefaultBill: a.id === id })));
  }
  function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }
  function startEdit(a: Address) {
    setEditingId(a.id);
    setDraft({ ...a });
    setShowForm(true);
  }
  function startAdd() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setShowForm(true);
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...draft } : a)));
    } else {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => [
        ...prev,
        { ...draft, id, isDefaultShip: prev.length === 0, isDefaultBill: prev.length === 0 },
      ]);
    }
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  const valid = draft.recipient.trim() && draft.line1.trim() && draft.city.trim() && draft.state.trim() && draft.postalCode.trim();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-xl border p-4" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>{a.label}</span>
              <div className="flex gap-1.5">
                {a.isDefaultShip && (
                  <span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", border: "1px solid var(--steel)" }}>Ship</span>
                )}
                {a.isDefaultBill && (
                  <span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-1)", border: "1px solid var(--steel)" }}>Bill</span>
                )}
              </div>
            </div>
            <address className="mt-2 not-italic text-[13px] leading-relaxed" style={{ color: "var(--silver-1)" }}>
              {a.recipient}<br />
              {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
              {a.city}, {a.state} {a.postalCode}
            </address>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>
              <button type="button" onClick={() => startEdit(a)} className="uppercase tracking-wide" style={{ color: "var(--silver-1)" }}>Edit</button>
              {!a.isDefaultShip && <button type="button" onClick={() => setDefaultShip(a.id)} className="uppercase tracking-wide" style={{ color: "var(--silver-2)" }}>Set ship</button>}
              {!a.isDefaultBill && <button type="button" onClick={() => setDefaultBill(a.id)} className="uppercase tracking-wide" style={{ color: "var(--silver-2)" }}>Set bill</button>}
              {!a.isDefaultShip && !a.isDefaultBill && <button type="button" onClick={() => remove(a.id)} className="uppercase tracking-wide" style={{ color: "var(--danger)" }}>Delete</button>}
            </div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          type="button"
          onClick={startAdd}
          className="rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2"
          style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
        >
          Add address
        </button>
      )}

      {showForm && (
        <form onSubmit={save} className="rounded-xl border p-5" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
          <h3 className="mb-4 text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
            {editingId ? "Edit address" : "New address"}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Label" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
            <Field label="Recipient" value={draft.recipient} onChange={(v) => setDraft({ ...draft, recipient: v })} required />
            <Field label="Organization" value={draft.organization ?? ""} onChange={(v) => setDraft({ ...draft, organization: v })} />
            <Field label="Address line 1" value={draft.line1} onChange={(v) => setDraft({ ...draft, line1: v })} required />
            <Field label="Address line 2" value={draft.line2 ?? ""} onChange={(v) => setDraft({ ...draft, line2: v })} />
            <Field label="City" value={draft.city} onChange={(v) => setDraft({ ...draft, city: v })} required />
            <Field label="State" value={draft.state} onChange={(v) => setDraft({ ...draft, state: v })} required />
            <Field label="Postal code" value={draft.postalCode} onChange={(v) => setDraft({ ...draft, postalCode: v })} required />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={!valid}
              className="rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 disabled:opacity-40"
              style={{ fontFamily: "var(--font-mono)", backgroundColor: "var(--accent)", color: "var(--ink)" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide"
              style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
