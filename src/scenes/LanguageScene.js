import Phaser from 'phaser';
import { I18n } from '../systems/I18n.js';

export class LanguageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Language' });
  }

  create() {
    const { width, height } = this.scale;

    // Background — reuse menu bg
    this.add.image(0, 0, 'bg-menu').setOrigin(0, 0);

    // Title
    this.add.text(width / 2, 80, 'DUALUNA', {
      fontSize: '48px', fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#224466', strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(width / 2, 130, 'Choose your language', {
      fontSize: '18px', fill: '#667788', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Language grid (2 columns)
    const langs = Object.entries(I18n.SUPPORTED_LANGUAGES);
    const colW = 260;
    const startX = width / 2 - colW;
    const startY = 190;
    const rowH = 48;
    const savedLang = I18n.getSavedLanguage();

    langs.forEach(([code, name], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * colW + colW / 2;
      const y = startY + row * rowH;

      const isSaved = code === savedLang;
      const label = `${name}`;

      const btn = this.add.text(x, y, label, {
        fontSize: '22px',
        fill: isSaved ? '#ffffff' : '#88aacc',
        fontFamily: 'Georgia, serif',
        fontStyle: isSaved ? 'bold' : 'normal',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setStyle({ fill: '#ffffff' }));
      btn.on('pointerout', () => btn.setStyle({ fill: isSaved ? '#ffffff' : '#88aacc' }));
      btn.on('pointerdown', () => this.selectLanguage(code));
    });
  }

  async selectLanguage(code) {
    await I18n.load(code);
    I18n.saveLanguage(code);

    // If a game is in progress, return to it; otherwise go to Menu
    const state = this.registry.get('gameState');
    if (state && state.currentLocation) {
      this.scene.start('Location', { locationId: state.currentLocation });
    } else {
      this.scene.start('Menu');
    }
  }
}
