/**
 * Nexphoria chrome cart-store accessor.
 *
 * The canonical cart lives in `@/lib/cart` (Zustand, persisted). Rather than
 * fork cart state into a second store, the chrome reads/controls that same
 * store through this thin alias so there is a single source of truth.
 *
 * Exposes the minimal surface the chrome needs: items, drawer open state,
 * open/close actions, the free-shipping threshold, and a computed subtotal.
 * `isDrawerOpen` is a brand-aligned alias for the underlying `isOpen` flag.
 */
import { useCart } from "./cart";

/** Re-export the canonical store hook under the chrome name. */
export const useCartStore = useCart;

/** Selector hook: items in the cart. */
export const useCartItems = () => useCart((s) => s.items);

/** Selector hook: drawer open state (alias of the store's `isOpen`). */
export const useIsDrawerOpen = () => useCart((s) => s.isOpen);

/** Selector hook: cart subtotal (sum of per-shipment price * quantity). */
export const useCartSubtotal = () =>
  useCart((s) => s.items.reduce((sum, item) => sum + item.monthlyPrice * item.quantity, 0));

/** Selector hook: total item count across all lines. */
export const useCartItemCount = () =>
  useCart((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));

/** Open the cart drawer (delegates to the canonical store). */
export const openDrawer = () => useCart.getState().openDrawer();

/** Close the cart drawer (delegates to the canonical store). */
export const closeDrawer = () => useCart.getState().closeDrawer();

/** Free cold-chain shipping threshold, in USD. */
export const freeShippingThreshold = 150;

/**
 * Selector hook: free-shipping progress as a 0–100 percentage of the
 * cold-chain threshold, clamped so a full bar never overflows.
 */
export const useFreeShippingProgress = () =>
  useCart((s) => {
    const subtotal = s.items.reduce((sum, item) => sum + item.monthlyPrice * item.quantity, 0);
    return Math.min(100, (subtotal / freeShippingThreshold) * 100);
  });

/** Selector hook: total subscription savings on the current shipment, in USD. */
export const useSubscriptionSavings = () =>
  useCart((s) =>
    s.items.reduce((total, item) => {
      if (item.discount <= 0) return total;
      const listPrice = item.monthlyPrice / (1 - item.discount);
      return total + (listPrice - item.monthlyPrice) * item.quantity;
    }, 0),
  );

/** Selector hook: whether the bac-water reconstitution add-on is included. */
export const useBacWaterIncluded = () => useCart((s) => s.bacWaterIncluded);
