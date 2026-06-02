# Nexphoria — Performance Audit (Agent 28)

Branch: `pepperis/28-perf`
Build: Next.js 16.2.6 (Turbopack), `output: 'export'` static export, `images.unoptimized: true`.
Date: 2026-06-02

## Method

Next.js 16 + Turbopack no longer prints the classic per-route "First Load JS" size
table during `next build`. Sizes below are measured directly from build artifacts:

- Shared baseline = `polyfillFiles` + `rootMainFiles` from `.next/build-manifest.json`.
- Eager vs. lazy split = every `.next/static/chunks/*.js`, classified by whether it
  appears in any route's `react-loadable-manifest.json` (lazy) or not (eager).

All sizes are **raw (uncompressed)** bytes. Over the wire they are Brotli/gzip
compressed, so transferred bytes are roughly 25-35% of the figures shown.

## Findings

### 1. Almost everything is a client component
259 of ~260 component/page files carry `"use client"`. The site chrome that mounts
on every route — header, footer, cart drawer, modals — is fully client-rendered, and
`framer-motion` (101 files) + `lucide-react` (102 files) are pulled into the client
graph site-wide. This is the dominant driver of JS weight.

### 2. The 3.1 MB chunk is already lazy (not First Load)
`chunks/04nq57nrvw7cr.js` (3.07 MB raw) is the single largest artifact. It is the
`SearchModal` dynamic import: `SearchModal` pulls in the full `products` and
`articles` catalogs plus `framer-motion`. It is registered only in
`react-loadable-manifest.json` (loaded via `next/dynamic` with `ssr: false`), so it is
**not** part of any route's First Load JS — it loads after hydration / on demand. No
action required beyond keeping it lazy.

### 3. Modals were already deferred
`src/components/ClientModals.tsx` already wraps the RUO gate, exit-intent, newsletter
band, search modal, and back-to-top in `next/dynamic({ ssr: false })`. Good.

### 4. SEO / meta scaffolding already strong
- `layout.tsx` already defines OpenGraph + Twitter card defaults, JSON-LD
  (Organization / WebSite / SiteNavigation), canonical + hreflang, and robots.
- `next/font/google` is configured with `display: "optional"` (stronger than `swap`
  for CLS — fonts never cause a swap reflow).
- Per-route `<title>` / `<meta description>` are unique. The apparent "duplicates"
  from grep are the intentional metadata + openGraph + twitter triple **within** each
  page file, not cross-route collisions. The only repeated title is "Not Found"
  (404-type pages), which is correct.

### 5. robots.txt and sitemap.xml already generated
`src/app/robots.ts` and `src/app/sitemap.ts` (both `force-static`) emit
`out/robots.txt` and `out/sitemap.xml` at build. The sitemap contains 358 URLs
(products, protocols, guides, tools, blog, categories, tags). A stale
`public/robots.txt` exists but is overridden by the route handler's output in `out/`.
A standalone `scripts/generate-sitemap.mjs` was intentionally **not** added: it would
produce a second, conflicting `/sitemap.xml` and duplicate logic that the existing
typed route handler already covers from the canonical data source.

### 6. Images are NOT SVG-only (scope assumption incorrect)
The task brief stated the repo is SVG-only. It is not: `public/` holds **192 raster
files totalling ~51 MB**, including several over 1 MB
(`brand/poster-triptych.jpg` 3.0 MB, `brand/box-detail.jpg` 1.9 MB,
`brand/boxes-cascade.jpg` 1.5 MB, `images/image0016.jpg` 1.2 MB). With
`images.unoptimized: true` these ship as-is. This is the largest real-world payload
problem but is **out of scope for an additive code pass** — the assets belong to other
agents' work and several are referenced as LCP/hero images. See recommendations.

### 7. No raw `<img>` tags and no empty alt text
`grep` for `<img ` and `alt=""` in `src` returns zero matches, so the "add
loading=lazy / fix alt" task had nothing to act on. Image rendering goes through
components, not bare `<img>`.

### 8. Unused dependency
`tw-animate-css` has zero references in `src`, CSS, or PostCSS config — safe to drop.
`shadcn` is a CLI scaffolding tool referenced only by `components.json`; leave it.

## Changes made (this PR)

All changes are additive and behavior-preserving.

