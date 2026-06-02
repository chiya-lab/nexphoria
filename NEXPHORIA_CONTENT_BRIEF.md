# Nexphoria — Content Brief

**Status:** Canonical editorial reference for the Nexphoria Journal. Read alongside `NEXPHORIA_BRAND_SPEC.md` (voice + visual) and `NEXPHORIA_CONVERSION_PLAYBOOK.md` (page mechanics). A public mini-version of this document is published at `/journal/style-guide`.

---

## 1. Editorial mission

The Nexphoria Journal is written for the bench, not the buyer. It exists to be the most credible research-register editorial surface in the peptide category — the place a researcher reaches for a compound monograph, a methodology refresher, or a field-level read, and finds it written the way they would write it themselves.

Every article is a hybrid of three registers:

1. **A peer-reviewed methods section** — precise, hedged, citation-dense.
2. **A clinical-grade reagent catalog** (Cayman Chemical, Sigma-Aldrich, Tocris) — specs forward: MW, sequence, CAS, purity, lot, COA.
3. **A boutique's restraint** (Aesop, Le Labo) — quiet confidence, no hype.

If a sentence could plausibly appear in a clinical-grade reagent catalog **and** in a careful methods section, it is on-voice. If it could appear in a consumer-wellness advertisement, it is not.

**Non-negotiables:** peer-to-peer with researchers; describe only what is measurable and cite where it was measured; no medical claims; no personal-health-outcome promises; research-use-only framing on every compound; no emojis.

---

## 2. Voice — peer-to-peer researcher register

The journal does not sell; it informs, and the information is the sale. We use specific numbers, name our endpoints, and link our DOIs. We hedge where the literature hedges. We never translate a measurable bench finding into a consumer benefit.

The voice carries one structural commitment across every pillar: **provenance discipline.** Lot number, certificate of analysis, HPLC purity, and mass-spec identity recur as themes because reproducibility is the value the journal sells. Articles that model documentation habits are, by design, also modeling the brand's competitive position against grey-market supply.

---

## 3. The five content pillars

| # | Pillar | Definition | Primary CTA |
|---|--------|------------|-------------|
| 1 | **Compound monographs** | Sequence, physicochemical handling, in-vitro / animal-model literature for a single compound. | Link to the matching PDP. |
| 2 | **Methodology** | How the work is done — purity verification, reconstitution, cold chain, study design. | Link to `/tools/*` and COA lookup. |
| 3 | **Industry signals** | Field-level reads on where research attention is moving. Description, not prediction. | Newsletter capture. |
| 4 | **Researcher interviews** | Conversations (labeled composites where illustrative) modeling rigorous thinking. | Newsletter + related monographs. |
| 5 | **Lab-bench how-to** | Practical reference procedures with failure modes named. | Link to `/tools/*` and consumables. |

The twelve seed articles in `src/lib/mock-journal-articles.ts` cover all five pillars (4 monographs, 3 methodology, 2 signal, 2 interview, 1 how-to) and are the canonical voice samples every contributor calibrates against.

---

## 4. Editorial calendar — Q1–Q2 2026 (60 articles)

Format: **Topic · Pillar (M=monograph, ME=methodology, IS=industry signal, IV=interview, HT=how-to) · Target keyword · Est. monthly search volume · Persona · CTA.**

Personas: **IR** = independent researcher · **CL** = anti-aging clinician · **AC** = academic lab · **LB** = longevity biohacker.

### January (weeks 1–4)
1. BPC-157 monograph · M · "bpc-157 research" · 18k · IR · PDP
2. Tesamorelin monograph · M · "tesamorelin peptide" · 9k · CL · PDP
3. Epitalon monograph · M · "epitalon telomere" · 6k · LB · PDP
4. GHK-Cu monograph · M · "ghk-cu copper peptide" · 8k · CL · PDP
5. How to read a COA · ME · "certificate of analysis peptide" · 4k · IR · COA tool
6. Reconstitution best practices · ME · "how to reconstitute peptides" · 12k · IR · reconstitution calc
7. TB-500 monograph · M · "tb-500 research" · 11k · IR · PDP

### February
8. RP-HPLC purity verification · ME · "peptide purity hplc" · 2.5k · AC · COA tool
9. Cold-chain logistics · ME · "peptide cold chain shipping" · 1.2k · AC · shipping page
10. Storage and stability · HT · "peptide storage temperature" · 5k · IR · storage guide
11. Ipamorelin monograph · M · "ipamorelin research" · 14k · LB · PDP
12. CJC-1295 DAC vs no-DAC · M · "cjc-1295 dac vs no dac" · 7k · IR · PDP
13. Peptide research trends 2026 · IS · "peptide research 2026" · 3k · AC · newsletter
14. Semaglutide vs tirzepatide · M · "semaglutide vs tirzepatide" · 33k · CL · PDP

