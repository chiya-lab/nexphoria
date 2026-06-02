"use client";

import PprContactHero from "@/components/contact/PprContactHero";
import PprContactGrid from "@/components/contact/PprContactGrid";
import PprSupportHours from "@/components/contact/PprSupportHours";
import PprResponseSla from "@/components/contact/PprResponseSla";
import PprContactForm from "@/components/contact/PprContactForm";
import PprContactCta from "@/components/contact/PprContactCta";

export default function ContactClient() {
  return (
    <>
      <PprContactHero />
      <PprContactGrid />
      <PprSupportHours />
      <PprResponseSla />
      <PprContactForm />
      <PprContactCta />
    </>
  );
}
