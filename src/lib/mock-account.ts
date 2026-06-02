import type { StackItem } from "@/lib/stack-store";

/**
 * Mock account data for the research-account portal. Entirely client-side /
 * static — there is no backend. Values are illustrative fixtures used to render
 * the dashboard, orders, subscriptions, CoA vault, saved stacks, and settings.
 */

export type ResearcherType = "academic" | "industry" | "clinical lab";
export type AccountTier = "researcher" | "wholesale";
export type VerificationStatus = "verified" | "pending" | "unverified";

export interface AccountUser {
  name: string;
  email: string;
  organization: string;
  researcherType: ResearcherType;
  tier: AccountTier;
  verification: VerificationStatus;
  ruoAcknowledgedAt: string; // ISO date
  memberSince: string; // ISO date
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  productSlug: string;
  name: string;
  packQty: number;
  unitPrice: number;
  lot: string;
  coaId?: string;
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  organization?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShip: boolean;
  isDefaultBill: boolean;
}

export interface Order {
  id: string;
  date: string; // ISO date
  status: OrderStatus;
  items: OrderItem[];
  shipping: number;
  carrier?: string;
  tracking?: string;
  shipToId: string;
}

export type SubscriptionStatus = "active" | "paused";
export type Cadence = "30 days" | "60 days" | "90 days";

export interface Subscription {
  id: string;
  productSlug: string;
  name: string;
  packQty: number;
  unitPrice: number;
  cadence: Cadence;
  nextShip: string; // ISO date
  status: SubscriptionStatus;
  shipToId: string;
}

export interface CoaDocument {
  id: string;
  productSlug: string;
  peptide: string;
  lot: string;
  issuedDate: string; // ISO date
  method: string;
  purity: string;
  fileLabel: string;
}

export interface SavedStack {
  id: string;
  name: string;
  savedDate: string; // ISO date
  items: StackItem[];
}

export interface PaymentMethod {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export const MOCK_USER: AccountUser = {
  name: "Dr. Alex Rhodes",
  email: "a.rhodes@meridian-bio.org",
  organization: "Meridian Biosciences Lab",
  researcherType: "industry",
  tier: "researcher",
  verification: "verified",
  ruoAcknowledgedAt: "2025-11-02",
  memberSince: "2024-08-14",
};

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-lab",
    label: "Lab — Receiving",
    recipient: "Dr. Alex Rhodes",
    organization: "Meridian Biosciences Lab",
    line1: "1400 Research Park Dr",
    line2: "Loading Dock B",
    city: "Cambridge",
    state: "MA",
    postalCode: "02139",
    country: "United States",
    isDefaultShip: true,
    isDefaultBill: false,
  },
  {
    id: "addr-office",
    label: "Office",
    recipient: "Dr. Alex Rhodes",
    organization: "Meridian Biosciences Lab",
    line1: "88 Kendall Sq",
    line2: "Suite 502",
    city: "Cambridge",
    state: "MA",
    postalCode: "02142",
    country: "United States",
    isDefaultShip: false,
    isDefaultBill: true,
  },
  {
    id: "addr-satellite",
    label: "Satellite Facility",
    recipient: "Receiving Dept",
    organization: "Meridian Biosciences Lab",
    line1: "210 Industrial Pkwy",
    city: "Woburn",
    state: "MA",
    postalCode: "01801",
    country: "United States",
    isDefaultShip: false,
    isDefaultBill: false,
  },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm-visa", brand: "Visa", last4: "4242", expMonth: 6, expYear: 2028, isDefault: true },
  { id: "pm-mc", brand: "Mastercard", last4: "5588", expMonth: 11, expYear: 2027, isDefault: false },
];

