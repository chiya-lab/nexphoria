import type { Metadata } from "next";
import Link from "next/link";
import PprAuthShell from "@/components/account/PprAuthShell";
import PprSignInForm from "@/components/account/PprSignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Nexphoria research account. For research use only.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <PprAuthShell
      eyebrow="Research account"
      title="Sign in"
      subtitle="Access orders, subscriptions, and certificates."
      footer={
        <>
          New to Nexphoria?{" "}
          <Link href="/sign-up" className="underline" style={{ color: "var(--accent)" }}>
            Create an account
          </Link>
        </>
      }
    >
      <PprSignInForm />
    </PprAuthShell>
  );
}
