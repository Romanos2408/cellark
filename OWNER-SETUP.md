# OWNER-SETUP.md — Shopify go-live setup (owner ↔ Romanos)

> **Purpose:** everything the **business owner** must do inside the Shopify admin to turn the
> store on, plus exactly **what to send back to Romanos** so the website's "pay by card"
> button starts working. Romanos cannot do these steps — they need the owner's admin login.
> Supersedes the older `docs/CEO-CHECKLIST.md` / `docs/READY-FOR-SHOPIFY.md` (background only).

**Audience:** the owner does **Part A** (in Shopify admin); sends **Part B** to Romanos;
Romanos does **Part C** (in code). Greek terms are given where the Shopify admin or Greek
law uses them.

---

## 🔐 Read first — security rules (do not skip)
- **Never share your Shopify admin password or "Admin API" keys** with anyone, or put them in
  email/chat. The website only ever needs the **Storefront API token** (Part A, step 7) — that
  one is *publishable* (safe to live in public website code). Everything else stays in your
  admin.
- **Money & domain are funded by you.** This whole setup uses **only free / already-included
  features** — no paid add-on apps. If at any step Shopify asks you to **pay for an app or
  upgrade your plan**, **STOP and tell Romanos first** so we can confirm it's necessary and
  find the cheapest route.
- This store **ships within Greece only** and sells alcohol (**18+**). Tax is Greek **ΦΠΑ 24%**.

---

## Part A — What the OWNER does in the Shopify admin

Work top to bottom. Each step gives the **menu path** in `admin.shopify.com`.

### A1. Confirm the plan is active
**Settings → Plan.** Confirm it shows **Basic** (or higher) and **active** (not "frozen"/trial
expired). ✅ This is PLAN item 2.1.

### A2. Turn on B2B (wholesale company accounts) — *confirm it's available on your plan*
We want **native Shopify B2B** so logged-in business buyers see wholesale prices and nobody
else does — no extra paid app.

1. **Settings → Customer accounts** → make sure **"New customer accounts"** is enabled.
2. Look for **B2B / Companies**: **Customers → Companies** in the left menu, **or**
   **Settings → Customer accounts → B2B**.
   - **If you can create a Company / B2B catalog → great, it's available.** Proceed.
   - **If Shopify says B2B needs a higher plan (e.g. asks you to upgrade) → STOP. Tell
     Romanos the exact message.** We'll decide between (a) upgrading vs (b) a free wholesale
     "lock" alternative — **do not upgrade or install anything yet.**
3. Don't build the wholesale catalog yet — we'll set per-case wholesale pricing together in
   **Phase 4**. For now we only need to know B2B is *available*. ✅ PLAN item 2.1.

### A3. Activate Shopify Payments (so cards work, no third-party surcharge)
**Settings → Payments → Shopify Payments → Complete account setup.** You'll need:
- **Legal business name**, **ΑΦΜ** (VAT number), business address.
- **IBAN** (bank account for payouts).
- **ID** of the business owner (identity verification).
> Use **Shopify Payments** (not a third-party gateway) — it's live in Greece and avoids the
> ~2% extra fee. If it asks you to also enable a paid gateway, you don't need to. ✅ Owner-blocker.

### A4. Import the 13 wines (one click — file is ready)
The product file is already prepared: **`docs/shopify-products.csv`** (13 bottles, Greek+English
descriptions, **retail prices**, photos). Ask Romanos to send it to you, then:

1. **Products → Import.**
2. **Add file →** choose `shopify-products.csv` → **Upload and continue** → **Import products**.
3. After import, open a couple of products and check: title, **price**, photo, and the
   description look right. Prices are the **retail (incl. ΦΠΑ)** prices from your price list.
