# Homepage Spec — Scroll Motion

The homepage is the signature of the whole site. It uses the family of scroll techniques below. `index.html` already implements them; this file is the reference for *why* and *how*, so inner pages stay consistent.

## The techniques (and where each is used)

### 1. Scrollytelling
Scrolling triggers objects to rotate, fill, reveal, or transform **in place** before moving to the next section.
- **Used in:** the pinned "The House" section — the SVG bottle fills with wine, its label fades in, and it gently rotates as three story "chapters" (terroir → grapes → journey) crossfade beside it.

### 2. Pinned scrolling / scroll pinning
An element **sticks** in place while you scroll, animating before releasing to the next section. This is the Apple product-page move (the iPhone that rotates/disassembles while staying centered).
- **Used in:** same section — the whole stage is `pin:true` in ScrollTrigger for `+=2600px`, so the bottle stays centered while the chapters advance.

### 3. Scroll-jacking / scroll snapping
The page glides/snaps to the next section as a complete unit.
- **Used in:** the pinned timeline uses GSAP `snap:[0,0.5,1]` so the three chapters settle cleanly instead of stranding mid-transition. (We deliberately avoid full-page CSS `scroll-snap` because it fights Lenis + pinning.)

### 4. Easing + parallax (the "beautiful and smooth" feel)
- **Easing:** Lenis smooth-scroll (`lerp: 0.09`) + GSAP eases (`power3.out`, `sine.inOut`) for smooth acceleration/deceleration.
- **Parallax:** the hero background drifts slower than content; the interlude has three layers (sky / two ridgelines) moving at different `data-depth` speeds for volcanic depth.

## The libraries (what we chose and why)
- **GSAP + ScrollTrigger** — industry standard for polished Apple-style pinning and scrubbed timelines. **Primary.**
- **Lenis** — adds the buttery smooth-scroll feel; synced to GSAP's ticker so ScrollTrigger stays in lockstep. **Primary.**
- **Framer Motion** — the React alternative if/when any page is built in React. Use its scroll hooks instead of GSAP *only* on React pages; never run two smooth-scroll engines at once.
- **CSS scroll-driven animations** — native, no library. Good for tiny touches (a progress indicator, simple reveals) and as a progressive-enhancement fallback; not robust enough yet for the full pinned sequence across all browsers.

## Implementation notes (already in `index.html`)
```
Lenis(lerp:0.09) ── on 'scroll' ──▶ ScrollTrigger.update()
gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)
```
- Pinned timeline scrubs: liquid `height`/`y`, bottle `rotation`+`scale`, label `opacity`, chapter crossfades.
- Hero: staggered load reveal (`stagger:0.14`) + background `yPercent` parallax on scrub.
- Interlude: per-layer parallax from `data-depth`.
- Generic `[data-up]` elements fade/slide in at `top 85%`.
- `prefers-reduced-motion`: all motion disabled, content shown statically, bottle pre-filled.
- `ScrollTrigger.refresh()` on `window load` so pin math is correct after fonts load.

## Rules for reusing this on other pages
1. Keep the **one** Lenis instance; import it from the shared module after M1.
2. Pinning is for *storytelling* pages only (home, story). Shop/product/checkout stay calm — reveals and hovers, no scroll-jacking.
3. Always provide the reduced-motion path.
4. Test pin lengths on mobile; collapse pinned sequences to static stacks under ~820px (the homepage already does this).
