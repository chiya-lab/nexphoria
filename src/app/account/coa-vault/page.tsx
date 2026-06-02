import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprCoaVault from "@/components/account/PprCoaVault";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "CoA Vault",
  description: "Certificates of analysis for every lot in your order history. For research use only.",
  robots: { index: false, follow: false },
};

export default function CoaVaultPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} title="CoA Vault" subtitle="Certificates of analysis by compound and lot." />
      <PprCoaVault />
    </PprAccountShell>
  );
}
