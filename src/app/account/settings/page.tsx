import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprAccountSettings from "@/components/account/PprAccountSettings";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Profile, researcher verification, research-use acknowledgement, and security. For research use only.",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} title="Settings" subtitle="Profile, verification, and security." />
      <PprAccountSettings />
    </PprAccountShell>
  );
}
