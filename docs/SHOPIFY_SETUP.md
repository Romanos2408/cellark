# Cellar·K — Shopify + Shopify Payments setup plan

Decision (updated 2026-05-30): **Shopify Basic + Shopify Payments** (no Stripe → avoids the 2%
third-party surcharge). Retail (λιανική) = guest checkout; wholesale (χονδρική) = approved
company accounts with net price list.

**Sells in Greece only → NO VIES.** VIES is for EU cross-border trade; domestic Greek wholesale
buyers often aren't even listed there. Verify wholesale ΑΦΜ via the **ΑΑΔΕ registry** instead,
and **skip the VIES app** (saves ~$29–49/mo). myDATA invoicing goes through the accountant's
**πάροχος**, not a standalone app.

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

### 5. Wholesale ΑΦΜ verification (Greece-only)
- **Skip VIES / the VIES app** — not relevant for domestic-only sales.
- **Start manual:** when a wholesale account applies, check the ΑΦΜ in the **ΑΑΔΕ registry**
  (you or the accountant) before approving. The site already does a **checksum** pre-check.
- **Automate later (optional):** a connector calling ΑΑΔΕ's `RgWsPublic` web service
  (credentials are free to register on the ΑΑΔΕ site) to auto-fill the company name + confirm
  it's active at signup.

### 5b. myDATA invoicing — via the accountant's πάροχος
- Legal invoice issuance + transmission to **myDATA** goes through an accredited **πάροχος**
  (Epsilon Net / SoftOne / Elorus / Primer / etc.) or the accountant's software — **not** a
  standalone Shopify app.
- **Ask the accountant** which πάροχος they use; connect Shopify to **that** (or have them
  issue invoices from order exports). May cost **€0** extra if they already handle it.

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
- **Greece-only seller** — no intra-EU VAT, no VIES, no OSS, no cross-border shipping.
- **Domestic Greek B2B is NOT VAT-exempt** — invoices still carry **ΦΠΑ**; "wholesale" = a lower
  **net price list**, not a VAT exemption.
- **Αντικαταβολή** = a manual payment method + your courier (ACS/Speedex/ELTA).
- Keep the **age-confirmation** step for alcohol.

## Indicative monthly cost (lean, Greece-only)
- **Shopify Basic:** ~$29/mo (annual) – $39/mo (monthly) — *the only required cost*
- **Shopify Payments** card fees: ~1.5–2% per sale (no third-party surcharge); confirm exact GR rate
- **Domain:** ~€10–15/year
- **VIES app:** ❌ not needed (Greece-only)
- **myDATA app:** likely €0 — handled by the accountant's πάροχος

➡️ **Realistic start: ~$30/mo + card fees + domain.** Confirm exact EUR figures on the live
Shopify Greece pricing page. Pay annually for the lower rate; add automation later if wanted.
