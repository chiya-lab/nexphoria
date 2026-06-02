import type { OrderStatus } from "@/lib/mock-account";

/** Token color for each order status (used for the status pill dot/text). */
export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  Processing: "var(--warn)",
  Shipped: "var(--accent)",
  Delivered: "var(--ok)",
  Cancelled: "var(--danger)",
};
