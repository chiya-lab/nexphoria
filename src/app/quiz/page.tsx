import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Find Your Research Protocol | Nexphoria",
  description:
    "Answer four questions about your research domain, study type, and priority endpoint to get matched research compounds. Every recommended lot ships with an HPLC / ESI-MS verified, lot-specific COA. For Research Use Only.",
  openGraph: {
    title: "Find Your Research Protocol | Nexphoria",
    description:
      "Map your research domain and priority endpoint to compounds backed by lot-specific COAs. For Research Use Only.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
