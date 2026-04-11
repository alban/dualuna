/**
 * Pre-render all location backgrounds, world map, and menu as PNG files.
 * Run: node scripts/generate-backgrounds.js
 */
import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'backgrounds');
mkdirSync(OUT_DIR, { recursive: true });

const W = 1024;
const H_SCENE = 648; // 768 - 120 (UI bar)
const H_FULL = 768;

function save(canvas, name) {
  const buf = canvas.toBuffer('image/png');
  const path = join(OUT_DIR, `${name}.png`);
  writeFileSync(path, buf);
  console.log(`  ✓ ${name}.png (${(buf.length / 1024).toFixed(1)} KB)`);
}

// ── Drawing helpers ──

function gradient(ctx, w, h, top, bottom) {
  for (let y = 0; y < h; y++) {
    const t = y / h;
    const r = Math.floor(top[0] + t * (bottom[0] - top[0]));
    const g = Math.floor(top[1] + t * (bottom[1] - top[1]));
    const b = Math.floor(top[2] + t * (bottom[2] - top[2]));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, y, w, 1);
  }
}

function drawOcean(ctx, x, y, w, h) {
  for (let oy = 0; oy < h; oy++) {
    const t = oy / h;
    const r = Math.floor(15 + t * 10);
    const g = Math.floor(40 + t * 20);
    const b = Math.floor(100 + t * 40);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y + oy, w, 1);
  }
  ctx.strokeStyle = 'rgba(102,153,187,0.2)';
  ctx.lineWidth = 1;
  for (let wy = y + 10; wy < y + h; wy += 15) {
    ctx.beginPath();
    for (let wx = x; wx < x + w; wx += 4) {
      const yy = wy + Math.sin(wx * 0.03 + wy * 0.1) * 3;
      if (wx === x) ctx.moveTo(wx, yy); else ctx.lineTo(wx, yy);
    }
    ctx.stroke();
  }
}

