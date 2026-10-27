// Interacciones de la página de inicio: sabores, comparador de tamaños,
// cifras animadas, línea de proceso y armador de pedidos por WhatsApp.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WHATSAPP = "573116603254";
  var STORE_KEY = "fritanga-pedido";

  var FLAVORS = {
    chicharron: {
      name: "Chicharrón", tag: "Triangular · la más grande", w: "17 cm", h: "8 cm",
      desc: "La más grande de la casa, en forma de triángulo y rellena de chicharrón.",
      img: "assets/foto-chicharron.webp", alt: "Empanada de chicharrón, forma triangular"
    },
    carne: {
      name: "Carne", tag: "Media luna · borde liso", w: "12 cm", h: "7 cm",
      desc: "La clásica de siempre: media luna de borde liso, rellena de carne.",
      img: "assets/foto-carne.webp", alt: "Empanada de carne, media luna de borde liso"
    },
    pollo: {
      name: "Pollo", tag: "Media luna · borde ondulado", w: "12 cm", h: "7.5 cm",
      desc: "Media luna de borde ondulado, rellena de pollo. Fácil de reconocer en la vitrina.",
      img: "assets/foto-pollo.webp", alt: "Empanada de pollo, media luna de borde ondulado"
    }
  };
  var ORDER = ["chicharron", "carne", "pollo"];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function toast(msg) { if (window.fritangaToast) window.fritangaToast(msg); }

  /* ---------- Explorador de sabores ---------- */
  var explorer = $("[data-explorer]");
  var current = "chicharron";
  if (explorer) {
    var tabs = $$(".flavor-tab", explorer);
    var img = $('[data-f="img"]', explorer);
    var panel = $("#flavor-panel");

    var select = function (id, focus) {
      if (!FLAVORS[id] || id === current) return;
      current = id;
      var f = FLAVORS[id];
      tabs.forEach(function (t) {
        var on = t.dataset.flavor === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panel.setAttribute("aria-labelledby", "tab-" + id);
      ["tag", "name", "desc", "w", "h"].forEach(function (k) {
        var el = $('[data-f="' + k + '"]', explorer);
        if (el) el.textContent = f[k];
      });
      if (reduceMotion) {
        img.src = f.img; img.alt = f.alt;
      } else {
        img.classList.add("swap");
        setTimeout(function () {
          img.src = f.img; img.alt = f.alt;
          img.classList.remove("swap");
        }, 220);
      }
    };

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t.dataset.flavor); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[n].dataset.flavor, true); }
      });
    });

    var addBtn = $("[data-add-current]", explorer);
    if (addBtn) addBtn.addEventListener("click", function () {
      addQty(current, 12);
      toast("Agregaste una docena de " + FLAVORS[current].name.toLowerCase() + " a tu pedido");
    });
  }

  /* ---------- Comparador de tamaños ---------- */
  var stage = $("[data-compare]");
  if (stage) {
    var POS = {
      side: { chicharron: [1, 1], carne: [20, 2], pollo: [34, 1.5], card: [5.2, 3.6] },
      overlay: { chicharron: [15, 1], carne: [17.5, 2], pollo: [17.5, 1.5], card: [4.5, 3.6] },
      // En pantallas angostas: chicharrón arriba, carne y pollo abajo
      stack: { chicharron: [5.5, 1], carne: [1, 13], pollo: [15, 12.5], card: [9.7, 3.6] },
      overlayNarrow: { chicharron: [5.5, 1], carne: [8, 2], pollo: [8, 1.5], card: [9.7, 3.6] }
    };
    var VIEWBOX = { side: "0 0 47 12.4", overlay: "0 0 47 12.4", stack: "0 0 28 23", overlayNarrow: "0 0 28 12.4" };
    var svg = $("svg", stage);
    var narrowMq = window.matchMedia("(max-width: 640px)");
    var view = "side";
    var ticks = $("[data-ticks]", stage);
    if (ticks) {
      var html = "";
      for (var x = 0; x <= 45; x++) {
        var big = x % 5 === 0;
        html += '<line x1="' + (x + 1) + '" y1="9" x2="' + (x + 1) + '" y2="' + (big ? 9.35 : 9.18) + '" stroke="#9c7f69" stroke-width=".035"/>';
        if (big) html += '<text x="' + (x + 1) + '" y="9.85">' + x + "</text>";
      }
      ticks.innerHTML = html;
    }
    var place = function () {
      var key = view;
      if (narrowMq.matches) key = view === "side" ? "stack" : "overlayNarrow";
      Object.keys(POS[key]).forEach(function (k) {
        var el = k === "card" ? $(".card", stage) : $('[data-shape="' + k + '"]', stage);
        if (el) el.style.transform = "translate(" + POS[key][k][0] + "px, " + POS[key][k][1] + "px)";
      });
      svg.setAttribute("viewBox", VIEWBOX[key]);
      stage.classList.toggle("overlay", view === "overlay");
      stage.classList.toggle("narrow", narrowMq.matches);
    };
    if (narrowMq.addEventListener) narrowMq.addEventListener("change", place);
    else if (narrowMq.addListener) narrowMq.addListener(place);
    place();
    $$("[data-view]").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("[data-view]").forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        view = b.dataset.view;
        place();
      });
    });
    var cardToggle = $("[data-card-toggle]");
    if (cardToggle) cardToggle.addEventListener("change", function () {
      stage.classList.toggle("with-card", cardToggle.checked);
    });
    $$(".shape", stage).forEach(function (s) {
      var parent = s.parentNode;
      var raise = function () { parent.insertBefore(s, $(".card", stage)); s.classList.add("hl"); };
      var lower = function () { s.classList.remove("hl"); };
      s.addEventListener("mouseenter", raise);
      s.addEventListener("focus", function () { s.classList.add("hl"); });
      s.addEventListener("mouseleave", lower);
      s.addEventListener("blur", lower);
    });
  }

  /* ---------- Cifras animadas ---------- */
  var counters = $$("[data-count]");
  var runCount = function (el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    var suffix = el.dataset.suffix || "";
    if (reduceMotion || target === 0) { el.textContent = target + suffix; return; }
    var start = null, dur = 1200;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = "0" + suffix;
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Línea de proceso ---------- */
  var timeline = $("[data-timeline]");
  if (timeline) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = timeline.getBoundingClientRect();
      var mid = window.innerHeight * 0.6;
      var p = (mid - r.top) / r.height;
      timeline.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Movimiento suave de las fotos del inicio ---------- */
  var art = $("[data-hero-art]");
  if (art && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var inners = $$(".photo-inner", art);
    art.parentNode.addEventListener("pointermove", function (e) {
      var r = art.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      inners.forEach(function (el, i) {
        var depth = [14, 22, 18][i] || 16;
        el.style.setProperty("--mx", (dx * depth).toFixed(1) + "px");
        el.style.setProperty("--my", (dy * depth).toFixed(1) + "px");
      });
    });
    art.parentNode.addEventListener("pointerleave", function () {
      inners.forEach(function (el) { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); });
    });
  }

  /* ---------- Armador de pedidos ---------- */
  var form = $("[data-order]");
  var state = { chicharron: 0, carne: 0, pollo: 0, negocio: "", nombre: "", barrio: "", ciudad: "Pereira", notas: "" };

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (saved && typeof saved === "object") {
        Object.keys(state).forEach(function (k) { if (k in saved) state[k] = saved[k]; });
      }
    } catch (e) { /* sin almacenamiento disponible */ }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ }
  }
  function clamp(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 0) return 0;
    return Math.min(n, 9999);
  }
  function addQty(id, n) {
    state[id] = clamp((state[id] || 0) + n);
    render(id);
    save();
  }
  function plural(n, one, many) { return n === 1 ? one : many; }

  function buildMessage(total) {
    var lines = ["Hola Manuela, quiero hacer un pedido de empanadas Fritanga:", ""];
    ORDER.forEach(function (k) {
      if (state[k] > 0) lines.push("• " + FLAVORS[k].name + ": " + state[k]);
    });
    lines.push("", "Total: " + total + " " + plural(total, "empanada", "empanadas"));
    if (state.negocio.trim()) lines.push("Negocio: " + state.negocio.trim());
    if (state.nombre.trim()) lines.push("Nombre: " + state.nombre.trim());
    var place = [state.barrio.trim(), state.ciudad].filter(Boolean).join(", ");
    if (place) lines.push("Entrega: " + place);
    if (state.notas.trim()) lines.push("Comentarios: " + state.notas.trim());
    lines.push("", "¿Me confirmas el precio y la fecha de entrega? Gracias.");
    return lines.join("\n");
  }

  function render(bumped) {
    if (!form) return;
    var total = 0;
    ORDER.forEach(function (k) {
      total += state[k];
      var input = $('[data-qty="' + k + '"]', form);
      if (input && document.activeElement !== input) input.value = state[k];
      var sum = $('[data-sum="' + k + '"]', form);
      if (sum) {
        sum.textContent = state[k];
        if (bumped === k && !reduceMotion) { sum.classList.remove("bump"); void sum.offsetWidth; sum.classList.add("bump"); }
      }
    });
    var totalEl = $("[data-total]", form);
    totalEl.textContent = total;
    var dz = $("[data-dozens]", form);
    if (total === 0) {
      dz.textContent = "Agrega empanadas para empezar.";
    } else {
      var d = Math.floor(total / 12), r = total % 12;
      var txt = d > 0 ? "Equivale a " + d + " " + plural(d, "docena", "docenas") + (r ? " y " + r + " " + plural(r, "empanada", "empanadas") : "") + "." : total + " " + plural(total, "empanada", "empanadas") + ".";
      dz.textContent = txt;
    }
    var send = $("[data-send]", form);
    if (total > 0) {
      send.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(buildMessage(total));
      send.setAttribute("aria-disabled", "false");
    } else {
      send.href = "https://wa.me/" + WHATSAPP;
      send.setAttribute("aria-disabled", "true");
    }
  }

  if (form) {
    load();
    ["negocio", "nombre", "barrio", "ciudad", "notas"].forEach(function (k) {
      var el = form.elements[k];
      if (!el) return;
      el.value = state[k];
      el.addEventListener("input", function () { state[k] = el.value; render(); save(); });
    });
    $$("[data-step]", form).forEach(function (b) {
      b.addEventListener("click", function () { addQty(b.dataset.step, parseInt(b.dataset.n, 10)); });
    });
    $$("[data-add]", form).forEach(function (b) {
      b.addEventListener("click", function () {
        var n = parseInt(b.dataset.n, 10);
        addQty(b.dataset.add, n);
        toast("+" + n + " de " + FLAVORS[b.dataset.add].name.toLowerCase());
      });
    });
    $$("[data-qty]", form).forEach(function (input) {
      input.addEventListener("input", function () {
        state[input.dataset.qty] = clamp(input.value);
        render(); save();
      });
      input.addEventListener("blur", function () { input.value = state[input.dataset.qty]; });
    });
    $("[data-send]", form).addEventListener("click", function (e) {
      if (this.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        toast("Primero agrega al menos una empanada");
      }
    });
    $("[data-clear]", form).addEventListener("click", function () {
      ORDER.forEach(function (k) { state[k] = 0; });
      render(); save();
      toast("Pedido vacío");
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    render();
  }
})();
