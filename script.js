/* ==========================================================================
   Chhavi Srivastava - Portfolio
   Vanilla JavaScript, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

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
     7. FOOTER YEAR
     ====================================================================== */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
