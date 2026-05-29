# Kappas — Invoicing & Greek Tax Compliance

**Goal:** every sale produces a legal document that's transmitted to the Greek tax authority (AADE) correctly — automatically, from the store.

> ⚠️ This is the one area with hard legal teeth and live deadlines. The plan below is a build/integration path, **not tax advice** — the owner's accountant signs off on what applies to *his* entity. Treat this doc as "what the system must do."

## The Greek landscape (as of 2026)
- **myDATA** has been mandatory since 2021: Greek businesses transmit income/expense and invoice data to AADE in real time, and invoices receive a unique id (MARK) + QR code.
- Greece is now phasing in **mandatory B2B e-invoicing** through myDATA. Phase 1 (businesses with 2023 revenue over €1 million) took effect 2 March 2026; Phase 2 — all remaining businesses, including small enterprises and sole proprietors — must comply from 1 October 2026, with a transitional period through 31 December 2026. A small winery like Kappas is almost certainly **Phase 2 → target 1 October 2026.**
- Domestic B2B and exports to non-EU businesses are in scope; for intra-EU B2B transactions, e-invoicing remains optional.
- Compliance is done either through a certified electronic-invoicing service provider, or the AADE's free tools (the timologio web app and the myDATAapp).

## What the site/system must do
- **B2C sales:** issue a compliant retail receipt/invoice and transmit to myDATA, with VAT shown correctly.
- **B2B sales:** issue a proper **invoice** (buyer's VAT number, line items, VAT or reverse-charge for intra-EU) and, once mandated, as a structured **e-invoice** cleared through myDATA (gets its MARK/UID before reaching the customer).
- **Credit notes / refunds** handled and transmitted too.
- **Archive** invoices per retention rules.

## Recommended path (WooCommerce route)
1. **Don't build invoicing from scratch.** Use a Greek invoicing integration — either a **WooCommerce plugin / connector that talks to myDATA**, or a **certified provider's** API that the store hands each order to. The accountant likely already has a preferred provider/ERP — integrate with *that*.
2. **Map the data:** ensure checkout collects what an invoice needs (for B2B: company name, VAT no., tax office/ΔΟΥ, address; for B2C: the basics).
3. **VAT setup:** correct Greek VAT rate on wine; reverse-charge logic for intra-EU B2B; remember the cross-border alcohol VAT/excise trap from `SITEMAP.md` (launch Greece-only).
4. **Wire the flow:** order paid → invoice issued → transmitted to myDATA → MARK/QR returned → document sent to customer + emailed/stored.
5. **Test** against the accountant's checklist; reconcile a week of test orders.
6. **Go live before the deadline** that applies to him (confirm phase with the accountant; plan for the 1 Oct 2026 date as the safe target).

## Build vs. buy vs. owner
- **Builder (you):** wire the store ↔ invoicing provider, ensure checkout captures invoice fields, test the flow.
- **Buy:** the certified provider / plugin (a running cost the owner pays).
- **Owner + accountant:** choose the provider, confirm which phase/obligations apply, own VAT/excise registration. **Put this split in writing.**

**Done when:** a B2C and a B2B test order each produce a compliant, myDATA-cleared document automatically, signed off by the accountant.
