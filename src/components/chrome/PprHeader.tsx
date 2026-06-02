"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { easing, staggerContainer, staggerItem } from "@/lib/motion";
import {
  openDrawer,
  useCartItemCount,
  useCartSubtotal,
  freeShippingThreshold,
} from "@/lib/cart-store";

const NAV_LINKS = [
  { label: "Shop", href: "/products", mega: true },
  { label: "Protocols", href: "/protocols" },
  { label: "Science", href: "/science" },
  { label: "COA", href: "/coa" },
  { label: "Journal", href: "/blog" },
];

const MEGA_CATEGORIES = [
  { label: "Recovery", href: "/products?cat=Recovery+%26+Healing" },
  { label: "Metabolic", href: "/products?cat=Weight+Management" },
  { label: "Longevity", href: "/products?cat=Growth+Hormone" },
  { label: "Cognitive", href: "/products?cat=Cognitive" },
  { label: "Signature Stacks", href: "/products/bundles" },
];

const MEGA_TOP_SKUS = [
  { label: "BPC-157", href: "/products/bpc-157" },
  { label: "TB-500", href: "/products/tb-500" },
  { label: "GHK-Cu", href: "/products/ghk-cu" },
  { label: "Semaglutide", href: "/products/semaglutide" },
  { label: "Selank", href: "/products/selank" },
];

const SCROLL_THRESHOLD = 100;
const ACCOUNT_HREF = "/account/orders";

