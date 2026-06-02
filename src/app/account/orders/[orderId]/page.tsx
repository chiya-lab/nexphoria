import type { Metadata } from "next";
import PprAccountShell from "@/components/account/PprAccountShell";
import PprOrderDetail from "@/components/account/PprOrderDetail";
import { MOCK_ORDERS } from "@/lib/mock-account";

export const metadata: Metadata = {
  title: "Order Detail",
  description: "Order line items, tracking, and certificates. For research use only.",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return MOCK_ORDERS.map((o) => ({ orderId: o.id }));
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <PprAccountShell>
      <PprOrderDetail orderId={orderId} />
    </PprAccountShell>
  );
}
