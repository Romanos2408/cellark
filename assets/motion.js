/**
 * Cellar·K — shared motion engine (M1)
 *
 * One Lenis instance + GSAP/ScrollTrigger, wired to generic opt-in attributes
 * so every page gets the same buttery scroll without re-implementing it.
 *
 * Opt-in attributes (put them in your HTML):
 *   [data-hero]            staggered fade-and-rise on load (hero title block)
 *   [data-up]              fade-and-rise reveal when it scrolls into view
 *   [data-parallax="0.25"] element drifts; value = strength (background art)
 *   .layer[data-depth]     per-layer parallax inside a .interlude section
 *
 * Usage:
 *   import { initMotion } from './assets/motion.js';
 *   const { gsap, ScrollTrigger, reduce } = initMotion();
 *   // build page-specific pinned timelines against the returned gsap.
 *
 * Reduced motion: forces all .reveal/[data-hero]/[data-up] visible and skips
 * engine init. Page-specific timelines must guard on the returned `reduce`.
 */

/* Libraries are loaded locally as classic <script> tags (see each page's <head>),
   which set these globals. Hosting them on our own origin removes the runtime
   dependency on an external CDN — if a CDN is slow/down the shop still loads. */
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;

export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // If the vendored libs failed to load, degrade gracefully: reveal everything.
  if (!gsap || !ScrollTrigger) {
    document.querySelectorAll('.reveal,[data-hero],[data-up]').forEach((el) => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    const yrEl = document.getElementById('yr');
    if (yrEl) yrEl.textContent = '2026';
    return { gsap: null, ScrollTrigger: null, reduce: true };
  }

  // Year stamp — harmless if #yr is absent.
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Nav turns into a solid bar once past the hero. Native scroll listener so it
  // works whether or not the Lenis engine is running (e.g. reduced motion).
  const navEl = document.querySelector('nav');
  if (navEl) {
    const syncNav = () => navEl.classList.toggle('scrolled', window.scrollY > 60);
    syncNav();
    window.addEventListener('scroll', syncNav, { passive: true });
  }

  // Reduced motion: show everything statically, no engine.
  if (reduce) {
    document.querySelectorAll('.reveal,[data-hero],[data-up]').forEach((el) => {
      el.classList.add('is-in');
      gsap.set(el, { clearProps: 'all', opacity: 1, y: 0 });
    });
    return { gsap, ScrollTrigger, lenis: null, reduce: true };
  }

  gsap.registerPlugin(ScrollTrigger);

  // One Lenis instance, synced to GSAP's ticker.
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  window.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Progress bar — eased fill, hidden at the very top.
  const bar = document.getElementById('progress');
  if (bar) {
    lenis.on('scroll', ({ progress }) => {
      bar.style.width = (progress * 100) + '%';
      bar.classList.toggle('is-on', progress > 0.01);
    });
  }

  // Retire the scroll cue once the reader starts moving.
  const cue = document.querySelector('.scrollcue');
  if (cue) {
    lenis.on('scroll', ({ scroll }) => { cue.style.opacity = scroll > 60 ? '0' : '1'; });
  }

  // Hero staggered entrance.
  const heroEls = gsap.utils.toArray('[data-hero]');
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 34 });
    gsap.to(heroEls, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.14, delay: 0.25,
    });
  }

  // Generic background parallax.
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const strength = parseFloat(el.getAttribute('data-parallax')) || 0.25;
    gsap.to(el, {
      yPercent: strength * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // Interlude layer parallax — each layer tied to its own section.
  gsap.utils.toArray('.layer[data-depth]').forEach((layer) => {
    const depth = parseFloat(layer.getAttribute('data-depth')) || 0.2;
    const sec = layer.closest('section') || layer.parentElement;
    gsap.to(layer, {
      yPercent: -depth * 100,
      ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Generic on-scroll reveals.
  gsap.utils.toArray('[data-up]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
  });

  // Eyebrows "set" into place — letter-spacing tightens to its rest value.
  // Letter-spacing only; opacity is owned by the hero stagger / [data-up] reveals.
  gsap.utils.toArray('.eyebrow').forEach((el) => {
    gsap.fromTo(el,
      { letterSpacing: '0.5em' },
      {
        letterSpacing: '0.3em', duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
  });

  // Pin math after fonts load. Then, if we arrived on a deep link (e.g.
  // index.html#story), sync Lenis to the target — a native hash jump leaves
  // Lenis at 0 and the page snaps back / lands inside the pinned section.
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    if (location.hash && location.hash.length > 1) {
      const target = document.querySelector(location.hash);
      if (target) requestAnimationFrame(() => lenis.scrollTo(target, { offset: -80, immediate: true }));
    }
  });

  return { gsap, ScrollTrigger, lenis, reduce: false };
}
