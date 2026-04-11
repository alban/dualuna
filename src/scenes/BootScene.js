import Phaser from 'phaser';
import { generatePlaceholderArt } from '../utils/artGenerator.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    // Show loading bar
    const { width, height } = this.scale;
    const barW = 400, barH = 30;
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

    const title = this.add.text(width / 2, barY - 40, 'Loading Dualuna...', {
      fontSize: '20px', fill: '#aaccff', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Generate all placeholder art as textures
    generatePlaceholderArt(this);
  }

  create() {
    this.scene.start('Menu');
  }
}
