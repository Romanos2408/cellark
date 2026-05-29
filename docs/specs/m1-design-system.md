# Spec — M1 Design System Extraction

## Goal
Lift the homepage's design tokens, base styles, reusable utilities/components, and the **motion engine** out of `index.html` into shared files (`assets/styles.css` + `assets/motion.js`), so every future page imports one source of truth instead of copy-pasting.

## User story
As the **developer**, I want a single shared stylesheet and motion module so that subsequent milestones (story, collection, product, trade) consume Kappas' tokens, type, components, and Lenis/GSAP setup from one place — and visual/behavioural drift between pages becomes impossible by construction.

## Requirements

### Functional — what must exist after this milestone
- `assets/styles.css` — single file (do not split). Contains:
  - `:root` design tokens (the full palette + `--measure`, `--ease`, any other root vars currently in `index.html`).
  - Reset (`*`, `html`, `body`) and Lenis html/body rules.
  - Typography (`h1,h2,h3,.display,.eyebrow`) + `::selection`.
  - Atmosphere overlays: `.grain`, `.vignette`, `.progress`.
  - Layout primitives: `section`, `.wrap`.
  - Nav: `nav`, `nav .brand`, `nav .links`, `nav .links a`, the `(max-width:680px)` hide rule.
  - Reveal primitive: `.reveal`.
  - Reusable component: `.btn` + `.btn.solid` + `.btn:focus-visible` (new — 2px gold-soft outline, 2px offset, no outline-style change in `:hover`) + the `(max-width:520px)` adjustment.
  - Footer base: `footer`, `.foot-grid`, `footer .mark`, `footer .legal`, `footer .legal a`, `.agegate-note`.
- `assets/motion.js` — a single ES module (`<script type="module">`) that imports Lenis + GSAP + ScrollTrigger from a CDN and **exports an `initMotion()` function** the homepage calls. `initMotion()`:
  - Sets the current year on `#yr` if present (harmless on pages without it).
  - Detects `prefers-reduced-motion`. If reduced: forces all `.reveal` visible and skips engine init (returns early after the static fallbacks).
  - Creates **one** Lenis instance (`lerp: 0.09`, `wheelMultiplier: 1`, `smoothWheel: true`), syncs it to GSAP's ticker, registers `ScrollTrigger`.
  - Wires the **progress bar** (`#progress` width = scroll progress).
  - Runs the **hero staggered reveal** on `[data-hero]` elements (existing behaviour).
  - Wires **generic hero-bg parallax** on `[data-parallax]` (currently `.hero-bg` carries `data-parallax="0.25"` — engine should read that value).
  - Wires **interlude layer parallax** on `.layer[data-depth]` (existing behaviour).
  - Wires **generic on-scroll reveal** on `[data-up]` (existing behaviour).
  - Calls `ScrollTrigger.refresh()` on `window load`.
  - Returns `{ lenis, ScrollTrigger, gsap }` so page-specific scripts (the pinned bottle on the homepage) can build timelines against the same engine.
- `index.html` — refactored to:
  - `<link rel="stylesheet" href="assets/styles.css">` in `<head>`.
  - Keep **only homepage-specific CSS** in the inline `<style>`: `.hero*`, `.story*`, `.bottle*`, `.chapters`/`.chapter*`, `.interlude*`/`.layer*`/`.l-*`, `.collection*`/`.cards`/`.card*`, `.trade*`.
  - Remove the three CDN `<script>` tags for GSAP/ScrollTrigger/Lenis (the module imports them).
  - Replace the bottom `<script>` block with `<script type="module">` that:
    1. Imports `initMotion` from `./assets/motion.js`.
    2. Calls `const { gsap, ScrollTrigger } = initMotion();`
    3. Builds the **pinned bottle timeline** (`#pin`, `#liquid`, `#bottle`, `#label`, `[data-ch]`) — unchanged behaviour, including the `window.innerWidth > 820 && !reducedMotion` guard and the static-fallback `gsap.set(...)` for the reduced/mobile path.

### Out of scope (do NOT do in M1)
- Building any new page (`/story`, `/collection`, etc.) — that's M2+.
- Extracting `.hero`, `.interlude`, `.collection`, `.card`, `.trade` styles into shared CSS. They stay on the homepage until a second page actually needs them (premature abstraction otherwise).
- Adding a build step, bundler, or package manager. ES modules from a CDN, no `npm`.
- Changing palette tokens, typography, spacing, or motion timings. Pure mechanical lift.
- Inlining critical CSS, adding a service worker, or other performance work — saved for M8.
- A `docs/handover.md` or component catalogue page — just a short README block in `assets/styles.css` and a JSDoc comment on `initMotion`.

