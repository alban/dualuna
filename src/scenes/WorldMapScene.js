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

    // Pre-rendered ocean background
    this.add.image(0, 0, 'bg-worldmap').setOrigin(0, 0).setDisplaySize(width, height);

    // Draw island shapes (lightweight — just a few ellipses)
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
      fontSize: `${Math.round(28 * sy)}px`, fill: '#88bbdd', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Add interactive labels and hit zones (these need to stay as live objects)
    for (const [id, island] of Object.entries(WORLD.islands)) {
      const discovered = state.discoveredIslands.includes(id);
      const isCurrent = state.currentIsland === id;
      const ix = Math.round(island.mapX * sx), iy = Math.round(island.mapY * sy);
      const isize = Math.round(island.size * ss);

      if (discovered) {
        // Island name label
        const label = this.add.text(ix, iy + isize + 15, island.name, {
          fontSize: `${Math.round(14 * sy)}px`,
          fill: isCurrent ? '#ffffff' : '#88aacc',
          fontFamily: 'Georgia, serif',
          fontStyle: isCurrent ? 'bold' : 'normal',
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

    // Current location info
    const currentIsland = WORLD.islands[state.currentIsland];
    this.add.text(width / 2, height - Math.round(60 * sy), `Current: ${currentIsland.name}`, {
      fontSize: `${Math.round(18 * sy)}px`, fill: '#aaddcc', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Back button
    const backBtn = this.add.text(Math.round(60 * sx), height - Math.round(30 * sy), '← Back', {
      fontSize: `${Math.round(16 * sy)}px`, fill: '#88aacc', fontFamily: 'Georgia, serif',
    }).setInteractive({ useHandCursor: true });
    backBtn.on('pointerover', () => backBtn.setStyle({ fill: '#ffffff' }));
    backBtn.on('pointerout', () => backBtn.setStyle({ fill: '#88aacc' }));
    backBtn.on('pointerdown', () => {
      this.scene.start('Location', { locationId: state.currentLocation });
    });

    // Verdium display
    this.add.text(width - 20, height - Math.round(30 * sy), `◆ Verdium: ${state.verdium}`, {
      fontSize: `${Math.round(14 * sy)}px`, fill: '#44cc88', fontFamily: 'Georgia, serif',
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
      // Already here, go to the island's default location
      this.scene.start('Location', { locationId: island.defaultLocation });
      return;
    }

    // Travel animation
    const { width, height } = this.scale;
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, width, height);

    const travelText = this.add.text(width / 2, height / 2, `Sailing to ${island.name}...`, {
      fontSize: '22px', fill: '#88ccdd', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: travelText,
      alpha: 1,
      duration: 500,
      yoyo: true,
      hold: 1000,
      onComplete: () => {
        state.currentIsland = islandId;
        state.currentLocation = island.defaultLocation;
        if (!state.visitedLocations.includes(island.defaultLocation)) {
          state.visitedLocations.push(island.defaultLocation);
        }
        this.registry.set('gameState', state);
        this.scene.start('Location', { locationId: island.defaultLocation });
      }
    });
  }
}
