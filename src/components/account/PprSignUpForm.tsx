"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RESEARCHER_TYPE_LABEL, type ResearcherType } from "@/lib/mock-account";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEARCHER_TYPES: ResearcherType[] = ["academic", "industry", "clinical lab"];

export default function PprSignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [researcherType, setResearcherType] = useState<ResearcherType>("academic");
  const [ruo, setRuo] = useState(false);
  const [age, setAge] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Enter your name.");
    if (!EMAIL_RE.test(email)) return setError("Enter a valid email address.");
    if (!org.trim()) return setError("Enter your organization.");
    if (!ruo) return setError("You must affirm research-use-only intent.");
    if (!age) return setError("You must confirm you are 21 or older.");
    setError(null);
    router.push("/account");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Full name</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus-visible:ring-1" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }} />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus-visible:ring-1" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }} />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Organization</span>
        <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus-visible:ring-1" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }} />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Researcher type</span>
        <select value={researcherType} onChange={(e) => setResearcherType(e.target.value as ResearcherType)} className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus-visible:ring-1" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }}>
          {RESEARCHER_TYPES.map((t) => <option key={t} value={t}>{RESEARCHER_TYPE_LABEL[t]}</option>)}
        </select>
      </label>

      <label className="flex items-start gap-2 text-[13px]" style={{ color: "var(--silver-1)" }}>
        <input type="checkbox" checked={ruo} onChange={(e) => setRuo(e.target.checked)} className="mt-0.5" />
        <span>I affirm that all purchases are for laboratory research use only — not for human or animal consumption.</span>
      </label>
      <label className="flex items-start gap-2 text-[13px]" style={{ color: "var(--silver-1)" }}>
        <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} className="mt-0.5" />
        <span>I confirm I am 21 years of age or older.</span>
      </label>

      {error && <p className="text-[12px]" style={{ color: "var(--danger)" }}>{error}</p>}

      <button
        type="submit"
        className="w-full rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", backgroundColor: "var(--accent)", color: "var(--ink)" }}
      >
        Create research account
      </button>
    </form>
  );
}
