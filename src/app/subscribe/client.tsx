"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, BellRing, PackageCheck, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import TrustBadges from "@/components/TrustBadges";
import { WAITLIST_URL } from "@/lib/endpoints";

type FormStatus = "idle" | "loading" | "error";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const benefits = [
  {
    icon: FlaskConical,
    title: "New Compound Releases",
    body: "Be first to know when we add a research compound to the catalog — with its full analytical profile and independent COA available from day one.",
  },
  {
    icon: BellRing,
    title: "Restock Alerts",
    body: "Get notified the moment a sold-out compound returns to stock, so a backorder never stalls your research timeline.",
  },
  {
    icon: PackageCheck,
    title: "Lot-Drop Notifications",
    body: "Fresh lots are announced as they pass independent HPLC and ESI-MS verification — lot-specific COA linked, no marketing filler.",
  },
];

export default function SubscribeClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email.");
      setStatus("error");
      return;
    }
    if (!tcpaConsent) {
      setErrorMsg("Please confirm your consent to receive research updates.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      try {
        const existing = JSON.parse(localStorage.getItem("nex_subscribers") || "[]") as string[];
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem("nex_subscribers", JSON.stringify(existing));
        }
      } catch {
        // localStorage may be unavailable
      }
      await fetch(WAITLIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          institution,
          source: "nexphoria-subscribe-page",
          tcpaConsent: true,
          tcpaConsentTimestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      });
      router.push("/subscribe/confirmed");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F0F0E" }}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: "#2A2A28" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url(/brand/cell-pattern-1.png)",
            backgroundSize: "400px 400px",
            backgroundRepeat: "repeat",
            opacity: 0.05,
          }}
        />
        <div className="container-nex relative z-10 pt-36 pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="max-w-3xl">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Research Updates" }]} variant="dark" className="mb-6" />
            <span className="eyebrow mb-5 block">Research Updates</span>
            <h1
              className="font-bold tracking-tight mb-6"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "#FDFCF8",
              }}
            >
              New Lots. New Compounds.{" "}
              <em className="italic" style={{ color: "#B8A44C" }}>No Noise.</em>
            </h1>
            <p className="text-lg max-w-xl leading-relaxed text-secondary">
              Restock alerts, lot-drop notifications, and new compound releases — sent only when there
              is something a working researcher needs to know. Independent COA documentation with every order.
            </p>
            <div className="mt-8">
              <TrustBadges variant="dark" size="md" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-24 border-b" style={{ borderColor: "#2A2A28" }}>
        <div className="container-nex">
          <div className="grid md:grid-cols-3 gap-px border" style={{ backgroundColor: "#2A2A28", borderColor: "#2A2A28" }}>
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="p-8"
                style={{ backgroundColor: "#1C1C1A" }}
              >
                <div
                  className="w-10 h-10 mb-6 flex items-center justify-center border"
                  style={{ borderColor: "#2A2A28" }}
                >
                  <b.icon className="w-5 h-5" style={{ color: "#B8A44C" }} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "#FDFCF8" }}>
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-secondary">{b.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section className="py-20 md:py-24">
        <div className="container-nex">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="max-w-xl mx-auto"
          >
            <div className="text-center mb-10">
              <span className="eyebrow mb-4 block">Join The List</span>
              <h2
                className="font-bold tracking-tight mb-3"
                style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#FDFCF8" }}
              >
                Stay Current
              </h2>
              <p className="text-sm text-secondary">
                For qualified researchers and licensed professionals. Unsubscribe any time.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-label block mb-2 text-secondary">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  required
                  className="nex-input"
                  style={{ backgroundColor: "#1C1C1A", borderColor: "#2A2A28", color: "#FDFCF8" }}
                  placeholder="researcher@institution.edu"
                />
              </div>

              <div>
                <label className="text-label block mb-2 text-secondary">Institution / Lab (optional)</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="nex-input"
                  style={{ backgroundColor: "#1C1C1A", borderColor: "#2A2A28", color: "#FDFCF8" }}
                  placeholder="University / Research Organization"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tcpaConsent}
                  onChange={(e) => {
                    setTcpaConsent(e.target.checked);
                    if (status === "error") setStatus("idle");
                  }}
                  required
                  className="mt-0.5 flex-shrink-0 accent-[#B8A44C]"
                  aria-required="true"
                />
                <span className="text-xs leading-relaxed" style={{ color: "rgba(138,128,117,0.75)" }}>
                  I agree to receive research updates from Nexphoria Research, LLC. Consent is not a
                  condition of purchase. You may withdraw at any time. View our{" "}
                  <a href="/privacy" className="underline">Privacy Policy</a>.
                </span>
              </label>

              {status === "error" && errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "loading" || !tcpaConsent}
                className="btn-acid w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Research Updates
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-center" style={{ color: "rgba(138,128,117,0.55)" }}>
                Signal-only updates. No human-consumption content. For research use only.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
