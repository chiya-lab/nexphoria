import type { Metadata } from "next";
import ResearchClient from "./client";

export const metadata: Metadata = {
  title: "Research Methods — Study Design & Citation | Nexphoria",
  description:
    "Study-design considerations for in vitro and animal-model peptide research, how to interpret a lot-specific COA, and how to cite Nexphoria research materials. For qualified research use only.",
  alternates: {
    canonical: "https://nexphoria.com/research",
  },
  openGraph: {
    title: "Research Methods — Study Design & Citation | Nexphoria",
    description:
      "Study-design considerations for in vitro and animal-model peptide research, and how to cite Nexphoria research materials.",
    url: "https://nexphoria.com/research",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "https://nexphoria.com/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Research Methods" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Methods — Study Design & Citation | Nexphoria",
    description:
      "Study-design considerations for in vitro and animal-model peptide research.",
    images: ["https://nexphoria.com/og-image.jpg"],
  },
};

export default function ResearchPage() {
  return <ResearchClient />;
}
