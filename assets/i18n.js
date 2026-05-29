/**
 * Cellar·K — lightweight bilingual toggle (GR default / EN)
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
 * Choice persists to localStorage. Greek is the default for the Greek market.
 */

const KEY = 'cellark.lang';
const DEFAULT = 'gr';

function read() {
  try { return localStorage.getItem(KEY) || DEFAULT; } catch { return DEFAULT; }
}
function write(lang) {
  try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
}

function apply(lang) {
  document.querySelectorAll('[data-gr]').forEach((el) => {
    const txt = el.getAttribute('data-' + lang);
    if (txt != null) el.textContent = txt;
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
