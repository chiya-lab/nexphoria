# Nexphoria — Image Prompt Library

**Status:** Canonical prompt reference for every generated or commissioned image across the storefront. Pairs with `NEXPHORIA_VISUAL_BRAND_BRIEF.md` (style rules) and the in-app viewer at `/admin/image-briefs` (queryable, click-to-copy). The typed registry in `src/lib/image-placeholders.ts` is the machine-readable mirror of this document — keep the two in sync.

**Register:** technical, scientific photography vocabulary. Cold-tone, clinical, restrained. Research Use Only — no consumption, no medical iconography, no lifestyle. No emojis.

---

## Global rules (apply to every prompt)

**Color palette (strict):**

| Token | Hex | Role in frame |
| --- | --- | --- |
| Ink | `#0A0B0D` | Background — true near-black with a faint blue cast |
| Ink-2 / Ink-3 | `#111317` / `#1A1D22` | Gradient mid-tones, elevated surfaces |
| Steel | `#2A2F36` | Hairline edges, instrument bodies |
| Silver | `#C8CDD3` | Glass, foil detail, primary subject highlight |
| Silver-2 | `#8B9099` | Muted secondary detail |
| Platinum | `#F3F5F7` | Brightest specular highlight only |
| Accent | `#B8E04F` | Acid-green — exactly **one** accent moment per frame |
| Accent-glow | `#D4F08A` | Hover/secondary accent (digital only) |

**Lighting clause (paste into every prompt):** cold-tone clinical lighting, single hard key light from top-left, deep falloff into shadow, no warm color cast, controlled specular highlights on glass and foil.

**Mood:** premium boutique research lab — spec-forward, disciplined, quiet confidence. Sigma-Aldrich / Cayman Chemical catalog meets Aesop / Le Labo restraint.

**Camera realism:** every prompt names a medium-format or full-frame body, a macro or prime lens, an aperture, and a focus method (focus-stacking for product, shallow for editorial). This pushes the model away from the plastic-toy look.

**Negative prompt (base — append to all):**
> warm tones, orange/amber cast, golden hour, lifestyle, people consuming product, hands holding vial to mouth, before/after, fitness imagery, gym, syringe in skin, medical cross, stethoscope, Rx symbol, pills, capsules, text artifacts, watermark, logo distortion, low resolution, blurry, oversaturated, HDR halo, decorative hexagons, faces, smiling models, stock-photo look, plastic toy appearance

---

## 1. Hero prompts

### Homepage hero — 16:9
- **Target output:** full-bleed hero, headline type sits in the right negative space.
- **Mood:** the molecular-lab register established instantly.
- **Prompt:** Wide cinematic shot of a single matte-black research vial rising from a dark void, a faint hexagonal molecular lattice etched in the background at 6% opacity. Cold-tone clinical lighting, single hard key light from top-left. Strict near-black palette with one acid-green accent. Generous negative space on the right for headline type.
- **Camera:** Phase One IQ4, 80mm, f/8, focus-stacked, studio strobe.
- **Negative:** base.

### About hero — 16:9
- **Target output:** founder-note backdrop, understated.
- **Prompt:** Minimal still life of an empty clean-room bench, brushed-steel surface, a closed logbook and a capped vial in soft focus at the edge of frame. Cold-tone clinical lighting. Contemplative, restrained.
- **Camera:** Hasselblad H6D, 100mm, f/5.6, shallow depth, tripod.

### Science hero — 16:9
- **Target output:** signals HPLC-grade analytical rigor.
- **Prompt:** Macro detail of an HPLC chromatogram trace rendered as fine silver lines on a near-black screen, a glass sample vial in a chromatography autosampler tray softly out of focus behind. Cold-tone clinical lighting. Analytical and precise.
- **Camera:** Canon R5, RF 100mm Macro, f/11, focus-stacked.

### Manufacturing hero — 16:9
- **Target output:** cold-chain, lot-traceable, US-fulfilled credibility.
- **Prompt:** Wide shot of a stainless lyophilizer door reflecting cold light, frost on a cold-chain transit case in the foreground, racks of capped vials behind. Cold-tone clinical lighting. Industrial-clinical, no operators visible.
- **Camera:** Sony A7R V, 35mm, f/9, deep depth of field.

