/* Ishaan Fartyal */
(function () {
  var root = document.documentElement;

  /* ---------- light / dark ---------- */
  function setTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }
  document.querySelectorAll(".theme-toggle").forEach(function (b) {
    b.addEventListener("click", function () { setTheme(root.dataset.theme === "dark" ? "light" : "dark"); });
  });
  setTheme(root.dataset.theme || "dark");

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- projects: rows that open in place, with slides ---------- */
  document.querySelectorAll(".proj").forEach(function (p) {
    var head = p.querySelector(".proj-head"),
        slides = p.querySelectorAll(".slide"),
        n = slides.length, cur = 0;
    function go(i) {
      cur = (i + n) % n;
      p.querySelectorAll("[data-i]").forEach(function (el) {
        var on = +el.dataset.i === cur;
        if (el.tagName === "BUTTON") el.setAttribute("aria-current", on ? "true" : "false");
        else el.classList.toggle("on", on);
      });
      var c = p.querySelector(".ci"); if (c) c.textContent = cur + 1;
    }
    function open(state) {
      p.classList.toggle("open", state);
      head.setAttribute("aria-expanded", state ? "true" : "false");
    }
    head.addEventListener("click", function () {
      var willOpen = !p.classList.contains("open");
      document.querySelectorAll(".proj.open").forEach(function (o) {
        o.classList.remove("open"); o.querySelector(".proj-head").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        open(true); go(0);
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        p.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
        if (history.replaceState) history.replaceState(null, "", "#" + p.id);
      }
    });
    p.querySelectorAll(".slide-nav [data-i]").forEach(function (b) { b.addEventListener("click", function () { go(+b.dataset.i); }); });
    var prev = p.querySelector(".prev"), next = p.querySelector(".next");
    if (prev) prev.addEventListener("click", function () { go(cur - 1); });
    if (next) next.addEventListener("click", function () { go(cur + 1); });
    p.addEventListener("keydown", function (e) {
      if (!p.classList.contains("open") || e.target === head) return;
      if (e.key === "ArrowRight") go(cur + 1);
      if (e.key === "ArrowLeft") go(cur - 1);
    });
  });
  /* open the project named in the address, e.g. projects.html#secom */
  if (location.hash) {
    var target = document.querySelector(".proj#" + CSS.escape(location.hash.slice(1)));
    if (target) target.querySelector(".proj-head").click();
  }

  /* ---------- travel map: pins open a small photo card ---------- */
  document.querySelectorAll(".mapwrap").forEach(function (wrap) {
    var pop = wrap.querySelector(".popup"); if (!pop) return;
    function show(pin) {
      var d = pin.dataset, svg = wrap.querySelector("svg"), r = svg.getBoundingClientRect(),
          wr = wrap.getBoundingClientRect(), vb = svg.viewBox.baseVal,
          x = r.left - wr.left + (+d.x) * r.width / vb.width, y = r.top - wr.top + (+d.y) * r.height / vb.height;
      pop.querySelector(".t span").textContent = d.place;
      pop.querySelector(".n").textContent = d.note || "";
      var img = pop.querySelector("img"), ph = pop.querySelector(".ph");
      if (d.img) { img.src = d.img; img.alt = d.place; img.hidden = false; ph.hidden = true; }
      else { img.hidden = true; ph.hidden = false; }
      pop.hidden = false;
      var left = x + 16; if (left + pop.offsetWidth > wr.width - 8) left = x - pop.offsetWidth - 16;
      pop.style.left = Math.max(8, left) + "px";
      pop.style.top = Math.max(8, Math.min(y - 40, wr.height - pop.offsetHeight - 8)) + "px";
    }
    wrap.querySelectorAll(".pin").forEach(function (pin) {
      pin.addEventListener("click", function () { show(pin); });
      pin.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(pin); } });
    });
    pop.querySelector(".x").addEventListener("click", function () { pop.hidden = true; });
  });
})();
