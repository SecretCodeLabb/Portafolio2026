/* =========================================================
   PÁGINA DE PROYECTO TECH — tech.html?p=<id>
   ========================================================= */
(() => {
  "use strict";

  const D = window.PORTFOLIO, T = D.tech;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, "0");
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const typeLabel = (id) => (T.types.find((t) => t.id === id) || {}).label || id;

  /* ---------- Proyecto según la URL ---------- */
  const id = new URLSearchParams(location.search).get("p");
  const i = T.projects.findIndex((p) => p.id === id);
  if (i < 0) { location.replace("index.html#tech"); return; }
  const p = T.projects[i];
  const next = T.projects[(i + 1) % T.projects.length];

  /* ---------- Textos del perfil ---------- */
  const binds = { name: D.profile.name, location: D.profile.location };
  $$("[data-bind]").forEach((el) => (el.textContent = binds[el.dataset.bind] || ""));
  $("#year").textContent = new Date().getFullYear();
  document.title = `${p.title} — Tech Lab · ${D.profile.name}`;

  /* ---------- Render ---------- */
  // Portada: la captura cubre el snippet; si aún no existe, se quita y queda el código
  const cover = () => `<pre class="tcard__code"><code>${esc(p.snippet || "")}</code></pre>
    ${p.cover ? `<img src="${esc(p.cover.src)}" alt="${esc(p.title)}" data-fallback>` : ""}`;
  // Sitio publicado en vivo: se renderiza a ancho real (data-w) y se escala al contenedor
  const live = (url, interactive) => `<div class="tp-live${interactive ? "" : " tp-live--thumb"}" data-w="1440">
    <iframe src="${esc(url)}" title="${esc(p.title)} — vista en vivo" loading="lazy" sandbox="allow-scripts allow-popups" referrerpolicy="no-referrer"${interactive ? "" : ' tabindex="-1" scrolling="no"'}></iframe></div>`;
  const shortUrl = (u) => u.replace(/^https?:\/\//, "").replace(/index\.html$/, "");

  $("#techProject").innerHTML = `
    <section class="tp-hero">
      <div class="tp-hero__copy">
        <p class="section__index mono reveal">Tech Lab · ${pad(i + 1)} / ${pad(T.projects.length)} — ${esc(typeLabel(p.type))}</p>
        <h1 class="tp-title chrome">${esc(p.title)}</h1>
        <div class="tp-hero__tags reveal">
          <span class="tcard__status mono" data-status="${esc(p.status)}"><i></i>${esc(p.status)}</span>
          ${p.stack.map((s) => `<span class="tp-chip mono">${esc(s)}</span>`).join("")}
        </div>
        ${p.links && p.links.length ? `
          <div class="hero__actions reveal">${p.links.map((l) => `
            <a href="${esc(l.url)}" target="_blank" rel="noopener" class="btn ${l.primary ? "btn--chrome" : "btn--ghost"} magnetic" data-cursor="Ir">
              ${l.primary ? "↓ " : ""}${esc(l.label)}${l.primary ? "" : " ↗"}</a>`).join("")}
          </div>` : ""}
      </div>
      <div class="viewport tp-cover reveal">
        <div class="viewport__bar mono"><span>~/lab/${esc(p.id)}</span><span>${esc(typeLabel(p.type))}</span></div>
        <div class="tp-frame">${p.preview ? live(p.preview, false) : cover()}</div>
      </div>
    </section>

    <section class="tp-section">
      <h2 class="skills__title mono">// Tecnologías usadas</h2>
      <ul class="skills__tags reveal">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    </section>

    ${p.preview ? `
      <section class="tp-section">
        <h2 class="skills__title mono">// Vista en vivo</h2>
        <div class="browser reveal">
          <div class="browser__bar mono">
            <span class="terminal__dots"><i></i><i></i><i></i></span>
            <span class="browser__url">${esc(shortUrl(p.preview))}</span>
            <div class="viewtoggle" role="group" aria-label="Dispositivo">
              <button class="is-active" data-device="1440" aria-pressed="true">Escritorio</button>
              <button data-device="390" aria-pressed="false">Móvil</button>
            </div>
            <a class="browser__open" href="${esc(p.preview)}" target="_blank" rel="noopener" data-cursor="Ir">Abrir ↗</a>
          </div>
          ${live(p.preview, true)}
        </div>
      </section>` : ""}

    ${!p.preview && p.gallery && p.gallery.length ? `
      <section class="tp-section tp-section--gallery" hidden>
        <h2 class="skills__title mono">// Galería</h2>
        <div class="p-gallery">
          ${p.gallery.map((g, k) => `
            <figure class="p-shot tp-frame reveal${g.wide ? " is-wide" : ""}" data-k="${k}" data-cursor="Zoom" hidden>
              <img src="${esc(g.src)}" alt="${esc(g.caption)}">
              <figcaption class="mono"><b>${pad(k + 1)}</b>${esc(g.caption)}</figcaption>
            </figure>`).join("")}
        </div>
      </section>` : ""}

    ${next !== p ? `
      <a class="p-next" href="tech.html?p=${encodeURIComponent(next.id)}" data-cursor="Siguiente">
        ${next.cover ? `<img src="${esc(next.cover.src)}" alt="" loading="lazy" data-fallback>` : ""}
        <span class="mono">Siguiente proyecto →</span>
        <span class="p-next__title chrome">${esc(next.title)}</span>
      </a>` : ""}`;

  // Portadas opcionales: si la captura no existe se quita (y queda el snippet de código)
  $$("img[data-fallback]").forEach((img) => {
    if (img.complete && !img.naturalWidth) img.remove();
    else img.addEventListener("error", () => img.remove());
  });

  // La galería solo muestra las capturas que existen; sin ninguna, la sección no aparece
  $$(".p-shot").forEach((f) => {
    const img = $("img", f);
    const show = () => { f.hidden = false; f.closest("section").hidden = false; };
    if (img.complete && img.naturalWidth) show(); else img.addEventListener("load", show);
  });

  /* ---------- Vista en vivo: escala el iframe al contenedor ---------- */
  function fit(box) {
    const f = $("iframe", box), w = +box.dataset.w;
    const s = Math.min(1, box.clientWidth / w);
    f.style.width = w + "px";
    f.style.height = box.clientHeight / s + "px";
    f.style.transform = `scale(${s})`;
    f.style.left = Math.max(0, (box.clientWidth - w * s) / 2) + "px";
  }
  const liveObs = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
  $$(".tp-live").forEach((b) => liveObs.observe(b));
  $$("[data-device]").forEach((b) => b.addEventListener("click", () => {
    const box = $(".tp-live", b.closest(".browser"));
    $$("[data-device]", b.parentElement).forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", x === b); });
    box.dataset.w = b.dataset.device;
    box.classList.toggle("is-mobile", b.dataset.device !== "1440");
    fit(box);
  }));

  /* ---------- Nav + progreso ---------- */
  const nav = $("#nav");
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > 300);
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Cursor ---------- */
  const cursor = $("#cursor"), cursorLabel = $("#cursorLabel");
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 }, cur = { ...mouse };
  if (finePointer) {
    document.body.classList.add("has-cursor");
    addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      cursor.classList.toggle("is-active", !!t);
      cursorLabel.textContent = t ? t.dataset.cursor : "";
    });
    (function loop() {
      cur.x = lerp(cur.x, mouse.x, 0.2); cur.y = lerp(cur.y, mouse.y, 0.2);
      cursor.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Botones magnéticos ---------- */
  if (finePointer && !reduced) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObs.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealObs.observe(el));

  /* ---------- Lightbox (solo capturas visibles) ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg");
  let lbItems = [], lbIndex = 0;
  function showLb(k) {
    lbIndex = (k + lbItems.length) % lbItems.length;
    const it = lbItems[lbIndex];
    lbImg.src = it.src; lbImg.alt = it.caption;
    $("#lbCaption").textContent = it.caption;
    $("#lbCount").textContent = `${pad(lbIndex + 1)} / ${pad(lbItems.length)}`;
  }
  function closeLightbox() {
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }
  $$(".p-shot").forEach((f) => f.addEventListener("click", () => {
    const shots = $$(".p-shot:not([hidden])");
    lbItems = shots.map((s) => p.gallery[+s.dataset.k]);
    showLb(shots.indexOf(f));
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $("#lbClose").focus({ preventScroll: true });
  }));
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => showLb(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
  });

  onScroll();
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
})();
