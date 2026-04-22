import Phaser from 'phaser';
import { WORLD } from '../data/world.js';
import { BASE_W, BASE_H } from '../utils/layout.js';

export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldMap' });
  }

  create() {
    const { width, height } = this.scale;
    const sx = width / BASE_W, sy = height / BASE_H;
    const ss = Math.min(sx, sy);
    this._sx = sx; this._sy = sy; this._ss = ss;
    const state = this.registry.get('gameState');

    // Plain ocean background — deep navy, no image
    const bg = this.add.graphics();
    bg.fillStyle(0x06111e, 1);
    bg.fillRect(0, 0, width, height);

    // Subtle ocean depth bands
    for (let i = 0; i < 6; i++) {
      bg.fillStyle(0x07161f + i * 0x010101, 0.4);
      bg.fillRect(0, Math.round((height / 6) * i), width, Math.round(height / 6));
    }

    // Draw islands
    const islandGfx = this.make.graphics({ x: 0, y: 0, add: false });
    for (const [id, island] of Object.entries(WORLD.islands)) {
      const discovered = state.discoveredIslands.includes(id);
      const isCurrent = state.currentIsland === id;
      this.drawIsland(islandGfx, island, discovered, isCurrent);
    }
    const texKey = 'worldmap-islands';
    if (this.textures.exists(texKey)) this.textures.remove(texKey);
    islandGfx.generateTexture(texKey, width, height);
    islandGfx.destroy();
    this.add.image(0, 0, texKey).setOrigin(0, 0);

    // Title
    this.add.text(width / 2, Math.round(30 * sy), 'The Islands of Dualuna', {
      fontSize: `${Math.round(26 * sy)}px`, fill: '#88bbdd', fontFamily: 'Georgia, serif',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);

    // Add interactive labels and hit zones (these need to stay as live objects)
    for (const [id, island] of Object.entries(WORLD.islands)) {
      const discovered = state.discoveredIslands.includes(id);
      const isCurrent = state.currentIsland === id;
      const ix = Math.round(island.mapX * sx), iy = Math.round(island.mapY * sy);
      const isize = Math.round(island.size * ss);

      if (discovered) {
        // Island name label
        const label = this.add.text(ix, iy + isize + Math.round(18 * sy), island.name, {
          fontSize: `${Math.round(16 * sy)}px`,
          fill: isCurrent ? '#ffffff' : '#aaccee',
          fontFamily: 'Georgia, serif',
          fontStyle: isCurrent ? 'bold' : 'normal',
          stroke: '#000000', strokeThickness: 3,
          backgroundColor: '#00000066', padding: { x: 6, y: 3 },
        }).setOrigin(0.5);

        // Make clickable
        const hitArea = this.add.zone(ix, iy, isize * 2.5, isize * 2.5)
          .setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => label.setStyle({ fill: '#ffffff' }));
        hitArea.on('pointerout', () => label.setStyle({ fill: isCurrent ? '#ffffff' : '#88aacc' }));
        hitArea.on('pointerdown', () => {
          this.travelToIsland(id, island);
        });
      }
    }

    // Bottom bar
    const barH = Math.round(50 * sy);
    const barGfx = this.add.graphics();
    barGfx.fillStyle(0x000000, 0.7);
    barGfx.fillRect(0, height - barH, width, barH);

    // Current location info
    const currentIsland = WORLD.islands[state.currentIsland];
    this.add.text(width / 2, height - barH / 2, `${currentIsland.name}`, {
      fontSize: `${Math.round(17 * sy)}px`, fill: '#aaddcc', fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Back button
    const backBtn = this.add.text(Math.round(16 * sx), height - barH / 2, '← Back', {
      fontSize: `${Math.round(17 * sy)}px`, fill: '#88aacc', fontFamily: 'Georgia, serif',
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerover', () => backBtn.setStyle({ fill: '#ffffff' }));
    backBtn.on('pointerout', () => backBtn.setStyle({ fill: '#88aacc' }));
    backBtn.on('pointerdown', () => {
      this.scene.start('Location', { locationId: state.currentLocation });
    });

    // Verdium display
    this.add.text(width - Math.round(16 * sx), height - barH / 2, `◆ ${state.verdium}`, {
      fontSize: `${Math.round(17 * sy)}px`, fill: '#44cc88', fontFamily: 'Georgia, serif',
    }).setOrigin(1, 0.5);
  }

  drawIsland(gfx, island, discovered, isCurrent) {
    const sx = this._sx, sy = this._sy, ss = this._ss;
    const x = Math.round(island.mapX * sx), y = Math.round(island.mapY * sy);
    const size = Math.round(island.size * ss);
    const { color } = island;

    if (!discovered) {
      // Fog of war — just a faint shape
      gfx.fillStyle(0x334455, 0.3);
      gfx.fillEllipse(x, y, size * 2, size * 1.4);
      return;
    }

    // Island shadow
    gfx.fillStyle(0x113322, 0.4);
    gfx.fillEllipse(x + 3, y + 5, size * 2.2, size * 1.5);

    // Island base (beach)
    gfx.fillStyle(0xccbb88, 1);
    gfx.fillEllipse(x, y, size * 2.1, size * 1.5);

    // Island main
    gfx.fillStyle(color, 1);
    gfx.fillEllipse(x, y - 3, size * 1.8, size * 1.3);

    // Current island glow
    if (isCurrent) {
      gfx.lineStyle(2, 0x44ffaa, 0.7);
      gfx.strokeEllipse(x, y, size * 2.6, size * 1.8);
    }
  }

  travelToIsland(islandId, island) {
    const state = this.registry.get('gameState');
    if (islandId === state.currentIsland) {
      this.scene.start('Location', { locationId: island.defaultLocation });
      return;
    }

    // DOM overlay — bypasses 1 FPS Phaser render, appears instantly
    const el = document.createElement('div');
    el.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(3,10,18,0.92)',
      'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
      'z-index:9999', 'font-family:Georgia,serif',
    ].join(';');
    el.innerHTML = `<div style="font-size:3.5rem">⛵</div>
      <div style="color:#88ccdd;font-size:1.2rem;margin-top:0.8rem;text-shadow:0 1px 4px #000">${island.name}</div>`;
    document.body.appendChild(el);

    setTimeout(() => {
      // Swap boat content for solid black — keep overlay until new scene renders
      el.innerHTML = '';
      el.style.background = '#06111e';

      state.currentIsland = islandId;
      state.currentLocation = island.defaultLocation;
      if (!state.visitedLocations.includes(island.defaultLocation)) {
        state.visitedLocations.push(island.defaultLocation);
      }
      this.registry.set('gameState', state);
      this.scene.start('Location', { locationId: island.defaultLocation });

      // Remove overlay after Phaser renders the new scene
      this.sys.game.events.once('postrender', () => {
        if (document.body.contains(el)) document.body.removeChild(el);
      });
    }, 600);
  }
}
