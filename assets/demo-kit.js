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
  function setLang(v) {
    try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* ignore */ }
    document.documentElement.lang = v;
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

  window.DemoKit = { getLang: getLang, setLang: setLang, Tour: Tour };
})();
