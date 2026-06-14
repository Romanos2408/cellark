# COMPLIANCE.md — legal / safety / security checklist

**You are NOT a lawyer.** Implement what you safely can; clearly mark what the
**client or a lawyer must verify**. Never invent legal terms or business identifiers.
Context: alcohol e-commerce, **ships within Greece only**, EL/EN.

## 1. GDPR cookie consent — TODO
- Implement a proper consent banner: **accept / reject** non-essential, **no pre-ticked
  boxes**, equally easy to refuse as to accept. EL/EN parity.
- **Do not load analytics or any non-essential cookies/scripts before consent.** Gate them
  behind the banner's decision. Store the choice; allow changing it later.

## 2. Cookie / script audit — keep this table current
| Cookie / script | Purpose | Essential? | Consent needed? |
|---|---|---|---|
| Google Fonts (Fraunces/Spectral/Inter) | Typography | Functional | Self-host to avoid 3rd-party? (review) |
| Shopify checkout / cart | Commerce | Essential | No (essential) |
| (Analytics — GA4 / Clarity) | Metrics | No | **Yes — gate behind consent** |
| Age-gate state | 18+ gate | Essential | No |
> Update this whenever you add a script, embed, pixel, or font.

## 3. Age verification (18+) — partially done
- Site age-gate exists (`assets/age-gate.js`) — review copy + EL/EN + reduced-motion.
- Add "Πώληση μόνο σε ενήλικες / Sold to adults only" + "Απολαμβάνετε υπεύθυνα · 18+"
  messaging, including at/near checkout. Add the equivalent gate/notice in Shopify too.

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

## 7. ⚠️ Client / lawyer MUST verify (do NOT mark "done")
- [ ] Client is **licensed** to sell/ship wine to consumers in Greece.
- [ ] **Distance-selling** rules + any **excise / duty (ΕΦΚ)** obligations for wine.
- [ ] Shipping/age restrictions by region; courier handling of alcohol + COD.
- [ ] The **privacy policy / terms / returns are legally valid** (lawyer review).
- [ ] **myDATA** e-invoicing set up with the accountant's πάροχος (deadline 1 Oct 2026).
- [ ] Correct legal identifiers (ΑΦΜ / ΓΕΜΗ / ΔΟΥ / legal name).
