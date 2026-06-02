"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import PprCheckoutShell, { StepDef, StepId } from "@/components/checkout/PprCheckoutShell";
import PprContactStep, { ContactData } from "@/components/checkout/PprContactStep";
import PprShippingStep, {
  ShippingData,
  SHIPPING_METHODS,
} from "@/components/checkout/PprShippingStep";
import PprPaymentStep, { PaymentData } from "@/components/checkout/PprPaymentStep";
import PprOrderSummary, { useOrderTotals } from "@/components/checkout/PprOrderSummary";
import PprTrustBar from "@/components/checkout/PprTrustBar";
import PprExpressPay from "@/components/checkout/PprExpressPay";

const STEPS: StepDef[] = [
  { id: "contact", index: 0, title: "Contact" },
  { id: "shipping", index: 1, title: "Shipping" },
  { id: "payment", index: 2, title: "Payment" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);

  const [active, setActive] = useState<StepId>("contact");
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());
  const [subscribe, setSubscribe] = useState(false);

  const [contact, setContact] = useState<ContactData>({ email: "", createAccount: false });
  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    institution: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    method: "standard",
  });
  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    zip: "",
    crypto: false,
  });

  const shippingCost = useMemo(
    () => SHIPPING_METHODS.find((m) => m.id === shipping.method)?.price ?? 0,
    [shipping.method],
  );
  const shippingLabel = useMemo(
    () => SHIPPING_METHODS.find((m) => m.id === shipping.method)?.label ?? "Standard",
    [shipping.method],
  );

  const totals = useOrderTotals(shippingCost, subscribe);

  function complete(id: StepId, next: StepId | null) {
    setCompleted((prev) => new Set(prev).add(id));
    if (next) setActive(next);
  }

  const stepsWithSummary: StepDef[] = STEPS.map((s) => {
    if (s.id === "contact") return { ...s, summary: contact.email };
    if (s.id === "shipping")
      return {
        ...s,
        summary: shipping.address1
          ? `${shipping.address1}, ${shipping.city} ${shipping.state} · ${shippingLabel}`
          : undefined,
      };
    if (s.id === "payment")
      return {
        ...s,
        summary: payment.crypto
          ? "Crypto settlement"
          : payment.cardNumber
            ? `Card ending ${payment.cardNumber.replace(/\s/g, "").slice(-4)}`
            : undefined,
      };
    return s;
  });

  function placeOrder() {
    setCompleted((prev) => new Set(prev).add("payment"));
    const orderId = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
    router.push(`/checkout/upsell?order=${orderId}`);
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-5 py-20 text-center">
        <h1
          className="text-[28px] font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          Your cart is empty
        </h1>
        <p className="text-[15px]" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
          Add a research compound to begin checkout.
        </p>
        <Link
          href="/products"
          className="rounded-md px-5 py-3 text-[14px] font-semibold"
          style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          Browse catalog
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 lg:py-12">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-[13px] focus:outline-none focus-visible:ring-2"
        style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Continue researching
      </Link>

      <h1
        className="mb-6 text-[28px] font-semibold lg:text-[34px]"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: express pay + accordion */}
        <div className="flex flex-col gap-6">
          <PprExpressPay />

          <PprCheckoutShell
            steps={stepsWithSummary}
            active={active}
            completed={completed}
            onEdit={setActive}
          >
            {(id) => {
              if (id === "contact")
                return (
                  <PprContactStep
                    value={contact}
                    onChange={setContact}
                    onContinue={() => complete("contact", "shipping")}
                  />
                );
              if (id === "shipping")
                return (
                  <PprShippingStep
                    value={shipping}
                    onChange={setShipping}
                    onContinue={() => complete("shipping", "payment")}
                  />
                );
              return (
                <PprPaymentStep
                  value={payment}
                  onChange={setPayment}
                  onSubmit={placeOrder}
                  submitLabel={`Pay $${totals.total.toFixed(2)}`}
                />
              );
            }}
          </PprCheckoutShell>

          <PprTrustBar />
        </div>

        {/* Right: sticky order summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <PprOrderSummary
            shipping={shippingCost}
            subscribe={subscribe}
            onToggleSubscribe={setSubscribe}
            shippingLabel={shippingLabel}
          />
        </aside>
      </div>
    </main>
  );
}
