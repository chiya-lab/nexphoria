# Nexphoria — Visual Brand Brief

**Status:** Companion to `NEXPHORIA_BRAND_SPEC.md` (the canonical source of truth) and `NEXPHORIA_IMAGE_PROMPTS.md` (generation prompts). This brief codifies *application* rules — how the logo, color, type, iconography, photography, and motion are used in practice. When this brief and the brand spec disagree, the brand spec wins.

**Register:** technical, scientific, restrained. Dark molecular-lab DNA. Research Use Only. No emojis, no hype, no consumer-wellness language.

---

## 1. Logo usage

**Brandmark:** the Nexphoria "P" wordmark in custom geometric letterforms, paired with a **hexagonal molecular icon** — a three-bond hexagon with a single highlighted node, echoing the packaging hex.

**Fills:**
- On dark surfaces (`--ink`, `--ink-2`, `--ink-3`): **silver** (`#C8CDD3`) fill. This is the default — Nexphoria is a dark brand.
- On platinum surfaces (`--platinum`): **ink** (`#0A0B0D`) fill. Light backgrounds are rare (invoices, print).
- The highlighted hex node may render in **accent** (`#B8E04F`) — but only if no other accent appears in the same viewport.

**Clear space:** minimum margin equal to the height of the hex icon on all four sides. Nothing — type, rules, image edges — enters this zone.

**Minimum size:** 24px icon height on screen, 8mm in print. Below this, drop the wordmark and use the hex icon alone.

**Never:**
- Recolor the mark outside silver / ink / single accent-node.
- Apply gradients, bevels, drop shadows, or outer glows to the mark.
- Stretch, skew, rotate, or re-letter the wordmark.
- Place the mark on a warm-toned or busy photographic background.
- Use the hexagon decoratively elsewhere — the hex belongs to the molecular system only.

---

## 2. Color application matrix

Acid green is **the** brand color and is rationed: exactly **one accent moment per viewport**. Everything else is silver-on-ink monochrome.

| Surface / element | Token | Notes |
| --- | --- | --- |
| Page background | `--ink` `#0A0B0D` | Default canvas; slight blue cast, never pure `#000`. |
| Cards, elevated panels | `--ink-2` `#111317` | Hairline `--steel` border, 4px radius, no shadow. |
| Hover surface, table stripe | `--ink-3` `#1A1D22` | — |
| Borders, dividers, hairlines | `--steel` `#2A2F36` | 1px only; shadows are forbidden except focus rings. |
| Body text | `--silver` `#C8CDD3` | 1.5 leading. |
| Captions, muted body | `--silver-2` `#8B9099` | — |
| Faint metadata | `--silver-3` `#5A5F66` | SKU codes, timestamps. |
| Headlines, primary text | `--platinum` `#F3F5F7` | Display sizes only. |
| **CTAs, key data, highlight strokes** | `--accent` `#B8E04F` | One per viewport. Primary buttons, the single most important number. |
| CTA hover | `--accent-glow` `#D4F08A` | — |
| CTA active / pressed | `--accent-deep` `#7FA52E` | — |
| In-stock / verified / confirmed | `--success` `#5DD39E` | Status only, not decoration. |
| Low-stock / limited | `--warn` `#F5A742` | Status only. |
| Errors, age-gate denial | `--danger` `#E5484D` | Status only. |

**Section gradient:** `linear-gradient(135deg, #0A0B0D 0%, #111317 60%, #1A1D22 100%)`, with `--accent` at **6% opacity** as a top-right radial glow only. Never a full-saturation accent wash.

**Accent discipline test:** scroll any viewport-height slice; if you can point to two acid-green elements, one is wrong.

---

## 3. Typography pairing

| Role | Font | Weight | Tracking | Leading |
| --- | --- | --- | --- | --- |
| Display / H1 | Space Grotesk (Aeonik Pro placeholder) | 500–600 | -0.02em | 1.15 |
| H2–H3 | Space Grotesk | 500 | -0.02em (≥28px) | 1.15 |
| Body | Inter | 400–500 | normal | 1.5 |
| Data / mono | JetBrains Mono | 400–500 | normal | 1.4 |

**Type scale (16px base):** 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 80.

**Pairing examples:**
- **Hero:** Space Grotesk 80px headline (`--platinum`) + Inter 18px subhead (`--silver-2`). Accent on a single bold span only.
- **PDP spec row:** Inter 14px label (`--silver-2`) + JetBrains Mono 14px value (`--silver`). `MW 1419.53 g/mol`, `CAS 137525-51-0`, `≥99.2%` always set in mono.
- **Card:** Space Grotesk 18px product name + JetBrains Mono 12px SKU metadata + Inter 14px price (accent on the price).
- **Editorial body:** Inter 16–18px in a 1100px column, JetBrains Mono for inline data and DOI references.

