/* Fitnpulse iOS UI/UX Case Study — mobilecase.js
   Reveal engine (IntersectionObserver) + theme demo swap +
   flow theatre + state demos. Transform/opacity only. */
document.addEventListener('DOMContentLoaded', function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stagger: children of .mrv-stagger get 0/90/180/270ms delays
  document.querySelectorAll('.mrv-stagger').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) {
      el.style.setProperty('--rvd', (i * 90) + 'ms');
    });
  });

  // Scroll reveal — once per element
  var revealEls = document.querySelectorAll('.mrv, .mrv-stagger, .mrv-phone');
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

  // Theme demo: swap both compare phones dark <-> light
  var swap = document.getElementById('themeSwap');
  if (swap) {
    swap.addEventListener('click', function () {
      document.querySelectorAll('.theme-col .phn-screen').forEach(function (s) {
        s.classList.toggle('light');
      });
    });
  }

  // UI-state demos: toggles + selectable chips
  document.querySelectorAll('.state-toggle').forEach(function (t) {
    t.addEventListener('click', function () { t.classList.toggle('on'); });
  });
  document.querySelectorAll('[data-chip]').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('on'); });
  });
  // ENHANCED: page loaded flag drives hero cinematic entrance
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ document.body.classList.add('mc-loaded'); }); });

  // Flow theatre: steps drive phone panes with directional motion
  var steps = Array.prototype.slice.call(document.querySelectorAll('.flow-step'));
  var panes = Array.prototype.slice.call(document.querySelectorAll('.flow-pane'));
  var cur = 0, timer = null;

  function show(n) {
    if (!panes.length || n === cur && panes[n].classList.contains('on')) return;
    var dir = n > cur ? 'fwd' : 'back';
    panes.forEach(function (p) { p.classList.remove('on', 'dir-fwd', 'dir-back'); });
    steps.forEach(function (s) { s.classList.remove('on'); });
    panes[n].classList.add('on', dir === 'fwd' ? 'dir-fwd' : 'dir-back');
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
    show(0); panes[0].classList.add('dir-fwd');
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
  // ENHANCED v3: mouse tilt on hero + finale phones, parallax orbs, count-up
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
    // hero parallax orbs follow cursor
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
        // count-up hero metric
    var big = document.querySelector('.mc-hero .app-card .big');
    if (big) {
      var done = false;
      var cio = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting && !done) {
          done = true; cio.disconnect();
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
    /* ENHANCED v4: authentic promotion frame — inject physical buttons once,
       then auto-flick the FRAME light<->dark every 5s (screen content untouched). */
    if (!reduced) {
      document.querySelectorAll('.phn').forEach(function (p) {
        if (!p.querySelector('.phn-btn')) {
          var a = document.createElement('i'); a.className = 'phn-btn';
          var b = document.createElement('i'); b.className = 'phn-btn r';
          p.appendChild(a); p.appendChild(b);
        }
      });
      var frameT = null, frameIdx = 0;
      function frameStep() {
        var phones = document.querySelectorAll('.phn');
        if (!phones.length) return;
        var toLight = frameIdx % 2 === 1;
        phones.forEach(function (p) {
          if (toLight) p.classList.add('light-frame');
          else p.classList.remove('light-frame');
        });
        frameIdx++;
      }
      frameT = setInterval(frameStep, 5000);
      frameStep();
    }
    /* ENHANCED v4: authentic promotion frame — inject physical buttons once,
       then auto-flick the FRAME light<->dark every 5s (screen content untouched). */
    if (!reduced) {
      document.querySelectorAll('.phn').forEach(function (p) {
        if (!p.querySelector('.phn-btn')) {
          var a = document.createElement('i'); a.className = 'phn-btn';
          var b = document.createElement('i'); b.className = 'phn-btn r';
          p.appendChild(a); p.appendChild(b);
        }
      });
      var frameT = null, frameIdx = 0;
      function frameStep() {
        var phones = document.querySelectorAll('.phn');
        if (!phones.length) return;
        var toLight = frameIdx % 2 === 1;
        phones.forEach(function (p) {
          if (toLight) p.classList.add('light-frame');
          else p.classList.remove('light-frame');
        });
        frameIdx++;
      }
      frameT = setInterval(frameStep, 5000);
      frameStep();
    }
  }
});
