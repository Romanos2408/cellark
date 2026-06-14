# COMPLIANCE.md — legal / safety / security checklist

**You are NOT a lawyer.** Implement what you safely can; clearly mark what the
**client or a lawyer must verify**. Never invent legal terms or business identifiers.
Context: alcohol e-commerce, **ships within Greece only**, EL/EN.

## 1. GDPR cookie consent — DONE (2026-06-14)
- ✅ `assets/consent.js` — EL/EN bottom bar, **Accept / Essential-only** (no pre-ticked boxes,
  reject equal-prominence), persists `cellark.consent`, **re-openable** (footer "Cookies" link +
  a manage control on privacy.html). On all content pages (index/catalog/privacy/terms/returns;
  404 is a standalone page).
- ✅ No non-essential scripts load before consent — there are **none** (no analytics yet). Any
  future analytics MUST check `window.CellarkConsent.has('analytics')` and re-check on the
  `cellark:consent` event before loading.

## 2. Cookie / script audit — current as of 2026-06-14
**The static site sets NO cookies and makes ZERO third-party requests.** It uses only
first-party `localStorage`; web fonts are self-hosted. Cookies appear only on Shopify's own
checkout domain (governed by Shopify).

| Item | Where | Purpose | Essential? | Consent needed? |
|---|---|---|---|---|
| Fonts (Fraunces/Spectral/Inter) | **self-hosted** `assets/fonts/` | Typography | Essential (1st-party) | No (no 3rd party) |
| `localStorage` `cellark.cart` | site | Basket contents | Essential | No |
| `localStorage` `cellark.lang` | site | EL/EN choice | Essential | No |
| `localStorage` `cellark.ageConfirmed` | site | 18+ gate state | Essential | No |
| `localStorage` `cellark.consent` | site | Consent record | Essential | No |
| Cart permalink → checkout | Shopify domain | Commerce / payment | Essential | No (essential) |
| Shopify checkout cookies | Shopify domain | Checkout/session | Essential | Governed by Shopify |
| _(future)_ Analytics (GA4/Clarity) | — | Metrics | No | **Yes — gate via `CellarkConsent.has('analytics')`** |
> Update this whenever you add a script, embed, pixel, or font. No analytics/pixels exist today.

## 3. Age verification (18+) — site DONE; checkout = owner
- ✅ Reviewed `assets/age-gate.js`: first-visit 18+ modal, EL/EN, focus-trap + roving Tab,
  reduced-motion aware, "Yes 18+" persists / "No" → farewell card. Solid. (It's a UX gate, not
  a security control — real verification belongs at checkout / delivery.)
- ✅ Site messaging present: footer "Πώληση μόνο σε ενήλικες / Sales to adults only" +
  "Απολαμβάνετε υπεύθυνα"; age-gate states "18+" and "enjoy responsibly".
- ⬜ **OWNER (in Shopify):** add an 18+ confirmation + responsible-drinking note at checkout, and
  arrange **ship-to-adult / ID-on-delivery** with the courier (esp. for COD).

## 4. VAT / ΦΠΑ — owner configures, we display
- Greek ΦΠΑ **24%** on wine, included in retail prices. Domestic-only ⇒ **no reverse-charge**
  exemption; wholesale = lower net price, not tax removal (see SHOPIFY.md).
- Shopify computes tax once the **owner sets the rates** — flag that as an owner action.
  Verify prices display correctly (incl. VAT) on site + checkout.

## 5. Legal pages — scaffold exists, real values MISSING
Pages exist (`privacy.html`, `terms.html`, `returns.html`) but the footer imprint is
placeholder. You may draft plain-language structure; **never invent** the values below.
**Needed from the client (leave marked `[—]` placeholders until provided):**
- Legal trading name (νόμιμη επωνυμία)
- **ΑΦΜ** (VAT no.) · **ΓΕΜΗ** (registry no.) · **ΔΟΥ** (tax office)
- Registered address (have: Μεγάλου Αλεξάνδρου 27, Χρυσούπολη 64200 — confirm it's the legal one)
- Returns/withdrawal terms (Greek consumer law: 14-day right of withdrawal — confirm).
Required pages: Privacy (Απορρήτου), Terms of Sale (Όροι), Returns/Withdrawal
(Επιστροφές), Cookies policy, imprint in footer.

## 6. Security
- **Public repo:** no secrets, admin tokens, passwords, `.env`. **Storefront token only**
  in frontend (see SHOPIFY.md). Admin actions → owner does them in admin.
- Checkout happens on **Shopify (PCI-compliant)** — we never touch raw card data.
- HTTPS everywhere (GitHub Pages / custom domain). No secrets in client-side code.
- ✅ **2026-06-14 hardening:** **Content-Security-Policy** meta on all main pages
  (`default-src 'self'`; no external scripts/styles/fonts/connections — everything self-hosted);
  browser-verified it doesn't break the site. **`noindex, nofollow`** on all pages + the QR
  catalogue to keep the preview out of search until launch — **REMOVE the noindex tags when going
  live on `cellark.gr`** (each is marked with a `LAUNCH` HTML comment). Public **wholesale prices
  removed** from `catalogue/wines.json` (see PLAN 4.6).
- ✅ **2026-06-14:** the QR catalogue (`catalogue/`) fonts are now **self-hosted too** (Playfair +
  Inter → `catalogue/assets/fonts/`), Google Fonts removed, and a **CSP added** there. The entire
  site — main pages **and** catalogue — now makes **ZERO third-party requests**.

## 7. ⚠️ Client / lawyer MUST verify (do NOT mark "done")
- [ ] Client is **licensed** to sell/ship wine to consumers in Greece.
- [ ] **Distance-selling** rules + any **excise / duty (ΕΦΚ)** obligations for wine.
- [ ] Shipping/age restrictions by region; courier handling of alcohol + COD.
- [ ] The **privacy policy / terms / returns are legally valid** (lawyer review).
- [ ] **myDATA** e-invoicing set up with the accountant's πάροχος (deadline 1 Oct 2026).
- [ ] Correct legal identifiers (ΑΦΜ / ΓΕΜΗ / ΔΟΥ / legal name).
