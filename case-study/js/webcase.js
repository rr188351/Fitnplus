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

  /* ── 2 · BROWSER FRAME SCALING (design canvas, per-frame) ──────
     Every frame renders the app at its REAL desktop design width
     (data-sw, e.g. 1200) and is then scaled down to whatever the frame
     measures — the 264 px sidebar and the 12-column grid keep their
     intended proportions instead of being squeezed into a narrow box.

     The frame itself is capped by --bf-max so the mockup stays a
     sensible size on the slide and never overflows a laptop, but the
     CANVAS is always the design width. Scaling happens through zoom,
     which re-rasterises at the final size (see .bf__scale in the CSS),
     so the downscale stays sharp and never needs a fractional blur. */
  function fitAll() {
    $$('[data-bf]').forEach(function (bf) {
      var vp = $('.bf__vp', bf);
      if (!vp) return;
      var sw = parseFloat(bf.getAttribute('data-sw')) || 1440;
      /* the canvas height follows the frame's own --ar, so a tighter
         data-sw keeps the exact same shape and can never letterbox
         inside .bf__vp (overflow:hidden would crop it instead). */
      var ar = (vp.style.getPropertyValue('--ar') || '').trim();
      var m = ar.match(/^([\d.]+)\s*\/\s*([\d.]+)$/);
      var sh = m ? Math.round(sw * (parseFloat(m[2]) / parseFloat(m[1]))) : 900;
      var sc = vp.clientWidth / sw;
      if (sc > 0) {
        /* --sw and --sh BOTH have to be written: .bf__scale sizes itself
           from them, and only --ar is declared inline in the markup. */
        vp.style.setProperty('--sw', sw + 'px');
        vp.style.setProperty('--sh', sh + 'px');
        vp.style.setProperty('--sc', sc.toFixed(4));
      }
    });
  }

  /* ── 3 · MOTION CHOREOGRAPHY ─────────────────────────────────
     The presentation used to fade everything up from the same
     direction. It now runs one reusable reveal vocabulary (css §10)
     plus a per-section composition below, so every section has its
     own choreography:

       01 cover        glow → label(top) → type → browser → meta
       02 typography   left text / right specimens, wave assembly
       03 color        left · bottom · right wave with stagger
       04 themes       split: left panel / right panel, captions up
       05 intro        left column + right frame, panels wave
       06 first run    flow chips rise, frame zooms, pages slide
       07 dashboard    frame → sidebar → top bar → widgets → charts
       08 screens      frame + step rail, side panels split
       09 components   translation rows alternate left / right
       10 motion       three-column wave, tiles demonstrate motion
       11 responsive   desktop(left) · tablet(scale) · phone(right)
       12 versus       phone(left) vs web(right), facts stagger up
       13 showcase     browser → notes → floating panels → chips
       14 consistency  fast four-column wave
       15 live app     frame, chrome, route chips, then the panel
       16 thanks       label → title(blur→sharp) → mark → cta

     Every observer is one-shot: a target is unobserved the moment
     it plays, so nothing re-animates while scrolling up and down. */
  var DIRS = ['reveal-up', 'reveal-down', 'reveal-left', 'reveal-right', 'reveal-left-soft',
    'reveal-right-soft', 'reveal-scale', 'reveal-blur', 'reveal-browser', 'reveal-fade'];
  /* the previous .mrv vocabulary — dropped from anything this layer owns,
     so exactly one system drives any given element */
  var OLD = ['mrv', 'mrv-stagger', 'mrv-phone', 'motion-grid', 'm-up', 'm-down', 'm-left',
    'm-right', 'm-diag', 'm-scale', 'm-blur', 'bf--enter', 'in-view'];
  var ioA = null, ioB = null;

  function vars(el, o) {
    if (!o) return;
    Object.keys(o).forEach(function (k) { el.style.setProperty(k, o[k]); });
  }
  function dropOld(el) {
    OLD.forEach(function (c) { el.classList.remove(c); });
  }
  /* dir === undefined → tune-only (the element keeps the class it has) */
  function dress(el, dir, dur, delay) {
    dropOld(el);
    if (!dir) return;
    DIRS.forEach(function (c) { el.classList.remove(c); });
    el.classList.add(dir);
    if (dur) el.style.setProperty('--rv-dur', dur + 's');
    if (delay != null) el.style.setProperty('--rv-delay', delay + 'ms');
  }
  /* resolve one target: play the reveal, remember it, stop watching.
     will-change is applied for the duration only — never permanently.
     Live frames (.reveal-nofx) never receive will-change: that would
     cause Chrome to pre-rasterize the cross-origin iframe at a stale
     resolution and leave the live window soft. */
  function firm(el) {
    var big = (el.classList.contains('reveal-browser') || el.classList.contains('reveal-blur')) &&
      !el.classList.contains('reveal-nofx');
    if (big) {
      el.style.willChange = 'opacity,transform,filter';
      var ms = (parseFloat(el.style.getPropertyValue('--rv-dur')) || .8) * 1000 +
        (parseFloat(el.style.getPropertyValue('--rv-delay')) || 0) + 200;
      setTimeout(function () { el.style.willChange = ''; }, ms);
    }
    el.classList.add('in-view', 'is-visible');
    if (el.hasAttribute('data-bf')) el.classList.add('is-built');
  }
  function makeIO(threshold) {
    return new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        firm(e.target);
        ioA.unobserve(e.target);
        ioB.unobserve(e.target);
      });
    }, { threshold: threshold, rootMargin: '0px 0px -8% 0px' });
  }
  function watch(el) {
    /* a target taller than the viewport can never reach a 0.14 ratio, so
       big frames and tall blocks are watched on a light threshold */
    var tall = el.getBoundingClientRect().height > window.innerHeight * .85;
    (tall || el.hasAttribute('data-bf') ? ioB : ioA).observe(el);
  }
  /* single batched layout read for every target, then a pure observe pass */
  function watchAll(list) {
    var i, tall = [], near = [], r;
    for (i = 0; i < list.length; i++) {
      r = list[i].getBoundingClientRect();
      (r.height > window.innerHeight * .85 || list[i].hasAttribute('data-bf') ? tall : near).push(list[i]);
    }
    tall.forEach(function (el) { ioB.observe(el); });
    near.forEach(function (el) { ioA.observe(el); });
  }

  /* every browser frame: translate + scale + blur, then the replica
     assembles inside it (.is-built drives css §10.7 / §10.8). Frames
     nested in an already-moving column keep a shorter, later move.
     No frame blurs, and no frame layerises. A `filter` on an ancestor
     of the 1440 px canvas makes Chrome bake that whole canvas at a
     fixed raster scale, which is why the replicas came back soft after
     the entrance (and why the live frame — a cross-origin iframe, the
     worst case of it — already had to opt out). The one-shot move is
     translate + scale, which is enough to read as a settle. */
  function frames() {
    $$('[data-bf]').forEach(function (bf) {
      var nested = !!bf.closest('.mrv-phone, .vs__side, .th-col, .fn-float') ||
        !!bf.parentElement.closest('.wc-two');
      var live = !!bf.querySelector('iframe[data-app-frame]');
      dropOld(bf);
      bf.classList.add('reveal-browser', 'reveal-nofx');
      bf.style.setProperty('--rv-s', '0.94');
      if (live) {
        bf.style.setProperty('--rv-ty', '55px');
        bf.style.setProperty('--rv-dur', '1.15s');
        bf.style.setProperty('--rv-delay', '180ms');
        bf.style.setProperty('--bf-delay', '340ms');
      } else {
        bf.style.setProperty('--rv-ty', nested ? '44px' : '68px');
        bf.style.setProperty('--rv-dur', nested ? '.95s' : '1.05s');
        bf.style.setProperty('--rv-delay', nested ? '170ms' : '0ms');
        bf.style.setProperty('--bf-delay', nested ? '170ms' : '0ms');
      }
    });
  }


  /* ── 3b · PER-SECTION COMPOSITION ────────────────────────────
     [ section, [ items ] ] · item keys:
       sel      selector inside the section
       dir      reveal class (omit → tune vars only)
       wave     per-child directions, cycled
       mode     'group' → one [data-stagger] group, released in one pass
       dur      seconds · delay ms · stagger ms per item
       settle   add reveal-settle (scale .96 → 1)
       vars     extra custom properties
     Speeds: hero 60ms per item · normal 70–90 · cinematic 120.    */
  var MOTION = [
    /* 01 · COVER — the cinematic opener */
    ['#cover', [
      { sel: '.wc-kicker', dir: 'reveal-down', dur: .6, delay: 120 },
      { sel: '.wc-hero__title', dir: 'reveal-up', dur: 1.05, delay: 210 },
      { sel: '.wc-hero .tag', dir: 'reveal-up', dur: .7, delay: 330 },
      { sel: '.wc-hero .sub', dir: 'reveal-up', dur: .85, delay: 410 },
      { sel: '.wc-meta > div', dir: 'reveal-up', dur: .6, delay: 540, stagger: 70, settle: true },
      { sel: '.wc-cta > a', dir: 'reveal-up', dur: .6, delay: 700, stagger: 90 },
      { sel: '.wc-hero-visual .bf', vars: { '--rv-ty': '70px', '--rv-dur': '1.15s', '--rv-delay': '320ms', '--bf-delay': '320ms' } },
      { sel: '.wc-legend-row > div', dir: 'reveal-up', dur: .6, delay: 820, stagger: 80 },
      { sel: '.wc-orb', dir: 'reveal-fade', dur: 1.8 }
    ]],
    /* 02 · TYPOGRAPHY — text from the left, specimens assemble */
    ['#type', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-left', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-left', dur: .85, delay: 170 },
      { sel: '.ty-specs', mode: 'group', dur: .7, delay: 60, stagger: 70,
        wave: ['reveal-right', 'reveal-right-soft', 'reveal-up', 'reveal-left-soft', 'reveal-up', 'reveal-right-soft', 'reveal-up'] },
      { sel: '.ty-note', dir: 'reveal-up', dur: .6 }
    ]],
    /* 03 · COLOR — the wave: left · bottom · right · bottom … */
    ['#color', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .8, delay: 170 },
      { sel: '.sw-grid', mode: 'group', dur: .7, delay: 60, stagger: 90, settle: true,
        wave: ['reveal-left', 'reveal-up', 'reveal-right', 'reveal-up', 'reveal-left', 'reveal-up', 'reveal-right', 'reveal-up'] },
      { sel: '.wc-note', dir: 'reveal-up', dur: .6 }
    ]],
    /* 04 · THEMES — split panels cross-dissolve against each other */
    ['#themes', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-blur', dur: .95, delay: 80 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .8, delay: 180 },
      { sel: '.th-pair > .th-col:nth-child(1)', dir: 'reveal-left', dur: .95, delay: 120 },
      { sel: '.th-pair > .th-col:nth-child(2)', dir: 'reveal-right', dur: 1.05, delay: 240 },
      { sel: '.th-cap', dir: 'reveal-up', dur: .6, delay: 480, stagger: 80 },
      { sel: '.stage__autoplay', dir: 'reveal-up', dur: .55, delay: 620 }
    ]],
    /* 05 · WEB APPLICATION — left column, right frame */
    ['#intro', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.wc-two > div:first-child', dir: 'reveal-left-soft', dur: .85, delay: 60 },
      { sel: '.wc-four', mode: 'group', dur: .7, delay: 60, stagger: 80, settle: true,
        wave: ['reveal-left', 'reveal-up', 'reveal-right', 'reveal-up'] },
      { sel: '.mrv-phone', dir: 'reveal-right', dur: .95, delay: 140, vars: { '--rv-tx': '60px' } },
      { sel: '.wc-note', dir: 'reveal-up', dur: .6 }
    ]],
    /* 06 · FIRST RUN — the journey chips rise, the frame zooms in */
    ['#auth', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-blur', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .8, delay: 180 },
      { sel: '.stage__steps .stage__step', dir: 'reveal-up', dur: .5, delay: 140, stagger: 60 },
      { sel: '.stage > .bf', vars: { '--rv-delay': '220ms', '--bf-delay': '220ms' } },
      { sel: '.stage > .stage__autoplay', dir: 'reveal-up', dur: .55, delay: 240 }
    ]],
    /* 07 · DASHBOARD — the strongest assembly on the page */
    ['#home', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.bf', vars: { '--rv-ty': '62px', '--rv-dur': '1.15s', '--rv-delay': '160ms', '--bf-delay': '160ms' } },
      { sel: '.wc-four', mode: 'group', dur: .7, delay: 120, stagger: 80, settle: true,
        wave: ['reveal-left', 'reveal-up', 'reveal-right', 'reveal-up'] },
      { sel: '.ty-note', dir: 'reveal-up', dur: .6 }
    ]],
    /* 08 · SCREENS — route rail rises, side panels split */
    ['#screens', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-left', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.stage__steps .stage__step', dir: 'reveal-up', dur: .5, delay: 140, stagger: 60 },
      { sel: '.stage > .bf', vars: { '--rv-ty': '62px', '--rv-delay': '200ms', '--bf-delay': '200ms' } },
      { sel: '.stage > .stage__autoplay', dir: 'reveal-up', dur: .55, delay: 220 },
      { sel: '.wc-two > div:first-child', dir: 'reveal-left', dur: .9, delay: 80 },
      { sel: '.wc-two > div:last-child', dir: 'reveal-right', dur: .9, delay: 180 },
      { sel: '.fn-stack', mode: 'group', dur: .65, delay: 80, stagger: 70,
        wave: ['reveal-right', 'reveal-up', 'reveal-right-soft'] }
    ]],
    /* 09 · COMPONENTS — every translation row answers from its own side */
    ['#components', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.mover', mode: 'group', dur: .7, delay: 60, stagger: 80,
        wave: ['reveal-left', 'reveal-right', 'reveal-left-soft', 'reveal-right-soft', 'reveal-left'] },
      { sel: '.wc-two > div:first-child', dir: 'reveal-left', dur: .9, delay: 120 },
      { sel: '.wc-two > div:last-child', dir: 'reveal-right', dur: .9, delay: 200 },
      { sel: '.fn-stack', mode: 'group', dur: .65, delay: 60, stagger: 70,
        wave: ['reveal-right', 'reveal-up', 'reveal-right-soft'] },
      { sel: '.wc-note', dir: 'reveal-up', dur: .6 }
    ]],
    /* 10 · MOTION — three-column wave; the tiles demonstrate it */
    ['#motion', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-blur', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .8, delay: 180 },
      { sel: '.mo-grid', mode: 'group', dur: .7, delay: 80, stagger: 70, settle: true,
        wave: ['reveal-left', 'reveal-up', 'reveal-right'] },
      { sel: '.wc-note', dir: 'reveal-up', dur: .6 }
    ]],
    /* 11 · RESPONSIVE — desktop left · tablet centre · phone right */
    ['#responsive', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.rsp', mode: 'group', dur: .75, delay: 80, stagger: 100, settle: true,
        wave: ['reveal-left', 'reveal-scale', 'reveal-right'] },
      { sel: '.bf', vars: { '--rv-ty': '58px', '--rv-delay': '240ms', '--bf-delay': '240ms' } },
      { sel: '.wc-note', dir: 'reveal-up', dur: .6 }
    ]],
    /* 12 · MOBILE VS WEB — phone left, web right, facts stagger up */
    ['#versus', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.stage__steps .stage__step', dir: 'reveal-up', dur: .5, delay: 140, stagger: 60 },
      { sel: '.vs__side:first-child', dir: 'reveal-left', dur: .9, delay: 120, vars: { '--rv-s': '.985' } },
      { sel: '.vs__side:last-child', dir: 'reveal-right', dur: 1, delay: 200, vars: { '--rv-tx': '70px', '--rv-s': '.975' } },
      { sel: '.vs__tag', dir: 'reveal-up', dur: .5, delay: 140, stagger: 60 },
      { sel: '.vs-facts > div', dir: 'reveal-up', dur: .5, delay: 200, stagger: 50 },
      { sel: '.vs__note', dir: 'reveal-up', dur: .6, delay: 320, stagger: 80 },
      { sel: '.stage > .stage__autoplay', dir: 'reveal-up', dur: .5, delay: 200 },
      { sel: '.wc-four', mode: 'group', dur: .65, delay: 60, stagger: 70,
        wave: ['reveal-left', 'reveal-up', 'reveal-right', 'reveal-up'] }
    ]],
    /* 13 · FINAL SHOWCASE — back panels, browser, then the front layer */
    ['#finale', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-blur', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.fn-grid > .bf', vars: { '--rv-ty': '80px', '--rv-s': '.93', '--rv-b': '12px', '--rv-dur': '1.2s', '--rv-delay': '220ms', '--bf-delay': '220ms' } },
      { sel: '.fn-stack', mode: 'group', dur: .7, delay: 120, stagger: 120,
        wave: ['reveal-right', 'reveal-up', 'reveal-right-soft'] },
      { sel: '.fn-float > .bf', vars: { '--rv-ty': '64px', '--rv-delay': '180ms', '--bf-delay': '180ms' } },
      { sel: '.fn-float', dir: 'reveal-up', dur: .85, delay: 100 },
      { sel: '.fn-float .fn-note', dir: 'reveal-up', dur: .7, delay: 320 },
      { sel: '.fn-chips .fn-chip', dir: 'reveal-scale', dur: .5, delay: 520, stagger: 60 }
    ]],
    /* 14 · CONSISTENCY — fast, disciplined four-column wave */
    ['#consistency', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.wc-four', mode: 'group', dur: .62, delay: 60, stagger: 60,
        wave: ['reveal-left', 'reveal-up', 'reveal-right', 'reveal-up'] }
    ]],
    /* 15 · LIVE WEB APP — chips rise, frame + chrome settle, panel last.
       Nothing here touches the iframe once it settles: only the
       .bf__vp box it sits in moves, and only once.                  */
    ['#live', [
      { sel: '.mc-eyebrow', dir: 'reveal-down', dur: .55 },
      { sel: ':scope > .mc-wrap > h2', dir: 'reveal-up', dur: .95, delay: 90 },
      { sel: ':scope > .mc-wrap > .mc-lede', dir: 'reveal-up', dur: .85, delay: 180 },
      { sel: '.stage__steps .stage__step', dir: 'reveal-up', dur: .5, delay: 160, stagger: 60 },
      { sel: '.stage > .bf', vars: { '--rv-ty': '62px', '--rv-delay': '180ms', '--rv-dur': '1.1s', '--bf-delay': '180ms' } },
      { sel: '.stage > .stage__autoplay', dir: 'reveal-up', dur: .5, delay: 220 },
      { sel: '.live__eyebrow', dir: 'reveal-up', dur: .5, delay: 60 },
      { sel: '.appwin__routes .appwin__route', dir: 'reveal-up', dur: .45, delay: 560, stagger: 70 },
      { sel: '.appwin__note', dir: 'reveal-up', dur: .5, delay: 620 },
      { sel: '.appwin .stage__autoplay', dir: 'reveal-up', dur: .5, delay: 700 },
      { sel: '.live__hint--panel', dir: 'reveal-right', dur: .7, delay: 780 },
      { sel: '.live__card', dir: 'reveal-right', dur: .85, delay: 200 },
      { sel: '.live__card .live__list li', dir: 'reveal-up', dur: .5, delay: 420, stagger: 50 },
      { sel: '.live__card .wc-cta > a', dir: 'reveal-up', dur: .5, delay: 700, stagger: 90 }
    ]],
    /* 16 · THANK YOU — minimal: label, title (blur → sharp), mark, cta */
    ['#thanks', [
      { sel: '.cta-panel', dir: 'reveal-fade', dur: .9 },
      { sel: '.cta-panel .eyebrow', dir: 'reveal-up', dur: .55, delay: 120 },
      { sel: '.cta-panel .cta-title', dir: 'reveal-blur', dur: 1, delay: 240, vars: { '--rv-s': '.96', '--rv-b': '14px' } },
      { sel: '.cta-panel .cta-sub', dir: 'reveal-up', dur: .6, delay: 380 },
      { sel: '.cta-panel .wc-cta > a', dir: 'reveal-up', dur: .55, delay: 480, stagger: 80 },
      { sel: '.cta-aurora', dir: 'reveal-fade', dur: 1.6 },
      { sel: '.cta-bubbles', dir: 'reveal-fade', dur: 1.8, delay: 120 }
    ]],
    ['footer.mc-foot', [
      { sel: '.mc-wrap', dir: 'reveal-up', dur: .6 }
    ]]
  ];

  function compose() {
    var seen = [];
    MOTION.forEach(function (entry) {
      var root = $(entry[0]);
      if (!root) return;
      entry[1].forEach(function (it) {
        var els = $$(it.sel, root);
        if (!els.length) return;
        if (it.mode === 'group') {
          els.forEach(function (g) {
            dropOld(g);
            g.setAttribute('data-stagger', '');
            if (it.stagger) g.style.setProperty('--stagger', it.stagger + 'ms');
            Array.prototype.forEach.call(g.children, function (child, i) {
              var dir = it.wave && it.wave.length ? it.wave[i % it.wave.length] : it.dir;
              child.style.setProperty('--i', i);
              if (it.dur) child.style.setProperty('--rv-dur', it.dur + 's');
              if (it.delay != null) child.style.setProperty('--rv-delay', it.delay + 'ms');
              if (it.settle) child.classList.add('reveal-settle');
              vars(child, it.vars);
              if (!dir) return;
              DIRS.forEach(function (c) { child.classList.remove(c); });
              child.classList.add(dir);
            });
            seen.push(g);
          });
        } else {
          els.forEach(function (el, i) {
            var dir = it.wave && it.wave.length ? it.wave[i % it.wave.length] : it.dir;
            dress(el, dir, it.dur, it.delay != null ? it.delay + i * (it.stagger || 0) : null);
            if (it.settle) el.classList.add('reveal-settle');
            vars(el, it.vars);
            seen.push(el);
          });
        }
      });
    });
    return seen;
  }

  function choreograph() {
    var hero = $('#cover');
    if (!('IntersectionObserver' in window)) {          /* no IO: show it all */
      $$('[data-bf], .mrv, .mrv-stagger, .mrv-phone').forEach(firm);
      return;
    }
    document.body.classList.add('wc-motion');           /* arms the pre-states */
    ioA = makeIO(.14);
    ioB = makeIO(.01);
    frames();
    var targets = $$('[data-bf]').concat(compose());
    watchAll(targets);
    if (hero && !reduced) {
      requestAnimationFrame(function () { hero.classList.add('is-armed'); });
    }
    /* anything still on the old vocabulary keeps working unchanged */
    watchAll($$('.mrv, .mrv-stagger, .mrv-phone, .motion-grid, .bf--enter'));
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

      /* The replica's content area is a real scroll container (see
         .fpw__content). Hold the tour still while the user reads or
         scrolls inside the app, then resume — same holdAuto pattern the
         phone preview uses in mobilecase.js, so an in-app scroll never
         races the auto-advance.
         Listeners sit on the [data-pages] host, which is static markup,
         and rely on bubbling: the replica DOM is generated later, so
         binding to .fpw__content here would silently miss it. */
      var scrollHost = $('[data-pages]', root);
      if (scrollHost) {
        var resumeT = null;
        var holdAuto = function () {
          if (timer) stop();
          if (resumeT) clearTimeout(resumeT);
          resumeT = setTimeout(function () { resumeT = null; start(); }, 4200);
        };
        on(scrollHost, 'wheel', holdAuto, { passive: true });
        on(scrollHost, 'touchstart', holdAuto, { passive: true });
        on(scrollHost, 'touchmove', holdAuto, { passive: true });
        on(scrollHost, 'pointerdown', holdAuto, { passive: true });
      }

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
      /* Each option previews a real viewport of the app. The canvas is
         always the design width for that viewport, so the replica lays
         out as a genuine desktop shell and is scaled down to fit the
         (--bf-max capped) frame. */
      var dims = { desktop: [1200, 750], tablet: [1024, 860], mobile: [430, 900] };
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

  /* ── 9 · HERO TILT + SCROLL PARALLAX ──────────────────────── */
  /* Tilt stays on the two decorative hero/finale frames. The scroll
     layer moves decorative backgrounds only — glows, the aurora and
     the orb — never text, and never a frame that is animating.
     One rAF per scroll burst, all reads batched before all writes,
     and `translate` is used so the existing drift keyframes on
     .wc-orb / .cta-bubble keep running underneath.               */
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

    var layers = [{ el: $('#cover'), k: .05, max: 34 }, { el: $('.cta-panel'), k: -.045, max: 28 },
      { el: $('#finale'), k: .03, max: 20 }].filter(function (L) { return !!L.el; });
    $$('.bf__glow').forEach(function (g) { layers.push({ el: g, k: .035, max: 24 }); });
    if (!layers.length || !window.requestAnimationFrame) return;

    var queued = false;
    function paint() {
      queued = false;
      var vh = window.innerHeight, mid = vh / 2, out = [], i, r, y;
      for (i = 0; i < layers.length; i++) {                 /* read … */
        r = layers[i].el.getBoundingClientRect();
        if (r.bottom < -240 || r.top > vh + 240) { out.push(null); continue; }
        y = (r.top + r.height / 2 - mid) * layers[i].k;
        out.push(Math.max(-layers[i].max, Math.min(layers[i].max, y)));
      }
      for (i = 0; i < layers.length; i++) {                 /* … then write */
        if (out[i] !== null) layers[i].el.style.setProperty('--plx', out[i].toFixed(1) + 'px');
      }
    }
    function queue() { if (!queued) { queued = true; window.requestAnimationFrame(paint); } }
    on(window, 'scroll', queue, { passive: true });
    on(window, 'resize', queue);
    paint();
  }

  /* ── 10 · BOOT ────────────────────────────────────────────── */
  function init() {
    mount();
    buildIndex();
    fitAll();
    choreograph();
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
