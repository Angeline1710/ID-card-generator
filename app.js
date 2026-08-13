(() => {
  "use strict";

  /* ================================================================
     HACKER HOUSE GOA 2026 — Desi Beach-Themed ID & PFP Generator
     ================================================================ */

  /* ---------------- Color Palette (Desi Beachy) ---------------- */
  const BASE = {
    greenDeep:   "#1A3A2A",
    green:       "#2B5B3C",
    greenMedium: "#4A7C5C",
    greenLight:  "#5C8F6A",
    greenPale:   "#7BAF8A",
    gold:        "#D4A843",
    goldLight:   "#E8C96A",
    goldBright:  "#FFD400",
    cream:       "#F5F0E1",
    creamDark:   "#E8DFC8",
    coral:       "#C75C3A",
    coralLight:  "#E07750",
    pink:        "#D94F6B",
    sand:        "#E8D5A8",
    sandLight:   "#F0E6CC",
    sandDark:    "#C4B48A",
    ink:         "#1A2E1F",
    white:       "#FFFFFF",
    brown:       "#6B5B3A",
    brownLight:  "#8A7550",
    brownDark:   "#4A3D28",
    oceanTeal:   "#7AADA8",
    oceanMid:    "#5A9590",
    oceanDark:   "#4A8580",
    oceanDeep:   "#3A7570",
  };

  /* ---------------- Fun Titles ---------------- */
  const TITLE_ADJ = [
    "Chief", "Head of", "VP of", "Director of", "Founding",
    "Lead", "Minister of", "Senior", "Global", "Supreme",
  ];
  const TITLE_NOUN = [
    "Vibes", "Chaos Engineering", "Midnight Debugging",
    "Snack Logistics", "Bug Whispering", "Duct-Tape Architecture",
    "Caffeine Ops", "Merge Conflicts", "Beach Deploys",
    "Ctrl+Z Recovery", "Scope Creep", "Rubber Duck Relations",
    "Sunset Standups", "Localhost Diplomacy", "Hackathon Survival",
    "Whiteboard Poetry", "WiFi Diplomacy", "Deploy Fridays",
  ];

  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const randomTitle = () => `${pick(TITLE_ADJ)} ${pick(TITLE_NOUN)}`;
  const randomIdCode = () => {
    const ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 4; i++) s += ch[Math.floor(Math.random() * ch.length)];
    return `HHGOA26-${s}`;
  };

  /* ---------------- Frame Ring Themes ---------------- */
  const FRAME_STYLES = {
    palm:    { ring: BASE.gold,      accent: BASE.cream,     label: "Classic Gold" },
    surf:    { ring: BASE.coral,     accent: "#FFE0B2",      label: "Sunset Coral" },
    paisley: { ring: BASE.oceanTeal, accent: BASE.cream,     label: "Ocean Teal" },
    bunting: { ring: BASE.pink,      accent: BASE.goldBright, label: "Festival" },
  };

  /* ================================================================
     BEACH ELEMENT DRAWING FUNCTIONS
     ================================================================ */

  /* ---- Rounded Rect Path ---- */
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  /* ---- Palm Tree ---- */
  function drawPalmTree(c, x, baseY, height, lean, mirror) {
    c.save();
    c.translate(x, baseY);
    if (mirror) c.scale(-1, 1);

    const topX = lean * height * 0.28;
    const topY = -height;

    // Trunk
    c.strokeStyle = BASE.brown;
    c.lineWidth = Math.max(5, height * 0.032);
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(lean * height * 0.12, -height * 0.5, topX, topY);
    c.stroke();

    // Trunk texture
    c.strokeStyle = "rgba(0,0,0,0.12)";
    c.lineWidth = 1;
    for (let i = 0.12; i < 0.88; i += 0.07) {
      const px = lean * height * 0.12 * 2 * i * (1 - i) * 2 + topX * i * i;
      const py = -height * i;
      c.beginPath();
      c.moveTo(px - height * 0.022, py);
      c.lineTo(px + height * 0.022, py);
      c.stroke();
    }

    // Fronds
    const fronds = [
      { a: -155, l: 0.50, d: 38 },
      { a: -130, l: 0.55, d: 28 },
      { a: -105, l: 0.52, d: 18 },
      { a:  -75, l: 0.50, d: 22 },
      { a:  -45, l: 0.46, d: 32 },
      { a:  -20, l: 0.40, d: 40 },
    ];
    fronds.forEach(f => {
      const rad = (f.a * Math.PI) / 180;
      const fLen = f.l * height;
      const ex = Math.cos(rad) * fLen;
      const ey = Math.sin(rad) * fLen + f.d;
      c.save();
      c.translate(topX, topY);

      // Leaf fill
      c.fillStyle = BASE.greenMedium;
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(ex * 0.35 - 10, ey * 0.35 - 14, ex, ey);
      c.quadraticCurveTo(ex * 0.35 + 8, ey * 0.35 + 4, 0, 0);
      c.fill();

      // Depth overlay
      c.fillStyle = "rgba(26,58,42,0.18)";
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(ex * 0.35 + 5, ey * 0.35 + 1, ex, ey);
      c.quadraticCurveTo(ex * 0.35 + 8, ey * 0.35 + 4, 0, 0);
      c.fill();

      // Midrib
      c.strokeStyle = BASE.greenDeep;
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(ex * 0.5, ey * 0.3, ex, ey);
      c.stroke();

      c.restore();
    });

    // Coconuts
    c.fillStyle = BASE.brownDark;
    [[-4, 5], [4, 3], [0, 8]].forEach(([dx, dy]) => {
      c.beginPath();
      c.arc(topX + dx, topY + dy, height * 0.018, 0, Math.PI * 2);
      c.fill();
    });

    // Base grass
    c.fillStyle = BASE.greenMedium;
    for (let i = -3; i <= 3; i++) {
      c.beginPath();
      c.moveTo(i * 5, 0);
      c.quadraticCurveTo(i * 7 - 2, -16, i * 3, -26);
      c.quadraticCurveTo(i * 7 + 2, -16, i * 5 + 3, 0);
      c.fill();
    }
    c.restore();
  }

  /* ---- Sun with Clouds ---- */
  function drawSunClouds(c, cx, cy, r) {
    c.save();
    // Glow
    const g = c.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 3);
    g.addColorStop(0, "rgba(232,201,106,0.25)");
    g.addColorStop(1, "rgba(232,201,106,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(cx, cy, r * 3, 0, Math.PI * 2);
    c.fill();

    // Body
    c.fillStyle = BASE.gold;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();

    // Rays
    c.strokeStyle = BASE.gold;
    c.lineWidth = 2.2;
    c.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * (r + 5), cy + Math.sin(a) * (r + 5));
      c.lineTo(cx + Math.cos(a) * (r + 13), cy + Math.sin(a) * (r + 13));
      c.stroke();
    }

    // Clouds
    c.fillStyle = BASE.cream;
    const cx2 = cx + r * 1.1, cy2 = cy + r * 0.5;
    c.beginPath();
    c.arc(cx2, cy2, r * 0.45, 0, Math.PI * 2);
    c.arc(cx2 + r * 0.4, cy2 + r * 0.08, r * 0.32, 0, Math.PI * 2);
    c.arc(cx2 - r * 0.32, cy2 + r * 0.1, r * 0.28, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  /* ---- Birds (V shapes) ---- */
  function drawBirds(c, pts) {
    c.save();
    c.strokeStyle = BASE.ink;
    c.lineWidth = 1.8;
    c.lineCap = "round";
    pts.forEach(([x, y, s]) => {
      c.beginPath();
      c.moveTo(x - s, y + s * 0.35);
      c.quadraticCurveTo(x - s * 0.3, y - s * 0.35, x, y);
      c.quadraticCurveTo(x + s * 0.3, y - s * 0.35, x + s, y + s * 0.35);
      c.stroke();
    });
    c.restore();
  }

  /* ---- Mountains ---- */
  function drawMountains(c, baseY, W) {
    c.save();
    // Far range
    c.fillStyle = BASE.greenMedium;
    c.globalAlpha = 0.45;
    c.beginPath();
    c.moveTo(0, baseY + 20);
    c.quadraticCurveTo(W * 0.12, baseY - 80, W * 0.28, baseY + 10);
    c.quadraticCurveTo(W * 0.45, baseY - 50, W * 0.65, baseY + 5);
    c.quadraticCurveTo(W * 0.8, baseY - 30, W, baseY + 15);
    c.lineTo(W, baseY + 40);
    c.lineTo(0, baseY + 40);
    c.fill();

    // Near range
    c.fillStyle = BASE.green;
    c.globalAlpha = 0.5;
    c.beginPath();
    c.moveTo(0, baseY + 30);
    c.quadraticCurveTo(W * 0.08, baseY - 30, W * 0.22, baseY + 15);
    c.quadraticCurveTo(W * 0.38, baseY - 15, W * 0.52, baseY + 20);
    c.quadraticCurveTo(W * 0.72, baseY - 25, W, baseY + 18);
    c.lineTo(W, baseY + 40);
    c.lineTo(0, baseY + 40);
    c.fill();
    c.restore();
  }

  /* ---- Ocean ---- */
  function drawOcean(c, startY, endY, W) {
    c.save();
    // Wavy top edge shape
    c.beginPath();
    c.moveTo(0, startY + 6);
    for (let x = 0; x <= W; x += 4) {
      c.lineTo(x, startY + Math.sin(x * 0.018) * 7 + Math.sin(x * 0.005) * 4);
    }
    c.lineTo(W, endY);
    c.lineTo(0, endY);
    c.closePath();

    const g = c.createLinearGradient(0, startY, 0, endY);
    g.addColorStop(0, BASE.oceanTeal);
    g.addColorStop(0.5, BASE.oceanMid);
    g.addColorStop(1, BASE.oceanDark);
    c.fillStyle = g;
    c.fill();

    // Wave lines
    c.strokeStyle = "rgba(255,255,255,0.18)";
    c.lineWidth = 1.8;
    c.lineCap = "round";
    for (let row = 0; row < 6; row++) {
      const y = startY + ((endY - startY) / 6) * row + 18;
      c.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const wy = y + Math.sin((x + row * 70) * 0.022) * 4 +
                        Math.sin((x + row * 35) * 0.008) * 2;
        if (x === 0) c.moveTo(x, wy); else c.lineTo(x, wy);
      }
      c.stroke();
    }
    c.restore();
  }

  /* ---- Sand Beach ---- */
  function drawSand(c, startY, endY, W) {
    c.save();
    const g = c.createLinearGradient(0, startY, 0, endY);
    g.addColorStop(0, BASE.sand);
    g.addColorStop(0.35, BASE.sandLight);
    g.addColorStop(1, BASE.creamDark);
    c.fillStyle = g;

    c.beginPath();
    c.moveTo(0, startY - 2);
    for (let x = 0; x <= W; x += 8) {
      c.lineTo(x, startY + Math.sin(x * 0.012) * 6 - 2);
    }
    c.lineTo(W, endY);
    c.lineTo(0, endY);
    c.closePath();
    c.fill();

    // Texture dots
    c.fillStyle = "rgba(170,150,110,0.12)";
    for (let i = 0; i < 50; i++) {
      c.beginPath();
      c.arc(Math.random() * W, startY + 10 + Math.random() * (endY - startY - 10),
            1 + Math.random() * 1.5, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  }

  /* ---- Sailboat ---- */
  function drawSailboat(c, x, y, s) {
    c.save();
    c.translate(x, y);
    c.scale(s, s);

    // Hull
    c.fillStyle = BASE.brownDark;
    c.beginPath();
    c.moveTo(-16, 0);
    c.quadraticCurveTo(-12, 9, 0, 11);
    c.quadraticCurveTo(12, 9, 16, 0);
    c.closePath();
    c.fill();

    // Mast
    c.strokeStyle = BASE.brownDark;
    c.lineWidth = 1.8;
    c.beginPath();
    c.moveTo(0, -1);
    c.lineTo(0, -32);
    c.stroke();

    // Sail
    c.fillStyle = BASE.cream;
    c.beginPath();
    c.moveTo(0, -30);
    c.lineTo(15, -4);
    c.lineTo(0, -2);
    c.closePath();
    c.fill();

    // Flag
    c.fillStyle = BASE.coral;
    c.beginPath();
    c.moveTo(0, -32);
    c.lineTo(7, -29);
    c.lineTo(0, -26);
    c.closePath();
    c.fill();
    c.restore();
  }

  /* ---- Direction Sign Post ---- */
  function drawSignPost(c, x, baseY, s) {
    c.save();
    c.translate(x, baseY);
    c.scale(s, s);

    // Post
    c.fillStyle = BASE.brown;
    c.fillRect(-3.5, -115, 7, 125);

    // Cross texture on post
    c.strokeStyle = "rgba(0,0,0,0.1)";
    c.lineWidth = 0.8;
    for (let py = -105; py < 5; py += 8) {
      c.beginPath();
      c.moveTo(-3.5, py);
      c.lineTo(3.5, py);
      c.stroke();
    }

    const signs = [
      { y: -100, text: "BUILD",   color: BASE.coral,       dir: -1 },
      { y: -72,  text: "BREAK",   color: BASE.greenMedium, dir:  1 },
      { y: -44,  text: "BREATHE", color: BASE.gold,        dir: -1 },
    ];

    signs.forEach(sg => {
      const w = 68, h = 20, d = sg.dir;
      const sx = d > 0 ? 4 : -4 - w;

      c.fillStyle = sg.color;
      c.beginPath();
      if (d > 0) {
        c.moveTo(sx, sg.y - h / 2);
        c.lineTo(sx + w, sg.y - h / 2);
        c.lineTo(sx + w + 10, sg.y);
        c.lineTo(sx + w, sg.y + h / 2);
        c.lineTo(sx, sg.y + h / 2);
      } else {
        c.moveTo(sx + w, sg.y - h / 2);
        c.lineTo(sx, sg.y - h / 2);
        c.lineTo(sx - 10, sg.y);
        c.lineTo(sx, sg.y + h / 2);
        c.lineTo(sx + w, sg.y + h / 2);
      }
      c.closePath();
      c.fill();

      // Shadow
      c.fillStyle = "rgba(0,0,0,0.1)";
      c.fill();

      // Re-fill
      c.fillStyle = sg.color;
      c.fill();

      c.fillStyle = BASE.cream;
      c.font = "bold 11px 'Baloo 2',sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(sg.text, d > 0 ? sx + w / 2 + 2 : sx + w / 2 - 2, sg.y + 1);
    });

    // Base plants
    c.fillStyle = BASE.greenMedium;
    for (let i = -2; i <= 2; i++) {
      c.beginPath();
      c.moveTo(i * 5, 10);
      c.quadraticCurveTo(i * 7, -6, i * 3, -18);
      c.quadraticCurveTo(i * 7 + 3, -6, i * 5 + 3, 10);
      c.fill();
    }
    c.restore();
  }

  /* ---- Surfboards ---- */
  function drawSurfboards(c, x, baseY, s) {
    c.save();
    c.translate(x, baseY);
    c.scale(s, s);

    const boards = [
      { x: -22, a: -12, color: BASE.greenMedium, stripe: BASE.cream },
      { x:   0, a:  -3, color: BASE.cream,       stripe: BASE.gold },
      { x:  22, a:   8, color: BASE.gold,         stripe: BASE.greenMedium },
    ];

    boards.forEach(b => {
      c.save();
      c.translate(b.x, 0);
      c.rotate((b.a * Math.PI) / 180);

      c.fillStyle = b.color;
      c.beginPath();
      c.ellipse(0, 0, 8, 48, 0, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = b.stripe;
      c.lineWidth = 1.8;
      c.beginPath();
      c.moveTo(0, -36);
      c.lineTo(0, 36);
      c.stroke();

      c.strokeStyle = "rgba(0,0,0,0.15)";
      c.lineWidth = 0.8;
      c.beginPath();
      c.ellipse(0, 0, 8, 48, 0, 0, Math.PI * 2);
      c.stroke();

      c.restore();
    });
    c.restore();
  }

  /* ---- Starfish ---- */
  function drawStarfish(c, x, y, sz) {
    c.save();
    c.translate(x, y);
    c.fillStyle = BASE.coral;
    c.beginPath();
    for (let i = 0; i < 5; i++) {
      const oa = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const ia = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
      if (i === 0) c.moveTo(Math.cos(oa) * sz, Math.sin(oa) * sz);
      else c.lineTo(Math.cos(oa) * sz, Math.sin(oa) * sz);
      c.lineTo(Math.cos(ia) * sz * 0.38, Math.sin(ia) * sz * 0.38);
    }
    c.closePath();
    c.fill();

    c.fillStyle = "rgba(255,255,255,0.25)";
    c.beginPath();
    c.arc(0, 0, sz * 0.15, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  /* ---- Seashell ---- */
  function drawShell(c, x, y, sz) {
    c.save();
    c.translate(x, y);
    c.fillStyle = BASE.sandDark;
    c.beginPath();
    c.arc(0, 0, sz, Math.PI, 0);
    c.quadraticCurveTo(sz * 0.3, sz * 0.8, 0, sz * 0.5);
    c.quadraticCurveTo(-sz * 0.3, sz * 0.8, -sz, 0);
    c.fill();

    c.strokeStyle = "rgba(0,0,0,0.1)";
    c.lineWidth = 0.6;
    for (let i = 0.2; i < 1; i += 0.25) {
      c.beginPath();
      c.arc(0, 0, sz * i, Math.PI, 0);
      c.stroke();
    }
    c.restore();
  }

  /* ---- Tropical Plants / Leaves ---- */
  function drawPlants(c, x, baseY, s, mirror) {
    c.save();
    c.translate(x, baseY);
    if (mirror) c.scale(-1, 1);
    c.scale(s, s);

    const leaves = [
      { a: -75, l: 50, w: 14 },
      { a: -55, l: 62, w: 16 },
      { a: -38, l: 48, w: 12 },
      { a: -95, l: 42, w: 11 },
      { a: -25, l: 35, w: 9 },
    ];
    leaves.forEach(lf => {
      const rad = (lf.a * Math.PI) / 180;
      const ex = Math.cos(rad) * lf.l;
      const ey = Math.sin(rad) * lf.l;

      c.fillStyle = BASE.greenMedium;
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(ex * 0.4 - lf.w * 0.5, ey * 0.4, ex, ey);
      c.quadraticCurveTo(ex * 0.4 + lf.w * 0.5, ey * 0.4, 0, 0);
      c.fill();

      c.strokeStyle = BASE.greenDeep;
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(ex, ey);
      c.stroke();
    });
    c.restore();
  }

  /* ---- Flower (frangipani) ---- */
  function drawFlower(c, x, y, sz) {
    c.save();
    c.translate(x, y);
    c.fillStyle = BASE.cream;
    for (let i = 0; i < 5; i++) {
      c.save();
      c.rotate((i / 5) * Math.PI * 2);
      c.beginPath();
      c.ellipse(0, -sz * 0.6, sz * 0.32, sz * 0.55, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
    c.fillStyle = BASE.gold;
    c.beginPath();
    c.arc(0, 0, sz * 0.22, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  /* ---- String Lights ---- */
  function drawStringLights(c, x1, y1, x2, y2, count, sag) {
    c.save();
    // String
    c.strokeStyle = "rgba(0,0,0,0.25)";
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(x1, y1);
    c.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + sag, x2, y2);
    c.stroke();

    const colors = [BASE.coral, BASE.gold, BASE.greenMedium, BASE.pink, BASE.cream];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const mx = x1 + (x2 - x1) * t;
      const my = y1 + (y2 - y1) * t + sag * 4 * t * (1 - t);

      c.fillStyle = colors[i % colors.length];
      c.beginPath();
      c.arc(mx, my + 4, 4.5, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = "rgba(0,0,0,0.08)";
      c.lineWidth = 0.5;
      c.beginPath();
      c.moveTo(mx, my);
      c.lineTo(mx, my + 2);
      c.stroke();
    }
    c.restore();
  }

  /* ---- Wave Ornament (tilde decoration for tagline) ---- */
  function drawWaveOrnament(c, x, y, w, color) {
    c.save();
    c.strokeStyle = color;
    c.lineWidth = 2;
    c.lineCap = "round";
    c.beginPath();
    for (let i = 0; i <= w; i += 2) {
      const px = x + i;
      const py = y + Math.sin((i / w) * Math.PI * 3) * 3;
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.stroke();
    c.restore();
  }

  /* ---- Wave Border ---- */
  function drawWaveBorder(c, y, W, color, amp, wl) {
    c.save();
    c.strokeStyle = color;
    c.lineWidth = 2.2;
    c.lineCap = "round";
    c.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const py = y + Math.sin((x / wl) * Math.PI * 2) * amp;
      if (x === 0) c.moveTo(x, py); else c.lineTo(x, py);
    }
    c.stroke();
    c.restore();
  }

  /* ---- Pill Badge ---- */
  function pillBadge(c, cx, cy, w, h, bg, textColor, text, font) {
    c.save();
    c.fillStyle = "rgba(0,0,0,0.12)";
    rrect(c, cx - w / 2 + 2, cy - h / 2 + 3, w, h, h / 2);
    c.fill();
    c.fillStyle = bg;
    rrect(c, cx - w / 2, cy - h / 2, w, h, h / 2);
    c.fill();
    c.strokeStyle = "rgba(0,0,0,0.08)";
    c.lineWidth = 1;
    c.stroke();
    c.fillStyle = textColor;
    c.font = font;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, cx, cy + 1);
    c.restore();
  }

  /* ---- Fit Text Helper ---- */
  function fitText(text, maxW, baseSize, family, weight) {
    let sz = baseSize;
    ctx.font = `${weight} ${sz}px ${family}`;
    while (ctx.measureText(text).width > maxW && sz > 14) {
      sz -= 2;
      ctx.font = `${weight} ${sz}px ${family}`;
    }
    return sz;
  }

  /* ---- Arc Text ---- */
  function drawArcText(text, cx, cy, radius, startDeg, opts) {
    const { font, color, letterSpacing = 0, flip = false } = opts;
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const chars = text.split("");
    const angles = chars.map(ch => (ctx.measureText(ch).width + letterSpacing) / radius);
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

  /* ---- Decorative Paisley ---- */
  function drawPaisley(c, x, y, sz, rot) {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.scale(sz / 20, sz / 20);
    c.fillStyle = BASE.gold;
    c.globalAlpha = 0.3;
    c.beginPath();
    c.moveTo(0, -15);
    c.quadraticCurveTo(12, -10, 10, 5);
    c.quadraticCurveTo(8, 15, 0, 12);
    c.quadraticCurveTo(-5, 8, -3, 0);
    c.quadraticCurveTo(-2, -8, 0, -15);
    c.fill();
    c.globalAlpha = 1;
    c.restore();
  }

  /* ================================================================
     STATE & DOM
     ================================================================ */
  const state = {
    format: "A",
    theme: "palm",
    img: null,
    transform: { A: null, B: null },
    idCode: randomIdCode(),
    dragging: false,
    pointers: new Map(),
    pinchStartDist: 0,
    pinchStartZoom: 1,
  };

  const canvas  = document.getElementById("stage");
  const ctx     = canvas.getContext("2d");
  const shell   = document.querySelector(".stage-shell");
  const drop    = document.getElementById("dropHint");
  const fileIn  = document.getElementById("fileInput");
  const ctrls   = document.getElementById("stageControls");
  const changeBtn = document.getElementById("changePhotoBtn");
  const zoomSlider = document.getElementById("zoomSlider");
  const dlBtn   = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");
  const shareHint = document.getElementById("shareHint");
  const fmtBFields = document.getElementById("formatBFields");
  const nameIn  = document.getElementById("nameInput");
  const roleIn  = document.getElementById("roleInput");
  const titleIn = document.getElementById("titleInput");
  const shuffleBtn = document.getElementById("shuffleTitleBtn");
  const toastEl = document.getElementById("toast");
  const swatches = document.querySelectorAll(".theme-swatch");

  titleIn.value = randomTitle();

  /* ---------- Toast ---------- */
  let toastT = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 3500);
  }

  /* ---------- Theme ---------- */
  swatches.forEach(btn => {
    btn.addEventListener("click", () => {
      swatches.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.theme = btn.dataset.theme;
      render();
    });
  });

  /* ================================================================
     GEOMETRY
     ================================================================ */
  function getWindowRect(fmt) {
    if (fmt === "A") return { x: 165, y: 165, w: 750, h: 750 };
    /* Format B — circle in the beach scene */
    return { x: 320, y: 370, w: 440, h: 440 };
  }

  function coverBase(img, w, h) { return Math.max(w / img.width, h / img.height); }

  function getTransform(fmt) {
    if (!state.transform[fmt] && state.img) {
      const win = getWindowRect(fmt);
      const b = coverBase(state.img, win.w, win.h);
      state.transform[fmt] = {
        zoom: 1,
        offsetX: (win.w - state.img.width * b) / 2,
        offsetY: (win.h - state.img.height * b) / 2,
      };
    }
    return state.transform[fmt];
  }

  function clampT(fmt) {
    const t = getTransform(fmt); if (!t) return;
    const win = getWindowRect(fmt);
    const e = coverBase(state.img, win.w, win.h) * t.zoom;
    const dw = state.img.width * e, dh = state.img.height * e;
    t.offsetX = Math.min(0, Math.max(Math.min(0, win.w - dw), t.offsetX));
    t.offsetY = Math.min(0, Math.max(Math.min(0, win.h - dh), t.offsetY));
  }

  function applyZoom(fmt, nz) {
    const t = getTransform(fmt); if (!t) return;
    const win = getWindowRect(fmt);
    const b = coverBase(state.img, win.w, win.h);
    const oE = b * t.zoom, nE = b * nz;
    const cx = win.w / 2, cy = win.h / 2;
    t.offsetX = cx - (cx - t.offsetX) * (nE / oE);
    t.offsetY = cy - (cy - t.offsetY) * (nE / oE);
    t.zoom = nz;
    clampT(fmt);
  }

  /* ---- Draw Photo Clipped into Circle ---- */
  function drawPhoto(fmt, win) {
    const t = getTransform(fmt);
    if (!t || !state.img) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(win.x + win.w / 2, win.y + win.h / 2, win.w / 2, 0, Math.PI * 2);
    ctx.clip();
    const b = coverBase(state.img, win.w, win.h);
    const e = b * t.zoom;
    ctx.drawImage(state.img, win.x + t.offsetX, win.y + t.offsetY,
                  state.img.width * e, state.img.height * e);
    ctx.restore();
  }

  /* ================================================================
     FORMAT A — PFP FRAME (1080 × 1080)
     ================================================================ */
  function drawFrameA() {
    const W = canvas.width, H = canvas.height;
    const R = FRAME_STYLES[state.theme];
    ctx.clearRect(0, 0, W, H);

    /* -- Background -- */
    const bg = ctx.createRadialGradient(W / 2, H * 0.4, 80, W / 2, H / 2, W * 0.6);
    bg.addColorStop(0, BASE.green);
    bg.addColorStop(1, BASE.greenDeep);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* -- Subtle paisley decorations -- */
    drawPaisley(ctx, W * 0.06, H * 0.15, 18, -0.4);
    drawPaisley(ctx, W * 0.94, H * 0.18, 16, 0.5);
    drawPaisley(ctx, W * 0.08, H * 0.82, 14, 0.3);
    drawPaisley(ctx, W * 0.92, H * 0.85, 15, -0.6);

    /* -- Beach scene bottom half -- */
    drawMountains(ctx, H * 0.68, W);
    drawOcean(ctx, H * 0.70, H * 0.82, W);
    drawSand(ctx, H * 0.81, H, W);

    /* -- Sun & birds -- */
    drawSunClouds(ctx, W * 0.84, H * 0.10, 22);
    drawBirds(ctx, [
      [W * 0.74, H * 0.06, 7],
      [W * 0.80, H * 0.04, 5],
      [W * 0.14, H * 0.08, 6],
    ]);

    /* -- Palm trees -- */
    drawPalmTree(ctx, W * 0.06, H * 0.82, 140, 0.5, false);
    drawPalmTree(ctx, W * 0.94, H * 0.82, 130, -0.4, true);

    /* -- String lights -- */
    drawStringLights(ctx, W * 0.04, H * 0.12, W * 0.96, H * 0.12, 12, 18);

    /* -- Plants & flowers -- */
    drawPlants(ctx, W * 0.02, H * 0.96, 1.1, false);
    drawPlants(ctx, W * 0.98, H * 0.96, 1.1, true);
    drawFlower(ctx, W * 0.15, H * 0.92, 7);
    drawFlower(ctx, W * 0.86, H * 0.93, 6);

    /* -- Small surfboards & starfish -- */
    drawSurfboards(ctx, W * 0.86, H * 0.88, 0.5);
    drawStarfish(ctx, W * 0.18, H * 0.93, 8);
    drawShell(ctx, W * 0.78, H * 0.95, 5);

    /* -- Photo window -- */
    const win = getWindowRect("A");
    const cx = win.x + win.w / 2, cy = win.y + win.h / 2, r = win.w / 2;

    /* Cream glow behind photo */
    ctx.save();
    ctx.fillStyle = BASE.cream;
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    if (state.img) {
      drawPhoto("A", win);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Gold ring */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 7, 0, Math.PI * 2);
    ctx.lineWidth = 11;
    ctx.strokeStyle = R.ring;
    ctx.stroke();
    ctx.restore();

    /* Outer dotted ring */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
    ctx.setLineDash([3, 10]);
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = R.accent;
    ctx.stroke();
    ctx.restore();

    /* Arc text */
    drawArcText("HACKER HOUSE", cx, cy, r + 50, 0, {
      font: `900 36px 'Fraunces',serif`, color: BASE.gold, letterSpacing: 5,
    });
    drawArcText("GOA · 2026", cx, cy, r + 50, 180, {
      font: `700 28px 'Space Mono',monospace`, color: BASE.cream, letterSpacing: 7, flip: true,
    });

    /* गोवा badge */
    pillBadge(ctx, cx + r * 0.56, cy + r * 0.62, 110, 42, BASE.coral,
             BASE.cream, "गोवा", "700 20px 'Baloo 2',sans-serif");

    /* CODE • SUN • CHAOS small text at very top */
    ctx.font = "600 14px 'Space Mono',monospace";
    ctx.fillStyle = BASE.cream;
    ctx.globalAlpha = 0.6;
    ctx.textAlign = "center";
    ctx.fillText("CODE  •  SUN  •  CHAOS", W / 2, 30);
    ctx.globalAlpha = 1;
  }

  /* ================================================================
     FORMAT B — BUILDER ID CARD (1080 × 1350)
     ================================================================ */
  function drawCardB() {
    const W = canvas.width, H = canvas.height;
    const R = FRAME_STYLES[state.theme];
    ctx.clearRect(0, 0, W, H);

    const m = 32; // margin

    /* ── BACKGROUND ── */
    const bg = ctx.createLinearGradient(0, 0, 0, H * 0.35);
    bg.addColorStop(0, BASE.green);
    bg.addColorStop(1, BASE.greenDeep);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Fill the lower part with green deep */
    ctx.fillStyle = BASE.greenDeep;
    ctx.fillRect(0, H * 0.3, W, H * 0.7);

    /* Subtle inner panel */
    rrect(ctx, m, m, W - m * 2, H - m * 2, 34);
    ctx.fillStyle = "rgba(255,255,255,0.015)";
    ctx.fill();

    /* ── BEACH SCENE ── */
    const sceneTop = 260;
    const mtBase = sceneTop + 120;
    const oceanTop = mtBase + 25;
    const sandTop = H * 0.56;
    const bottomWaveY = H * 0.82;

    drawMountains(ctx, mtBase, W);
    drawOcean(ctx, oceanTop, sandTop + 15, W);
    drawSand(ctx, sandTop, bottomWaveY + 30, W);
    drawOcean(ctx, bottomWaveY + 20, H, W);

    /* Palm trees */
    drawPalmTree(ctx, 80, sandTop + 15, 240, 0.35, false);
    drawPalmTree(ctx, W - 45, sandTop + 40, 190, -0.25, true);

    /* Sun & clouds */
    drawSunClouds(ctx, W - 155, sceneTop + 35, 26);

    /* Birds */
    drawBirds(ctx, [
      [W - 105, sceneTop + 8, 7],
      [W - 80, sceneTop + 20, 5],
      [W - 130, sceneTop + 25, 6],
      [180, sceneTop + 15, 5],
    ]);

    /* Sailboat */
    drawSailboat(ctx, W - 210, oceanTop + 55, 1.4);

    /* String lights between palm tops */
    drawStringLights(ctx, 160, sceneTop + 20, W - 160, sceneTop + 20, 10, 22);

    /* ── PHOTO CIRCLE ── */
    const win = getWindowRect("B");
    const cx = win.x + win.w / 2, cy = win.y + win.h / 2, r = win.w / 2;

    /* Cream glow behind photo */
    ctx.save();
    ctx.fillStyle = BASE.cream;
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    if (state.img) {
      drawPhoto("B", win);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Ring */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
    ctx.lineWidth = 9;
    ctx.strokeStyle = R.ring;
    ctx.stroke();
    ctx.restore();

    /* Outer ring */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 16, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = R.accent;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    /* ── SIGN POST ── */
    drawSignPost(ctx, 150, sandTop + 80, 1.45);

    /* ── SURFBOARDS ── */
    drawSurfboards(ctx, W - 135, sandTop + 40, 1.45);

    /* ── DECORATIVE ELEMENTS ON SAND ── */
    drawStarfish(ctx, W / 2 - 140, sandTop + 125, 13);
    drawShell(ctx, W / 2 + 165, sandTop + 110, 7);
    drawFlower(ctx, W - 100, sandTop + 130, 8);

    /* ── PLANTS AT BOTTOM ── */
    drawPlants(ctx, 25, bottomWaveY + 25, 1.6, false);
    drawPlants(ctx, W - 25, bottomWaveY + 25, 1.6, true);

    /* ── WAVE BORDERS ── */
    drawWaveBorder(ctx, bottomWaveY + 5, W, "rgba(245,240,225,0.2)", 5, 48);
    drawWaveBorder(ctx, bottomWaveY + 18, W, "rgba(245,240,225,0.14)", 4, 38);

    /* ── NAME PLATE ── */
    const name = (nameIn.value || "YOUR NAME").trim() || "YOUR NAME";
    const npY = sandTop + 165;
    const npW = 480, npH = 60;

    ctx.fillStyle = BASE.cream;
    rrect(ctx, W / 2 - npW / 2, npY - npH / 2, npW, npH, 14);
    ctx.fill();
    ctx.strokeStyle = BASE.gold;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const nSz = fitText(name.toUpperCase(), npW - 36, 36, "'Fraunces',serif", 900);
    ctx.font = `900 ${nSz}px 'Fraunces',serif`;
    ctx.fillStyle = BASE.ink;
    ctx.textAlign = "center";
    ctx.fillText(name.toUpperCase(), W / 2, npY + 4);

    /* ── ROLE PLATE ── */
    const role = (roleIn.value || "TEAM / ROLE").trim() || "TEAM / ROLE";
    const rpY = npY + npH / 2 + 30;
    const rpW = 330, rpH = 38;

    ctx.fillStyle = BASE.gold;
    rrect(ctx, W / 2 - rpW / 2, rpY - rpH / 2, rpW, rpH, 10);
    ctx.fill();

    const rSz = fitText(role.toUpperCase(), rpW - 28, 18, "'Space Mono',monospace", 700);
    ctx.font = `700 ${rSz}px 'Space Mono',monospace`;
    ctx.fillStyle = BASE.greenDeep;
    ctx.textAlign = "center";
    ctx.fillText(role.toUpperCase(), W / 2, rpY + 3);

    /* ── BUILDER TITLE PILL ── */
    const title = (titleIn.value || randomTitle()).trim() || "Chief Vibes Officer";
    const tpY = rpY + rpH / 2 + 35;
    const tFont = "700 20px 'Baloo 2',sans-serif";
    ctx.font = tFont;
    const tpW = Math.min(W - 160, ctx.measureText(title).width + 48);
    pillBadge(ctx, W / 2, tpY, tpW, 44, BASE.coral, BASE.cream, title, tFont);

    /* ── PAISLEY DECORATIONS ── */
    drawPaisley(ctx, 75, sceneTop + 80, 14, 0.3);
    drawPaisley(ctx, W - 75, sceneTop + 75, 12, -0.4);

    /* ══════════════════════════════════════
       TEXT OVERLAYS (drawn last to be on top)
       ══════════════════════════════════════ */

    /* ── PUNCH HOLE ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, m + 34, 16, 0, Math.PI * 2);
    ctx.fillStyle = BASE.greenDeep;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(245,240,225,0.3)";
    ctx.stroke();
    ctx.restore();

    /* ── TOP BAR ── */
    ctx.fillStyle = BASE.cream;
    ctx.globalAlpha = 0.85;
    ctx.textAlign = "left";
    ctx.font = "700 20px 'Space Mono',monospace";
    ctx.fillText("2:47PM", m + 30, m + 82);
    ctx.font = "400 13px 'Space Mono',monospace";
    ctx.fillText("STUDIO", m + 30, m + 100);

    ctx.textAlign = "right";
    ctx.font = "400 15px 'Space Mono',monospace";
    ctx.fillText("GOA, INDIA", W - m - 30, m + 82);
    ctx.font = "700 15px 'Space Mono',monospace";
    ctx.fillText("28 - 31 OCT 2026", W - m - 30, m + 100);
    ctx.globalAlpha = 1;

    /* ── TITLE: HACKER [गोवा] HOUSE ── */
    const ttlY = m + 168;
    ctx.textAlign = "center";

    // Measure parts
    ctx.font = "900 58px 'Fraunces',serif";
    const hW = ctx.measureText("HACKER ").width;
    const huW = ctx.measureText(" HOUSE").width;
    const gFont = "800 36px 'Baloo 2',sans-serif";
    ctx.font = gFont;
    const gW = ctx.measureText("गोवा").width;

    const totalW = hW + gW + huW + 20;
    const tStartX = (W - totalW) / 2;

    // HACKER
    ctx.font = "900 58px 'Fraunces',serif";
    ctx.fillStyle = BASE.gold;
    ctx.textAlign = "left";
    ctx.fillText("HACKER", tStartX, ttlY);

    // गोवा pill
    const goaCX = tStartX + hW + gW / 2 + 10;
    pillBadge(ctx, goaCX, ttlY - 14, gW + 22, 38, BASE.coral, BASE.cream, "गोवा", gFont);

    // HOUSE
    ctx.font = "900 58px 'Fraunces',serif";
    ctx.fillStyle = BASE.gold;
    ctx.textAlign = "left";
    ctx.fillText("HOUSE", goaCX + gW / 2 + 14, ttlY);

    /* ── TAGLINE: ~~~~ CODE • SUN • CHAOS ~~~~ ── */
    const tagY = ttlY + 38;
    ctx.font = "600 18px 'Space Mono',monospace";
    ctx.fillStyle = BASE.cream;
    ctx.globalAlpha = 0.8;
    ctx.textAlign = "center";
    const tagTxt = "CODE  •  SUN  •  CHAOS";
    const tagTxtW = ctx.measureText(tagTxt).width;
    ctx.fillText(tagTxt, W / 2, tagY);

    drawWaveOrnament(ctx, W / 2 - tagTxtW / 2 - 55, tagY - 2, 45, BASE.gold + "99");
    drawWaveOrnament(ctx, W / 2 + tagTxtW / 2 + 10, tagY - 2, 45, BASE.gold + "99");
    ctx.globalAlpha = 1;

    /* ── FOOTER ── */
    const ftY = H - 50;
    ctx.textAlign = "left";
    ctx.font = "400 14px 'Space Mono',monospace";
    ctx.fillStyle = BASE.cream;
    ctx.globalAlpha = 0.55;
    ctx.fillText("CODE • SUN • CHAOS", m + 35, ftY);
    ctx.textAlign = "right";
    ctx.fillStyle = BASE.gold;
    ctx.globalAlpha = 0.7;
    ctx.fillText(state.idCode, W - m - 35, ftY);
    ctx.globalAlpha = 1;
  }

  /* ================================================================
     RENDER
     ================================================================ */
  let rq = false;
  function render() {
    if (rq) return;
    rq = true;
    requestAnimationFrame(() => {
      rq = false;
      if (state.format === "A") drawFrameA(); else drawCardB();
    });
  }

  /* ================================================================
     FORMAT TOGGLE
     ================================================================ */
  const fmtBtns = document.querySelectorAll(".format-btn");
  fmtBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      fmtBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      state.format = btn.dataset.format;
      canvas.width  = 1080;
      canvas.height = state.format === "A" ? 1080 : 1350;
      shell.classList.toggle("format-B", state.format === "B");
      fmtBFields.hidden = state.format !== "B";
      if (state.img) {
        clampT(state.format);
        zoomSlider.value = Math.round((getTransform(state.format)?.zoom || 1) * 100);
      }
      render();
    });
  });

  /* ================================================================
     FILE UPLOAD
     ================================================================ */
  function isHeic(f) {
    return /heic|heif/i.test(f.type) || /\.hei[cf]$/i.test(f.name);
  }

  async function handleFile(file) {
    if (!file || (!file.type.startsWith("image/") && !isHeic(file))) {
      toast("That doesn't look like an image — try JPG, PNG, or HEIC.");
      return;
    }
    drop.querySelector("p").textContent = "Reading photo…";
    let blob = file;
    if (isHeic(file)) {
      try {
        const c = await window.heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
        blob = Array.isArray(c) ? c[0] : c;
      } catch {
        toast("Couldn't read HEIC — try JPG or PNG.");
        resetDrop();
        return;
      }
    }
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      state.img = img;
      state.transform = { A: null, B: null };
      drop.hidden = true;
      shell.classList.add("has-image");
      ctrls.hidden = false;
      dlBtn.disabled = false;
      shareBtn.disabled = false;
      shareHint.textContent = "Drag to reposition · Pinch or slider to zoom · Everything renders locally.";
      render();
    };
    img.onerror = () => { toast("Couldn't load that photo."); resetDrop(); };
    img.src = url;
  }

  function resetDrop() {
    drop.querySelector("p").textContent = "Tap to upload your photo";
  }

  drop.addEventListener("click", () => fileIn.click());
  changeBtn.addEventListener("click", () => fileIn.click());
  fileIn.addEventListener("change", e => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
    fileIn.value = "";
  });

  ["dragover", "dragenter"].forEach(ev =>
    shell.addEventListener(ev, e => { e.preventDefault(); shell.style.outline = `3px solid ${BASE.gold}`; })
  );
  ["dragleave", "drop"].forEach(ev =>
    shell.addEventListener(ev, e => { e.preventDefault(); shell.style.outline = "none"; })
  );
  shell.addEventListener("drop", e => {
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  });

  /* ================================================================
     POINTER DRAG / PINCH ZOOM
     ================================================================ */
  function scaleFactor() { return canvas.width / canvas.getBoundingClientRect().width; }
  let lastPtr = null;

  shell.addEventListener("pointerdown", e => {
    if (!state.img) return;
    shell.setPointerCapture(e.pointerId);
    state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (state.pointers.size === 1) {
      state.dragging = true;
      lastPtr = { x: e.clientX, y: e.clientY };
      shell.classList.add("dragging");
    } else if (state.pointers.size === 2) {
      const pts = [...state.pointers.values()];
      state.pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      state.pinchStartZoom = getTransform(state.format)?.zoom || 1;
    }
  });

  shell.addEventListener("pointermove", e => {
    if (!state.pointers.has(e.pointerId)) return;
    state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (state.pointers.size === 2) {
      const pts = [...state.pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const nz = Math.min(3, Math.max(1, state.pinchStartZoom * dist / (state.pinchStartDist || dist)));
      applyZoom(state.format, nz);
      zoomSlider.value = Math.round(nz * 100);
      render();
      return;
    }
    if (state.dragging && lastPtr) {
      const s = scaleFactor();
      const dx = (e.clientX - lastPtr.x) * s;
      const dy = (e.clientY - lastPtr.y) * s;
      lastPtr = { x: e.clientX, y: e.clientY };
      const t = getTransform(state.format);
      if (t) {
        t.offsetX += dx;
        t.offsetY += dy;
        clampT(state.format);
        render();
      }
    }
  });

  function endPtr(e) {
    state.pointers.delete(e.pointerId);
    if (state.pointers.size < 2) state.pinchStartDist = 0;
    if (state.pointers.size === 0) {
      state.dragging = false;
      lastPtr = null;
      shell.classList.remove("dragging");
    }
  }
  shell.addEventListener("pointerup", endPtr);
  shell.addEventListener("pointercancel", endPtr);
  shell.addEventListener("pointerleave", e => { if (state.pointers.size <= 1) endPtr(e); });

  shell.addEventListener("wheel", e => {
    if (!state.img) return;
    e.preventDefault();
    const t = getTransform(state.format); if (!t) return;
    const nz = Math.min(3, Math.max(1, t.zoom - e.deltaY * 0.0015));
    applyZoom(state.format, nz);
    zoomSlider.value = Math.round(nz * 100);
    render();
  }, { passive: false });

  zoomSlider.addEventListener("input", () => {
    if (!state.img) return;
    applyZoom(state.format, zoomSlider.value / 100);
    render();
  });

  /* ================================================================
     FORM FIELDS
     ================================================================ */
  [nameIn, roleIn, titleIn].forEach(el => el.addEventListener("input", render));
  shuffleBtn.addEventListener("click", () => { titleIn.value = randomTitle(); render(); });

  /* ================================================================
     DOWNLOAD
     ================================================================ */
  dlBtn.addEventListener("click", () => {
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hhgoa2026-${state.format === "A" ? "frame" : "id-card"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast("Downloaded — you're ready to post! 🏖️");
    }, "image/png");
  });

  /* ================================================================
     SHARE TO X (Twitter)
     ================================================================ */
  function buildCaption() {
    if (state.format === "A") {
      return "Just got my Hacker House Goa 2026 profile frame! 🌴💻 CODE • SUN • CHAOS";
    }
    const name = (nameIn.value || "").trim();
    const title = (titleIn.value || "Chief Vibes Officer").trim();
    return `${name ? name + "'s" : "My"} Hacker House Goa 2026 Builder ID is ready — ${title}, reporting for duty 🌴🏖️`;
  }

  shareBtn.addEventListener("click", () => {
    canvas.toBlob(async blob => {
      if (!blob) return;
      const caption = buildCaption();
      const fname = `hhgoa2026-${state.format === "A" ? "frame" : "id-card"}.png`;
      const file = new File([blob], fname, { type: "image/png" });

      /* ── Primary: Native Share (mobile — can attach file directly) ── */
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Hacker House Goa 2026",
            text: caption,
          });
          toast("Shared! See you in Goa 🌴");
          return;
        } catch (err) {
          if (err?.name === "AbortError") return;
          /* fall through to desktop fallback */
        }
      }

      /* ── Fallback: Auto-download image + redirect to X ── */
      // Step 1: Download the image
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = dlUrl;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(dlUrl), 5000);

      // Step 2: Short delay to let download start, then open X
      toast("Image saved! Opening X — attach it to your tweet 📎");

      setTimeout(() => {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&hashtags=HackerHouseGoa,FrameInGoa`;
        window.open(tweetUrl, "_blank", "noopener");
      }, 600);

    }, "image/png");
  });

  /* ================================================================
     INIT
     ================================================================ */
  render();
})();
