# DESIGN.md — luxury design + motion spec

**Guiding rule: refine freely, keep the soul.** Tasteful refinement of layout, spacing,
type scale, and component styling is welcome to feel more premium — but preserve the
**dark, minimal, editorial wine-house** character (near-black `#141414`, gold accents,
oxblood jewel CTA, serif display). Don't make it generic or a different kind of site.
**Show any larger visual departure first.**

## Stack decision (2026-06-13): VANILLA, no heavy libraries
Migrate **off** GSAP + Lenis + ScrollTrigger to **vanilla JS + `IntersectionObserver`**
(+ a light rAF scroll listener where needed). Rationale: smaller payload, no runtime lib
dependency, full control. The catch is the pinned story (below) — that's the one piece
where the libs were doing real work, so treat it carefully.

## Motion principles
- **Reveals ~400–800ms.** One shared ease everywhere → one personality:
  `--ease: cubic-bezier(0.16, 1, 0.3, 1)` (ease-out). Define once in `styles.css`.
- Subtle **fade + short upward translate (8–24px)**. Stagger grouped items ~60–100ms.
- **Animate only `transform` and `opacity`.** No layout thrash.
- **Reveal once** (don't re-hide on scroll up), except where a scrubbed effect needs live progress.
- **Respect `prefers-reduced-motion: reduce`** — show everything immediately, attach no
  observers/listeners. (Current `motion.js` already does this; preserve it.)

## Implementation pattern (vanilla)
- CSS: `.reveal { opacity:0; transform:translateY(16px); transition:opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }`
  `.reveal.is-in { opacity:1; transform:none; }`
- JS: one `IntersectionObserver` (e.g. `rootMargin:"0px 0px -12% 0px"`) adds `.is-in` then
  unobserves. Stagger via `transition-delay` set per index (or a small CSS nth-child step).
- Hero `[data-hero]`: same, with incremental delays for the staggered entrance.
- Eyebrows: letter-spacing settle (0.5em → 0.3em) on reveal — CSS transition triggered by `.is-in`.
- Progress bar + scroll-cue retire + nav condense: one throttled (`rAF`) scroll listener.
- Anchors / smooth scroll: native `html{scroll-behavior:smooth}` + JS offset for the fixed nav.

## Per-section spec
- **Header / nav:** condense-on-scroll (solid bar past hero — already wired), smooth anchor
  scroll with offset, refined hover / lang-toggle / cart-count states.
- **Hero — CINEMATIC (2026-06-13).** Full-bleed vineyard photo with a slow entrance zoom
  (`scale(1.12)→1`, ~16s, `prefers-reduced-motion` aware); content **bottom-aligned** with an
  oversized Fraunces "Cellar·K" (clamp up to 13rem, opsz 144), eyebrow + italic sub + partnership
  line, staggered `[data-hero]` fade-up on load; bottom-heavy scrim so the photo breathes up top.
  No crest. (Hero parallax removed — the zoom replaces it.)
- **Story (`#story`) — CINEMATIC (2026-06-13).** Three alternating chapters (`.story-ch--flip`),
  each a 2-column bottle + text pairing on a tall stage, with a **giant faint Fraunces numeral
  (I/II/III) behind the bottle** (`.story-ch-shot::before` from `data-num`). A dedicated observer
  reveals each chapter: **bottle → eyebrow → heading → body** cascade, and the eyebrow's rule line
  draws out. Dark, dramatic, big serif. *(Chosen from 3 mockups after pinned-morph + editorial
  attempts; throwaway mockups: mock-cinematic/warm/modern in the /tmp preview.)*

> ⏳ **DEFERRED to end-of-project (owner, 2026-06-13):** keep the cinematic *look*, but rework
> the **hero + story motion** — different element positions + a fresh animation. Owner likes
> cinematic, just wants to rethink the movement once content is settled. Self-contained (the
> hero/story are isolated CSS/HTML — won't block Phases 2–6); do it as a final polish pass.
> See PLAN.md item 6.0.
- **Interlude / collection / CTA:** fade-up reveals on enter (once). Keep the photographic
  scrims and oxblood CTA jewel.
- **Cards (home + catalog):** premium hover — lift (~4px), soft shadow, image scale ≤1.03,
  border warm-up. Mostly CSS already; unify durations with `--ease`.
- **Cart drawer:** slide-in + backdrop fade (CSS transitions). Add focus trap + Esc + focus
  return. No layout jump on open.
- **`index ↔ catalog`:** subtle page-transition fade (opacity on load / before unload).
- **Global:** consistent eased transitions site-wide; `:focus-visible` ring; tabular-nums
  on prices; no motion under reduced-motion.

## Palette / type (existing — keep)
- Colors (CSS vars): ink `#141414`, oxblood, gold / gold-soft, cream / bone, muted.
- Type: **Fraunces** (display serif), **Spectral** (body serif), **Inter** (labels/sans),
  Greek subset included. (Consider self-hosting fonts — see COMPLIANCE.md cookie audit.)
