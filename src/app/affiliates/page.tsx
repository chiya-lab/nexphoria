import type { Metadata } from "next";
import AffiliatesClient from "./client";

export const metadata: Metadata = {
  title: "Affiliate & Influencer Program | Nexphoria",
  description:
    "Earn 15-30% commission referring research-grade peptides. Four-tier program with tracked links, a full creative library, transparent reporting, and monthly payouts. Research use only.",
  alternates: { canonical: "https://nexphoria.com/affiliates" },
  openGraph: {
    title: "Affiliate & Influencer Program | Nexphoria",
    description:
      "Earn 15-30% commission referring research-grade peptides. Four-tier program with monthly payouts.",
    url: "https://nexphoria.com/affiliates",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Affiliate Program" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Affiliate & Influencer Program | Nexphoria",
    description: "Earn 15-30% commission referring research-grade peptides.",
    images: ["/og-image.jpg"],
  },
};

export default function AffiliatesPage() {
  return <AffiliatesClient />;
}
