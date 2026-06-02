"use client";

import { useState } from "react";
import { WAITLIST_URL } from "@/lib/endpoints";

export default function PprNewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(WAITLIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error === "already_registered" ? "success" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="px-6 py-24 md:py-32" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="mx-auto max-w-[720px] text-center">
        <h2
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          Cited research, monthly. No promos.
        </h2>
        <p
          className="mx-auto mt-4 max-w-[520px] text-[15px]"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.55 }}
        >
          New compound reviews, methodology notes, and COA announcements — first Monday
          of every month. For qualified researchers only.
        </p>

        {status === "success" ? (
          <div
            className="mx-auto mt-8 max-w-[480px] rounded-md px-5 py-4"
            style={{ border: "1px solid var(--accent)", backgroundColor: "rgba(184,224,79,0.06)" }}
          >
            <p className="text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}>
              You&apos;re subscribed. Lab notes inbound.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-[480px] flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@institution.edu"
              required
              disabled={status === "loading"}
              className="flex-1 rounded-md px-4 py-3 text-[14px] focus:outline-none focus-visible:ring-2"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: "var(--ink)",
                border: "1px solid var(--steel)",
                color: "var(--platinum)",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md px-6 py-3 text-[14px] font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--danger)" }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
