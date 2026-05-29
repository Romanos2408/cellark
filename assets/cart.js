/**
 * Cellar·K — client-side basket (no backend).
 *
 * State persists to localStorage:
 *   cellark.cart  → [{ slug, qty }]
 *   cellark.mode  → 'retail' | 'wholesale'   (Λιανική / Χονδρική)
 *   cellark.lang  → 'gr' | 'en'              (shared with i18n.js)
 *
 * There are no prices yet, so the basket is an *enquiry* basket: checkout
 * compiles the order (wines + quantities + retail/wholesale) into a
 * pre-filled email or WhatsApp message. Real card payments are intended to
 * be added later via a commerce platform (Shopify/Viva Wallet/Stripe).
 */

const CART_KEY = 'cellark.cart';
const MODE_KEY = 'cellark.mode';
const LANG_KEY = 'cellark.lang';

const EMAIL = 'cellarkinfo@gmail.com';
const WHATSAPP = '306972845565'; // +30 6972845565

const T = {
  gr: {
    title: 'Το καλάθι σου', empty: 'Το καλάθι σου είναι άδειο.',
    modeLabel: 'Τιμοκατάλογος', retail: 'Λιανική', wholesale: 'Χονδρική',
    retailHint: 'Ιδιώτες · τιμές με ΦΠΑ', wholesaleHint: 'Επιχειρήσεις · χωρίς ΦΠΑ, ανά κιβώτιο',
    confirmNote: 'Τιμές & διαθεσιμότητα επιβεβαιώνονται με την παραγγελία.',
    email: 'Παραγγελία με Email', whatsapp: 'Παραγγελία στο WhatsApp',
    clear: 'Άδειασμα', add: 'Προσθήκη στο καλάθι', added: 'Προστέθηκε ✓',
  },
  en: {
    title: 'Your basket', empty: 'Your basket is empty.',
    modeLabel: 'Price list', retail: 'Retail', wholesale: 'Wholesale',
    retailHint: 'Individuals · prices incl. VAT', wholesaleHint: 'Businesses · excl. VAT, by the case',
    confirmNote: 'Prices & availability confirmed on order.',
    email: 'Order by Email', whatsapp: 'Order on WhatsApp',
    clear: 'Empty', add: 'Add to basket', added: 'Added ✓',
  },
};

let WINES = [];

/* ---- storage helpers ---- */
const lang = () => { try { return localStorage.getItem(LANG_KEY) || 'gr'; } catch { return 'gr'; } };
const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
const setCart = (c) => { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch {} };
const getMode = () => { try { return localStorage.getItem(MODE_KEY) || 'retail'; } catch { return 'retail'; } };
const setMode = (m) => { try { localStorage.setItem(MODE_KEY, m); } catch {} };
const wineOf = (slug) => WINES.find((w) => w.slug === slug);
const count = () => getCart().reduce((n, i) => n + i.qty, 0);

/* ---- mutations ---- */
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

/* ---- order text → email + WhatsApp ---- */
function orderText() {
  const L = lang(), t = T[L], mode = getMode(), c = getCart();
  const lines = [];
  lines.push(L === 'gr' ? 'Καλησπέρα Cellar·K,' : 'Hello Cellar·K,');
  lines.push('');
  lines.push((L === 'gr' ? 'Παραγγελία' : 'Order') + ` (${t[mode]}):`);
  c.forEach((i) => { const w = wineOf(i.slug); if (w) lines.push(`• ${i.qty}× ${w.name}`); });
  lines.push('');
  if (mode === 'wholesale') {
    lines.push(L === 'gr' ? '— Στοιχεία επιχείρησης —' : '— Business details —');
    lines.push(L === 'gr' ? 'Επιχείρηση:' : 'Business:');
    lines.push(L === 'gr' ? 'ΑΦΜ / ΔΟΥ:' : 'VAT no.:');
    lines.push(L === 'gr' ? 'Υπεύθυνος:' : 'Contact:');
    lines.push(L === 'gr' ? 'Τηλέφωνο:' : 'Phone:');
    lines.push(L === 'gr' ? 'Περιοχή:' : 'Region:');
  } else {
    lines.push(L === 'gr' ? 'Όνομα:' : 'Name:');
    lines.push(L === 'gr' ? 'Τηλέφωνο:' : 'Phone:');
    lines.push(L === 'gr' ? 'Διεύθυνση παράδοσης:' : 'Delivery address:');
  }
  return lines.join('\n');
}
function subjectText() {
  const t = T[lang()];
  return `${lang() === 'gr' ? 'Παραγγελία' : 'Order'} — ${t[getMode()]} · Cellar·K`;
}
function emailHref() {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subjectText())}&body=${encodeURIComponent(orderText())}`;
}
function whatsappHref() {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(subjectText() + '\n\n' + orderText())}`;
}

