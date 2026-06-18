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

> **📍 Where we are (June 2026):** ✅ products imported, ✅ legal details (name/ΑΦΜ/ΓΕΜΗ/ΔΟΥ/address)
> received & on the site, ✅ variant IDs wired, ✅ card checkout coded & verified handing off to a real
> Greek Shopify checkout. **The ONE remaining unlock to take real money is A3 — activate Shopify Payments.**
> A7 (Storefront token) is **not needed**. So: do **A3**, plus **A5** (ΦΠΑ 24%) and **A6** (shipping) for a
> complete go-live, then message Romanos.

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

### A3. Activate Shopify Payments — **the launch unlock** ⭐ (click-by-click)
This is the one thing standing between us and taking real card payments. Use **Shopify Payments**
(not a third-party gateway) — it's **live in Greece** and avoids the ~2% extra fee. Tick each box.

**① Gather these first** (Shopify runs an identity + business check):
- [ ] Legal name: **ΚΑΠΠΑΣ ΒΑΣΙΛΕΙΟΣ** (ατομική επιχείρηση / sole proprietor)
- [ ] **ΑΦΜ 171189566** · **ΔΟΥ Καβάλας** · έδρα **Μεγάλου Αλεξάνδρου 27, Χρυσούπολη 64200**
- [ ] Owner's full name, **date of birth**, and a photo **ID** (ταυτότητα ή διαβατήριο) — identity
      check (KYC), stays private inside Shopify. *(This is what the **16/02/2001** you sent is for —
      it goes here, not on the website.)*
- [ ] Greek business **IBAN** (in the business name) — for payouts
- [ ] One-line product description: *"Retail sales of wine"* (category: **Food & drink → Alcohol**)

**② Plan must be active first.** **Settings → Plan** — Shopify Payments can be *set up* on a trial,
but to actually **charge customers** the store must be on an **active paid plan** (Basic is enough).
👉 *This is the only money decision here — you fund it. If anything else asks you to pay, STOP and tell Romanos.*

**③ Activate (Shopify admin → `admin.shopify.com`):**
- [ ] 1. **Settings → Payments.**
- [ ] 2. Under **Shopify Payments**, click **Activate Shopify Payments** (or **Complete account setup**).
- [ ] 3. **Business details:** type = **Sole proprietor / ατομική επιχείρηση**; legal name, ΑΦΜ,
      registered address; product category = **Food & drink → Wine/Alcohol**.
- [ ] 4. **Personal details:** owner's full name, **date of birth**, home address (KYC).
- [ ] 5. **Payout bank account:** add the **IBAN**.
- [ ] 6. **Customer statement descriptor** (what shows on the buyer's card statement): e.g. **`CELLAR K`**.
- [ ] 7. **Submit.** Shopify verifies — usually quick; it may ask for a document (ID / business proof).
      When **Settings → Payments** shows Shopify Payments **Active**, cards (Visa/Mastercard) + Apple Pay /
      Google Pay are live. *If it offers to also enable a paid third-party gateway, you don't need it.*

**④ Two Greece must-dos before going live:**
- [ ] **ΦΠΑ 24%** set (see **A5**).
- [ ] **Storefront password OFF** — **Settings → (theme) → password protection** off, so customers can
      reach checkout. *Keep it ON until you're ready; turn it off the moment we go live.*

**⑤ Alcohol compliance at checkout** *(COMPLIANCE.md §3):*
- [ ] Add an **18+ / drink-responsibly notice** at checkout (and/or on the cart page). Copy-paste:

  > **EL:** «Η πώληση αλκοολούχων ποτών επιτρέπεται μόνο σε ενήλικες άνω των 18 ετών. Με την
  > ολοκλήρωση της παραγγελίας δηλώνετε ότι είστε άνω των 18 ετών. Ενδέχεται να ζητηθεί ταυτότητα κατά
  > την παράδοση. Απολαμβάνετε υπεύθυνα.»
  >
  > **EN:** "The sale of alcoholic beverages is permitted only to adults aged 18 and over. By completing
  > your order you confirm that you are over 18. Proof of age may be requested on delivery. Please drink
  > responsibly."

  *Where:* **Settings → Checkout** (a checkout notice / additional content field), or on the **cart page**,
  or the **order-confirmation** text. A *hard* age-confirmation checkbox at Shopify checkout needs a **paid
  app** — **don't install one**; the website already does the 18+ gate before checkout, so this clear notice
  is enough. *(Short version if space is tight: «Μόνο για ενήλικες 18+. Απολαμβάνετε υπεύθυνα.» / "Adults
  18+ only. Please drink responsibly.")*
- [ ] Tell your **courier**: deliver to an **adult / ID on delivery**, especially for COD (αντικαταβολή).

**⑥ Then just message Romanos: _"Payments active + password off."_**
Nothing to send — the website's card checkout uses **cart permalinks**, which need only the store
domain + variant IDs (both already wired). Romanos then runs a **real test purchase** (EL + EN, mobile +
desktop) to confirm payment, tax, and the age note. ✅ Unblocks **PLAN 3.3**.

> *Optional (your call):* the website already caps **500 bottles per item**. If you also want Shopify to
> enforce a hard ceiling server-side, set a **maximum purchase quantity** per product (Products → variant
> → quantity rules). Not required.

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

### A7. Create the Storefront API token — ⏭️ **SKIP for now (not needed)**
> ℹ️ **Not required for the current card checkout.** The website's basket hands off via **cart
> permalinks**, which need only the store **domain + variant IDs** — both already wired by Romanos.
> You'd only need this token if we later move to an in-page (AJAX) cart. **Skip this — go do A3 (Payments).**
> *(Steps kept below for that future case.)*

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
