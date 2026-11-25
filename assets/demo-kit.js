/* Demo kit shared by every portfolio demo:
   - language preference shared with the portfolio (EN / ES)
   - guided tour with spotlight cards (first visit + replay button)
   Text is written with textContent only. */
(function () {
  'use strict';
  var LANG_KEY = 'portfolio.lang';

  function getLang() {
    var v = null;
    try { v = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
    if (v === 'es' || v === 'en') return v;
    return (navigator.language || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }
  var NOTE = {
    en: { b: 'Design for demonstration purposes.', t: ' Colors, layout, logo and wording can be fully adapted to each client\'s brand and taste.' },
    es: { b: 'Diseño con fines demostrativos.', t: ' Los colores, la distribución, el logo y los textos se pueden adaptar por completo a la marca y al gusto de cada cliente.' }
  };
  function note(lang) {
    var n = document.getElementById('dkNote');
    if (!n) {
      n = document.createElement('footer'); n.id = 'dkNote'; n.className = 'dk-note';
      document.body.appendChild(n);
    }
    var x = NOTE[lang] || NOTE.en;
    while (n.firstChild) n.removeChild(n.firstChild);
    var b = document.createElement('b'); b.textContent = x.b;
    n.appendChild(b); n.appendChild(document.createTextNode(x.t));
  }
  function setLang(v) {
    try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* ignore */ }
    document.documentElement.lang = v;
    note(v);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var UI = {
    en: { next: 'Next', back: 'Back', done: 'Start using it', skip: 'Skip tour', of: 'of' },
    es: { next: 'Siguiente', back: 'Atrás', done: 'Empezar', skip: 'Omitir', of: 'de' }
  };

  /* steps: [{ target: '#css' | null, title: {en,es}, body: {en,es}, before: fn }] */
  function Tour(opts) {
    this.key = 'tour.' + opts.key + '.done';
    this.steps = opts.steps;
    this.lang = opts.lang || getLang;
    this.i = 0;
    this.root = null;
  }
  Tour.prototype.seen = function () { try { return localStorage.getItem(this.key) === '1'; } catch (e) { return true; } };
  Tour.prototype.start = function () {
    this.i = 0; this.build(); this.show();
  };
  Tour.prototype.build = function () {
    var self = this;
    if (this.root) this.root.remove();
    var root = el('div', 'dk-tour');
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    var shade = el('div', 'dk-shade');
    var spot = el('div', 'dk-spot');
    var card = el('div', 'dk-card');
    var step = el('p', 'dk-step');
    var title = el('h3', 'dk-title');
    var body = el('p', 'dk-body');
    var dots = el('div', 'dk-dots');
    var row = el('div', 'dk-row');
    var skip = el('button', 'dk-skip'); skip.type = 'button';
    var back = el('button', 'dk-btn dk-ghost'); back.type = 'button';
    var next = el('button', 'dk-btn'); next.type = 'button';
    var right = el('div', 'dk-right'); right.appendChild(back); right.appendChild(next);
    row.appendChild(skip); row.appendChild(right);
    [step, title, body, dots, row].forEach(function (n) { card.appendChild(n); });
    root.appendChild(shade); root.appendChild(spot); root.appendChild(card);
    document.body.appendChild(root);
    this.root = root; this.parts = { shade: shade, spot: spot, card: card, step: step, title: title, body: body, dots: dots, skip: skip, back: back, next: next };
    skip.addEventListener('click', function () { self.end(); });
    shade.addEventListener('click', function () { self.end(); });
    back.addEventListener('click', function () { if (self.i > 0) { self.i--; self.show(); } });
    next.addEventListener('click', function () { if (self.i < self.steps.length - 1) { self.i++; self.show(); } else self.end(); });
    this.onKey = function (e) {
      if (e.key === 'Escape') self.end();
      else if (e.key === 'ArrowRight') next.click();
      else if (e.key === 'ArrowLeft') back.click();
    };
    this.onResize = function () { self.place(); };
    document.addEventListener('keydown', this.onKey);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onResize, { passive: true });
  };
  Tour.prototype.show = function () {
    var s = this.steps[this.i], L = this.lang(), ui = UI[L] || UI.en, p = this.parts, self = this;
    if (s.before) s.before();
    p.step.textContent = (this.i + 1) + ' ' + ui.of + ' ' + this.steps.length;
    p.title.textContent = s.title[L] || s.title.en;
    p.body.textContent = s.body[L] || s.body.en;
    p.skip.textContent = ui.skip;
    p.back.textContent = ui.back;
    p.back.hidden = this.i === 0;
    p.next.textContent = this.i === this.steps.length - 1 ? ui.done : ui.next;
    while (p.dots.firstChild) p.dots.removeChild(p.dots.firstChild);
    this.steps.forEach(function (_, k) { p.dots.appendChild(el('i', k === self.i ? 'on' : '')); });
    var t = s.target ? document.querySelector(s.target) : null;
    if (t) t.scrollIntoView({ block: 'center', behavior: 'smooth' });
    this.target = t;
    setTimeout(function () { self.place(); p.next.focus(); }, t ? 320 : 0);
    this.place();
  };
  Tour.prototype.place = function () {
    if (!this.root) return;
    var p = this.parts, t = this.target, pad = 8, vw = window.innerWidth, vh = window.innerHeight;
    var cw = Math.min(360, vw - 32);
    p.card.style.width = cw + 'px';
    if (!t) {
      p.spot.style.display = 'none';
      p.shade.classList.add('solid');
      p.card.style.left = Math.round((vw - cw) / 2) + 'px';
      p.card.style.top = Math.round(vh / 2 - p.card.offsetHeight / 2) + 'px';
      return;
    }
    p.shade.classList.remove('solid');
    var r = t.getBoundingClientRect();
    p.spot.style.display = 'block';
    p.spot.style.left = (r.left - pad) + 'px';
    p.spot.style.top = (r.top - pad) + 'px';
    p.spot.style.width = (r.width + pad * 2) + 'px';
    p.spot.style.height = (r.height + pad * 2) + 'px';
    var ch = p.card.offsetHeight, gap = 16, top;
    if (r.bottom + gap + ch < vh) top = r.bottom + gap;
    else if (r.top - gap - ch > 0) top = r.top - gap - ch;
    else top = Math.max(16, vh - ch - 16);
    var left = Math.min(Math.max(16, r.left + r.width / 2 - cw / 2), vw - cw - 16);
    p.card.style.left = Math.round(left) + 'px';
    p.card.style.top = Math.round(top) + 'px';
  };
  Tour.prototype.end = function () {
    try { localStorage.setItem(this.key, '1'); } catch (e) { /* ignore */ }
    document.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onResize);
    if (this.root) this.root.remove();
    this.root = null;
  };

  /* ---------- Small shared helpers ---------- */
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'text') n.textContent = v;
      else if (k === 'class') n.className = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c != null && c !== false) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function clean(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, max || 200); }

  /* i18n: dict = { en: {...}, es: {...} }. Static nodes use data-i18n / data-i18n-ph. */
  function I18n(dict) {
    var self = this;
    this.dict = dict; this.lang = getLang(); this.listeners = [];
    this.t = function (k, v) {
      var s = (dict[self.lang] && dict[self.lang][k] != null) ? dict[self.lang][k] : (dict.en[k] != null ? dict.en[k] : k);
      if (v && typeof s === 'string') Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]); });
      return s;
    };
  }
  I18n.prototype.apply = function () {
    var t = this.t, lang = this.lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (n) { n.setAttribute('placeholder', t(n.getAttribute('data-i18n-ph'))); });
    document.querySelectorAll('[data-i18n-title]').forEach(function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-title'))); });
    document.querySelectorAll('.dk-lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
  };
  I18n.prototype.bind = function (onChange) {
    var self = this;
    document.querySelectorAll('.dk-lang button').forEach(function (b) {
      b.addEventListener('click', function () {
        self.lang = b.getAttribute('data-lang'); setLang(self.lang); self.apply(); if (onChange) onChange();
      });
    });
    this.apply();
  };

  /* Decorative tag pattern (not a real QR code). */
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  function pattern(box, txt) {
    clear(box);
    var NS = 'http://www.w3.org/2000/svg', n = 21;
    function r(tag, a) { var e = document.createElementNS(NS, tag); Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); }); return e; }
    var s = r('svg', { viewBox: '0 0 21 21', 'shape-rendering': 'crispEdges' });
    var hsh = 0; for (var i = 0; i < txt.length; i++) hsh = (hsh * 31 + txt.charCodeAt(i)) >>> 0;
    var rnd = rng(hsh || 7);
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!inF && rnd() > 0.52) s.appendChild(r('rect', { x: x, y: y, width: 1, height: 1 }));
    }
    [[0, 0], [14, 0], [0, 14]].forEach(function (p) {
      s.appendChild(r('rect', { x: p[0], y: p[1], width: 7, height: 7 }));
      s.appendChild(r('rect', { x: p[0] + 1, y: p[1] + 1, width: 5, height: 5, fill: '#fff' }));
      s.appendChild(r('rect', { x: p[0] + 2, y: p[1] + 2, width: 3, height: 3 }));
    });
    box.appendChild(s);
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* CSV export with formula-injection protection. */
  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function downloadCsv(name, rows) {
    var csv = '﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var a = h('a', { href: url, download: name }); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function store(key) {
    return {
      load: function () { try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch (e) { return null; } },
      save: function (v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignore */ } },
      clear: function () { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
    };
  }

  note(getLang());

  window.DemoKit = { getLang: getLang, setLang: setLang, Tour: Tour, I18n: I18n, h: h, clear: clear, clean: clean,
    rng: rng, pattern: pattern, toast: toast, downloadCsv: downloadCsv, store: store };
})();
