import type { Metadata } from "next";
import Link from "next/link";
import PprAuthShell from "@/components/account/PprAuthShell";
import PprSignUpForm from "@/components/account/PprSignUpForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Nexphoria research account. Research use only, 21+, US only.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <PprAuthShell
      eyebrow="Research account"
      title="Create account"
      subtitle="For qualified researchers and laboratories."
      footer={
        <>
          Already registered?{" "}
          <Link href="/sign-in" className="underline" style={{ color: "var(--accent)" }}>
            Sign in
          </Link>
        </>
      }
    >
      <PprSignUpForm />
    </PprAuthShell>
  );
}
