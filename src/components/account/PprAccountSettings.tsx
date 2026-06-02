"use client";

import { useState } from "react";
import {
  MOCK_USER,
  RESEARCHER_TYPE_LABEL,
  type AccountUser,
} from "@/lib/mock-account";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border p-5" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
      <h2 className="mb-4 text-sm font-semibold uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--silver-1)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
        style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink)", color: "var(--platinum)" }}
      />
    </label>
  );
}

const VERIFICATION_COLOR: Record<AccountUser["verification"], string> = {
  verified: "var(--ok)",
  pending: "var(--warn)",
  unverified: "var(--danger)",
};

export default function PprAccountSettings() {
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [org, setOrg] = useState(MOCK_USER.organization);
  const [profileSaved, setProfileSaved] = useState(false);

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const [ruoAck, setRuoAck] = useState(true);
  const [ruoMsg, setRuoMsg] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState("");

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 8) {
      setPwdMsg("Password must be at least 8 characters.");
      return;
    }
    if (pwd !== pwd2) {
      setPwdMsg("Passwords do not match.");
      return;
    }
    setPwd("");
    setPwd2("");
    setPwdMsg("Password updated.");
    setTimeout(() => setPwdMsg(null), 2500);
  }

  function reacknowledge() {
    if (!ruoAck) {
      setRuoMsg("You must affirm research-use-only intent to continue.");
      return;
    }
    setRuoMsg("Research-use acknowledgement recorded.");
    setTimeout(() => setRuoMsg(null), 2500);
  }

  return (
    <div className="space-y-5">
      <Panel title="Profile">
        <form onSubmit={saveProfile} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Full name" value={name} onChange={setName} />
          <TextField label="Email" value={email} onChange={setEmail} type="email" />
          <TextField label="Organization" value={org} onChange={setOrg} />
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Researcher type</span>
            <input
              readOnly
              value={RESEARCHER_TYPE_LABEL[MOCK_USER.researcherType]}
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-3)", color: "var(--silver-2)" }}
            />
          </label>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="submit" className="rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2" style={{ fontFamily: "var(--font-mono)", backgroundColor: "var(--accent)", color: "var(--ink)" }}>
              Save profile
            </button>
            {profileSaved && <span className="text-[12px]" style={{ color: "var(--ok)" }}>Saved</span>}
          </div>
        </form>
      </Panel>

      <Panel title="Researcher verification">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--silver-1)" }}>
            Status:{" "}
            <span style={{ color: VERIFICATION_COLOR[MOCK_USER.verification], textTransform: "capitalize" }}>
              {MOCK_USER.verification}
            </span>
          </p>
        </div>
        <p className="mt-2 text-[13px]" style={{ color: "var(--silver-2)" }}>
          Verification confirms institutional or industry research affiliation. Verified accounts
          may purchase the full catalog and request wholesale terms.
        </p>
      </Panel>

      <Panel title="Research-use acknowledgement">
        <p className="text-[13px]" style={{ color: "var(--silver-2)" }}>
          All compounds are supplied strictly for laboratory research use only (RUO) and are not
          for human or animal consumption, diagnostic, or therapeutic use.
        </p>
        <label className="mt-3 flex items-start gap-2 text-[13px]" style={{ color: "var(--silver-1)" }}>
          <input type="checkbox" checked={ruoAck} onChange={(e) => setRuoAck(e.target.checked)} className="mt-0.5" />
          <span>I affirm that all purchases are for research use only and that I am 21 years of age or older.</span>
        </label>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={reacknowledge} className="rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide focus:outline-none focus-visible:ring-2" style={{ fontFamily: "var(--font-mono)", borderColor: "var(--steel)", color: "var(--silver-1)" }}>
            Re-acknowledge
          </button>
          {ruoMsg && <span className="text-[12px]" style={{ color: ruoAck ? "var(--ok)" : "var(--danger)" }}>{ruoMsg}</span>}
        </div>
      </Panel>

      <Panel title="Change password">
        <form onSubmit={changePassword} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="New password" value={pwd} onChange={setPwd} type="password" />
          <TextField label="Confirm password" value={pwd2} onChange={setPwd2} type="password" />
          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="submit" className="rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2" style={{ fontFamily: "var(--font-mono)", backgroundColor: "var(--accent)", color: "var(--ink)" }}>
              Update password
            </button>
            {pwdMsg && <span className="text-[12px]" style={{ color: pwdMsg.includes("updated") ? "var(--ok)" : "var(--danger)" }}>{pwdMsg}</span>}
          </div>
        </form>
      </Panel>

      <Panel title="Delete account">
        <p className="text-[13px]" style={{ color: "var(--silver-2)" }}>
          Deleting your account removes order history, saved protocols, and stored certificates.
          This action cannot be undone. Type <span className="font-mono" style={{ color: "var(--danger)" }}>DELETE</span> to confirm.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder="DELETE"
            className="rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
            style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink)", color: "var(--platinum)" }}
          />
          <button
            type="button"
            disabled={confirmDelete !== "DELETE"}
            className="rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-40"
            style={{ fontFamily: "var(--font-mono)", borderColor: "var(--danger)", color: "var(--danger)" }}
          >
            Delete account
          </button>
        </div>
      </Panel>
    </div>
  );
}
