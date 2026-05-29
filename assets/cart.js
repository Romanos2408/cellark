/**
 * Cellar·K — client-side basket with checkout stepper (no backend).
 *
 * Flow:  items → choose Λιανική/Χονδρική → fill + validate details → send (Email/WhatsApp)
 *
 * State (localStorage):
 *   cellark.cart      → [{ slug, qty }]
 *   cellark.mode      → 'retail' | 'wholesale'   (chosen at checkout)
 *   cellark.checkout  → { name, phone, ... }     (entered details)
 *   cellark.lang      → 'gr' | 'en'              (shared with i18n.js)
 *
 * Validation done here (offline): required fields, email & phone format, and the Greek
 * ΑΦΜ checksum (modulo-11). Live VIES/ΑΑΔΕ verification is a later, server-side step.
 * No prices: this is an enquiry basket — the order is sent by email or WhatsApp.
 */

const CART_KEY = 'cellark.cart';
const MODE_KEY = 'cellark.mode';
const FORM_KEY = 'cellark.checkout';
const LANG_KEY = 'cellark.lang';

const EMAIL = 'cellarkinfo@gmail.com';
const WHATSAPP = '306972845565'; // +30 6972845565

const T = {
  gr: {
    titleItems: 'Το καλάθι σου', empty: 'Το καλάθι σου είναι άδειο.',
    q: 'Πώς θα παραγγείλετε;', next: 'Συνέχεια', clear: 'Άδειασμα',
    confirm: 'Τιμές & διαθεσιμότητα επιβεβαιώνονται με την παραγγελία.',
    email: 'Email', whatsapp: 'WhatsApp', add: 'Προσθήκη στο καλάθι', added: 'Προστέθηκε ✓',
    retail: 'Λιανική', wholesale: 'Χονδρική',
    eRequired: 'Υποχρεωτικό πεδίο', eEmail: 'Μη έγκυρο email',
    ePhone: 'Μη έγκυρο τηλέφωνο', eAfm: 'Μη έγκυρο ΑΦΜ (9 ψηφία)',
  },
  en: {
    titleItems: 'Your basket', empty: 'Your basket is empty.',
    q: 'How are you ordering?', next: 'Continue', clear: 'Empty',
    confirm: 'Prices & availability confirmed on order.',
    email: 'Email', whatsapp: 'WhatsApp', add: 'Add to basket', added: 'Added ✓',
    retail: 'Retail', wholesale: 'Wholesale',
    eRequired: 'Required field', eEmail: 'Invalid email',
    ePhone: 'Invalid phone', eAfm: 'Invalid VAT no. (9 digits)',
  },
};

// field key, GR/EN labels, mail label (always Greek — order goes to the owner), rules
const FIELDS = {
  retail: [
    { k: 'name',    gr: 'Όνομα',                 en: 'Full name',           ml: 'Όνομα',       req: true },
    { k: 'phone',   gr: 'Τηλέφωνο',              en: 'Phone',               ml: 'Τηλέφωνο',    req: true, v: 'phone', type: 'tel' },
    { k: 'email',   gr: 'Email (προαιρετικό)',   en: 'Email (optional)',    ml: 'Email',       req: false, v: 'email', type: 'email' },
    { k: 'address', gr: 'Διεύθυνση παράδοσης',   en: 'Delivery address',    ml: 'Διεύθυνση',   req: true },
  ],
  wholesale: [
    { k: 'company', gr: 'Επωνυμία επιχείρησης',  en: 'Business name',       ml: 'Επωνυμία',    req: true },
    { k: 'afm',     gr: 'ΑΦΜ',                    en: 'VAT number (ΑΦΜ)',    ml: 'ΑΦΜ',         req: true, v: 'afm', hint: { gr: '9 ψηφία — ελέγχεται αυτόματα', en: '9 digits — checked automatically' } },
    { k: 'contact', gr: 'Υπεύθυνος',             en: 'Contact person',      ml: 'Υπεύθυνος',   req: true },
    { k: 'phone',   gr: 'Τηλέφωνο',              en: 'Phone',               ml: 'Τηλέφωνο',    req: true, v: 'phone', type: 'tel' },
    { k: 'email',   gr: 'Email (προαιρετικό)',   en: 'Email (optional)',    ml: 'Email',       req: false, v: 'email', type: 'email' },
    { k: 'region',  gr: 'Περιοχή',               en: 'Region',              ml: 'Περιοχή',     req: true },
  ],
};

