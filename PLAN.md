# PLAN.md — Cellar·K roadmap (our shared memory)

Work **top to bottom, one item per turn** unless told otherwise. After each: tick its box,
summarize, write `NEXT:`. See CLAUDE.md → Resume protocol. `[~]` = in progress / partial.

Legend: `- [ ]` todo · `- [~]` partial · `- [x]` done.

---

## Phase 1 — Motion & Navigation (vanilla migration; free, no Shopify)
**Decision (2026-06-13): migrate fully OFF GSAP + Lenis + ScrollTrigger to vanilla JS +
IntersectionObserver.** The site currently depends on these vendored libs; Phase 1 removes
them while keeping (and refining) the look. See DESIGN.md for the spec.

- [x] 1.1 Add shared **motion tokens** to `styles.css`: one ease `cubic-bezier(0.16,1,0.3,1)`,
      duration vars (~400–800ms), reveal base classes (`.reveal` → fade + 8–24px rise).
      *(Done 2026-06-13: ease already existed as `--ease-out`; added `--dur-reveal/--dur-ui/
      --reveal-rise/--stagger`; hardened `.reveal` with token-driven timing, `--reveal-i`
      stagger, and a reduced-motion CSS net. GSAP-safe — no visual change yet.)*
- [x] 1.2 Rewrite `assets/motion.js` to **vanilla**: reveals via `IntersectionObserver`
      (`[data-up]`, `[data-hero]` staggered, eyebrows), nav condense-on-scroll (keep),
      progress bar + scroll-cue retire via a throttled scroll listener. Honor
      `prefers-reduced-motion` (show everything, no observers).
      *(Done 2026-06-13: reveals/nav/progress/cue now vanilla, one rAF scroll listener.
      Browser-verified — hero staggers via `--reveal-i`, scroll reveals + GSAP cards fire,
      no console errors. GSAP/Lenis intentionally KEPT for parallax (1.4), Lenis scroll
      (1.3) and the inline pinned story (1.5) — no `index.html` change. Note: dropped the
      subtle eyebrow letter-spacing "settle" — say the word to bring it back in CSS.)*
- [x] 1.3 Replace Lenis smooth-scroll: native `scroll-behavior:smooth` + JS anchor
      handling with header offset (drop the momentum engine).
      *(Done 2026-06-13: native `scroll-behavior:smooth` + `scroll-padding-top:80px` in
      styles.css; Lenis init removed from motion.js, `<script>` tags removed from both
      pages, `assets/vendor/lenis.min.js` deleted. Verified: no errors, `window.lenis`
      gone, reveals fire, `#story` anchor lands at 80px offset. Note: headless preview no
      longer paints continuously without Lenis's rAF — force frames / resize to QA visuals;
      real browsers are unaffected.)*
