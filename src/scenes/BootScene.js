import Phaser from 'phaser';
import { LOCATIONS } from '../data/locations.js';
import { CHARACTERS } from '../data/characters.js';
import { I18n } from '../systems/I18n.js';
import { BASE_W, BASE_H } from '../utils/layout.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    const { width, height } = this.scale;
    const sx = width / BASE_W, sy = height / BASE_H;
    const barW = Math.round(400 * sx), barH = Math.round(30 * sy);
    const barX = (width - barW) / 2;
    const barY = height / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x222244, 1);
    bg.fillRect(barX, barY, barW, barH);

    const fill = this.add.graphics();
    this.load.on('progress', (val) => {
      fill.clear();
      fill.fillStyle(0x44cc88, 1);
      fill.fillRect(barX + 2, barY + 2, (barW - 4) * val, barH - 4);
    });

    this.add.text(width / 2, barY - 40, 'Loading Dualuna...', {
      fontSize: '20px', fill: '#aaccff', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Load all pre-rendered background images
    this.load.image('bg-menu', 'assets/backgrounds/menu.png');
    this.load.image('bg-worldmap', 'assets/backgrounds/worldmap.png');
    for (const id of Object.keys(LOCATIONS)) {
      this.load.image(`bg-${id}`, `assets/backgrounds/${id}.png`);
    }

    // Load character portraits (silently skip if not yet generated)
    for (const id of Object.keys(CHARACTERS)) {
      this.load.image(`portrait-${id}`, `assets/portraits/${id}.png`);
    }
  }

  async create() {
    // Pre-load saved language so I18n is ready for all scenes
    const savedLang = I18n.getSavedLanguage();
    await I18n.load(savedLang);
    this.scene.start('Language');
  }
}
