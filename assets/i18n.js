/**
 * Cellar · K — lightweight bilingual toggle (GR default / EN)
 *
 * Markup contract: any translatable text node carries both languages as
 * data-attributes, with the Greek text also written as the element's
 * default content (so the page reads correctly with JS disabled):
 *
 *   <h2 data-gr="Η συλλογή" data-en="The collection">Η συλλογή</h2>
 *
 * The nav toggle is a single element with class .lang containing two spans:
 *   <a class="lang"><span data-lang="gr">EL</span><span data-lang="en">EN</span></a>
 *
 * Choice persists to localStorage.
 *
 * First-visit language, highest priority first:
 *   1. ?lang=el|gr|en  — how cellar-k.gr carries "Greek" across its redirect to .com
 *   2. a stored choice — whatever the visitor picked last time always wins
 *   3. a .gr hostname  — cellar-k.gr is Greek by definition
 *   4. the browser     — Greek-speaking browsers get Greek, everyone else English
 */

const KEY = 'cellark.lang';
const FALLBACK = 'en';

/** Normalize anything user/browser-supplied to our two language codes. */
function norm(v) {
  const s = String(v || '');
  if (/^(el|gr)/i.test(s)) return 'gr';
  if (/^en/i.test(s)) return 'en';
  return null;
}

function resolveLang() {
  // 1. Explicit ?lang= wins — it's a deliberate signal in the URL.
  try {
    const q = norm(new URLSearchParams(location.search).get('lang'));
    if (q) { write(q); return q; }
  } catch { /* ignore */ }
  // 2. A choice the visitor made themselves.
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'gr' || stored === 'en') return stored;
  } catch { /* ignore */ }
  // 3. The Greek domain is Greek, full stop.
  try { if (/\.gr$/i.test(location.hostname)) return 'gr'; } catch { /* ignore */ }
  // 4. Otherwise follow the browser so Greek customers never land on English.
  try {
    const langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages : [navigator.language];
    if (langs.some((l) => norm(l) === 'gr')) return 'gr';
  } catch { /* ignore */ }
  return FALLBACK;
}

function read() {
  try { return resolveLang(); } catch { return FALLBACK; }
}
function write(lang) {
  try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
}

function apply(lang) {
  // Visible text — including the <head> <title> (setting its textContent
  // updates document.title), so the browser tab localizes too.
  document.querySelectorAll('[data-gr]').forEach((el) => {
    const txt = el.getAttribute('data-' + lang);
    if (txt != null) el.textContent = txt;
  });
  // Attribute-only strings that have no text node: meta description + aria-labels.
  document.querySelectorAll('meta[data-gr][name="description"]').forEach((m) => {
    const txt = m.getAttribute('data-' + lang);
    if (txt != null) m.setAttribute('content', txt);
  });
  document.querySelectorAll('[data-aria-gr]').forEach((el) => {
    const txt = el.getAttribute('data-aria-' + lang);
    if (txt != null) el.setAttribute('aria-label', txt);
  });
  document.documentElement.lang = (lang === 'gr') ? 'el' : 'en';
  document.querySelectorAll('.lang [data-lang]').forEach((s) => {
    s.classList.toggle('on', s.getAttribute('data-lang') === lang);
  });
}

export function initI18n() {
  let lang = read();
  apply(lang);

  document.querySelectorAll('.lang').forEach((toggle) => {
    toggle.style.cursor = 'pointer';
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      lang = (lang === 'gr') ? 'en' : 'gr';
      write(lang);
      apply(lang);
    });
  });

  return { get lang() { return lang; } };
}
