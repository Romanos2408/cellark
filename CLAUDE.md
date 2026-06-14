# CLAUDE.md — Cellar·K conventions (load every session)

Cellar·K is a bilingual (EL/EN) static site for a Sicilian wine importer in Greece,
partnered with **Cantine Colosi**. Dark, editorial, premium. Hosted on GitHub Pages,
moving to a custom domain. This file is the standing brief; read it first each session.

## The canonical docs (single source of truth)
- **`PROJECT.md`** — what Cellar·K is, business model, goals, hard constraints.
- **`PLAN.md`** — the roadmap checklist. **This is our shared memory.** Tick items as done.
- **`SHOPIFY.md`** — payment/B2B integration design (Shopify Basic + native B2B).
- **`COMPLIANCE.md`** — legal/safety/GDPR/age-gate checklist + "client/lawyer must verify".
- **`DESIGN.md`** — luxury design + motion spec (vanilla, no heavy libs).
- Deep-dive references live in `docs/` (payments research, invoicing, analytics, audit).
  Treat the 6 root docs as canonical; `docs/` is background. `docs/TECH_STACK.md` is
  **stale** (says WooCommerce) — superseded by SHOPIFY.md.

## Stack & file layout
- Static HTML/CSS/JS, no build step. Pages: `index.html`, `catalog.html`,
  `privacy.html`, `terms.html`, `returns.html`, `404.html`. QR catalogue in `catalogue/`.
- Shared assets in `assets/`:
  - `styles.css` — all shared CSS (design tokens as CSS vars: ink, oxblood, gold, bone…).
  - `motion.js` — shared motion engine (being migrated to **vanilla + IntersectionObserver**).
  - `i18n.js` — EL/EN toggle (see below). `age-gate.js` — 18+ gate.
  - `cart.js` — basket + drawer (NOT yet wired to real payments).
  - `wines.js` — the 13 wines (data). `shop-config.js` — Shopify domain + variant IDs (to fill).
- Wine bottle images in `assets/wines/` (AVIF + PNG fallback). Photos in `assets/photos/`.

## Bilingual (EL/EN) — preserve parity in EVERYTHING you add
- Text uses `data-gr="…" data-en="…"` attributes; `i18n.js` swaps them on toggle.
  Default rendered language is Greek (EL). Aria labels use `data-aria-gr/-en`.
- Never add UI copy in one language only. If you add a string, add both.

## How to preview locally
```
python3 -m http.server 8013 --bind 127.0.0.1 --directory /Users/romanos/Desktop/Stelios/projects/Kappas
```
Then open http://127.0.0.1:8013 . (`.claude/launch.json` has this; `.claude/serve.py`
has a stale ROOT path — ignore it.) **Claude Preview note:** the preview tool can't read
files under `~/Desktop`; mirror the site to `/tmp` and serve from there if using it.

## Hard rules (do not break)
- **This repo is PUBLIC.** Never commit secrets, admin API tokens, passwords, `.env`.
  Only public/publishable tokens (Shopify **Storefront API** token) may appear in
  frontend code. If a secret is ever needed, STOP and explain safe storage instead.
- **Client's Shopify credentials are sensitive** — never put admin login / Admin API keys
  into this repo or frontend. Storefront token only. For anything inside the client's
  Shopify admin, give click-by-click steps for the owner to do it.
- **Client funds Shopify + domain.** Before any paid third-party app or new charge, STOP,
  give the cost + cheapest alternative, and let the owner decide.
- **Greece + alcohol:** ships **within Greece only**; needs 18+ age verification, Greek
  ΦΠΑ (24%), GDPR cookie consent, "adults only" messaging. Domestic-only ⇒ no EU
  reverse-charge; VAT number only proves a buyer is a real business (for wholesale). See
  COMPLIANCE.md. **Not a lawyer** — never invent legal terms or identifiers (ΑΦΜ, ΓΕΜΗ,
  ΔΟΥ, legal name); mark client/lawyer sign-off items clearly.
- **Don't break what works.** Keep the site functioning throughout; stage risky changes;
  test mobile + desktop, both languages.

## How we work
- **Plan first, build in small steps.** One PLAN.md item per turn unless told otherwise.
- **Ask before big decisions** (Shopify approach, larger design departures): 2–3 options
  with trade-offs + a recommendation.
- **Explain before risky changes** — anything touching money, checkout, customer data, or
  cart logic. You may change cart logic if needed; flag it first, keep it minimal.
- **Small, descriptive commits.** Nothing sensitive (public repo). Commit only when asked.

## ⏸️ Resume protocol
Long project, built across many sessions (owner is on a usage-limited plan — token/time
efficiency matters). After finishing any chunk: tick its PLAN.md checkbox, summarize what
changed, and end with one line: `NEXT: <next unchecked item>`. When the owner says
**"go on" / "continue" / "resume"**: re-read PLAN.md, find the first unchecked `- [ ]`,
state which one you're resuming, and continue. Do not restart or re-plan. PLAN.md is the
source of truth over memory. End chunks at a clean point — never mid-checkout.
