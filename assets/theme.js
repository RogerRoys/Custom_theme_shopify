/* Momemade theme JS — one motion language: cubic-bezier(.2,.8,.2,1) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const M = window.Momemade || { routes: {} };
  const R = M.routes || {};
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const designMode = !!(window.Shopify && window.Shopify.designMode);
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  /* ---------- Money ---------- */
  function money(cents) {
    const fmt = M.moneyFormat || '${{amount}}';
    const n = (cents || 0) / 100;
    const fix = (v, d, ts, ds) => { const p = v.toFixed(d).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ts) + (p[1] ? ds + p[1] : ''); };
    const m = fmt.match(/\{\{\s*(\w+)\s*\}\}/);
    const key = m ? m[1] : 'amount';
    const map = {
      amount: fix(n, 2, ',', '.'),
      amount_no_decimals: fix(n, 0, ',', '.'),
      amount_with_comma_separator: fix(n, 2, '.', ','),
      amount_no_decimals_with_comma_separator: fix(n, 0, '.', ','),
      amount_with_apostrophe_separator: fix(n, 2, "'", '.')
    };
    return fmt.replace(/\{\{\s*\w+\s*\}\}/, map[key] || map.amount);
  }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#Toast'); if (!t || !msg) return;
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2400);
  }

  /* ---------- Overlays (menu, cart, search) ---------- */
  const ov = id => $('.overlay[data-overlay="' + id + '"]');
  function openOv(id) {
    $$('.overlay.is-open').forEach(o => { if (o.dataset.overlay !== id) closeOv(o.dataset.overlay, true); });
    const el = ov(id); if (!el) return;
    el._last = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    const f = $('[data-autofocus]', el) || $('button, a, input', el);
    setTimeout(() => f && f.focus({ preventScroll: true }), 320);
  }
  function closeOv(id, silent) {
    const el = ov(id); if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    if (!$('.overlay.is-open')) document.body.classList.remove('is-locked');
    if (!silent && el._last && el._last.focus) el._last.focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o && ov(o.dataset.open)) { e.preventDefault(); openOv(o.dataset.open); return; }
    const c = e.target.closest('[data-close]');
    if (c) {
      const nav = c.tagName === 'A' && c.getAttribute('href') && c.getAttribute('href') !== '#';
      if (!nav) e.preventDefault();
      closeOv(c.dataset.close, nav);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.overlay.is-open').forEach(o => closeOv(o.dataset.overlay)); });

  /* ---------- Header ---------- */
  function initHeader() {
    const h = $('.header--overlay'); if (!h || h._init) return; h._init = 1;
    const on = () => h.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true }); on();
  }

  /* ---------- Scroll reveal + count-up ---------- */
  function countUp(el) {
    if (el._done) return; el._done = 1;
    const to = parseFloat(el.dataset.count) || 0;
    if (reduce) { el.textContent = to.toLocaleString(); return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function reveal(el) {
    el.classList.add('is-in');
    $$('[data-count]', el).forEach(countUp);
    if (el.matches('[data-count]')) countUp(el);
    const d = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
    setTimeout(() => el.classList.add('is-done'), d + 1100);
  }
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); reveal(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;
  function observe(root) {
    $$('[data-reveal], [data-inview]', root || document).forEach(el => {
      if (el._obs) return; el._obs = 1;
      if (io && !reduce) {
        $$('[data-count]', el).forEach(c => { if (!c._done) c.textContent = '0'; });
        io.observe(el);
      } else reveal(el);
    });
  }

  /* ---------- Videos ---------- */
  const visible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const playV = v => { if (reduce) return; v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const vio = ('IntersectionObserver' in window) ? new IntersectionObserver(es => es.forEach(e => {
    const v = e.target; if (e.isIntersecting && visible(v)) playV(v); else v.pause();
  }), { threshold: 0.2 }) : null;
  function observeVideos(root) {
    $('.jcard__video', root || document).forEach(v => { if (v._vo) return; v._vo = 1; v.muted = true; if (vio) vio.observe(v); else playV(v); });
  }

  /* ---------- Hero slideshow ---------- */
  class HeroSlideshow extends HTMLElement {
    connectedCallback() {
      this.slides = $$('.hero__slide', this);
      this.i = 0;
      this.ms = (parseFloat(this.dataset.speed) || 6.5) * 1000;
      this.auto = this.dataset.autoplay === 'true' && !reduce;
      this.bar = $('.hero__bar i', this);
      this.lbl = $('[data-label]', this);
      const p = $('[data-prev]', this), n = $('[data-next]', this);
      p && p.addEventListener('click', () => this.go(this.i - 1));
      n && n.addEventListener('click', () => this.go(this.i + 1));
      this.addEventListener('touchstart', e => { this.x = e.touches[0].clientX; }, { passive: true });
      this.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - (this.x || 0); if (Math.abs(dx) > 50) this.go(this.i + (dx < 0 ? 1 : -1)); });
      this._vis = () => { if (document.hidden) clearTimeout(this.t); else this.go(this.i); };
      document.addEventListener('visibilitychange', this._vis);
      this.addEventListener('shopify:block:select', e => { const k = this.slides.indexOf(e.target); if (k > -1) { this.paused = true; this.go(k); } });
      this.addEventListener('shopify:block:deselect', () => { this.paused = false; this.go(this.i); });
      $$('video', this).forEach(v => { v.muted = true; v.playsInline = true; });
      this._mq = window.matchMedia('(max-width: 759px)');
      this._mqf = () => this.syncVideos();
      this._mq.addEventListener ? this._mq.addEventListener('change', this._mqf) : this._mq.addListener(this._mqf);
      this._io = ('IntersectionObserver' in window) ? new IntersectionObserver(es => { this.onScreen = es[0].isIntersecting; this.syncVideos(); }) : null;
      this.onScreen = true; this._io && this._io.observe(this);
      this.go(0);
    }
    disconnectedCallback() { clearTimeout(this.t); document.removeEventListener('visibilitychange', this._vis); this._io && this._io.disconnect(); }
    syncVideos() {
      this.slides.forEach((s, k) => $$('video', s).forEach(v => {
        if (k === this.i && this.onScreen && visible(v) && !document.hidden) { if (v.paused) playV(v); }
        else if (!v.paused) v.pause();
      }));
    }
    go(n) {
      const N = this.slides.length; if (!N) return;
      n = ((n % N) + N) % N; clearTimeout(this.t);
      this.slides.forEach((s, k) => {
        s.classList.toggle('is-active', k === n);
        s.setAttribute('aria-hidden', k === n ? 'false' : 'true');
        if (k !== n) setTimeout(() => { if (!s.classList.contains('is-active')) s.classList.remove('is-in'); }, 1000);
      });
      const s = this.slides[n];
      s.classList.remove('is-in'); void s.offsetWidth;
      requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add('is-in')));
      this.i = n;
      this.syncVideos();
      if (this.lbl) this.lbl.textContent = (n + 1) + '/' + N;
      const run = this.auto && N > 1 && !this.paused;
      if (this.bar) {
        this.bar.style.transition = 'none'; this.bar.style.width = '0'; void this.bar.offsetWidth;
        if (run) { this.bar.style.transition = 'width ' + this.ms + 'ms linear'; this.bar.style.width = '100%'; }
      }
      if (run) this.t = setTimeout(() => this.go(this.i + 1), this.ms);
    }
  }
  if (!customElements.get('hero-slideshow')) customElements.define('hero-slideshow', HeroSlideshow);

  /* ---------- Testimonials loop slider ---------- */
  class ReviewSlider extends HTMLElement {
    connectedCallback() {
      this.vp = $('.rslider', this); this.track = $('.rslider__track', this);
      if (!this.track) return;
      const orig = $$('.rcard', this.track); this.n = orig.length; if (!this.n) return;
      if (this.n > 1) {
        const clone = c => { const x = c.cloneNode(true); x.setAttribute('aria-hidden', 'true'); x.removeAttribute('data-shopify-editor-block'); $$('a', x).forEach(a => a.tabIndex = -1); return x; };
        this.track.prepend(...orig.map(clone));
        this.track.append(...orig.map(clone));
      }
      this.cards = $$('.rcard', this.track);
      this.p = this.n > 1 ? this.n : 0;
      this.dots = $$('.rdots button', this);
      this.cards.forEach((c, k) => c.addEventListener('click', e => { if (k !== this.p && !e.target.closest('a')) this.go(k); }));
      const prev = $('[data-prev]', this), next = $('[data-next]', this);
      prev && prev.addEventListener('click', () => this.go(this.p - 1));
      next && next.addEventListener('click', () => this.go(this.p + 1));
      this.dots.forEach((d, k) => d.addEventListener('click', () => this.go((this.n > 1 ? this.n : 0) + k)));
      this.vp.addEventListener('touchstart', e => { this.x = e.touches[0].clientX; }, { passive: true });
      this.vp.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - (this.x || 0); if (Math.abs(dx) > 40) this.go(this.p + (dx < 0 ? 1 : -1)); });
      this.track.addEventListener('transitionend', e => {
        if (e.target !== this.track || e.propertyName !== 'transform' || this.n < 2) return;
        clearTimeout(this._st);
        if (this.p < this.n || this.p >= 2 * this.n) { this.p = this.n + ((this.p % this.n) + this.n) % this.n; this.place(false); }
      });
      this._rs = () => this.place(false);
      window.addEventListener('resize', this._rs);
      this.addEventListener('shopify:block:select', e => { const k = this.cards.indexOf(e.target); if (k > -1) this.go(k); });
      requestAnimationFrame(() => this.place(false));
    }
    disconnectedCallback() { window.removeEventListener('resize', this._rs); }
    go(p) {
      const n = this.n;
      if (n > 1 && (this.p < n || this.p >= 2 * n)) {
        const norm = n + ((this.p % n) + n) % n, target = p + norm - this.p;
        this.p = norm; this.place(false);
        requestAnimationFrame(() => requestAnimationFrame(() => { this.p = target; this.place(true); this.arm(); }));
        return;
      }
      this.p = p; this.place(true); this.arm();
    }
    arm() {
      clearTimeout(this._st);
      this._st = setTimeout(() => {
        const n = this.n; if (n < 2) return;
        if (this.p < n || this.p >= 2 * n) { this.p = n + ((this.p % n) + n) % n; this.place(false); }
      }, 1250);
    }
    place(anim) {
      const c = this.cards[this.p]; if (!c) return;
      const x = this.vp.clientWidth / 2 - (c.offsetLeft + c.offsetWidth / 2);
      if (!anim) this.track.classList.add('is-snapping');
      this.track.style.transform = 'translate3d(' + x + 'px,0,0)';
      this.cards.forEach((k, j) => k.classList.toggle('is-active', j === this.p));
      const ri = ((this.p % this.n) + this.n) % this.n;
      this.dots.forEach((d, j) => { d.classList.toggle('is-active', j === ri); d.setAttribute('aria-current', j === ri ? 'true' : 'false'); });
      if (!anim) { void this.track.offsetWidth; requestAnimationFrame(() => requestAnimationFrame(() => this.track.classList.remove('is-snapping'))); }
    }
  }
  if (!customElements.get('review-slider')) customElements.define('review-slider', ReviewSlider);

  /* ---------- Cart ---------- */
  const isCartPage = () => document.body.classList.contains('template-cart');
  function setCount(c) {
    $$('[data-cart-count]').forEach(el => { el.textContent = c; el.hidden = !c; });
  }
  function bump() {
    $$('[data-cart-icon]').forEach(el => { el.classList.add('is-bump'); setTimeout(() => el.classList.remove('is-bump'), 300); });
  }
  function renderDrawer(sections) {
    const html = sections && sections['cart-drawer']; if (!html) return;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const next = doc.querySelector('#CartDrawerInner'), cur = $('#CartDrawerInner');
    if (!next || !cur) return;
    const oldMeter = $('.meter i', cur), newMeter = $('.meter i', next);
    const from = oldMeter ? oldMeter.style.width : '0%', to = newMeter ? newMeter.style.width : '';
    if (newMeter) newMeter.style.width = from;
    $(':scope > *', next).forEach(x => { x.style.transition = 'none'; });
    cur.replaceWith(next);
    requestAnimationFrame(() => requestAnimationFrame(() => $(':scope > *', next).forEach(x => { x.style.transition = ''; })));
    if (newMeter) requestAnimationFrame(() => requestAnimationFrame(() => { newMeter.style.width = to; }));
  }
  async function addToCart(form) {
    const btn = $('[type="submit"]', form);
    btn && btn.classList.add('is-loading');
    try {
      const fd = new FormData(form);
      fd.append('sections', 'cart-drawer');
      fd.append('sections_url', window.location.pathname);
      const r = await fetch(R.cart_add_url + '.js', { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' }, body: fd });
      const j = await r.json();
      if (!r.ok || j.status) { toast(j.description || j.message || 'Could not add to bag'); return; }
      renderDrawer(j.sections);
      const cart = await (await fetch(R.cart_url + '.js')).json();
      setCount(cart.item_count); bump();
      toast((j.product_title || 'Item') + ' added to your bag');
      setTimeout(() => openOv('cart'), 450);
    } catch (err) { form.submit(); }
    finally { btn && btn.classList.remove('is-loading'); }
  }
  async function changeLine(line, quantity) {
    const items = $('#CartDrawerInner .cd__items'); items && items.classList.add('is-loading');
    try {
      const r = await fetch(R.cart_change_url + '.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ line, quantity, sections: ['cart-drawer'], sections_url: window.location.pathname }) });
      const j = await r.json();
      if (j.status) { toast(j.description || j.message); }
      if (isCartPage()) { window.location.reload(); return; }
      renderDrawer(j.sections);
      if (typeof j.item_count === 'number') setCount(j.item_count);
    } finally { const i = $('#CartDrawerInner .cd__items'); i && i.classList.remove('is-loading'); }
  }
  document.addEventListener('submit', e => {
    const f = e.target;
    if (M.cartType === 'drawer' && f.matches('form[action*="/cart/add"]') && ov('cart')) { e.preventDefault(); addToCart(f); }
  });
  document.addEventListener('click', e => {
    const q = e.target.closest('[data-line-qty]');
    if (q) { e.preventDefault(); changeLine(parseInt(q.dataset.line, 10), Math.max(0, parseInt(q.dataset.lineQty, 10))); }
  });

  /* ---------- Predictive search ---------- */
  function initSearch() {
    const el = ov('search'); if (!el || el._init) return; el._init = 1;
    const input = $('input[name="q"]', el), out = $('[data-ps-results]', el), chips = $('[data-ps-chips]', el), count = $('[data-ps-count]', el);
    let t, ctl, types = 'product,collection,page,article', act = -1;
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rows = () => $$('.ps-row', out);
    const setAct = i => { const r = rows(); act = r.length ? Math.max(0, Math.min(r.length - 1, i)) : -1; r.forEach((x, k) => { x.classList.toggle('is-active', k === act); x.setAttribute('aria-selected', k === act); }); const a = r[act]; if (a) { const top = a.offsetTop, bot = top + a.offsetHeight; if (top < out.scrollTop) out.scrollTop = top; else if (bot > out.scrollTop + out.clientHeight) out.scrollTop = bot - out.clientHeight; } };
    const run = async () => {
      const q = input.value.trim();
      if (ctl) ctl.abort();
      if (chips) chips.hidden = !!q;
      if (!q) { out.innerHTML = ''; count.textContent = 'Suggested'; count.href = R.search_url || '/search'; act = -1; return; }
      ctl = new AbortController(); out.classList.add('is-loading');
      try {
        const url = R.predictive_search_url + '?q=' + encodeURIComponent(q) + '&resources[type]=' + types + '&resources[limit]=8&resources[options][prefix]=last&section_id=predictive-search';
        const html = await (await fetch(url, { signal: ctl.signal })).text();
        const res = new DOMParser().parseFromString(html, 'text/html').querySelector('#PredictiveResults');
        out.innerHTML = res ? res.innerHTML : '';
        const n = res ? parseInt(res.dataset.count, 10) || 0 : 0;
        const re = new RegExp('(' + esc(q) + ')', 'i');
        $$('[data-hl]', out).forEach(s => { s.innerHTML = s.textContent.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(re, '<mark>$1</mark>'); });
        count.textContent = n ? 'See all ' + n + (n === 1 ? ' result' : ' results') : '0 results';
        count.href = (R.search_url || '/search') + '?q=' + encodeURIComponent(q) + '&options[prefix]=last';
        setAct(0);
        input.setAttribute('aria-expanded', n ? 'true' : 'false');
      } catch (err) { /* aborted */ }
      finally { out.classList.remove('is-loading'); }
    };
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(run, 220); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAct(act + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(act - 1); }
      else if (e.key === 'Enter' && act > -1 && rows()[act]) { e.preventDefault(); window.location.href = rows()[act].href; }
    });
    out.addEventListener('mousemove', e => { const r = e.target.closest('.ps-row'); if (r) { const k = rows().indexOf(r); if (k !== act) setAct(k); } });
    el.addEventListener('click', e => {
      const c = e.target.closest('[data-chip]');
      if (c) { e.preventDefault(); input.value = c.dataset.chip; run(); input.focus(); return; }
      const f = e.target.closest('[data-ps-filter]');
      if (f) { $$('[data-ps-filter]', el).forEach(b => b.classList.toggle('is-active', b === f)); types = f.dataset.psFilter; run(); input.focus(); }
    });
  }

  /* ---------- Product form ---------- */
  class ProductForm extends HTMLElement {
    connectedCallback() {
      const j = $('script[data-product-json]', this); if (!j) return;
      this.product = JSON.parse(j.textContent);
      this.selects = $$('select[data-option]', this);
      this.idInput = $('input[name="id"]', this);
      this.btn = $('button[type="submit"]', this);
      this.label = $('[data-btn-label]', this);
      this.scope = this.closest('section') || document;
      this.selects.forEach(s => s.addEventListener('change', () => this.update()));
      $$('[data-qty-step]', this).forEach(b => b.addEventListener('click', () => {
        const i = $('input[name="quantity"]', this);
        i.value = Math.max(1, (parseInt(i.value, 10) || 1) + parseInt(b.dataset.qtyStep, 10));
      }));
    }
    update() {
      const vals = this.selects.map(s => s.value);
      const v = this.product.variants.find(x => x.options.every((o, i) => o === vals[i]));
      const price = $('[data-price]', this.scope);
      if (!v) { this.btn.disabled = true; if (this.label) this.label.textContent = 'Unavailable'; return; }
      this.idInput.value = v.id;
      this.btn.disabled = !v.available;
      if (this.label) this.label.textContent = v.available ? this.dataset.addLabel : 'Sold out';
      if (price) price.innerHTML = money(v.price) + (v.compare_at_price > v.price ? ' <s>' + money(v.compare_at_price) + '</s>' : '');
      const u = new URL(window.location.href); u.searchParams.set('variant', v.id); window.history.replaceState({}, '', u.toString());
      if (v.featured_media) { const th = $('[data-media-id="' + v.featured_media.id + '"]', this.scope); th && th.click(); }
    }
  }
  if (!customElements.get('product-form')) customElements.define('product-form', ProductForm);

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-thumb]'); if (!t) return;
    const g = t.closest('[data-gallery]'); const img = g && $('.product__main img', g); if (!img) return;
    $$('[data-thumb]', g).forEach(b => b.classList.toggle('is-active', b === t));
    img.style.opacity = '0';
    setTimeout(() => {
      img.removeAttribute('srcset'); img.removeAttribute('sizes');
      const done = () => { img.style.opacity = '1'; };
      img.onload = done; img.src = t.dataset.thumb; setTimeout(done, 700);
    }, 300);
  });

  /* ---------- Init ---------- */
  function init(root) { initHeader(); initSearch(); observe(root); observeVideos(root); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init()); else init();
  document.addEventListener('shopify:section:load', e => init(e.target));
  window.Momemade = Object.assign(M, { openOverlay: openOv, closeOverlay: closeOv, toast, money });
  if (designMode) document.documentElement.classList.add('is-design-mode');
})();
