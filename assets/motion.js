/**
 * Cellar · K — shared motion engine
 *
 * MIGRATION IN PROGRESS (Phase 1 → vanilla). Now VANILLA, no libraries:
 *   • on-scroll reveals  ([data-hero] staggered on load, [data-up] on enter)
 *   • nav condense-on-scroll + scroll progress bar + scroll-cue fade
 *     (one rAF-throttled scroll listener)
 *   • prefers-reduced-motion: everything shown instantly, no observers
 *
 * Fully vanilla — NO motion libraries. Reveals (incl. collection cards via [data-card]),
 * nav UI, background parallax, and smooth scroll (native CSS) are all library-free.
 * GSAP + Lenis have been fully removed (PLAN 1.6).
 *
 * Opt-in attributes (in the HTML):
 *   [data-hero]             staggered fade-rise on load (hero block)
 *   [data-up]               fade-rise reveal when scrolled into view
 *   [data-parallax="0.18"]  background drifts slower than scroll (vanilla)
 *   .reveal                 base hidden→shown primitive in styles.css (.is-in plays it)
 */

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function stampYear() {
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
}

/* Nav condense + scroll progress bar + scroll-cue fade.
   One rAF-throttled scroll listener — works with or without the smooth engine. */
function initScrollUI() {
  const nav = document.querySelector('nav');
  const bar = document.getElementById('progress');
  const cue = document.querySelector('.scrollcue');
  if (!nav && !bar && !cue) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (nav) nav.classList.toggle('scrolled', y > 60);
    if (cue) cue.style.opacity = y > 60 ? '0' : '1';
    if (bar) {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const p = Math.min(Math.max(y / max, 0), 1);
      bar.style.width = (p * 100) + '%';
      bar.classList.toggle('is-on', p > 0.01);
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* Vanilla reveals — fade-and-rise via .is-in (CSS owns the transition).
   Items crossing in the same frame cascade in document order via --reveal-i. */
function initReveals() {
  const els = document.querySelectorAll('[data-hero],[data-up],[data-card]');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    const shown = entries.filter((e) => e.isIntersecting);
    shown.sort((a, b) =>
      (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
    shown.forEach((e, i) => {
      e.target.style.setProperty('--reveal-i', i);
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
  els.forEach((el) => io.observe(el));
}

function revealAllStatic() {
  document.querySelectorAll('.reveal,[data-hero],[data-up]').forEach((el) => {
    el.classList.add('is-in');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/* Background parallax — vanilla, transform-only, rAF-throttled. translateY uses %
   (relative to the element's own height), mirroring the previous GSAP yPercent. Progress
   runs from 'section top at viewport top' (0) to 'section bottom at viewport top' (1). */
function initParallax() {
  const items = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    strength: parseFloat(el.getAttribute('data-parallax')) || 0.25,
    ref: el.parentElement || el,
  }));
  if (!items.length) return;
  items.forEach(({ el }) => { el.style.willChange = 'transform'; });

  let ticking = false;
  const update = () => {
    ticking = false;
    for (const { el, strength, ref } of items) {
      const r = ref.getBoundingClientRect();
      let p = -r.top / (r.height || 1);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      el.style.transform = `translateY(${(strength * 100 * p).toFixed(3)}%)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* Subtle fade-out before navigating to another page in the site (index <-> catalog).
   The matching fade-in is pure CSS (body pageIn). */
function initPageTransition() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    let url;
    try { url = new URL(a.href, location.href); } catch { return; }
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    if (!/\.html?$/.test(url.pathname)) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { location.href = a.href; }, 300);
  });
}

export function initMotion() {
  const reduce = prefersReduced();
  stampYear();
  initScrollUI();

  // Reduced motion: show everything; skip observers/animation.
  if (reduce) {
    revealAllStatic();
    return { reduce: true };
  }

  initReveals();
  initParallax();
  initPageTransition();

  // Honor a deep link on load (native scroll; scroll-padding-top clears the fixed nav).
  window.addEventListener('load', () => {
    if (location.hash && location.hash.length > 1) {
      const target = document.querySelector(location.hash);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }));
    }
  });

  return { reduce: false };
}
