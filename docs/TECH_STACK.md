> ⚠️ **STALE (2026-06-13).** Superseded by the root canonical docs. Commerce is **Shopify
> Basic** (not WooCommerce — see `../SHOPIFY.md`); motion is migrating **off** GSAP/Lenis to
> **vanilla + IntersectionObserver** (see `../DESIGN.md`). Kept for history only.

# Kappas — Tech Stack

## Front-end (this repo)
- **HTML + CSS + vanilla JS** for the marketing/design layer. No build step needed to preview.
- **Lenis** — smooth scroll.
- **GSAP + ScrollTrigger** — scroll animation / pinning.
- **Google Fonts** — Fraunces + Spectral.
- SVG + CSS gradients for art (keeps it light and asset-free until photography lands).

After **M1**, extract shared `assets/styles.css` and a small `assets/motion.js` (Lenis + GSAP setup) so every page imports one source of truth.

## Commerce platform — the real decision
You need a cart, checkout, products, **and a B2B/wholesale layer**, plus age-gate and an EU/Greek payment provider. Two sane routes:

### Recommended: WooCommerce (WordPress)
- Free, open, huge plugin ecosystem; cheap to run; easy for the owner to manage products.
- Built-in **Analytics** (revenue, orders, best-sellers, B2C vs B2B) — no custom dashboard needed.
- **B2B** via a wholesale plugin (customer roles + trade pricing + min order qty).
- **Payments:** Viva Wallet or Stripe (EU); confirm wine is allowed with the chosen provider.
- **Age-gate:** a lightweight plugin or the custom modal in M5.
- Port the design system from this repo into a block theme / lightweight custom theme. The scrollytelling pages can be custom templates that load Lenis + GSAP.

### Alternative: Shopify
- Faster to stand up, hosted, reliable; monthly fee; some analytics gated to higher plans; B2B needs Shopify's B2B (higher tier) or an app. Less control over bespoke motion pages.

**Default = WooCommerce** for cost, control, B2B flexibility, and owner-friendly admin. Confirm with the owner before building checkout (M7); don't switch platforms without sign-off.

## Running costs (owner pays — not the build fee)
- Domain ~€10–30/yr
- Hosting ~€50–500/yr depending on tier
- SSL — usually free (Let's Encrypt)
- A couple of paid plugins (wholesale, age-gate) ~€100–300/yr
- Card processing ~1.5–2.5% per sale
- Optional maintenance retainer ~€40–70/mo

## Analytics & growth (separate engagement)
- GA4 + Search Console at launch (M8).
- Deeper insight (true margin per wine, B2B vs B2C profitability, reorder timing) → pull WooCommerce data via its REST API into a **free BI tool (Google Looker Studio / Metabase / Power BI)**. Do **not** build a custom analytics app — the platform + a BI dashboard already cover it.
