// Helper: draw cliff rocks
function drawCliffs(gfx, width, height) {
  // Cliff face on the right
  gfx.fillStyle(0x665544, 1);
  gfx.fillRect(width * 0.7, 0, width * 0.3, height);
  // Rock texture lines
  gfx.lineStyle(1, 0x554433, 0.4);
  for (let y = 20; y < height; y += 25) {
    gfx.lineBetween(width * 0.7, y, width, y + 10);
  }
  // Verdium veins (green glints in the rock)
  gfx.fillStyle(0x44cc88, 0.3);
  for (let i = 0; i < 8; i++) {
    const vx = width * 0.72 + Math.sin(i * 2.1) * 60;
    const vy = 50 + i * 70;
    gfx.fillRect(vx, vy, 30 + Math.sin(i) * 15, 3);
  }
}

// Helper: draw ocean
function drawOcean(gfx, width, startY, height) {
  for (let y = startY; y < startY + height; y++) {
    const t = (y - startY) / height;
    const r = Math.floor(15 + t * 10);
    const g = Math.floor(40 + t * 20);
    const b = Math.floor(100 + t * 40);
    gfx.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
    gfx.fillRect(0, y, width, 1);
  }
  // Wave highlights
  gfx.lineStyle(1, 0x6699bb, 0.2);
  for (let wy = startY + 10; wy < startY + height; wy += 15) {
    gfx.beginPath();
    for (let x = 0; x < width; x += 4) {
      const yy = wy + Math.sin(x * 0.03 + wy * 0.1) * 3;
      if (x === 0) gfx.moveTo(x, yy); else gfx.lineTo(x, yy);
    }
    gfx.strokePath();
  }
}

// Helper: draw trees
function drawTrees(gfx, baseX, baseY, count) {
  for (let i = 0; i < count; i++) {
    const tx = baseX + i * 50 + Math.sin(i * 3) * 20;
    const ty = baseY + Math.sin(i * 2) * 15;
    // Trunk
    gfx.fillStyle(0x664422, 1);
    gfx.fillRect(tx - 3, ty, 6, 30);
    // Canopy
    gfx.fillStyle(0x338833, 0.9);
    gfx.fillTriangle(tx, ty - 25, tx - 18, ty + 5, tx + 18, ty + 5);
    gfx.fillStyle(0x44aa44, 0.7);
    gfx.fillTriangle(tx, ty - 35, tx - 14, ty - 5, tx + 14, ty - 5);
  }
}

// We need Phaser for color utility — import will be available in the scene context
import Phaser from 'phaser';

