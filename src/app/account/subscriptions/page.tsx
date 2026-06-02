import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprSubscriptionsList from "@/components/account/PprSubscriptionsList";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage recurring research-compound shipments. For research use only.",
  robots: { index: false, follow: false },
};

export default function SubscriptionsPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} title="Subscriptions" subtitle="Skip, pause, or reschedule recurring shipments." />
      <PprSubscriptionsList />
    </PprAccountShell>
  );
}
