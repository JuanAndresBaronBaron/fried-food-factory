// Comportamiento compartido: encabezado, menú móvil, animaciones al hacer scroll,
// botón flotante de WhatsApp y avisos.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Encabezado con sombra al bajar
  var header = document.querySelector("[data-header]");
  var fab = document.querySelector("[data-fab]");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (fab) fab.classList.toggle("show", y > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menú móvil
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest("[data-header]")) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) setMenu(false);
    });
  }

  // Aparición al hacer scroll
  var items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Aviso breve en la parte de abajo
  var toast = document.querySelector("[data-toast]");
  var toastTimer;
  window.fritangaToast = function (msg) {
    if (!toast) return;
    toast.querySelector("span").textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  };
})();
