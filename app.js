(() => {
  "use strict";

  /* ---------------- constants ---------------- */
  const THEMES = {
    classic: {
      green: "#0b5c34", greenDeep: "#073820", greenLight: "#0f7a45",
      yellow: "#ffd400", yellowSoft: "#ffe873",
      pink: "#ff2f92", pinkDeep: "#d6127a",
      cream: "#fff8e7", ink: "#06331e",
    },
    sunset: {
      green: "#7a2e0f", greenDeep: "#3d1204", greenLight: "#a8481c",
      yellow: "#ffb703", yellowSoft: "#ffd166",
      pink: "#ff3d5a", pinkDeep: "#c8102e",
      cream: "#fff3e0", ink: "#3d1204",
    },
    midnight: {
      green: "#1b1035", greenDeep: "#0d0720", greenLight: "#2e1a55",
      yellow: "#ffd400", yellowSoft: "#ffe873",
      pink: "#00e5ff", pinkDeep: "#00a8bf",
      cream: "#f1e9ff", ink: "#0d0720",
    },
    beach: {
      green: "#0a4d68", greenDeep: "#052733", greenLight: "#0f6f94",
      yellow: "#ffd166", yellowSoft: "#ffe29a",
      pink: "#ff6b9d", pinkDeep: "#e0447a",
      cream: "#eaf6ff", ink: "#052733",
    },
  };

  const TITLE_ADJ = ["Chief", "Head of", "VP of", "Director of", "Founding", "Lead", "Minister of", "Senior", "Global"];
  const TITLE_NOUN = [
    "Vibes", "Chaos Engineering", "Midnight Debugging", "Snack Logistics", "Bug Whispering",
    "Duct-Tape Architecture", "Caffeine Ops", "Merge Conflicts", "Beach Deploys", "Ctrl+Z Recovery",
    "Scope Creep", "Rubber Duck Relations", "Sunset Standups", "Localhost Diplomacy", "Hackathon Survival",
    "Whiteboard Poetry", "WiFi Diplomacy", "Deploy Fridays"
  ];

  // BASE is the site's fixed interface palette — used for every canvas element
  // except the ring/border that wraps the photo, which follows the chosen theme.
  const BASE = THEMES.classic;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomTitle = () => `${pick(TITLE_ADJ)} ${pick(TITLE_NOUN)}`;
  const randomIdCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return `HHGOA26-${s}`;
  };

  /* ---------------- state ---------------- */
  const state = {
    format: "A",
    theme: "classic",
    img: null,
    transform: { A: null, B: null },
    idCode: randomIdCode(),
    dragging: false,
    pointers: new Map(),
    pinchStartDist: 0,
    pinchStartZoom: 1,
  };

  /* ---------------- dom ---------------- */
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const stageShell = document.querySelector(".stage-shell");
  const dropHint = document.getElementById("dropHint");
  const fileInput = document.getElementById("fileInput");
  const stageControls = document.getElementById("stageControls");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const zoomSlider = document.getElementById("zoomSlider");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");
  const shareHint = document.getElementById("shareHint");
  const formatBFields = document.getElementById("formatBFields");
  const nameInput = document.getElementById("nameInput");
  const roleInput = document.getElementById("roleInput");
  const titleInput = document.getElementById("titleInput");
  const shuffleTitleBtn = document.getElementById("shuffleTitleBtn");
  const toastEl = document.getElementById("toast");
  const themeSwatches = document.querySelectorAll(".theme-swatch");

  titleInput.value = randomTitle();

  /* ---------------- toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }

  /* ---------------- theme (ring/border around the photo only) ---------------- */
  themeSwatches.forEach((btn) => {
    btn.addEventListener("click", () => {
      themeSwatches.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.theme = btn.dataset.theme;
      render();
    });
  });

  /* ---------------- geometry helpers ---------------- */
  function getWindowRect(format) {
    if (format === "A") {
      return { x: 120, y: 120, w: 840, h: 840, shape: "circle" };
    }
    return { x: 210, y: 300, w: 660, h: 660, shape: "rounded", r: 36 };
  }

  function computeCoverBase(img, w, h) {
    return Math.max(w / img.width, h / img.height);
  }

  function getTransform(format) {
    if (!state.transform[format] && state.img) {
      const win = getWindowRect(format);
      const base = computeCoverBase(state.img, win.w, win.h);
      const dispW = state.img.width * base;
      const dispH = state.img.height * base;
      state.transform[format] = {
        zoom: 1,
        offsetX: (win.w - dispW) / 2,
        offsetY: (win.h - dispH) / 2,
      };
    }
    return state.transform[format];
  }

  function clampTransform(format) {
    const t = getTransform(format);
    if (!t) return;
    const win = getWindowRect(format);
    const eff = computeCoverBase(state.img, win.w, win.h) * t.zoom;
    const dispW = state.img.width * eff;
    const dispH = state.img.height * eff;
    const minX = Math.min(0, win.w - dispW);
    const minY = Math.min(0, win.h - dispH);
    t.offsetX = Math.min(0, Math.max(minX, t.offsetX));
    t.offsetY = Math.min(0, Math.max(minY, t.offsetY));
  }

  function applyZoom(format, newZoom) {
    const t = getTransform(format);
    if (!t) return;
    const win = getWindowRect(format);
    const base = computeCoverBase(state.img, win.w, win.h);
    const oldEff = base * t.zoom;
    const newEff = base * newZoom;
    const cx = win.w / 2, cy = win.h / 2;
    t.offsetX = cx - (cx - t.offsetX) * (newEff / oldEff);
    t.offsetY = cy - (cy - t.offsetY) * (newEff / oldEff);
    t.zoom = newZoom;
    clampTransform(format);
  }

  /* ---------------- drawing primitives ---------------- */
  function roundedRectPath(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function drawPhotoInWindow(format, win) {
    const t = getTransform(format);
    if (!t || !state.img) return;
    ctx.save();
    if (win.shape === "circle") {
      ctx.beginPath();
      ctx.arc(win.x + win.w / 2, win.y + win.h / 2, win.w / 2, 0, Math.PI * 2);
      ctx.clip();
    } else {
      roundedRectPath(ctx, win.x, win.y, win.w, win.h, win.r);
      ctx.clip();
    }
    const base = computeCoverBase(state.img, win.w, win.h);
    const eff = base * t.zoom;
    const dw = state.img.width * eff;
    const dh = state.img.height * eff;
    ctx.drawImage(state.img, win.x + t.offsetX, win.y + t.offsetY, dw, dh);
    ctx.restore();
  }

  function drawArcText(text, cx, cy, radius, startDeg, opts) {
    const { font, color, letterSpacing = 0, flip = false } = opts;
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const chars = text.split("");
    const angles = chars.map((c) => (ctx.measureText(c).width + letterSpacing) / radius);
    const total = angles.reduce((a, b) => a + b, 0);
    const dir = flip ? -1 : 1;
    let angle = (startDeg * Math.PI) / 180 - (dir * total) / 2;
    for (let i = 0; i < chars.length; i++) {
      angle += (dir * angles[i]) / 2;
      ctx.save();
      ctx.translate(cx + radius * Math.sin(angle), cy - radius * Math.cos(angle));
      ctx.rotate(angle + (flip ? Math.PI : 0));
      ctx.fillText(chars[i], 0, 0);
      ctx.restore();
      angle += (dir * angles[i]) / 2;
    }
    ctx.restore();
  }

  function dashedCircle(cx, cy, r, opts) {
    const { color, width = 4, dash = [10, 10], rotate = 0 } = opts;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotate);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.setLineDash(dash);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
  }

  function sunIcon(cx, cy, r, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = r * 0.16;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 1.5, cy + Math.sin(a) * r * 1.5);
      ctx.lineTo(cx + Math.cos(a) * r * 1.9, cy + Math.sin(a) * r * 1.9);
      ctx.stroke();
    }
    ctx.restore();
  }

  function palmIcon(cx, cy, scale, color, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.quadraticCurveTo(4, 10, 6, -30);
    ctx.stroke();
    const fronds = [
      [-40, -55, -10, -34], [40, -60, 12, -30], [-30, -10, -6, -20],
      [32, -14, 8, -18], [0, -60, 4, -20],
    ];
    fronds.forEach(([ex, ey, mx, my]) => {
      ctx.beginPath();
      ctx.moveTo(6, -30);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.quadraticCurveTo(mx * 0.6, my * 0.6, 6, -30);
      ctx.fill();
    });
    ctx.restore();
  }

  function pillBadge(cx, cy, w, h, rotateDeg, bg, textColor, text, font) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotateDeg * Math.PI) / 180);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    roundedRectPath(ctx, -w / 2 + 4, -h / 2 + 6, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = bg;
    roundedRectPath(ctx, -w / 2, -h / 2, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 2);
    ctx.restore();
  }

  function fitText(text, maxWidth, baseSize, fontFamily, weight = 800) {
    let size = baseSize;
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    while (ctx.measureText(text).width > maxWidth && size > 20) {
      size -= 2;
      ctx.font = `${weight} ${size}px ${fontFamily}`;
    }
    return size;
  }

  /* ---------------- format A: PFP frame ---------------- */
  function drawFrameA() {
    const COLORS = BASE;
    const RING = THEMES[state.theme];
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W / 2);
    grad.addColorStop(0, COLORS.greenLight);
    grad.addColorStop(1, COLORS.greenDeep);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    sunIcon(W / 2, H * 0.14, 26, COLORS.yellow, 0.18);
    palmIcon(90, H - 60, 1.1, COLORS.cream, 0.1);
    palmIcon(W - 90, H - 60, -1.1, COLORS.cream, 0.1);

    const win = getWindowRect("A");
    const cx = win.x + win.w / 2, cy = win.y + win.h / 2, r = win.w / 2;

    if (state.img) {
      drawPhotoInWindow("A", win);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ring — the customizable frame around the photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 9, 0, Math.PI * 2);
    ctx.lineWidth = 18;
    ctx.strokeStyle = RING.yellow;
    ctx.stroke();
    ctx.restore();

    dashedCircle(cx, cy, r + 34, { color: RING.pink, width: 5, dash: [4, 14] });
    dashedCircle(cx, cy, r + 52, { color: RING.yellow, width: 3, dash: [2, 10] });

    drawArcText("HACKER HOUSE", cx, cy, r + 74, 0, {
      font: `700 40px 'Baloo 2'`, color: COLORS.yellow, letterSpacing: 6,
    });
    drawArcText("GOA · 2026", cx, cy, r + 74, 180, {
      font: `700 36px 'Space Mono'`, color: COLORS.cream, letterSpacing: 8, flip: true,
    });

    pillBadge(cx + r * 0.66, cy + r * 0.7, 168, 60, -8, COLORS.pink, COLORS.cream, "#FrameInGoa", `700 24px 'Baloo 2'`);
  }

  /* ---------------- format B: builder ID card ---------------- */
  function drawCardB() {
    const COLORS = BASE;
    const RING = THEMES[state.theme];
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, COLORS.greenLight);
    grad.addColorStop(1, COLORS.greenDeep);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const margin = 44;
    roundedRectPath(ctx, margin, margin, W - margin * 2, H - margin * 2, 40);
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    ctx.fill();

    ctx.save();
    roundedRectPath(ctx, margin + 22, margin + 22, W - (margin + 22) * 2, H - (margin + 22) * 2, 28);
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,212,0,0.55)";
    ctx.stroke();
    ctx.restore();

    // punch hole
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, margin + 54, 22, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.greenDeep;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,248,231,0.4)";
    ctx.stroke();
    ctx.restore();

    sunIcon(W - 130, margin + 110, 20, COLORS.yellow, 0.5);
    palmIcon(120, margin + 130, 0.8, COLORS.cream, 0.14);

    // header wordmark
    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.yellow;
    ctx.font = `900 46px 'Fraunces'`;
    ctx.fillText("HACKER HOUSE", W / 2, margin + 150);
    ctx.font = `700 22px 'Space Mono'`;
    ctx.fillStyle = COLORS.cream;
    ctx.globalAlpha = 0.85;
    ctx.fillText("GOA · 2026 BUILDER PASS", W / 2, margin + 184);
    ctx.globalAlpha = 1;

    // photo window
    const win = getWindowRect("B");
    if (state.img) {
      drawPhotoInWindow("B", win);
    } else {
      roundedRectPath(ctx, win.x, win.y, win.w, win.h, win.r);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
    }
    // customizable frame around the photo
    ctx.save();
    roundedRectPath(ctx, win.x, win.y, win.w, win.h, win.r);
    ctx.lineWidth = 12;
    ctx.strokeStyle = RING.yellow;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    roundedRectPath(ctx, win.x - 14, win.y - 14, win.w + 28, win.h + 28, win.r + 14);
    ctx.setLineDash([3, 11]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = RING.pink;
    ctx.stroke();
    ctx.restore();

    // name
    const name = (nameInput.value || "Your Name").trim() || "Your Name";
    const nameY = win.y + win.h + 90;
    const nameSize = fitText(name.toUpperCase(), W - 180, 62, "Fraunces", 900);
    ctx.font = `900 ${nameSize}px 'Fraunces'`;
    ctx.fillStyle = COLORS.cream;
    ctx.textAlign = "center";
    ctx.fillText(name.toUpperCase(), W / 2, nameY);

    // role
    const role = (roleInput.value || "Builder · Hacker House Goa").trim() || "Builder · Hacker House Goa";
    ctx.font = `400 26px 'Space Mono'`;
    ctx.fillStyle = COLORS.yellowSoft;
    ctx.fillText(role, W / 2, nameY + 42);

    // builder title pill
    const title = (titleInput.value || randomTitle()).trim() || "Chief Vibes Officer";
    const pillFont = `700 26px 'Baloo 2'`;
    ctx.font = pillFont;
    const pillW = Math.min(W - 160, ctx.measureText(title).width + 64);
    pillBadge(W / 2, nameY + 96, pillW, 58, -2, COLORS.pink, COLORS.cream, title, pillFont);

    // footer
    const footerY = H - margin - 60;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(margin + 60, footerY - 34);
    ctx.lineTo(W - margin - 60, footerY - 34);
    ctx.setLineDash([2, 10]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,248,231,0.4)";
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = "left";
    ctx.font = `700 20px 'Space Mono'`;
    ctx.fillStyle = COLORS.cream;
    ctx.globalAlpha = 0.85;
    ctx.fillText("GOA, INDIA · 28–31 OCT 2026", margin + 60, footerY);
    ctx.textAlign = "right";
    ctx.fillStyle = COLORS.yellow;
    ctx.fillText(state.idCode, W - margin - 60, footerY);
    ctx.globalAlpha = 1;
  }

  /* ---------------- render dispatch ---------------- */
  let renderQueued = false;
  function render() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      if (state.format === "A") drawFrameA(); else drawCardB();
    });
  }

  /* ---------------- format toggle ---------------- */
  const formatBtns = document.querySelectorAll(".format-btn");
  formatBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      formatBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      state.format = btn.dataset.format;
      canvas.width = state.format === "A" ? 1080 : 1080;
      canvas.height = state.format === "A" ? 1080 : 1350;
      stageShell.classList.toggle("format-B", state.format === "B");
      formatBFields.hidden = state.format !== "B";
      if (state.img) {
        clampTransform(state.format);
        zoomSlider.value = Math.round((getTransform(state.format)?.zoom || 1) * 100);
      }
      render();
    });
  });

  /* ---------------- upload handling ---------------- */
  function isHeic(file) {
    return /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
  }

  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/") && !isHeic(file)) {
      toast("That doesn't look like an image — try a JPG, PNG, or HEIC.");
      return;
    }
    dropHint.querySelector("p").textContent = "Reading photo…";
    let blob = file;
    if (isHeic(file)) {
      try {
        const converted = await window.heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
        blob = Array.isArray(converted) ? converted[0] : converted;
      } catch (e) {
        toast("Couldn't read that HEIC photo — try a JPG or PNG.");
        resetDropHint();
        return;
      }
    }
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      state.img = image;
      state.transform = { A: null, B: null };
      dropHint.hidden = true;
      stageShell.classList.add("has-image");
      stageControls.hidden = false;
      downloadBtn.disabled = false;
      shareBtn.disabled = false;
      shareHint.textContent = "Drag to reposition, pinch or use the slider to zoom. Everything renders locally in your browser.";
      render();
    };
    image.onerror = () => {
      toast("Couldn't load that photo. Try another file.");
      resetDropHint();
    };
    image.src = url;
  }

  function resetDropHint() {
    dropHint.querySelector("p").textContent = "Tap to upload your photo";
  }

  dropHint.addEventListener("click", () => fileInput.click());
  changePhotoBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
    fileInput.value = "";
  });

  ["dragover", "dragenter"].forEach((ev) =>
    stageShell.addEventListener(ev, (e) => { e.preventDefault(); stageShell.style.outline = `3px solid ${BASE.yellow}`; })
  );
  ["dragleave", "drop"].forEach((ev) =>
    stageShell.addEventListener(ev, (e) => { e.preventDefault(); stageShell.style.outline = "none"; })
  );
  stageShell.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  /* ---------------- pointer drag / pinch zoom ---------------- */
  function canvasScaleFactor() {
    const rect = canvas.getBoundingClientRect();
    return canvas.width / rect.width;
  }

  let lastPointerPos = null;

  stageShell.addEventListener("pointerdown", (e) => {
    if (!state.img) return;
    stageShell.setPointerCapture(e.pointerId);
    state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (state.pointers.size === 1) {
      state.dragging = true;
      lastPointerPos = { x: e.clientX, y: e.clientY };
      stageShell.classList.add("dragging");
    } else if (state.pointers.size === 2) {
      const pts = [...state.pointers.values()];
      state.pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      state.pinchStartZoom = getTransform(state.format)?.zoom || 1;
    }
  });

  stageShell.addEventListener("pointermove", (e) => {
    if (!state.pointers.has(e.pointerId)) return;
    state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (state.pointers.size === 2) {
      const pts = [...state.pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = dist / (state.pinchStartDist || dist);
      const newZoom = Math.min(3, Math.max(1, state.pinchStartZoom * ratio));
      applyZoom(state.format, newZoom);
      zoomSlider.value = Math.round(newZoom * 100);
      render();
      return;
    }

    if (state.dragging && lastPointerPos) {
      const scale = canvasScaleFactor();
      const dx = (e.clientX - lastPointerPos.x) * scale;
      const dy = (e.clientY - lastPointerPos.y) * scale;
      lastPointerPos = { x: e.clientX, y: e.clientY };
      const t = getTransform(state.format);
      if (t) {
        t.offsetX += dx;
        t.offsetY += dy;
        clampTransform(state.format);
        render();
      }
    }
  });

  function endPointer(e) {
    state.pointers.delete(e.pointerId);
    if (state.pointers.size < 2) state.pinchStartDist = 0;
    if (state.pointers.size === 0) {
      state.dragging = false;
      lastPointerPos = null;
      stageShell.classList.remove("dragging");
    }
  }
  stageShell.addEventListener("pointerup", endPointer);
  stageShell.addEventListener("pointercancel", endPointer);
  stageShell.addEventListener("pointerleave", (e) => { if (state.pointers.size <= 1) endPointer(e); });

  stageShell.addEventListener("wheel", (e) => {
    if (!state.img) return;
    e.preventDefault();
    const t = getTransform(state.format);
    if (!t) return;
    const newZoom = Math.min(3, Math.max(1, t.zoom - e.deltaY * 0.0015));
    applyZoom(state.format, newZoom);
    zoomSlider.value = Math.round(newZoom * 100);
    render();
  }, { passive: false });

  zoomSlider.addEventListener("input", () => {
    if (!state.img) return;
    applyZoom(state.format, zoomSlider.value / 100);
    render();
  });

  /* ---------------- form fields ---------------- */
  [nameInput, roleInput, titleInput].forEach((el) => el.addEventListener("input", render));
  shuffleTitleBtn.addEventListener("click", () => { titleInput.value = randomTitle(); render(); });

  /* ---------------- download ---------------- */
  downloadBtn.addEventListener("click", () => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hhgoa2026-${state.format === "A" ? "frame" : "id-card"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast("Downloaded — you're ready to post! \u{1F3D6}️");
    }, "image/png");
  });

  /* ---------------- share to X ---------------- */
  function buildCaption() {
    if (state.format === "A") {
      return "Landed my Hacker House Goa 2026 profile frame \u{1F334}\u{1F4BB}";
    }
    const name = (nameInput.value || "").trim();
    const title = (titleInput.value || "Chief Vibes Officer").trim();
    return `${name ? name + "’s" : "My"} Hacker House Goa 2026 Builder ID is live — ${title}, reporting for duty \u{1F334}`;
  }

  shareBtn.addEventListener("click", () => {
    const text = buildCaption();
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=FrameInGoa&url=${encodeURIComponent(location.origin)}`;
    window.open(intent, "_blank", "noopener");
    toast("Opening X — don't forget to attach your download! \u{1F334}");
  });

  /* ---------------- init ---------------- */
  render();
})();