### March
15. Regulatory landscape brief · IS · "research peptides legal" · 6k · IR · research-use policy
16. Lab director interview · IV · "peptide quality control" · 1.8k · AC · newsletter
17. Longevity researcher Q&A · IV · "longevity peptides research" · 4k · LB · newsletter
18. Selank monograph · M · "selank research" · 6k · IR · PDP
19. Semax monograph · M · "semax research" · 7k · IR · PDP
20. Dose converter how-to · HT · "peptide dose calculator" · 9k · IR · dose tool
21. NAD+ research overview · M · "nad+ peptide longevity" · 10k · LB · PDP

### April
22. MOTS-c monograph · M · "mots-c peptide" · 5k · LB · PDP
23. SS-31 / elamipretide monograph · M · "ss-31 elamipretide" · 3k · AC · PDP
24. Freeze–thaw and aliquoting · HT · "peptide freeze thaw" · 1.5k · AC · storage guide
25. Vehicle and control design · ME · "vehicle control peptide assay" · 900 · AC · tools
26. PT-141 monograph · M · "pt-141 bremelanotide" · 12k · IR · PDP
27. Retatrutide triple agonist · M · "retatrutide research" · 15k · CL · PDP
28. Industry signal: incretin platform · IS · "glp-1 research landscape" · 8k · CL · newsletter

### May
29. KPV immunomodulatory tripeptide · M · "kpv peptide" · 4k · IR · PDP
30. LL-37 host defense peptide · M · "ll-37 peptide research" · 3k · AC · PDP
31. Thymosin alpha-1 monograph · M · "thymosin alpha 1" · 6k · CL · PDP
32. Bioassay controls explained · ME · "positive negative control assay" · 1.1k · AC · tools
33. Researcher Q&A: analytical chemist · IV · "peptide mass spec identity" · 800 · AC · newsletter
34. Sermorelin monograph · M · "sermorelin research" · 8k · CL · PDP
35. Half-life and sampling design · ME · "peptide half life" · 2k · AC · half-life tool

### June
36. Epigenetic clocks and longevity · IS · "epigenetic clock research" · 5k · LB · newsletter
37. Oxytocin neuropeptide monograph · M · "oxytocin research" · 9k · AC · PDP
38. Kisspeptin reproductive axis · M · "kisspeptin research" · 4k · AC · PDP
39. Mouse vs rat model selection · ME · "animal model selection research" · 1.3k · AC · tools
40. AOD-9604 lipolytic fragment · M · "aod-9604 research" · 6k · IR · PDP
41. Hexarelin monograph · M · "hexarelin research" · 3k · IR · PDP
42. Statistics: sample size & power · ME · "sample size power calculation" · 2k · AC · tools

### Q2 overflow / evergreen (43–60)
43. DSIP sleep peptide review · M · "dsip peptide" · 4k · LB · PDP
44. Follistatin-344 review · M · "follistatin 344" · 3k · IR · PDP
45. MK-677 oral secretagogue · M · "mk-677 ibutamoren" · 20k · LB · PDP
46. Peptide administration routes · ME · "subcutaneous vs ip injection research" · 2k · IR · tools
47. IGF-1 as biomarker · M · "igf-1 peptide research" · 5k · AC · PDP
48. GPCR biased agonism primer · IS · "biased agonism gpcr" · 1.5k · AC · newsletter
49. Researcher Q&A: longevity clinician · IV · "anti-aging peptide clinic" · 3k · CL · newsletter
50. Blood-brain barrier delivery · ME · "peptide bbb delivery" · 1k · AC · tools
51. Wolverine blend (BPC/TB/GHK) · M · "bpc-157 tb-500 stack" · 7k · IR · PDP
52. Lab setup & safety · HT · "peptide lab safety" · 1.2k · AC · tools
53. Sirtuins and NAD dependence · IS · "sirtuin nad research" · 3k · LB · newsletter
54. Melanotan II MC-receptor review · M · "melanotan ii research" · 9k · IR · PDP
55. Peptide solubility troubleshooting · HT · "peptide won't dissolve" · 1.5k · IR · reconstitution calc
56. Glutathione & oxidative stress · M · "glutathione peptide research" · 6k · LB · PDP
57. IC50 / EC50 / Ki explained · ME · "ic50 ec50 ki binding affinity" · 2.5k · AC · tools
58. Vendor due diligence checklist · IS · "how to vet peptide vendor" · 4k · IR · COA tool
59. Researcher Q&A: academic PI · IV · "running a peptide lab" · 700 · AC · newsletter
60. Mid-year field review 2026 · IS · "peptide research mid 2026" · 2k · AC · newsletter

