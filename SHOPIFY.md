# SHOPIFY.md — integration design

> Verify the landscape yourself before acting; don't trust memory. Confirmed inputs as of
> 2026-06-13: **client is on Shopify Basic (active)**; payments via **Shopify Payments**
> (Greece-live; avoids the ~2% third-party surcharge); store ships **within Greece only**.

## Key facts that shape the design
- **Native Shopify B2B is no longer Plus-only** — available on Basic/Grow/Advanced/Plus
  (since 2025/2026). It gives authenticated **company profiles + B2B catalogs**: logged-in
  business buyers see wholesale pricing; retail buyers see standard prices — on one store.
  **Prefer this over tag/app hacks.** Confirm it's enabled on the client's Basic plan.
- **VAT / ΦΠΑ (Greece-only):** every order pays Greek ΦΠΑ (24%). No EU cross-border
  reverse-charge (domestic only) ⇒ **you do NOT need Shopify Tax's VIES tax-removal**.
  The VAT number (ΑΦΜ) is just the **credential proving a buyer is a real business**
  eligible for wholesale. Validate at registration (format + manual ΑΑΔΕ lookup; VIES only
  for format). Tax is identical for everyone; wholesale = lower **net** per-case prices.
- **Hiding wholesale pricing (access gating)** is separate from VAT validation. Options:
  native B2B catalogs (preferred, if plan has it), customer-tag + theme logic, or a gating
  app (Wholesale Lock Manager [free tier], Sami B2B Lock, B2Bridge). Pick the cheapest
  reliable fit — and note: tag/app gating assumes a **Shopify-hosted theme**, which this
  **static GitHub Pages frontend does not get automatically**.

## The architecture decision — RECOMMENDED: (A) Hybrid
Because wholesale gating + native B2B + registration-approval all live in Shopify's hosted
storefront, and rebuilding VAT-gated wholesale on a static headless frontend via the
Storefront API is significant, fragile custom work:

- **(A) Hybrid — recommended.** Keep this static GitHub Pages site for **B2C + marketing**.
  Run the **B2B / wholesale portal on the Shopify-hosted storefront** (e.g.
  `shop.cellark.gr`) where native B2B + ΑΦΜ-approval + gating all work natively. Retail
  buyers stay on the static site; business buyers log in on Shopify; link the two cleanly.
- **(B) Full headless.** Everything on the static site via Storefront API + customer auth +
  B2B company context. More control, much more work, easy to get wrong on money/tax.
  Justify carefully before choosing — not recommended for a solo non-expert build.

### B2C flow (static site)
Single-bottle add-to-cart in the existing drawer → Shopify **cart permalink** /
Storefront checkout. Fill `assets/shop-config.js` with store domain + per-bottle variant
IDs. Guard against blank variant IDs (don't drop bottles). Checkout happens on Shopify
(PCI-compliant) — we never handle card data.

### B2B flow (Shopify-hosted)
Register → ΑΦΜ validated (format + ΑΑΔΕ) → owner approves + tags / assigns to a Company →
buyer logs in and sees per-case **wholesale** pricing, hidden from everyone else. The
static site's "Λογαριασμός χονδρικής / Open a trade account" links to this portal.

## Tokens — where they live
- **Storefront API token** (public, scoped) → MAY appear in frontend code. ✅
- **Admin API keys / admin login** → NEVER in this public repo or frontend. ❌
  Anything in the admin: give the owner click-by-click steps.

## Ordered checklist — who does what
**Owner (in Shopify admin):**
1. Confirm Shopify Basic active; turn on **B2B** (companies/catalogs).
2. Activate **Shopify Payments** (legal name, ΑΦΜ, IBAN, ID).
3. Create products: single bottles + case variants; set retail + wholesale (catalog) prices.
4. Configure **tax** (Greek ΦΠΑ 24%) and **shipping** zones/rates (incl. COD, islands).
5. Buy / connect domain; set up `shop.cellark.gr` (or chosen subdomain) for the B2B portal.
6. Generate a **Storefront API access token** and send it to Romanos (public/scoped only).

**Romanos (in code):**
1. Fill `assets/shop-config.js` (domain + variant IDs + B2B portal URL).
2. Wire B2C add-to-cart → Shopify checkout (Phase 3).
3. Point the trade-account CTA at the Shopify B2B portal (Phase 4.5).
4. Keep wholesale pricing out of all public/static code.

> Background research (verify, may be dated): `docs/SHOPIFY_SETUP.md`,
> `docs/PAYMENTS_GREECE.md`, `docs/PAYMENTS_RESEARCH_2026.md`, `docs/READY-FOR-SHOPIFY.md`,
> `docs/CEO-CHECKLIST.md`.
