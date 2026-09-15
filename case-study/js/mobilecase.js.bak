/* Fitnpulse iOS UI/UX Case Study — mobilecase.js
   Reveal (IO) + theme swap + flow theatre + state demos.
   Phone hardware (.phn frame) is permanent dark titanium — never animated or themed;
   Dark <-> Light applies ONLY inside the app screen (.phn-screen).
   Transform/opacity only; honours prefers-reduced-motion. */
document.addEventListener('DOMContentLoaded', function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.mrv-stagger').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) {
      el.style.setProperty('--rvd', (i * 90) + 'ms');
    });
  });

  /* motion grid — master slide-22 choreography: alternate left/right entry, 90ms steps */
  document.querySelectorAll('.motion-grid').forEach(function (grid) {
    var dirs = ['rv-l', 'rv-r'];
    Array.prototype.forEach.call(grid.children, function (el, i) {
      el.classList.add(dirs[i % dirs.length]);
      el.style.setProperty('--rvd', Math.min(i * 90, 720) + 'ms');
    });
  });

  var revealEls = document.querySelectorAll('.mrv, .mrv-stagger, .mrv-phone, .motion-grid');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  var swap = document.getElementById('themeSwap');
  if (swap) {
    swap.addEventListener('click', function () {
      document.querySelectorAll('.theme-col .phn-screen').forEach(function (s) {
        s.classList.toggle('light');
      });
    });
  }

  /* theme-morph demo — ported from main.js slide-22 handler */
  var themeDemoBtn = document.getElementById('theme-demo-btn');
  if (themeDemoBtn) {
    themeDemoBtn.addEventListener('click', function () {
      var demo = document.getElementById('theme-demo');
      if (!demo) return;
      var screen = demo.querySelector('.td-screen');
      var switched = demo.classList.toggle('switched');
      if (screen) {
        screen.classList.toggle('td-dark', !switched);
        screen.classList.toggle('td-light', switched);
      }
      themeDemoBtn.textContent = switched ? 'Toggle to Dark' : 'Toggle to Light';
    });
  }

  /* count-up demo — master runCounter (1500ms cubic ease-out) */
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('[data-target]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      if (isNaN(target)) return;
      if (reduced) { el.textContent = Math.round(target).toLocaleString('en-US'); return; }
      var cio = new IntersectionObserver(function (ents) {
        if (!ents[0].isIntersecting || el.__mcCounted) return;
        el.__mcCounted = true;
        cio.disconnect();
        var t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1500, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * e).toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }, { threshold: 0.4 });
      cio.observe(el);
    });
  }

  /* cover showreel — reused for BOTH the hero banner (#cover-phone)
     and the finale (#cover-phone-finale): 4 app screens × dark/light,
     5s cadence, frame hardware stable while the inside crossfades */
  function initCoverShowreel(id) {
    var coverPhone = document.getElementById(id);
    if (!coverPhone) return;
    var darkLayer = coverPhone.querySelector('.cover-theme-dark');
    var lightLayer = coverPhone.querySelector('.cover-theme-light');
    var wrap = darkLayer ? darkLayer.querySelector('.cover-screens') : null;
    if (!wrap) return;
    var clone = wrap.cloneNode(true);
    if (lightLayer && clone) lightLayer.appendChild(clone);
    var darkScreens = wrap.querySelectorAll('.cs-screen');
    var lightScreens = clone ? clone.querySelectorAll('.cs-screen') : null;
    var total = darkScreens.length;
    if (!total) return;
    function setActive(list, i) {
      for (var k = 0; k < list.length; k++) {
        list[k].classList.toggle('s-active', k === i);
        list[k].setAttribute('aria-hidden', k === i ? 'false' : 'true');
      }
    }
    var state = 0;
    function applyState() {
      var screen = Math.floor(state / 2) % total;
      var lightOn = (state % 2) === 1;
      setActive(darkScreens, screen);
      if (lightScreens && lightScreens.length) setActive(lightScreens, screen);
      if (darkLayer) darkLayer.style.opacity = lightOn ? '0' : '1';
      if (lightLayer) lightLayer.style.opacity = lightOn ? '1' : '0';
    }
    setActive(darkScreens, 0);
    if (lightScreens && lightScreens.length) setActive(lightScreens, 0);
    if (reduced) return;
    window.setInterval(function () {
      state = (state + 1) % (total * 2);
      applyState();
    }, 5000);
  }
  initCoverShowreel('cover-phone');

  /* finale showcase — 4 phones (Home/Progress/Community/Account),
     each shows ONE screen; dark/light toggles sync across all four */
  function initFinaleShowreel() {
    var phones = document.querySelectorAll('.finale-phone .cover-phone');
    var lightOn = false;
    phones.forEach(function (phone) {
      var darkLayer = phone.querySelector('.cover-theme-dark');
      var lightLayer = phone.querySelector('.cover-theme-light');
      var wrap = darkLayer ? darkLayer.querySelector('.cover-screens') : null;
      if (!wrap || !lightLayer) return;
      var clone = wrap.cloneNode(true);
      lightLayer.appendChild(clone);
    });
    if (reduced) return;
    window.setInterval(function () {
      lightOn = !lightOn;
      phones.forEach(function (phone) {
        var dl = phone.querySelector('.cover-theme-dark');
        var ll = phone.querySelector('.cover-theme-light');
        if (dl) dl.style.opacity = lightOn ? '0' : '1';
        if (ll) ll.style.opacity = lightOn ? '1' : '0';
      });
    }, 5000);
  }
  initFinaleShowreel();

  document.querySelectorAll('.state-toggle').forEach(function (t) {
    t.addEventListener('click', function () { t.classList.toggle('on'); });
  });
  document.querySelectorAll('[data-chip]').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('on'); });
  });

  // Flow theatre — uses .cs-screen panes with .s-active class
  var steps = Array.prototype.slice.call(document.querySelectorAll('.flow-step'));
  var panes = Array.prototype.slice.call(document.querySelectorAll('.flow-stage .cs-screen'));
  var cur = 0, timer = null;
  function show(n) {
    if (!panes.length || n === cur && panes[n].classList.contains('s-active')) return;
    var dir = n > cur ? 'fwd' : 'back';
    panes.forEach(function (p) { p.classList.remove('s-active', 'dir-fwd', 'dir-back'); });
    steps.forEach(function (s) { s.classList.remove('on'); });
    panes[n].classList.add('s-active', dir === 'fwd' ? 'dir-fwd' : 'dir-back');
    if (steps[n]) steps[n].classList.add('on');
    cur = n;
  }
  function auto() {
    if (reduced || !panes.length) return;
    stop();
    timer = setInterval(function () { show((cur + 1) % panes.length); }, 3800);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  if (steps.length && panes.length) {
    show(0);
    panes[0].classList.add('dir-fwd');
    steps.forEach(function (s, i) {
      s.addEventListener('click', function () { show(i); auto(); });
    });
    var stage = document.querySelector('.flow-stage');
    if (stage) {
      stage.addEventListener('mouseenter', stop);
      stage.addEventListener('mouseleave', auto);
    }
    auto();
  }

  /* splash: static honest loop — no fake % or parallax (matches real app) */

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('mc-loaded'); });
  });

  // v4: tilt + parallax orbs + count-up (phone frame hardware stays constant dark titanium)
  if (!reduced) {
    document.querySelectorAll('.mc-hero-visual .tilt, .finale-row .phn').forEach(function (card) {
      card.addEventListener('mousemove', function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
    var hero = document.querySelector('.mc-hero');
    if (hero) {
      hero.addEventListener('mousemove', function (ev) {
        var r = hero.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        hero.style.setProperty('--mx', x.toFixed(3));
        hero.style.setProperty('--my', y.toFixed(3));
      });
    }
    // hero metric count-up
    var big = document.querySelector('.mc-hero .app-card .big');
    if (big) {
      var done = false;
      var cio = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting && !done) {
          done = true;
          cio.disconnect();
          var target = 12847, t0 = null;
          function tick(t) {
            if (!t0) t0 = t;
            var p = Math.min((t - t0) / 1400, 1);
            var e = 1 - Math.pow(1 - p, 3);
            big.textContent = Math.round(target * e).toLocaleString('en-US');
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      }, { threshold: 0.4 });
      cio.observe(big);
    }
    // promotion-style frame: real physical side buttons (injected once — hardware only)
    document.querySelectorAll('.phn').forEach(function (p) {
      if (!p.querySelector('.phn-btn')) {
        var a = document.createElement('i'); a.className = 'phn-btn';
        var b = document.createElement('i'); b.className = 'phn-btn r';
        p.appendChild(a);
        p.appendChild(b);
      }
    });
  }
});