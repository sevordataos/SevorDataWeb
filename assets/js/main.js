/* SEVOR Data — shared UI: i18n, language selector, floating header with scroll-spy,
   light/dark theme, mobile menu, reveal-on-scroll, pre-recording checklist and
   config-driven links (social profiles, Slack invite, Minute organization code). */
(function () {
  "use strict";
  var CFG = window.SEVOR_CONFIG || {};
  var I18N = window.SEVOR_I18N || {};
  var LANGS = CFG.LANGS || ["es", "en", "pt", "it", "fr", "de"];
  var STORE_KEY = "sevor_lang";
  var CONSENT_KEY = "sevor_cookies";
  var THEME_KEY = "sevor_theme";
  var ROOT = (document.body && document.body.getAttribute("data-root")) || "";
  /* Consentimiento de almacenamiento. Lo esencial (elección de cookies)
     siempre funciona; "functional" = recordar el idioma elegido. */
  function consentGet() { try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch (e) { return null; } }
  function consentAllows(cat) { var c = consentGet(); if (cat === "essential") return true; return !!(c && c[cat]); }
  window.SEVOR_CONSENT = { get: consentGet, allows: consentAllows };

  /* Small inline SVG flags (20×14). Emoji flags render inconsistently across OSes. */
  var FLAGS = {
    es: '<rect width="20" height="14" fill="#74acdf"/><rect y="4.67" width="20" height="4.66" fill="#fff"/><circle cx="10" cy="7" r="1.5" fill="#f6b40e"/>',
    en: '<rect width="20" height="14" fill="#fff"/><g fill="#b22234"><rect width="20" height="1.08"/><rect y="2.15" width="20" height="1.08"/><rect y="4.31" width="20" height="1.08"/><rect y="6.46" width="20" height="1.08"/><rect y="8.62" width="20" height="1.08"/><rect y="10.77" width="20" height="1.08"/><rect y="12.92" width="20" height="1.08"/></g><rect width="8.4" height="7.54" fill="#3c3b6e"/><g fill="#fff"><circle cx="1.6" cy="1.5" r=".42"/><circle cx="3.6" cy="1.5" r=".42"/><circle cx="5.6" cy="1.5" r=".42"/><circle cx="7.4" cy="1.5" r=".42"/><circle cx="2.6" cy="3.0" r=".42"/><circle cx="4.6" cy="3.0" r=".42"/><circle cx="6.6" cy="3.0" r=".42"/><circle cx="1.6" cy="4.5" r=".42"/><circle cx="3.6" cy="4.5" r=".42"/><circle cx="5.6" cy="4.5" r=".42"/><circle cx="7.4" cy="4.5" r=".42"/><circle cx="2.6" cy="6.0" r=".42"/><circle cx="4.6" cy="6.0" r=".42"/><circle cx="6.6" cy="6.0" r=".42"/></g>',
    pt: '<rect width="20" height="14" fill="#009b3a"/><path d="M10 1.6 18 7l-8 5.4L2 7z" fill="#fedf00"/><circle cx="10" cy="7" r="3" fill="#002776"/><path d="M7.1 6.4c2-.5 4-.3 5.8.6" stroke="#fff" stroke-width=".55" fill="none"/>',
    it: '<rect width="6.67" height="14" fill="#009246"/><rect x="6.67" width="6.66" height="14" fill="#fff"/><rect x="13.33" width="6.67" height="14" fill="#ce2b37"/>',
    fr: '<rect width="6.67" height="14" fill="#002654"/><rect x="6.67" width="6.66" height="14" fill="#fff"/><rect x="13.33" width="6.67" height="14" fill="#ce1126"/>',
    de: '<rect width="20" height="4.67" fill="#000"/><rect y="4.67" width="20" height="4.66" fill="#dd0000"/><rect y="9.33" width="20" height="4.67" fill="#ffce00"/>'
  };
  function flag(l) { return '<svg viewBox="0 0 20 14" aria-hidden="true" focusable="false">' + (FLAGS[l] || "") + "</svg>"; }
  var CHECK = '<svg class="check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3.5 8.4 2.9 2.9 6-6.3"/></svg>';

  function storedLang() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function pickLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && I18N[q]) return q;
    var s = storedLang();
    if (s && I18N[s]) return s;
    var pageLang = document.documentElement.getAttribute("data-default-lang");
    if (pageLang && I18N[pageLang]) return pageLang;
    return CFG.DEFAULT_LANG || "es";
  }
  var current = pickLang();

  /* Spanish fallback for the strings this script writes itself, used on the
     Spanish-only pages (guides, legal) that do not load i18n.js. */
  var FALLBACK = {
    "theme.light": "Cambiar a tema claro", "theme.dark": "Cambiar a tema oscuro",
    "social.on": "SEVOR Data en {name}", "new.tab": "(se abre en una pestaña nueva)",
    "org.copied": "Código copiado", "chk.count": "{n} de {t} listos", "chk.all": "Todo listo. Puedes grabar."
  };
  function t(key, lang) {
    var d = I18N[lang || current] || {};
    if (d[key] != null) return d[key];
    var es = I18N.es || {};
    if (es[key] != null) return es[key];
    return FALLBACK[key] != null ? FALLBACK[key] : key;
  }
  /* Plain text without the [[accent]] markers. */
  function tp(key, lang) { return String(t(key, lang)).replace(/\[\[|\]\]/g, ""); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  /* Escaped HTML where [[words]] become <em> (serif accent). */
  function rich(key) { return esc(t(key)).replace(/\[\[(.+?)\]\]/g, "<em>$1</em>"); }

  function apply(lang) {
    if (!I18N[lang]) lang = "es";
    current = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = tp(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-em]").forEach(function (el) { el.innerHTML = rich(el.getAttribute("data-i18n-em")); });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      // format: "placeholder:key;aria-label:key"
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), tp(p[1].trim()));
      });
    });
    var page = document.body.getAttribute("data-page");
    var titleKey = { index: "meta.index.title", registro: "meta.reg.title", gracias: "meta.thanks.title", empresas: "meta.biz.title" }[page];
    if (titleKey) document.title = tp(titleKey);
    var descKey = { index: "meta.index.desc", registro: "meta.reg.desc", empresas: "meta.biz.desc" }[page];
    if (descKey) {
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", tp(descKey));
    }
    var btn = document.querySelector(".lang-btn");
    if (btn) {
      btn.querySelector(".flag").innerHTML = flag(lang);
      btn.querySelector(".lang-code").textContent = lang.toUpperCase();
    }
    document.querySelectorAll(".lang-menu [data-lang]").forEach(function (b) {
      b.setAttribute("aria-checked", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    if (typeof themeLabel === "function") themeLabel();
    labelSocial();
    document.dispatchEvent(new CustomEvent("sevor:lang", { detail: { lang: lang } }));
  }

  function setLang(lang) {
    try { if (consentAllows("functional")) localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
    apply(lang);
  }

  function buildSwitcher() {
    var wrap = document.querySelector(".lang");
    if (!wrap) return;
    var btn = wrap.querySelector(".lang-btn");
    var menu = wrap.querySelector(".lang-menu");
    menu.innerHTML = "";
    LANGS.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("data-lang", l);
      b.setAttribute("lang", l);
      b.tabIndex = -1;
      b.innerHTML = '<span class="flag">' + flag(l) + '</span><span class="lang-name">' +
        esc((I18N[l] || {})["lang.name"] || l) + '</span><span class="lang-code">' + l.toUpperCase() + "</span>" + CHECK;
      b.addEventListener("click", function () { setLang(l); close(true); });
      menu.appendChild(b);
    });
    var items = function () { return Array.prototype.slice.call(menu.querySelectorAll("button")); };
    function open(focusFirst) {
      wrap.classList.add("open"); btn.setAttribute("aria-expanded", "true");
      var list = items(), sel = menu.querySelector('[aria-checked="true"]') || list[0];
      if (focusFirst !== false) setTimeout(function () { sel.focus(); }, 20);
    }
    function close(refocus) {
      if (!wrap.classList.contains("open")) return;
      wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
      if (refocus) btn.focus();
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      wrap.classList.contains("open") ? close(false) : open(e.detail === 0);
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(true); }
    });
    menu.addEventListener("keydown", function (e) {
      var list = items(), i = list.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
      else if (e.key === "Tab") { close(false); }
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(true); });
  }

  function mobileMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.getElementById("mobile-menu");
    if (!toggle || !panel) return;
    function set(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      document.documentElement.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", function () { set(toggle.getAttribute("aria-expanded") !== "true"); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { set(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1181px)").addEventListener("change", function (m) { if (m.matches) set(false); });
  }

  function reveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  function header() {
    var h = document.querySelector("[data-header]");
    if (!h) return;
    var ticking = false;
    var links = Array.prototype.slice.call(h.querySelectorAll('.sx-nav a[href^="#"], .sx-sheet a[href^="#"]'));
    var ids = [];
    links.forEach(function (a) { var id = a.getAttribute("href").slice(1); if (id && ids.indexOf(id) < 0 && document.getElementById(id)) ids.push(id); });
    var sections = ids.map(function (id) { return document.getElementById(id); });
    var active = null;
    function spy() {
      if (!sections.length) return;
      var line = window.innerHeight * 0.35, cur = null;
      sections.forEach(function (sec) { if (sec.getBoundingClientRect().top <= line) cur = sec.id; });
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 4) {
        var last = sections[sections.length - 1];
        if (last.getBoundingClientRect().top < window.innerHeight) cur = last.id;
      }
      if (cur === active) return;
      active = cur;
      links.forEach(function (a) {
        if (a.getAttribute("href") === "#" + cur) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    var update = function () { h.classList.toggle("is-condensed", window.scrollY > 16); spy(); ticking = false; };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* Light / dark theme. Dark is the default; the choice is remembered only with
     the "Preferencias" consent (same rule as the language). */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function themeLabel() {
    var light = currentTheme() === "light";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", tp(light ? "theme.dark" : "theme.light"));
      b.title = tp(light ? "theme.dark" : "theme.light");
    });
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute("content", light ? "#f4f5f7" : "#0a0d14");
  }
  function theme() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = currentTheme() === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        try { if (consentAllows("functional")) localStorage.setItem(THEME_KEY, next); } catch (e) {}
        themeLabel();
      });
    });
    themeLabel();
  }

  /* Pre-recording checklist (index): counts ticked items, stores nothing. */
  function checklist() {
    var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-chk]"));
    var out = document.querySelector("[data-chk-count]");
    if (!boxes.length || !out) return;
    function render() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      out.textContent = n === boxes.length ? tp("chk.all") : tp("chk.count").replace("{n}", n).replace("{t}", boxes.length);
      out.classList.toggle("is-done", n === boxes.length);
    }
    boxes.forEach(function (b) { b.addEventListener("change", render); });
    document.addEventListener("sevor:lang", render);
    render();
  }

  /* Each page opens at the top on reload, without breaking #anchors. */
  function scrollTop() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);
  }

  function mailLinks() {
    var email = CFG.EMAIL || "contacto.sevor@gmail.com";
    document.querySelectorAll("[data-email-text]").forEach(function (el) { el.textContent = email; });
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }


  function cookieBar() {
    if (consentGet()) return;
    var bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Aviso de cookies");
    bar.setAttribute("lang", "es");
    bar.innerHTML =
      '<p>Usamos solo almacenamiento <strong>esencial</strong> en tu navegador (por ejemplo, tu elección en este aviso) y, si lo aceptas, guardamos tus preferencias de idioma y de tema (claro u oscuro). No usamos cookies publicitarias ni de análisis. <a class="link" href="' + ROOT + 'legal/cookies.html">Política de Cookies</a>.</p>' +
      '<div class="cookie-prefs" hidden>' +
      '<label class="check"><input type="checkbox" checked disabled><span><strong>Esenciales</strong> (siempre activas): funcionamiento del sitio y del registro.</span></label>' +
      '<label class="check"><input type="checkbox" data-c="functional"><span><strong>Preferencias</strong>: recordar el idioma y el tema elegidos.</span></label>' +
      "</div>" +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-primary btn-sm" data-act="accept">Aceptar</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" data-act="reject">Rechazar no esenciales</button>' +
      '<button type="button" class="btn btn-quiet btn-sm" data-act="config">Configurar</button>' +
      "</div>";
    function save(functional) {
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: 1, essential: true, functional: !!functional, ts: new Date().toISOString() })); } catch (e) {}
      if (!functional) { try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(THEME_KEY); localStorage.removeItem("sevor_mira_mute"); } catch (e) {} }
      bar.remove();
    }
    bar.addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      var act = b.getAttribute("data-act");
      if (act === "accept") save(true);
      else if (act === "reject") save(false);
      else if (act === "config") {
        var p = bar.querySelector(".cookie-prefs");
        if (p.hidden) { p.hidden = false; b.textContent = "Guardar selección"; b.setAttribute("data-act", "save"); }
      } else if (act === "save") save(bar.querySelector('[data-c="functional"]').checked);
    });
    document.body.appendChild(bar);
  }


  /* ---------- config-driven links (assets/js/config.js) ---------- */
  /* Social icons: Simple Icons (CC0 1.0), see TERCEROS.md. */
  var ICONS = {
    x: "<path d=\"M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z\"/>",
    instagram: "<path d=\"M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077\"/>",
    tiktok: "<path d=\"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z\"/>",
    linkedin: "<path d=\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\"/>",
    youtube: "<path d=\"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z\"/>",
    facebook: "<path d=\"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z\"/>",
    threads: "<path d=\"M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z\"/>",
    whatsapp: "<path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z\"/>",
    telegram: "<path d=\"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z\"/>"
  };
  var SOCIAL_ORDER = ["instagram", "tiktok", "youtube", "x", "linkedin", "facebook", "threads", "whatsapp", "telegram"];
  var SOCIAL_NAMES = { x: "X", instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn", youtube: "YouTube", facebook: "Facebook", threads: "Threads", whatsapp: "WhatsApp", telegram: "Telegram" };
  function safeUrl(u) { u = String(u || "").trim(); return /^https:\/\//i.test(u) ? u : ""; }
  function socialLinks() {
    var s = CFG.social || {};
    var keys = SOCIAL_ORDER.filter(function (k) { return safeUrl(s[k]); });
    document.querySelectorAll("[data-social-wrap]").forEach(function (w) { w.hidden = !keys.length; });
    document.querySelectorAll("[data-social]").forEach(function (box) {
      box.innerHTML = "";
      if (!keys.length) { box.hidden = true; return; }
      keys.forEach(function (k) {
        var a = document.createElement("a");
        a.className = "social-link social-link--" + k; a.href = safeUrl(s[k]); a.target = "_blank"; a.rel = "noopener me";
        a.setAttribute("data-social-name", SOCIAL_NAMES[k]);
        a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">' + ICONS[k] + "</svg>";
        box.appendChild(a);
      });
      box.hidden = false;
      labelSocial();
    });
  }
  function labelSocial() {
    document.querySelectorAll("[data-social-name]").forEach(function (a) {
      var label = tp("social.on").replace("{name}", a.getAttribute("data-social-name"));
      a.setAttribute("aria-label", label + " " + tp("new.tab"));
      a.title = label;
    });
  }
  function cfgLinks() {
    var apps = CFG.apps || {};
    var map = { slack_invite: CFG.slack_invite_url };
    Object.keys(apps).forEach(function (k) { map[k] = apps[k]; });
    document.querySelectorAll("[data-cfg-href]").forEach(function (a) {
      var u = safeUrl(map[a.getAttribute("data-cfg-href")]);
      if (u) { a.href = u; a.hidden = false; } else { a.hidden = true; }
    });
    document.querySelectorAll("[data-cfg-if]").forEach(function (el) {
      el.hidden = !safeUrl(map[el.getAttribute("data-cfg-if")]);
    });
    document.querySelectorAll("[data-cfg-ifnot]").forEach(function (el) {
      el.hidden = !!safeUrl(map[el.getAttribute("data-cfg-ifnot")]);
    });
  }
  function orgCode() {
    var code = String(CFG.minute_org_code || "69JH31DQ").trim();
    document.querySelectorAll("[data-org-code]").forEach(function (box) {
      var has = box.querySelector("[data-org-has]"), none = box.querySelector("[data-org-none]");
      if (!code) { has.hidden = true; none.hidden = false; return; }
      has.hidden = false; none.hidden = true;
      box.querySelector("[data-org-value]").textContent = code;
      var btn = box.querySelector("[data-org-copy]"), st = box.querySelector("[data-org-status]");
      btn.addEventListener("click", function () {
        function done() { st.textContent = tp("org.copied"); setTimeout(function () { st.textContent = ""; }, 2500); }
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(done, fallback);
        else fallback();
        function fallback() {
          var t = document.createElement("textarea"); t.value = code; t.setAttribute("readonly", "");
          t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select();
          try { document.execCommand("copy"); done(); } catch (e) { st.textContent = code; }
          t.remove();
        }
      });
    });
  }

  window.SEVOR = { t: tp, rich: rich, setLang: setLang, lang: function () { return current; } };

  document.addEventListener("DOMContentLoaded", function () {
    ROOT = document.body.getAttribute("data-root") || "";
    scrollTop();
    buildSwitcher();
    socialLinks(); cfgLinks(); orgCode();
    apply(current);
    theme();
    checklist();
    reveal();
    header();
    mobileMenu();
    mailLinks();
    cookieBar();
  });
})();