4. Leave **inventory** as you prefer (the file doesn't force stock counts).
> This is the **retail / single-bottle** catalog only. **Wholesale per-case pricing is NOT in
> this file** (on purpose — it must never be public) and goes into the B2B catalog in Phase 4.
> ✅ PLAN item 2.2 (B2C half).

### A5. Set up tax — Greek ΦΠΑ 24%
**Settings → Taxes and duties → Greece (Ελλάδα).**
- Confirm the **standard rate = 24%**.
- **Settings → Taxes → "All prices include tax"** → **ON** (Greek retail prices are shown
  VAT-inclusive). The CSV prices already include ΦΠΑ, so this keeps them displaying correctly.
✅ Feeds PLAN item 5.4.

### A6. Set up shipping (Greece only)
**Settings → Shipping and delivery.**
- **Shipping zone:** create/keep **Greece only** (delete or leave empty any "Rest of world").
- Add your **courier rates** (flat or weight-based — bottles are ~1.2 kg each in the file).
- **Cash on delivery (αντικαταβολή):** **Settings → Payments → Manual payment methods → Cash
  on Delivery** if you offer it; add the COD fee in shipping.
- Consider **island zones** (different rate) and a **free-shipping threshold** if you want one.
- Note your **breakage/returns** policy (we'll put it on the site's returns page).
> Decisions to make here (send to Romanos too): courier, rates, COD fee, free-shipping
> threshold, island handling, breakage policy. ✅ Owner-blocker.

### A7. Create the Storefront API token (this is the one Romanos needs)
This token lets the **website's basket** hand the order to your secure Shopify checkout.

1. **Settings → Apps and sales channels → Develop apps.**
   - If you see *"Allow custom app development"*, click it and confirm (one-time).
2. **Create an app** → name it e.g. **`Cellar-K Website`** → **Create app**.
3. Open the app → **Configuration → Storefront API → Configure** (or **API scopes** tab).
4. Tick these **Storefront** scopes (read-only is enough for checkout links):
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts` (and `unauthenticated_read_checkouts`)
   - `unauthenticated_read_selling_plans` *(if shown — optional)*
5. **Save** → **Install app**.
6. Open **API credentials** → copy the **Storefront API access token** (a long string).
   - ⚠️ This is the **Storefront** token — the only one that's safe to share. **Do NOT** copy
     the *Admin API access token* / *API secret key*; those stay private.
✅ PLAN item 2.3.

---

## Part B — What the OWNER sends back to Romanos

Send these (the Storefront token is publishable, so email/chat is fine; still, don't post it
publicly):

1. **Store domain** — looks like `yourstore.myshopify.com` (top of any admin page / Settings →
   Domains).
2. **Storefront API access token** — from step A7.6.
3. **The 13 product/variant IDs** — easiest: **Products → Export → "All products" → CSV for
   Excel**, send Romanos that export (it contains the IDs). *Or* add Romanos as **staff**
   (**Settings → Users and permissions → Add staff**) and he'll read them directly.
4. **Trade login URL** (for later) — usually `https://yourstore.myshopify.com/account/login`.
5. **Shipping decisions** from A6 (courier, rates, COD fee, free-ship threshold, islands,
   breakage).
6. **Legal details for the website footer & legal pages** (required, must be real — never
   invented): **legal name, ΑΦΜ, ΓΕΜΗ, ΔΟΥ, registered address.**

---

## Part C — What ROMANOS does in code (after Part B lands)

1. Fill **`assets/shop-config.js`**: `domain`, the 13 `variants` IDs, `tradeLoginUrl`.
   (Storefront token goes wherever the checkout call needs it — publishable, fine in frontend.)
   → PLAN item **2.5**.
2. Wire **B2C add-to-cart → Shopify checkout** (cart permalink), with the existing guard that
   refuses to build a partial checkout if any variant ID is missing. → **Phase 3**.
3. Point the **"trade account / χονδρική"** CTA at the Shopify B2B portal. → **Phase 4.5**.
4. Keep **wholesale pricing out of all public code**. → hard rule / Phase 5.6.

---

## Architecture we're building toward (for context — recommended in SHOPIFY.md)
**Hybrid:** this static site stays the **B2C + marketing** front door (single-bottle checkout
hands off to Shopify's secure, PCI-compliant checkout); the **wholesale/B2B portal runs on
Shopify's own hosted storefront** (e.g. `shop.cellark.gr`) where native B2B + ΑΦΜ approval +
price-hiding all work natively. Retail buyers never see wholesale prices. *(If the owner
prefers a different split, raise it before Phase 4.)*

---

### Quick status map → PLAN.md
| PLAN item | What | Who | Unblocked by |
|---|---|---|---|
| 2.1 | Plan active + B2B available | Owner | A1, A2 |
| 2.2 | Create products (B2C single bottles) | Owner | A4 (CSV import) |
| 2.3 | Storefront API token | Owner | A7 |
| 2.4 | Lock Hybrid architecture | Owner sign-off | this doc |
| 2.5 | Fill `shop-config.js` | Romanos | Part B |
