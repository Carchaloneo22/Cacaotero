// ==========================================================
// CACAOTERO · interacciones
// ==========================================================
(function () {
  "use strict";

  // ---------- Menú móvil ----------
  const toggle = document.querySelector(".header__toggle");
  const nav = document.getElementById("menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Cerrar al elegir un enlace o al pulsar Escape
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  // Si se agranda la ventana, el menú vuelve a su estado de escritorio
  window.matchMedia("(min-width: 721px)").addEventListener("change", (mq) => {
    if (mq.matches) setMenu(false);
  });

  // ---------- Contadores de impacto ----------
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll("[data-count]");

  function format(el, value) {
    const decimals = Number(el.dataset.decimals || 0);
    let text = value.toFixed(decimals);
    if (el.hasAttribute("data-thousands")) {
      text = Math.round(value).toLocaleString("es-CO");
    }
    if (el.hasAttribute("data-comma")) text = text.replace(".", ",");
    return text;
  }

  function animate(el) {
    const target = parseFloat(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(el, target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = format(el, target);
    }
    requestAnimationFrame(tick);
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => io.observe(el));
  }

  // ---------- Año del pie ----------
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