**Rule:** all dosages, SKU codes, lot numbers, CAS numbers, purity values, and COA figures are **always mono**. Prose is never mono.

---

## 4. Iconography style

- **Line weight:** uniform 1.5px stroke at 24px icon size; scale stroke proportionally.
- **Geometry:** geometric, constructed on a grid. No hand-drawn or organic curves.
- **Corners:** sharp / mitered joins, not rounded caps. 2px corner radius maximum where a radius is unavoidable.
- **Fill:** line icons by default (silver stroke, no fill). Solid fills only for status chips.
- **Sizing:** 16 / 20 / 24 px on a pixel grid; align strokes to the grid to stay crisp.
- **Forbidden:** medical iconography (red cross, stethoscope, Rx, syringe-as-decoration), emoji, multi-color icons, gradient icons.
- The hexagonal molecular node is the one signature motif — used sparingly as a bullet, a loading state, or a section marker, never as wallpaper.

---

## 5. Photography style guide

**DO:**
- Cold-tone, clinical lighting; single hard key from top-left; deep shadow falloff.
- Sharp focus on glass and silver hot-foil; backlight the foil so the wordmark catches.
- Pure black void backgrounds for product; lab/clinical settings for editorial.
- Scientific instruments — HPLC autosamplers, lyophilizers, micropipettes, vial racks.
- Gloved hands and wrists-down crops when technique must be shown.
- Strict palette: one acid-green accent maximum per frame.

**DON'T:**
- Warm tones, amber/orange cast, golden-hour light.
- Lifestyle, models' faces, smiling people, anyone consuming product.
- Before/after framing of anything.
- Workout, gym, or fitness imagery.
- Medical iconography in-frame (crosses, Rx, syringe entering skin).
- Stock-photo styling, props, busy surfaces, decorative hexagons.

**Realism lever:** every commissioned or generated image names a medium-format/full-frame body, a macro/prime lens, an aperture, and a focus method. Product = focus-stacked f/11; editorial = shallow f/4–f/8.

---

## 6. Motion language

- **Default easing:** `cubic-bezier(0.16, 1, 0.3, 1)` over 320ms — a silky, decelerating exit. Technical, not playful.
- **Hover lift:** 2px translate-Y with an accent glow at 8% opacity. No scale-bounce.
- **Page transitions:** opacity + 8px Y-fade over 240ms.
- **Hex background:** a single low-opacity layer pulsing on an 8s loop. One layer only — never a particle field.
- **Forbidden:** bouncy / elastic / spring-overshoot easings, parallax carnival effects, confetti, marquee scrollers, anything that reads as consumer-app whimsy.
- **Accessibility:** honor `prefers-reduced-motion` always — disable the hex pulse and reduce transitions to a simple opacity fade.

---

## 7. Six example shot lists

**A. Homepage hero set (16:9)**
1. Single vial rising from void, hex lattice 6% behind, right-side type space.
2. Same composition, three-quarter angle for A/B.
3. Tight cap-crimp macro for the scroll-reveal.

**B. PDP gallery (per SKU, 2:3)**
1. Front elevation on void.
2. Three-quarter with foil catching key.
3. Cap-crimp macro.
4. Label macro (wordmark + MW legible, no dosage text).

**C. Science page (3:2)**
1. HPLC chromatogram as silver lines on near-black.
2. Autosampler arm over vial tray, acid-green status LED.
3. Mass-spec readout detail, mono numerals.

**D. Manufacturing page (16:9 + 3:2)**
1. Lyophilizer door, cold reflection, wide.
2. Frosted cold-chain transit case, foreground.
3. Vial rack receding into clean-room depth.

**E. Editorial / reconstitution (3:2)**
1. Gloved hands + micropipette over open vial, wrists-down.
2. Bacteriostatic-water ampoule beside capped vial.
3. Reconstituted solution clarity macro (cool-neutral, never warm).

**F. Social campaign (1:1 / 4:5 / 9:16)**
1. 1:1 centered vial, caption margin.
2. 4:5 vial low-in-frame, headroom for type.
3. 9:16 full-bleed vial from lower third, UI-safe zones top and bottom.

---

## 8. Compliance footnote

Every visual decision in this brief is downstream of the Research-Use-Only mandate. The photography don'ts and the iconography forbidden-list are not stylistic preferences — they are the line between an on-brand research-catalog image and a consumer-health claim. When in doubt, choose the colder, quieter, more clinical option.