let WINES = [];
let step = 'items';
let els = {};

/* ---- storage helpers ---- */
const lang = () => { try { return localStorage.getItem(LANG_KEY) || 'gr'; } catch { return 'gr'; } };
const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
const setCart = (c) => { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch {} };
const getMode = () => { try { return localStorage.getItem(MODE_KEY) || 'retail'; } catch { return 'retail'; } };
const setMode = (m) => { try { localStorage.setItem(MODE_KEY, m); } catch {} };
const getForm = () => { try { return JSON.parse(localStorage.getItem(FORM_KEY)) || {}; } catch { return {}; } };
const setForm = (o) => { try { localStorage.setItem(FORM_KEY, JSON.stringify(o)); } catch {} };
const wineOf = (slug) => WINES.find((w) => w.slug === slug);
const count = () => getCart().reduce((n, i) => n + i.qty, 0);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ---- cart mutations ---- */
function addItem(slug, qty) {
  const c = getCart();
  const ex = c.find((i) => i.slug === slug);
  if (ex) ex.qty += qty; else c.push({ slug, qty });
  setCart(c); render();
}
function setQty(slug, qty) {
  let c = getCart();
  if (qty <= 0) c = c.filter((i) => i.slug !== slug);
  else { const ex = c.find((i) => i.slug === slug); if (ex) ex.qty = qty; }
  setCart(c); render();
}
function removeItem(slug) { setCart(getCart().filter((i) => i.slug !== slug)); render(); }
function clearCart() { setCart([]); render(); }

/* ---- validators ---- */
function validAFM(raw) {
  const s = String(raw).replace(/\D/g, '');
  if (!/^\d{9}$/.test(s) || s === '000000000') return false;
  const d = s.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += d[i] * Math.pow(2, 8 - i);
  let m = sum % 11; if (m === 10) m = 0;
  return m === d[8];
}
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validPhone = (v) => v.replace(/\D/g, '').length >= 10;

function fieldError(f, val) {
  const L = lang(), t = T[L];
  const v = (val || '').trim();
  if (!v) return f.req ? t.eRequired : '';
  if (f.v === 'email' && !validEmail(v)) return t.eEmail;
  if (f.v === 'phone' && !validPhone(v)) return t.ePhone;
  if (f.v === 'afm' && !validAFM(v)) return t.eAfm;
  return '';
}
function formValid() {
  const fd = getForm();
  return FIELDS[getMode()].every((f) => !fieldError(f, fd[f.k]));
}

