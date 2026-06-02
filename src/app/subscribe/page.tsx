import type { Metadata } from "next";
import SubscribeClient from "./client";

export const metadata: Metadata = {
  title: "Research Updates — Restock Alerts & Lot Drops | Nexphoria",
  description:
    "Join the Nexphoria research list for new compound releases, restock alerts, and lot-drop notifications. Signal-only updates for qualified researchers.",
  alternates: {
    canonical: "https://nexphoria.com/subscribe",
  },
  openGraph: {
    title: "Research Updates — Restock Alerts & Lot Drops | Nexphoria",
    description:
      "New compound releases, restock alerts, and lot-drop notifications for qualified researchers. Independent COA documentation with every order.",
    url: "https://nexphoria.com/subscribe",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Research Updates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Updates — Restock Alerts & Lot Drops | Nexphoria",
    description: "New compound releases, restock alerts, and lot-drop notifications for qualified researchers.",
    images: ["/og-image.jpg"],
  },
};

export default function SubscribePage() {
  return <SubscribeClient />;
}