/* ---- render ---- */
let els = {};
function render() {
  const L = lang(), t = T[L], c = getCart(), mode = getMode();

  // badge
  if (els.count) {
    const n = count();
    els.count.textContent = n;
    els.count.classList.toggle('on', n > 0);
  }
  // mode toggle active state
  document.querySelectorAll('#modeToggle [data-mode]').forEach((b) =>
    b.classList.toggle('active', b.dataset.mode === mode));
  // current-mode pill in the drawer
  const pill = document.querySelector('[data-mode-current]');
  if (pill) pill.textContent = `${t[mode]} · ${mode === 'wholesale' ? t.wholesaleHint : t.retailHint}`;

  if (!els.items) return;

  // drawer title + static labels
  if (els.title) els.title.textContent = t.title;
  if (els.confirm) els.confirm.textContent = t.confirmNote;
  if (els.emailBtn) { els.emailBtn.textContent = t.email; els.emailBtn.href = emailHref(); }
  if (els.waBtn) { els.waBtn.textContent = t.whatsapp; els.waBtn.href = whatsappHref(); }
  if (els.clearBtn) els.clearBtn.textContent = t.clear;

  if (!c.length) {
    els.items.innerHTML = `<p class="cart-empty">${t.empty}</p>`;
    els.foot && els.foot.setAttribute('hidden', '');
    return;
  }
  els.foot && els.foot.removeAttribute('hidden');
  els.items.innerHTML = c.map((i) => {
    const w = wineOf(i.slug); if (!w) return '';
    return `<div class="cart-line" data-slug="${i.slug}">
      <img src="assets/wines/${i.slug}.png" alt="" loading="lazy" />
      <div class="cart-line-info">
        <p class="cart-line-name">${w.name}</p>
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

/* ---- drawer open/close ---- */
function openCart() {
  els.drawer && els.drawer.classList.add('open');
  els.overlay && els.overlay.removeAttribute('hidden');
  els.drawer && els.drawer.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  els.drawer && els.drawer.classList.remove('open');
  els.overlay && els.overlay.setAttribute('hidden', '');
  els.drawer && els.drawer.setAttribute('aria-hidden', 'true');
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
    confirm: document.getElementById('cartConfirm'),
    emailBtn: document.getElementById('cartEmail'),
    waBtn: document.getElementById('cartWhatsapp'),
    clearBtn: document.getElementById('cartClear'),
    close: document.getElementById('cartClose'),
  };

  // open / close
  els.btn && els.btn.addEventListener('click', openCart);
  els.close && els.close.addEventListener('click', closeCart);
  els.overlay && els.overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

  // mode toggle
  document.querySelectorAll('#modeToggle [data-mode]').forEach((b) =>
    b.addEventListener('click', () => { setMode(b.dataset.mode); render(); }));

  // clear
  els.clearBtn && els.clearBtn.addEventListener('click', clearCart);

  // delegated clicks: product steppers, add buttons, drawer steppers, remove
  document.addEventListener('click', (e) => {
    const inc = e.target.closest('.qty-inc');
    const dec = e.target.closest('.qty-dec');
    const add = e.target.closest('.add-btn');
    const rm = e.target.closest('.cart-rm');

    if (rm) { removeItem(rm.dataset.slug); return; }

    if (inc || dec) {
      const step = inc ? 1 : -1;
      const line = (inc || dec).closest('.cart-line');
      if (line) {                                    // editing a basket line
        const slug = line.dataset.slug;
        const cur = getCart().find((i) => i.slug === slug);
        setQty(slug, (cur ? cur.qty : 0) + step);
      } else {                                       // product quantity stepper
        const q = (inc || dec).closest('.qty');
        const val = q && q.querySelector('.qty-val');
        if (val) { let n = parseInt(val.textContent, 10) || 1; n = Math.max(1, n + step); val.textContent = n; }
      }
      return;
    }

    if (add) {
      const slug = add.dataset.slug;
      const q = add.closest('.wine-actions').querySelector('.qty .qty-val');
      const qty = q ? (parseInt(q.textContent, 10) || 1) : 1;
      addItem(slug, qty);
      if (q) q.textContent = '1';            // reset stepper after adding
      openCart();
      const label = add.querySelector('.add-label') || add;
      const prev = label.textContent;
      label.textContent = T[lang()].added;
      setTimeout(() => { label.textContent = prev; }, 1100);
    }
  });

  // re-localise drawer when the language toggle is used
  document.querySelectorAll('.lang').forEach((tgl) =>
    tgl.addEventListener('click', () => setTimeout(render, 0)));

  render();
}