/* ---- order text → email + WhatsApp ---- */
function orderText() {
  const L = lang(), mode = getMode(), fd = getForm();
  const lines = [L === 'gr' ? 'Καλησπέρα Cellar·K,' : 'Hello Cellar·K,', ''];
  lines.push(`${L === 'gr' ? 'Παραγγελία' : 'Order'} (${T[L][mode]}):`);
  getCart().forEach((i) => { const w = wineOf(i.slug); if (w) lines.push(`• ${i.qty}× ${w.name}`); });
  lines.push('');
  FIELDS[mode].forEach((f) => { const v = (fd[f.k] || '').trim(); if (v) lines.push(`${f.ml}: ${v}`); });
  return lines.join('\n');
}
const subject = () => `Παραγγελία — ${T.gr[getMode()]} · Cellar·K`;
const emailHref = () => `mailto:${EMAIL}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(orderText())}`;
const waHref = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(subject() + '\n\n' + orderText())}`;

/* ---- rendering ---- */
function renderItems() {
  const L = lang(), c = getCart();
  if (!c.length) { els.items.innerHTML = `<p class="cart-empty">${T[L].empty}</p>`; return; }
  els.items.innerHTML = c.map((i) => {
    const w = wineOf(i.slug); if (!w) return '';
    return `<div class="cart-line" data-slug="${i.slug}">
      <img src="assets/wines/${i.slug}.png" alt="" loading="lazy" />
      <div class="cart-line-info">
        <p class="cart-line-name">${esc(w.name)}</p>
        <div class="qty mini" data-slug="${i.slug}">
          <button class="qty-dec" type="button" aria-label="−">−</button>
          <span class="qty-val">${i.qty}</span>
          <button class="qty-inc" type="button" aria-label="+">+</button>
        </div>
      </div>
      <button class="cart-rm" type="button" data-slug="${i.slug}" aria-label="remove">×</button>
    </div>`;
  }).join('');
}

function buildForm() {
  const L = lang(), fd = getForm();
  els.form.innerHTML = FIELDS[getMode()].map((f) => `
    <label class="cart-field" data-key="${f.k}">
      <span class="cf-label">${f[L]}${f.req ? ' *' : ''}</span>
      <input class="cf-input" name="${f.k}" type="${f.type || 'text'}"
             value="${esc(fd[f.k] || '')}" autocomplete="off"
             ${f.k === 'afm' ? 'inputmode="numeric" maxlength="9"' : ''} />
      ${f.hint ? `<span class="cf-hint">${f.hint[L]}</span>` : ''}
      <span class="cf-error" hidden></span>
    </label>`).join('');
  validateForm();
}

function validateForm(showAll) {
  const fd = getForm();
  FIELDS[getMode()].forEach((f) => {
    const wrap = els.form.querySelector(`.cart-field[data-key="${f.k}"]`);
    if (!wrap) return;
    const errEl = wrap.querySelector('.cf-error');
    const touched = wrap.dataset.touched === '1' || showAll;
    const msg = touched ? fieldError(f, fd[f.k]) : '';
    wrap.classList.toggle('invalid', !!msg);
    if (msg) { errEl.textContent = msg; errEl.hidden = false; } else { errEl.hidden = true; }
  });
  const ok = formValid();
  els.email.classList.toggle('disabled', !ok);
  els.whatsapp.classList.toggle('disabled', !ok);
  if (ok) { els.email.href = emailHref(); els.whatsapp.href = waHref(); }
  else { els.email.removeAttribute('href'); els.whatsapp.removeAttribute('href'); }
  return ok;
}

function render() {
  const L = lang(), t = T[L], n = count();
  // badge
  els.count.textContent = n;
  els.count.classList.toggle('on', n > 0);
  // steps visibility
  els.body.querySelectorAll('.cart-step').forEach((s) =>
    s.toggleAttribute('hidden', s.dataset.step !== step));
  // header
  els.back.hidden = (step === 'items');
  els.title.textContent = step === 'items' ? t.titleItems
    : step === 'mode' ? (L === 'gr' ? 'Παραγγελία' : 'Order')
    : t[getMode()];
  // footer pieces
  const showNext = step === 'items';
  const showCtas = step === 'form';
  els.next.hidden = !showNext;
  els.next.textContent = t.next;
  els.next.disabled = (n === 0);
  els.ctas.hidden = !showCtas;
  els.email.textContent = t.email;
  els.whatsapp.textContent = t.whatsapp;
  els.clear.hidden = !(step === 'items' && n > 0);
  els.clear.textContent = t.clear;
  els.confirm.hidden = !showCtas;
  els.confirm.textContent = t.confirm;
  // localized choice labels handled by i18n via data-gr/en
  if (step === 'items') renderItems();
  if (step === 'form') buildForm();
}

function goStep(s) { step = s; render(); }

/* ---- drawer open/close ---- */
function openCart() { step = 'items'; els.drawer.classList.add('open'); els.overlay.hidden = false; els.drawer.setAttribute('aria-hidden', 'false'); render(); }
function closeCart() { els.drawer.classList.remove('open'); els.overlay.hidden = true; els.drawer.setAttribute('aria-hidden', 'true'); }

export function initCart(wines) {
  WINES = wines || [];
  els = {
    btn: document.getElementById('cartBtn'),
    count: document.getElementById('cartCount'),
    drawer: document.getElementById('cartDrawer'),
    overlay: document.getElementById('cartOverlay'),
    body: document.getElementById('cartBody'),
    items: document.getElementById('cartItems'),
    form: document.getElementById('cartForm'),
    title: document.getElementById('cartTitle'),
    back: document.getElementById('cartBack'),
    close: document.getElementById('cartClose'),
    confirm: document.getElementById('cartConfirm'),
    next: document.getElementById('cartNext'),
    ctas: document.getElementById('cartCtas'),
    email: document.getElementById('cartEmail'),
    whatsapp: document.getElementById('cartWhatsapp'),
    clear: document.getElementById('cartClear'),
  };
  if (!els.drawer) return;

  els.btn.addEventListener('click', openCart);
  els.close.addEventListener('click', closeCart);
  els.overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

  els.back.addEventListener('click', () => goStep(step === 'form' ? 'mode' : 'items'));
  els.next.addEventListener('click', () => { if (count() > 0) goStep('mode'); });
  els.clear.addEventListener('click', clearCart);

  // mode choice
  els.body.querySelectorAll('.mode-choice').forEach((b) =>
    b.addEventListener('click', () => { setMode(b.dataset.mode); goStep('form'); }));

  // form input → persist + validate
  els.form.addEventListener('input', (e) => {
    const inp = e.target.closest('.cf-input'); if (!inp) return;
    const fd = getForm(); fd[inp.name] = inp.value; setForm(fd);
    validateForm();
  });
  els.form.addEventListener('blur', (e) => {
    const inp = e.target.closest('.cf-input'); if (!inp) return;
    inp.closest('.cart-field').dataset.touched = '1';
    validateForm();
  }, true);
  // block send when invalid
  [els.email, els.whatsapp].forEach((a) => a.addEventListener('click', (e) => {
    if (!validateForm(true)) { e.preventDefault(); }
  }));

  // delegated: product steppers, add buttons, basket-line steppers, remove
  document.addEventListener('click', (e) => {
    const inc = e.target.closest('.qty-inc');
    const dec = e.target.closest('.qty-dec');
    const add = e.target.closest('.add-btn');
    const rm = e.target.closest('.cart-rm');
    if (rm) { removeItem(rm.dataset.slug); return; }
    if (inc || dec) {
      const step1 = inc ? 1 : -1;
      const line = (inc || dec).closest('.cart-line');
      if (line) {
        const slug = line.dataset.slug;
        const cur = getCart().find((i) => i.slug === slug);
        setQty(slug, (cur ? cur.qty : 0) + step1);
      } else {
        const q = (inc || dec).closest('.qty');
        const val = q && q.querySelector('.qty-val');
        if (val) { let m = parseInt(val.textContent, 10) || 1; m = Math.max(1, m + step1); val.textContent = m; }
      }
      return;
    }
    if (add) {
      const slug = add.dataset.slug;
      const q = add.closest('.wine-actions').querySelector('.qty .qty-val');
      const qty = q ? (parseInt(q.textContent, 10) || 1) : 1;
      addItem(slug, qty);
      if (q) q.textContent = '1';
      openCart();
      const label = add.querySelector('.add-label') || add;
      const prev = label.textContent;
      label.textContent = T[lang()].added;
      setTimeout(() => { label.textContent = prev; }, 1100);
    }
  });

  // re-localise on language toggle
  document.querySelectorAll('.lang').forEach((tgl) =>
    tgl.addEventListener('click', () => setTimeout(render, 0)));

  render();
}
