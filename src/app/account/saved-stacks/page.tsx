import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprAccountHero from "@/components/account/PprAccountHero";
import PprSavedStacks from "@/components/account/PprSavedStacks";
import { MOCK_USER } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Saved Protocols",
  description: "Protocols saved from the stack builder. Load or reorder in one click. For research use only.",
  robots: { index: false, follow: false },
};

export default function SavedStacksPage() {
  return (
    <PprAccountShell>
      <PprAccountHero user={MOCK_USER} title="Saved protocols" subtitle="Load into the stack builder or reorder the full set." />
      <PprSavedStacks />
    </PprAccountShell>
  );
}
