# Cellar·K — Online payment options (Greece)

A shortlist to review later, for turning the basket into **real card payments**.
The site already has a working **enquiry basket** (add-to-cart, Λιανική/Χονδρική,
checkout by email/WhatsApp). To accept card payments you need three pieces:
**(1) a store/checkout, (2) a payment processor, (3) legal invoicing (myDATA).**

> ⚠️ Indicative pricing only — confirm current fees on each provider's site.
> Accounts must be opened by the business owner (bank/ΑΦΜ details required).

---

## 1. Store / checkout platform

| Option | What it is | Ease | Indicative cost | Notes |
|---|---|---|---|---|
| **Shopify** | All-in-one hosted shop | ★★★★★ easiest | ~€27+/mo + card fees | Greek language, built-in **cash-on-delivery**, retail vs wholesale via customer groups / a B2B app. Can stay behind this site via **"Buy Button"** embed. |
| **Shopify Buy Button** | Embed Shopify cart/checkout into THIS site | ★★★★ | Shopify plan | Keep the custom design; Shopify handles cart + secure checkout. **Recommended if we keep this site.** |
| **Ecwid (by Lightspeed)** | Embeddable store widget | ★★★★ | Free tier → paid | Drops into a static site; decent free plan. |
| **Snipcart** | Cart/checkout for static sites | ★★★ | 2% of sales (min ~$13/mo) | Made for sites like this; you add HTML attributes. COD weaker than Shopify. |
| **WooCommerce** (WordPress) | Self-hosted shop | ★★ more technical | hosting + plugins | Cheapest long-term, most upkeep; would replace this static setup. |
| **Wix / Squarespace** | Hosted website + shop | ★★★★ | ~€17–35/mo | Easy, but you'd rebuild the design in their editor. |

## 2. Payment processor (the card gateway)

| Option | Notes |
|---|---|
| **Viva.com (Viva Wallet)** | Greek-founded, popular with GR SMBs, low fees, fast onboarding with a Greek ΑΦΜ, supports installments (δόσεις). Integrates with Shopify/WooCommerce. **Top pick for Greece.** |
| **Stripe** | Excellent developer support, works in Greece, clean checkout. Slightly less "local" than Viva. |
| **Greek bank e-commerce gateways** | Alpha, Eurobank, NBG (Εθνική), Piraeus — via Cardlink/Nexi/Everypay. Reliable, support Greek installments; onboarding through your bank. |
| **Everypay / Mollie** | Greek/EU-friendly processors that plug into the platforms above. |

## 3. Cash on delivery (αντικαταβολή)

Still the **most-used** method in Greece. Handled at the **courier** level, not the card gateway:
ACS, Speedex, Geniki Taxydromiki, ELTA Courier. Shopify/Woo support it as a payment method out of the box.

## 4. Legal / compliance (don't skip)

- **myDATA / ΑΑΔΕ** e-invoicing is mandatory — use an invoicing app that issues legal receipts automatically (e.g. Elorus, Timologic, or your accountant's tool) and connects to the shop.
- **ΦΠΑ (VAT):** retail prices include VAT; wholesale (B2B) typically excludes it — the platform must support both price lists / a B2B group.
- **Alcohol:** keep an **age-confirmation** step (already on the site) and check courier/processor rules for alcohol.
- Terms of sale, returns policy, GDPR/cookies page.

---

## Recommended path (easiest, keeps this site)

1. **Shopify** account → add products + two price lists (retail / wholesale).
2. **Viva.com** as the card processor (+ enable αντικαταβολή via your courier).
3. A **myDATA** invoicing app for legal receipts.
4. Keep **this site** as the brand/landing experience and embed Shopify's **Buy Button**
   so "Add to basket → checkout" uses Shopify's secure payment — the design stays ours.

When you've opened the Shopify + Viva accounts, I can wire the current basket to that
checkout. Until then, the email/WhatsApp enquiry basket keeps you taking orders today.
