"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Phone, Calendar, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import RUOBanner from "@/components/RUOBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const services = [
  {
    title: "White-Label Manufacturing",
    description: "Private-label peptide compounds manufactured to your specifications under our quality standards.",
    features: [
      "Custom formulation development",
      "Your brand packaging and labeling",
      "Full batch documentation",
      "Flexible order quantities"
    ]
  },
  {
    title: "Custom Packaging Solutions",
    description: "Tailored packaging options for distributors and research institutions.",
    features: [
      "Branded vial labels and caps",
      "Custom documentation packages",
      "Cold-chain shipping materials",
      "Lot-specific COA inclusion"
    ]
  },
  {
    title: "Distributor Program",
    description: "Qualified distributors gain access to wholesale pricing and dedicated account management.",
    features: [
      "Volume pricing tiers",
      "Dedicated account manager",
      "Priority production scheduling",
      "Marketing support materials"
    ]
  }
];

const qualifications = [
  "Research institution with valid credentials",
  "Licensed pharmaceutical distributor",
  "Qualified clinical research organization",
  "GMP-certified manufacturing facility"
];

const volumeOptions = [
  "Under $5,000 / month",
  "$5,000 – $15,000 / month",
  "$15,000 – $50,000 / month",
  "$50,000+ / month",
];