### Protocols hero — 16:9
- **Target output:** a protocol shown as a precise multi-vial regimen.
- **Prompt:** Three matte-black vials in a precise row at staggered depth, faint calibration-grid backdrop. Cold-tone clinical lighting. Ordered and methodical.
- **Camera:** Phase One IQ4, 120mm, f/11, focus-stacked.

### Affiliates hero — 16:9
- **Target output:** peer-to-peer partner program, businesslike.
- **Prompt:** Editorial overhead flat-lay of a vial, a printed spec sheet, and a brushed-metal pen on dark slate, a single acid-green tab marker as the only accent. Cold-tone clinical lighting.
- **Camera:** Fujifilm GFX 100, 63mm, f/8, overhead rig.

---

## 2. PDP product-photography brief

**Shared composition for all PDP vials:**
- Background: pure black void, no surface reflection beyond a faint floor gradient.
- Subject: matte-black PET research vial, silver hot-foil wordmark catching the key light, crimped aluminum cap, lyophilized powder visible through glass.
- Lighting: single hard key from top-left, backlit silver foil so the hot-foil logo catches, deep shadow falloff.
- Angle set (four per SKU): (1) front elevation, (2) three-quarter, (3) cap-crimp macro, (4) label macro.
- No props, no hands, no dosage/human-use directions printed on the label.
- Camera baseline: Phase One IQ4 150MP, 120mm Macro, f/11, focus-stacked, black void sweep.

---

## 3. Per-SKU prompts (all 14 catalog SKUs)

Each prompt inherits the PDP brief above; only the label text and spec change.

### BPC-157 — Recovery & Repair · MW 1419.53 g/mol · ≥99.2%
Product photograph of the BPC-157 vial on a pure black void. Matte-black PET vial, silver hot-foil "BPC-157" wordmark, MW 1419.53 set small beneath in mono type, lyophilized powder visible. Cold-tone clinical lighting, key from top-left, backlit foil. Catalog-grade four-angle set. **Negative:** base + dosage instructions, human-use directions.

### TB-500 — Recovery & Repair · MW 4963.44 g/mol · ≥98.8%
Product photograph of the TB-500 vial, larger lyophilized cake (higher MW fragment), silver foil "TB-500" label, MW 4963.44 beneath. Same lighting and void. Four-angle set.

### GHK-Cu — Longevity · MW 403.94 g/mol · ≥99.0%
Product photograph of the GHK-Cu vial; the reconstituted copper-tripeptide reads faint blue-tinted in the glass cap detail macro, dry cake near-white in body. Silver "GHK-Cu" foil, MW 403.94. Cold-tone lighting; the blue cast is the only color beyond palette — keep it subtle. Four-angle set.

### Semaglutide — Metabolic · MW 4113.58 g/mol · ≥99.4%
Product photograph of the Semaglutide vial, premium tier — crisp specular on foil, "Semaglutide" wordmark, MW 4113.58. Slightly taller vial silhouette. Catalog four-angle set.

### Selank — Cognition & Neuro · MW 751.90 g/mol · ≥98.6%
Product photograph of the Selank vial, fine lyophilized powder, silver "Selank" foil, MW 751.90. Cold-tone void shot, four angles.

### Cerebrolysin — Cognition & Neuro · Mixture · ≥97.5%
Product photograph of the Cerebrolysin vial — supplied **in solution**, so render clear-to-faint-amber liquid (kept neutral-cool, not warm) behind glass, "Cerebrolysin" foil label, "Mixture" noted small. No lyophilized cake. Four-angle set including liquid-clarity macro.

### Thymosin Alpha-1 — Recovery & Repair · MW 3108.30 g/mol · ≥99.1%
Product photograph of the Thymosin Alpha-1 vial, lyophilized, silver "Thymosin α-1" foil, MW 3108.30. Cold-tone void, four angles.

### Epitalon — Longevity · MW 390.35 g/mol · ≥99.0%
Product photograph of the Epitalon vial, low-MW peptide, sparse white cake, "Epitalon" foil, MW 390.35. Four-angle set.

### Tesamorelin — Growth Factors · MW 5135.83 g/mol · ≥98.9%
Product photograph of the Tesamorelin vial, largest MW in catalog — fuller cake, "Tesamorelin" foil, MW 5135.83. Cold-tone void, four angles.

### CJC-1295 — Growth Factors · MW 3367.97 g/mol · ≥99.0%
Product photograph of the CJC-1295 vial, "CJC-1295" foil, MW 3367.97, lyophilized. Four-angle catalog set.

