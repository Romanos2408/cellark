/**
 * Cellar·K — Shopify connection config.
 *
 * Fill these in ONCE the Shopify store exists, and the basket's "Checkout — pay by card"
 * button will hand the cart straight to Shopify's secure checkout (which collects the
 * address/ΤΚ, the ΑΦΜ/ΑΑΔΕ details, and takes the card payment).
 *
 * Until `domain` is set, the basket shows a "shop opening soon" state.
 *
 * HOW TO FILL:
 *   domain        → your store domain, e.g. 'cellark.myshopify.com' (or the custom domain
 *                   once connected, e.g. 'shop.cellark.gr').
 *   variants      → each wine's Shopify *variant ID* (a long number). After importing
 *                   docs/shopify-products.csv, get them from Shopify → Products → Export,
 *                   or just send me the store and I'll read them in.
 *   tradeLoginUrl → the Shopify customer login URL for wholesale accounts, e.g.
 *                   'https://cellark.myshopify.com/account/login'  (leave '' to hide).
 */
export const SHOP = {
  domain: '',           // ← e.g. 'cellark.myshopify.com'
  tradeLoginUrl: '',    // ← e.g. 'https://cellark.myshopify.com/account/login'
  variants: {
    'salina-bianco': '',
    'salina-rosso': '',
    'salina-rosato': '',
    'secca-del-capo': '',
    'guardiano-del-faro': '',
    'malvasia-lipari': '',
    'passito': '',
    'mare': '',
    'cariddi-rosato': '',
    'giulia-birbante': '',
    'grillo-acacia': '',
    'viognier': '',
    'nero-davola': '',
  },
};

/** A Shopify cart permalink that pre-loads the basket and goes to secure checkout. */
export function shopifyCheckoutURL(items) {
  if (!SHOP.domain || !items.length) return null;
  // Safety: if ANY item lacks a variant ID, do NOT build a partial checkout
  // (that would silently drop bottles). Fall back to the "shop opening soon"
  // state for the whole basket and warn which mappings are missing.
  const missing = items.filter((i) => !SHOP.variants[i.slug]).map((i) => i.slug);
  if (missing.length) {
    console.warn('[Cellar·K] Missing Shopify variant IDs for:', missing.join(', '),
      '— checkout disabled until added in assets/shop-config.js');
    return null;
  }
  const parts = items.map((i) => `${SHOP.variants[i.slug]}:${i.qty}`);
  return `https://${SHOP.domain}/cart/${parts.join(',')}`;
}
