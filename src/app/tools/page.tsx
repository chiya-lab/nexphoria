import type { Metadata } from "next";
import ToolsIndexClient from "./ToolsIndexClient";

export const metadata: Metadata = {
  title: "Research Tools | Nexphoria",
  description:
    "Free research tools for peptide scientists: reconstitution calculator, protocol guides, compound index, FAQ, and more. Built for qualified researchers.",
  openGraph: {
    title: "Research Tools — Nexphoria",
    description:
      "Reconstitution calculator, protocol guides, compound index, and more research utilities.",
    url: "https://nexphoria.com/tools",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const toolsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Nexphoria Research Tools",
  url: "https://nexphoria.com/tools",
  description:
    "A directory of research-planning tools for qualified peptide researchers: calculators, protocol planners, reference data, and trackers.",
  isPartOf: {
    "@type": "WebSite",
    name: "Nexphoria",
    url: "https://nexphoria.com",
  },
};

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }}
      />
      <ToolsIndexClient />
    </>
  );
}
