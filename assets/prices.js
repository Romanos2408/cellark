/**
 * Cellar · K — price display (catalogue cards + basket).
 *
 * Single source of truth, two layers:
 *   1. HARDCODED — `price` on each wine in wines.js (retail €, VAT-inclusive,
 *      matches the Shopify import). Always available, so a price never flashes blank.
 *   2. LIVE (optional) — once `SHOP.livePrices` is on AND the storefront is public,
 *      we fetch Shopify's public products.json and override the hardcoded value, so
 *      the card can never disagree with what the checkout charges. Any failure
 *      (password on / CORS / offline) is swallowed and we keep the hardcoded price.
 *
 * Greek shops show consumer prices VAT-inclusive; shipping is added at checkout.
 */

import { SHOP } from './shop-config.js';

const LANG_KEY = 'cellark.lang';
const lang = () => { try { return localStorage.getItem(LANG_KEY) || 'gr'; } catch { return 'gr'; } };

const BASE = {}; // hardcoded prices, filled from the wines passed to initPrices()
const LIVE = {}; // filled from Shopify if/when available

/** Current best price for a slug: live if we have it, else hardcoded, else null. */
export function getPrice(slug) {
  const v = (slug in LIVE) ? LIVE[slug] : BASE[slug];
  return (typeof v === 'number' && isFinite(v)) ? v : null;
}

/** Format a number as a localized euro string: GR "16,50 €" · EN "€16.50". */
export function formatPrice(value, l = lang()) {
  if (typeof value !== 'number' || !isFinite(value)) return '';
  const n = value.toFixed(2);
  return l === 'gr' ? n.replace('.', ',') + ' €' : '€' + n;
}

/** Paint every [data-price-slug] element with its current price in the current language. */
export function applyPrices() {
  const l = lang();
  document.querySelectorAll('[data-price-slug]').forEach((el) => {
    el.textContent = formatPrice(getPrice(el.getAttribute('data-price-slug')), l);
  });
}

/** Best-effort: pull live prices from Shopify's public products.json, then re-paint. */
async function fetchLivePrices() {
  if (!SHOP.livePrices || !SHOP.domain) return; // off until verified at launch
  try {
    const res = await fetch(`https://${SHOP.domain}/products.json?limit=250`, { mode: 'cors' });
    if (!res.ok) return;
    const data = await res.json();
    (data.products || []).forEach((p) => {
      const v = p.variants && p.variants[0];
      if (p.handle && v && v.price != null) {
        const n = parseFloat(v.price);
        if (isFinite(n)) LIVE[p.handle] = n;
      }
    });
    applyPrices();
  } catch { /* password on / CORS / offline → keep hardcoded prices, silently */ }
}

export function initPrices(wines) {
  (wines || []).forEach((w) => { if (w && w.slug != null) BASE[w.slug] = w.price; });
  applyPrices();
  document.querySelectorAll('.lang').forEach((t) => t.addEventListener('click', () => setTimeout(applyPrices, 0)));
  fetchLivePrices();
}
