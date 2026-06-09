(() => {
  "use strict";

  /* ---------- State ---------- */
  const KEY = "cellark.catalogue.lang";
  const MODE_KEY = "cellark.catalogue.mode";
  const STATE = {
    lang: (() => { try { return localStorage.getItem(KEY) || "gr"; } catch { return "gr"; } })(),
    mode: (() => { try { return localStorage.getItem(MODE_KEY) || "retail"; } catch { return "retail"; } })(),
    data: null,
    cat: "all",
    query: "",
  };

  const LABELS = {
    gr: {
      searchPlaceholder: "Αναζήτηση κρασιού, ποικιλίας, περιοχής…",
      all: "Όλα",
      empty: "Δεν βρέθηκαν κρασιά.",
      labels: (n) => `${n} ${n === 1 ? "ετικέτα" : "ετικέτες"}`,
      legal: "Απολαύστε υπεύθυνα · 18+",
      followLabel: "Instagram",
      retail: "Λιανική",
      wholesale: "Χονδρική",
      priceTBD: "—",
      askPrice: "Κατόπιν συνεννόησης",
    },
    en: {
      searchPlaceholder: "Search wine, grape, region…",
      all: "All",
      empty: "No wines found.",
      labels: (n) => `${n} ${n === 1 ? "label" : "labels"}`,
      legal: "Please enjoy responsibly · 18+",
      followLabel: "Instagram",
      retail: "Retail",
      wholesale: "Wholesale",
      priceTBD: "—",
      askPrice: "On request",
    },
  };

  const lkey = () => (STATE.lang === "en" ? "en" : "gr");
  const t = () => LABELS[lkey()];
  const pick = (obj, base) => obj[`${base}_${lkey()}`] ?? obj[`${base}_gr`] ?? "";

  const currency = () => (STATE.data && STATE.data.pricing && STATE.data.pricing.currency) || "EUR";
  const fmtPrice = (n) =>
    n == null ? null
      : new Intl.NumberFormat(lkey() === "en" ? "en-IE" : "el-GR",
          { style: "currency", currency: currency() }).format(n);
  const pickPrice = (w) =>
    (STATE.mode === "wholesale" ? w.price_wholesale : w.price_retail) ?? null;
  const wholesaleOn = () => !!(STATE.data && STATE.data.pricing && STATE.data.pricing.show_wholesale);

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Static (data-gr / data-en) text ---------- */
  function applyStatic() {
    const lang = lkey();
    document.documentElement.lang = lang === "en" ? "en" : "el";
    document.querySelectorAll("[data-gr]").forEach((node) => {
      const txt = node.getAttribute("data-" + lang);
      if (txt != null) node.textContent = txt;
    });
    document.querySelectorAll(".lang [data-lang]").forEach((s) => {
      s.classList.toggle("on", s.getAttribute("data-lang") === lang);
    });
    if (STATE.data) {
      $("#tagline").textContent = pick(STATE.data.shop, "tagline");
    }
    const search = $("#search");
    if (search) search.placeholder = t().searchPlaceholder;
  }

  /* ---------- Tabs ---------- */
  function buildTabs() {
    const host = $("#tabs");
    host.innerHTML = "";
    const cats = [{ id: "all" }, ...STATE.data.categories];
    cats.forEach((c) => {
      const b = el("button", "tab");
      b.type = "button";
      b.dataset.cat = c.id;
      b.textContent = c.id === "all" ? t().all : pick(c, "name");
      b.classList.toggle("on", STATE.cat === c.id);
      b.addEventListener("click", () => {
        STATE.cat = c.id;
        host.querySelectorAll(".tab").forEach((x) => x.classList.toggle("on", x.dataset.cat === c.id));
        renderGrid();
      });
      host.appendChild(b);
    });
  }

  /* ---------- Cards ---------- */
  function matchesQuery(w, q) {
    if (!q) return true;
    const fields = [w.name, w.grape, w.note_gr, w.note_en, w.type_gr, w.type_en];
    return fields.some((f) => f && f.toLowerCase().includes(q));
  }

  function buildCard(w) {
    const card = el("article", "card");

    const photo = el("div", "card-photo");
    const badge = el("span", "card-badge");
    badge.textContent = pick(w, "sweet");
    const pic = document.createElement("picture");
    pic.innerHTML =
      `<source srcset="assets/wines/${esc(w.slug)}.avif" type="image/avif">` +
      `<img src="assets/wines/${esc(w.slug)}.png" alt="${esc(w.name)}" loading="lazy" decoding="async">`;
    photo.append(badge, pic);

    const body = el("div", "card-body");

    const type = el("div", "card-type");
    type.textContent = pick(w, "type");

    const name = el("div", "card-name");
    name.textContent = w.name;

    const grape = el("div", "card-grape");
    grape.textContent = w.grape;

    const note = el("p", "card-note");
    note.textContent = pick(w, "note");

    const specs = el("div", "card-specs");
    [w.abv, pick(w, "serve")].filter(Boolean).forEach((s) => {
      const sp = el("span", "spec");
      sp.textContent = s;
      specs.appendChild(sp);
    });

    const price = el("div", "card-price");
    const tier = el("span", "card-price-tier");
    tier.textContent = STATE.mode === "wholesale" ? t().wholesale : t().retail;
    const amount = el("span", "card-price-amount");
    const formatted = fmtPrice(pickPrice(w));
    if (formatted) {
      amount.textContent = formatted;
    } else {
      amount.textContent = t().priceTBD;
      amount.classList.add("is-empty");
      amount.title = t().askPrice;
    }
    price.append(tier, amount);

    body.append(type, name, grape, note, specs, price);
    card.append(photo, body);
    return card;
  }

  /* ---------- Grid ---------- */
  function renderGrid() {
    const root = $("#app");
    root.innerHTML = "";
    const q = STATE.query.trim().toLowerCase();

    const cats = STATE.data.categories.filter((c) => STATE.cat === "all" || c.id === STATE.cat);

    let total = 0;
    cats.forEach((c) => {
      const wines = STATE.data.wines.filter((w) => w.cat === c.id && matchesQuery(w, q));
      if (!wines.length) return;
      total += wines.length;

      const group = el("section", "cat-group");

      const title = el("h2", "cat-group-title");
      title.textContent = pick(c, "name");
      const count = el("span", "cat-group-count");
      count.textContent = t().labels(wines.length);
      title.appendChild(count);

      const rule = el("div", "cat-rule");
      const grid = el("div", "grid");
      wines.forEach((w) => grid.appendChild(buildCard(w)));

      group.append(title, rule, grid);
      root.appendChild(group);
    });

    if (!total) {
      const empty = el("p", "empty");
      empty.textContent = t().empty;
      root.appendChild(empty);
    }
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const foot = $("#foot");
    foot.innerHTML = "";
    const shop = STATE.data.shop;

    const socials = el("div", "foot-socials");
    if (shop.instagram_url) {
      const a = el("a", "foot-social");
      a.href = shop.instagram_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML =
        `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>` +
        `<span>${esc(shop.instagram_handle || t().followLabel)}</span>`;
      socials.appendChild(a);
    }

    const legal = el("span", "foot-legal");
    const pricing = STATE.data.pricing;
    const note = pricing && (lkey() === "en" ? pricing.note_en : pricing.note_gr);
    legal.textContent = note ? `${note}  ·  ${t().legal}` : t().legal;

    foot.append(socials, legal);
  }

  /* ---------- Retail / wholesale toggle ---------- */
  function buildModeToggle() {
    const host = $("#pricing-toggle");
    host.innerHTML = "";
    if (!wholesaleOn()) { host.hidden = true; return; }
    host.hidden = false;
    const seg = el("div", "pm-seg");
    [["retail", t().retail], ["wholesale", t().wholesale]].forEach(([m, label]) => {
      const b = el("button", "pm-btn");
      b.type = "button";
      b.dataset.mode = m;
      b.textContent = label;
      b.setAttribute("aria-pressed", String(STATE.mode === m));
      b.classList.toggle("on", STATE.mode === m);
      b.addEventListener("click", () => setMode(m));
      seg.appendChild(b);
    });
    host.appendChild(seg);
  }

  function setMode(m) {
    STATE.mode = m;
    try { localStorage.setItem(MODE_KEY, m); } catch { /* ignore */ }
    buildModeToggle();
    renderGrid();
  }

  /* ---------- Language toggle ---------- */
  function setLang(lang) {
    STATE.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
    applyStatic();
    buildModeToggle();
    buildTabs();
    renderGrid();
    renderFooter();
  }

  function bindLang() {
    const btn = $("#lang");
    btn.addEventListener("click", () => setLang(STATE.lang === "gr" ? "en" : "gr"));
  }

  function bindSearch() {
    $("#search").addEventListener("input", (e) => {
      STATE.query = e.target.value;
      renderGrid();
    });
  }

  /* ---------- Boot ---------- */
  async function init() {
    bindLang();
    bindSearch();
    try {
      const res = await fetch("wines.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      STATE.data = await res.json();
    } catch (err) {
      console.error("Failed to load wines.json", err);
      $("#app").innerHTML = `<p class="empty">⚠️ Could not load the catalogue. Please refresh.</p>`;
      return;
    }
    if (!wholesaleOn()) STATE.mode = "retail";
    applyStatic();
    buildModeToggle();
    buildTabs();
    renderGrid();
    renderFooter();
  }

  init();
})();
