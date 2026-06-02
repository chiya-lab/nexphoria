# Pepperis — Brand Spec (canonical)

**Status:** New brand replacing Nexphoria. This spec is the source of truth for every page, component, and asset.

**Visual DNA:** Dark, molecular, clinical — premium boutique research lab. Inspired by the user's actual packaging: matte black PET vial label, silver hot-foil logo, hexagonal molecular pattern, soft acid-green accent on the gift box. We are NOT FLVR Digital's old light/ceramic Nexphoria.

---

## Color Tokens (HSL values are CSS-ready; HEX shown for sanity)

| Token              | Hex       | Use                                                 |
| ------------------ | --------- | --------------------------------------------------- |
| `--ink`            | `#0A0B0D` | Background (true near-black, slight blue cast)      |
| `--ink-2`          | `#111317` | Card / elevated surface                             |
| `--ink-3`          | `#1A1D22` | Hover surface, table stripe                         |
| `--steel`          | `#2A2F36` | Borders, dividers, hairlines                        |
| `--silver`         | `#C8CDD3` | Body text on dark                                   |
| `--silver-2`       | `#8B9099` | Muted body / captions                               |
| `--silver-3`       | `#5A5F66` | Faint metadata                                      |
| `--platinum`       | `#F3F5F7` | Headlines on dark, primary text                     |
| `--accent`         | `#B8E04F` | Acid green — CTAs, key data, highlight strokes      |
| `--accent-glow`    | `#D4F08A` | Hover state of accent                               |
| `--accent-deep`    | `#7FA52E` | Active / pressed state                              |
| `--success`        | `#5DD39E` | "In stock", "COA verified", "Order confirmed"       |
| `--warn`           | `#F5A742` | "Low stock", "Limited batch"                        |
| `--danger`         | `#E5484D` | Errors, age-gate denial                             |

**Rule:** Acid green is **the** brand color. Use exactly one accent moment per viewport — never two. Everything else is silver-on-ink monochrome.

**Gradient:** `linear-gradient(135deg, #0A0B0D 0%, #111317 60%, #1A1D22 100%)` for hero/section backgrounds. Add `--accent` at 6% opacity as a top-right radial glow only.

---

## Typography

| Role           | Font                                | Web fallback (Google Fonts) | Notes                          |
| -------------- | ----------------------------------- | --------------------------- | ------------------------------ |
| Display/H1     | **Aeonik Pro** (commercial)         | **Space Grotesk** 500/600   | Geometric grotesque            |
| Headlines/H2-3 | Aeonik Pro Medium                   | Space Grotesk 500           |                                |
| Body           | **Inter** Regular/Medium            | Inter 400/500               | Free, ubiquitous, dense        |
| Mono/data      | **JetBrains Mono** 400/500          | JetBrains Mono 400/500      | Dosages, SKU codes, COA values |

**Type scale (16px base):** 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 80
**Tracking:** -0.02em on all display sizes (>=28px). Body normal.
**Leading:** 1.15 on display, 1.5 on body.

---

## Brandmark

Pepperis "P" wordmark in custom letterforms, paired with a **hexagonal molecular icon** (3-bond hex with a single highlighted node — same DNA as the packaging hex). Silver fill on dark backgrounds, ink fill on platinum backgrounds.

Tagline candidates (pick at PDP time):
- "Advanced peptide research. Pharmaceutical discipline."
- "The molecular frontier, made accessible."
- "Boutique peptide science. Quantified."
- "Where peptide research begins."

---

## Brand Pivot — Nootropics → Peptides (CRITICAL)

The original Nexphoria brand was built around **nootropics for cognitive performance** ("mental clarity", "focus", "productivity"). Pepperis is a **complete category pivot** to **advanced peptide research**.

**Category positioning:** Pepperis is the boutique research-peptide supplier — sitting between mass-market grey-market vendors (Pure Rawz, Amino Asylum) and clinical-grade APIs. We are the premium tier in research peptides, period.

**Audience:** Independent researchers, anti-aging clinicians, longevity-focused biohackers, academic labs needing small-batch material, compounding pharmacists exploring novel peptides.

**What replaces the cognitive language:**

