# Spec — M2 Story page (`/story`)

## Goal
Give Kappas a long-form **brand story** page — Etna terroir, native grapes, the import journey — that earns the €2–3k tier through editorial pacing, atmospheric SVG/gradient art, parallax interludes, and **one signature pinned scrollytelling moment** that reuses the homepage's pin pattern with new content.

## User story
As a **B2C shopper or trade buyer** considering Kappas, I want to read who they are, where the wine comes from, and what the journey looks like, in a way that **feels expensive and considered**, so that I trust them enough to browse the collection or open a trade account.

## Requirements

### Functional — what the page must contain
- **File location:** `story/index.html` (folder-based pretty URL — served as `/story/` by any static server). Imports the shared design system + motion engine via relative paths (`../assets/styles.css`, `../assets/motion.js`).
- **Page-specific styles** stay in an inline `<style>` block — same convention as `index.html`. No new shared tokens, no new components added to `styles.css` in M2.
- **Same `<head>` chrome as the homepage:** Fraunces + Spectral font links, the import-map, `<link rel="stylesheet" href="../assets/styles.css">`, page-specific `<title>` and `<meta name="description">`.
- **Nav + footer:** identical markup to `index.html`'s `<nav>` and `<footer>` so the shared CSS picks them up. Nav links are adjusted for the new location (see below).

### Page structure (top-to-bottom)
1. **Hero** (`<header class="hero">`)
   - Different motif from the homepage hero — title-card with a Sicilia/volcanic mood.
   - Eyebrow: `Chapter — Sicilia`. h1: `The House`. Italic sub: `From the volcano. To your table.` Meta eyebrow line for atmosphere.
   - Hero background uses the existing `[data-parallax]` pattern (motion.js wires it generically) — gradients only, no images.
   - `[data-hero]` staggered entrance on the title elements, same as homepage.

2. **Section: Volcanic ground** (`<section class="ground">`)
   - Long-form prose: 3 short paragraphs on the terroir — black volcanic soil, altitude, mineral tension.
   - **Parallax background art**: layered CSS gradients (sky + two ridgelines) using the same `.layer[data-depth]` pattern as the existing interlude. Different colors from the existing one (slate/oxblood/ember) so they don't feel like a copy.
   - Generic `[data-up]` reveal on each paragraph block.

3. **Parallax interlude #1** (`<section class="interlude alt-1">`)
   - Reuse the existing `.interlude` + `.layer[data-depth]` pattern. **Different palette** (cooler, dawn — slate + a band of gold) and a different italic quote: e.g. *"Where the mountain breathes, the vine listens."*

4. **Section: Native grapes** (`<section class="grapes">`)
   - Three side-by-side cards (one per grape: Nerello Mascalese, Carricante, Frappato), each with: grape name (h3), region/appellation eyebrow, 1-sentence sensory description, a small stylized SVG mark (leaf/cluster — extremely simple geometric SVG).
   - Grid collapses to one column under 900px.
   - `[data-up]` reveal per card.

5. **Parallax interlude #2** (`<section class="interlude alt-2">`)
   - Warmer palette (ember + cream slip of dawn-gold). Quote: *"Hands have farmed these terraces for generations."*

6. **Section: The journey** (`<section class="journey">`)  ← **the signature pinned moment**
   - **Pinned scrollytelling** using the same GSAP `pin: true` + `scrub` + `snap: [0, 0.5, 1]` pattern as the homepage bottle. Three chapters crossfade beside a single stage that animates as the user scrolls:
     - Chapter i. **Sicilia** — vineyard scene (stylized SVG of terraced rows + sun)
     - Chapter ii. **Cellar** — stylized SVG of a bottle being poured / wax-sealed
     - Chapter iii. **Your table** — stylized SVG of a glass with a wine fill that rises like the homepage's bottle liquid
   - The animated SVG element can be the **same bottle SVG component** as the homepage (label fades in, liquid fills) OR a small set of three SVGs that crossfade. **Default: single SVG stage that morphs between the three scenes via opacity/transform.** Implementation detail — picked at build time, whichever reads cleaner.
   - **Same mobile fallback** as the homepage: under `window.innerWidth > 820 && !reducedMotion`, the pin runs; otherwise the section collapses to a static stack (stage + the three chapters all visible normally) with the animated end-state pre-applied.