- [x] 1.4 Parallax in vanilla: light rAF scroll listener, `transform`-only, subtle — or
      simplify/remove if it can't stay smooth. Keep it barely-there.
      *(Done 2026-06-13: `initParallax()` in motion.js, rAF-throttled, `translateY(%)` ports
      GSAP `yPercent` 1:1. Verified drift tracks scroll (0→16.8% over hero), no errors.
      GSAP now used only by index.html's INLINE scripts — the cards-batch reveal AND the
      pinned #story timeline; both migrate to vanilla next (1.5 + 1.6).)*
- [x] 1.5 **Story (`#story`) + Hero — REDESIGNED, final direction: CINEMATIC.** First built a vanilla
      sticky-pin + scroll morph, but the owner didn't like that animation/look — redesigned
      per sign-off to "calm editorial, no pin": three `.story-ch` chapters, each pairing its
      bottle with its text, alternating sides (`.story-ch--flip`). A dedicated IntersectionObserver
      reveals each chapter with a **cascade — bottle → large serif numeral (I/II/III) → heading
      → body** (transition on the base children for robustness), and the numeral's **rule line
      draws out**. Numerals enlarged to a Fraunces display feature. Faint masked `.story-atmos`
      backdrop. *(Done 2026-06-13, several iterations on owner feedback: pinned morph → calm
      editorial → numeral redesign → owner picked a new **CINEMATIC** direction from 3 live
      mockups (mock-cinematic/warm/modern, throwaway pages in the /tmp preview). FINAL build:
      Hero = full-bleed vineyard photo + slow entrance zoom + oversized Fraunces "Cellar·K"
      bottom-aligned + bottom-heavy scrim (crest + hero parallax removed). Story = alternating
      2-col chapters with a giant faint numeral (I/II/III) behind each bottle, cascade reveal +
      rule-line draw. Verified hero + story render at desktop + tablet, bilingual, no errors.)*
- [x] 1.5b **Extend the CINEMATIC look across the whole site** (owner sign-off 2026-06-13).
      Hero + story are cinematic; carry it through so the site isn't half-and-half:
      - [x] collection grid ("Δεκατρείς ετικέτες") — bigger Fraunces head, darker gallery cards,
            bigger bottles, lift + gold-name hover (CSS-only; cart wiring untouched). Verified 2026-06-13.
      - [x] interlude quote band — quote enlarged to the new scale (clamp 2.4→5rem, opsz 144).
      - [x] trade / χονδρική CTA — heading enlarged + lighter Fraunces, on the oxblood block.
      - [x] footer — enlarged the faint Fraunces "Cellar·K" mark for cinematic consistency.
      - [x] `catalog.html` — cinematic pass (CSS-only): hero zoom + bigger Fraunces title,
            bigger section/wine-row headings + bottles, refined row hover. Verified, cart intact.
- [x] 1.6 Removed GSAP + ScrollTrigger vendor files + `<script>` tags (Lenis gone in 1.3),
      the inline GSAP cards-batch, and `registerPlugin`/`ScrollTrigger.refresh` in motion.js.
      Cards now reveal via the vanilla observer (`[data-card]` added to `initReveals`); motion.js
      no longer depends on GSAP. *(Done 2026-06-13. Verified BOTH pages: `window.gsap` undefined,
      hero/cards/story reveal, catalog tabs/sections/rows build, no console errors. **Zero motion
      libraries site-wide.** `assets/vendor/` deleted.)*
- [x] 1.7 Cart drawer: slide-in (CSS) + **backdrop fade** (overlay opacity transition via
      `.is-open`, replacing the `hidden` toggle); focus trap + Esc-to-close + focus return were
      already in cart.js. *(Done 2026-06-13. Verified: drawer opens, overlay fades to ~0.94,
      focus moves to close button, no errors.)*
- [x] 1.8 Collection + catalog **card hovers**: lift + image scale ~1.02 + gold name (collection)
      / bottle lift+scale (catalog wine rows). Done during the cinematic pass, unified on `--ease-out`.
- [x] 1.9 `index ↔ catalog` **page-transition fade**: CSS `body` `pageIn` fade-in on load +
      JS fade-out (`body.is-leaving`) before same-site `.html` navigation (in motion.js).
      Reduced-motion aware. *(Verified: pageIn active, catalog link sets is-leaving then navigates.)*
- [x] 1.10 `catalog.html`: reveals already vanilla (motion.js `[data-hero]`); **filter tabs**
      already accessible — `role="tablist/tab/tabpanel"`, `aria-selected`/`aria-controls`,
      roving tabindex, Arrow/Home/End keyboard nav. Verified 2026-06-13.
- [x] 1.11 Global polish: `:focus-visible` ring (already present); `prefers-reduced-motion`
      guards across all new motion (hero/cat-hero zoom, reveals, parallax, page transition,
      cart overlay); **fixed the ≤440px nav overlap** (brand vs "Ο ΚΑΤΑΛΟΓΟΣ"). *(Verified
      375px: 10px gap, no overlap; bumped styles.css→v6, cart.js→v3 so browsers load updates.)*

## Phase 2 — Shopify backend (Shopify Basic) — needs owner/admin
> 📋 **Owner click-by-click guide ready: `OWNER-SETUP.md`** (covers 2.1–2.3 admin steps,
> products CSV import, token creation, and what to send back for 2.5). Hand it to the owner.
- [ ] 2.1 Owner confirms Shopify Basic active; enable **native B2B** (company accounts).
- [~] 2.2 Create products: **single bottles** (B2C) + **case** variants / B2B catalog pricing.
      *(2026-06-14: 13 single bottles imported via `docs/shopify-products.csv`, verified live
      (retail prices, EUR). Case / B2B-catalog pricing deferred to Phase 4.)*
- [ ] 2.3 Generate **Storefront API** token (public, scoped) — never admin creds.
      *(NOTE 2026-06-14: NOT needed for the B2C cart-permalink checkout — permalinks use only
      domain + variant IDs. Revisit only if we ever move to a Storefront-API / AJAX cart.)*
- [ ] 2.4 Lock architecture: **Hybrid** (static site = B2C + marketing; Shopify-hosted
      storefront = B2B portal) vs cart-permalink for B2C. See SHOPIFY.md recommendation.
- [x] 2.5 Fill `assets/shop-config.js` (store domain + per-bottle variant IDs).
      *(Done 2026-06-14: domain `vgzjfb-qu.myshopify.com` + all 13 variant IDs, each
      cross-checked against the live `products.json` → 13/13 ✓. Domain + IDs are public, fine
      in frontend. Uncommitted — commit when asked.)*

## Phase 3 — B2C checkout (single bottle → Shopify)
- [x] 3.1 Wire add-to-cart → Shopify cart permalink / checkout for single bottles.
      *(Done 2026-06-14: `cart.js` already calls `shopifyCheckoutURL()`; with config filled the
      live "Πληρωμή με κάρτα" button builds `…/cart/{id}:{qty}` permalinks. Verified a permalink
      302-redirects to a real Shopify checkout `/checkouts/cn/…/el-gr` (auto-Greek); `cart.json`
      confirmed Salina Bianco ×1 = €16.50 EUR.)*
- [x] 3.2 Cart drawer "Ολοκλήρωση — Πληρωμή με κάρτα" → real Shopify checkout. Guard
      against missing/blank variant IDs (don't silently drop bottles). *(Guard verified: any
      missing slug ⇒ `shopifyCheckoutURL` returns null ⇒ basket falls back to enquiry/"opening
      soon", never a partial cart. Bad variant ID → Shopify 410, confirmed.)*
- [~] 3.3 Test a full retail purchase end-to-end (test mode), EL + EN, mobile + desktop.
      *(Handoff verified — Greek checkout loads at correct price. FULL payment test blocked
      until owner activates Shopify Payments + an active plan (guide A3), and the storefront
      password is OFF. Resume here once payments are live.)*

## Phase 4 — B2B wholesale (gated, per case)
- [~] 4.1 Business **registration / application** flow. *(Done 2026-06-18: trade-signup form on
      homepage `#trade` — business name + ΑΦΜ → pre-filled enquiry email. Self-serve B2B portal
      still Phase-4-proper.)*
- [~] 4.2 **VAT (ΑΦΜ) validation** at registration: **format + mod-11 checksum DONE 2026-06-18**
      — `assets/afm.js` (`isValidAFM`, reusable client-side + future Shopify Function), wired via
      `assets/trade-signup.js`: live red/green, gates the "open account" button, browser-verified
      (owner's `171189566` passes; bad-checksum/short/long rejected). **Still TODO:** the real
      "is it active & theirs" check = AADE registry lookup (server-side, free GSIS creds — see
      OWNER-SETUP A2b). VIES is wrong tool for GR-only domestic. Owner verifies + uses **draft
      orders** so nothing's captured before approval.
- [ ] 4.3 **Approval + customer tagging** in Shopify.
- [ ] 4.4 Per-case **wholesale pricing** via native B2B catalog — **hidden from public/retail**.
- [ ] 4.5 Link the static site → Shopify B2B portal cleanly (login / "trade account" entry).
- [x] 4.6 **Close the public wholesale-price leak** — DONE 2026-06-14 (owner brought it forward).
      Stripped all 13 `price_wholesale` from `catalogue/wines.json` (raw file no longer exposes
      them); `catalogue/script.js` now shows **"Κατόπιν συνεννόησης / On request"** in trade mode
      (`emptyPriceText()`). Browser-verified: `?trade` shows no €, retail still shows real €, raw
      JSON clean. Real wholesale pricing will live behind the Shopify B2B login (Phase 4 proper).
- [ ] 4.7 **AADE auto-verify endpoint** — ✅ APPROVED by owner 2026-06-18, **scheduled for AFTER
      domain (6.1)** at owner's request. Tiny serverless fn (Cloudflare Worker, free tier) calls
      AADE's registry web service to auto-confirm an ΑΦΜ is a real, active business → auto-approve
      with no manual step. Cost ≈ **€0** (free service + free GSIS web creds + free serverless);
      "cost" is bureaucracy + one secret-bearing server. To live at `api.cellark.gr` once the
      domain exists. **Secret = GSIS creds → server-side ONLY, never in this public repo.**
      ↳ **Parallel prep (start now, slow):** owner registers for **GSIS special web-service
      credentials** (ειδικοί κωδικοί) on the AADE portal — see OWNER-SETUP A2b.

## Phase 5 — Compliance & Safety (see COMPLIANCE.md — do not hand-wave)
- [x] 5.1 **GDPR cookie-consent banner**: accept/reject non-essential, no pre-ticked boxes,
      no non-essential cookies/analytics before consent. EL/EN.
      *(Done 2026-06-14: `assets/consent.js` — bilingual bottom bar, **Accept / Essential-only**
      (no pre-ticked boxes, reject equal-prominence), persists `cellark.consent`, exposes
      `window.CellarkConsent.has(cat)` + a `cellark:consent` event to gate any FUTURE non-essential
      script, re-open via footer "Cookies" + a manage-control on privacy.html. Wired into
      index/catalog/privacy/terms/returns (404 is self-contained → skipped). Browser-verified:
      accept/essential/reopen/EL↔EN all work, gating API correct (`has('analytics')` flips
      false→true on Accept), no console errors, on-brand. styles.css→v7.)*
- [x] 5.2 **Cookie/script audit** table (Shopify, fonts, analytics, embeds) — keep updated.
      *(2026-06-14: audited — NO analytics / tracking / ad pixels; only first-party essential
      `localStorage` (cart, lang, ageConfirmed, consent). The one third party (Google Fonts) is now
      **ELIMINATED — fonts self-hosted**: `assets/fonts/` (18 woff2 + `fonts.css`, latin+greek
      subsets, `font-display:swap`); all 6 pages swapped off `fonts.googleapis`/`gstatic` and the
      Google **preconnects removed**. Browser-verified: 26 faces load from localhost, render
      identical to before, no console errors, **ZERO third-party requests now**. Remaining: write
      the formal audit table doc. NOTE: Fraunces/Spectral have no Greek glyphs (pre-existing → Greek
      serif falls back to system serif; Inter covers Greek labels). 404 uses an absolute fonts.css
      URL (matches its favicon convention) — swaps with the domain at launch. **Formal audit table
      now in COMPLIANCE.md §2** (site sets no cookies, makes zero third-party requests).)*
- [~] 5.3 Age-gate (18+) review on site + "adults only" + responsible-drinking at checkout.
      *(2026-06-14: reviewed — age-gate is solid (EL/EN, focus-trap, reduced-motion); site carries
      "adults only" + "enjoy responsibly" in footer + gate. Remaining = OWNER: 18+ +
      responsible-drinking note at Shopify checkout, and ship-to-adult / ID-on-delivery with the
      courier (esp. COD). See COMPLIANCE.md §3.)*
- [ ] 5.4 VAT/ΦΠΑ shows correctly; confirm Shopify tax config (owner sets rates).
- [x] 5.5 Fill legal pages + footer imprint with **real** client details (never invent):
      legal name, ΑΦΜ, ΓΕΜΗ, ΔΟΥ, address. *(Done 2026-06-16: owner supplied real identifiers —
      **ΚΑΠΠΑΣ ΒΑΣΙΛΕΙΟΣ · ΑΦΜ 171189566 (passes GR checksum ✓) · ΔΟΥ Καβάλας · ΓΕΜΗ 193081430000 ·
      Μεγάλου Αλεξάνδρου 27, Χρυσούπολη 64200**. Filled into the imprint/footer of index, catalog,
      privacy, terms, returns (EN transliterates name to "Vasileios Kappas"). No more `[—]` legal-ID
      placeholders site-wide. STILL pending (owner track): shipping/courier/COD details on returns.html
      (marked "προς οριστικοποίηση"), and the **policy/terms body text** still needs lawyer/accountant
      sign-off — kept a subtle "Υπό έλεγχο" note. Owner also sent **16/02/2001** — unconfirmed what it is
      (business-start vs DOB); NOT published pending clarification.)*
- [x] 5.6 Security: Storefront-token-only, no secrets, HTTPS, checkout on Shopify (PCI).
      *(2026-06-14: satisfied by design — NO secrets/tokens in the repo (B2C uses cart permalinks,
      so not even a Storefront token is needed); zero third-party requests; cards/checkout handled
      on Shopify (PCI); HTTPS via Pages. `shop-config.js` holds only the public store domain +
      variant IDs. Re-audit if/when any token is introduced.)*
- [x] 5.7 Write the **"client / lawyer must verify"** checklist (licensing, distance-selling,
      excise/duty, shipping restrictions, validity of privacy/terms).
      *(2026-06-14: written — COMPLIANCE.md §7 (licensing, distance-selling, excise/ΕΦΚ, shipping &
      age restrictions, privacy/terms validity, myDATA πάροχος, legal identifiers). The checklist
      exists; the items themselves stay open for the client/lawyer to action — not ours to tick.)*

## Phase 6 — Launch
- [x] 6.0 **Hero + story motion rework → became a FULL HOMEPAGE REDESIGN** (owner-driven, 2026-06-14).
      Owner reversed the vanilla decision: re-added **GSAP 3.13 + ScrollTrigger + SplitText + Lenis**
      (vendored `assets/vendor/`). Chose hero = **Cinematic** (from a 5-hero chooser) + catalogue =
      **editorial split** (from a 4-variation chooser). **`index.html` IS the new live homepage**
      (`6b5aa68`): cinematic hero (logo + zoom + SplitText) → Η Ιστορία (blurred barrels) → Ο Κατάλογος
      (editorial split) → tagline interlude "Ο ήλιος της Σικελίας…" → ΓΙΑ ΕΣΤΙΑΤΟΡΙΑ & ΚΑΒΕΣ → footer.
      Full EL/EN, age-gate + consent, trade mailto CTAs, CSP+noindex. Spaced wordmark **"Cellar · K"**.
      *(6.0b legal/404 DONE 2026-06-16: rebuilt privacy/terms/returns self-contained in the new homepage
      palette — spaced "Cellar · K" wordmark + logo-mark.png, cinematic dark hero band, imprint card with
      real legal data, "Under review" note, matching footer; 404 reskinned to the new tokens + spaced
      wordmark. Verified all four: EL/EN toggle swaps, no console errors, mobile+desktop fit. Fixed an i18n
      bug — nested `data-gr` inside a `data-gr` parent (returns shipping lines) was wiped by `textContent`;
      split into sibling leaf spans.)*
      *(6.0b catalog.html DONE 2026-06-16: aligned to the homepage WITHOUT touching cart/checkout —
      shared `styles.css` tokens → warm `--ink:#0e0b09` (+ink-soft/raise, body→cream), nav logo swapped
      from masked `<i>` → full-colour `<img logo-mark.png>`, spaced "Cellar · K" across title/nav/footer/OG,
      `nav.scrolled`+footer-mark colours matched, `styles.css?v=8` / `fonts.css?v=2`. Also spaced the
      shared **age-gate.js** wordmark (helps homepage too). Browser-verified: 13 rows + ΟΛΑ-default tabs
      build, bottles load, **cart add → Shopify permalink `…/cart/58240781615491:1` intact**, EL/EN +
      age-gate + consent work, no console errors. Whole site now visually consistent.)*
      *(6.0c CONSISTENCY CONSOLIDATION DONE 2026-06-17 — owner ran a multi-agent "council" (8-dimension
      audit → 42 confirmed inconsistencies, 1 HIGH) and chose FULL consolidation. Root-cause fix: **one
      canonical shared `assets/styles.css?v=9`** now linked by EVERY page (was: homepage+legal self-contained
      inline, catalog-only on styles.css). Collapsed the 3 nav implementations → 1 (`.nav`/`.nav-links`/`.lang`,
      `.solid`+`.scrolled` both styled; legal use static `.nav solid`), 3 footers → 1 canonical 3-col grid,
      unified `.btn` (HIGH: was solid-on-home / outline-on-catalog → now one outline-default + `.solid` +
      `.ghost`; homepage primaries switched to `.btn solid`), eyebrow .74/.3em, `--wrap` 1180 everywhere,
      `--ink-2`/`--bone`→cream tokens. **Found & fixed a real bug:** homepage + legal age-gate/consent were
      rendering UNSTYLED (`position:static`, not a blocking modal) because those pages never linked the sheet
      with `.age-gate`/`.cc-bar` — now a proper fixed 18+ modal site-wide. Normalised 102 wordmarks → spaced
      "Cellar · K" (incl. manifest, all email/cart.js templates, age-gate, catalog meta). Added a footer to
      404; manifest name+theme fixed (#0e0b09); legal in-body imprint order → ΑΦΜ·ΓΕΜΗ·ΔΟΥ. **Verified every
      page: cart add→Shopify permalink intact, GSAP hero fires, age-gate now a real modal, EL/EN toggle,
      consent styled+fixed, no console errors.** Site is now ONE design system.)*
      Remaining (minor, non-blocking): hero AVIF (sips one won't decode → JPG on homepage; catalog hero AVIF fine).
- [ ] 6.1 Custom domain (`cellark.gr`) + DNS + GitHub Pages config. Decide deploy repo
      (`Romanos2408/cellark` vs `cellar-k/cellar-k.github.io`) and update canonical URLs.
- [ ] 6.2 Final QA: both languages, mobile + desktop, all flows.
- [ ] 6.3 Go live.

---

### Owner-only blockers (parallel track — gather anytime)
- [ ] Shopify account created + **Shopify Payments** activated (business name, ΑΦΜ, IBAN, ID).
- [ ] Domain purchased.
- [ ] Legal/business details: legal name, ΑΦΜ, ΓΕΜΗ, ΔΟΥ.
- [ ] Shipping: courier, rates, COD (αντικαταβολή) fee, free-shipping threshold, island
      zones, breakage policy.
- [ ] myDATA: confirm πάροχος with accountant (Phase-2 e-invoicing deadline 1 Oct 2026).
