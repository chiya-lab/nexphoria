import type { Metadata } from "next";
import ReferClient from "./client";

export const metadata: Metadata = {
  title: "Refer a Colleague — Give $20, Get $20 | Nexphoria",
  description:
    "Share Nexphoria with a fellow researcher. They get $20 off their first qualifying order; you earn a $20 credit once it ships. Research use only.",
  alternates: { canonical: "https://nexphoria.com/refer" },
  openGraph: {
    title: "Refer a Colleague — Give $20, Get $20 | Nexphoria",
    description: "Share Nexphoria with a fellow researcher. Give $20, get $20.",
    url: "https://nexphoria.com/refer",
    siteName: "Nexphoria",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Nexphoria Refer a Friend" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refer a Colleague — Give $20, Get $20 | Nexphoria",
    description: "Share Nexphoria with a fellow researcher. Give $20, get $20.",
    images: ["/og-image.jpg"],
  },
};

export default function ReferPage() {
  return <ReferClient />;
}