export const MOCK_COAS: CoaDocument[] = [
  {
    id: "coa-bpc-2411",
    productSlug: "bpc-157",
    peptide: "BPC-157",
    lot: "BPC-2411-A",
    issuedDate: "2025-11-18",
    method: "RP-HPLC / ESI-MS",
    purity: "99.2%",
    fileLabel: "COA_BPC-157_LOT-2411-A.pdf",
  },
  {
    id: "coa-tb-2410",
    productSlug: "tb-500",
    peptide: "TB-500",
    lot: "TB5-2410-C",
    issuedDate: "2025-10-29",
    method: "RP-HPLC / ESI-MS",
    purity: "98.7%",
    fileLabel: "COA_TB-500_LOT-2410-C.pdf",
  },
  {
    id: "coa-ghk-2409",
    productSlug: "ghk-cu",
    peptide: "GHK-Cu",
    lot: "GHK-2409-B",
    issuedDate: "2025-09-30",
    method: "RP-HPLC / AAS (Cu)",
    purity: "99.0%",
    fileLabel: "COA_GHK-Cu_LOT-2409-B.pdf",
  },
  {
    id: "coa-sema-2408",
    productSlug: "semaglutide",
    peptide: "Semaglutide",
    lot: "SEM-2408-A",
    issuedDate: "2025-08-22",
    method: "RP-HPLC / ESI-MS",
    purity: "99.4%",
    fileLabel: "COA_Semaglutide_LOT-2408-A.pdf",
  },
  {
    id: "coa-ipa-2407",
    productSlug: "ipamorelin",
    peptide: "Ipamorelin",
    lot: "IPA-2407-D",
    issuedDate: "2025-07-15",
    method: "RP-HPLC / ESI-MS",
    purity: "98.9%",
    fileLabel: "COA_Ipamorelin_LOT-2407-D.pdf",
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "NX-10428",
    date: "2025-11-19",
    status: "Delivered",
    shipping: 0,
    carrier: "FedEx",
    tracking: "7712 0044 9381",
    shipToId: "addr-lab",
    items: [
      { productSlug: "bpc-157", name: "BPC-157", packQty: 3, unitPrice: 64, lot: "BPC-2411-A", coaId: "coa-bpc-2411" },
      { productSlug: "tb-500", name: "TB-500", packQty: 1, unitPrice: 78, lot: "TB5-2410-C", coaId: "coa-tb-2410" },
    ],
  },
  {
    id: "NX-10391",
    date: "2025-10-30",
    status: "Delivered",
    shipping: 0,
    carrier: "FedEx",
    tracking: "7712 0039 1188",
    shipToId: "addr-lab",
    items: [
      { productSlug: "ghk-cu", name: "GHK-Cu", packQty: 3, unitPrice: 52, lot: "GHK-2409-B", coaId: "coa-ghk-2409" },
    ],
  },
  {
    id: "NX-10362",
    date: "2025-10-09",
    status: "Delivered",
    shipping: 14,
    carrier: "UPS",
    tracking: "1Z 882 4471",
    shipToId: "addr-satellite",
    items: [
      { productSlug: "semaglutide", name: "Semaglutide", packQty: 1, unitPrice: 149, lot: "SEM-2408-A", coaId: "coa-sema-2408" },
      { productSlug: "ipamorelin", name: "Ipamorelin", packQty: 6, unitPrice: 44, lot: "IPA-2407-D", coaId: "coa-ipa-2407" },
    ],
  },
  {
    id: "NX-10310",
    date: "2025-09-18",
    status: "Delivered",
    shipping: 0,
    carrier: "FedEx",
    tracking: "7712 0031 0042",
    shipToId: "addr-lab",
    items: [
      { productSlug: "cjc-1295", name: "CJC-1295", packQty: 3, unitPrice: 58, lot: "CJC-2406-A" },
    ],
  },
  {
    id: "NX-10287",
    date: "2025-08-27",
    status: "Delivered",
    shipping: 0,
    carrier: "UPS",
    tracking: "1Z 882 1190",
    shipToId: "addr-lab",
    items: [
      { productSlug: "epitalon", name: "Epitalon", packQty: 1, unitPrice: 69, lot: "EPI-2405-B" },
      { productSlug: "thymosin-alpha-1", name: "Thymosin Alpha-1", packQty: 1, unitPrice: 92, lot: "TA1-2405-A" },
    ],
  },
  {
    id: "NX-10455",
    date: "2025-11-28",
    status: "Shipped",
    shipping: 0,
    carrier: "FedEx",
    tracking: "7712 0045 5210",
    shipToId: "addr-lab",
    items: [
      { productSlug: "selank", name: "Selank", packQty: 3, unitPrice: 47, lot: "SEL-2411-C" },
    ],
  },
  {
    id: "NX-10470",
    date: "2025-12-02",
    status: "Processing",
    shipping: 0,
    shipToId: "addr-office",
    items: [
      { productSlug: "mots-c", name: "MOTS-c", packQty: 1, unitPrice: 86, lot: "MTC-2412-A" },
      { productSlug: "nad-plus", name: "NAD+", packQty: 3, unitPrice: 61, lot: "NAD-2412-B" },
    ],
  },
  {
    id: "NX-10221",
    date: "2025-07-12",
    status: "Cancelled",
    shipping: 0,
    shipToId: "addr-lab",
    items: [
      { productSlug: "tesamorelin", name: "Tesamorelin", packQty: 1, unitPrice: 118, lot: "TES-2404-A" },
    ],
  },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-bpc",
    productSlug: "bpc-157",
    name: "BPC-157",
    packQty: 3,
    unitPrice: 61,
    cadence: "60 days",
    nextShip: "2026-01-18",
    status: "active",
    shipToId: "addr-lab",
  },
  {
    id: "sub-ghk",
    productSlug: "ghk-cu",
    name: "GHK-Cu",
    packQty: 1,
    unitPrice: 49,
    cadence: "30 days",
    nextShip: "2025-12-30",
    status: "active",
    shipToId: "addr-lab",
  },
];