1. **Lazy-load the cart drawer.** `PprCartDrawer` (23.5 KB source; pulls `framer-motion`,
   the product catalog, and `ProductVial`) renders nothing until the cart store's
   `isOpen` flips true. Moved it out of the eager `layout.tsx` render into the deferred
   `ClientModals` group via `next/dynamic({ ssr: false })`. It now ships as a lazy
   chunk instead of in the layout's First Load JS. Opening still works unchanged — the
   header triggers it through the global `openDrawer` store action, not a prop.
2. **`prefetch={false}` on footer links.** The footer renders ~25 navigation + legal
   links on every page; Next was prefetching all of them on viewport entry. Disabling
   prefetch on these long-tail links removes a per-page prefetch waterfall with no UX
   cost (they are below-fold navigation, not primary CTAs).
3. **`public/site.webmanifest`** added with `theme_color` / `background_color`
   `#0A0B0D` (brand `--ink`), linked from `layout.tsx` metadata, plus a `viewport`
   export setting `themeColor: "#0A0B0D"` and `colorScheme: "dark"`. PWA/installability
   and correct mobile browser-chrome color are now defined.

## Before / after bundle sizes (raw bytes)

| Metric                                   | Before    | After     |
| ---------------------------------------- | --------- | --------- |
| Shared baseline (polyfill + rootMain)    | 555.5 KB  | 555.5 KB  |
| Largest single chunk (SearchModal, lazy) | 3147.4 KB | 3147.4 KB |
| Lazy chunk count                         | 6         | 7         |

The shared `rootMainFiles` baseline is the framework runtime; it is unchanged because
none of these edits touch the framework graph. The measurable effect of change (1) is
that the cart drawer moved from the layout's eager page chunk into the lazy set (lazy
chunk count 6 -> 7), so it is no longer downloaded/parsed on first paint for users who
never open the cart. The effect of change (2) is a reduction in **runtime prefetch
network**, which does not show up in static chunk sizes. `next build` exits 0 and
`tsc --noEmit` exits 0 before and after.

## Top 5 remaining recommendations

1. **Reduce the `"use client"` footprint.** Audit the 259 client components and convert
   purely presentational, stateless ones (static spec tables, COA value blocks, copy
   sections) back to server components. This is the single largest lever on shipped JS
   but must be done per-component with care — it is too invasive for an additive pass
   and would conflict with other agents' in-flight work.

2. **Compress / convert the raster assets.** ~51 MB across 192 files, several over
   1 MB. Re-encode the JP/PNG hero and brand images to WebP/AVIF at appropriate
   dimensions (many are far larger than their display size). Because
   `images.unoptimized: true` is required by static export, optimization must happen at
   build time (a sharp-based image pipeline) rather than via `next/image`.

3. **Tree-shake / centralize icon and motion imports.** `lucide-react` and
   `framer-motion` are imported in ~100 files each. Confirm named-import tree-shaking is
   effective in the Turbopack build, and consider a thin local motion wrapper so
   reduced-motion handling and easing tokens live in one place and dead variants drop.

4. **Give client tool/calculator pages real metadata.** ~26 calculator/tool routes are
   `"use client"` at the page level and therefore cannot export `metadata`, leaving them
   on the layout's default title/description. Convert each to a server `page.tsx` that
   exports route-specific metadata and renders the interactive client component as a
   child. High SEO value for the long-tail tool pages.

5. **Remove the unused `tw-animate-css` dependency** (and re-verify `shadcn` is only
   needed as a scaffolding CLI). Trims install weight and the dependency surface.

## Lighthouse estimate (heuristic, NOT measured)

No Lighthouse run was performed (no headless Chrome in this environment). These are
informed estimates for the static-exported, dark-themed site:

| Category       | Est. | Rationale                                                          |
| -------------- | ---- | ------------------------------------------------------------------ |
| Performance    | 70-85| Strong: static HTML, `display:optional` fonts, LCP preload, lazy modals/cart. Drag: heavy client-component graph + large unoptimized hero images. |
| Accessibility  | 90-95| Skip-link, `lang`, semantic landmarks present; verify color contrast of `--silver-2` on `--ink` and focus-visible coverage. |
| Best Practices | 90-100| HTTPS, no console in prod (`removeConsole`), valid manifest now present. |
| SEO            | 95-100| Unique titles/descriptions, canonical+hreflang, JSON-LD, robots + 358-URL sitemap. |

Estimates only — run Lighthouse against the deployed `out/` build for real numbers.
