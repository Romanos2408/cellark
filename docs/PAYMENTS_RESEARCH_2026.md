# Cellar·K — Payment platform research (2026)

Comparison of three shop setups for a small Greek wine importer (~13 products,
retail + wholesale) committed to **Stripe**, with **VIES-based wholesale verification**.
Researched 2026-05-29 across 27 sources; 23 claims verified, 2 refuted.

> ⚠️ Prices are time-sensitive 2026 figures — confirm on the live pages before committing.

## Cost comparison (small shop, low volume)

| | Shopify + Stripe | WooCommerce + Stripe | Custom + Stripe |
|---|---|---|---|
| Platform | Basic ~$39/mo (~$29 annual) | Hosting+domain+SSL ~€10–30/mo | Hosting ~€5–20/mo |
| Wholesale/B2B | Built in (no Plus needed) | WholesaleX free (Pro $129/yr) | custom-built |
| VIES check | Euro B2B Smart Hub $29–49/mo | EU VAT Guard (free) | custom (VIES API) |
| myDATA invoicing | myData Comply $9.99/mo | WooMyData ~€50–99/yr + Timologio €109 once | custom |
| Card fees | Stripe 1.5%+€0.25 **+ Shopify 2% surcharge** | Stripe 1.5%+€0.25 (no surcharge) | Stripe 1.5%+€0.25 (no surcharge) |
| ≈ Total software | ~$75–100/mo + ~3.5%/sale | ~€15–40/mo + 1.5%/sale | ~€5–20/mo + 1.5%/sale |
| Setup / upkeep | Lowest | High (WordPress upkeep) | Highest (all custom) |

## Stripe fees (Greece, verified stripe.com/gr)
- Standard EEA cards: **1.5% + €0.25**
- Premium EEA cards: **1.9% + €0.25**
- Non-EEA/international cards: **+1.5%**
- Currency conversion: **+1%**
- Stripe Checkout: included, no extra fee

## Key findings
1. **Shopify B2B no longer requires Shopify Plus** (April 2026): company accounts,
   wholesale price tiers, payment terms, up to 3 catalogs on Basic/Grow/Advanced at no extra cost.
   (help.shopify.com/.../b2b/getting-started/plan-features)
2. **Shopify Payments is now live in Greece.** Using **Stripe instead** of Shopify Payments
   inside Shopify triggers a **third-party surcharge** (~2.0% Basic / 1.0% Grow / 0.6% Advanced)
   ON TOP of Stripe's fees → effective ~3.5% on Basic. Shopify Payments avoids it.
3. **Shopify add-ons:** Euro B2B Smart Hub ($29 Essential / $49 Pro) does VIES validation +
   dual pricing on non-Plus plans; myData Comply ($9.99/mo) submits to AADE myDATA.
   (Caveat: Euro B2B Smart Hub is immature — launched May 2025, some features "coming soon".)
4. **WooCommerce stack** can be near-free in software: official Stripe extension (free),
   WholesaleX (free role-based wholesale + registration form), EU VAT Guard (free VIES validation),
   Timologio (one-time €109 — ΑΦΜ via ΑΑΔΕ + VIES, invoice fields), WooMyData (~€50–99/yr myDATA).
   Lowest recurring cost, highest maintenance/security burden for a non-technical owner.

## Important corrections (verified)
- **Greek DOMESTIC B2B is NOT reverse-charge / VAT-exempt.** Reverse charge ("χωρίς ΦΠΑ")
  applies to **cross-border EU** B2B, validated by **VIES**. A **Greek** wholesale buyer's invoice
  **still carries ΦΠΑ**; "wholesale" = a lower **net price list**, not VAT exemption. Tool claims of
  automatic reverse-charge / dual pricing across the storefront were **REFUTED** in verification.
- Therefore **VIES is mainly relevant for non-Greek EU customers**. For Greek wholesale buyers the
  meaningful check is **ΑΦΜ validation via ΑΑΔΕ** (Timologio does this; VIES validates the number,
  AADE auto-fills company data).
- **Fully automatic wholesale account approval** via VIES was **not confirmed** — tools validate the
  number; a manual "approve" step may remain.
- **Cash-on-delivery (αντικαταβολή)** support was **not confirmed** for any option — verify before
  committing (it's heavily used in Greece).

## Recommendation
- **Lowest effort + full Greek compliance:** Shopify Basic + Euro B2B Smart Hub (VIES) +
  myData Comply (~$75–100/mo). **But reconsider Shopify Payments over Stripe** to avoid the 2% surcharge.
- **Lowest recurring cost (if comfortable with WordPress upkeep):** WooCommerce + WholesaleX +
  EU VAT Guard + Timologio + WooMyData (~€15–40/mo).
- **Custom + Stripe:** only if a specific need justifies it — highest build/maintenance burden.

## Open questions to resolve before building
- Confirm exact Shopify Basic price in EUR and whether Euro B2B Smart Hub bills in € or $.
- Confirm cash-on-delivery support + cost on the chosen platform.
- Confirm whether wholesale approval can be fully auto-gated on a VIES pass, or stays manual.
- Confirm Greek domestic-B2B net-price display works without falsely applying reverse charge.

### Primary sources
- Shopify B2B plan features — help.shopify.com/en/manual/b2b/getting-started/plan-features
- Shopify Payments Greece — help.shopify.com/en/manual/payments/shopify-payments/supported-countries/greece
- Shopify third-party transaction fees — help.shopify.com/.../third-party-transaction-fees
- Stripe Greece pricing — stripe.com/gr/pricing
- WooCommerce Stripe — woocommerce.com/products/stripe/
- WholesaleX — wordpress.org/plugins/wholesalex/
- EU VAT Guard — wordpress.org/plugins/eu-vat-guard-for-woocommerce/
- Timologio — dicha.gr/plugins/product/timologio-woocommerce/
- WooMyData — woomydata.gr
- myData Comply (Shopify) — apps.shopify.com/mydata-comply
- Euro B2B Smart Hub (Shopify) — apps.shopify.com/euro-b2b-smart-hub
