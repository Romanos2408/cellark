/**
 * Cellar·K — age-gate modal (M5)
 *
 * UX-level "are you 18+ ?" gate. Not a security control; real verification
 * lives at checkout via the commerce platform (see docs/SITEMAP.md).
 *
 * Behavior:
 *   - First visit: inject branded modal, lock scroll, trap focus, ask Yes/No.
 *   - "Yes, I am 18+" → persist `cellark.ageConfirmed = 'true'` to localStorage,
 *     fade out, remove.
 *   - "No" → swap modal to a calm farewell card. Refresh re-opens the gate.
 *   - Returning visit (localStorage flag set): never injects.
 *   - Reduced-motion: instant in/out, no fade.
 *
 * Copy renders in the saved language (cellark.lang, Greek default) so the gate
 * matches the rest of the page without depending on the i18n DOM pass — it is
 * injected after initI18n() has already run.
 *
 * Each page calls `initAgeGate()` from its inline module <script>, alongside
 * `initMotion()`. Deliberately separate from motion.js so a future page
 * creator sees two distinct imports and can't accidentally skip one.
 */

const STORAGE_KEY = 'cellark.ageConfirmed';
const LANG_KEY = 'cellark.lang';

function readLang() {
  try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'gr'; }
  catch (_) { return 'gr'; }
}

const COPY = {
  gr: {
    brand: 'Cellar · K',
    eyebrowEnter: 'Πριν συνεχίσετε',
    title: 'Έχετε τη νόμιμη ηλικία κατανάλωσης;',
    desc: 'Το Cellar · K απευθύνεται σε ενήλικες — 18+ στην Ελλάδα. Συνεχίζοντας, επιβεβαιώνετε ότι έχετε τη νόμιμη ηλικία και θα απολαύσετε υπεύθυνα.',
    yes: 'Ναι, είμαι 18+',
    no: 'Όχι',
    eyebrowBye: 'Επιστρέψτε αργότερα',
    byeTitle: 'Ευχαριστούμε για την επίσκεψη.',
    byeDesc: 'Το Cellar · K απευθύνεται σε ενήλικες νόμιμης ηλικίας. Απολαύστε υπεύθυνα.',
  },
  en: {
    brand: 'Cellar · K',
    eyebrowEnter: 'Before you enter',
    title: 'Are you of legal drinking age?',
    desc: 'Cellar · K serves adults — 18+ in Greece. By entering, you confirm you are of legal drinking age and will enjoy responsibly.',
    yes: 'Yes, I am 18+',
    no: 'No',
    eyebrowBye: 'Come back later',
    byeTitle: 'Thanks for stopping by.',
    byeDesc: 'Cellar · K is reserved for adults of legal drinking age. Please enjoy responsibly.',
  },
};

function readConfirmed() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
  catch (_) { return false; }
}

function writeConfirmed() {
  try { localStorage.setItem(STORAGE_KEY, 'true'); }
  catch (_) { /* private-mode / blocked storage — degrade silently */ }
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function buildModal(t) {
  const root = document.createElement('div');
  root.className = 'age-gate';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'ag-title');
  root.setAttribute('aria-describedby', 'ag-desc');
  root.innerHTML = `
    <div class="age-gate-overlay" aria-hidden="true"></div>
    <div class="age-gate-card" role="document">
      <p class="ag-brand">${t.brand}</p>
      <p class="ag-eyebrow eyebrow">${t.eyebrowEnter}</p>
      <h2 id="ag-title">${t.title}</h2>
      <p id="ag-desc">${t.desc}</p>
      <div class="ag-actions">
        <button class="btn solid ag-yes" type="button">${t.yes}</button>
        <button class="btn ag-no" type="button">${t.no}</button>
      </div>
    </div>
  `;
  return root;
}

function showFarewell(root, t) {
  const card = root.querySelector('.age-gate-card');
  card.innerHTML = `
    <p class="ag-brand">${t.brand}</p>
    <p class="ag-eyebrow eyebrow">${t.eyebrowBye}</p>
    <h2 id="ag-title">${t.byeTitle}</h2>
    <p id="ag-desc">${t.byeDesc}</p>
  `;
}

function dismiss(root, onDone) {
  const dur = reducedMotion() ? 0 : 320;
  root.classList.add('is-leaving');
  setTimeout(() => {
    root.remove();
    document.documentElement.classList.remove('age-gating');
    document.body.style.overflow = '';
    onDone && onDone();
  }, dur);
}

function trapFocus(root) {
  /* Only the two action buttons are focusable inside the gate. */
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(root.querySelectorAll('button:not([disabled])'));
    if (focusable.length === 0) return;
    const dir = e.shiftKey ? -1 : 1;
    const idx = focusable.indexOf(document.activeElement);
    let next = idx + dir;
    if (next < 0) next = focusable.length - 1;
    if (next >= focusable.length) next = 0;
    focusable[next].focus();
    e.preventDefault();
  });
}

export function initAgeGate() {
  if (readConfirmed()) return;

  const t = COPY[readLang()];
  const root = buildModal(t);
  document.body.appendChild(root);
  document.documentElement.classList.add('age-gating');
  document.body.style.overflow = 'hidden';

  /* Fade in next frame (avoids flash before transition can start). */
  requestAnimationFrame(() => root.classList.add('is-ready'));

  const yesBtn = root.querySelector('.ag-yes');
  const noBtn  = root.querySelector('.ag-no');

  /* Initial focus — one frame later so SR announces the dialog. */
  requestAnimationFrame(() => yesBtn.focus());

  yesBtn.addEventListener('click', () => {
    writeConfirmed();
    dismiss(root);
  });

  noBtn.addEventListener('click', () => {
    /* No localStorage write — the user did not confirm. */
    showFarewell(root, t);
  });

  trapFocus(root);
}
