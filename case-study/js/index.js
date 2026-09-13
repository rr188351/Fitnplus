/* ===== frame-only auto light/dark every 5s =====
   Swaps ONLY the phone frame between dark and light.
   The interior screen UI never receives a coordinated light-mode morph
   from this timer — it stays as authored. If you want the interior to
   follow, wire a separate lightModeInterior toggle independently. */
(function () {
  var devices = document.querySelectorAll(".phone-frame, [data-frame]");
  var reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!devices.length) return;

  function setFrame (light) {
    for (var i = 0; i < devices.length; i++) {
      devices[i].setAttribute("data-frame-light", light ? "1" : "0");
    }
  }

  if (reduced) { setFrame(false); return; }

  setFrame(false);
  setInterval(function () {
    var current = devices[0].getAttribute("data-frame-light") === "1";
    setFrame(!current);
  }, 5000);
})();