function drawCliffs(ctx, w, h) {
  ctx.fillStyle = '#665544';
  ctx.fillRect(w * 0.7, 0, w * 0.3, h);
  ctx.strokeStyle = 'rgba(85,68,51,0.4)';
  ctx.lineWidth = 1;
  for (let y = 20; y < h; y += 25) {
    ctx.beginPath(); ctx.moveTo(w * 0.7, y); ctx.lineTo(w, y + 10); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(68,204,136,0.3)';
  for (let i = 0; i < 8; i++) {
    const vx = w * 0.72 + Math.sin(i * 2.1) * 60;
    const vy = 50 + i * 70;
    ctx.fillRect(vx, vy, 30 + Math.sin(i) * 15, 3);
  }
}

function drawTrees(ctx, baseX, baseY, count) {
  for (let i = 0; i < count; i++) {
    const tx = baseX + i * 50 + Math.sin(i * 3) * 20;
    const ty = baseY + Math.sin(i * 2) * 15;
    ctx.fillStyle = '#664422';
    ctx.fillRect(tx - 3, ty, 6, 30);
    ctx.fillStyle = 'rgba(51,136,51,0.9)';
    ctx.beginPath(); ctx.moveTo(tx, ty - 25); ctx.lineTo(tx - 18, ty + 5); ctx.lineTo(tx + 18, ty + 5); ctx.fill();
    ctx.fillStyle = 'rgba(68,170,68,0.7)';
    ctx.beginPath(); ctx.moveTo(tx, ty - 35); ctx.lineTo(tx - 14, ty - 5); ctx.lineTo(tx + 14, ty - 5); ctx.fill();
  }
}

function ellipse(ctx, cx, cy, rx, ry) {
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath(); ctx.fill();
}

// ── Location backgrounds ──

const locations = {
  'mine-entrance': (ctx, w, h) => {
    gradient(ctx, w, h, [60, 70, 90], [40, 45, 50]);
    ctx.fillStyle = '#554a3a'; ctx.fillRect(0, h * 0.7, w, h * 0.3);
    drawCliffs(ctx, w, h);
    ctx.fillStyle = '#111111';
    roundRect(ctx, w * 0.73, h * 0.35, 80, 120, 8);
    ctx.fillStyle = '#885533';
    ctx.fillRect(w * 0.73, h * 0.33, 6, 125);
    ctx.fillRect(w * 0.73 + 76, h * 0.33, 6, 125);
    ctx.fillRect(w * 0.73, h * 0.33, 82, 6);
    ctx.fillStyle = 'rgba(102,85,68,0.5)'; ctx.fillRect(0, h * 0.75, w * 0.5, 30);
    drawOcean(ctx, 0, h * 0.5, w * 0.5, h * 0.2);
    ctx.fillStyle = '#886633'; ctx.fillRect(w * 0.55, h * 0.65, 25, 20); ctx.fillRect(w * 0.60, h * 0.63, 20, 22);
  },

  'mine-shaft': (ctx, w, h) => {
    gradient(ctx, w, h, [25, 22, 20], [15, 12, 10]);
    ctx.fillStyle = '#332b22'; ctx.fillRect(0, 0, w * 0.15, h); ctx.fillRect(w * 0.85, 0, w * 0.15, h);
    ctx.fillStyle = '#2a2520'; ctx.fillRect(0, h * 0.8, w, h * 0.2);
    ctx.fillStyle = 'rgba(68,204,136,0.5)';
    for (let i = 0; i < 12; i++) {
      const vx = w * 0.15 + Math.sin(i * 1.7) * (w * 0.3);
      const vy = 40 + i * 45;
      ctx.fillRect(vx, vy, 45 + Math.sin(i * 0.9) * 20, 4);
      ctx.fillStyle = 'rgba(51,170,102,0.3)';
      ctx.beginPath(); ctx.arc(vx + 20, vy, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(68,204,136,0.5)';
    }
    for (let i = 0; i < 4; i++) {
      const bx = w * 0.25 + i * (w * 0.15);
      ctx.fillStyle = 'rgba(102,68,34,0.8)'; ctx.fillRect(bx, h * 0.1, 8, h * 0.7);
    }
    ctx.strokeStyle = 'rgba(17,17,17,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.2); ctx.lineTo(w * 0.4, h * 0.35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * 0.4, h * 0.35); ctx.lineTo(w * 0.35, h * 0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w * 0.6, h * 0.3); ctx.lineTo(w * 0.7, h * 0.45); ctx.stroke();
    ctx.fillStyle = 'rgba(34,68,102,0.4)'; ellipse(ctx, w * 0.5, h * 0.75, 60, 10);
    ctx.fillStyle = 'rgba(255,170,68,0.08)'; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.4, 150, 0, Math.PI * 2); ctx.fill();
  },

  'tidewatcher-village': (ctx, w, h) => {
    gradient(ctx, w, h, [50, 70, 110], [40, 55, 65]);
    ctx.fillStyle = 'rgba(204,221,238,0.1)'; ellipse(ctx, 200, 80, 60, 15); ellipse(ctx, 600, 60, 50, 12);
    ctx.fillStyle = '#667755'; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    const houseColors = ['#885544', '#776644', '#887766', '#665544'];
    for (let i = 0; i < 4; i++) {
      const hx = 120 + i * 180, hy = h * 0.45;
      ctx.fillStyle = houseColors[i]; ctx.fillRect(hx, hy, 60, 50);
      ctx.fillStyle = '#664433';
      ctx.beginPath(); ctx.moveTo(hx - 5, hy); ctx.lineTo(hx + 30, hy - 30); ctx.lineTo(hx + 65, hy); ctx.fill();
      ctx.fillStyle = 'rgba(255,204,102,0.6)'; ctx.fillRect(hx + 20, hy + 15, 15, 15);
    }
    drawOcean(ctx, 0, h * 0.85, w, h * 0.15);
    ctx.fillStyle = '#556633'; ctx.fillRect(100, h * 0.65, 80, 40); ctx.fillRect(400, h * 0.68, 60, 35);
  },

  'cliff-overlook': (ctx, w, h) => {
    gradient(ctx, w, h, [40, 60, 120], [30, 55, 90]);
    drawOcean(ctx, 0, h * 0.4, w, h * 0.6);
    ctx.fillStyle = '#556644'; ctx.fillRect(0, h * 0.85, w, h * 0.15);
    ctx.fillStyle = '#665544'; ctx.fillRect(0, h * 0.87, w, h * 0.13);
    ctx.fillStyle = 'rgba(51,68,51,0.4)'; ellipse(ctx, 250, h * 0.5, 40, 12);
    ctx.fillStyle = 'rgba(68,51,85,0.3)'; ellipse(ctx, 650, h * 0.45, 30, 9);
    ctx.fillStyle = 'rgba(68,85,51,0.35)'; ellipse(ctx, 800, h * 0.52, 25, 7);
    ctx.fillStyle = 'rgba(238,238,221,0.3)'; ctx.beginPath(); ctx.arc(180, 80, 25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(221,204,187,0.2)'; ctx.beginPath(); ctx.arc(750, 60, 18, 0, Math.PI * 2); ctx.fill();
  },

  'forest-path': (ctx, w, h) => {
    gradient(ctx, w, h, [20, 50, 25], [15, 35, 18]);
    ctx.fillStyle = 'rgba(34,85,34,0.8)'; ctx.fillRect(0, 0, w, h * 0.3);
    ctx.fillStyle = '#2a3a1a'; ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = 'rgba(85,68,51,0.6)';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8); ctx.lineTo(w * 0.3, h * 0.75); ctx.lineTo(w * 0.6, h * 0.78); ctx.lineTo(w, h * 0.73);
    ctx.lineTo(w, h * 0.85); ctx.lineTo(w * 0.6, h * 0.88); ctx.lineTo(w * 0.3, h * 0.85); ctx.lineTo(0, h * 0.9);
    ctx.closePath(); ctx.fill();
    drawTrees(ctx, 30, h * 0.35, 6); drawTrees(ctx, 500, h * 0.3, 5);
    ctx.fillStyle = 'rgba(68,170,51,0.3)';
    for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.arc(80 + i * 90, h * 0.72 + Math.sin(i) * 10, 15, 0, Math.PI * 2); ctx.fill(); }
  },

  'elder-grove': (ctx, w, h) => {
    gradient(ctx, w, h, [15, 40, 20], [10, 30, 15]);
    ctx.fillStyle = '#443322'; ctx.fillRect(w * 0.4, 0, w * 0.2, h);
    ctx.strokeStyle = 'rgba(51,34,17,0.5)'; ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 15) { ctx.beginPath(); ctx.moveTo(w * 0.4, y); ctx.lineTo(w * 0.6, y + 5); ctx.stroke(); }
    ctx.fillStyle = 'rgba(51,102,51,0.9)'; ctx.beginPath(); ctx.arc(w * 0.5, -50, 300, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(68,51,34,0.8)';
    for (let i = 0; i < 5; i++) { ctx.fillRect(w * 0.35 + i * (w * 0.07), h * 0.7, 15, h * 0.3); }
    ctx.fillStyle = '#334422'; ctx.fillRect(0, h * 0.75, w, h * 0.25);
    ctx.fillStyle = 'rgba(102,221,102,0.15)';
    for (let i = 0; i < 15; i++) { ctx.beginPath(); ctx.arc(50 + i * 65, h * 0.78 + Math.sin(i) * 8, 20, 0, Math.PI * 2); ctx.fill(); }
  },

  'harbor-workshop': (ctx, w, h) => {
    gradient(ctx, w, h, [50, 60, 80], [45, 50, 55]);
    drawOcean(ctx, 0, h * 0.6, w, h * 0.4);
    ctx.fillStyle = '#886633'; ctx.fillRect(0, h * 0.55, w, h * 0.08);
    ctx.fillStyle = '#887755'; ctx.fillRect(50, h * 0.2, 120, h * 0.35);
    ctx.fillStyle = '#776644'; ctx.fillRect(200, h * 0.3, 80, h * 0.25);
    ctx.fillStyle = '#998866'; ctx.fillRect(320, h * 0.15, 150, h * 0.4);
    ctx.fillStyle = '#554433'; ctx.fillRect(90, h * 0.12, 15, h * 0.08); ctx.fillRect(380, h * 0.07, 12, h * 0.08);
    ctx.fillStyle = 'rgba(170,170,170,0.15)';
    ctx.beginPath(); ctx.arc(95, h * 0.08, 20, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(386, h * 0.03, 15, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(170,170,102,0.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(550, h * 0.4, 30, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(570, h * 0.35, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(136,102,51,0.8)';
    for (let i = 0; i < 5; i++) { ctx.fillRect(500 + i * 40, h * 0.5, 25, 20); }
  },

  'inventors-lab': (ctx, w, h) => {
    gradient(ctx, w, h, [35, 30, 25], [30, 28, 22]);
    ctx.fillStyle = '#665533'; ctx.fillRect(50, h * 0.5, w * 0.4, 15); ctx.fillRect(w * 0.55, h * 0.45, w * 0.4, 15);
    ctx.fillRect(60, h * 0.5, 8, h * 0.3); ctx.fillRect(w * 0.4, h * 0.5, 8, h * 0.3);
    ctx.fillRect(w * 0.56, h * 0.45, 8, h * 0.35); ctx.fillRect(w * 0.93, h * 0.45, 8, h * 0.35);
    ctx.fillStyle = '#3a3530'; ctx.fillRect(0, h * 0.8, w, h * 0.2);
    ctx.fillStyle = 'rgba(68,102,170,0.3)'; ctx.fillRect(100, h * 0.1, 80, 60); ctx.fillRect(250, h * 0.15, 60, 50);
    ctx.fillStyle = 'rgba(170,170,68,0.6)'; ctx.beginPath(); ctx.arc(200, h * 0.47, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(204,136,51,0.7)'; ctx.fillRect(300, h * 0.46, 30, 15);
    ctx.fillStyle = 'rgba(136,204,204,0.5)'; ctx.fillRect(w * 0.65, h * 0.42, 25, 12);
    ctx.fillStyle = 'rgba(255,204,68,0.15)'; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.2, 80, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,170,51,0.6)'; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.08, 10, 0, Math.PI * 2); ctx.fill();
  },

  'crystal-plaza': (ctx, w, h) => {
    gradient(ctx, w, h, [25, 20, 50], [20, 18, 40]);
    ctx.fillStyle = '#332255'; ctx.fillRect(0, h * 0.65, w, h * 0.35);
    const pillarColors = ['rgba(102,68,170,0.7)', 'rgba(85,51,187,0.7)', 'rgba(119,85,204,0.7)', 'rgba(68,34,170,0.7)'];
    const pillarGlowColors = ['rgba(102,68,170,0.1)', 'rgba(85,51,187,0.1)', 'rgba(119,85,204,0.1)', 'rgba(68,34,170,0.1)'];
    for (let i = 0; i < 4; i++) {
      const px = 150 + i * 200;
      ctx.fillStyle = pillarColors[i]; ctx.fillRect(px, h * 0.15, 20, h * 0.55);
      ctx.fillStyle = pillarGlowColors[i]; ctx.beginPath(); ctx.arc(px + 10, h * 0.4, 40, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(136,102,221,0.1)';
    for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.arc(30 + i * 50, h * 0.7 + Math.sin(i * 1.5) * 15, 8 + Math.sin(i) * 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = 'rgba(68,51,102,0.8)';
    ctx.fillRect(w * 0.35, h * 0.1, w * 0.3, h * 0.08);
    ctx.fillRect(w * 0.35, h * 0.1, 15, h * 0.6);
    ctx.fillRect(w * 0.65 - 15, h * 0.1, 15, h * 0.6);
  },

  'archive-hall': (ctx, w, h) => {
    gradient(ctx, w, h, [20, 18, 35], [15, 14, 28]);
    for (let i = 0; i < 6; i++) {
      const sx = 50 + i * 160;
      ctx.fillStyle = 'rgba(51,34,68,0.8)'; ctx.fillRect(sx, h * 0.15, 120, h * 0.6);
      for (let j = 0; j < 4; j++) {
        ctx.fillStyle = `rgba(102,85,170,${0.4 + j * 0.1})`; ctx.fillRect(sx + 10, h * 0.2 + j * 80, 100, 10);
      }
    }
    ctx.fillStyle = '#221833'; ctx.fillRect(0, h * 0.8, w, h * 0.2);
    ctx.fillStyle = '#443366'; ctx.fillRect(w * 0.45, h * 0.6, w * 0.1, h * 0.2);
    ctx.fillStyle = '#554477'; ctx.fillRect(w * 0.43, h * 0.55, w * 0.14, h * 0.06);
    ctx.fillStyle = 'rgba(170,170,255,0.3)'; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.5, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(204,204,255,0.15)'; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.5, 40, 0, Math.PI * 2); ctx.fill();
  },
};

// ── Menu background ──

function generateMenuBg(ctx, w, h) {
  for (let y = 0; y < h; y++) {
    const t = y / h;
    ctx.fillStyle = `rgb(${Math.floor(10 + t * 20)},${Math.floor(15 + t * 40)},${Math.floor(40 + t * 80)})`;
    ctx.fillRect(0, y, w, 1);
  }
  ctx.fillStyle = 'rgba(238,238,221,0.8)'; ctx.beginPath(); ctx.arc(300, 120, 35, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(221,204,187,0.6)'; ctx.beginPath(); ctx.arc(720, 90, 25, 0, Math.PI * 2); ctx.fill();
}

// ── World map background (ocean only — islands drawn live for interactivity) ──

function generateWorldMapBg(ctx, w, h) {
  for (let y = 0; y < h; y++) {
    const t = y / h;
    ctx.fillStyle = `rgb(${Math.floor(15 + t * 10)},${Math.floor(40 + t * 30)},${Math.floor(90 + t * 60)})`;
    ctx.fillRect(0, y, w, 1);
  }
  ctx.strokeStyle = 'rgba(51,102,170,0.15)'; ctx.lineWidth = 1;
  for (let y = 50; y < h; y += 30) {
    ctx.beginPath();
    for (let x = 0; x < w; x += 5) {
      const wy = y + Math.sin((x + y * 3) * 0.02) * 8;
      if (x === 0) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
    }
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(238,238,221,0.4)'; ctx.beginPath(); ctx.arc(80, 50, 15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(221,204,187,0.3)'; ctx.beginPath(); ctx.arc(940, 40, 10, 0, Math.PI * 2); ctx.fill();
}

// ── Main ──

console.log('Generating background images...\n');

for (const [name, drawFn] of Object.entries(locations)) {
  const canvas = createCanvas(W, H_SCENE);
  const ctx = canvas.getContext('2d');
  drawFn(ctx, W, H_SCENE);
  save(canvas, name);
}

{
  const canvas = createCanvas(W, H_FULL);
  const ctx = canvas.getContext('2d');
  generateMenuBg(ctx, W, H_FULL);
  save(canvas, 'menu');
}

{
  const canvas = createCanvas(W, H_FULL);
  const ctx = canvas.getContext('2d');
  generateWorldMapBg(ctx, W, H_FULL);
  save(canvas, 'worldmap');
}

console.log('\nDone! All backgrounds saved to assets/backgrounds/');