export default function PprHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const itemCount = useCartItemCount();
  const subtotal = useCartSubtotal();
  const toFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Mega-dropdown: open immediately on hover/focus, close after a short delay
  // so a cursor crossing the gap between trigger and panel doesn't dismiss it.
  const openMega = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMegaOpen(true);
  }, []);

  const scheduleCloseMega = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 100);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const headerHeight = scrolled ? 64 : 72;

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(10, 11, 13, 0.92)" : "var(--ink)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
        borderBottom: scrolled ? "1px solid var(--steel)" : "1px solid transparent",
      }}
    >
      <div
        className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-8 transition-all duration-300"
        style={{ height: headerHeight }}
      >
        {/* Left — desktop nav */}
        <nav
          className="hidden flex-1 items-center gap-7 md:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) =>
            link.mega ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
              >
                <Link
                  href={link.href}
                  onFocus={openMega}
                  aria-haspopup="true"
                  aria-expanded={megaOpen}
                  className="relative inline-block py-2 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: isActive(link.href) ? "var(--platinum)" : "var(--silver-1)",
                  }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0"
                      style={{ height: 2, backgroundColor: "var(--accent)" }}
                    />
                  )}
                </Link>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="relative inline-block py-2 text-[14px] font-medium transition-colors hover:text-[color:var(--platinum)] focus:outline-none focus-visible:ring-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: isActive(link.href) ? "var(--platinum)" : "var(--silver-1)",
                }}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute -bottom-0.5 left-0 right-0"
                    style={{ height: 2, backgroundColor: "var(--accent)" }}
                  />
                )}
              </Link>
            )
          )}
        </nav>

        {/* Center — wordmark */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center justify-center md:flex-1"
          aria-label="Nexphoria home"
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "-0.02em",
              color: "var(--platinum)",
            }}
          >
            <span style={{ color: "var(--accent)" }}>N</span>exphoria
          </span>
        </Link>

        {/* Right — icons */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded transition-colors hover:text-[color:var(--platinum)] focus:outline-none focus-visible:ring-2 md:flex"
            style={{ color: "var(--silver-1)" }}
            onClick={() => {
              // Search drawer wiring lands in a later milestone.
              window.dispatchEvent(new CustomEvent("ppr:open-search"));
            }}
          >
            <Search size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>

          <Link
            href={ACCOUNT_HREF}
            aria-label="Account"
            className="hidden h-9 w-9 items-center justify-center rounded transition-colors hover:text-[color:var(--platinum)] focus:outline-none focus-visible:ring-2 md:flex"
            style={{ color: "var(--silver-1)" }}
          >
            <User size={20} strokeWidth={1.75} aria-hidden="true" />
          </Link>

          {/* Cart + free-shipping countdown */}
          <div className="flex flex-col items-end">
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className="relative flex h-9 w-9 items-center justify-center rounded transition-colors hover:text-[color:var(--platinum)] focus:outline-none focus-visible:ring-2"
              style={{ color: "var(--silver-1)" }}
            >
              <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>
            {itemCount > 0 && (
              <span
                className="mt-0.5 hidden whitespace-nowrap md:block"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--silver-2)",
                  lineHeight: 1,
                }}
              >
                {toFreeShipping > 0
                  ? `$${toFreeShipping.toFixed(0)} to free shipping`
                  : "Free shipping unlocked"}
              </span>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="ppr-mobile-nav"
            className="flex h-9 w-9 items-center justify-center rounded transition-colors focus:outline-none focus-visible:ring-2 md:hidden"
            style={{ color: "var(--silver-1)" }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Shop mega-dropdown */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: easing.easeOut }}
            className="absolute left-0 right-0 top-full hidden md:block"
            onMouseEnter={openMega}
            onMouseLeave={scheduleCloseMega}
          >
            <div className="mx-auto max-w-[1440px] px-8">
              <motion.div
                variants={staggerContainer(0.05, 0.04)}
                initial="hidden"
                animate="visible"
                className="grid w-[720px] grid-cols-3 gap-8 rounded-b-lg p-7"
                style={{
                  backgroundColor: "var(--ink-2)",
                  border: "1px solid var(--steel)",
                  borderTop: "none",
                }}
              >
                <motion.div variants={staggerItem()}>
                  <p
                    className="mb-3 text-[11px] uppercase"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.16em",
                      color: "var(--silver-2)",
                    }}
                  >
                    Categories
                  </p>
                  <ul className="space-y-2">
                    {MEGA_CATEGORIES.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setMegaOpen(false)}
                          className="text-[14px] transition-colors hover:text-[color:var(--platinum)]"
                          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={staggerItem()}>
                  <p
                    className="mb-3 text-[11px] uppercase"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.16em",
                      color: "var(--silver-2)",
                    }}
                  >
                    Top SKUs
                  </p>
                  <ul className="space-y-2">
                    {MEGA_TOP_SKUS.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={() => setMegaOpen(false)}
                          className="text-[14px] transition-colors hover:text-[color:var(--platinum)]"
                          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)" }}
                        >
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={staggerItem()}>
                  <Link
                    href="/quiz"
                    onClick={() => setMegaOpen(false)}
                    className="flex h-full flex-col justify-between rounded-md p-5 transition-colors"
                    style={{
                      backgroundColor: "var(--ink-3)",
                      border: "1px solid var(--steel)",
                    }}
                  >
                    <span
                      className="text-[15px] font-medium"
                      style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
                    >
                      Build your stack
                    </span>
                    <span
                      className="mt-2 text-[13px]"
                      style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}
                    >
                      Match compounds to your research goals.
                    </span>
                    <span
                      className="mt-4 text-[13px] font-medium"
                      style={{ color: "var(--accent)" }}
                    >
                      Start the protocol finder &rarr;
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile fullscreen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="ppr-mobile-nav"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.32, ease: easing.easeInOutQuart }}
            className="fixed inset-0 z-[60] flex flex-col md:hidden"
            style={{ backgroundColor: "var(--ink)" }}
            aria-label="Mobile navigation"
          >
            <div
              className="flex items-center justify-between px-8"
              style={{ height: 72, borderBottom: "1px solid var(--steel)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: "-0.02em",
                  color: "var(--platinum)",
                }}
              >
                <span style={{ color: "var(--accent)" }}>N</span>exphoria
              </span>
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded focus:outline-none focus-visible:ring-2"
                style={{ color: "var(--silver-1)" }}
                onClick={() => setMobileOpen(false)}
              >
                <X size={22} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col px-8 py-8" aria-label="Mobile primary navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b py-5 text-[20px] font-medium transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--silver-1)",
                    borderColor: "var(--steel)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={ACCOUNT_HREF}
                onClick={() => setMobileOpen(false)}
                className="border-b py-5 text-[20px] font-medium"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--silver-1)",
                  borderColor: "var(--steel)",
                }}
              >
                Account
              </Link>
            </nav>

            <div className="px-8 pb-10">
              <Link
                href="/quiz"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-md py-4 text-[15px] font-medium transition-colors"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Build your stack &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