### MOTS-c — Metabolic · MW 2174.48 g/mol · ≥98.7%
Product photograph of the MOTS-c mitochondrial peptide vial, "MOTS-c" foil, MW 2174.48. Cold-tone void, four angles.

### Ipamorelin — Growth Factors · MW 711.85 g/mol · ≥99.1%
Product photograph of the Ipamorelin vial, fine powder, "Ipamorelin" foil, MW 711.85. Four-angle set.

### Hexarelin — Growth Factors · MW 887.04 g/mol · ≥98.5%
Product photograph of the Hexarelin vial, "Hexarelin" foil, MW 887.04, lyophilized. Cold-tone void, four angles. (Low-stock SKU — single hero angle acceptable if budget-limited.)

### NAD+ — Longevity · MW 663.43 g/mol · ≥99.3%
Product photograph of the NAD+ vial, "NAD+" foil, MW 663.43, fine white cake. Cold-tone void, four-angle set.

---

## 4. Editorial / lifestyle (research-lab, no consumption)

### Reconstitution detail — 3:2
Macro crop of nitrile-gloved hands drawing bacteriostatic water into a precision micropipette above an open vial, sterile field, wrists-down framing only, no face. Cold-tone clinical lighting. **Negative:** base + injection into body, mouth, ingestion.
**Camera:** Nikon Z9, 105mm Macro, f/8, ring-light fill.

### Vials in rack — 3:2
Receding row of identical capped vials in a black anodized rack, sharp focus on the front vial's silver foil, progressive bokeh down the line. Cold-tone clinical lighting.
**Camera:** Sony A1, 90mm Macro, f/4, focus on front rank.

### Analytical instrument — 3:2
Close detail of an HPLC autosampler arm poised over a tray of capped vials, fine tubing and a glowing acid-green status LED as the single accent. Cold-tone clinical lighting, instrument-grade realism.
**Camera:** Canon R5, RF 100mm Macro, f/9.

**Editorial rule:** never show a person's face, never show product entering a body, never show a workout or "before/after." Gloved hands, pipettes, racks, instruments only.

---

## 5. Banner & social prompts

### 728×90 leaderboard — 21:9
Ultra-wide composition, a single vial pinned to the left third, vast black negative space to the right for type, faint hex lattice. Cold-tone clinical lighting. **Camera:** Phase One IQ4, 80mm, f/9, wide crop.

### Social 1:1 (feed)
Centered single vial on black void, silver foil catching the key, even margins for caption overlay. Cold-tone clinical lighting. **Camera:** Hasselblad H6D, 100mm, f/11, square crop.

### Social 4:5 (portrait feed)
Tall portrait of a single vial slightly low in frame, headroom above for type. Cold-tone clinical lighting. **Camera:** Fujifilm GFX 100, 110mm, f/8, 4:5 crop.

### Social 9:16 (story / reel)
Full-bleed vertical of a vial rising from the lower third, hex lattice faint above, safe zones top and bottom for UI overlays. Cold-tone clinical lighting. **Camera:** Sony A7R V, 50mm, f/8, 9:16 crop.

### 16:9 (wide display / video poster)
Reuse the homepage hero prompt; crop the vial to the left third for headline overlay.

---

## 6. Negative-prompt rationale

The base negative prompt is not aesthetic — it is the **RUO compliance boundary expressed at the prompt layer**. Suppressing "people consuming product," "before/after," "syringe in skin," "medical cross," and "pills/capsules" prevents the model from drifting into consumer-health or medical-claim imagery that would violate the brand's Research-Use-Only labeling. Treat the negative prompt as non-negotiable on every generation.

---

## 7. Slot coverage checklist

- [x] 6 hero prompts (home, about, science, manufacturing, protocols, affiliates)
- [x] PDP photography brief
- [x] 14/14 SKU prompts (BPC-157, TB-500, GHK-Cu, Semaglutide, Selank, Cerebrolysin, Thymosin Alpha-1, Epitalon, Tesamorelin, CJC-1295, MOTS-c, Ipamorelin, Hexarelin, NAD+)
- [x] 3 editorial lab prompts
- [x] Banner + social crops (1:1, 4:5, 9:16, 16:9, 21:9)
- [x] Per-prompt: target output, mood, lighting, composition, palette, camera/lens, negative prompt
