/**
 * Cellar · K — basket that hands off to Shopify checkout.
 *
 * Browsing + add-to-basket happen on this custom site (homepage + catalog).
 * Checkout, address/ΤΚ, ΑΦΜ/ΑΑΔΕ and the card payment are all handled by Shopify.
 *
 * Until the store is connected in assets/shop-config.js, the checkout button
 * shows a "shop opening soon" state. State persists in localStorage.
 */

import { SHOP, shopifyCheckoutURL } from './shop-config.js';

const CART_KEY = 'cellark.cart';
const LANG_KEY = 'cellark.lang';
const EMAIL = 'cellarkinfo@gmail.com';

const T = {
  gr: {
    title: 'Το καλάθι σου', empty: 'Το καλάθι σου είναι άδειο.',
    checkout: 'Ολοκλήρωση — Πληρωμή με κάρτα',
    soon: 'Το ηλεκτρονικό κατάστημα ανοίγει σύντομα.',
    enquire: 'Ρωτήστε μας γι’ αυτά τα κρασιά',
    confirm: 'Ασφαλής πληρωμή με κάρτα στο ταμείο· εκεί συμπληρώνετε διεύθυνση & στοιχεία.',
    trade: 'Πελάτης χονδρικής; Σύνδεση',
    clear: 'Άδειασμα', add: 'Προσθήκη στο καλάθι', added: 'Προστέθηκε ✓',
  },
  en: {
    title: 'Your basket', empty: 'Your basket is empty.',
    checkout: 'Checkout — Pay by card',
    soon: 'The online shop opens soon.',
    enquire: 'Ask us about these wines',
    confirm: 'Secure card payment at checkout, where you add your address & details.',
    trade: 'Wholesale customer? Sign in',
    clear: 'Empty', add: 'Add to basket', added: 'Added ✓',
  },
};

let WINES = [];
let els = {};

const lang = () => { try { return localStorage.getItem(LANG_KEY) || 'gr'; } catch { return 'gr'; } };
const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
const setCart = (c) => { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch {} };
const wineOf = (slug) => WINES.find((w) => w.slug === slug);
const count = () => getCart().reduce((n, i) => n + i.qty, 0);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

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

