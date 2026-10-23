/* =========================================================
   PORTAFOLIO 3D — interacción
   ========================================================= */
(() => {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, "0");
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const catLabel = (id) => (D.categories.find((c) => c.id === id) || {}).label || id;
  const byId = (id) => D.projects.find((p) => p.id === id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Textos del perfil ---------- */
  const binds = {
    name: D.profile.name,
    role: D.profile.role,
    location: D.profile.location,
    availability: D.profile.available ? "Disponible para proyectos" : "Agenda completa",
  };
  $$("[data-bind]").forEach((el) => (el.textContent = binds[el.dataset.bind] || ""));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  function preload() {
    const srcs = D.projects.map((p) => p.cover.src).slice(0, 6).concat("assets/brand/logo.png");
    let loaded = 0, shown = 0;
    const bar = $("#loaderBar"), count = $("#loaderCount");
    const target = () => (loaded / srcs.length) * 100;
    srcs.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => loaded++;
      img.src = src;
    });
    const start = performance.now();
    (function tick() {
      shown = Math.min(lerp(shown, target(), 0.08) + 0.4, target());
      bar.style.width = shown + "%";
      count.textContent = String(Math.round(shown)).padStart(3, "0");
      const timedOut = performance.now() - start > 6000;
      if (shown >= 99.5 || timedOut) {
        count.textContent = "100"; bar.style.width = "100%";
        setTimeout(() => {
          $("#loader").classList.add("is-done");
          document.body.classList.remove("is-loading");
          document.body.classList.add("is-ready");
          startViewport();
        }, 250);
        return;
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- Reloj ---------- */
  const clock = $("#clock");
  const setClock = () => (clock.textContent = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) + " LOCAL");
  setClock(); setInterval(setClock, 30000);

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > 300 && !nav.classList.contains("is-open"));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    reelScale();
  }
  addEventListener("scroll", onScroll, { passive: true });
  $("#navToggle").addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    document.body.classList.toggle("is-locked", open);
  });
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("is-locked");
  }));
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("#navLinks a").forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["sobre-mi", "trabajos", "reel", "tech", "contacto"].forEach((id) => sectionObs.observe(document.getElementById(id)));

  /* ---------- Cursor ---------- */
  const cursor = $("#cursor"), cursorLabel = $("#cursorLabel");
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const cur = { x: mouse.x, y: mouse.y };
  addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  if (finePointer) {
    document.body.classList.add("has-cursor");
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
  function magnetize(root = document) {
    if (!finePointer || reduced) return;
    $$(".magnetic", root).forEach((el) => {
      if (el.dataset.mag) return;
      el.dataset.mag = 1;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  const observeReveals = (root = document) => $$(".reveal:not(.is-visible)", root).forEach((el) => revealObs.observe(el));

  /* ---------- Hero: nube de puntos 3D ---------- */
  function heroCanvas() {
    const canvas = $("#heroCanvas");
    const ctx = canvas.getContext("2d");
    const N = 900;
    const sphere = [], torus = [], knot = [];
    for (let i = 0; i < N; i++) {
      // esfera de Fibonacci
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
      sphere.push([Math.cos(th) * r, y, Math.sin(th) * r]);
      // toro
      const u = (i / N) * Math.PI * 2 * 30, v = (i / N) * Math.PI * 2;
      torus.push([(0.75 + 0.3 * Math.cos(u)) * Math.cos(v), 0.3 * Math.sin(u), (0.75 + 0.3 * Math.cos(u)) * Math.sin(v)]);
      // nudo toroidal (3,2)
      const t = (i / N) * Math.PI * 2;
      const kr = 0.55 + 0.25 * Math.cos(3 * t);
      knot.push([kr * Math.cos(2 * t), 0.25 * Math.sin(3 * t), kr * Math.sin(2 * t)]);
    }
    const shapes = [sphere, torus, knot];
    const pts = sphere.map((p) => p.slice());
    let shape = 0, w, h, dpr, visible = true;
    let rx = 0.4, ry = 0, trx = 0.4, tryy = 0;

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize(); addEventListener("resize", resize);
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    if (!reduced) setInterval(() => (shape = (shape + 1) % shapes.length), 5000);

    function frame(t) {
      requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      const wide = w > 1020;
      const cx = wide ? w * 0.3 : w * 0.5, cy = h * (wide ? 0.5 : 0.3);
      const R = Math.min(w, h) * (wide ? 0.42 : 0.36);
      tryy = (mouse.x / innerWidth - 0.5) * 1.2;
      trx = 0.4 + (mouse.y / innerHeight - 0.5) * 0.8;
      rx = lerp(rx, trx, 0.04); ry = lerp(ry, tryy, 0.04);
      const spin = reduced ? 0 : t * 0.00012;
      const cY = Math.cos(ry + spin), sY = Math.sin(ry + spin), cX = Math.cos(rx), sX = Math.sin(rx);
      const target = shapes[shape];
      for (let i = 0; i < N; i++) {
        const p = pts[i], q = target[i];
        p[0] = lerp(p[0], q[0], 0.035); p[1] = lerp(p[1], q[1], 0.035); p[2] = lerp(p[2], q[2], 0.035);
        let x = p[0] * cY - p[2] * sY, z = p[0] * sY + p[2] * cY;
        const y = p[1] * cX - z * sX; z = p[1] * sX + z * cX;
        const persp = 2.4 / (2.4 + z);
        const a = (1 - (z + 1) / 2) * 0.75 + 0.08;
        ctx.fillStyle = `rgba(226,229,234,${a})`;
        const s = persp * 1.3;
        ctx.fillRect(cx + x * R * persp, cy + y * R * persp, s, s);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Viewport: covers con "render" ---------- */
  let vpTimer;
  function startViewport() {
    const stage = $("#vpStage");
    const list = D.projects.filter((p) => !p.vertical);
    const imgs = list.map((p) => {
      const img = new Image();
      img.src = p.cover.src; img.alt = p.title;
      stage.appendChild(img);
      return img;
    });
    let i = -1;
    const DURATION = 4200;
    function next() {
      const prev = imgs[i];
      i = (i + 1) % imgs.length;
      imgs.forEach((im) => im.classList.remove("is-out"));
      if (prev) { prev.classList.remove("is-in"); prev.classList.add("is-out"); }
      imgs[i].classList.add("is-in");
      const p = list[i];
      $("#vpTitle").textContent = p.title;
      $("#vpCat").textContent = catLabel(p.category);
      $("#vpCam").textContent = "CAM_" + pad(i + 1);
      $("#viewport").dataset.id = p.id;
      const t0 = performance.now();
      (function meter() {
        const k = Math.min((performance.now() - t0) / DURATION, 1);
        $("#vpMeter").style.width = k * 100 + "%";
        $("#vpPct").textContent = Math.round(k * 100) + "%";
        $("#vpStatus").textContent = k < 1 ? "RENDER" : "DONE";
        if (k < 1) requestAnimationFrame(meter);
      })();
      vpTimer = setTimeout(next, DURATION + 600);
    }
    next();
    $("#viewport").addEventListener("click", () => openProject($("#viewport").dataset.id));
    if (finePointer && !reduced) {
      const vp = $("#viewport");
      vp.addEventListener("mousemove", (e) => {
        const r = vp.getBoundingClientRect();
        vp.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 10 + "deg");
        vp.style.setProperty("--rx", -((e.clientY - r.top) / r.height - 0.5) * 8 + "deg");
      });
      vp.addEventListener("mouseleave", () => { vp.style.removeProperty("--ry"); vp.style.removeProperty("--rx"); });
    }
  }

  /* ---------- Trabajos ---------- */
  const workList = $("#workList");
  $("#workCount").textContent = pad(D.projects.length);
  workList.innerHTML = D.projects.map((p, i) => `
    <button class="row reveal" data-id="${p.id}" data-cat="${p.category}" data-cursor="Ver">
      <span class="row__num mono">${pad(i + 1)}</span>
      <span class="row__title">${esc(p.title)}</span>
      <span class="row__tag">${esc(p.tagline)}</span>
      <span class="row__cat mono">${esc(catLabel(p.category))}</span>
      <span class="row__thumb"><img src="${p.cover.thumb}" alt="${esc(p.title)}" loading="lazy"></span>
    </button>`).join("");

  const filters = $("#filters");
  const counts = D.projects.reduce((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {});
  filters.innerHTML = [{ id: "all", label: "Todo" }].concat(D.categories).map((c, i) => `
    <button role="tab" class="${i === 0 ? "is-active" : ""}" data-filter="${c.id}" aria-selected="${i === 0}">
      ${esc(c.label)}<sup>${pad(c.id === "all" ? D.projects.length : counts[c.id] || 0)}</sup>
    </button>`).join("");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", filters).forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
    const f = b.dataset.filter;
    $$(".row", workList).forEach((r) => r.classList.toggle("is-hidden", f !== "all" && r.dataset.cat !== f));
  });

  $$(".viewtoggle button").forEach((b) => b.addEventListener("click", () => {
    $$(".viewtoggle button").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", x === b); });
    workList.dataset.view = b.dataset.view;
    try { localStorage.setItem("pf-view", b.dataset.view); } catch (_) {}
  }));
  try {
    const v = localStorage.getItem("pf-view");
    if (v) $(`.viewtoggle button[data-view="${v}"]`)?.click();
  } catch (_) {}

  workList.addEventListener("click", (e) => {
    const r = e.target.closest(".row"); if (r) openProject(r.dataset.id);
  });

  // Vista previa flotante (modo lista)
  const preview = $("#hoverPreview"), previewImg = $("img", preview);
  const pv = { x: 0, y: 0, r: 0 };
  if (finePointer) {
    workList.addEventListener("mouseover", (e) => {
      const r = e.target.closest(".row");
      if (!r || workList.dataset.view !== "list") return;
      const p = byId(r.dataset.id);
      if (previewImg.getAttribute("src") !== p.cover.thumb) previewImg.src = p.cover.thumb;
      preview.classList.add("is-visible");
    });
    workList.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));
    (function loop() {
      const dx = mouse.x - pv.x;
      pv.x = lerp(pv.x, mouse.x, 0.12); pv.y = lerp(pv.y, mouse.y, 0.12);
      pv.r = lerp(pv.r, Math.max(-12, Math.min(12, dx * 0.08)), 0.1);
      const s = preview.classList.contains("is-visible") ? 1 : 0.8;
      preview.style.transform = `translate(${pv.x}px, ${pv.y}px) translate(-50%, -50%) rotate(${pv.r}deg) scale(${s})`;
      requestAnimationFrame(loop);
    })();

    // Tilt 3D en grid
    workList.addEventListener("mousemove", (e) => {
      if (workList.dataset.view !== "grid") return;
      const r = e.target.closest(".row"); if (!r) return;
      const b = r.getBoundingClientRect();
      r.style.setProperty("--ty", ((e.clientX - b.left) / b.width - 0.5) * 10 + "deg");
      r.style.setProperty("--tx", -((e.clientY - b.top) / b.height - 0.5) * 10 + "deg");
    });
    workList.addEventListener("mouseout", (e) => {
      const r = e.target.closest(".row");
      if (r && !r.contains(e.relatedTarget)) { r.style.removeProperty("--tx"); r.style.removeProperty("--ty"); }
    });
  }

  /* ---------- Reel ---------- */
  const reel = $("#reelVideo"), reelFrame = $("#reelFrame");
  const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`;
  function toggleReel() {
    if (reel.paused) { reel.play(); reelFrame.classList.add("is-playing"); }
    else { reel.pause(); reelFrame.classList.remove("is-playing"); }
    $("#reelPlay svg").innerHTML = reel.paused ? '<path d="M8 5v14l11-7z"/>' : '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
  }
  reelFrame.addEventListener("click", (e) => { if (!e.target.closest(".reel__progress")) toggleReel(); });
  reel.addEventListener("timeupdate", () => {
    $("#reelProgress").style.width = (reel.currentTime / reel.duration) * 100 + "%";
    $("#reelTime").textContent = `${fmt(reel.currentTime)} / ${fmt(reel.duration || 0)}`;
  });
  reel.addEventListener("loadedmetadata", () => ($("#reelTime").textContent = `00:00 / ${fmt(reel.duration)}`));
  $(".reel__progress").addEventListener("click", (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    reel.currentTime = ((e.clientX - b.left) / b.width) * reel.duration;
  });
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && !reel.paused) toggleReel(); }, { threshold: 0.2 }).observe(reelFrame);
  function reelScale() {
    if (reduced) return;
    const r = reelFrame.getBoundingClientRect();
    const k = Math.max(0, Math.min(1, 1 - (r.top - innerHeight * 0.15) / (innerHeight * 0.8)));
    reelFrame.style.setProperty("--reel-scale", (0.86 + k * 0.14).toFixed(4));
  }

  $$(".clip").forEach((c) => {
    const v = $("video", c);
    c.addEventListener("mouseenter", () => v.play().catch(() => {}));
    c.addEventListener("mouseleave", () => v.pause());
    c.addEventListener("click", () => openProject(c.dataset.open));
  });
  if (!finePointer) {
    const clipObs = new IntersectionObserver((entries) => entries.forEach((e) => {
      const v = $("video", e.target);
      e.isIntersecting ? v.play().catch(() => {}) : v.pause();
    }), { threshold: 0.5 });
    $$(".clip").forEach((c) => clipObs.observe(c));
  }

  /* ---------- Archivo arrastrable ---------- */
  const archive = $("#archive");
  const archiveShots = [];
  D.projects.forEach((p) => p.gallery.forEach((g) => archiveShots.push({ ...g, project: p.title })));
  archive.innerHTML = archiveShots.map((s, i) => `
    <div class="archive__item" data-i="${i}">
      <img src="${s.thumb}" alt="${esc(s.project + " — " + s.caption)}" loading="lazy" draggable="false">
      <span class="mono">${esc(s.project)}</span>
    </div>`).join("");
  (function dragScroll() {
    let down = false, startX = 0, startL = 0, moved = 0, vel = 0, lastX = 0, raf;
    archive.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = 0; startX = lastX = e.clientX; startL = archive.scrollLeft; vel = 0;
      cancelAnimationFrame(raf); archive.classList.add("is-dragging");
    });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      archive.scrollLeft = startL - (e.clientX - startX);
      vel = e.clientX - lastX; lastX = e.clientX;
      moved = Math.max(moved, Math.abs(e.clientX - startX));
    });
    addEventListener("pointerup", () => {
      if (!down) return;
      down = false; archive.classList.remove("is-dragging");
      (function glide() {
        if (Math.abs(vel) < 0.5) return;
        archive.scrollLeft -= vel; vel *= 0.94;
        raf = requestAnimationFrame(glide);
      })();
    });
    archive.addEventListener("click", (e) => {
      if (moved > 6) return;
      const item = e.target.closest(".archive__item"); if (!item) return;
      openLightbox(archiveShots, +item.dataset.i);
    });
  })();

  /* ---------- Sobre mí ---------- */
  $("#bio").innerHTML = D.profile.bio.map((p) => `<p class="reveal">${esc(p)}</p>`).join("");
  $("#statement").innerHTML = (D.profile.statement || []).map((p) => `<p class="reveal">${esc(p)}</p>`).join("");
  const totalShots = D.projects.reduce((n, p) => n + p.gallery.length + (p.variants ? p.variants.length : 0) + (p.video ? 1 : 0), 0);
  const stats = [
    { n: D.projects.length, label: "Proyectos" },
    { n: totalShots, label: "Renders" },
    { n: D.categories.length, label: "Disciplinas" },
  ];
  $("#stats").innerHTML = stats.map((s) => `<div class="stat"><strong data-count="${s.n}">00</strong><span class="mono">${s.label}</span></div>`).join("");
  $("#software").innerHTML = D.software.map((s) => `
    <li class="skill">
      <span class="skill__name">${esc(s.name)}</span>
      <span class="skill__val mono">${s.level}%</span>
      <span class="skill__track"><span style="transform:scaleX(0)" data-level="${s.level}"></span></span>
    </li>`).join("");
  $("#disciplines").innerHTML = D.disciplines.map((d) => `<li>${esc(d)}</li>`).join("");
  $("#process").innerHTML = D.process.map((s) => `<li class="reveal"><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></li>`).join("");
  $("#socials").innerHTML = D.profile.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener" data-cursor="Ir">${esc(s.label)}</a></li>`).join("");

  const aboutObs = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    aboutObs.unobserve(e.target);
    $$("[data-level]", e.target).forEach((b) => (b.style.transform = `scaleX(${b.dataset.level / 100})`));
    $$("[data-count]", e.target).forEach((el) => {
      const end = +el.dataset.count, t0 = performance.now();
      (function step() {
        const k = Math.min((performance.now() - t0) / 1400, 1);
        el.textContent = pad(Math.round(end * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      })();
    });
  }), { threshold: 0.3 });
  aboutObs.observe($("#software")); aboutObs.observe($("#stats"));

  const logoBox = $("#aboutLogo");
  if (finePointer) {
    logoBox.addEventListener("mousemove", (e) => {
      const r = logoBox.getBoundingClientRect();
      logoBox.style.setProperty("--ly", ((e.clientX - r.left) / r.width - 0.5) * 40 + "deg");
      logoBox.style.setProperty("--lx", -((e.clientY - r.top) / r.height - 0.5) * 40 + "deg");
    });
    logoBox.addEventListener("mouseleave", () => { logoBox.style.removeProperty("--ly"); logoBox.style.removeProperty("--lx"); });
  }

  /* ---------- Tech Lab ---------- */
  (function techLab() {
    const T = D.tech; if (!T) return;
    const typeLabel = (id) => (T.types.find((t) => t.id === id) || {}).label || id;
    $("#techIntro").textContent = T.intro;

    $("#techStack").innerHTML = T.stack.map((g, i) => `
      <div class="stack reveal">
        <span class="stack__num mono">${pad(i + 1)}</span>
        <h3 class="stack__title">${esc(g.group)}</h3>
        <ul>${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
      </div>`).join("");

    const tFilters = $("#techFilters");
    const counts = T.projects.reduce((m, p) => ((m[p.type] = (m[p.type] || 0) + 1), m), {});
    tFilters.innerHTML = [{ id: "all", label: "Todo" }].concat(T.types).map((t, i) => `
      <button role="tab" class="${i === 0 ? "is-active" : ""}" data-filter="${t.id}" aria-selected="${i === 0}">
        ${esc(t.label)}<sup>${pad(t.id === "all" ? T.projects.length : counts[t.id] || 0)}</sup>
      </button>`).join("");

    const cards = $("#techCards");
    // La captura de portada cubre el snippet; si aún no existe, se quita y queda el código
    cards.innerHTML = T.projects.map((p, i) => `
      <article class="tcard reveal" data-type="${p.type}">
        <div class="tcard__media">
          <pre class="tcard__code"><code>${esc(p.snippet || "// TODO")}</code></pre>
          ${p.cover ? `<img src="${esc(p.cover.src)}" alt="${esc(p.title)}" loading="lazy" data-fallback>` : ""}
          <span class="tcard__type mono">${esc(typeLabel(p.type))}</span>
        </div>
        <div class="tcard__body">
          <div class="tcard__meta mono">
            <span>${pad(i + 1)}${p.year ? " · " + esc(p.year) : ""}</span>
            <span class="tcard__status" data-status="${esc(p.status)}"><i></i>${esc(p.status)}</span>
          </div>
          <h3 class="tcard__title"><a class="tcard__open" href="tech.html?p=${encodeURIComponent(p.id)}" data-cursor="Ver">${esc(p.title)}</a></h3>
          <ul class="tcard__stack">${p.stack.map((s) => `<li class="mono">${esc(s)}</li>`).join("")}</ul>
          <div class="tcard__links">
            <a href="tech.html?p=${encodeURIComponent(p.id)}" data-cursor="Ver">Ver proyecto →</a>
            ${(p.links || []).map((l) =>
              `<a href="${esc(l.url)}" target="_blank" rel="noopener" data-cursor="Ir">${esc(l.label)} ↗</a>`).join("")}
          </div>
        </div>
      </article>`).join("");
    $$("img[data-fallback]", cards).forEach((img) => {
      if (img.complete && !img.naturalWidth) img.remove();
      else img.addEventListener("error", () => img.remove());
    });

    const setCount = (n) => ($("#techCount").textContent = `${pad(n)} proyectos`);
    setCount(T.projects.length);
    tFilters.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", tFilters).forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
      const f = b.dataset.filter; let n = 0;
      $$(".tcard", cards).forEach((c) => {
        const show = f === "all" || c.dataset.type === f;
        c.classList.toggle("is-hidden", !show); n += show;
      });
      setCount(n);
    });

    // Foco de luz que sigue al cursor sobre cada tarjeta
    cards.addEventListener("mousemove", (e) => {
      const c = e.target.closest(".tcard"); if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });

    // Terminal que se escribe sola al entrar en pantalla
    const body = $("#termBody");
    const caret = $(".terminal__caret", body);
    $("#termClock").textContent = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    const write = (cls, text) => {
      const s = document.createElement("span");
      s.className = cls; s.textContent = text;
      body.insertBefore(s, caret);
      return s;
    };
    async function type() {
      const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
      for (const line of T.terminal) {
        write("terminal__prompt", "❯ ");
        const cmd = write("terminal__cmd", "");
        for (const ch of line.cmd) { cmd.textContent += ch; await wait(55 + Math.random() * 60); }
        await wait(260);
        write("terminal__out", "\n" + line.out + "\n\n");
        await wait(380);
      }
      write("terminal__prompt", "❯ ");
    }
    const termObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { termObs.disconnect(); type(); }
    }, { threshold: 0.4 });
    termObs.observe($("#terminal"));
  })();

  /* ---------- Detalle de proyecto ---------- */
  const proj = $("#project"), projInner = $("#projectInner"), projScroll = $("#projectScroll");
  let currentId = null, lastFocus = null;

  function renderProject(p) {
    const i = D.projects.indexOf(p);
    const next = D.projects[(i + 1) % D.projects.length];
    const meta = [
      ["Categoría", catLabel(p.category)],
      ["Rol", p.role],
      ["Cliente", p.client],
      ["Año", p.year],
      ["Software", (p.software || []).join(", ")],
    ].filter(([, v]) => v);
    const heroMedia = p.video && !p.gallery.length
      ? `<video src="${p.video.src}" poster="${p.video.poster}" autoplay muted loop playsinline></video>`
      : `<img src="${p.cover.src}" alt="${esc(p.title)}">`;
    const contain = p.vertical || p.square ? " p-hero--contain" : "";

    projInner.innerHTML = `
      <header class="p-hero${contain}">
        ${heroMedia}
        <div class="p-hero__text">
          <span class="mono"><i></i>${pad(i + 1)} / ${pad(D.projects.length)} — ${esc(catLabel(p.category))}</span>
          <h2 class="p-title chrome" id="pTitle">${esc(p.title)}</h2>
        </div>
      </header>
      <div class="p-body">
        <ul class="p-meta mono">${meta.map(([k, v]) => `<li><span>${k}</span><span>${esc(v)}</span></li>`).join("")}</ul>
        <div>
          <p class="p-tagline">${esc(p.tagline)}</p>
          <p class="p-desc">${esc(p.description)}</p>
        </div>
      </div>
      ${p.variants ? `
        <section class="p-config reveal">
          <div class="p-config__head">
            <span class="mono">Configurador de color — ${p.variants.length} variantes</span>
            <div class="swatches">${p.variants.map((v, k) => `
              <button class="swatch${k === 0 ? " is-active" : ""}" style="--c:${v.color}" data-k="${k}" aria-label="${esc(v.label)}" data-cursor="${esc(v.label)}"></button>`).join("")}
            </div>
          </div>
          <div class="p-config__stage">
            ${p.variants.map((v, k) => `<img src="${v.img.src}" alt="${esc(p.title + " " + v.label)}" class="${k ? "is-hidden" : ""}" loading="lazy">`).join("")}
            <span class="p-config__label">${esc(p.variants[0].label)}</span>
          </div>
        </section>` : ""}
      ${p.video && p.gallery.length ? `
        <div class="p-video reveal"><video src="${p.video.src}" poster="${p.video.poster}" controls muted loop playsinline preload="metadata"></video></div>` : ""}
      ${p.video && !p.gallery.length ? `
        <div class="p-video reveal"><video src="${p.video.src}" poster="${p.video.poster}" controls muted loop playsinline preload="metadata" style="${p.vertical ? "max-width:520px" : ""}"></video></div>` : ""}
      ${p.gallery.length ? `
        <div class="p-gallery${p.square ? " p-gallery--square" : ""}">
          ${p.gallery.map((g, k) => `
            <figure class="p-shot reveal${g.wide ? " is-wide" : ""}" data-k="${k}" data-cursor="Zoom">
              <img src="${g.src}" alt="${esc(g.caption)}" loading="lazy">
              <figcaption class="mono"><b>${pad(k + 1)}</b>${esc(g.caption)}</figcaption>
            </figure>`).join("")}
        </div>` : ""}
      <button class="p-next" data-next="${next.id}" data-cursor="Siguiente">
        <img src="${next.cover.src}" alt="" loading="lazy">
        <span class="mono">Siguiente proyecto →</span>
        <span class="p-next__title chrome">${esc(next.title)}</span>
      </button>`;

    proj.style.setProperty("--p-accent", p.accent);

    const sw = $$(".swatch", projInner), vImgs = $$(".p-config__stage img", projInner);
    sw.forEach((b) => b.addEventListener("click", () => {
      const k = +b.dataset.k;
      sw.forEach((x) => x.classList.toggle("is-active", x === b));
      vImgs.forEach((im, j) => im.classList.toggle("is-hidden", j !== k));
      $(".p-config__label", projInner).textContent = p.variants[k].label;
    }));
    $$(".p-shot", projInner).forEach((f) => f.addEventListener("click", () => openLightbox(p.gallery, +f.dataset.k)));
    $(".p-next", projInner).addEventListener("click", () => {
      proj.classList.add("is-closing");
      setTimeout(() => { location.hash = "#/proyecto/" + next.id; }, 500);
    });
    projScroll.querySelectorAll(".reveal").forEach((el) => revealObsProject.observe(el));
    magnetize(proj);
  }

  const revealObsProject = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObsProject.unobserve(e.target); }
  }), { root: projScroll, threshold: 0.1 });

  function openProject(id) {
    if (id && byId(id)) location.hash = "#/proyecto/" + id;
  }
  function showProject(id) {
    const p = byId(id); if (!p) return;
    if (!currentId) lastFocus = document.activeElement;
    currentId = id;
    renderProject(p);
    projScroll.scrollTop = 0;
    proj.classList.remove("is-open", "is-closing");
    void proj.offsetWidth; // reinicia la animación de entrada
    proj.classList.add("is-open");
    proj.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    document.title = `${p.title} — Portafolio 3D`;
    reel.pause(); reelFrame.classList.remove("is-playing");
    setTimeout(() => $("#projectClose").focus({ preventScroll: true }), 600);
  }
  function hideProject() {
    if (!currentId) return;
    currentId = null;
    proj.classList.add("is-closing");
    setTimeout(() => {
      proj.classList.remove("is-open", "is-closing");
      proj.setAttribute("aria-hidden", "true");
      projInner.innerHTML = "";
      if (!nav.classList.contains("is-open")) document.body.classList.remove("is-locked");
      lastFocus?.focus?.({ preventScroll: true });
    }, 800);
    document.title = "Portafolio 3D — Arte Digital";
  }
  function closeProject() {
    if (location.hash.startsWith("#/proyecto/")) history.pushState("", document.title, location.pathname + location.search);
    hideProject();
  }
  function route() {
    const m = location.hash.match(/^#\/proyecto\/([\w-]+)/);
    m ? showProject(m[1]) : hideProject();
  }
  addEventListener("hashchange", route);
  $("#projectClose").addEventListener("click", closeProject);

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg");
  let lbItems = [], lbIndex = 0;
  function showLb(k) {
    lbIndex = (k + lbItems.length) % lbItems.length;
    const it = lbItems[lbIndex];
    lbImg.classList.add("is-swapping");
    const im = new Image();
    im.onload = () => { lbImg.src = it.src; lbImg.alt = it.caption; lbImg.classList.remove("is-swapping"); };
    im.src = it.src;
    $("#lbCaption").textContent = (it.project ? it.project + " — " : "") + it.caption;
    $("#lbCount").textContent = `${pad(lbIndex + 1)} / ${pad(lbItems.length)}`;
  }
  function openLightbox(items, k) {
    lbItems = items; showLb(k);
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $("#lbClose").focus({ preventScroll: true });
  }
  function closeLightbox() {
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    if (!currentId) document.body.classList.remove("is-locked");
  }
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => showLb(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => showLb(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  addEventListener("keydown", (e) => {
    if (lb.classList.contains("is-open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    } else if (currentId && e.key === "Escape") closeProject();
  });

  /* ---------- Init ---------- */
  magnetize();
  observeReveals();
  heroCanvas();
  onScroll();
  preload();
  route();
})();