---

## 5. SEO keyword map — 40 primary keywords

Format: **Keyword · Intent (I=informational, C=commercial, T=transactional) · Target page · Difficulty (L/M/H).**

| # | Keyword | Intent | Target page | Diff |
|---|---------|--------|-------------|------|
| 1 | bpc-157 research | I | /journal/bpc-157-monograph | H |
| 2 | buy bpc-157 | T | /products/bpc-157 | H |
| 3 | tesamorelin peptide | I | /journal/tesamorelin-monograph | M |
| 4 | ghk-cu copper peptide | I | /journal/ghk-cu-monograph | M |
| 5 | epitalon telomere | I | /journal/epitalon-monograph | L |
| 6 | tb-500 research | I | /blog/tb-500-thymosin-beta-4-researchers-complete-guide | H |
| 7 | how to reconstitute peptides | I | /journal/reconstitution-best-practices | M |
| 8 | peptide reconstitution calculator | T | /tools/reconstitution | M |
| 9 | certificate of analysis peptide | I | /journal/hplc-purity-verification | L |
| 10 | peptide purity hplc | I | /journal/hplc-purity-verification | L |
| 11 | peptide storage temperature | I | /journal/storage-and-stability | L |
| 12 | peptide cold chain shipping | I | /journal/cold-chain-logistics | L |
| 13 | semaglutide vs tirzepatide | C | /blog/semaglutide-vs-tirzepatide-research-comparison | H |
| 14 | retatrutide research | I | /blog/retatrutide-triple-agonist-research-guide | M |
| 15 | ipamorelin research | I | /products/ipamorelin | M |
| 16 | cjc-1295 dac vs no dac | I | /blog/cjc-1295-no-dac-vs-cjc-1295-dac-choosing-right-ghrh-analog | M |
| 17 | mk-677 ibutamoren | C | /products/mk-677 | H |
| 18 | pt-141 bremelanotide | C | /products/pt-141 | M |
| 19 | nad+ peptide longevity | I | /products/nad-plus | M |
| 20 | mots-c peptide | I | /products/mots-c | L |
| 21 | ss-31 elamipretide | I | /products/ss-31 | L |
| 22 | selank research | I | /products/selank | M |
| 23 | semax research | I | /products/semax | M |
| 24 | kpv peptide | I | /products/kpv | L |
| 25 | ll-37 peptide research | I | /products/ll-37 | L |
| 26 | thymosin alpha 1 | I | /products/thymosin-alpha-1 | M |
| 27 | sermorelin research | I | /products/sermorelin | M |
| 28 | peptide dose calculator | T | /tools/molarity-calculator | M |
| 29 | peptide half life | I | /tools (half-life) | L |
| 30 | research peptides legal | I | /research-use-policy | M |
| 31 | how to vet peptide vendor | C | /journal/regulatory-landscape-brief | M |
| 32 | peptide research 2026 | I | /journal/peptide-research-trends-2026 | L |
| 33 | longevity peptides research | I | /journal/longevity-researcher-interview | M |
| 34 | peptide quality control | I | /journal/lab-director-interview | L |
| 35 | bpc-157 tb-500 stack | C | /blog/bpc-157-tb-500-recovery-stack-deep-dive | M |
| 36 | subcutaneous vs ip injection research | I | /blog/peptide-administration-routes-sc-ip-iv-intranasal-guide | L |
| 37 | ic50 ec50 ki binding affinity | I | /blog/peptide-ic50-ec50-ki-binding-affinity-research-guide | L |
| 38 | sample size power calculation | I | /blog/peptide-research-statistics-sample-size-power-calculations-data-analysis | L |
| 39 | research grade peptides | C | /products | H |
| 40 | peptide coa lookup | T | /coa | L |

**Intent → template mapping:** informational keywords target journal/blog articles; commercial keywords target PDPs with a strong editorial cross-link; transactional keywords target tools, COA lookup, or PDP add-to-cart.

---

## 6. Internal linking matrix — 20 hub pages → spokes

Hubs are high-authority pages; spokes are articles that should link **up** to the hub and that the hub should link **down** to. Every monograph links to its PDP; every PDP links to its monograph and to the relevant methodology article.

