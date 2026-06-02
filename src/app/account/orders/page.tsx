import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprOrdersList from "@/components/account/PprOrdersList";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Order History",
  description: "Your Nexphoria order history with per-lot certificates and reorder. For research use only.",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} title="Orders" subtitle="Requisition history, tracking, and per-lot certificates." />
      <PprOrdersList />
    </PprAccountShell>
  );
}
