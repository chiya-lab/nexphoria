import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprPaymentMethods from "@/components/account/PprPaymentMethods";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Payment Methods",
  description: "Manage saved payment methods for your research account. For research use only.",
  robots: { index: false, follow: false },
};

export default function PaymentPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} title="Payment methods" subtitle="Saved cards for requisitions and subscriptions." />
      <PprPaymentMethods />
    </PprAccountShell>
  );
}
