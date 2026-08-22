/* FitPulse — Promotional Website · Interactions */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  /* ---------- Count-up ---------- */
  function info(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return null;
    var node = Array.prototype.find.call(el.childNodes, function (c) {
      return c.nodeType === 3 && c.textContent.trim() !== '';
    }) || null;
    var suffix = node ? node.textContent.replace(/[0-9.,]/g, '').trim() : '';
    return { target: target, node: node, suffix: suffix, dec: /\.\d/.test(el.getAttribute('data-count')) };
  }

  function writeCount(el, d, value) {
    var v = value.toFixed(d.dec ? 1 : 0).split('.');
    v[0] = Number(v[0]).toLocaleString('en-US');
    var out = v.join('.') + d.suffix;
    if (d.node) d.node.nodeValue = out; else el.textContent = out;
  }

  function animateCounter(el, delay) {
    if (el.__fpDone) return;
    el.__fpDone = true;
    var d = el.__fpData || (el.__fpData = info(el));
    if (!d) return;
    writeCount(el, d, 0);
    var start = null, dur = 1500;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      writeCount(el, d, d.target * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, delay || 0);
  }

  function playCounters(scope) {
    (scope || document).querySelectorAll('[data-count]').forEach(function (el) {
      if (!el.__fpDone) animateCounter(el, 160);
    });
  }

  /* ---------- Progress rings ---------- */
  function initRings(scope) {
    (scope || document).querySelectorAll('[data-ring]').forEach(function (ring) {
      ring.querySelectorAll('.ring-fill').forEach(function (fill) {
        var r = parseFloat(fill.getAttribute('r')) || 52;
        var circ = 2 * Math.PI * r;
        var pct = parseFloat(fill.getAttribute('data-pct')) || 0;
        fill.style.strokeDasharray = circ.toFixed(1);
        fill.style.strokeDashoffset = circ.toFixed(1);
        fill.dataset.fpCirc = circ.toFixed(1);
        fill.dataset.fpTarget = (circ * (1 - pct)).toFixed(1);
        if (reduced) { fill.style.strokeDashoffset = fill.dataset.fpTarget; ring.classList.add('in-view'); }
      });
    });
  }

  /* ---------- Viewport reveals ---------- */
  var io;
  function observe() {
    var targets = document.querySelectorAll('.reveal, [data-bars], [data-ring], [data-count]');
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        enter(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  function enter(el) {
    if (el.classList.contains('in-view')) return;
    el.classList.add('in-view');

    if (el.hasAttribute('data-ring')) {
      el.querySelectorAll('.ring-fill').forEach(function (fill) {
        if (!reduced && fill.dataset.fpTarget) fill.style.strokeDashoffset = fill.dataset.fpTarget;
      });
    }
    if (el.hasAttribute('data-count') && !el.__fpDone) animateCounter(el, 120);
  }

  /* ---------- Preloader ---------- */
  function initPreloader(fn) {
    var pre = document.getElementById('preloader');
    if (!pre) { fn(); return; }
    var when = function () {
      var start = performance.now();
      var wait = Math.max(0, 1000 - (performance.now() - start));
      setTimeout(function () { pre.classList.add('done'); setTimeout(fn, 120); }, wait);
    };
    if (document.readyState === 'complete') when();
    else window.addEventListener('load', when, { once: true });
    setTimeout(function () { if (!pre.classList.contains('done')) { pre.classList.add('done'); setTimeout(fn, 120); } }, 2400);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var nav = document.getElementById('site-nav');
    var burger = document.getElementById('nav-burger');
    var links = document.getElementById('nav-links');

    var onScroll = function () {
      if (window.scrollY > 14) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (burger) burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    if (links) links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.classList.remove('open');
        nav.classList.remove('open');
      }
    });

    /* scrollspy */
    var items = Array.prototype.map.call(document.querySelectorAll('.nav-links a'), function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      return { a: a, el: document.getElementById(id) };
    }).filter(function (s) { return s.el; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        items.forEach(function (s) { s.a.classList.toggle('active', s.el === entry.target); });
      });
    }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });
    items.forEach(function (s) { spy.observe(s.el); });
  }
  /* ---------- Theme toggle ---------- */
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var root = document.documentElement;
    var STORAGE_KEY = 'fp-theme';

    function apply(t) {
      root.dataset.theme = t;
      btn.setAttribute('aria-pressed', t === 'dark');
      try { localStorage.setItem(STORAGE_KEY, t); } catch (_) {}
    }

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (saved) {
      apply(saved);
    } else {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      apply(prefersDark ? 'dark' : 'light');
    }

    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-transition');
      apply(next);
      setTimeout(function () { root.classList.remove('theme-transition'); }, parseFloat(getComputedStyle(root).getPropertyValue('--theme-dur') || '0.42') * 1000 + 50);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initTheme();
    initRings();
    initNav();

    if (reduced || !('IntersectionObserver' in window)) {
      /* Show everything statically */
      document.querySelectorAll('.reveal, [data-bars], [data-ring]').forEach(function (el) {
        el.classList.add('in-view');
      });
      document.querySelectorAll('.ring-fill').forEach(function (fill) {
        if (fill.dataset.fpTarget) fill.style.strokeDashoffset = fill.dataset.fpTarget;
      });
      playCounters();
      var pre = document.getElementById('preloader');
      if (pre) pre.classList.add('done');
      return;
    }

    initPreloader(function () {
      observe();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();