## Design
**No new design.** This is a mechanical extraction. All tokens and visual treatments are preserved exactly:
- Tokens: `--ink`, `--ink-soft`, `--bone`, `--cream`, `--oxblood`, `--wine`, `--rust`, `--gold`, `--gold-soft`, `--olive`, `--measure`, `--ease`.
- Type: Fraunces (display) + Spectral (body) loaded from Google Fonts in `index.html` `<head>` — that link stays where it is.

### New "components" introduced (just by virtue of being extracted)
- `.btn` / `.btn.solid` — the trade-band CTA pattern, now globally available.
- `.eyebrow`, `.reveal`, `.wrap`, `.grain`, `.vignette`, `.progress`, `nav` — all promoted to shared utilities.

## Data & events
None. M1 ships no analytics, no user-visible data flows. Document the `[data-hero]`, `[data-up]`, `[data-parallax]`, `[data-depth]` attributes in a top-of-file comment in `motion.js` so the next milestone knows how to opt in.

## Acceptance criteria
- [ ] `assets/styles.css` exists; `assets/motion.js` exists (ES module).
- [ ] `index.html` no longer contains the tokens, reset, typography, `.eyebrow`, `.grain`, `.vignette`, `.progress`, `nav`, `.wrap`, `.reveal`, `.btn`, or `footer` base CSS — those now live only in `styles.css`.
- [ ] `index.html` no longer contains the three CDN `<script>` tags for Lenis/GSAP/ScrollTrigger; they're imported by `motion.js`.
- [ ] Opening `index.html` (via `python3 -m http.server 8000`) renders **visually identical** to before — at **360px, 768px, and 1280px** widths.
- [ ] No console errors, no 404s on assets, no CORS errors on the CDN module imports.
- [ ] Scroll behaviour identical: smooth Lenis scroll, progress bar fills, hero stagger plays, hero-bg parallaxes, pinned bottle fills with wine + rotates + label fades + chapters crossfade + snaps at 0/0.5/1, interlude layers parallax at different depths, `[data-up]` cards reveal on enter.
- [ ] `prefers-reduced-motion: reduce` path still works: motion off, content visible, bottle pre-filled, label visible.
- [ ] Pin math still correct after fonts load (`ScrollTrigger.refresh()` on `window load`).
- [ ] Single Lenis instance (verify in DevTools: `window.lenis` or count instantiations).
- [ ] `<700` lines of code touched in `index.html` post-refactor.

## Dependencies / risks
- **CDN ESM availability.** `motion.js` stays an ES module regardless. Library resolution falls back in this order, and we pin **one** matching GSAP version end-to-end (3.12.5):
  1. **Import map** in `index.html` mapping `gsap`, `gsap/ScrollTrigger`, and `lenis` to pinned CDN URLs. `motion.js` does `import gsap from 'gsap'; import ScrollTrigger from 'gsap/ScrollTrigger'; import Lenis from 'lenis'`.
  2. **Full pinned CDN URLs.** If import-map plumbing is finicky, `motion.js` imports directly from `https://esm.sh/gsap@3.12.5`, `https://esm.sh/gsap@3.12.5/ScrollTrigger` (esm.sh's subpath handling for GSAP plugins is the most reliable), and `https://esm.sh/lenis@1.0.42` (or `@studio-freight/lenis@1.0.42`).
  3. **Window globals last resort.** Keep the three UMD `<script>` tags in `index.html` and have `motion.js` read `window.gsap` / `window.ScrollTrigger` / `window.Lenis`. `motion.js` itself remains a module.
  Verify `gsap.registerPlugin(ScrollTrigger)` succeeds against whichever path wins.
- **`window.innerWidth > 820` guard.** The current desktop-vs-mobile branch for the pinned timeline lives in the inline script. It must stay in `index.html` (page-specific), not migrate to `motion.js`.
- **Font load timing.** `ScrollTrigger.refresh()` on `window load` is the existing fix. Don't move it earlier.
- **README preview workflow.** Currently tells the owner to "double-click `index.html`". ES modules don't work over `file://` in most browsers, so M1 breaks that path. **Fixed in the same commit** — the README's preview section is updated to require `python3 -m http.server 8000` (and equivalent for Node).
