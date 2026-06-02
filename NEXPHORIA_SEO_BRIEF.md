# Nexphoria — SEO Brief

**Status:** Canonical technical-SEO reference for the Nexphoria storefront. Read alongside `NEXPHORIA_CONTENT_BRIEF.md` (editorial + keyword strategy). This brief describes the crawlable architecture, structured-data inventory, per-route meta templates, and hreflang posture as implemented in this codebase (Next.js App Router, static export to `out/`).

---

## 1. Crawlable architecture map

The site is a statically exported Next.js App Router application (`output: 'export'`). Every route below renders to a static HTML file in `out/`, so the entire site is fully indexable without client-side rendering dependencies. The canonical sitemap is generated at `src/app/sitemap.ts` and the crawler directives at `src/app/robots.ts`.

### Top-level routes → child routes → template

```
/                                  → Home template
/products                          → PLP (CollectionPage) template
  /products/[slug]                 → PDP (Product) template
/compounds                         → Compound directory (CollectionPage)
/protocols                         → Protocol index (CollectionPage)
  /protocols/[slug]*               → Protocol detail (Product/Article hybrid)
/blog  (the Journal)               → Article index (Blog) template
  /blog/[slug]                     → Article (BlogPosting) template
  /blog/category/[category]        → Filtered index (CollectionPage)
  /blog/tag/[tag]                  → Filtered index (CollectionPage)
/journal/style-guide               → Editorial standard (WebPage)   [new]
/guides                            → Guides hub (CollectionPage)
  /guides/[topic]                  → Guide article (Article) template
/tools                             → Tools hub (WebPage)
  /tools/[tool]                    → Interactive tool (WebPage)
/science, /manufacturing, /about   → Brand (AboutPage / WebPage)
  /about/team, /about/science-advisors → WebPage + credentials
/coa                               → COA lookup (WebPage)
/faq                               → FAQ (FAQPage)
/contact                           → Contact (ContactPage)
/shipping, /returns, /wholesale    → Service (WebPage)
/reviews                           → Reviews (WebPage / aggregate)
/quiz, /build-your-stack, /stack-builder, /compare → Interactive (WebPage)
/cart, /checkout                   → Commerce (WebPage, noindex)
/account, /sign-in, /sign-up       → Account (WebPage, noindex)
/admin/*                           → Admin (noindex, not in sitemap)
/legal, /terms, /privacy, /cookies, /do-not-sell,
  /accessibility, /research-use-policy, /coa-compliance → Legal (WebPage)
/affiliates, /refer, /resources, /subscribe → Supporting (WebPage)
```

### Crawl-priority tiers

1. **Tier 1 (crawl daily, highest priority):** `/`, `/products`, all `/products/[slug]`, `/blog` and `/blog/[slug]`.
2. **Tier 2 (weekly):** `/compounds`, `/protocols`, `/guides/*`, `/tools/*`, `/journal/style-guide`, brand pages.
3. **Tier 3 (monthly):** service pages, legal pages, filtered index pages.
4. **Excluded from index:** `/cart`, `/checkout`, `/account/*`, `/sign-in`, `/sign-up`, `/admin/*`. These carry `robots: { index: false }` and are omitted from `sitemap.ts`.

### Internal-link crawl paths

The site exposes three primary crawl spines, each ensuring every Tier-1 and Tier-2 page is reachable within three clicks of the home page:

- **Commerce spine:** Home → PLP → PDP → related PDP / protocol.
- **Editorial spine:** Home → Journal index → article → related article / matching PDP.
- **Reference spine:** Home → Guides/Tools hub → guide or tool → linked methodology article.

The internal-linking matrix in the content brief (§6) governs the editorial spine's hub-and-spoke structure. No Tier-1/2 page may be an orphan.

---

## 2. Structured-data (JSON-LD) inventory

Structured data is emitted per route as inline `<script type="application/ld+json">`. The types currently in use across the codebase, and the route types that should carry each:

| JSON-LD type | Emitted on | Notes |
|--------------|-----------|-------|
| `Organization` | Site-wide (layout) | Publisher identity; logo, URL, contact. |
| `WebSite` + `SearchAction` | Home / layout | Enables sitelinks search box. |
| `SiteNavigationElement` | Layout | Primary nav exposure. |
| `BreadcrumbList` + `ListItem` | All deep pages | Drives breadcrumb rich result; one per page. |
| `Product` + `Offer` + `Brand` | `/products/[slug]` (PDP) | Price, availability, brand; RUO-compatible (no health claims). |
| `CollectionPage` + `ItemList` | PLP, category/tag indexes, hubs | Lists child items. |
| `Blog` | `/blog` index | Publication-level markup. |
| `BlogPosting` | `/blog/[slug]` articles | Headline, author, datePublished/Modified, publisher. |
| `Article` | `/guides/[topic]` | Editorial guide markup. |
| `FAQPage` + `Question` + `Answer` | `/faq` (and PDP FAQ blocks) | FAQ rich result. |
| `WebPage` | Generic pages, `/journal/style-guide`, tools | Baseline page markup with `inLanguage: en-US`. |
| `AboutPage` | `/about` | Brand/about markup. |
| `ContactPage` + `ContactPoint` | `/contact` | Contact rich data. |
| `EducationalOccupationalCredential` | `/about/science-advisors` | Advisor credentials. |
| `ImageObject` | OG/hero images | Image metadata. |
| `PropertyValue` | Spec tables | MW, CAS, purity as structured properties. |

### Structured-data rules

