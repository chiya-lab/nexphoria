import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprAddresses from "@/components/account/PprAddresses";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Addresses",
  description: "Manage shipping and billing addresses for your research account. For research use only.",
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} title="Addresses" subtitle="Shipping and billing destinations." />
      <PprAddresses />
    </PprAccountShell>
  );
}
