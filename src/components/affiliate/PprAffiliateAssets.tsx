"use client";

import { motion } from "framer-motion";
import { Link2, Image as ImageIcon, Camera, Mail, MessageSquare } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const ASSETS = [
  { icon: Link2, title: "Tracked links", body: "Per-product referral links with UTM editor and inline QR codes." },
  { icon: ImageIcon, title: "Banners", body: "Three IAB sizes — 728x90, 300x250, 160x600 — as scalable SVG." },
  { icon: Camera, title: "Product photos", body: "Void-black vial shots and lab crops, sized for web and social." },
  { icon: Mail, title: "Email templates", body: "On-voice copy blocks for newsletters and research digests." },
  { icon: MessageSquare, title: "Social copy", body: "Compliant captions for X, Instagram, and short-form video." },
];

export default function PprAffiliateAssets() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 lg:py-20">
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-8">
        <span className="text-[12px] uppercase" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)" }}>
          Creative library
        </span>
        <h2 className="mt-2 text-[28px] font-semibold lg:text-[36px]" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)", letterSpacing: "-0.02em" }}>
          Everything you need to promote on-brand
        </h2>
        <p className="mt-2 max-w-2xl text-[15px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
          The full library unlocks on approval. Assets carry the FTC disclosure and stay within research-content guidelines.
        </p>
      </motion.div>
      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ASSETS.map((a) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.title}
              variants={fadeInUp}
              className="flex flex-col gap-3 rounded-2xl p-6"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md" style={{ border: "1px solid var(--steel)", color: "var(--accent)" }}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <h3 className="text-[16px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {a.title}
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                {a.body}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
