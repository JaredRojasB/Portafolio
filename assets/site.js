(function () {
  'use strict';

  /* ---------- Language ---------- */
  var LANG_KEY = 'portfolio.lang';
  var ES = window.PORTFOLIO_ES || {};
  var nodes = document.querySelectorAll('[data-i18n],[data-i18n-html]');
  var original = [];
  nodes.forEach(function (n) {
    original.push(n.hasAttribute('data-i18n-html') ? n.innerHTML : n.textContent);
  });
  var metaDesc = document.querySelector('meta[name="description"]');
  var origDesc = metaDesc ? metaDesc.getAttribute('content') : '';

  function setLang(lang) {
    nodes.forEach(function (n, i) {
      var htmlKey = n.getAttribute('data-i18n-html');
      var key = htmlKey || n.getAttribute('data-i18n');
      var val = lang === 'es' && ES[key] ? ES[key] : original[i];
      if (htmlKey) n.innerHTML = val; /* trusted static strings only */
      else n.textContent = val;
    });
    document.documentElement.lang = lang;
    if (metaDesc) metaDesc.setAttribute('content', lang === 'es' && window.PORTFOLIO_META_ES ? window.PORTFOLIO_META_ES.description : origDesc);
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
  }
  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  var initial = saved === 'es' || saved === 'en' ? saved : ((navigator.language || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en');
  setLang(initial);
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---------- Nav state + active section ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var links = document.querySelectorAll('.nav-links a');
  var sections = [];
  links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) sections.push([s, a]); });
  function spy() {
    var y = window.scrollY + 120, current = null;
    sections.forEach(function (p) { if (p[0].offsetTop <= y) current = p[1]; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = links[links.length - 1];
    links.forEach(function (a) { a.classList.toggle('active', a === current); });
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------- Reveal ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Project filters ---------- */
  var chips = document.querySelectorAll('.chip');
  var projects = document.querySelectorAll('.project');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
      projects.forEach(function (p) {
        var uses = (p.getAttribute('data-use') || '').split(' ');
        p.classList.toggle('hidden', f !== 'all' && uses.indexOf(f) === -1);
      });
    });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
