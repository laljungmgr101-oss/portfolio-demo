/* =========================================================
   Lal Jung Magar — portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------- theme ---------------- */
  const themeBtn = $("#themeToggle");
  const metaTheme = $('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ }
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(theme === "light"));
      themeBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    }
    if (metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#07070d" : "#f7f5ff");
  };

  let stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* noop */ }
  applyTheme(stored || "dark");

  themeBtn?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  /* ---------------- mobile nav ---------------- */
  const nav = $("#nav");
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");

  const setMenu = (open) => {
    if (!nav || !menuBtn) return;
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  menuBtn?.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  navLinks?.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (!nav?.classList.contains("is-open")) return;
    if (!e.target.closest("#nav")) setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setMenu(false);
  });

  /* ---------------- scroll: nav, progress, to-top, active link ---------------- */
  const progressBar = $("#progressBar");
  const toTop = $("#toTop");
  const sections = $$("main section[id]");
  const navAnchors = $$('#navLinks a[href^="#"]');

  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;

    nav?.classList.toggle("is-scrolled", y > 20);
    toTop?.classList.toggle("show", y > 600);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = `${max > 0 ? Math.min((y / max) * 100, 100) : 0}%`;
    }

    let current = sections[0]?.id;
    for (const section of sections) {
      if (y >= section.offsetTop - 150) current = section.id;
    }
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = $$(".reveal");
  revealEls.forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty("--d", `${delay}ms`);
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------------- stats counter ---------------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statNumbers = $$(".stat-num");
  if (reduceMotion) {
    statNumbers.forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || "");
    });
  } else if ("IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    statNumbers.forEach((el) => statObserver.observe(el));
  } else {
    statNumbers.forEach(animateCount);
  }

  /* ---------------- skill bars ---------------- */
  const bars = $$(".bar-fill");
  const fillBar = (bar) => { bar.style.width = `${bar.dataset.level || 0}%`; };

  if ("IntersectionObserver" in window && !reduceMotion) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        fillBar(entry.target);
        barObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    bars.forEach((bar) => barObserver.observe(bar));
  } else {
    bars.forEach(fillBar);
  }

  /* ---------------- typewriter ---------------- */
  const typeEl = $("#typewriter");
  const roles = ["BCA student", "front-end developer", "React enthusiast", "problem solver", "coffee-powered dev"];

  if (typeEl) {
    if (reduceMotion) {
      typeEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = roles[0].length;
      let deleting = false;

      const type = () => {
        const word = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        typeEl.textContent = word.slice(0, Math.max(charIndex, 0));

        let wait = deleting ? 38 : 78;
        if (!deleting && charIndex === word.length) { deleting = true; wait = 1700; }
        else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          wait = 340;
        }
        setTimeout(type, wait);
      };
      setTimeout(type, 1800);
    }
  }

  /* ---------------- cursor glow + tilt ---------------- */
  const glow = $("#cursorGlow");
  if (glow && finePointer && !reduceMotion) {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let tx = gx;
    let ty = gy;

    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add("on");
    }, { passive: true });

    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  const tiltEl = $("#codeCard");
  if (tiltEl && finePointer && !reduceMotion) {
    const max = 7;
    tiltEl.addEventListener("pointermove", (e) => {
      const rect = tiltEl.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltEl.style.transform =
        `rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateZ(6px)`;
    });
    tiltEl.addEventListener("pointerleave", () => {
      tiltEl.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  /* ---------------- toast ---------------- */
  const toast = $("#toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3800);
  };

  /* ---------------- placeholder links ---------------- */
  $$("[data-placeholder]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Demo link — swap the href in index.html for your real project URL.");
    });
  });

  /* ---------------- copy email ---------------- */
  const copyBtn = $("#copyEmail");
  const EMAIL = "hello@laljung.dev";

  copyBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast("Email copied — talk soon! ✦");
    } catch (err) {
      showToast(`Copy failed. My email is ${EMAIL}`);
    }
  });

  /* ---------------- contact form ---------------- */
  const form = $("#contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    showToast("Opening your mail app… if nothing happens, email me directly.");
  });

  /* ---------------- footer year ---------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
