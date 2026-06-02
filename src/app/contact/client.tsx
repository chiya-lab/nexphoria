"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { CONTACT_URL } from "@/lib/endpoints";
import Breadcrumb from "@/components/Breadcrumb";
import TrustBadges from "@/components/TrustBadges";

type FormStatus = "idle" | "loading" | "success" | "error";

const inquiryTypes = [
  "Compound Inquiry",
  "Custom Synthesis Request",
  "Bulk Order",
  "White Label / Partnership",
  "COA / Documentation Request",
  "Technical Question",
  "Other",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function ContactClient() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    inquiryType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tcpaConsent) return;
    setStatus("loading");

    try {
      const response = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, tcpaConsent: true, tcpaConsentTimestamp: new Date().toISOString() }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          institution: "",
          inquiryType: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Contact form error:', error);
      }
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F0F0E" }}>

      {/* Hero with image0016.jpg side accent */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: "#2A2A28" }}>
        <div className="grid md:grid-cols-[60fr_40fr]" style={{ minHeight: "380px" }}>
          {/* Text */}
          <div className="pt-36 pb-16 container-nex md:pr-0">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <Breadcrumb items={[{label:"Home",href:"/"},{label:"Contact"}]} variant="dark" className="mb-6" />
              <span className="eyebrow mb-5 block">Get In Touch</span>
              <h1
                className="font-bold tracking-tight mb-6"
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  lineHeight: 1.05,
                  color: "#FDFCF8",
                }}
              >
                Contact{" "}
                <em className="italic" style={{ color: "#B8A44C" }}>Nexphoria</em>
              </h1>
              <p className="text-lg max-w-xl leading-relaxed text-secondary">
                Compound inquiries, custom synthesis requests, bulk orders, and documentation
                questions. Response within 1–2 business days.
              </p>
            </motion.div>
          </div>
          {/* Accent image */}
          <div className="relative hidden md:block overflow-hidden" style={{ minHeight: "380px" }}>
            <Image
              src="/images/image0016.jpg"
              alt="Nexphoria — clarity in every detail"
              fill
              className="object-cover object-center"
              loading="lazy"
              sizes="40vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to left, transparent 50%, #0F0F0E 100%)" }}
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 pb-32">
        <div className="container-nex">
          <div className="grid md:grid-cols-3 gap-16">

            {/* Info column */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="space-y-10"
            >
              <div>
                <h3 className="text-label mb-6 text-secondary">Contact Details</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" strokeWidth={1.5} />
                    <div>
                      <div className="text-label mb-1 text-secondary">Email</div>
                      <a
                        href="mailto:research@nexphoria.com"
                        className="text-sm transition-colors hover:text-gold"
                        style={{ color: "#FDFCF8" }}
                      >
                        research@nexphoria.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" strokeWidth={1.5} />
                    <div>
                      <div className="text-label mb-1 text-secondary">Response Time</div>
                      <p className="text-sm" style={{ color: "#FDFCF8" }}>1–2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" strokeWidth={1.5} />
                    <div>
                      <div className="text-label mb-1 text-secondary">Shipping</div>
                      <p className="text-sm" style={{ color: "#FDFCF8" }}>United States only</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" strokeWidth={1.5} />
                    <div>
                      <div className="text-label mb-1 text-secondary">WhatsApp</div>
                      <a
                        href="https://wa.me/15551234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "#FDFCF8" }}
                      >
                        Message us on WhatsApp
                      </a>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(253,252,248,0.4)" }}>For urgent inquiries — Mon–Fri 9 AM–5 PM ET</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border p-6" style={{ borderColor: "#2A2A28" }}>
                <div className="text-label mb-3 text-secondary">Research Verification</div>
                <p className="text-sm leading-relaxed text-secondary">
                  All orders require verification of researcher or institutional credentials. Please
                  include your institution or license information when submitting.
                </p>
              </div>

              {/* Trust badges */}
              <div>
                <div className="text-label mb-4 text-secondary">Our Standards</div>
                <TrustBadges variant="dark" className="flex-col items-start" />
              </div>

            </motion.div>

            {/* Form */}
            <div className="md:col-span-2">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center border"
                  style={{
                    borderColor: "rgba(198,241,132,0.3)",
                    backgroundColor: "rgba(198,241,132,0.05)",
                  }}
                >
                  <div className="w-8 h-px mx-auto mb-6" style={{ backgroundColor: "#B8A44C" }} />
                  <h3
                    className="text-2xl font-medium mb-3"
                    style={{ fontFamily: "Georgia, serif", color: "#FDFCF8" }}
                  >
                    Inquiry Received
                  </h3>
                  <p className="text-sm max-w-sm mx-auto text-secondary">
                    We&apos;ll review your request and respond within 1–2 business days. Research
                    verification may be required prior to order processing.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial="hidden" animate="visible" variants={fadeUp} custom={2}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="text-label block mb-2 text-secondary"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="nex-input" style={{ backgroundColor: "#1C1C1A", borderColor: "#2A2A28", color: "#FDFCF8" }}
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="text-label block mb-2 text-secondary">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="nex-input" style={{ backgroundColor: "#1C1C1A", borderColor: "#2A2A28", color: "#FDFCF8" }}
                        placeholder="researcher@university.edu"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-label block mb-2 text-secondary">
                        Institution / Organization
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        className="nex-input" style={{ backgroundColor: "#1C1C1A", borderColor: "#2A2A28", color: "#FDFCF8" }}
                        placeholder="University / Lab / Company"
                      />
                    </div>
                    <div>
                      <label className="text-label block mb-2 text-secondary">
                        Subject *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        required
                        className="nex-input appearance-none"
                        style={{ backgroundColor: "#1C1C1A", borderColor: "#2A2A28", color: "#FDFCF8" }}
                      >
                        <option value="">Select subject...</option>
                        {inquiryTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-label block mb-2 text-secondary">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={7}
                      className="nex-input resize-none"
                      style={{ backgroundColor: "#1C1C1A", borderColor: "#2A2A28", color: "#FDFCF8" }}
                      placeholder="Describe your compound needs, quantities, specifications, or questions..."
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-600">
                      Something went wrong. Email us directly at research@nexphoria.com.
                    </p>
                  )}

                  {/* TCPA Consent */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tcpaConsent}
                      onChange={(e) => setTcpaConsent(e.target.checked)}
                      required
                      className="mt-0.5 flex-shrink-0 accent-[#B8A44C]"
                      aria-required="true"
                    />
                    <span className="text-xs leading-relaxed" style={{ color: "rgba(138,128,117,0.75)" }}>
                      I agree to receive communications from Nexphoria Research, LLC regarding my inquiry.
                      Consent is not a condition of purchase or service. You may withdraw consent at any time by contacting
                      {" "}<a href="mailto:research@nexphoria.com" className="underline">research@nexphoria.com</a>.
                      View our{" "}<a href="/privacy" className="underline">Privacy Policy</a>.
                    </span>
                  </label>

                  <div className="flex items-center gap-6">
                    <button
                      type="submit"
                      disabled={status === "loading" || !tcpaConsent}
                      className="btn-acid disabled:opacity-60"
                    >
                      {status === "loading" ? "Sending..." : "Submit Inquiry"}
                      {status !== "loading" && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs" style={{ color: "rgba(138,128,117,0.55)" }}>
                    Prefer email? Reach us directly at{" "}
                    <a href="mailto:research@nexphoria.com" className="underline text-secondary">research@nexphoria.com</a>.{" "}
                    By submitting, you confirm you are a qualified researcher or licensed
                    professional. See our{" "}
                    <a
                      href="/legal/disclaimer"
                      className="underline text-secondary"
                    >
                      disclaimer
                    </a>{" "}
                    for terms.
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
