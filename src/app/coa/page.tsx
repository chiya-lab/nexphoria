import type { Metadata } from "next";
import CoaLookupClient from "./CoaLookupClient";

export const metadata: Metadata = {
  title: "Lot COA Lookup — Every Lot, Every COA | Nexphoria",
  description:
    "Enter a lot number to retrieve its full Certificate of Analysis: HPLC chromatogram, mass spectrometry, Karl Fischer water content, acetate, microbial, and endotoxin results for every batch we ship.",
  alternates: {
    canonical: "https://nexphoria.com/coa",
  },
  openGraph: {
    title: "Lot COA Lookup — Every Lot, Every COA | Nexphoria",
    description:
      "Enter a lot number. We publish the chromatogram, mass spec, and water content for every batch we ship.",
    url: "https://nexphoria.com/coa",
    siteName: "Nexphoria",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lot COA Lookup — Every Lot, Every COA | Nexphoria",
    description:
      "Enter a lot number. We publish the chromatogram, mass spec, and water content for every batch we ship.",
  },
};

export default function CoaLookupPage() {
  return <CoaLookupClient />;
}
