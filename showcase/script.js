/* Fitnpulse Showcase — subtle scroll-reveal + device tilt on scroll */
(function () {
  'use strict';

  const revealables = Array.from(document.querySelectorAll('.device, .phone-label, .web-stage-wrapper'));

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

    // Sync theme with the embedded live Fitnpulse web application iframe
    var frame = document.getElementById('webAppFrame');
    if (frame && frame.contentWindow) {
      try {
        frame.contentWindow.postMessage({ type: 'FP_SET_THEME', theme: theme }, '*');
        if (frame.contentDocument && frame.contentDocument.documentElement) {
          frame.contentDocument.documentElement.setAttribute('data-theme', theme);
        }
      } catch (err) { /* ignore cross-origin / loading */ }
    }
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

/* ══════════════════════════════════════════════════════════════
   PRESENTATION MODE SWITCHER (Mobile ↔ Web)
   Smooth Apple-level transition:
   Mobile mode shows the existing 32-screen gallery.
   Web mode shows the actual Fitnpulse web application in desktop shell.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var mobileBtn = document.getElementById('modeMobileBtn');
  var webBtn = document.getElementById('modeWebBtn');
  var gallery = document.getElementById('mobileGallery');
  var webContainer = document.getElementById('webGallery');
  var webFrame = document.getElementById('webAppFrame');
  var reloadBtn = document.getElementById('webReloadBtn');
  var heroSub = document.getElementById('heroSub');
  var heroMeta = document.getElementById('heroMetaText');

  var currentMode = 'mobile';
  var isTransitioning = false;

  var SUB_MOBILE = 'Complete App Screen Showcase — every screen & widget of the live React app, switchable between light & dark.';
  var META_MOBILE = '32 screens · iPhone 14 · Light & Dark theme';

  var SUB_WEB = 'Desktop Web Application Showcase — 40 static browser windows rendering every screen of the responsive React dashboard, generated live from src/data.ts.';
  var META_WEB = '40 web screens · Desktop browser chrome · Light & Dark theme';

  function initWebFrame() {
    if (!webFrame) return;
    if (webFrame.getAttribute('src') === 'about:blank') {
      var src = webFrame.getAttribute('data-src') || 'webapp/index.html';
      webFrame.setAttribute('src', src);

      webFrame.addEventListener('load', function () {
        var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        try {
          webFrame.contentWindow.postMessage({ type: 'FP_SET_THEME', theme: currentTheme }, '*');
          if (webFrame.contentDocument && webFrame.contentDocument.documentElement) {
            webFrame.contentDocument.documentElement.setAttribute('data-theme', currentTheme);
          }
        } catch (e) { /* ignore */ }
      });
    }
  }

  function setMode(mode, immediate) {
    if (mode === currentMode && !immediate) return;
    if (isTransitioning) return;

    var prevMode = currentMode;
    currentMode = mode;

    if (mobileBtn) {
      var isM = (mode === 'mobile');
      mobileBtn.classList.toggle('is-active', isM);
      mobileBtn.setAttribute('aria-pressed', isM ? 'true' : 'false');
    }
    if (webBtn) {
      var isW = (mode === 'web');
      webBtn.classList.toggle('is-active', isW);
      webBtn.setAttribute('aria-pressed', isW ? 'true' : 'false');
    }

    if (mode === 'web') {
      initWebFrame();
      if (heroSub) heroSub.textContent = SUB_WEB;
      if (heroMeta) heroMeta.textContent = META_WEB;

      if (immediate) {
        if (gallery) gallery.style.display = 'none';
        if (webContainer) {
          webContainer.style.display = 'block';
          webContainer.classList.add('mode-in');
          webContainer.classList.remove('mode-out');
        }
        window.dispatchEvent(new Event('scroll'));
        return;
      }

      isTransitioning = true;
      if (gallery) {
        gallery.classList.add('mode-out');
      }

      setTimeout(function () {
        if (gallery) {
          gallery.style.display = 'none';
          gallery.classList.remove('mode-out');
        }
        if (webContainer) {
          webContainer.style.display = 'block';
          webContainer.classList.remove('mode-out');
          // Force reflow for clean CSS transition
          void webContainer.offsetWidth;
          webContainer.classList.add('mode-in');
        }
        window.dispatchEvent(new Event('scroll'));
        isTransitioning = false;
      }, 450);

    } else {
      // Switch back to mobile
      if (heroSub) heroSub.textContent = SUB_MOBILE;
      if (heroMeta) heroMeta.textContent = META_MOBILE;

      if (immediate) {
        if (webContainer) {
          webContainer.style.display = 'none';
          webContainer.classList.remove('mode-in');
        }
        if (gallery) {
          gallery.style.display = '';
          gallery.classList.remove('mode-out');
        }
        return;
      }

      isTransitioning = true;
      if (webContainer) {
        webContainer.classList.remove('mode-in');
        webContainer.classList.add('mode-out');
      }

      setTimeout(function () {
        if (webContainer) {
          webContainer.style.display = 'none';
          webContainer.classList.remove('mode-out');
        }
        if (gallery) {
          gallery.style.display = '';
          void gallery.offsetWidth;
          gallery.classList.remove('mode-out');
        }
        isTransitioning = false;
      }, 450);
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', function () {
      setMode('mobile');
    });
  }
  if (webBtn) {
    webBtn.addEventListener('click', function () {
      setMode('web');
    });
  }

  if (reloadBtn && webFrame) {
    reloadBtn.addEventListener('click', function () {
      try {
        webFrame.contentWindow.location.reload();
      } catch (e) {
        var src = webFrame.getAttribute('data-src') || 'webapp/index.html';
        webFrame.src = src;
      }
    });
  }

  // Keyboard navigation support: 'm' for mobile, 'w' for web
  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'm' || e.key === 'M') {
      setMode('mobile');
    } else if (e.key === 'w' || e.key === 'W') {
      setMode('web');
    }
  });

  // Pre-load web app when user hovers over the Web switcher button for instantaneous click response
  if (webBtn) {
    webBtn.addEventListener('mouseenter', function () {
      initWebFrame();
    }, { once: true });
  }

})();

/* ── Mobile sub-screens: blurred parent app behind each sheet ───────────
   The live app opens these sheets with FitModal on top of the parent
   screen (Community for 24–26, Account for 28–31). The showcase rendered
   them on a plain dark scrim — "nothing behind". Clone the parent
   screen's markup into a .sub-bg layer (blurred + dimmed by styles.css)
   so every sub-screen floats over its own parent, like the web mode. */
(function () {
  'use strict';

  var hosts = document.querySelectorAll('[data-sub-screen]');
  Array.prototype.forEach.call(hosts, function (host) {
    if (host.querySelector(':scope > .sub-bg')) return; // already injected

    var label = document.querySelector(host.getAttribute('data-sub-screen'));
    var device = label ? label.nextElementSibling : null;
    if (!device || !device.classList.contains('device')) return;
    var parent = device.querySelector('.screen');
    if (!parent) return;

    var bg = document.createElement('div');
    bg.className = 'sub-bg';
    bg.setAttribute('aria-hidden', 'true');
    Array.prototype.forEach.call(parent.children, function (node) {
      bg.appendChild(node.cloneNode(true));
    });
    host.insertBefore(bg, host.firstChild);
  });
})();