export const MOCK_SAVED_STACKS: SavedStack[] = [
  {
    id: "stack-recovery",
    name: "Soft-tissue recovery",
    savedDate: "2025-11-10",
    items: [
      { slug: "bpc-157", packQty: 3, dosePerDay: 250, slot: "PWO" },
      { slug: "tb-500", packQty: 1, dosePerDay: 500, slot: "AM" },
    ],
  },
  {
    id: "stack-metabolic",
    name: "Metabolic recomposition",
    savedDate: "2025-10-21",
    items: [
      { slug: "semaglutide", packQty: 1, dosePerDay: 35, slot: "AM" },
      { slug: "mots-c", packQty: 1, dosePerDay: 500, slot: "AM" },
    ],
  },
  {
    id: "stack-longevity",
    name: "Longevity axis",
    savedDate: "2025-09-05",
    items: [
      { slug: "epitalon", packQty: 1, dosePerDay: 5000, slot: "PM" },
      { slug: "ghk-cu", packQty: 1, dosePerDay: 1000, slot: "PM" },
      { slug: "nad-plus", packQty: 3, dosePerDay: 50, slot: "AM" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

export function orderTotal(order: Order): number {
  const items = order.items.reduce((sum, i) => sum + i.unitPrice * i.packQty, 0);
  return items + order.shipping;
}

export function orderItemCount(order: Order): number {
  return order.items.reduce((sum, i) => sum + i.packQty, 0);
}

export function subscriptionTotal(sub: Subscription): number {
  return sub.unitPrice * sub.packQty;
}

export function getOrder(orderId: string): Order | undefined {
  return MOCK_ORDERS.find((o) => o.id === orderId);
}

export function getAddress(id: string): Address | undefined {
  return MOCK_ADDRESSES.find((a) => a.id === id);
}

export function getCoa(id: string | undefined): CoaDocument | undefined {
  if (!id) return undefined;
  return MOCK_COAS.find((c) => c.id === id);
}

export interface AccountStats {
  lifetimeOrders: number;
  totalSpend: number;
  activeSubscriptions: number;
  coaDownloads: number;
}

export function accountStats(): AccountStats {
  const billable = MOCK_ORDERS.filter((o) => o.status !== "Cancelled");
  return {
    lifetimeOrders: billable.length,
    totalSpend: billable.reduce((sum, o) => sum + orderTotal(o), 0),
    activeSubscriptions: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "active").length,
    coaDownloads: MOCK_COAS.length,
  };
}

export const RESEARCHER_TYPE_LABEL: Record<ResearcherType, string> = {
  academic: "Academic / University",
  industry: "Industry R&D",
  "clinical lab": "Clinical Laboratory",
};
