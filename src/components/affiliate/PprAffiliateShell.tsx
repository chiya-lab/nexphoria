"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link2, ImageIcon, Wallet, Trophy, Settings, Menu, X } from "lucide-react";
import { AFFILIATE_USER } from "@/lib/mock-affiliate";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { href: "/affiliates/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/affiliates/dashboard/links", label: "Links", icon: Link2 },
  { href: "/affiliates/dashboard/assets", label: "Assets", icon: ImageIcon },
  { href: "/affiliates/dashboard/payouts", label: "Payouts", icon: Wallet },
  { href: "/affiliates/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/affiliates/dashboard/settings", label: "Settings", icon: Settings },
];

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function PprAffiliateShell({ title, subtitle, actions, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/affiliates/dashboard") return pathname === "/affiliates/dashboard";
    return pathname?.startsWith(href);
  }

  return (
    <div style={{ backgroundColor: "var(--ink)", minHeight: "100vh" }}>
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 lg:px-6"
        style={{ backgroundColor: "var(--ink-2)", borderBottom: "1px solid var(--steel)" }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="rounded-md p-1.5 lg:hidden"
            style={{ color: "var(--silver-1)", border: "1px solid var(--steel)" }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link href="/affiliates/dashboard" className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.14em", color: "var(--platinum)" }}>
              Nexphoria
            </span>
            <span
              className="rounded px-1.5 py-0.5 text-[10px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--accent)", border: "1px solid var(--steel)" }}
            >
              Partner portal
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] sm:inline" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-3)" }}>
            {AFFILIATE_USER.tier.name} · {AFFILIATE_USER.tier.commission}%
          </span>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold"
            style={{ backgroundColor: "var(--steel)", color: "var(--silver-1)" }}
            aria-hidden="true"
          >
            R
          </div>
        </div>
      </header>

      <div className="flex">
        <nav
          aria-label="Partner sections"
          className="hidden w-56 shrink-0 lg:block"
          style={{ borderRight: "1px solid var(--steel)", minHeight: "calc(100vh - 53px)" }}
        >
          <ul className="sticky top-[69px] flex flex-col gap-0.5 p-3">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors"
                    style={{
                      color: active ? "var(--platinum)" : "var(--silver-2)",
                      backgroundColor: active ? "var(--ink-3)" : "transparent",
                      borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  >
                    <Icon size={16} style={{ color: active ? "var(--accent)" : "var(--silver-3)" }} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {mobileOpen && (
          <nav aria-label="Partner sections" className="fixed inset-0 z-20 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} />
            <ul
              className="absolute left-0 top-[53px] flex w-60 flex-col gap-0.5 p-3"
              style={{ backgroundColor: "var(--ink-2)", borderRight: "1px solid var(--steel)", height: "calc(100vh - 53px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm"
                      style={{
                        color: active ? "var(--platinum)" : "var(--silver-2)",
                        backgroundColor: active ? "var(--ink-3)" : "transparent",
                      }}
                    >
                      <Icon size={16} style={{ color: active ? "var(--accent)" : "var(--silver-3)" }} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm" style={{ color: "var(--silver-2)" }}>
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
