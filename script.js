/* ==========================================================================
   Chhavi Srivastava - Portfolio
   Vanilla JavaScript, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ======================================================================
     0. LOADING SCREEN - runs first and independently of everything below,
        so a problem elsewhere in this file can never leave it stuck on screen.
     ====================================================================== */
  try {
    var loader = document.getElementById("loading-screen");
    if (loader) {
      var loaderHidden = false;
      var hideLoader = function () {
        if (loaderHidden) return;
        loaderHidden = true;
        loader.classList.add("is-hidden");
        window.setTimeout(function () {
          if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        }, 600);
      };
      // Safety net: never block the site if anything below stalls or errors.
      window.setTimeout(hideLoader, 9000);
      // Back/forward-cache restores: make sure it's gone, not re-shown.
      window.addEventListener("pageshow", function (e) {
        if (e.persisted) hideLoader();
      });

      var ringEl = document.getElementById("loader-ring");
      var svgEl = document.getElementById("loader-svg");
      var pctEl = document.getElementById("loader-pct");
      var welcomeEl = document.getElementById("loader-welcome");

      if (!ringEl || !svgEl || !pctEl || !welcomeEl) {
        hideLoader();
      } else {
        var LOADER_REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        var FILL_MS = LOADER_REDUCED ? 0 : 3300;   // 0% -> 100% (about 3.3 seconds)
        var SEGMENTS = 60;
        var SVG_NS = "http://www.w3.org/2000/svg";

        // Build the segmented ring: a dim base set + a lit set that fills clockwise from the top
        var dimGroup = document.createElementNS(SVG_NS, "g");
        var litGroup = document.createElementNS(SVG_NS, "g");
        dimGroup.setAttribute("class", "seg-dim");
        litGroup.setAttribute("class", "seg-lit");
        var litSegs = [];
        for (var i = 0; i < SEGMENTS; i++) {
          var ang = (i / SEGMENTS) * 2 * Math.PI - Math.PI / 2;
          var cos = Math.cos(ang), sin = Math.sin(ang);
          var x1 = (100 + cos * 76).toFixed(2), y1 = (100 + sin * 76).toFixed(2);
          var x2 = (100 + cos * 94).toFixed(2), y2 = (100 + sin * 94).toFixed(2);
          var dim = document.createElementNS(SVG_NS, "line");
          var lit = document.createElementNS(SVG_NS, "line");
          [dim, lit].forEach(function (ln) {
            ln.setAttribute("x1", x1); ln.setAttribute("y1", y1);
            ln.setAttribute("x2", x2); ln.setAttribute("y2", y2);
          });
          dimGroup.appendChild(dim);
          litGroup.appendChild(lit);
          litSegs.push(lit);
        }
        svgEl.appendChild(dimGroup);
        svgEl.appendChild(litGroup);

        var lastPct = 0;
        var setProgress = function (pct) {
          if (pct === lastPct) return;
          lastPct = pct;
          pctEl.textContent = pct + "%";
          var filled = (pct / 100) * SEGMENTS;
          for (var k = 0; k < SEGMENTS; k++) {
            var o = filled - k;
            litSegs[k].style.strokeOpacity = o >= 1 ? "1" : (o > 0 ? o.toFixed(2) : "0");
          }
        };

        var showWelcome = function () {
          ringEl.classList.add("is-done");
          window.setTimeout(function () {
            welcomeEl.classList.add("is-on");
            // hold the message briefly, then fade it out while the hero is revealed
            window.setTimeout(function () {
              welcomeEl.classList.add("is-leaving");
              hideLoader();
            }, LOADER_REDUCED ? 600 : 1400);   // welcome message stays about 1.4s
          }, LOADER_REDUCED ? 0 : 300);
        };

        var finishFill = function () {
          setProgress(100);
          window.setTimeout(showWelcome, LOADER_REDUCED ? 0 : 150);
        };

        if (FILL_MS === 0) {
          finishFill();
        } else {
          var t0 = 0;
          var stepFill = function (now) {
            if (!t0) t0 = now;
            var t = Math.min((now - t0) / FILL_MS, 1);
            var eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;   // gentle ease in/out
            setProgress(Math.round(eased * 100));
            if (t < 1) window.requestAnimationFrame(stepFill); else finishFill();
          };
          window.requestAnimationFrame(stepFill);
        }
      }
    }
  } catch (loaderErr) {
    var fallbackLoader = document.getElementById("loading-screen");
    if (fallbackLoader && fallbackLoader.parentNode) fallbackLoader.parentNode.removeChild(fallbackLoader);
  }

  /* ---------- Settings you may want to edit ---------- */
  var CONTACT_EMAIL = "chhavisrivastava39@gmail.com";
  var THEME_KEY = "theme";
  var MOBILE_BREAKPOINT = 1080; // keep in sync with the hamburger breakpoint in style.css

  var root = document.documentElement;

  /* ---------- Small helpers ---------- */
  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $$(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }

  /* ======================================================================
     1. THEME (dark by default, saved in localStorage)
     ====================================================================== */
  var themeToggle = $("#theme-toggle");
  var themeMeta = $('meta[name="theme-color"]');

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme, save) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f7f6ff" : "#070a1c");
    if (themeToggle) {
      var isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    }
    if (save) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable: ignore */ }
    }
  }

  applyTheme(currentTheme(), false); // sync button state with the theme set in <head>

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      root.classList.add("theme-anim");
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
      window.setTimeout(function () { root.classList.remove("theme-anim"); }, 450);
    });
  }

  /* ======================================================================
     1b. SCROLL PROGRESS BAR
     ====================================================================== */
  var progressFill = $("#scroll-progress-fill");
  var progressTrack = $("#scroll-progress");

  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  if (progressFill) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () { updateProgress(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ======================================================================
     2. MOBILE NAVIGATION
     ====================================================================== */
  var navToggle = $("#nav-toggle");
  var navMenu = $("#nav-menu");

  function setMenu(open) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a link
    $$("a", navMenu).forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    // Close with Escape, or when clicking outside the header
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        navToggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (navToggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".site-header")) {
        setMenu(false);
      }
    });

    // Reset when the window grows to desktop size
    window.addEventListener("resize", function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
    });
  }

  /* ======================================================================
     3. ACTIVE SECTION HIGHLIGHT IN THE NAV
     ====================================================================== */
  var navLinks = $$(".nav-link");
  var sections = $$("main > section[id]");

  function setActive(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", match);
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  } else {
    setActive("home");
  }

  /* ======================================================================
     4. FADE-IN ON SCROLL
     ====================================================================== */
  var revealItems = $$(".reveal");

  function showItem(el) {
    el.classList.add("is-visible");
    // After the entrance finishes, switch to the faster hover transitions
    var delay = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
    window.setTimeout(function () { el.classList.add("is-done"); }, 800 + delay);
  }

  if ("IntersectionObserver" in window) {
    // Small stagger for items that share a parent (cards in a grid)
    revealItems.forEach(function (el) {
      var siblings = $$(".reveal", el.parentElement);
      var index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--d", Math.min(index, 8) * 70 + "ms");
    });

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showItem(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(showItem);
  }

  /* ======================================================================
     5. PLACEHOLDER LINKS (project cards) - do nothing until you add real URLs
     ====================================================================== */
  $$("a[data-placeholder]").forEach(function (link) {
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ======================================================================
     6. CONTACT FORM -> Gmail compose (mailto fallback)
     ====================================================================== */
  var form = $("#contact-form");
  var statusEl = $("#form-status");

  function fieldParts(id) {
    return { input: $("#" + id), error: $("#" + id + "-err") };
  }

  function validateField(id, message) {
    var parts = fieldParts(id);
    var value = parts.input.value.trim();
    var ok = value.length > 0;
    var text = message;

    if (ok && parts.input.type === "email") {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      text = "Please enter a valid email address.";
    }
    parts.input.setAttribute("aria-invalid", ok ? "false" : "true");
    parts.error.textContent = ok ? "" : text;
    return ok;
  }

  function buildMessage(name, email, message) {
    return {
      subject: "Portfolio Contact - " + name,
      body: "Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message
    };
  }

  function gmailUrl(subject, body) {
    return "https://mail.google.com/mail/?view=cm&fs=1" +
      "&to=" + encodeURIComponent(CONTACT_EMAIL) +
      "&su=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function mailtoUrl(subject, body) {
    return "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body.replace(/\n/g, "\r\n"));
  }

  function showStatus(html, ok) {
    statusEl.innerHTML = html;
    statusEl.classList.toggle("is-ok", !!ok);
  }

  if (form && statusEl) {
    // Clear an error as soon as the user fixes the field
    ["cf-name", "cf-email", "cf-message"].forEach(function (id) {
      fieldParts(id).input.addEventListener("input", function () {
        if (this.getAttribute("aria-invalid") === "true") {
          this.setAttribute("aria-invalid", "false");
          fieldParts(id).error.textContent = "";
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var okName = validateField("cf-name", "Please enter your name.");
      var okEmail = validateField("cf-email", "Please enter your email address.");
      var okMessage = validateField("cf-message", "Please write a message.");
      if (!(okName && okEmail && okMessage)) {
        showStatus("", false);
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var name = fieldParts("cf-name").input.value.trim();
      var email = fieldParts("cf-email").input.value.trim();
      var message = fieldParts("cf-message").input.value.trim();
      var mail = buildMessage(name, email, message);

      var gmail = gmailUrl(mail.subject, mail.body);
      var mailto = mailtoUrl(mail.subject, mail.body);

      // Try Gmail in a new tab. If the browser blocks it, fall back to mailto.
      var win = null;
      try { win = window.open(gmail, "_blank"); } catch (err) { win = null; }

      if (win) {
        try { win.opener = null; } catch (err2) { /* ignore */ }
        showStatus('Opening Gmail in a new tab. Nothing opened? <a href="' + mailto + '">Use your default email app</a>.', true);
      } else {
        showStatus("Gmail could not be opened, so your email app is opening instead.", false);
        window.location.href = mailto;
      }
    });
  }

  /* ======================================================================
     8. HERO TERMINAL - small typing animation
     ====================================================================== */
  // Each line: [prompt text, output text]. Output is typed; prompt appears instantly.
  var HERO_LINES = [
    ["$ whoami", "Chhavi Srivastava"],
    ["$ role", "Software Developer"],
    ["$ status", "Learning \u2022 Building \u2022 Growing"]
  ];

  function typeLines(container, lines, opts) {
    if (!container) return;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.textContent = "";

    if (reduceMotion) {
      // Skip the animation and just show the final text, fully accessible.
      lines.forEach(function (line) {
        container.appendChild(document.createTextNode(line[0] + "\n" + line[1] + "\n\n"));
      });
      if (opts && opts.onDone) opts.onDone();
      return;
    }

    var lineIndex = 0, charIndex = 0, phase = "prompt"; // prompt -> output -> pause
    var cursor = document.createElement("span");
    cursor.className = "t-cursor";
    cursor.textContent = "\u00A0";

    function tick() {
      if (lineIndex >= lines.length) {
        if (opts && opts.onDone) opts.onDone();
        return;
      }
      var line = lines[lineIndex];
      var text = phase === "prompt" ? line[0] : line[1];

      if (charIndex <= text.length) {
        var partial = text.slice(0, charIndex);
        var built = container.getAttribute("data-built") || "";
        container.textContent = built + partial;
        container.appendChild(cursor);
        charIndex++;
        window.setTimeout(tick, phase === "prompt" ? 20 : 15);
      } else {
        if (phase === "prompt") {
          container.setAttribute("data-built", (container.getAttribute("data-built") || "") + line[0] + "\n");
          phase = "output"; charIndex = 0;
          window.setTimeout(tick, 90);
        } else {
          container.setAttribute("data-built", (container.getAttribute("data-built") || "") + line[1] + "\n\n");
          phase = "prompt"; charIndex = 0; lineIndex++;
          window.setTimeout(tick, 200);
        }
      }
    }
    tick();
  }

  var heroTerminal = $("#terminal-body");
  if (heroTerminal && "IntersectionObserver" in window) {
    var heroTermStarted = false;
    var heroTermObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !heroTermStarted) {
          heroTermStarted = true;
          typeLines(heroTerminal, HERO_LINES);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    heroTermObserver.observe(heroTerminal);
  } else if (heroTerminal) {
    typeLines(heroTerminal, HERO_LINES);
  }

  /* ======================================================================
     9. NEURAL-NETWORK BACKGROUND
        One fixed <canvas> behind the whole page. Strongest in the hero, much
        quieter further down. Mouse nudges nearby dots; touch devices get a
        gentle ambient drift; reduced-motion gets a single static frame.
     ====================================================================== */
  (function initNeuralBackground() {
    var canvas = document.getElementById("neural-bg");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var coarse = !!(window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches);
    var hero = document.getElementById("home");

    var width = 0, height = 0, dpr = 1;
    var dots = [];
    var links = [];
    var mouse = { x: 0, y: 0, active: false };
    var rafId = 0, drawQueued = false, lightTheme = false;

    var MOUSE_RADIUS = 130;
    var TEAL = [45, 212, 191];
    var BLUE = [56, 160, 240];
    var TEAL_LIGHT = [13, 148, 136];
    var BLUE_LIGHT = [3, 105, 161];

    function targetCount() {
      var n = Math.round((width * height) / 15500);
      return Math.max(16, Math.min(coarse ? 32 : 72, n));
    }

    function makeDot(i) {
      var speed = coarse ? 0.07 : 0.1;
      var angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * width, y: Math.random() * height,
        vx: Math.cos(angle) * speed * (0.4 + Math.random()),
        vy: Math.sin(angle) * speed * (0.4 + Math.random()),
        r: 0.9 + Math.random() * 0.9,
        blue: i % 3 === 0,
        glow: i % 6 === 0
      };
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var want = targetCount();
      while (dots.length < want) dots.push(makeDot(dots.length));
      if (dots.length > want) dots.length = want;
      requestDraw();
    }

    // 1 at the very top of the page, easing to 0 once the hero has scrolled away
    function heroFade() {
      var h = hero ? hero.offsetHeight : height;
      var f = 1 - (window.scrollY || window.pageYOffset || 0) / (h * 0.85);
      return f < 0 ? 0 : (f > 1 ? 1 : f);
    }

    function draw(animate) {
      var fade = heroFade();
      var dotScale = 0.45 + 0.55 * fade;         // dots stay faintly visible everywhere
      var lineScale = 0.22 + 0.78 * fade;       // far fewer / fainter lines outside the hero
      var maxDist = 76 + 36 * fade;             // short links only: nearby dots, no long spans
      var themeMul = lightTheme ? 0.75 : 1;
      var cTeal = lightTheme ? TEAL_LIGHT : TEAL;
      var cBlue = lightTheme ? BLUE_LIGHT : BLUE;
      var i, j, a, b, dx, dy, d, alpha, col;

      ctx.clearRect(0, 0, width, height);

      if (animate) {
        for (i = 0; i < dots.length; i++) {
          a = dots[i];
          if (mouse.active) {
            dx = a.x - mouse.x; dy = a.y - mouse.y;
            d = Math.sqrt(dx * dx + dy * dy);
            if (d < MOUSE_RADIUS && d > 0.1) {
              var push = (1 - d / MOUSE_RADIUS) * 0.018;
              a.vx += (dx / d) * push;
              a.vy += (dy / d) * push;
            }
          }
          a.vx *= 0.99; a.vy *= 0.99;
          // keep a gentle minimum drift so the network never freezes
          var sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
          if (sp < 0.035) { a.vx += (Math.random() - 0.5) * 0.012; a.vy += (Math.random() - 0.5) * 0.012; }
          if (sp > 0.32) { a.vx *= 0.92; a.vy *= 0.92; }
          a.x += a.vx; a.y += a.vy;
          if (a.x < -10) a.x = width + 10; else if (a.x > width + 10) a.x = -10;
          if (a.y < -10) a.y = height + 10; else if (a.y > height + 10) a.y = -10;
        }
      }

      // connections: short links only, and each dot links to at most 2 neighbours (avoids big triangle meshes)
      ctx.lineWidth = 0.9;
      links.length = dots.length;
      for (i = 0; i < dots.length; i++) links[i] = 0;
      for (i = 0; i < dots.length; i++) {
        a = dots[i];
        col = a.blue ? cBlue : cTeal;
        for (j = i + 1; j < dots.length; j++) {
          if (links[i] >= 2) break;
          if (links[j] >= 2) continue;
          b = dots[j];
          dx = a.x - b.x; dy = a.y - b.y;
          if (dx > maxDist || dx < -maxDist || dy > maxDist || dy < -maxDist) continue;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d >= maxDist) continue;
          alpha = (1 - d / maxDist) * 0.2 * lineScale * themeMul;
          if (alpha < 0.006) continue;
          links[i]++; links[j]++;
          ctx.strokeStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + alpha.toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        // soft links from the pointer to nearby dots
        if (mouse.active) {
          dx = a.x - mouse.x; dy = a.y - mouse.y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_RADIUS) {
            alpha = (1 - d / MOUSE_RADIUS) * 0.11 * (0.3 + 0.7 * lineScale) * themeMul;
            ctx.strokeStyle = "rgba(" + cTeal[0] + "," + cTeal[1] + "," + cTeal[2] + "," + alpha.toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }

      // dots (a few get a faint halo)
      for (i = 0; i < dots.length; i++) {
        a = dots[i];
        col = a.blue ? cBlue : cTeal;
        if (a.glow) {
          ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.04 * dotScale * themeMul).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(a.x, a.y, a.r + 5, 0, 6.2832); ctx.fill();
        }
        ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.36 * dotScale * themeMul).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }
    }

    function loop() {
      draw(true);
      rafId = window.requestAnimationFrame(loop);
    }

    // Static redraw (used for reduced motion, and after resize / theme / scroll when paused)
    function requestDraw() {
      if (!reduceMotion || drawQueued) return;
      drawQueued = true;
      window.requestAnimationFrame(function () { drawQueued = false; draw(false); });
    }

    function readTheme() {
      lightTheme = document.documentElement.getAttribute("data-theme") === "light";
      requestDraw();
    }

    readTheme();
    if ("MutationObserver" in window) {
      new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }

    resize();
    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    });

    if (reduceMotion) {
      window.addEventListener("scroll", requestDraw, { passive: true });
      return; // one calm, static network - no animation loop, no pointer tracking
    }

    if (!coarse) {
      window.addEventListener("pointermove", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      }, { passive: true });
      document.addEventListener("mouseleave", function () { mouse.active = false; });
      window.addEventListener("blur", function () { mouse.active = false; });
    }

    // Don't burn battery in a background tab
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId); rafId = 0;
      } else if (!rafId) {
        rafId = window.requestAnimationFrame(loop);
      }
    });

    rafId = window.requestAnimationFrame(loop);
  })();

  /* ======================================================================
     7. FOOTER YEAR
     ====================================================================== */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
