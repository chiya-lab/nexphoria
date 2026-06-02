"use client";

import { motion } from "framer-motion";
import { FlaskConical, Building2, Newspaper, Mail, ArrowRight, LucideIcon } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface Route {
  id: string;
  icon: LucideIcon;
  title: string;
  sla: string;
  detail: string;
  email: string;
  formHref: string;
  formLabel: string;
}

const ROUTES: Route[] = [
  {
    id: "support",
    icon: FlaskConical,
    title: "Research Support",
    sla: "Response within 1 business day",
    detail: "Purity data, COA requests, reconstitution and storage guidance, order status.",
    email: "research@nexphoria.com",
    formHref: "#contact-form",
    formLabel: "Open support form",
  },
  {
    id: "wholesale",
    icon: Building2,
    title: "Wholesale & Lab Accounts",
    sla: "Response within 24 hours",
    detail: "Bulk-lot pricing, net terms, custom synthesis, and standing supply agreements.",
    email: "accounts@nexphoria.com",
    formHref: "/wholesale",
    formLabel: "Apply for an account",
  },
  {
    id: "press",
    icon: Newspaper,
    title: "Press & Partnerships",
    sla: "Response within 48 hours",
    detail: "Media inquiries, research collaborations, and co-marketing requests.",
    email: "press@nexphoria.com",
    formHref: "#contact-form",
    formLabel: "Send a message",
  },
];

export default function PprContactGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <motion.div
        variants={staggerContainer(0.07)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {ROUTES.map((route) => {
          const Icon = route.icon;
          return (
            <motion.div
              key={route.id}
              variants={fadeInUp}
              className="flex flex-col gap-3 rounded-xl p-6"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
              >
                <Icon size={20} aria-hidden="true" style={{ color: "var(--accent)" }} />
              </span>
              <h2 className="text-[17px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {route.title}
              </h2>
              <span
                className="text-[11px] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--accent)" }}
              >
                {route.sla}
              </span>
              <p className="flex-1 text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}>
                {route.detail}
              </p>
              <a
                href={`mailto:${route.email}`}
                className="inline-flex items-center gap-2 text-[13px] focus:outline-none focus-visible:ring-2"
                style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
              >
                <Mail size={14} aria-hidden="true" />
                {route.email}
              </a>
              <a
                href={route.formHref}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
                style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
              >
                {route.formLabel}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
