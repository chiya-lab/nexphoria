# Pepperis — Conversion Playbook

**Mandate:** Every page is a conversion machine. Every section earns its scroll. No page exists without a conversion action.

This document drives every page redesign. Subagents: do not skip a single tactic from your assigned page list.

---

## Universal conversion mechanics (every page)

1. **Sticky add-to-cart bar** on PDP and protocol pages (appears below header on scroll)
2. **Exit-intent modal**: "First-time? -10% on your first stack." Single field email. Hard close. Once-per-session.
3. **Cart drawer slides in** on every add — not a separate page. Shows free-shipping progress bar to $150.
4. **Trust strip** above the footer on every page: cold-chain icon · third-party tested · ships from US · age-verified
5. **Live-stock chip** on every product card and PDP: "In stock — 24 units" / "Low — 6 left" / "Restocking 6/12"
6. **Recently-viewed rail** on every page below the fold (LocalStorage-backed)
7. **Microcopy CTAs**: never "Add to cart" alone — always "Add to cart · $130" (price baked in)
8. **Two-tap subscribe toggle** on every PDP: "One-time" vs "Subscribe & save 12%" — subscribe is pre-selected
9. **Age + research-use gate** modal on first visit (cookie-stored, doesn't re-prompt for 30d)
10. **Reviews aggregate** in header next to product name: "4.8 ★ · 247 verified researchers"

---

## Page-by-page playbook

### Homepage (`/`)

Hero (above the fold):
- H1 (in Space Grotesk 80px): "Research-grade peptides. **Pharmaceutical discipline.**" (accent on bold span)
- Sub (Inter 18px silver-2): one-line value prop with three commas, no fluff
- Primary CTA: "Browse the catalog →" (acid green, 56px tall)
- Secondary CTA: "How we test (60s)" (ghost, opens video drawer)
- Right side: rotating molecular hex with a featured vial (3 SKUs rotate every 5s)
- Below hero: a 4-stat row — "99.2% avg purity · 247 batches tested · 14 SKUs in stock · 24h ship cutoff"

Below hero, in order:
1. **Category quick-shop** (Recovery / Metabolic / Longevity / Cognitive / Signature Stacks) — 5 dark cards with hover-lift
2. **Bestseller rail** — 8 SKU cards, price + 3-pack price + "Add to cart" inline
3. **"Build your stack" CTA band** — full-width dark with single accent button to /quiz
4. **Social proof** — verified review carousel (5 reviews, name-redacted but credential-shown: "M.D., dermatology, Boston" etc.)
5. **The Pepperis Standard** — 4-tile grid: HPLC tested · 99%+ purity · Cold-chain shipped · US-fulfilled
6. **Protocols** — 3 featured 3-month protocols with monthly subscription price
7. **Editorial** — 3 latest research articles teaser
8. **Newsletter capture** — single field, "Cited research, monthly. No promos." (very different from typical brands)

### PDP (`/products/[slug]`) — the conversion engine

Above the fold (split layout):
- Left 60%: product gallery — 4 angles, all on void black, zoomable
- Right 40%: name + 4.8★ · live stock chip · COA download button + price block
- Price block:
  - Single vial: $130
  - 3-vial signature box: $350 (save $40)
  - 6-vial set: $665 (save $115)
  - Toggle: One-time | **Subscribe & save 12% (-$15.60)** [pre-selected]
- Quantity stepper, then full-width acid-green "Add to cart · $114.40" button
- Below CTA: tiny row — "Ships today if ordered in 3h 42m · Cold-chain · 30-day satisfaction"

Below fold (tabs, not accordions — researchers want it all):
1. **Specifications** table: MW, sequence, CAS, purity, lot #, manufactured date, expiration
2. **COA viewer** — embedded PDF with HPLC chromatogram + mass spec
3. **Reconstitution calculator** — interactive: enter vial mg + desired µg/dose, returns mL of bac-water
4. **Citations** — peer-reviewed sources with DOI links
5. **Reviews** — verified-only, with credential tags
6. **Frequently paired with** — protocol cross-sell carousel (e.g. BPC-157 page shows Recovery 90 protocol prominently)
7. **Recently viewed** rail

Sticky bottom bar (mobile + desktop on scroll past CTA): price + sub-toggle + Add-to-cart

### PLP / Catalog (`/products`)

- Left rail: filters (category, goal, price band, in-stock-only, subscription-eligible)
- Right: card grid — 3 per row desktop, 1 mobile
- Each card: vial on void, name, 4.8★, price + "from $X subscribe", live stock chip, hover reveals "Quick add" with 1/3/6 pack toggle
- "Compare" mode at top — select up to 3 to side-by-side
- Sort default = "Bestsellers" (revenue-weighted, not just unit count)
- Pagination = infinite scroll with 24 per batch

### Cart (`/cart` + drawer)

- Slides in from right on every add
- Free-shipping progress bar to $150 ("Add $35 for free cold-chain")
- Each line item: thumbnail, name, single/3-pack toggle, subscription toggle
- **Cross-sell**: "Researchers who bought BPC-157 also added TB-500 · Add for $180 →"
- Bac-water upsell ($12) — bundled as default add-on toggle (pre-checked)
- Coupon field collapsed by default (don't seed discount-shoppers)
- Trust row above checkout button: cold-chain · HPLC tested · 30-day satisfaction

### Checkout (`/checkout`)

- Single-page (not 3-step). Three vertical sections that auto-collapse as filled.
- Express row up top: Shop Pay, Apple Pay, Google Pay, Crypto (USDT/BTC/ETH at 10% off)
- Email field first — auto-creates account if checkbox stays checked
- Shipping address with auto-complete
- Payment with Shopify Payments (when on Shopify Plus)
- Order summary right rail, sticky, shows subscription savings called out
- Post-purchase thank-you page: order summary + one-click upsell ("Add bac-water for $9, ships in same box →")

### Brand pages (`/about`, `/science`, `/manufacturing`)

Same dark editorial layout, every page ends with:
- Inline "Start with a single vial" CTA card linking to bestseller PDP
- Newsletter capture

`/science`: HPLC chromatogram graphic. Sequence diagrams. Cite primary literature.
`/manufacturing`: cold chain diagram (factory → 3PL → customer). Lot tracking explanation. Photos of clean room (placeholder).
`/about`: short founder note, mission ("research first, hype last"), team-of-one acknowledgment.

### Service pages

- `/faq`: searchable, accordion grouped (Ordering, Shipping, Research Use, Subscriptions, COAs)
- `/shipping`: cold-chain explanation, free over $150, US-only by default (note Canada/UK Q4)
- `/returns`: 30-day satisfaction guarantee, unopened only
- `/contact`: form + research@pepperis.com + 24h response SLA
- `/wholesale`: tier card (lab/clinic/distributor), application form

### Interactive routes

- `/quiz` (5 questions, gives a recommended protocol + 3 SKUs at the end)
- `/build-your-stack` (drag SKUs into a tray, live total updates with subscription discount toggle)
- `/protocols` (5 protocols, each with monthly subscription price and "Start" CTA)
- `/compare` (3-SKU side-by-side)
- `/coa` (lot-lookup tool — enter lot number → COA PDF)
- `/tools`: reconstitution calc · dose converter · half-life timeline · bac-water calculator (each is its own /tools/* route)

### Blog

- Index = research-journal aesthetic, dark cards with category chip, est. read time, DOI count
- Article template: 1100px text column, sticky TOC on right, citations footnoted, "Related products" rail at bottom (the key conversion hook), social share row

### Legal / account / admin
- Minimal styling, dark theme parity, but no conversion elements
- /account: order history, subscription management (skip/pause/swap), saved COAs, address book

---

## Conversion KPI targets (12-week window)

| Funnel stage              | Baseline | Target |
| ------------------------- | -------- | ------ |
| Visit → PDP               | —        | 35%    |
| PDP → Add to cart         | —        | 12%    |
| Add to cart → Checkout    | —        | 65%    |
| Checkout → Purchase       | —        | 75%    |
| **Visitor → Purchase**    | —        | **2.0%** |
| AOV                       | —        | $215   |
| Subscription attach rate  | —        | 35%    |
| Free shipping threshold attainment | — | 60% (drives $150+ AOV) |

## Implementation order (subagent priority)

1. Design tokens + chrome (everything else inherits)
2. PDP (single biggest revenue driver — get it perfect)
3. PLP + cart/checkout (next biggest)
4. Homepage (depends on PDP card design)
5. Brand + service pages
6. Quiz/stack/protocols/compare/coa/tools/blog (interactive paths)
7. Legal/account + perf audit

## Component naming convention

All new components prefixed `Ppr` (e.g. `<PprPriceBlock />`, `<PprStockChip />`, `<PprStickyCta />`). Keeps brand boundary clear from any leftover Nexphoria components during the transition.
