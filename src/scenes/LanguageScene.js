import Phaser from 'phaser';
import { I18n } from '../systems/I18n.js';

// Languages with completed translations
const TRANSLATED_LANGUAGES = ['en', 'fr'];

export class LanguageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Language' });
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add.image(0, 0, 'bg-menu').setOrigin(0, 0);

    // Title
    this.add.text(width / 2, 30, 'DUALUNA', {
      fontSize: '36px', fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#224466', strokeThickness: 3,
    }).setOrigin(0.5);

    // Language grid — 2 columns, large touch targets
    const langs = Object.entries(I18n.SUPPORTED_LANGUAGES);
    const cols = 2;
    const rows = Math.ceil(langs.length / cols);
    const colW = (width - 60) / cols;
    const startY = 85;
    const availH = height - startY - 50;
    const rowH = Math.floor(availH / rows);

    langs.forEach(([code, name], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 30 + col * colW + colW / 2;
      const y = startY + row * rowH + rowH / 2;
      const isTranslated = TRANSLATED_LANGUAGES.includes(code);

      // Touch zone
      const zone = this.add.rectangle(x, y, colW - 10, rowH - 6, 0x000000, 0)
        .setStrokeStyle(1, 0x334455, 0.2);

      const btn = this.add.text(x, y, name, {
        fontSize: '26px',
        fill: isTranslated ? '#88aacc' : '#556677',
        fontFamily: 'Georgia, serif',
      }).setOrigin(0.5);

      if (isTranslated) {
        zone.setInteractive({ useHandCursor: true });
        zone.on('pointerover', () => {
          btn.setStyle({ fill: '#ffffff' });
          zone.setStrokeStyle(1, 0x88ccdd, 0.6);
        });
        zone.on('pointerout', () => {
          btn.setStyle({ fill: '#88aacc' });
          zone.setStrokeStyle(1, 0x334455, 0.2);
        });
        zone.on('pointerdown', () => this.selectLanguage(code));
      } else {
        const lineW = btn.width * 0.55;
        const gfx = this.add.graphics();
        gfx.lineStyle(1, 0x556677, 0.8);
        gfx.lineBetween(x - lineW, y + 1, x + lineW, y + 1);
      }
    });

    // Fullscreen button — bottom left, large
    const fsBtn = this.add.text(15, height - 55, '⛶', {
      fontSize: '40px', fill: '#88aacc', fontFamily: 'Georgia, serif',
      backgroundColor: '#1a2a3a', padding: { x: 12, y: 6 },
    }).setInteractive({ useHandCursor: true });
    fsBtn.on('pointerover', () => fsBtn.setStyle({ fill: '#ffffff' }));
    fsBtn.on('pointerout', () => fsBtn.setStyle({ fill: '#88aacc' }));
    fsBtn.on('pointerdown', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    });

    // GitHub source link — bottom right
    const ghLink = this.add.text(width - 10, height - 20, 'github.com/alban/dualuna', {
      fontSize: '11px', fill: '#445566', fontFamily: 'Georgia, serif',
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    ghLink.on('pointerover', () => ghLink.setStyle({ fill: '#88aacc' }));
    ghLink.on('pointerout', () => ghLink.setStyle({ fill: '#445566' }));
    ghLink.on('pointerdown', () => {
      window.open('https://github.com/alban/dualuna', '_blank');
    });
  }

  async selectLanguage(code) {
    await I18n.load(code);
    I18n.saveLanguage(code);

    const state = this.registry.get('gameState');
    if (state && state.currentLocation) {
      this.scene.start('Location', { locationId: state.currentLocation });
    } else {
      this.scene.start('Menu');
    }
  }
}
