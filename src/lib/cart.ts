import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, SubscriptionCadence, SUBSCRIPTION_CADENCE_CONFIG } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDosage?: {
    size: string;
    price: number;
  };
  format: 'vial' | 'pen';
  subscriptionMonths: number; // 0 = one-time, interval days otherwise (legacy compat)
  subscriptionCadence?: SubscriptionCadence; // cadence for subscription items
  monthlyPrice: number; // per-shipment price after discount
  discount: number; // fractional discount applied
}

// Bacteriostatic water add-on offered in the cart drawer. Pre-selected because
// it is required for reconstitution of every lyophilized research compound.
export const BAC_WATER_PRICE = 12;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Bac-water reconstitution upsell — pre-checked by default.
  bacWaterIncluded: boolean;

  // Actions
  addItem: (product: Product, format?: 'vial' | 'pen', selectedDosage?: { size: string; price: number }, subscriptionMonths?: number, discount?: number, subscriptionCadence?: SubscriptionCadence) => void;
  removeItem: (productSlug: string, format: 'vial' | 'pen') => void;
  updateQuantity: (productSlug: string, format: 'vial' | 'pen', quantity: number) => void;
  clearCart: () => void;
  toggleBacWater: () => void;

  // Drawer controls
  openDrawer: () => void;
  closeDrawer: () => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productSlug: string, format: 'vial' | 'pen') => number;
  // Sum of per-line discount savings for subscription items (this shipment).
  getSubscriptionSavings: () => number;
}

// Resolve the effective unit price for a product given format + dosage.
function resolveUnitPrice(
  product: Product,
  format: 'vial' | 'pen',
  selectedDosage?: { size: string; price: number },
): number {
  // Pen format overrides to the pen price when available.
  if (format === 'pen' && product.penAvailable) {
    return product.penPrice;
  }
  // Otherwise prefer the explicitly selected dosage, then the smallest
  // available dosage, then the base product price.
  if (selectedDosage) {
    return selectedDosage.price;
  }
  if (product.dosages && product.dosages.length > 0) {
    return product.dosages[0].price;
  }
  return product.price;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      bacWaterIncluded: true,

      addItem: (product, format = 'vial', selectedDosage, subscriptionMonths = 0, discount = 0, subscriptionCadence) => {
        const existingItemIndex = get().items.findIndex(
          item => item.product.slug === product.slug && item.format === format
        );

        // If no dosage selected but product has dosages, use the smallest one.
        let dosageInfo = selectedDosage;
        if (!dosageInfo && product.dosages && product.dosages.length > 0) {
          dosageInfo = product.dosages[0];
        }

        const basePrice = resolveUnitPrice(product, format, dosageInfo);

        // Apply discount: cadence config takes precedence over explicit discount arg.
        const effectiveDiscount = subscriptionCadence
          ? SUBSCRIPTION_CADENCE_CONFIG[subscriptionCadence].discount
          : discount;
        const monthlyPrice = effectiveDiscount > 0
          ? +(basePrice * (1 - effectiveDiscount)).toFixed(2)
          : basePrice;

        if (existingItemIndex >= 0) {
          set(state => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + 1, subscriptionMonths, subscriptionCadence, monthlyPrice, discount: effectiveDiscount }
                : item
            )
          }));
        } else {
          set(state => ({
            items: [...state.items, {
              product,
              quantity: 1,
              selectedDosage: dosageInfo,
              format,
              subscriptionMonths,
              subscriptionCadence,
              monthlyPrice,
              discount: effectiveDiscount,
            }]
          }));
        }
      },

      removeItem: (productSlug, format) => {
        set(state => ({
          items: state.items.filter(
            item => !(item.product.slug === productSlug && item.format === format)
          )
        }));
      },

      updateQuantity: (productSlug, format, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productSlug, format);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.product.slug === productSlug && item.format === format
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleBacWater: () => {
        set(state => ({ bacWaterIncluded: !state.bacWaterIncluded }));
      },

      openDrawer: () => {
        set({ isOpen: true });
      },

      closeDrawer: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        // Subscriptions bill monthly, so the cart total reflects the amount
        // charged this month: monthlyPrice * quantity per line, summed.
        return get().items.reduce((total, item) => {
          return total + (item.monthlyPrice * item.quantity);
        }, 0);
      },

      getItemCount: (productSlug, format) => {
        const item = get().items.find(
          item => item.product.slug === productSlug && item.format === format
        );
        return item ? item.quantity : 0;
      },

      getSubscriptionSavings: () => {
        return get().items.reduce((total, item) => {
          if (item.discount <= 0) return total;
          // monthlyPrice already has the discount applied; recover the list
          // price to measure savings against, then scale by quantity.
          const listPrice = item.monthlyPrice / (1 - item.discount);
          return total + (listPrice - item.monthlyPrice) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'nexphoria-cart',
      storage: createJSONStorage(() => localStorage),
      // Persist cart contents and the bac-water selection, not drawer state.
      partialize: (state) => ({ items: state.items, bacWaterIncluded: state.bacWaterIncluded }),
    }
  )
);

// Returns the per-unit price for a cart item (one month / one-time).
export function getItemUnitPrice(item: CartItem): number {
  return item.monthlyPrice;
}

// Human-readable cadence label for a cart item.
export function getCadenceLabel(cadence?: SubscriptionCadence): string {
  if (!cadence) return 'One-time';
  return SUBSCRIPTION_CADENCE_CONFIG[cadence].label;
}

// Helper functions for formatting
export function formatPrice(price: number): string {
  return `$${price}`;
}

export function formatCartTotal(total: number): string {
  return `$${total.toFixed(2)}`;
}

// Get savings percentage for larger dosages
export function getSavingsPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
