import type { Metadata } from "next";
import PprAffiliateApplicationForm from "@/components/affiliate/PprAffiliateApplicationForm";

export const metadata: Metadata = {
  title: "Apply — Affiliate Program | Nexphoria",
  description:
    "Apply to the Nexphoria affiliate program in about a minute. Tell us your platforms, content focus, and promotion plan. Research use only.",
  alternates: { canonical: "https://nexphoria.com/affiliates/apply" },
};

export default function AffiliateApplyPage() {
  return <PprAffiliateApplicationForm />;
}
