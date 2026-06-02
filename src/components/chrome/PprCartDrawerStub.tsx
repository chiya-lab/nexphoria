"use client";

import { useIsDrawerOpen } from "@/lib/cart-store";

/**
 * Placeholder cart drawer for the chrome milestone.
 *
 * Subscribes to the canonical drawer state so the chrome's cart button has a
 * live target, but renders nothing visible — the full drawer UI is built in a
 * later milestone. The existing `CartDrawer` (mounted via ClientModals) remains
 * the active drawer so the cart keeps working across pages.
 */
export default function PprCartDrawerStub() {
  const isOpen = useIsDrawerOpen();
  void isOpen;
  return null;
}
