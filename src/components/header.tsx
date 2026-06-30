"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { SearchTrigger } from "@/components/SearchModal";

const SHOP_CATEGORIES = [
  {
    group: "Recovery",
    cat: "Recovery & Healing",
    items: [
      { label: "BPC-157", href: "/products/bpc-157", sub: "Tissue repair" },
      { label: "TB-500", href: "/products/tb-500", sub: "Actin binding" },
      { label: "GHK-Cu", href: "/products/ghk-cu", sub: "Copper peptide" },
    ],
  },
  {
    group: "Weight Management",
    cat: "Weight Management",
    items: [
      { label: "Semaglutide", href: "/products/semaglutide", sub: "GLP-1 agonist" },
      { label: "Tirzepatide", href: "/products/tirzepatide", sub: "GLP-1/GIP dual" },
      { label: "Retatrutide", href: "/products/retatrutide", sub: "Triple agonist" },
    ],
  },
  {
    group: "Growth Hormone",
    cat: "Growth Hormone",
    items: [
      { label: "Ipamorelin", href: "/products/ipamorelin", sub: "GH secretagogue" },
      { label: "Sermorelin", href: "/products/sermorelin", sub: "GHRH analog" },
      { label: "MK-677", href: "/products/mk-677", sub: "Oral secretagogue" },
    ],
  },
  {
    group: "Cognitive",
    cat: "Cognitive",
    items: [
      { label: "Selank", href: "/products/selank", sub: "Anxiolytic peptide" },
      { label: "Semax", href: "/products/semax", sub: "Nootropic analog" },
      { label: "NAD+", href: "/products/nad-plus", sub: "Cellular energy" },
    ],
  },
];

const RESEARCH_TOOLS = [
  { label: "Protocol Finder Quiz", href: "/quiz" },
  { label: "Reconstitution Calculator", href: "/tools/reconstitution-calculator" },
  { label: "Half-Life Calculator", href: "/tools/half-life-calculator" },
  { label: "Dosing Frequency Planner", href: "/tools/dosing-frequency-planner" },
  { label: "Cost Per Dose", href: "/tools/cost-per-dose-calculator" },
  { label: "Stack Builder", href: "/tools/stack-builder" },
  { label: "Purity Checker", href: "/tools/purity-checker" },
  { label: "Unit Converter", href: "/tools/unit-converter" },
];

const RESEARCH_RESOURCES = [
  { label: "Compound Index", href: "/compounds" },
  { label: "Research Journal", href: "/blog" },
  { label: "Researcher Reviews", href: "/reviews" },
  { label: "Submit a Review", href: "/reviews/submit" },
  { label: "Storage Guide", href: "/guides/storage" },
  { label: "Reconstitution Guide", href: "/guides/reconstitution" },
  { label: "Dosing Protocols", href: "/guides/dosing-protocols" },
  { label: "Peptide Glossary", href: "/guides/peptide-glossary" },
  { label: "BAC Water Guide", href: "/tools/bac-water-guide" },
];

