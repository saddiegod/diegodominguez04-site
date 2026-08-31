/* Diego Domínguez — site.js */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-compact", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const overlay = document.getElementById("nav-overlay");
  const toggle = document.querySelector(".nav-toggle");
  const closeBtn = document.querySelector(".nav-close, [data-close]");
  let lastFocus = null;

  function openNav() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    overlay.removeAttribute("hidden");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    if (closeBtn) closeBtn.focus();
  }
  function closeNav() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  if (toggle) toggle.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  if (overlay) {
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  const foots = document.querySelectorAll("[data-overlay-quotes]");
  const quotes = [
    "Las preguntas están ahí, formuladas. Pero no hay respuestas.",
    "dd. m. 365 días, 365 poemas.",
    "Nada es lo que parece, o sí",
    "¡Adelante!",
  ];
  foots.forEach(function (el) {
    const q = el.querySelector("[data-q]");
    if (!q || reduce) return;
    let i = 0;
    window.setInterval(function () {
      i = (i + 1) % quotes.length;
      q.textContent = quotes[i];
    }, 7000);
  });

  const clock = document.querySelector("[data-clock]") || document.querySelector(".clock");
  const isErratical = clock && clock.classList.contains("erratical-clock");

  function pad(n) {
    n = Math.max(0, Math.floor(n));
    return String(n).padStart(2, "0");
  }

  function tick() {
    if (!clock) return;

    // the erratic collapse clock logic for the homepage
    if (isErratical) {
        const dEl = clock.querySelector("[data-d], #clk-d");
        const hEl = clock.querySelector("[data-h], #clk-h");
        const mEl = clock.querySelector("[data-m], #clk-m");
        const sEl = clock.querySelector("[data-s], #clk-s");

        // Stutters, glitches, and advances weirdly
        const randomSeed = Math.random();

        let pseudoDays = 289 + Math.floor(randomSeed * 5); // 289/365 horizon base
        let pseudoHours = Math.floor(Math.random() * 24);
        let pseudoMinutes = Math.floor(Math.random() * 60);
        let pseudoSeconds = Math.floor(Math.random() * 60);

        if(dEl) dEl.textContent = String(pseudoDays);
        if(hEl) hEl.textContent = pad(pseudoHours);
        if(mEl) mEl.textContent = pad(pseudoMinutes);
        if(sEl) {
            const secStr = pad(pseudoSeconds);
            sEl.textContent = secStr;
            sEl.setAttribute("data-text", secStr);
            sEl.classList.toggle("is-hitch", Math.random() > 0.5);
        }
    } else {
        // Fallback for standard clock (if used elsewhere)
        const origin = Date.parse("2024-12-25T00:00:00-06:00");
        const rock = document.querySelector("[data-rock]");
        const now = Date.now();
        let ms = now - origin;
        let hitch = false;
        if (!reduce && now % 47000 < 900) {
          ms = Math.max(0, ms - Math.floor(ms * 0.03));
          hitch = true;
        }
        if (ms < 0) ms = 0;
        const s = Math.floor(ms / 1000);
        const dEl = clock.querySelector("[data-d], #clk-d");
        const hEl = clock.querySelector("[data-h], #clk-h");
        const mEl = clock.querySelector("[data-m], #clk-m");
        const sEl = clock.querySelector("[data-s], #clk-s");
        if (dEl) dEl.textContent = String(Math.floor(s / 86400));
        if (hEl) hEl.textContent = pad(Math.floor(s / 3600) % 24);
        if (mEl) mEl.textContent = pad(Math.floor(s / 60) % 60);
        if (sEl) {
          sEl.textContent = pad(s % 60);
          sEl.classList.toggle("is-hitch", hitch);
        }
        if (rock) rock.classList.toggle("is-hitch", hitch);
    }
  }

  if (clock) {
    tick();
    // if erratic, update less predictably to simulate breaking
    const intervalTime = isErratical ? (Math.random() * 1500 + 500) : (reduce ? 60000 : 250);

    if(isErratical) {
        function erraticLoop() {
            tick();
            window.setTimeout(erraticLoop, Math.random() * 2000 + 100);
        }
        erraticLoop();
    } else {
        window.setInterval(tick, intervalTime);
    }
  }

  const reveal = document.querySelectorAll(".reveal, .fragment-reveal");
  function markVisible() {
    reveal.forEach(function (n) {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) n.classList.add("is-in");
    });
  }
  if (reveal.length) {
    markVisible();
    if (reduce || !("IntersectionObserver" in window)) {
      reveal.forEach(function (n) { n.classList.add("is-in"); });
    } else {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.01, rootMargin: "0px 0px 0px 0px" });
      reveal.forEach(function (n) {
        if (!n.classList.contains("is-in")) io.observe(n);
      });
      window.addEventListener("load", markVisible);
    }
  }

  const pretty = document.querySelector("[data-type-pretty]");
  const cut = document.querySelector("[data-type-cut]");
  const restart = document.querySelector("[data-type-restart]");
  const canvas = document.querySelector("[data-type-canvas]");
  const endv = document.querySelector("[data-type-end]");
  function unhide(el) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute("hidden");
  }
  if (pretty) {
    const full = pretty.getAttribute("data-text") || pretty.textContent.trim();
    if (reduce) {
      pretty.textContent = full;
      unhide(cut); unhide(restart); unhide(canvas); unhide(endv);
    } else {
      [cut, restart, canvas, endv].forEach(function (el) {
        if (el) { el.hidden = true; el.setAttribute("hidden", ""); }
      });
      pretty.textContent = "";
      pretty.classList.add("cursor-blink");
      let i = 0;
      const timer = window.setInterval(function () {
        i += 1;
        pretty.textContent = full.slice(0, i);
        if (i >= full.length) {
          window.clearInterval(timer);
          pretty.classList.remove("cursor-blink");
          window.setTimeout(function () {
            unhide(cut);
            window.setTimeout(function () {
              unhide(restart);
              unhide(canvas);
              window.setTimeout(function () { unhide(endv); }, 900);
            }, 900);
          }, 420);
        }
      }, 26);
    }
  }

  const silence = document.querySelector("[data-silence]");
  document.querySelectorAll(".day.is-empty").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!silence) return;
      silence.textContent = "Las preguntas están ahí, formuladas. Pero no hay respuestas.";
    });
  });

  document.querySelectorAll("[data-waitlist]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const wrap = form.parentElement;
      const ok = wrap.querySelector(".wait-ok, [data-waitlist-ok]");
      const err = wrap.querySelector(".wait-err");
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      }).then(function (res) {
        if (res.ok) {
          form.style.display = "none";
          if (ok) {
            ok.hidden = false;
            ok.removeAttribute("hidden");
            ok.classList.add("is-on");
          }
        } else if (err) {
          err.classList.add("is-on");
        }
      }).catch(function () {
        if (err) err.classList.add("is-on");
      });
    });
  });
})();
