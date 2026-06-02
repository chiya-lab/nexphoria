"use client";

import { useMemo, useState } from "react";
import type { Product } from "./products";
import { useCart } from "./cart";
import { openDrawer } from "./cart-store";
import {
  getPackOptions,
  PDP_SUBSCRIPTION_DISCOUNT,
  type PackKey,
  type PackOption,
} from "./pdp-specs";

export interface PdpSelection {
  packs: PackOption[];
  pack: PackOption;
  packKey: PackKey;
  setPackKey: (k: PackKey) => void;
  subscribe: boolean;
  setSubscribe: (v: boolean) => void;
  qty: number;
  setQty: (n: number) => void;
  incQty: () => void;
  decQty: () => void;
  unitPrice: number; // per-pack price after subscription discount
  total: number; // unitPrice * qty
  subSavings: number; // dollars saved per pack by subscribing
  addToCart: () => void;
}

/**
 * Shared selection state for the PDP price block + sticky add bar so both
 * stay in lockstep. Subscription is pre-selected per the conversion playbook.
 */
export function usePdpSelection(product: Product): PdpSelection {
  const packs = useMemo(() => getPackOptions(product), [product]);
  const [packKey, setPackKey] = useState<PackKey>("single");
  const [subscribe, setSubscribe] = useState(true);
  const [qty, setQtyRaw] = useState(1);

  const pack = packs.find((p) => p.key === packKey) ?? packs[0];

  const subSavings = subscribe ? +(pack.price * PDP_SUBSCRIPTION_DISCOUNT).toFixed(2) : 0;
  const unitPrice = +(pack.price - subSavings).toFixed(2);
  const total = +(unitPrice * qty).toFixed(2);

  const setQty = (n: number) => setQtyRaw(Math.max(1, Math.min(99, Math.floor(n) || 1)));

  const addToCart = () => {
    const addItem = useCart.getState().addItem;
    const selectedDosage = { size: `${pack.vials}-vial · ${product.size}`, price: pack.price };
    // monthly cadence drives the persisted monthly discount; one-time = no cadence.
    for (let i = 0; i < qty; i++) {
      addItem(
        product,
        "vial",
        selectedDosage,
        subscribe ? 30 : 0,
        subscribe ? PDP_SUBSCRIPTION_DISCOUNT : 0,
        subscribe ? "monthly" : undefined,
      );
    }
    openDrawer();
  };

  return {
    packs,
    pack,
    packKey,
    setPackKey,
    subscribe,
    setSubscribe,
    qty,
    setQty,
    incQty: () => setQty(qty + 1),
    decQty: () => setQty(qty - 1),
    unitPrice,
    total,
    subSavings,
    addToCart,
  };
}
