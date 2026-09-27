/* ═══════════════════════════════════════════════════════════════
   Fitnpulse — WEB UI/UX Case Study · webcase.js
   Mounts the real web-UI replicas, then drives the presentation:
   browser-frame scaling, reveal choreography, scroll index /
   chapter navigation, the step stages, theme morph, count-ups,
   the mobile-vs-web comparison and the lazy live embed.
   Transform/opacity only, and honours prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var APP = 'https://rr188351.github.io/Fitnpulse-app/';
  var SHOWCASE = 'https://rr188351.github.io/Fitnplus/showcase/?mode=web';
  /* origin the deployed build is served from — postMessage target */
  var APP_ORIGIN = 'https://rr188351.github.io';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = window.WCD;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  /* ── 1 · MOUNT THE APP REPLICAS ───────────────────────────── */
  function wrapPages(list, kind) {
    var out = '';
    list.forEach(function (name, i) {
      out += '<div class="fpw__pages' + (i ? '' : ' on') + '" data-page="' + name + '">' +
        (kind === 'auth' ? W.auth[name]() : W.web[name]({ theme: 'dark', notif: 1 })) + '</div>';
    });
    return out;
  }
  function mount() {
    $$('[data-app]').forEach(function (host) {
      var spec = host.getAttribute('data-app');
      if (spec.indexOf('pages:') === 0) {
        host.innerHTML = wrapPages(spec.slice(6).split(','), 'web');
      } else if (spec.indexOf('auth:') === 0) {
        host.innerHTML = wrapPages(spec.slice(5).split(','), 'auth');
      } else if (spec.indexOf('phones:') === 0) {
        host.innerHTML = W.phoneStage(spec.slice(7).split(',').map(function (n) { return W.phone[n](); }).join(''));
      } else if (spec.indexOf('phone:') === 0) {
        host.innerHTML = W.phoneStage(W.phone[spec.slice(6)]());
      } else if (W.auth[spec]) {
        host.innerHTML = W.auth[spec]();
      } else if (W.web[spec]) {
        host.innerHTML = W.web[spec]({ theme: host.getAttribute('data-theme') || 'dark', notif: 1 });
      }
      host.classList.add('stage-seen');
    });
  }

  /* ── 2 · BROWSER FRAME SCALING (1440px design canvas) ─────── */
  function fitAll() {
    $$('[data-bf]').forEach(function (bf) {
      var vp = $('.bf__vp', bf);
      if (!vp) return;
      var sw = parseFloat(bf.getAttribute('data-sw')) || 1440;
      var sc = vp.clientWidth / sw;
      if (sc > 0) vp.style.setProperty('--sc', sc.toFixed(4));
    });
  }

  /* ── 3 · REVEAL CHOREOGRAPHY ──────────────────────────────── */
  function reveal() {
    $$('.mrv-stagger').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (el, i) {
        el.style.setProperty('--rvd', i * 90 + 'ms');
      });
    });
    $$('.motion-grid').forEach(function (g) {
      var dirs = ['m-left', 'm-right'];
      Array.prototype.forEach.call(g.children, function (el, i) {
        el.classList.add(dirs[i % 2]);
        el.style.setProperty('--rvd', Math.min(i * 90, 720) + 'ms');
      });
    });
    var els = $$('.mrv, .mrv-stagger, .mrv-phone, .motion-grid, .bf--enter');
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  /* ── 4 · SCROLL INDEX · PROGRESS · CHAPTERS ──────────────── */
  var sections = [], activeIdx = -1, rail = null, bar = null, ovlGrid = null;
  function buildIndex() {
    sections = $$('section.mc-sec, header.mc-hero').filter(function (s) { return s.id; });
    rail = $('#wc-rail');
    bar = $('#wc-bar');
    ovlGrid = $('#wc-ovl-grid');
    if (rail) {
      rail.innerHTML = sections.map(function (s) {
        return '<button class="wc-dot" data-go="' + s.id + '" aria-label="' +
          (s.getAttribute('data-label') || s.id) + '"><span>' + (s.getAttribute('data-label') || '') + '</span><i></i></button>';
      }).join('');
    }
    if (ovlGrid) {
      ovlGrid.innerHTML = sections.map(function (s, i) {
        return '<button class="wc-ovl-item" data-go="' + s.id + '"><b>' + (i < 9 ? '0' + (i + 1) : i + 1) +
          '</b><span>' + (s.getAttribute('data-label') || '') + '</span></button>';
      }).join('');
    }
  }
  function setActive(i) {
    if (i === activeIdx) return;
    activeIdx = i;
    if (rail) $$('.wc-dot', rail).forEach(function (d, j) { d.classList.toggle('on', j === i); });
    if (ovlGrid) $$('.wc-ovl-item', ovlGrid).forEach(function (d, j) { d.classList.toggle('on', j === i); });
  }
  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';
    var y = window.scrollY + window.innerHeight * 0.32, idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) idx = i;
    }
    setActive(idx);
    if (rail) rail.classList.toggle('on', window.scrollY > window.innerHeight * 0.3);
  }
  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.scrollY - (id === 'cover' ? 0 : 56);
    window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }
  function chapters() {
    var ovl = $('#wc-ovl');
    function toggleOvl(on) {
      if (!ovl) return;
      ovl.classList.toggle('on', on);
      ovl.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
    on(document, 'click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-go]') : null;
      if (!b) return;
      goTo(b.getAttribute('data-go'));
      toggleOvl(false);
    });
    on($('#wc-menu'), 'click', function () { toggleOvl(true); });
    on($('#wc-ovl-close'), 'click', function () { toggleOvl(false); });
    on(ovl, 'click', function (ev) { if (ev.target === ovl) toggleOvl(false); });
    on(document, 'keydown', function (ev) {
      if (ev.key === 'Escape') { toggleOvl(false); return; }
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
      if (ev.key === 'ArrowRight' || ev.key === 'PageDown') {
        goTo(sections[Math.min(activeIdx + 1, sections.length - 1)].id); ev.preventDefault();
      } else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') {
        goTo(sections[Math.max(activeIdx - 1, 0)].id); ev.preventDefault();
      } else if (ev.key === 'Home') { goTo(sections[0].id); ev.preventDefault(); }
      else if (ev.key === 'End') { goTo(sections[sections.length - 1].id); ev.preventDefault(); }
    });
  }
  /* ── 5 · STEP STAGES (web pages + synced phone screens) ───── */
  function setPage(host, i) {
    var pages = $$('.fpw__pages', host);
    if (!pages.length) return;
    i = Math.max(0, Math.min(i, pages.length - 1));
    pages.forEach(function (p, j) {
      p.classList.toggle('on', j === i);
      p.classList.toggle('back', j < i);
    });
  }
  function setPhone(root, name) {
    var screens = $$('.cs-screen', root);
    screens.forEach(function (s) {
      var on = s.getAttribute('data-screen') === name;
      s.classList.toggle('s-active', on);
    });
  }
  /* ── cross-frame protocol with the deployed build ─────────────
     The slide-15 sandbox embeds the real bundle with ?presentation=web,
     so it keeps the desktop shell inside the frame. The deck drives it
     over postMessage: FP_WEB_NAVIGATE routes a step, FP_SET_THEME rides
     the page's 5-second theme cycle. Messages are dropped until the
     frame has actually loaded (see liveEmbed).                     */
  function postApp(frame, msg) {
    if (!frame || !frame.getAttribute('src') || !frame.contentWindow) return;
    try { frame.contentWindow.postMessage(msg, APP_ORIGIN); } catch (err) { /* ignore */ }
  }
  function stepScreen(step) {
    if (!step) return '';
    var url = step.getAttribute('data-url') || '';
    var parts = url.split('/').filter(Boolean);
    return step.getAttribute('data-screen') || parts.pop() || '';
  }
  function stages() {
    $$('[data-stage]').forEach(function (root) {
      /* steps include the sandbox window's route chips (both carry data-step) */
      var steps = $$('[data-step]', root);
      var idx = 0, timer = null;
      function apply(i, dir) {
        idx = (i + steps.length) % steps.length;
        steps.forEach(function (s, j) { s.classList.toggle('on', j === idx); });
        var pageHost = $('[data-pages]', root);
        if (pageHost) setPage(pageHost, idx);
        var phoneHost = $('[data-phone]', root);
        if (phoneHost) {
          var key = steps[idx].getAttribute('data-screen');
          if (key) setPhone(phoneHost, key);
          var target = $('.cs-screen.s-active', phoneHost);
          if (target) { target.style.animation = 'none'; void target.offsetWidth; target.style.animation = ''; }
        }
        var url = $('.bf__addr [data-url]', root);
        if (url && steps[idx].getAttribute('data-url')) url.textContent = steps[idx].getAttribute('data-url');
        /* the deployed build (slide-15 sandbox) follows the same step */
        var live = $('iframe[data-app-frame]', root);
        var screen = stepScreen(steps[idx]);
        if (live && screen) postApp(live, { type: 'FP_WEB_NAVIGATE', screen: screen });
      }
      steps.forEach(function (s, i) { on(s, 'click', function () { stop(); apply(i); }); });
      var auto = $('[data-autoplay]', root);
      function paintAuto(playing) {
        if (!auto) return;
        auto.classList.toggle('on', !!playing);
        auto.setAttribute('aria-pressed', playing ? 'true' : 'false');
        auto.textContent = playing ? '❚❚ Pause auto-play' : '▶ Auto-play';
      }
      function start() {
        if (timer) return;
        timer = setInterval(function () { apply(idx + 1); }, 3600);
        paintAuto(true);
      }
      function stop() {
        if (timer) clearInterval(timer);
        timer = null;
        paintAuto(false);
      }
      on(auto, 'click', function () { timer ? stop() : start(); });
      apply(0);
      /* auto-play is ON for every stage the moment the page loads */
      if (auto) start();
    });
  }

  /* ── 6 · THEME MORPH + AMBIENT CYCLE + COUNT-UPS + DEMOS ─── */
  var THEME_MS = 5000, THEMES = ['dark', 'light'], themePhase = 0;
  /* every mounted web-app screen except the two pinned surfaces:
     the section-04 light/dark comparison and the pinned light showcase. */
  function themeApps() {
    return $$('.fpw').filter(function (a) {
      return !a.closest('[data-theme-frame]') && !a.closest('[data-pin-theme]');
    });
  }
  function themeIcon(app, theme) {
    $$('.fpw__themebtn', app).forEach(function (b) {
      b.textContent = theme === 'light' ? '🌙' : '☀️';
    });
  }
  function paintTheme(theme) {
    themeApps().forEach(function (a) {
      if (a.getAttribute('data-wt') !== theme) {
        a.setAttribute('data-wt', theme);
        themeIcon(a, theme);
        /* a short wash of the incoming theme colour crossfades the swap */
        if (!reduced) {
          a.classList.add('is-theme-wash');
          setTimeout(function () { a.classList.remove('is-theme-wash'); }, 220);
        }
      }
    });
    $$('[data-theme-state]').forEach(function (s) {
      s.textContent = theme === 'light' ? 'Light' : 'Dark';
      s.classList.toggle('on', theme === 'light');
    });
    $$('[data-theme-state-long]').forEach(function (s) {
      s.textContent = (theme === 'light' ? 'Light' : 'Dark') + ' theme · auto-switching every 5 s';
    });
    /* NOTE: the slide-15 live frame is deliberately NOT synced here — its
       theme change animation is stopped so the interactive window keeps the
       theme it was given at load. It still receives a one-time FP_SET_THEME
       when it first loads (see liveEmbed); every replica on the page keeps
       riding the 5-second cycle as before.                              */
  }
  function themeCycle() {
    if (!themeApps().length) return;
    setInterval(function () {
      themePhase = (themePhase + 1) % THEMES.length;
      paintTheme(THEMES[themePhase]);
    }, THEME_MS);
  }
  function themeMorph() {
    var btn = $('#wc-theme-swap');
    on(btn, 'click', function () {
      var pair = btn.closest('.mc-wrap');
      $$('[data-theme-frame]').forEach(function (f) {
        var app = $('.fpw', f);
        if (!app) return;
        var next = app.getAttribute('data-wt') === 'light' ? 'dark' : 'light';
        app.setAttribute('data-wt', next);
        f.setAttribute('data-wt', next);
        themeIcon(app, next);
      });
      /* keep the captions attached to the frame they describe */
      var caps = $$('.th-cap', pair);
      if (caps.length === 2) {
        var a = caps[0].innerHTML;
        caps[0].innerHTML = caps[1].innerHTML;
        caps[1].innerHTML = a;
      }
    });
  }
  /* real-app micro-interactions: theme button, notification popover,
     settings toggles and sidebar routing inside the live tour frame. */
  function appClicks() {
    function closePops(keep) {
      $$('.fpw__popwrap.open').forEach(function (w) { if (w !== keep) w.classList.remove('open'); });
    }
    on(document, 'click', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var themeBtn = t.closest('.fpw__themebtn');
      if (themeBtn) {
        ev.preventDefault();
        themePhase = themePhase === 0 ? 1 : 0;
        paintTheme(THEMES[themePhase]);
        return;
      }
      var bell = t.closest('.fpw__bellbtn');
      if (bell) {
        ev.preventDefault();
        var wrap = bell.closest('.fpw__popwrap');
        var open = wrap.classList.contains('open');
        closePops(wrap);
        wrap.classList.toggle('open', !open);
        return;
      }
      var tgl = t.closest('.fpw__tgl');
      if (tgl) { tgl.classList.toggle('on'); return; }
      /* clicking the real sidebar inside a tour frame drives the tour */
      var navi = t.closest('.fpw__navi');
      if (navi) {
        var host = navi.closest('[data-pages]');
        if (host && host.hasAttribute('data-pages')) {
          var label = (navi.querySelector('.fpw__lbl') || navi).textContent.trim().toLowerCase();
          var target = -1;
          $$('.fpw__pages', host).forEach(function (p, j) {
            if (p.getAttribute('data-page') === label) target = j;
          });
          var stage = navi.closest('[data-stage]');
          var step = (stage && target > -1) ? $$('[data-step]', stage)[target] : null;
          if (step) step.click();
        }
        return;
      }
      if (!t.closest('.fpw__popwrap')) closePops(null);
    });
  }
  function countUp() {
    $$('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (reduced) { el.textContent = target.toLocaleString('en-US'); return; }
      var cio = new IntersectionObserver(function (ents) {
        if (!ents[0].isIntersecting) return;
        cio.disconnect();
        var t0 = null;
        (function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1400, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      }, { threshold: 0.4 });
      cio.observe(el);
    });
  }
  function microDemos() {
    $$('.mo-switch').forEach(function (s) { on(s, 'click', function () { s.classList.toggle('on'); }); });
    var typed = $('.mo-typed');
    if (typed && !reduced) {
      var words = ['Confirming action…', 'Updating dashboard…', 'Saved to your account ✓'];
      var w = 0, i = 0, del = false;
      (function loop() {
        var word = words[w];
        typed.textContent = word.slice(0, i);
        if (!del) { i++; if (i > word.length) { del = true; setTimeout(loop, 1200); return; } }
        else { i--; if (i < 0) { del = false; w = (w + 1) % words.length; setTimeout(loop, 300); return; } }
        setTimeout(loop, del ? 28 : 62);
      })();
    }
  }
  /* ── 7 · RESPONSIVE VIEWPORT RESIZER ──────────────────────── */
  function responsive() {
    $$('[data-rsp]').forEach(function (group) {
      var opts = $$('.rsp__opt', group);
      var bf = $('[data-bf]', group);
      var host = bf ? $('.bf__scale', bf) : null;
      var dims = { desktop: [1440, 900], tablet: [1024, 860], mobile: [430, 900] };
      function paint() {
        if (!host) return;
        var mode = opts[active].getAttribute('data-w');
        var d = dims[mode] || dims.desktop;
        bf.setAttribute('data-sw', d[0]);
        var vp = $('.bf__vp', bf);
        if (vp) {
          vp.style.setProperty('--ar', d[0] + '/' + d[1]);
          vp.style.setProperty('--sw', d[0] + 'px');
          vp.style.setProperty('--sh', d[1] + 'px');
        }
        /* the real app hands off to the phone layout below 768px, so the
           preview does too — instead of squeezing a desktop layout. */
        if (mode === 'mobile') {
          if (host.__web == null) host.__web = host.innerHTML;
          host.innerHTML = W.phone.home();
          host.classList.remove('stage-seen');
        } else {
          if (host.__web != null && !host.querySelector('.fpw')) host.innerHTML = host.__web;
          host.classList.add('stage-seen');
          var app = $('.fpw', host);
          if (app) {
            if (mode === 'tablet') app.setAttribute('data-collapsed', 'true');
            else app.removeAttribute('data-collapsed');
          }
        }
        var label = $('[data-rsp-label]', group);
        if (label) label.textContent = opts[active].getAttribute('data-label');
        fitAll();
      }
      var active = 0;
      opts.forEach(function (o, i) {
        on(o, 'click', function () {
          active = i;
          opts.forEach(function (x, j) { x.classList.toggle('on', j === i); });
          paint();
        });
      });
      paint();
    });
  }

  /* ── 8 · LIVE APP WINDOWS ─────────────────────────────────── */
  /* The sandbox window renders the real component tree in the page, so its
     controls are plain DOM. A frame-based embed still gets the lazy, opt-in
     pointer treatment: nothing downloads or traps scrolling uninvited.    */
  function liveEmbed() {
    $$('[data-live]').forEach(function (box) {
      var frame = $('iframe', box);
      if (!frame) return;
      var btn = $('[data-live-load]', box);
      var hint = $('[data-live-hint]', box);
      function load() {
        if (!frame || frame.getAttribute('src')) return;
        frame.setAttribute('src', frame.getAttribute('data-src'));
        if (hint) hint.textContent = 'Live app loaded. Page scrolling is never trapped while it is idle.';
      }
      on(btn, 'click', function () {
        load();
        var live = box.classList.toggle('is-live');
        btn.textContent = live ? '■ Stop interacting' : '▶ Interact with the live app';
        btn.classList.toggle('on', live);
      });
      /* only start downloading once the reader actually reaches it */
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (ents) {
          if (ents[0].isIntersecting) { load(); io.disconnect(); }
        }, { rootMargin: '320px' });
        io.observe(box);
      }
    });
    /* slide-15 sandbox: the deployed build itself, lazily attached to the
       1440×900 stage. Once it boots we replay the theme and the step that
       the stage is already showing (auto-play may have advanced while the
       bundle was still downloading).                                  */
    $$('iframe[data-app-frame]').forEach(function (frame) {
      function load() {
        if (!frame.getAttribute('src')) frame.setAttribute('src', frame.getAttribute('data-src'));
      }
      if ('IntersectionObserver' in window) {
        var fio = new IntersectionObserver(function (ents) {
          if (ents[0].isIntersecting) { load(); fio.disconnect(); }
        }, { rootMargin: '320px' });
        fio.observe(frame);
      } else { load(); }
      on(frame, 'load', function () {
        postApp(frame, { type: 'FP_SET_THEME', theme: THEMES[themePhase] });
        var stage = frame.closest('[data-stage]');
        var active = $('[data-step].on', stage);
        var screen = stepScreen(active);
        if (screen) postApp(frame, { type: 'FP_WEB_NAVIGATE', screen: screen });
      });
    });
    $$('[data-open-app]').forEach(function (a) { a.href = APP; a.target = '_blank'; a.rel = 'noopener'; });
    $$('[data-open-showcase]').forEach(function (a) { a.href = SHOWCASE; a.target = '_blank'; a.rel = 'noopener'; });
  }

  /* ── 9 · HERO TILT + AMBIENT PARALLAX ─────────────────────── */
  function parallax() {
    if (reduced) return;
    $$('[data-tilt]').forEach(function (card) {
      on(card, 'mousemove', function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(1200px) rotateY(' + (x * 6).toFixed(2) +
          'deg) rotateX(' + (-y * 4).toFixed(2) + 'deg)';
      });
      on(card, 'mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ── 10 · BOOT ────────────────────────────────────────────── */
  function init() {
    mount();
    buildIndex();
    fitAll();
    reveal();
    chapters();
    stages();
    themeMorph();
    themeCycle();
    appClicks();
    countUp();
    microDemos();
    responsive();
    liveEmbed();
    parallax();

    var rt;
    on(window, 'resize', function () {
      clearTimeout(rt);
      rt = setTimeout(fitAll, 120);
    });
    on(window, 'scroll', onScroll, { passive: true });
    onScroll();
    document.body.classList.add('wc-loaded');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
