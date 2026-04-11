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
    this.add.text(width / 2, 40, 'DUALUNA', {
      fontSize: '36px', fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#224466', strokeThickness: 3,
    }).setOrigin(0.5);

    // Language list — single column, full width, large touch targets
    const langs = Object.entries(I18n.SUPPORTED_LANGUAGES);
    const savedLang = I18n.getSavedLanguage();
    const totalH = height - 100;
    const rowH = Math.floor(totalH / langs.length);
    const startY = 90;

    langs.forEach(([code, name], i) => {
      const y = startY + i * rowH + rowH / 2;
      const isTranslated = TRANSLATED_LANGUAGES.includes(code);
      const isSaved = code === savedLang;

      // Full-width touch zone
      const zone = this.add.rectangle(width / 2, y, width - 40, rowH - 4, 0x000000, 0)
        .setStrokeStyle(1, isSaved ? 0x88ccdd : 0x334455, isSaved ? 0.6 : 0.2);

      const btn = this.add.text(width / 2, y, name, {
        fontSize: '28px',
        fill: isSaved ? '#ffffff' : isTranslated ? '#88aacc' : '#556677',
        fontFamily: 'Georgia, serif',
        fontStyle: isSaved ? 'bold' : 'normal',
      }).setOrigin(0.5);

      if (isTranslated) {
        zone.setInteractive({ useHandCursor: true });
        zone.on('pointerover', () => {
          btn.setStyle({ fill: '#ffffff' });
          zone.setStrokeStyle(1, 0x88ccdd, 0.6);
        });
        zone.on('pointerout', () => {
          btn.setStyle({ fill: isSaved ? '#ffffff' : '#88aacc' });
          zone.setStrokeStyle(1, isSaved ? 0x88ccdd : 0x334455, isSaved ? 0.6 : 0.2);
        });
        zone.on('pointerdown', () => this.selectLanguage(code));
      } else {
        // Strikethrough
        const lineW = btn.width * 0.55;
        const gfx = this.add.graphics();
        gfx.lineStyle(1, 0x556677, 0.8);
        gfx.lineBetween(width / 2 - lineW, y + 1, width / 2 + lineW, y + 1);
      }
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