function enquiryHref() {
  const L = lang(), items = getCart();
  const lines = [
    L === 'gr' ? 'Καλησπέρα Cellar · K,' : 'Hello Cellar · K,', '',
    L === 'gr' ? 'Ενδιαφέρομαι για τα παρακάτω κρασιά:' : "I'm interested in these wines:",
  ];
  items.forEach((i) => { const w = wineOf(i.slug); if (w) lines.push(`• ${i.qty}× ${w.name}`); });
  lines.push('', L === 'gr' ? 'Όνομα:' : 'Name:', L === 'gr' ? 'Τηλέφωνο:' : 'Phone:');
  const subj = (L === 'gr' ? 'Ενδιαφέρον για κρασιά' : 'Wine enquiry') + ' — Cellar · K';
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function renderItems() {
  const c = getCart();
  if (!c.length) { els.items.innerHTML = `<p class="cart-empty">${T[lang()].empty}</p>`; return; }
  els.items.innerHTML = c.map((i) => {
    const w = wineOf(i.slug); if (!w) return '';
    return `<div class="cart-line" data-slug="${i.slug}">
      <picture>
        <source srcset="assets/wines/${i.slug}.avif" type="image/avif" />
        <img src="assets/wines/${i.slug}.png" alt="" loading="lazy" decoding="async" />
      </picture>
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

function render() {
  const L = lang(), t = T[L], n = count();
  if (els.count) { els.count.textContent = n; els.count.classList.toggle('on', n > 0); }
  if (!els.items) return;
  if (els.title) els.title.textContent = t.title;

  renderItems();
  els.foot.hidden = (n === 0);

  els.confirm.textContent = t.confirm;
  const url = shopifyCheckoutURL(getCart());
  if (url) {
    els.checkout.hidden = false; els.checkout.href = url; els.checkout.textContent = t.checkout;
    els.soon.hidden = true; els.enquire.hidden = true;
  } else {
    // Shop not connected yet — don't dead-end: let visitors send an enquiry with their basket.
    els.checkout.hidden = true; els.soon.hidden = false; els.soon.textContent = t.soon;
    els.enquire.hidden = false; els.enquire.textContent = t.enquire; els.enquire.href = enquiryHref();
  }
  els.trade.hidden = !SHOP.tradeLoginUrl;
  if (SHOP.tradeLoginUrl) { els.trade.href = SHOP.tradeLoginUrl; els.trade.textContent = t.trade; }
  els.clear.textContent = t.clear;
}

let lastFocus = null;
function openCart() {
  lastFocus = document.activeElement;
  els.drawer.classList.add('open'); els.overlay.classList.add('is-open'); els.drawer.setAttribute('aria-hidden', 'false');
  render();
  requestAnimationFrame(() => { els.close && els.close.focus(); });
}
function closeCart() {
  if (!els.drawer.classList.contains('open')) return;
  els.drawer.classList.remove('open'); els.overlay.classList.remove('is-open'); els.drawer.setAttribute('aria-hidden', 'true');
  if (lastFocus && lastFocus.focus) lastFocus.focus(); else els.btn && els.btn.focus();
}
function trapFocus(e) {
  if (e.key !== 'Tab' || !els.drawer.classList.contains('open')) return;
  const f = els.drawer.querySelectorAll('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])');
  const list = [...f].filter((el) => el.offsetParent !== null);
  if (!list.length) return;
  const first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

export function initCart(wines) {
  WINES = wines || [];
  els = {
    btn: document.getElementById('cartBtn'),
    count: document.getElementById('cartCount'),
    drawer: document.getElementById('cartDrawer'),
    overlay: document.getElementById('cartOverlay'),
    items: document.getElementById('cartItems'),
    foot: document.getElementById('cartFoot'),
    title: document.getElementById('cartTitle'),
    close: document.getElementById('cartClose'),
    confirm: document.getElementById('cartConfirm'),
    checkout: document.getElementById('cartCheckout'),
    soon: document.getElementById('cartSoon'),
    enquire: document.getElementById('cartEnquire'),
    trade: document.getElementById('cartTrade'),
    clear: document.getElementById('cartClear'),
  };
  if (!els.drawer) return;

  els.btn && els.btn.addEventListener('click', openCart);
  els.close.addEventListener('click', closeCart);
  els.overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); trapFocus(e); });
  els.clear.addEventListener('click', clearCart);

  document.addEventListener('click', (e) => {
    const inc = e.target.closest('.qty-inc');
    const dec = e.target.closest('.qty-dec');
    const add = e.target.closest('.add-btn');
    const rm = e.target.closest('.cart-rm');
    if (rm) { removeItem(rm.dataset.slug); return; }
    if (inc || dec) {
      const stepN = inc ? 1 : -1;
      const line = (inc || dec).closest('.cart-line');
      if (line) {
        const slug = line.dataset.slug;
        const cur = getCart().find((i) => i.slug === slug);
        setQty(slug, (cur ? cur.qty : 0) + stepN);
      } else {
        const q = (inc || dec).closest('.qty');
        const val = q && q.querySelector('.qty-val');
        if (val) { let m = parseInt(val.textContent, 10) || 1; m = Math.max(1, m + stepN); val.textContent = m; }
      }
      return;
    }
    if (add) {
      const slug = add.dataset.slug;
      const q = add.closest('.wine-actions, .card-actions').querySelector('.qty .qty-val');
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

  document.querySelectorAll('.lang').forEach((tgl) =>
    tgl.addEventListener('click', () => setTimeout(render, 0)));

  render();
}
