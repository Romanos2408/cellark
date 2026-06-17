/**
 * Cellar · K — cookie / storage consent (Phase 5.1, GDPR / ePrivacy)
 *
 * The site stores ONLY strictly-necessary first-party localStorage (basket,
 * language, age confirmation, and this consent choice) and currently loads NO
 * analytics, tracking or advertising scripts. This banner:
 *   (a) discloses that in plain EL/EN,
 *   (b) records an explicit Accept / Essential-only choice — no pre-ticked boxes,
 *       "reject" given equal prominence to "accept",
 *   (c) exposes `window.CellarkConsent` so any FUTURE non-essential script (e.g.
 *       analytics) can be gated behind consent: load it only when
 *       `window.CellarkConsent.has('analytics')` is true, and re-check on the
 *       `cellark:consent` event.
 *
 * Self-contained and accessible, mirroring age-gate.js: reads `cellark.lang`,
 * re-renders on the language toggle, reduced-motion handled in CSS. Re-open the
 * banner from anywhere with a `[data-consent-open]` element (e.g. footer "Cookies").
 */

const STORAGE_KEY = 'cellark.consent'; // 'all' | 'essential'
const LANG_KEY = 'cellark.lang';

function readLang() {
  try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'gr'; }
  catch (_) { return 'gr'; }
}
function readChoice() {
  try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
}
function writeChoice(v) {
  try { localStorage.setItem(STORAGE_KEY, v); }
  catch (_) { /* private mode / blocked storage — degrade silently */ }
}

const COPY = {
  gr: {
    label: 'Συναίνεση cookies',
    title: 'Σεβόμαστε το απόρρητό σας',
    body: 'Χρησιμοποιούμε μόνο απαραίτητη τοπική αποθήκευση (καλάθι, γλώσσα, επιβεβαίωση ηλικίας). Δεν χρησιμοποιούμε cookies ιχνηλάτησης ή διαφήμισης.',
    accept: 'Αποδοχή',
    essential: 'Μόνο απαραίτητα',
    more: 'Πολιτική απορρήτου',
  },
  en: {
    label: 'Cookie consent',
    title: 'We respect your privacy',
    body: 'We use only essential local storage (basket, language, age confirmation). We do not use tracking or advertising cookies.',
    accept: 'Accept',
    essential: 'Essential only',
    more: 'Privacy policy',
  },
};

let bar = null;

function emit(choice) {
  try { window.dispatchEvent(new CustomEvent('cellark:consent', { detail: { choice } })); }
  catch (_) { /* old browser — no-op */ }
}

function render() {
  if (!bar) return;
  const t = COPY[readLang()];
  bar.setAttribute('aria-label', t.label);
  bar.querySelector('.cc-title').textContent = t.title;
  bar.querySelector('.cc-body').textContent = t.body;
  bar.querySelector('.cc-more').textContent = t.more;
  bar.querySelector('.cc-accept').textContent = t.accept;
  bar.querySelector('.cc-essential').textContent = t.essential;
}

function build() {
  const root = document.createElement('section');
  root.className = 'cc-bar';
  root.setAttribute('role', 'region');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="cc-inner">
      <div class="cc-text">
        <p class="cc-title"></p>
        <p class="cc-body"></p>
      </div>
      <div class="cc-actions">
        <a class="cc-more" href="privacy.html"></a>
        <button class="btn cc-essential" type="button"></button>
        <button class="btn solid cc-accept" type="button"></button>
      </div>
    </div>`;
  root.querySelector('.cc-accept').addEventListener('click', () => choose('all'));
  root.querySelector('.cc-essential').addEventListener('click', () => choose('essential'));
  return root;
}

function show() {
  if (!bar) {
    bar = build();
    document.body.appendChild(bar);
  }
  render(); // always reflect the current language on (re)open
  bar.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => bar.classList.add('is-in'));
}

function hide() {
  if (!bar) return;
  bar.classList.remove('is-in');
  bar.setAttribute('aria-hidden', 'true');
}

function choose(v) {
  writeChoice(v);
  emit(v);
  hide();
}

export function initConsent() {
  // Public API — gate any future non-essential script behind consent:
  //   if (window.CellarkConsent.has('analytics')) { /* load it */ }
  window.CellarkConsent = {
    choice: () => readChoice(),
    has: (cat) => (cat === 'essential' ? true : readChoice() === 'all'),
    open: () => show(),
  };

  // Re-open trigger (e.g. footer "Cookies") — withdrawal as easy as consent.
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-consent-open]');
    if (trigger) { e.preventDefault(); show(); }
  });

  // Keep banner text in sync with the language toggle.
  document.querySelectorAll('.lang').forEach((tgl) =>
    tgl.addEventListener('click', () => setTimeout(render, 0)));

  // First visit (no recorded choice) → present the banner.
  if (!readChoice()) show();
}
