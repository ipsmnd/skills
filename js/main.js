/* =========================================================
   MND CODE — main.js
   Vanilla JS, no dependencies.
   1. Config   2. Header & mobile nav   3. Active nav link
   4. Scroll reveal   5. Subject filter   6. FAQ accordion
   7. Enquiry form
   ========================================================= */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* 1. Config ----------------------------------------------
     Set FORM_ENDPOINT to a real, verified form service URL before launch
     (e.g. a Formspree / Getform / Basin endpoint, or your own API).
     While it is empty, the form validates input but tells the visitor
     honestly that online enquiries are not yet connected. */
  var CONFIG = {
    FORM_ENDPOINT: "",
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 2. Header & mobile nav --------------------------------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1081px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* 3. Active nav link ------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
  if ("IntersectionObserver" in window && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
        var link = linkFor[entry.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(linkFor).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* 4. Scroll reveal --------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealer.observe(el); });
  }

  /* 5. Subject filter -------------------------------------- */
  var search = document.getElementById("subject-search");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var subjects = Array.prototype.slice.call(document.querySelectorAll(".subject"));
  var countEl = document.getElementById("subject-count");
  var emptyEl = document.getElementById("subject-empty");
  var activeCat = "All";

  function applyFilter() {
    var q = (search && search.value || "").trim().toLowerCase();
    var shown = 0;
    subjects.forEach(function (s) {
      var matchCat = activeCat === "All" || s.dataset.category === activeCat;
      var matchText = !q || s.textContent.toLowerCase().indexOf(q) !== -1;
      var visible = matchCat && matchText;
      s.hidden = !visible;
      if (visible) shown++;
    });
    if (countEl) countEl.textContent = "Showing " + shown + " of " + subjects.length + " subjects";
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeCat = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      applyFilter();
    });
  });
  if (search) search.addEventListener("input", applyFilter);
  applyFilter();

  /* 6. FAQ accordion --------------------------------------- */
  document.querySelectorAll(".faq-trigger").forEach(function (btn) {
    var item = btn.closest(".faq-item");
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      item.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", String(!open));
    });
  });

  /* 7. Enquiry form ---------------------------------------- */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  // Program "Enquire" links pre-select the matching interest in the form.
  document.querySelectorAll("[data-interest]").forEach(function (link) {
    link.addEventListener("click", function () {
      var sel = form.elements.interest;
      if (sel) { sel.value = link.dataset.interest; validateField(sel); }
    });
  });
  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your full name."; },
    email: function (v) {
      if (!v.trim()) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address, like name@example.com.";
    },
    phone: function (v) {
      if (!v.trim()) return "";
      return /^[+\d][\d\s()-]{6,18}$/.test(v.trim()) ? "" : "Please enter a valid phone number, or leave this blank.";
    },
    role: function (v) { return v ? "" : "Please tell us which best describes you."; },
    interest: function (v) { return v ? "" : "Please choose what you are interested in."; },
    message: function (v) { return v.trim().length >= 10 ? "" : "Please add a short message (at least 10 characters)."; },
    consent: function (_, el) { return el.checked ? "" : "Please confirm you agree to be contacted about your enquiry."; },
  };

  function validateField(el) {
    var rule = rules[el.name];
    if (!rule) return "";
    var msg = rule(el.value, el);
    var errEl = document.getElementById(el.name + "-error");
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (errEl) errEl.textContent = msg;
    return msg;
  }

  form.addEventListener("blur", function (e) {
    if (e.target.name && rules[e.target.name] && e.target.dataset.touched) validateField(e.target);
  }, true);
  form.addEventListener("input", function (e) {
    var el = e.target;
    el.dataset.touched = "1";
    if (el.getAttribute("aria-invalid") === "true") validateField(el);
  });
  form.addEventListener("change", function (e) {
    e.target.dataset.touched = "1";
    if (e.target.type === "checkbox" || e.target.tagName === "SELECT") validateField(e.target);
  });

  function showStatus(type, html) {
    status.className = "form-status is-visible form-status--" + type;
    status.innerHTML = html;
    status.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (el && validateField(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      showStatus("error", "Please check the highlighted fields and try again.");
      firstInvalid.focus();
      return;
    }

    // Honeypot: real visitors never fill this hidden field.
    if (form.elements.website && form.elements.website.value) return;

    if (!CONFIG.FORM_ENDPOINT) {
      showStatus("info",
        "<strong>Your details look good, but this enquiry has not been sent.</strong> " +
        "Online enquiries are not connected yet. Nothing has been submitted or stored.");
      return;
    }

    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.querySelector(".btn-label").textContent = "Sending…";

    fetch(CONFIG.FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
        showStatus("success", "<strong>Thank you — your enquiry has been sent.</strong> We will reply using the contact details you provided.");
      })
      .catch(function () {
        showStatus("error", "<strong>Sorry, your enquiry could not be sent.</strong> Please check your connection and try again in a moment.");
      })
      .finally(function () {
        submitBtn.removeAttribute("aria-busy");
        submitBtn.querySelector(".btn-label").textContent = "Send Enquiry";
      });
  });
})();