const WORKER_URL = "https://nexphoria-checkout.chiya-b60.workers.dev";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function WholesaleClient() {
  const [form, setForm] = useState({
    name: "",
    institution: "",
    email: "",
    monthlyVolume: "",
    compounds: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [tcpaConsent, setTcpaConsent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.institution) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (!tcpaConsent) {
      setErrorMsg("Please confirm your consent before submitting.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`${WORKER_URL}/wholesale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tcpaConsent: true, tcpaConsentTimestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data?.error === "invalid_email" ? "Please enter a valid email." : "Submission failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-dark text-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 z-10" style={{
          background: "linear-gradient(135deg, #EAE7E3 0%, #F5F3F0 100%)"
        }} />

        <div className="container-nex relative z-20">
          <Breadcrumb
            variant="light"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Wholesale" },
            ]}
          />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl"
          >
            <span className="eyebrow mb-6 block">B2B Solutions</span>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-primary"
              style={{ fontFamily: "var(--font-display)" }}>
              White-Label &{" "}
              <em className="italic text-acid-green">Custom Packaging</em>
            </h1>
            <p className="text-xl text-secondary leading-relaxed mb-8 max-w-2xl">
              We produce private-label peptide compounds for qualified distributors, research
              institutions, and pharmaceutical partners. Same quality standards, your brand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#inquiry-form"
                className="btn-acid"
              >
                <Mail className="w-4 h-4" />
                Get Wholesale Pricing
              </a>
              <a
                href="#qualifications"
                className="btn-outline-gold"
              >
                View Requirements
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Verification trust signals */}
      <section className="py-14 border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "var(--dark-border)" }}>
        <div className="container-nex">
          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: "var(--dark-border)" }}>
            {[
              {
                title: "Independent Verification",
                body: "Every lot is analyzed by independent laboratories — Janoshik Analytical and Freedom Diagnostics — using RP-HPLC and ESI-MS. No in-house-only numbers.",
              },
              {
                title: "Lot-Specific COA",
                body: "Each shipment carries a lot-specific Certificate of Analysis, traceable to the named testing lab. Documentation travels with the compound, not after it.",
              },
              {
                title: "Cold-Chain Packed",
                body: "Cold-chain packed every shipment. Temperature-controlled packaging protects compound integrity from our facility to your bench.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="p-8"
                style={{ backgroundColor: "var(--dark-card)" }}
              >
                <CheckCircle2 className="w-5 h-5 text-acid-green flex-shrink-0 mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: "Georgia, serif", color: "#FDFCF8" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-secondary">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24" style={{ backgroundColor: "#F5F3F0" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-primary"
              style={{ fontFamily: "var(--font-display)" }}>
              Wholesale Solutions
            </h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Comprehensive B2B services for qualified partners
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index * 0.1}
                className="p-8 border rounded-lg"
                style={{
                  borderColor: "var(--dark-border)",
                  backgroundColor: "var(--dark-card)"
                }}
              >
                <h3 className="text-xl font-bold mb-4 text-primary"
                  style={{ fontFamily: "var(--font-display)" }}>
                  {service.title}
                </h3>
                <p className="text-secondary mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-acid-green flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section id="qualifications" className="py-24" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container-nex">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6 text-primary"
                style={{ fontFamily: "var(--font-display)" }}>
                Partnership Qualifications
              </h2>
              <p className="text-secondary mb-8 leading-relaxed">
                We work exclusively with qualified organizations that meet our
                standards for research ethics and regulatory compliance.
              </p>

              <ul className="space-y-4 mb-8">
                {qualifications.map((qualification, index) => (
                  <motion.li
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={index * 0.1}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-acid-green flex-shrink-0 mt-0.5" />
                    <span className="text-secondary">{qualification}</span>
                  </motion.li>
                ))}
              </ul>

              <a
                href="#inquiry-form"
                className="btn-acid"
              >
                Apply for Partnership
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.2}
              className="p-8 border rounded-lg"
              style={{
                borderColor: "var(--dark-border)",
                backgroundColor: "var(--dark-card)"
              }}
            >
              <h3 className="text-xl font-bold mb-6 text-primary"
                style={{ fontFamily: "var(--font-display)" }}>
                Contact Channels
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-acid-green flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-primary mb-1">Email</div>
                    <a href="mailto:wholesale@nexphoria.com"
                      className="text-sm text-secondary hover:text-acid-green transition-colors">
                      wholesale@nexphoria.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-acid-green flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-primary mb-1">Phone / WhatsApp</div>
                    <a href="mailto:wholesale@nexphoria.com"
                      className="text-sm text-secondary hover:text-acid-green transition-colors">
                      Contact by email for direct line
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-acid-green flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-primary mb-1">Response Time</div>
                    <span className="text-sm text-secondary">
                      Within 24 hours for qualified inquiries
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wholesale Inquiry Form */}
      <section id="inquiry-form" className="py-24" style={{ backgroundColor: "#F5F3F0" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="eyebrow mb-4 block">Wholesale Inquiry</span>
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-primary"
                style={{ fontFamily: "var(--font-display)" }}>
                Start Your Application
              </h2>
              <p className="text-secondary">
                Tell us about your organization and research needs. We respond within 24 hours.
              </p>
            </div>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 border rounded-xl text-center"
                style={{ borderColor: "rgba(163,230,53,0.3)", backgroundColor: "rgba(163,230,53,0.06)" }}
              >
                <CheckCircle2 className="w-12 h-12 text-acid-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2"
                  style={{ fontFamily: "var(--font-display)" }}>
                  Application Received
                </h3>
                <p className="text-secondary mb-6">
                  Thank you, {form.name}. Our wholesale team will review your inquiry and respond within 24 hours.
                </p>
                <Link href="/products" className="btn-acid">
                  Browse Products <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0.1}
                className="p-8 border rounded-xl space-y-6"
                style={{
                  borderColor: "var(--dark-border)",
                  backgroundColor: "var(--dark-card)"
                }}
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Full Name <span className="text-acid-green">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. Jane Smith"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white border text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition"
                      style={{
                        borderColor: "var(--dark-border)",
                        // @ts-ignore
                        "--tw-ring-color": "rgba(163,230,53,0.5)"
                      }}
                    />
                  </div>

                  {/* Institution */}
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Institution / Company <span className="text-acid-green">*</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={form.institution}
                      onChange={handleChange}
                      placeholder="Acme Research Labs"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white border text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition"
                      style={{ borderColor: "var(--dark-border)" }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Email Address <span className="text-acid-green">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@institution.edu"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white border text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "var(--dark-border)" }}
                  />
                </div>

                {/* Monthly Volume */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Estimated Monthly Volume
                  </label>
                  <select
                    name="monthlyVolume"
                    value={form.monthlyVolume}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border text-primary text-sm focus:outline-none focus:ring-2 transition appearance-none cursor-pointer"
                    style={{ borderColor: "var(--dark-border)" }}
                  >
                    <option value="">Select a range...</option>
                    {volumeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Compounds */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Compounds of Interest
                  </label>
                  <input
                    type="text"
                    name="compounds"
                    value={form.compounds}
                    onChange={handleChange}
                    placeholder="e.g. BPC-157, Semaglutide, TB-500, MK-677"
                    className="w-full px-4 py-3 rounded-lg bg-white border text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "var(--dark-border)" }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your research program, required quantities, white-label needs, or any specific questions..."
                    className="w-full px-4 py-3 rounded-lg bg-white border text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition resize-none"
                    style={{ borderColor: "var(--dark-border)" }}
                  />
                </div>

                {/* TCPA Consent */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tcpaConsent}
                    onChange={(e) => {
                      setTcpaConsent(e.target.checked);
                      if (errorMsg) setErrorMsg("");
                    }}
                    required
                    className="mt-0.5 flex-shrink-0 accent-[#B8A44C]"
                    aria-required="true"
                  />
                  <span className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary, #888)" }}>
                    I agree to receive communications from Nexphoria Research, LLC regarding my wholesale inquiry and related updates.
                    Consent is not a condition of any purchase or service. You may withdraw at any time.
                    View our{" "}<a href="/privacy" className="underline hover:opacity-80">Privacy Policy</a>.
                  </span>
                </label>

                {/* Error */}
                {errorMsg && (
                  <p className="text-sm text-red-500">{errorMsg}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting" || !tcpaConsent}
                  className="btn-acid w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Wholesale Inquiry
                    </>
                  )}
                </button>

                <p className="text-xs text-center" style={{ color: "var(--text-tertiary, #999)" }}>
                  We respond within 24 hours to qualified inquiries. No spam, ever.
                </p>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container-nex">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-primary"
              style={{ fontFamily: "var(--font-display)" }}>
              Ready to Partner?
            </h2>
            <p className="text-secondary mb-8 leading-relaxed">
              Join our network of qualified distributors and research partners.
              Fill out the form above or email us directly to discuss your requirements.
            </p>
            <a
              href="mailto:wholesale@nexphoria.com"
              className="btn-acid"
            >
              wholesale@nexphoria.com
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Research Use Only — applies to all wholesale and white-label product */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <RUOBanner variant="card" />
        </div>
      </section>
    </div>
  );
}
