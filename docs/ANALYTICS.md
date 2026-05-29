# Kappas — Analytics & Measurement

Three layers, three jobs. Layers 1–2 get wired into the site; layer 3 is an ongoing service.

## Layer 1 — Web analytics (what happened)
**Goal:** know traffic, sources, top wines, conversion rate, revenue.
- **Tool:** Google Analytics 4 (free) + Google Search Console.
- **Track:** sessions, source/medium, product views, `add_to_cart`, `begin_checkout`, `purchase` (with value + items), trade-account signups, newsletter signups.
- **Path:**
  1. Create GA4 property + install via Google Tag Manager (so every tag lives in one place).
  2. Turn on enhanced e-commerce events (the platform/plugin emits most automatically).
  3. Define **conversions**: purchase, trade signup, newsletter.
  4. Link GA4 ↔ Search Console ↔ Google Ads.
- **Done when:** a real purchase shows up end-to-end with correct revenue and item data.

## Layer 2 — Behavioral analytics ("where people struggle")
**Goal:** see *why* people drop off — the friction GA4 can't show.
- **Tools:** **Microsoft Clarity** (free: heatmaps, scroll maps, session recordings, rage-click & dead-click detection) is the easy win. **Hotjar** or **PostHog** if you want surveys/funnels too (PostHog also self-hostable, good for a data analyst).
- **Watch for:** rage clicks, dead clicks, sharp scroll drop-off on long pages, checkout-field abandonment, mobile vs desktop friction.
- **Path:**
  1. Install Clarity site-wide (one snippet, via GTM).
  2. Build a **checkout funnel** (cart → address → payment → success) and find the biggest leak.
  3. Review heatmaps on home, collection, and a product page; watch 10–15 recordings of drop-offs.
  4. Turn findings into spec'd fixes (see `SPECS.md`) → measure again. This loop *is* CRO.
- **Done when:** you can point to one concrete drop-off and a before/after improvement.

## Layer 3 — Business intelligence (what it means, what to do)
**Goal:** the stuff the store admin won't tell him — true profit and where to push.
- **Tool:** a free BI tool (Google Looker Studio / Metabase / Power BI) fed from the store's data (WooCommerce REST API or scheduled export).
- **Dashboards:** true **margin per wine** (sale price − Sicilian cost), B2B vs B2C profitability, top trade accounts, repeat-purchase rate / CLV, inventory aging & reorder timing, ad spend vs revenue (ROAS) pulled alongside.
- **Path:** model the data once → build the dashboard → set a weekly auto-refresh + a short monthly read-out.
- **This is a retainer, not a build item.** It's the recurring, data-analyst-led work — price it separately (monthly fee + optional performance bonus).

## Consent & GDPR (applies to all three + ads)
Analytics, heatmaps, recordings, and ad pixels all set cookies → you need a **consent banner** and **Google Consent Mode v2** in the EU. Recordings must mask personal data (Clarity/Hotjar do this by default — keep it on). No tags fire before consent. Bake this into Layer-1 setup, don't bolt it on later.
