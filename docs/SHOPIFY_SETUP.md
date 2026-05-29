# Cellar·K — Shopify + Shopify Payments setup plan

Decision (2026-05-29): **Shopify Basic + Shopify Payments** (no Stripe → avoids the 2%
third-party surcharge). Retail (λιανική) = guest checkout; wholesale (χονδρική) = approved
company accounts with net price list. VIES/ΑΦΜ verification + Greek myDATA invoicing via apps.

---

## What ONLY you can do (I can't, for security)
- Create the Shopify account.
- Activate **Shopify Payments** (requires business details, bank account, ID).
- Install/authorize paid apps (billed to your account).
- Connect/buy the domain.

I CAN: prepare the product import file, configure the storefront/theme, embed it into this
site, set up the B2B catalog structure, and walk you through every screen.

---

## Step-by-step

### 1. Account & plan
- Sign up at shopify.com → choose **Basic**.
- Store settings: country **Greece**, currency **EUR**, default language **Greek** (+ English).

### 2. Shopify Payments (cards)
- Settings → Payments → activate **Shopify Payments** (business + bank + ID).
- Also add **Manual payment method → "Αντικαταβολή / Cash on delivery"** (Greece essential).
- Optional: bank transfer / IRIS as manual methods.

### 3. Products (~13 wines)
- I can generate a **Shopify product CSV** from the existing `assets/wines.js` (name,
  description GR/EN, category, 750ml, photos) so you bulk-import instead of typing 13 by hand.

### 4. Wholesale (B2B) — no Shopify Plus needed (2026)
- Create a **B2B catalog** with the wholesale **net price list** (lower prices).
- Create **company accounts**; only approved companies see/buy wholesale.
- Retail customers keep normal guest checkout at retail prices.

### 5. Verification + invoicing apps
- **Euro B2B Smart Hub** (~$29–49/mo): validates VAT (ΑΦΜ) via **VIES**, dual pricing.
- **myData Comply** (~$9.99/mo): submits receipts/invoices to **ΑΑΔΕ myDATA**.
- Confirm with your **accountant** which myDATA/ΥΠΑΗΕΣ provider they prefer.

### 6. Domain + connect to this site
- Point a domain (e.g. cellark.gr) per the integration choice below.

---

## Integration with this custom site (the fork)

**A) Keep this site as the brand front + Shopify for the actual shop (recommended).**
   This bespoke site stays the landing/story/catalog showcase; a "Shop / Κατάλογος" button
   links to the Shopify store (e.g. shop.cellark.gr) which handles retail checkout AND the
   wholesale login/approval/pricing. Optionally embed **Buy Buttons** here for quick retail adds.
   ✅ Keeps the custom design, ✅ full B2B, ➖ two surfaces to manage.

**B) Move the whole storefront into Shopify.**
   Rebuild this look as a Shopify theme. ✅ one place, ✅ full B2B, ➖ lose/rebuild the bespoke feel.

**C) Headless (Shopify backend + this site via Storefront API).**
   ✅ full custom design + Shopify engine, ➖ most development + maintenance.

---

## Greek notes
- **Domestic Greek B2B is NOT VAT-exempt** — invoices still carry ΦΠΑ; "wholesale" = a lower
  net price list. VIES reverse-charge applies to **cross-border EU** B2B only.
- **Αντικαταβολή** = a manual payment method + your courier (ACS/Speedex/ELTA).
- Keep the **age-confirmation** step for alcohol.

## Indicative monthly cost
Shopify Basic (~$39) + Euro B2B Smart Hub ($29–49) + myData Comply ($9.99) ≈ **$78–98/mo**,
plus Shopify Payments card fees (no third-party surcharge). Confirm exact EUR figures on the
live Shopify Greece pricing page.
