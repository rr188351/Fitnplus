/* Fitnpulse Showcase — subtle scroll-reveal + device tilt on scroll */
(function () {
  'use strict';

  const revealables = Array.from(document.querySelectorAll('.device, .phone-label'));

  function inView(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight - 60 && r.bottom > 0;
  }

  function check() {
    revealables.forEach((el, i) => {
      if (inView(el)) {
        el.classList.add('in');
        el.style.transitionDelay = (i % 3) * 40 + 'ms';
      }
    });
  }

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check, { passive: true });
  check();
})();

/* ── Light / dark theme toggle ──────────────────────────────────────
   Mirrors the live app: sets <html data-theme> and persists to
   localStorage under the same key ('fp-theme') the React app uses.
   The head script already applied the saved theme before first paint;
   this module wires up the button and keeps the label/icon in sync. ── */
(function () {
  'use strict';

  var KEY = 'fp-theme';

  function current() {
    var el = document.documentElement;
    return el.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var ico = document.getElementById('themeToggleIco');
    var txt = document.getElementById('themeToggleText');
    if (ico) ico.textContent = theme === 'light' ? '☀️' : '🌙';
    if (txt) txt.textContent = theme === 'light' ? 'Light' : 'Dark';
    try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
  }

  window.toggleTheme = function () {
    apply(current() === 'light' ? 'dark' : 'light');
  };

  var btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', window.toggleTheme);

  apply(current()); // sync label/icon on load
})();

/* ── Tap-to-view full screen (no device frame) ─────────────────────
   Clicking any phone mockup opens a fixed overlay that fills the
   viewport (phone width on desktop, edge-to-edge on phones/tablets)
   with native scrolling inside. The ✕ button (top-right), a tap on
   the backdrop, or Esc closes it. ── */
(function () {
  'use strict';

  var overlay = null;
  var closeBtn = null;

  function ensureOverlay() {
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'phone-fullscreen';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    closeBtn = document.createElement('button');
    closeBtn.className = 'fs-close';
    closeBtn.type = 'button';
    closeBtn.title = 'Close full screen';
    closeBtn.setAttribute('aria-label', 'Close full screen');
    closeBtn.textContent = '✕';
    overlay.appendChild(closeBtn);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close(); // tap the backdrop around the screen
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') close();
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function open(device) {
    var src = device.querySelector('.screen');
    if (!src) return;

    ensureOverlay();
    // clear any previous clone so only the tapped screen shows
    Array.prototype.forEach.call(overlay.querySelectorAll('.screen'), function (el) {
      el.parentNode.removeChild(el);
    });

    var clone = src.cloneNode(true);
    overlay.insertBefore(clone, closeBtn);

    overlay.classList.add('open');
    document.documentElement.classList.add('fs-lock');
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.documentElement.classList.remove('fs-lock');
  }

  Array.prototype.forEach.call(document.querySelectorAll('.device'), function (d) {
    d.addEventListener('click', function () {
      open(d);
    });
  });
})();