import type { Metadata } from "next";
import Link from "next/link";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprAccountStats from "@/components/account/PprAccountStats";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Account Dashboard",
  description: "Your Nexphoria research account: orders, subscriptions, certificates, and saved protocols. For research use only.",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  { href: "/account/orders", label: "Orders", desc: "Track and reorder past requisitions" },
  { href: "/account/subscriptions", label: "Subscriptions", desc: "Manage recurring shipments" },
  { href: "/account/coa-vault", label: "CoA Vault", desc: "Download certificates by lot" },
  { href: "/account/saved-stacks", label: "Saved Protocols", desc: "Load or reorder your stacks" },
];

export default function AccountDashboardPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} />
      <PprAccountStats />
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_LINKS.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="rounded-xl border p-5 transition-colors"
            style={{ borderColor: "var(--steel)", backgroundColor: "var(--ink-2)" }}
          >
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}>{q.label}</p>
            <p className="mt-1 text-[13px]" style={{ color: "var(--silver-2)" }}>{q.desc}</p>
          </Link>
        ))}
      </div>
    </PprAccountShell>
  );
}