1. **One canonical type per page**, plus `BreadcrumbList` where applicable. Do not stack competing primary types.
2. **`BlogPosting` requires** `headline`, `author` (Person or Organization), `datePublished`, `dateModified`, `publisher` (Organization), and `mainEntityOfPage`. The seed-article model in `mock-journal-articles.ts` carries `author`, `publishedAt`, and `updatedAt` to populate these directly.
3. **`Product` markup must remain RUO-clean** — no `MedicalEntity`, no health claims, no `therapeuticUse`. Offers describe price and availability only.
4. **No `Review`/`AggregateRating` without verifiable backing** — only emit on pages with genuine verified-researcher reviews.
5. **`@type` must match real on-page content** — structured data that does not reflect visible content is a manual-action risk.

---

## 3. Meta-tag template per route type

All templates assume `inLanguage`/`lang="en-US"`, a self-referential canonical, and Open Graph + Twitter card parity. Titles target ≤60 characters, descriptions 140–160.

### Home (`/`)
- **Title:** `Nexphoria — Research-Grade Peptides, Pharmaceutical Discipline`
- **Description:** value prop, three clauses, no hype, RUO-implied.
- **Canonical:** `https://nexphoria.com/`
- **OG:** `og:type=website`, brand hero image 1200×630.

### PDP (`/products/[slug]`)
- **Title:** `{Compound} — {mg} {form} | Nexphoria` (e.g. "BPC-157 — 5mg Lyophilized | Nexphoria")
- **Description:** spec-forward — sequence/MW/purity/COA, ends "Research use only."
- **Canonical:** self.
- **OG:** `og:type=product`, void-black vial shot.
- **JSON-LD:** `Product` + `Offer` + `Brand` + `BreadcrumbList`.

### PLP (`/products`, category/tag indexes)
- **Title:** `{Category} Research Peptides | Nexphoria`
- **Description:** what the collection contains + provenance promise.
- **Canonical:** self; paginated views use `rel` self-canonical (no infinite-scroll duplicate URLs since scroll is client-side).
- **JSON-LD:** `CollectionPage` + `ItemList` + `BreadcrumbList`.

### Article (`/blog/[slug]`, `/journal/*`)
- **Title:** `{Headline} | Nexphoria Journal`
- **Description:** the article excerpt, ≤160 chars.
- **Canonical:** self.
- **OG:** `og:type=article`, `article:published_time`, `article:modified_time`, `article:author`.
- **JSON-LD:** `BlogPosting` (or `Article` for guides) + `BreadcrumbList`.

### Protocol (`/protocols/[slug]`)
- **Title:** `{Protocol} Research Protocol | Nexphoria`
- **Description:** what the protocol investigates + included compounds; RUO.
- **JSON-LD:** `Product`/`Article` hybrid + `BreadcrumbList`.

### Legal (`/terms`, `/privacy`, etc.)
- **Title:** `{Page} | Nexphoria`
- **Description:** plain-language summary.
- **Canonical:** self.
- **JSON-LD:** `WebPage` with `datePublished`/`dateModified` (effective/last-updated).

### Account / commerce (`/account`, `/cart`, `/checkout`, auth)
- **Title:** `{Page} | Nexphoria`
- **Robots:** `noindex, nofollow`.
- **No JSON-LD** beyond inherited `Organization`.

---

## 4. Hreflang strategy

**Posture: US-only, `en-US` default.** The storefront ships from a US facility and, per the conversion playbook, sells US-only by default (Canada/UK noted as a future-quarter consideration, not live).

Current implementation:

- **Single locale.** Every page declares `lang="en-US"` (HTML lang attribute) and `inLanguage: "en-US"` in JSON-LD. There is one URL per page; no locale-prefixed paths.
- **No `hreflang` cluster yet.** With a single served locale and a single URL set, `hreflang` annotations are unnecessary and would be self-referential noise. A self-referential canonical on every page is sufficient.
- **`x-default` readiness.** When international locales go live (the Q4 Canada/UK note), the migration path is: introduce locale-prefixed routes (e.g. `/en-ca/`, `/en-gb/`), add reciprocal `hreflang` annotations across the locale cluster, and designate the `en-US` URL set as `x-default`. Until then, do **not** add speculative `hreflang` tags — partial or non-reciprocal annotations are worse than none.

### Geo-targeting

- **Search Console:** set US as the target country while single-locale.
- **Currency/units:** USD and metric/SI units in all spec tables (MW in Da, mass in mg/µg, volume in mL). This is editorial consistency, not a geo signal, but it keeps content coherent for a US research audience.

---

## 5. Technical-SEO checklist (static export)

- [ ] `sitemap.ts` includes all Tier-1/2/3 indexable routes and excludes commerce/account/admin.
- [ ] `robots.ts` disallows `/cart`, `/checkout`, `/account`, `/admin`, `/sign-in`, `/sign-up`; allows the rest; references the sitemap.
- [ ] Every page has a self-referential canonical.
- [ ] Every indexable page declares exactly one primary JSON-LD type + `BreadcrumbList`.
- [ ] `Product` markup is RUO-clean (no medical/therapeutic claims).
- [ ] All images carry descriptive `alt`; hero/LCP images use priority hints.
- [ ] `lang="en-US"` on `<html>`; `inLanguage: "en-US"` in JSON-LD.
- [ ] No `hreflang` tags while single-locale.
- [ ] Article `BlogPosting` carries author, published, modified, publisher.
- [ ] Titles ≤60 chars; descriptions 140–160 chars; no keyword stuffing.
- [ ] No emojis in meta tags or structured data.

---

## 6. Measurement

Track, per the content brief's keyword map: ranking position for the 40 primary keywords, organic landing-page sessions for Tier-1 pages, journal article → PDP click-through (the editorial-spine conversion), and rich-result impressions for `Product`, `BlogPosting`, `FAQPage`, and `BreadcrumbList`. The leading indicator that the editorial strategy is working is journal-to-PDP click-through; the lagging indicator is organic transactional sessions on PDPs.
