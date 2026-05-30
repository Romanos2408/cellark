# Cellar·K — Ready for Shopify (handoff checklist)

The site is now built to **hand the basket off to Shopify checkout**. Browsing +
add-to-basket happen here; **address/ΤΚ, ΑΦΜ/ΑΑΔΕ, and card payment happen in Shopify.**

## What's live now
- **Basket on the homepage AND catalog** — cart icon + count in the nav of both, add-to-basket on every wine.
- **Checkout button hands the cart to Shopify** via a cart permalink (card payment).
- Until the store is connected, the basket shows **"Το ηλεκτρονικό κατάστημα ανοίγει σύντομα."**
- **No email/WhatsApp checkout** anymore — it's card-only via Shopify, as requested.

## To switch it ON — fill `assets/shop-config.js`
Once the Shopify store exists, set three things (or send me the store and I'll do it):
1. `domain` → e.g. `cellark.myshopify.com` (or the custom domain once connected).
2. `variants` → each wine's Shopify **variant ID**. After importing `docs/shopify-products.csv`,
   get them from **Shopify → Products → Export**, or give me the store and I'll read them in.
3. `tradeLoginUrl` → Shopify customer login URL for wholesale accounts (optional).

The moment `domain` + variant IDs are set, the "Checkout — pay by card" button goes live.

## Email / invoice / confirmation — how it works
- **Customer** enters their email **at Shopify checkout** → Shopify auto-sends the **order
  confirmation/receipt**.
- **You** set a **store notification email** in Shopify → you get an email on every new order.
- **Legal invoice (τιμολόγιο/απόδειξη)** to **myDATA** comes from the accountant's **πάροχος**, not us.

## Retail vs wholesale (Greece-only)
- **Retail (λιανική):** guest checkout, prices incl. ΦΠΑ.
- **Wholesale (χονδρική):** customer signs into their **approved Shopify company account** to see
  wholesale net prices. Verify the **ΑΦΜ via ΑΑΔΕ** at approval (manual to start). **No VIES** (Greece-only).

## Don't-forget launch checklist (set up in Shopify)
- [ ] **Shipping** — courier rates + **αντικαταβολή (cash on delivery)** + island zones; breakage-safe packaging.
- [ ] **ΦΠΑ 24%** on wine configured correctly.
- [ ] **Age verification** (18+) on the Shopify store too (we have it on this site).
- [ ] **Legal pages**: Όροι Χρήσης, Πολιτική Απορρήτου (GDPR), **Πολιτική Επιστροφών/Υπαναχώρησης**, Cookies.
- [ ] **Business/tax**: registered επιχείρηση, ΓΕΜΗ, correct ΚΑΔ, any **alcohol-trade** licensing — confirm with accountant.
- [ ] **myDATA** invoicing wired through the accountant's πάροχος.
- [ ] **Domain** (cellark.gr): buy it, connect to Shopify, and link the "Shop" button from this site.
- [ ] **Store notification email** so you hear about orders.

## What I'll do once the store + domain exist
- Fill `shop-config.js` with the domain + variant IDs (or you paste them).
- Add a prominent **"Κατάστημα / Shop"** link from this site to the Shopify store.
- Help configure the **B2B wholesale catalog** + ΑΑΔΕ approval flow.
