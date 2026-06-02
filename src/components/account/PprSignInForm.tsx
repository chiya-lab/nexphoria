"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PprSignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 1) {
      setError("Enter your password.");
      return;
    }
    setError(null);
    router.push("/account");
  }

  function magicLink() {
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email to receive a sign-in link.");
      return;
    }
    setError(null);
    setMagicSent(true);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus-visible:ring-1"
          style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--silver-2)" }}>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-md border px-3 py-2.5 text-sm outline-none focus-visible:ring-1"
          style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }}
        />
      </label>

      {error && <p className="text-[12px]" style={{ color: "var(--danger)" }}>{error}</p>}
      {magicSent && <p className="text-[12px]" style={{ color: "var(--ok)" }}>If that email is registered, a sign-in link is on its way.</p>}

      <button
        type="submit"
        className="w-full rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", backgroundColor: "var(--accent)", color: "var(--ink)" }}
      >
        Sign in
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1" style={{ backgroundColor: "var(--steel)" }} />
        <span className="text-[11px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>or</span>
        <span className="h-px flex-1" style={{ backgroundColor: "var(--steel)" }} />
      </div>

      <button
        type="button"
        onClick={magicLink}
        className="w-full rounded-md border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", borderColor: "var(--steel)", color: "var(--silver-1)" }}
      >
        Email me a sign-in link
      </button>
      <button
        type="button"
        onClick={() => router.push("/account")}
        className="w-full rounded-md border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", borderColor: "var(--steel)", color: "var(--silver-1)" }}
      >
        Continue with Google
      </button>
    </form>
  );
}
