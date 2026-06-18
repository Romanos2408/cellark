/**
 * Greek ΑΦΜ (VAT number) validation — format + mod‑11 check digit.
 *
 * Pure and dependency‑free. This is the SAME checksum the tax authority uses,
 * so it instantly rejects typos and made‑up numbers before an order is placed.
 * Reusable as‑is in a Shopify checkout Function later.
 *
 * What it does NOT do: prove the number actually belongs to the buyer, or that
 * the business is active. That needs the AADE registry lookup, which runs
 * server‑side with secret GSIS credentials (see OWNER-SETUP.md, "AADE check").
 */

export function normalizeAFM(input) {
  return String(input == null ? '' : input).replace(/\D/g, '');
}

export function isValidAFM(input) {
  const afm = normalizeAFM(input);
  if (afm.length !== 9) return false;
  if (/^0+$/.test(afm)) return false; // all‑zeros is never a real ΑΦΜ
  // weighted sum of the first 8 digits: d1·2^8 + d2·2^7 + … + d8·2^1
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(afm[i]) * (1 << (8 - i));
  const check = (sum % 11) % 10; // a remainder of 10 maps to check digit 0
  return check === Number(afm[8]);
}
