/**
 * Trade signup — soft gate for wholesale accounts.
 *
 * The buyer enters their ΑΦΜ; we validate format + checksum live (assets/afm.js).
 * A garbage / mistyped number is rejected on the spot and the "open account"
 * button stays disabled. A well‑formed number lets them send a pre‑filled
 * enquiry with the ΑΦΜ already in the body — Stelios then confirms it's a real,
 * active business (eyeball or the AADE lookup) before capturing payment.
 *
 * This does NOT prove the ΑΦΜ belongs to them — see OWNER-SETUP.md "AADE check".
 */

import { isValidAFM, normalizeAFM } from './afm.js';

const EMAIL = 'cellarkinfo@gmail.com';
const LANG_KEY = 'cellark.lang';
const lang = () => { try { return localStorage.getItem(LANG_KEY) || 'gr'; } catch { return 'gr'; } };

const MSG = {
  empty:   { gr: '', en: '' },
  invalid: { gr: 'Μη έγκυρο ΑΦΜ — ελέγξτε τα 9 ψηφία.', en: 'Invalid ΑΦΜ — check the 9 digits.' },
  valid:   { gr: '✓ Έγκυρη μορφή ΑΦΜ.', en: '✓ Valid ΑΦΜ format.' },
};

export function initTradeSignup() {
  const form = document.getElementById('tradeForm');
  if (!form) return;
  const afmEl = document.getElementById('trAfm');
  const bizEl = document.getElementById('trBiz');
  const msgEl = document.getElementById('trAfmMsg');
  const btn = document.getElementById('ctaAccount');
  if (!afmEl || !msgEl || !btn) return;

  let state = 'empty';

  function render() {
    const L = lang();
    msgEl.textContent = MSG[state][L];
    msgEl.className = 'field-msg' + (state === 'valid' ? ' ok' : state === 'invalid' ? ' bad' : '');
    btn.disabled = (state !== 'valid');
  }

  function evaluate() {
    const digits = normalizeAFM(afmEl.value);
    if (afmEl.value !== digits) afmEl.value = digits; // keep the field digits‑only
    state = digits.length === 0 ? 'empty' : (isValidAFM(digits) ? 'valid' : 'invalid');
    render();
  }

  function submit(e) {
    e.preventDefault();
    if (state !== 'valid') { afmEl.focus(); return; }
    const L = lang();
    const afm = normalizeAFM(afmEl.value);
    const biz = (bizEl && bizEl.value || '').trim();
    const subject = (L === 'gr' ? 'Άνοιγμα λογαριασμού χονδρικής' : 'Open a trade account') + ' — Cellar · K';
    const body = (L === 'gr'
      ? ['Καλησπέρα Cellar · K,', '', 'Θα ήθελα να ανοίξω λογαριασμό χονδρικής.', '',
         'Επωνυμία: ' + biz, 'ΑΦΜ: ' + afm, 'ΔΟΥ:', 'Περιοχή:', 'Υπεύθυνος:', 'Τηλέφωνο:']
      : ['Hello Cellar · K,', '', 'I would like to open a wholesale account.', '',
         'Business: ' + biz, 'VAT (ΑΦΜ): ' + afm, 'Tax office:', 'Area:', 'Contact:', 'Phone:']
    ).join('\n');
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  afmEl.addEventListener('input', evaluate);
  form.addEventListener('submit', submit);
  document.querySelectorAll('.lang').forEach((t) => t.addEventListener('click', () => setTimeout(render, 0)));
  render();
}
