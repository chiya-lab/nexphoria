# Nexphoria — Project Config

## Project
Premium e-commerce storefront for **Nexphoria**, an advanced peptide research brand.
Aesthetic target: precision instrument / dark editorial / molecular lab. Spec-forward,
peer-to-peer with researchers, restraint over hype, no consumer-wellness language.

**This project pivoted from "Nexphoria" (light/nootropic) to "Nexphoria" (dark/peptide-research).**
The canonical source of truth is `NEXPHORIA_BRAND_SPEC.md` and `NEXPHORIA_CONVERSION_PLAYBOOK.md`
at the repo root. Read both before modifying brand, styling, or copy.

## Brand (Nexphoria — canonical, supersedes any prior locked spec)
Palette (dark):
- --ink #0A0B0D, --ink-2 #111317, --steel #2A2F36
- --silver-1 #C8CDD3, --silver-2 #8B9099, --platinum #F3F5F7
- --accent #B8E04F (acid green), --accent-glow #D4F08A
- --danger #E0594F, --warn #E0B14F, --ok #6FE04F

Fonts (via next/font/google):
- Display: Space Grotesk (Aeonik Pro placeholder)
- Body: Inter
- Mono: JetBrains Mono

Component prefix: `Ppr` (e.g. `<PprPriceBlock />`, `<PprStockChip />`).

## Voice — peptide research register
- Cayman Chemical methods section + Sigma-Aldrich catalog + Aesop/Le Labo restraint.
- Speak peer-to-peer with researchers, not consumers.
- Specs forward: MW, sequence, CAS, purity, lot #, COA, citations.
- RUO-compliant. No medical claims. No personal health outcome promises.

### Forbidden vocabulary (NEVER use in copy)
nootropic, cognitive, mental clarity, focus (as a product benefit),
wellness, ritual, supplement, vitamin, biohack, miracle, breakthrough,
"feel better", "boost your", "unlock your".

### Approved vocabulary mapping (old → new)
- Mental clarity → Molecular precision
- Cognitive performance → Advanced peptide research
- Nootropic stack → Research protocol
- Boost focus → Investigate cognition pathways
- Supplement → Research compound
- Daily ritual → Reconstitution protocol
- Wellness → Research integrity

## Conversion mandate
Every page is a conversion machine. See `NEXPHORIA_CONVERSION_PLAYBOOK.md` for the
universal mechanics (sticky CTAs, live-stock chips, subscribe-by-default toggles,
cart-drawer + free-shipping bar, exit intent, post-purchase upsell, etc.) and the
page-by-page tactic list.

KPI targets (12 weeks): 2.0% visitor→purchase, $215 AOV, 35% subscription attach.

## Tech stack
- Next.js 16.2.6 (App Router, static export via `output: 'export'`) + TypeScript
- React 19.2.4
- Tailwind CSS 4 (uses `@theme` directive in `globals.css`, not `tailwind.config.ts`)
- Framer Motion (motion primitives in `src/lib/motion.ts`)
- next/font/google for type

## Build
- `npm run build` must exit 0 with zero errors.
- Static export goes to `out/`.
- Lighthouse target: 95+ on all four scores.

## Git workflow
- Fork: chyosopo/nexphoria (remote `fork`)
- Upstream (read-only): chiya-lab/nexphoria (remote `origin`)
- Identity: Chiya Yosopov <chiya@noribar.com>
- All Nexphoria work on branches prefixed `nexphoria/`.
- Merge via `gh pr merge --merge --admin` against `main` of `chyosopo/nexphoria`.

## Compliance (non-negotiable)
- RUO labeling on every product card and PDP.
- Age + research-use gate modal on first visit.
- No emojis in code or copy.
- Never use the words "scrape" or "crawl" in copy or comments — use "collect",
  "extract", "fetch", "gather".