| Old (Nootropic frame)               | New (Peptide research frame)                          |
| ----------------------------------- | ----------------------------------------------------- |
| "Mental clarity"                    | "Molecular precision"                                 |
| "Cognitive performance"             | "Advanced peptide research"                           |
| "Focus and productivity"            | "Reproducible research outcomes"                      |
| "Unleash your potential"            | "Expand what your protocol can investigate"           |
| "Daily ritual"                      | "Research protocol"                                   |
| "Wellness"                          | "Longevity science"                                   |
| "Supplements"                       | "Research compounds" / "Investigational peptides"     |
| "Brain health"                      | "Receptor pharmacology"                               |
| "Performance"                       | "Protocol fidelity"                                   |

**Carry-over from original brand (KEEP):**
- The aspirational tone — "Beyond Boundaries, Beyond Limits" still works for research frontier framing
- "Transform, Transcend, Triumph" stays as a vision-level slogan (frontier science vibe)
- The geometric, confident typography system
- Disciplined, restrained visual language

**Voice & Messaging Rules**

**Tone:** Quiet confidence with scientific literacy. Specific numbers. No hype. No medical claims. The data sells — tell don't sell. We speak peer-to-peer with researchers, not down to consumers.

**DO say:**
- "Third-party HPLC, ≥99% purity by area"
- "BPC-157 acetate, 5mg lyophilized, reconstitute with 2mL bacteriostatic water"
- "Research use only. Not for human consumption."
- "Cold-chain packed. Ships from US facility."
- "GHK-Cu — copper tripeptide-1, MW 340.4, CAS 89030-95-5"
- "Receptor affinity", "pharmacokinetic profile", "in vitro validated"
- "Cited in [N] peer-reviewed studies" (link to DOIs)
- "Lot-traceable from synthesis to shipment"

**DON'T say:**
- "Cure", "treat", "heal", "diagnose" (medical claims — RUO violation)
- "Lose weight", "build muscle", "anti-aging", "sleep better" (consumer health claims)
- "Cognitive performance", "focus", "productivity", "mental clarity" (old nootropic voice — drop entirely)
- "Wellness", "daily ritual", "self-care", "supplement" (consumer wellness vocabulary)
- "Best", "miracle", "revolutionary", "breakthrough" (hype)
- "Free shipping on orders over $X" (sounds discount-y — use "Cold-chain shipping included over $150")
- "For best results take 2x daily" (dosing-for-humans guidance — never)

**Forbidden words:** scrape, crawl, miracle, breakthrough, ultimate, game-changer, supplement, vitamin, nootropic, cognitive, mental clarity, focus, wellness, ritual, biohack (as a verb addressed to the customer).
**Forbidden emoji** anywhere.

## Editorial register

Every page should read like a hybrid of:
1. **A peer-reviewed paper's methods section** (precise, hedged, citation-dense)
2. **A clinical-grade vendor catalog** (Sigma-Aldrich, Cayman Chemical, Tocris — these are our visual + voice references)
3. **A premium boutique's restraint** (Aesop, Le Labo — quiet confidence)

If a sentence could plausibly appear in a Cayman Chemical product description AND in a Le Labo product card, it's on-voice.

---

## Layout System

- 12-column grid, 80px gutters at desktop, 16px at mobile
- Max content width 1280px; full-bleed hero up to 1440px
- Vertical rhythm: 8px base. Sections separated by 96-128px on desktop.
- Border radius: 4px (cards), 2px (buttons, inputs), 0 (data tables, chips)
- Hairline borders only (1px `--steel`), no shadows except focus rings

## Motion

- Default: `cubic-bezier(0.16, 1, 0.3, 1)` over 320ms (silky exit)
- Hover lift: 2px translate-Y, accent glow at 8% opacity
- Page transitions: opacity + 8px Y-fade, 240ms
- Honor `prefers-reduced-motion` always
- Hexagonal grid background pulses at 8s loop (single low-opacity layer)

## Photography Direction

- Vial product shots: pure black void background, single hard light from top-left, no props
- Lifestyle: lab/clinical settings, white coat detail crops, glassware, never people's faces
- All product shots backlit silver foil so the hot-foil logo catches
- No stock photography. No hands holding vials.

## Imagery Don'ts

- No people working out, no fitness imagery
- No "before/after" anything
- No medical iconography (red crosses, stethoscopes, Rx symbols)
- No hexagon used decoratively outside the molecular system
