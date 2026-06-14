# PROJECT.md — Cellar·K

## What it is
A bilingual (Greek / English) website for **Cellar·K**, a Sicilian-wine importer in
Greece, partnered with the historic winery **Cantine Colosi** (Salina / Aeolian Islands).
Dark, minimal, editorial wine-house character (near-black `#141414`). Static site on
GitHub Pages, moving to its own custom domain (`cellark.gr`, TBD).

Contact (public, in site + JSON-LD): cellarkinfo@gmail.com · +30 6972845565 ·
@cellar.k.selection · Μεγάλου Αλεξάνδρου 27, Χρυσούπολη 64200.

## The team
- **Romanos** — solo, non-expert developer building this for the client. Holds the
  client's Shopify credentials (sensitive). On a usage-limited plan.
- **Client / owner** — funds Shopify plan + domain; must perform owner-only actions
  (account, Payments activation, business/legal details, accountant/myDATA).

## Business model
1. **B2C — retail.** Anyone buys **single bottles** at retail price (incl. Greek ΦΠΑ 24%).
2. **B2B — wholesale.** Restaurants / wine shops buy **per case** at case pricing.
   - **Wholesale prices must be hidden** from the public and retail customers — visible
     **only to approved business accounts** with a valid VAT number (Greek ΑΦΜ).
   - Businesses **register / apply**, get verified + approved, then see wholesale pricing.
   - Greece-only ⇒ wholesale is a **lower net price list**, NOT a VAT exemption. Everyone
     pays Greek ΦΠΑ; the VAT number only proves the buyer is a real eligible business.

## Goals
1. **Connect Shopify for real payments** supporting both B2C (single bottle) and B2B
   (wholesale per case, gated). Plan: **Shopify Basic** with **native B2B** (available on
   Basic since 2025/2026). See SHOPIFY.md.
2. **Premium feel** — smooth, professional, luxury motion and design. **Keep the soul**:
   the dark, minimal, editorial wine-house character. Tasteful refinement welcome; show
   any larger visual departure first. See DESIGN.md.
3. **Stay a static site on GitHub Pages** unless there's a strong case otherwise.

## Current state (as of 2026-06-13)
Further along than a greenfield. Already built: hero, pinned 3-bottle story (i/ii/iii),
collection (13 cards from `wines.js`), trade CTA, slide-in cart drawer, footer; bilingual
toggle; 18+ age-gate; `catalog.html` with retail/wholesale split by URL + a QR catalogue;
placeholder legal pages; strong SEO/perf (AVIF, JSON-LD). **Not done:** real Shopify
checkout (cart is a placeholder; trade is a `mailto:`), GDPR cookie banner, real B2B
gating, filled legal/business details, shipping config. See PLAN.md.

## Hard constraints
Public repo (no secrets) · client funds paid apps (ask first) · Greece + alcohol
(18+, ΦΠΑ 24%, GDPR, ships GR only) · bilingual parity · don't break what works. Full
detail in CLAUDE.md and COMPLIANCE.md.
