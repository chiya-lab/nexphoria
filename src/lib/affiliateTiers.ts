/**
 * Affiliate / influencer program tier definitions (demo data — no auth, no
 * network). Commission rates, cookie windows, and qualification thresholds for
 * the four-tier partner program. Earnings figures elsewhere are illustrative.
 * Research use only.
 */

export interface AffiliateTier {
  id: string;
  name: string;
  /** Headline commission rate, percent. */
  commission: number;
  /** Minimum balance before a payout is released, USD. */
  minPayout: number;
  /** Attribution cookie window in days. */
  cookieDays: number;
  /** Plain-language qualification requirement. */
  qualifies: string;
  featured?: boolean;
  perks: string[];
}

export const AFFILIATE_TIERS: AffiliateTier[] = [
  {
    id: "researcher",
    name: "Researcher",
    commission: 15,
    minPayout: 50,
    cookieDays: 30,
    qualifies: "Default tier on approval",
    perks: [
      "15% commission on referred research compounds",
      "30-day attribution cookie",
      "Tracked links and standard creative assets",
      "Monthly payouts at $50 minimum",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    commission: 20,
    minPayout: 50,
    cookieDays: 60,
    qualifies: "5+ referred sales / month",
    featured: true,
    perks: [
      "20% commission across the catalog",
      "60-day attribution cookie",
      "Custom discount code for your audience",
      "Full creative library and social copy",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    commission: 25,
    minPayout: 50,
    cookieDays: 90,
    qualifies: "20+ referred sales / month",
    perks: [
      "25% commission across the catalog",
      "90-day attribution cookie",
      "Dedicated partner representative",
      "Early access to new compound launches",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    commission: 30,
    minPayout: 0,
    cookieDays: 120,
    qualifies: "50+ sales / month + 50k followers",
    perks: [
      "30% commission across the catalog",
      "120-day attribution cookie",
      "No minimum payout — withdraw any balance",
      "Custom co-branded landing pages",
    ],
  },
];

export function tierById(id: string): AffiliateTier | undefined {
  return AFFILIATE_TIERS.find((t) => t.id === id);
}