export const LOCATIONS = {
  // ============== CLIFF HAVEN ==============
  'mine-entrance': {
    name: 'Verdium Mine Entrance',
    island: 'Cliff Haven',
    description: 'The main entrance to the cliff-face Verdium mines',
    palette: { top: [60, 70, 90], bottom: [40, 45, 50] },
    introDialogue: 'intro-mine',
    drawFunc: (gfx, scene, w, h) => {
      // Ground
      gfx.fillStyle(0x554a3a, 1);
      gfx.fillRect(0, h * 0.7, w, h * 0.3);
      // Mine entrance (dark opening in cliff)
      drawCliffs(gfx, w, h);
      gfx.fillStyle(0x111111, 1);
      gfx.fillRoundedRect(w * 0.73, h * 0.35, 80, 120, 8);
      // Support beams
      gfx.fillStyle(0x885533, 1);
      gfx.fillRect(w * 0.73, h * 0.33, 6, 125);
      gfx.fillRect(w * 0.73 + 76, h * 0.33, 6, 125);
      gfx.fillRect(w * 0.73, h * 0.33, 82, 6);
      // Path to village
      gfx.fillStyle(0x665544, 0.5);
      gfx.fillRect(0, h * 0.75, w * 0.5, 30);
      // Ocean in the distance (left side)
      drawOcean(gfx, w * 0.5, h * 0.5, h * 0.2);
      // Some crates and equipment
      gfx.fillStyle(0x886633, 1);
      gfx.fillRect(w * 0.55, h * 0.65, 25, 20);
      gfx.fillRect(w * 0.60, h * 0.63, 20, 22);
    },
    connections: ['mine-shaft', 'tidewatcher-village', 'cliff-overlook'],
    hotspots: [
      {
        id: 'kael', x: 550, y: 400, width: 60, height: 80,
        label: 'Foreman Kael', action: 'dialogue', character: 'foreman-kael',
        dialogueId: 'foreman-kael-default',
      },
      {
        id: 'dera', x: 400, y: 420, width: 60, height: 80,
        label: 'Dera', action: 'dialogue', character: 'dera',
        dialogueId: 'dera-default',
      },
      {
        id: 'mine-entry', x: 790, y: 320, width: 60, height: 100,
        label: 'Enter the mine', action: 'travel', target: 'mine-shaft',
      },
      {
        id: 'verdium-crate', x: 590, y: 440, width: 40, height: 30,
        label: 'Verdium crate', action: 'examine', dialogueId: 'examine-verdium-crate',
      },
    ],
  },

  'mine-shaft': {
    name: 'Lower Mine Shaft',
    island: 'Cliff Haven',
    description: 'Deep inside the cliff — the Verdium extraction tunnels',
    palette: { top: [25, 22, 20], bottom: [15, 12, 10] },
    drawFunc: (gfx, scene, w, h) => {
      // Tunnel walls
      gfx.fillStyle(0x332b22, 1);
      gfx.fillRect(0, 0, w * 0.15, h);
      gfx.fillRect(w * 0.85, 0, w * 0.15, h);
      // Floor
      gfx.fillStyle(0x2a2520, 1);
      gfx.fillRect(0, h * 0.8, w, h * 0.2);
      // Verdium veins (more prominent here)
      gfx.fillStyle(0x44cc88, 0.5);
      for (let i = 0; i < 12; i++) {
        const vx = w * 0.15 + Math.sin(i * 1.7) * (w * 0.3);
        const vy = 40 + i * 45;
        gfx.fillRect(vx, vy, 45 + Math.sin(i * 0.9) * 20, 4);
        gfx.fillStyle(0x33aa66, 0.3);
        gfx.fillCircle(vx + 20, vy, 8);
        gfx.fillStyle(0x44cc88, 0.5);
      }
      // Support beams
      for (let i = 0; i < 4; i++) {
        const bx = w * 0.25 + i * (w * 0.15);
        gfx.fillStyle(0x664422, 0.8);
        gfx.fillRect(bx, h * 0.1, 8, h * 0.7);
      }
      // Cracks and damage
      gfx.lineStyle(2, 0x111111, 0.6);
      gfx.lineBetween(w * 0.3, h * 0.2, w * 0.4, h * 0.35);
      gfx.lineBetween(w * 0.4, h * 0.35, w * 0.35, h * 0.5);
      gfx.lineBetween(w * 0.6, h * 0.3, w * 0.7, h * 0.45);
      // Puddle of water (mysterious)
      gfx.fillStyle(0x224466, 0.4);
      gfx.fillEllipse(w * 0.5, h * 0.75, 120, 20);
      // Dim lantern light
      gfx.fillStyle(0xffaa44, 0.08);
      gfx.fillCircle(w * 0.5, h * 0.4, 150);
    },
    connections: ['mine-entrance'],
    hotspots: [
      {
        id: 'cracks', x: 370, y: 220, width: 80, height: 100,
        label: 'Examine the cracks', action: 'examine', dialogueId: 'examine-cracks',
      },
      {
        id: 'water-puddle', x: 512, y: 480, width: 120, height: 40,
        label: 'Strange water', action: 'examine', dialogueId: 'examine-water',
      },
      {
        id: 'verdium-vein', x: 250, y: 200, width: 60, height: 40,
        label: 'Glowing Verdium vein', action: 'examine', dialogueId: 'examine-vein',
      },
    ],
  },

  'tidewatcher-village': {
    name: 'Tidewatcher Village',
    island: 'Cliff Haven',
    description: 'A cozy village perched between cliff tops and the sea',
    palette: { top: [50, 70, 110], bottom: [40, 55, 65] },
    drawFunc: (gfx, scene, w, h) => {
      // Sky with clouds
      gfx.fillStyle(0xccddee, 0.1);
      gfx.fillEllipse(200, 80, 120, 30);
      gfx.fillEllipse(600, 60, 100, 25);
      // Ground (cliff top)
      gfx.fillStyle(0x667755, 1);
      gfx.fillRect(0, h * 0.6, w, h * 0.4);
      // Simple houses
      const houseColors = [0x885544, 0x776644, 0x887766, 0x665544];
      for (let i = 0; i < 4; i++) {
        const hx = 120 + i * 180;
        const hy = h * 0.45;
        gfx.fillStyle(houseColors[i], 1);
        gfx.fillRect(hx, hy, 60, 50);
        gfx.fillStyle(0x664433, 1);
        gfx.fillTriangle(hx - 5, hy, hx + 30, hy - 30, hx + 65, hy);
        // Window
        gfx.fillStyle(0xffcc66, 0.6);
        gfx.fillRect(hx + 20, hy + 15, 15, 15);
      }
      // Distant ocean
      drawOcean(gfx, w, h * 0.85, h * 0.15);
      // Garden plots
      gfx.fillStyle(0x556633, 1);
      gfx.fillRect(100, h * 0.65, 80, 40);
      gfx.fillRect(400, h * 0.68, 60, 35);
    },
    connections: ['mine-entrance', 'cliff-overlook'],
    hotspots: [
      {
        id: 'brin', x: 300, y: 360, width: 60, height: 80,
        label: 'Elder Brin', action: 'dialogue', character: 'village-elder-brin',
        dialogueId: 'brin-default',
      },
      {
        id: 'harbor', x: 800, y: 500, width: 100, height: 60,
        label: 'Harbor (travel to other islands)', action: 'examine',
        dialogueId: 'harbor-travel',
      },
    ],
  },

  'cliff-overlook': {
    name: 'Cliff Overlook',
    island: 'Cliff Haven',
    description: 'A breathtaking view of the ocean and distant islands',
    palette: { top: [40, 60, 120], bottom: [30, 55, 90] },
    drawFunc: (gfx, scene, w, h) => {
      // Ocean panorama
      drawOcean(gfx, w, h * 0.4, h * 0.6);
      // Cliff edge in foreground
      gfx.fillStyle(0x556644, 1);
      gfx.fillRect(0, h * 0.85, w, h * 0.15);
      gfx.fillStyle(0x665544, 1);
      gfx.fillRect(0, h * 0.87, w, h * 0.13);
      // Distant island silhouettes
      gfx.fillStyle(0x334433, 0.4);
      gfx.fillEllipse(250, h * 0.5, 80, 25);
      gfx.fillStyle(0x443355, 0.3);
      gfx.fillEllipse(650, h * 0.45, 60, 18);
      gfx.fillStyle(0x445533, 0.35);
      gfx.fillEllipse(800, h * 0.52, 50, 15);
      // Two moons (if evening/night)
      gfx.fillStyle(0xeeeedd, 0.3);
      gfx.fillCircle(180, 80, 25);
      gfx.fillStyle(0xddccbb, 0.2);
      gfx.fillCircle(750, 60, 18);
    },
    connections: ['tidewatcher-village', 'mine-entrance'],
    hotspots: [
      {
        id: 'telescope', x: 512, y: 520, width: 50, height: 60,
        label: 'Look through the telescope', action: 'examine',
        dialogueId: 'examine-telescope',
      },
    ],
  },

  // ============== GREEN ROOT ==============
  'forest-path': {
    name: 'Forest Path',
    island: 'Green Root',
    description: 'A winding path through ancient, Verdium-nourished forests',
    palette: { top: [20, 50, 25], bottom: [15, 35, 18] },
    drawFunc: (gfx, scene, w, h) => {
      // Dense forest canopy at top
      gfx.fillStyle(0x225522, 0.8);
      gfx.fillRect(0, 0, w, h * 0.3);
      // Forest floor
      gfx.fillStyle(0x2a3a1a, 1);
      gfx.fillRect(0, h * 0.7, w, h * 0.3);
      // Path
      gfx.fillStyle(0x554433, 0.6);
      gfx.beginPath();
      gfx.moveTo(0, h * 0.8);
      gfx.lineTo(w * 0.3, h * 0.75);
      gfx.lineTo(w * 0.6, h * 0.78);
      gfx.lineTo(w, h * 0.73);
      gfx.lineTo(w, h * 0.85);
      gfx.lineTo(w * 0.6, h * 0.88);
      gfx.lineTo(w * 0.3, h * 0.85);
      gfx.lineTo(0, h * 0.9);
      gfx.closePath();
      gfx.fillPath();
      // Trees
      drawTrees(gfx, 30, h * 0.35, 6);
      drawTrees(gfx, 500, h * 0.3, 5);
      // Moss and ferns
      gfx.fillStyle(0x44aa33, 0.3);
      for (let i = 0; i < 10; i++) {
        gfx.fillCircle(80 + i * 90, h * 0.72 + Math.sin(i) * 10, 15);
      }
    },
    connections: ['elder-grove'],
    hotspots: [
      {
        id: 'roothold', x: 700, y: 400, width: 60, height: 80,
        label: 'Roothold the Warden', action: 'dialogue', character: 'korrim-guard',
        dialogueId: 'roothold-default',
      },
      {
        id: 'flora', x: 200, y: 440, width: 80, height: 50,
        label: 'Examine the flora', action: 'examine',
        dialogueId: 'examine-flora',
      },
    ],
  },

  'elder-grove': {
    name: 'Elder Grove',
    island: 'Green Root',
    description: 'Sacred gathering place of the Korrim elders, under the Great Root Tree',
    palette: { top: [15, 40, 20], bottom: [10, 30, 15] },
    drawFunc: (gfx, scene, w, h) => {
      // Great Tree (massive trunk in center)
      gfx.fillStyle(0x443322, 1);
      gfx.fillRect(w * 0.4, 0, w * 0.2, h);
      // Bark texture
      gfx.lineStyle(1, 0x332211, 0.5);
      for (let y = 0; y < h; y += 15) {
        gfx.lineBetween(w * 0.4, y, w * 0.6, y + 5);
      }
      // Canopy (top)
      gfx.fillStyle(0x336633, 0.9);
      gfx.fillCircle(w * 0.5, -50, 300);
      // Roots spreading
      gfx.fillStyle(0x443322, 0.8);
      for (let i = 0; i < 5; i++) {
        const rx = w * 0.35 + i * (w * 0.07);
        gfx.fillRect(rx, h * 0.7, 15, h * 0.3);
      }
      // Mossy ground
      gfx.fillStyle(0x334422, 1);
      gfx.fillRect(0, h * 0.75, w, h * 0.25);
      // Glowing moss
      gfx.fillStyle(0x66dd66, 0.15);
      for (let i = 0; i < 15; i++) {
        gfx.fillCircle(50 + i * 65, h * 0.78 + Math.sin(i) * 8, 20);
      }
    },
    connections: ['forest-path'],
    hotspots: [
      {
        id: 'mossa', x: 350, y: 400, width: 60, height: 80,
        label: 'Elder Mossa', action: 'dialogue', character: 'elder-mossa',
        dialogueId: 'elder-mossa-default',
      },
      {
        id: 'great-root', x: 512, y: 300, width: 100, height: 100,
        label: 'The Great Root Tree', action: 'examine',
        dialogueId: 'examine-great-root',
      },
    ],
  },

  // ============== SPARK COVE ==============
  'harbor-workshop': {
    name: 'Harbor Workshop',
    island: 'Spark Cove',
    description: 'A bustling harbor filled with Velessi inventions and half-finished projects',
    palette: { top: [50, 60, 80], bottom: [45, 50, 55] },
    drawFunc: (gfx, scene, w, h) => {
      // Harbor water
      drawOcean(gfx, w, h * 0.6, h * 0.4);
      // Dock platform
      gfx.fillStyle(0x886633, 1);
      gfx.fillRect(0, h * 0.55, w, h * 0.08);
      // Workshop buildings (quirky, various sizes)
      gfx.fillStyle(0x887755, 1);
      gfx.fillRect(50, h * 0.2, 120, h * 0.35);
      gfx.fillStyle(0x776644, 1);
      gfx.fillRect(200, h * 0.3, 80, h * 0.25);
      gfx.fillStyle(0x998866, 1);
      gfx.fillRect(320, h * 0.15, 150, h * 0.4);
      // Chimneys with smoke
      gfx.fillStyle(0x554433, 1);
      gfx.fillRect(90, h * 0.12, 15, h * 0.08);
      gfx.fillRect(380, h * 0.07, 12, h * 0.08);
      gfx.fillStyle(0xaaaaaa, 0.15);
      gfx.fillCircle(95, h * 0.08, 20);
      gfx.fillCircle(386, h * 0.03, 15);
      // Gears and machinery (decorative)
      gfx.lineStyle(2, 0xaaaa66, 0.4);
      gfx.strokeCircle(550, h * 0.4, 30);
      gfx.strokeCircle(570, h * 0.35, 20);
      // Crates and parts
      gfx.fillStyle(0x886633, 0.8);
      for (let i = 0; i < 5; i++) {
        gfx.fillRect(500 + i * 40, h * 0.5, 25, 20);
      }
    },
    connections: ['inventors-lab'],
    hotspots: [
      {
        id: 'tink', x: 350, y: 350, width: 60, height: 80,
        label: 'Tink the Inventor', action: 'dialogue', character: 'tink',
        dialogueId: 'tink-default',
      },
      {
        id: 'machinery', x: 560, y: 260, width: 80, height: 60,
        label: 'Examine machinery', action: 'examine',
        dialogueId: 'examine-machinery',
      },
    ],
  },

  'inventors-lab': {
    name: 'Tink\'s Laboratory',
    island: 'Spark Cove',
    description: 'A chaotic but brilliant workshop filled with prototypes and blueprints',
    palette: { top: [35, 30, 25], bottom: [30, 28, 22] },
    drawFunc: (gfx, scene, w, h) => {
      // Workbenches
      gfx.fillStyle(0x665533, 1);
      gfx.fillRect(50, h * 0.5, w * 0.4, 15);
      gfx.fillRect(w * 0.55, h * 0.45, w * 0.4, 15);
      // Table legs
      gfx.fillRect(60, h * 0.5, 8, h * 0.3);
      gfx.fillRect(w * 0.4, h * 0.5, 8, h * 0.3);
      gfx.fillRect(w * 0.56, h * 0.45, 8, h * 0.35);
      gfx.fillRect(w * 0.93, h * 0.45, 8, h * 0.35);
      // Floor
      gfx.fillStyle(0x3a3530, 1);
      gfx.fillRect(0, h * 0.8, w, h * 0.2);
      // Blueprints on wall
      gfx.fillStyle(0x4466aa, 0.3);
      gfx.fillRect(100, h * 0.1, 80, 60);
      gfx.fillRect(250, h * 0.15, 60, 50);
      // Various gadgets on tables
      gfx.fillStyle(0xaaaa44, 0.6);
      gfx.fillCircle(200, h * 0.47, 12);
      gfx.fillStyle(0xcc8833, 0.7);
      gfx.fillRect(300, h * 0.46, 30, 15);
      gfx.fillStyle(0x88cccc, 0.5);
      gfx.fillRect(w * 0.65, h * 0.42, 25, 12);
      // Hanging lamp
      gfx.fillStyle(0xffcc44, 0.15);
      gfx.fillCircle(w * 0.5, h * 0.2, 80);
      gfx.fillStyle(0xffaa33, 0.6);
      gfx.fillCircle(w * 0.5, h * 0.08, 10);
    },
    connections: ['harbor-workshop'],
    hotspots: [
      {
        id: 'blueprints', x: 140, y: 120, width: 80, height: 60,
        label: 'Examine blueprints', action: 'examine',
        dialogueId: 'examine-blueprints',
      },
      {
        id: 'prototype', x: 680, y: 290, width: 60, height: 40,
        label: 'Strange prototype', action: 'examine',
        dialogueId: 'examine-prototype',
        requireFlag: 'talked-to-tink',
      },
    ],
  },

  // ============== LUMINARA ==============
  'crystal-plaza': {
    name: 'Crystal Plaza',
    island: 'Luminara',
    description: 'The luminous heart of Luminari culture, aglow with bioluminescent patterns',
    palette: { top: [25, 20, 50], bottom: [20, 18, 40] },
    drawFunc: (gfx, scene, w, h) => {
      // Crystalline floor
      gfx.fillStyle(0x332255, 1);
      gfx.fillRect(0, h * 0.65, w, h * 0.35);
      // Crystal pillars
      const pillarColors = [0x6644aa, 0x5533bb, 0x7755cc, 0x4422aa];
      for (let i = 0; i < 4; i++) {
        const px = 150 + i * 200;
        gfx.fillStyle(pillarColors[i], 0.7);
        gfx.fillRect(px, h * 0.15, 20, h * 0.55);
        // Crystal glow
        gfx.fillStyle(pillarColors[i], 0.1);
        gfx.fillCircle(px + 10, h * 0.4, 40);
      }
      // Bioluminescent patterns on the ground
      gfx.fillStyle(0x8866dd, 0.1);
      for (let i = 0; i < 20; i++) {
        const gx = 30 + i * 50;
        const gy = h * 0.7 + Math.sin(i * 1.5) * 15;
        gfx.fillCircle(gx, gy, 8 + Math.sin(i) * 4);
      }
      // Archway in the back
      gfx.fillStyle(0x443366, 0.8);
      gfx.fillRect(w * 0.35, h * 0.1, w * 0.3, h * 0.08);
      gfx.fillRect(w * 0.35, h * 0.1, 15, h * 0.6);
      gfx.fillRect(w * 0.65 - 15, h * 0.1, 15, h * 0.6);
    },
    connections: ['archive-hall'],
    hotspots: [
      {
        id: 'elyn', x: 500, y: 400, width: 60, height: 80,
        label: 'Scholar Elyn', action: 'dialogue', character: 'scholar-elyn',
        dialogueId: 'scholar-elyn-default',
      },
      {
        id: 'mural', x: 180, y: 250, width: 80, height: 100,
        label: 'Ancient mural', action: 'examine',
        dialogueId: 'examine-mural',
      },
    ],
  },

  'archive-hall': {
    name: 'Archive Hall',
    island: 'Luminara',
    description: 'Rows of crystal tablets containing the collected knowledge of Dualuna',
    palette: { top: [20, 18, 35], bottom: [15, 14, 28] },
    drawFunc: (gfx, scene, w, h) => {
      // Shelves/alcoves
      for (let i = 0; i < 6; i++) {
        const sx = 50 + i * 160;
        gfx.fillStyle(0x332244, 0.8);
        gfx.fillRect(sx, h * 0.15, 120, h * 0.6);
        // Crystal tablets
        for (let j = 0; j < 4; j++) {
          gfx.fillStyle(0x6655aa, 0.4 + j * 0.1);
          gfx.fillRect(sx + 10, h * 0.2 + j * 80, 100, 10);
        }
      }
      // Floor
      gfx.fillStyle(0x221833, 1);
      gfx.fillRect(0, h * 0.8, w, h * 0.2);
      // Central reading pedestal
      gfx.fillStyle(0x443366, 1);
      gfx.fillRect(w * 0.45, h * 0.6, w * 0.1, h * 0.2);
      gfx.fillStyle(0x554477, 1);
      gfx.fillRect(w * 0.43, h * 0.55, w * 0.14, h * 0.06);
      // Glowing crystal on pedestal
      gfx.fillStyle(0xaaaaff, 0.3);
      gfx.fillCircle(w * 0.5, h * 0.5, 15);
      gfx.fillStyle(0xccccff, 0.15);
      gfx.fillCircle(w * 0.5, h * 0.5, 40);
    },
    connections: ['crystal-plaza'],
    hotspots: [
      {
        id: 'geology-section', x: 210, y: 300, width: 100, height: 120,
        label: 'Geology archives', action: 'examine',
        dialogueId: 'examine-geology-archives',
      },
      {
        id: 'ancient-section', x: 530, y: 300, width: 100, height: 120,
        label: 'Ancient records', action: 'examine',
        dialogueId: 'examine-ancient-records',
      },
      {
        id: 'pedestal', x: 512, y: 380, width: 60, height: 60,
        label: 'Reading pedestal', action: 'examine',
        dialogueId: 'examine-pedestal',
      },
    ],
  },
};
