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
    this.add.text(width / 2, 80, 'DUALUNA', {
      fontSize: '48px', fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#224466', strokeThickness: 3,
    }).setOrigin(0.5);

    // Language grid (2 columns)
    const langs = Object.entries(I18n.SUPPORTED_LANGUAGES);
    const colW = 260;
    const startX = width / 2 - colW;
    const startY = 160;
    const rowH = 48;
    const savedLang = I18n.getSavedLanguage();

    langs.forEach(([code, name], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * colW + colW / 2;
      const y = startY + row * rowH;

      const isTranslated = TRANSLATED_LANGUAGES.includes(code);
      const isSaved = code === savedLang;

      const btn = this.add.text(x, y, name, {
        fontSize: '22px',
        fill: isSaved ? '#ffffff' : isTranslated ? '#88aacc' : '#556677',
        fontFamily: 'Georgia, serif',
        fontStyle: isSaved ? 'bold' : 'normal',
      }).setOrigin(0.5);

      if (isTranslated) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setStyle({ fill: '#ffffff' }));
        btn.on('pointerout', () => btn.setStyle({ fill: isSaved ? '#ffffff' : '#88aacc' }));
        btn.on('pointerdown', () => this.selectLanguage(code));
      } else {
        // Strikethrough for untranslated languages
        const lineY = y + 1;
        const lineW = btn.width * 0.55;
        const gfx = this.add.graphics();
        gfx.lineStyle(1, 0x556677, 0.8);
        gfx.lineBetween(x - lineW, lineY, x + lineW, lineY);
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
