"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

const NAV: NavItem[] = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/subscriptions", label: "Subscriptions" },
  { href: "/account/coa-vault", label: "CoA Vault" },
  { href: "/account/saved-stacks", label: "Saved Stacks" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/payment", label: "Payment" },
  { href: "/account/settings", label: "Settings" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/account") return pathname === "/account";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PprAccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLabel = NAV.find((n) => isActive(pathname, n.href))?.label ?? "Account";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:py-14">
      {/* Mobile nav trigger */}
      <div className="mb-5 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold"
          style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)", color: "var(--platinum)" }}
        >
          <span>{activeLabel}</span>
          <span style={{ color: "var(--silver-2)" }}>{mobileOpen ? "Close" : "Menu"}</span>
        </button>
        {mobileOpen && (
          <nav className="mt-2 overflow-hidden rounded-lg border" style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}>
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm transition-colors"
                  style={{
                    color: active ? "var(--accent)" : "var(--silver-1)",
                    backgroundColor: active ? "var(--ink-3)" : "transparent",
                    borderTop: "1px solid var(--steel)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        {/* Desktop sticky left rail */}
        <aside className="hidden lg:block">
          <nav
            className="sticky top-24 overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
          >
            <p
              className="px-4 py-3 text-[11px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--silver-2)", borderBottom: "1px solid var(--steel)" }}
            >
              Research account
            </p>
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color: active ? "var(--accent)" : "var(--silver-1)",
                    backgroundColor: active ? "var(--ink-3)" : "transparent",
                    borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/sign-in"
              className="block px-4 py-2.5 text-sm transition-colors"
              style={{ color: "var(--silver-2)", borderTop: "1px solid var(--steel)" }}
            >
              Sign out
            </Link>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