type DropdownKey = "shop" | "research" | null;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openDrawer, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleDropdown(key: DropdownKey) {
    setActiveDropdown((prev) => (prev === key ? null : key));
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md shadow-sm"
          : "backdrop-blur-sm"
      }`}
      style={{ height: "72px", backgroundColor: scrolled ? "rgba(250,248,245,0.97)" : "rgba(250,248,245,0.72)" }}
    >
      <div
        className="max-w-7xl mx-auto px-6 md:px-10 h-full flex items-center justify-between"
        ref={dropdownRef}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" className="h-8 w-8" aria-label="Nexphoria">
            <g>
              <circle fill="#000" cx="129.698" cy="380.792" r="71.864" />
              <path
                fill="#000"
                d="M519.834,328.405c-17.864-16.774-41.141-22.533-62.628-18.55c-18.724,3.471-38.055-0.118-53.17-11.702l-6.86-5.257c-15.349-11.763-23.999-29.746-25.629-49.016c-1.685-19.927-11.623-39.039-29.014-51.808c-16.815-12.346-37.204-16.273-56.18-12.583c-18.19,3.537-37.03,0.099-51.739-11.173l-7.496-5.744c-15.472-11.857-24.203-29.973-25.892-49.393c-1.792-20.603-12.408-40.363-31.14-53.138c-29.987-20.451-71.799-14.725-95.228,12.998c-26.524,31.385-21.393,78.205,10.727,103.18c17.127,13.317,38.364,17.629,58.085,13.695c18.6-3.71,37.886,0.889,52.94,12.426l6.216,4.764c15.349,11.763,23.999,29.746,25.629,49.016c1.685,19.927,11.623,39.039,29.014,51.809c16.815,12.346,37.204,16.273,56.18,12.583c18.19-3.537,37.03-0.099,51.739,11.173l7.704,5.904c14.677,11.248,24.521,28.127,25.467,46.594c1.094,21.348,11.653,41.983,30.521,55.197c34.727,24.32,83.49,13.65,104.428-24.632C548.956,386.504,543.301,350.44,519.834,328.405z"
              />
              <circle fill="#000" cx="470.305" cy="119.208" r="71.864" />
            </g>
          </svg>
          <span className="text-sm font-semibold tracking-widest uppercase">Nexphoria</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {/* Shop — mega menu trigger */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("shop")}
              aria-haspopup="true"
              aria-expanded={activeDropdown === "shop"}
              className={`flex items-center gap-1 px-2 lg:px-3 py-2 text-[11px] rounded-md transition-colors uppercase ${
                activeDropdown === "shop" ? "text-black" : "text-black/60 hover:text-black"
              }`}
              style={{ letterSpacing: "0.15em", fontWeight: 500 }}
            >
              Shop
              <ChevronDown
                size={13}
                aria-hidden="true"
                className="transition-transform duration-200"
                style={{ transform: activeDropdown === "shop" ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {activeDropdown === "shop" && (
              <div className="mega-menu" style={{ left: "0", transform: "none", minWidth: "620px" }}>
                <div className="grid grid-cols-4 gap-6 mb-4">
                  {SHOP_CATEGORIES.map((group) => (
                    <div key={group.group}>
                      <p className="text-[10px] uppercase tracking-widest font-medium mb-3" style={{ color: "#B8A44C", letterSpacing: "0.2em" }}>
                        {group.group}
                      </p>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-2 py-1.5 rounded-lg hover:bg-[#F0EDE7] transition-colors"
                            >
                              <span className="text-sm font-medium text-black block">{item.label}</span>
                              <span className="text-xs text-[#666666]">{item.sub}</span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={`/products?cat=${encodeURIComponent(group.cat)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-2 py-1 text-xs font-medium hover:underline"
                            style={{ color: "#B8A44C" }}
                          >
                            View all {group.group} &rarr;
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex items-center justify-between gap-4" style={{ borderTop: "1px solid #E5E5E5" }}>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/products"
                      onClick={() => setActiveDropdown(null)}
                      className="text-sm font-medium hover:underline"
                      style={{ color: "#B8A44C" }}
                    >
                      View All Compounds (36)
                    </Link>
                    <Link
                      href="/products/new-arrivals"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-1 text-sm font-medium hover:underline"
                      style={{ color: "#22C55E" }}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                      New Arrivals
                    </Link>
                    <Link
                      href="/products/best-sellers"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-1 text-sm font-medium hover:underline"
                      style={{ color: "#B8A44C" }}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#B8A44C" }} />
                      Best Sellers
                    </Link>
                    <Link
                      href="/products/bundles"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-1 text-sm font-medium hover:underline"
                      style={{ color: "#9B7FD4" }}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#9B7FD4" }} />
                      Bundles
                    </Link>
                  </div>
                  <Link
                    href="/build-your-stack"
                    onClick={() => setActiveDropdown(null)}
                    className="text-sm font-medium text-[#555] hover:text-black"
                  >
                    Build Your Stack &#8594;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Research Tools — dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("research")}
              aria-haspopup="true"
              aria-expanded={activeDropdown === "research"}
              className={`flex items-center gap-1 px-2 lg:px-3 py-2 text-[11px] rounded-md transition-colors uppercase ${
                activeDropdown === "research" ? "text-black" : "text-black/60 hover:text-black"
              }`}
              style={{ letterSpacing: "0.15em", fontWeight: 500 }}
            >
              Research
              <ChevronDown
                size={13}
                aria-hidden="true"
                className="transition-transform duration-200"
                style={{ transform: activeDropdown === "research" ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {activeDropdown === "research" && (
              <div className="mega-menu mega-menu-sm" style={{ left: "0", transform: "none", minWidth: "480px" }}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-medium mb-3" style={{ color: "#B8A44C", letterSpacing: "0.2em" }}>
                      Calculators
                    </p>
                    <ul className="space-y-1">
                      {RESEARCH_TOOLS.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-2 py-1.5 text-sm rounded-lg hover:bg-[#F0EDE7] transition-colors text-black/80 hover:text-black"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-medium mb-3" style={{ color: "#B8A44C", letterSpacing: "0.2em" }}>
                      Resources
                    </p>
                    <ul className="space-y-1">
                      {RESEARCH_RESOURCES.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-2 py-1.5 text-sm rounded-lg hover:bg-[#F0EDE7] transition-colors text-black/80 hover:text-black"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simple links */}
          {[
            { href: "/resources", label: "Resources" },
            { href: "/science", label: "Science" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 lg:px-3 py-2 text-[11px] uppercase text-black/60 hover:text-black rounded-md transition-colors"
              style={{ letterSpacing: "0.15em", fontWeight: 500 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search + Cart + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <SearchTrigger />
          <button
            onClick={openDrawer}
            className="relative p-2 transition-colors group"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5 transition-colors group-hover:text-[#7A6B2A]" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: "#B8A44C" }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={openDrawer}
            className="relative flex items-center justify-center w-11 h-11 group"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5 transition-colors group-hover:text-[#7A6B2A]" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: "#B8A44C" }}
              >
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-11 h-11"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — Full-Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-[55] overflow-y-auto"
            style={{ backgroundColor: "#1A1A18" }}
            aria-label="Mobile navigation"
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" className="h-7 w-7" aria-label="Nexphoria">
                  <g>
                    <circle fill="#B8A44C" cx="129.698" cy="380.792" r="71.864" />
                    <path
                      fill="#B8A44C"
                      d="M519.834,328.405c-17.864-16.774-41.141-22.533-62.628-18.55c-18.724,3.471-38.055-0.118-53.17-11.702l-6.86-5.257c-15.349-11.763-23.999-29.746-25.629-49.016c-1.685-19.927-11.623-39.039-29.014-51.808c-16.815-12.346-37.204-16.273-56.18-12.583c-18.19,3.537-37.03,0.099-51.739-11.173l-7.496-5.744c-15.472-11.857-24.203-29.973-25.892-49.393c-1.792-20.603-12.408-40.363-31.14-53.138c-29.987-20.451-71.799-14.725-95.228,12.998c-26.524,31.385-21.393,78.205,10.727,103.18c17.127,13.317,38.364,17.629,58.085,13.695c18.6-3.71,37.886,0.889,52.94,12.426l6.216,4.764c15.349,11.763,23.999,29.746,25.629,49.016c1.685,19.927,11.623,39.039,29.014,51.809c16.815,12.346,37.204,16.273,56.18,12.583c18.19-3.537,37.03-0.099,51.739,11.173l7.704,5.904c14.677,11.248,24.521,28.127,25.467,46.594c1.094,21.348,11.653,41.983,30.521,55.197c34.727,24.32,83.49,13.65,104.428-24.632C548.956,386.504,543.301,350.44,519.834,328.405z"
                    />
                    <circle fill="#B8A44C" cx="470.305" cy="119.208" r="71.864" />
                  </g>
                </svg>
                <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#B8A44C" }}>Nexphoria</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-11 h-11 transition-colors group"
                aria-label="Close menu"
              >
                <X
                  size={24}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="transition-colors text-white/60 group-hover:text-[#B8A44C]"
                />
              </button>
            </div>

            {/* Nav items with staggered entrance */}
            <motion.nav
              className="flex flex-col px-6 pb-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              }}
            >
              {/* Shop accordion */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              >
                <button
                  className="flex items-center justify-between w-full py-5 text-2xl uppercase font-light tracking-widest transition-colors"
                  style={{ color: mobileSection === "shop" ? "#B8A44C" : "rgba(255,255,255,0.85)", letterSpacing: "0.2em" }}
                  onClick={() => setMobileSection(mobileSection === "shop" ? null : "shop")}
                  aria-expanded={mobileSection === "shop"}
                  aria-controls="mobile-shop-section"
                >
                  Shop
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className="transition-transform"
                    style={{ transform: mobileSection === "shop" ? "rotate(180deg)" : "rotate(0deg)", color: "#B8A44C" }}
                  />
                </button>
                <div style={{ height: "1px", backgroundColor: "rgba(196,162,101,0.2)" }} />
                {mobileSection === "shop" && (
                  <div id="mobile-shop-section" className="py-4 grid grid-cols-2 gap-x-4 gap-y-1">
                    {SHOP_CATEGORIES.flatMap((g) =>
                      g.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="py-2 text-sm transition-colors"
                          style={{ color: "rgba(255,255,255,0.6)" }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                    <Link
                      href="/products"
                      className="col-span-2 py-2 text-sm font-medium mt-2"
                      style={{ color: "#B8A44C" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View All &#8594;
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Research accordion */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              >
                <button
                  className="flex items-center justify-between w-full py-5 text-2xl uppercase font-light tracking-widest transition-colors"
                  style={{ color: mobileSection === "research" ? "#B8A44C" : "rgba(255,255,255,0.85)", letterSpacing: "0.2em" }}
                  onClick={() => setMobileSection(mobileSection === "research" ? null : "research")}
                  aria-expanded={mobileSection === "research"}
                  aria-controls="mobile-research-section"
                >
                  Research
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className="transition-transform"
                    style={{ transform: mobileSection === "research" ? "rotate(180deg)" : "rotate(0deg)", color: "#B8A44C" }}
                  />
                </button>
                <div style={{ height: "1px", backgroundColor: "rgba(196,162,101,0.2)" }} />
                {mobileSection === "research" && (
                  <div id="mobile-research-section" className="py-4 grid grid-cols-2 gap-x-4 gap-y-1">
                    {[...RESEARCH_TOOLS, ...RESEARCH_RESOURCES].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block py-2 text-sm transition-colors"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Simple top-level links */}
              {[
                { href: "/resources", label: "Resources" },
                { href: "/science", label: "Science" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <motion.div
                  key={link.href}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                >
                  <Link
                    href={link.href}
                    className="block py-5 text-2xl uppercase font-light tracking-widest transition-colors hover:text-[#B8A44C]"
                    style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.2em" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                  <div style={{ height: "1px", backgroundColor: "rgba(196,162,101,0.2)" }} />
                </motion.div>
              ))}

              {/* CTA */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                className="mt-8"
              >
                <Link
                  href="/products"
                  className="inline-block w-full text-center py-4 text-sm uppercase tracking-widest font-medium border transition-colors hover:bg-[#B8A44C] hover:border-[#B8A44C] hover:text-[#1A1A18]"
                  style={{ color: "#B8A44C", borderColor: "rgba(196,162,101,0.5)", letterSpacing: "0.2em" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore Collection
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