7. **Closing CTA band** (`<section class="trade">`)
   - Reuse the homepage's `.trade` band style (it's already a strong volcanic gradient + centered type + paired `.btn` / `.btn.solid`). Headline e.g. *"Read the wines."*
   - Two buttons: **"See the collection"** (links to `../#collection` for now — `/collection` doesn't exist until M3) and **"Talk to us"** (links to `../#trade` for now).

8. **Footer** — copy the homepage footer markup exactly (`assets/styles.css` handles it).

### Side-effect (in scope, kept tiny)
- **Update the homepage nav's "The House" link** in `index.html` from `href="#story"` to `href="story/"`, so the new page is reachable from the homepage. No other nav link changes — Collection/Trade still point to homepage anchors until M3/M6 ship.

### Out of scope (do NOT do in M2)
- Real photography or stock images. SVG + CSS gradients only.
- A new shared component or new design tokens. M2 consumes M1's system; if a new pattern emerges that's clearly reusable (e.g. a chapter card), promote it in M3 or later, not now.
- Routing / SPA behavior. Just static `.html` files.
- Adding analytics events. M2 ships without analytics; that's M10/M11.
- Wiring real `/collection` or `/trade` pages — the CTAs point at homepage anchors as placeholders.
- Changing the homepage's existing pinned-bottle timeline.
- Translations (Greek locale) — that's M8 (SEO + locale).

## Design

### Tokens, type, motion
- Reuse `--ink`, `--oxblood`, `--wine`, `--rust`, `--gold`, `--gold-soft`, `--cream`, `--olive`, `--ease`, `--measure` from `assets/styles.css`.
- Fraunces for display, Spectral for body. No new fonts.
- Atmosphere: same `.grain` + `.vignette` overlays on the page — already global utilities.

### Motion vocabulary
- **Entrance:** `[data-hero]` staggered fade-and-rise on hero title block.
- **Scroll reveals:** `[data-up]` on every meaningful block (paragraphs, grape cards, CTA group).
- **Parallax:** `[data-parallax]` on the hero background; `.layer[data-depth]` on each interlude.
- **Pin:** the journey section uses page-local GSAP timeline that imports `{ gsap }` from the returned `initMotion()` (engine handles registration). Same `+=2600px` length range as the homepage so cadence feels consistent.
- All effects honor `prefers-reduced-motion` via the shared engine's guard. Page-local pinned timeline must wrap itself in the same `if (!reduce && window.innerWidth > 820) { ... } else { /* static fallback */ }` pattern.

### Layout
- Same 1200px `.wrap`, same `clamp(1.2rem, 5vw, 4rem)` horizontal rhythm.
- New page-local classes are namespaced so they can't collide with future shared ones — prefix any non-obvious class with `.s-` (story) **only** if a name would otherwise be ambiguous; otherwise plain semantic names (`.grapes`, `.journey`, `.ground`) are fine.

### Copy (to ship — short, sensory, place-named, never preachy)
Owner can revise later; this is the first-pass voice tuned to BRAND.md. The exact words are not load-bearing for acceptance — what matters is the *structure* and *register*.

- Hero sub: *From the volcano. To your table.*
- Ground (terroir) paragraphs: 3 × 2-3 sentences. Themes: black soil + altitude; the way Etna's wind and ash mark the fruit; the small growers who farm these terraces.
- Interlude #1 quote: *"Where the mountain breathes, the vine listens."* — small kicker: *Sicilia, in three acts*.
- Grape cards:
  - Nerello Mascalese — *Etna* — *Wild cherry, crushed stone, a whisper of smoke.*
  - Carricante — *Etna Bianco* — *Salt, lemon pith, a coastal white with volcanic spine.*
  - Frappato — *Vittoria* — *Red fruit and violets. Pure, light-footed, alive.*
- Interlude #2 quote: *"Hands have farmed these terraces for generations."*
- Journey chapters:
  - i. *Sicilia* — *Selected at the cellar, by people we know by name.*
  - ii. *Cellar* — *Carried north with care — short chain, honest paperwork.*
  - iii. *Your table* — *Poured, by the bottle or by the case.*
- Closing band: *Read the wines.* Buttons: *See the collection* / *Talk to us*.

## Data & events
- No data layer. No analytics. (Will be added in M10.)
- Page meta: unique `<title>Kappas — The House</title>` and `<meta name="description">` (40-60 words, mentions Etna, Sicily, the import story).

## Acceptance criteria
- [ ] `story/index.html` exists and is reachable at `http://localhost:<port>/story/` when serving from the project root.
- [ ] Homepage `nav .links` "The House" anchor is updated to `href="story/"`; clicking it from the homepage navigates to the new page.
- [ ] No new files under `assets/` (M2 consumes M1 only).
- [ ] Renders correctly at **360 / 768 / 1280 px**:
  - Nav links visibility matches `assets/styles.css`'s 680px rule.
  - Grape cards collapse to one column under 900px.
  - Pinned journey section collapses to a static stack under 820px (mirrors homepage).
- [ ] Scroll behaviour:
  - Lenis smooth scroll active (`html.lenis-smooth` set).
  - Progress bar fills as you scroll.
  - Hero title block staggers in on load.
  - Each interlude's three layers parallax at different depths.
  - All `[data-up]` blocks fade-and-rise into view.
  - The journey section pins; the stage animates; the three chapters crossfade with snap at 0/0.5/1.
- [ ] `prefers-reduced-motion: reduce` honored: all motion disabled, all `.reveal` content visible, pinned journey stage shown in its end-state statically.
- [ ] No console errors, no failed network requests, no 404 on `../assets/*`.
- [ ] `<title>` and `<meta name="description">` are unique and accurate.
- [ ] Total page: **single inline `<style>` block under ~250 lines**, **single inline `<script type="module">` under ~80 lines** (sanity caps — keeps the page in line with the homepage's footprint).

## Dependencies / risks
- **Lenis singleton.** The shared `initMotion()` already enforces one Lenis instance per page load. The story page must call `initMotion()` **exactly once** at the top of its module script — same as the homepage does.
- **Pin math after fonts load.** `motion.js` already calls `ScrollTrigger.refresh()` on `window load`. The page-local pinned timeline must be built **before** `load` fires (i.e. inline in the module body, not deferred), so the refresh re-measures correctly.
- **Two simultaneous interludes.** Both interludes reuse the `.layer[data-depth]` pattern. The engine's parallax wiring uses `el.closest('section')` so each interlude's layers correctly tie to *their* section — no cross-talk risk, but worth verifying that both sections register two separate ScrollTrigger sets at desktop width.
- **Visual fatigue.** Two parallax interludes + a long pinned segment + a hero parallax is a lot of motion for one page. Mitigation: keep interlude depths modest (0.1 / 0.35 / 0.6 — same range as homepage), keep paragraph reveals subtle, never stack two pinned segments.
- **Asset weight.** Page is still SVG + gradient only — no images. Lighthouse performance budget shouldn't move materially from the homepage.
- **Owner copy review.** First-pass copy is voice-checked but not signed off by the owner. Flag for review pre-launch; nothing in this spec depends on the exact wording.