| Hub page | Primary spokes (articles) |
|----------|---------------------------|
| /products (PLP) | all 4 monographs, vendor due-diligence, research-grade overview |
| /products/bpc-157 | bpc-157-monograph, hplc-purity-verification, storage-and-stability |
| /products/tesamorelin | tesamorelin-monograph, reconstitution-best-practices |
| /products/ghk-cu | ghk-cu-monograph, hplc-purity-verification |
| /products/epitalon | epitalon-monograph, longevity-researcher-interview |
| /products/ipamorelin | tesamorelin-monograph (GH axis), half-life methodology |
| /products/nad-plus | longevity-researcher-interview, trends-2026 |
| /journal (index) | all 12 seed articles + calendar |
| /journal/style-guide | this brief; all 12 seeds |
| /tools/reconstitution | reconstitution-best-practices, storage-and-stability |
| /tools/molarity-calculator | reconstitution-best-practices |
| /coa (lookup) | hplc-purity-verification, lab-director-interview |
| /science | hplc-purity-verification, monographs |
| /manufacturing | cold-chain-logistics, regulatory-landscape-brief |
| /shipping | cold-chain-logistics |
| /research-use-policy | regulatory-landscape-brief |
| /protocols | monographs (compound combos), stacking caveats |
| /guides (hub) | methodology articles, storage-and-stability |
| /about | trends-2026, regulatory-landscape-brief |
| /faq | reconstitution, storage, COA articles |

**Rule:** no orphan articles. Every journal article links to at least one hub (up) and at least two sibling articles (lateral), and is linked from its pillar's index. The seed articles already encode lateral links in their `related[]` arrays.

---

## 7. Voice guardrails — 30 do-say / don't-say substitutions

| # | Don't say | Say instead |
|---|-----------|-------------|
| 1 | Mental clarity | Molecular precision |
| 2 | Cognitive performance | Advanced peptide research |
| 3 | Nootropic stack | Research protocol |
| 4 | Boost focus | Investigate cognition pathways |
| 5 | Supplement | Research compound |
| 6 | Vitamin | Research reagent |
| 7 | Daily ritual | Reconstitution protocol |
| 8 | Wellness | Research integrity |
| 9 | Self-care | Protocol design |
| 10 | Biohack (verb at reader) | Investigate / characterize |
| 11 | Cure | Studied in [model] for [endpoint] |
| 12 | Treat | Examined as a research tool for |
| 13 | Heal | Associated with [measured repair endpoint] in animal models |
| 14 | Diagnose | (never — RUO violation) |
| 15 | Anti-aging | Longevity-science endpoints |
| 16 | Lose weight | Metabolic endpoints in animal models |
| 17 | Build muscle | Skeletal-muscle endpoints in research |
| 18 | Sleep better | Circadian / sleep-architecture endpoints |
| 19 | Feel better | (never — subjective, non-measurable) |
| 20 | More energy | Oxygen consumption rate / bioenergetic readout |
| 21 | Miracle | Cited in [N] peer-reviewed studies |
| 22 | Breakthrough | Recent literature reports |
| 23 | Revolutionary | Novel mechanism under investigation |
| 24 | Best / ultimate | Higher-purity / better-characterized |
| 25 | Game-changer | (never — hype) |
| 26 | For best results take 2x daily | Reconstitute with [N] mL bacteriostatic water |
| 27 | Recommended dose | Concentration used in [cited study] |
| 28 | Free shipping over $X | Cold-chain shipping included over $150 |
| 29 | Scrape / crawl | Collect / extract / gather |
| 30 | Customers love | Verified researchers report (with credential) |

---

## 8. Distribution channels and cadence

| Channel | Content | Cadence |
|---------|---------|---------|
| Journal (`/blog`, `/journal`) | Full articles, all 5 pillars | 2–3 / week per the calendar |
| Newsletter ("Lab notes, monthly") | Curated primary-literature summaries, no promos | First Monday of each month |
| PDP editorial cross-links | Monograph excerpts feeding the matching product page | Continuous (on publish) |
| Tools pages | Methodology + how-to articles linked from calculators | Continuous |
| Social (research-register only) | Single-fact citations with DOI links; no hype | 3–4 / week, opportunistic |

**Cadence discipline:** the newsletter promise is "Cited research, monthly. No promos." Honoring that promise — never converting the newsletter into a discount channel — is itself part of the brand position. Publishing volume serves SEO and authority; the newsletter serves trust. They are not the same channel and must not blur.

---

## 9. Compliance checklist (every article, before publish)

- [ ] No medical claims; every health-adjacent statement scoped to in-vitro / animal-model and cited.
- [ ] No forbidden vocabulary (see §7 and the brand spec).
- [ ] Research-use-only framing present where compounds are discussed.
- [ ] Citations carry DOIs and resolve to real references.
- [ ] Material discussed with lot / COA / purity discipline where relevant.
- [ ] No emojis. No "scrape"/"crawl."
- [ ] Interviews with composite figures are labeled as composites.
- [ ] Each article links up to a hub and laterally to ≥2 siblings.
