import Phaser from 'phaser';
import { I18n } from '../systems/I18n.js';
import { BASE_W, BASE_H } from '../utils/layout.js';

const TRANSLATED_LANGUAGES = ['en', 'fr'];

export class LanguageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Language' });
  }

  create() {
    const { width, height } = this.scale;
    const sx = width / BASE_W, sy = height / BASE_H, ss = Math.min(sx, sy);

    // Background — dimmed so panel reads clearly
    this.add.image(0, 0, 'bg-menu').setOrigin(0, 0).setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55);

    // Central panel
    const panelW = Math.min(Math.round(560 * sx), width - 40);
    const panelH = Math.min(Math.round(480 * sy), height - 20);
    const panelX = width / 2;
    const panelY = height / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x08131e, 0.92);
    panel.fillRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 10);
    panel.lineStyle(1, 0x2a4a66, 1);
    panel.strokeRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 10);

    // Title
    this.add.text(panelX, panelY - panelH / 2 + Math.round(32 * sy), 'DUALUNA', {
      fontSize: `${Math.round(28 * ss)}px`, fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#112233', strokeThickness: 3,
    }).setOrigin(0.5);

    // Prompt
    this.add.text(panelX, panelY - panelH / 2 + Math.round(68 * sy), 'Choose your language', {
      fontSize: `${Math.round(13 * ss)}px`, fill: '#556677', fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Divider
    const divGfx = this.add.graphics();
    divGfx.lineStyle(1, 0x223344, 0.8);
    divGfx.lineBetween(panelX - panelW / 2 + 20, panelY - panelH / 2 + Math.round(85 * sy),
                       panelX + panelW / 2 - 20, panelY - panelH / 2 + Math.round(85 * sy));

    // Language list — 2 columns inside the panel
    const langs = Object.entries(I18n.SUPPORTED_LANGUAGES);
    const cols = 2;
    const listTop = panelY - panelH / 2 + Math.round(100 * sy);
    const listBottom = panelY + panelH / 2 - Math.round(20 * sy);
    const listH = listBottom - listTop;
    const rows = Math.ceil(langs.length / cols);
    const rowH = Math.floor(listH / rows);
    const colW = panelW / cols;
    const itemH = Math.min(rowH - 6, Math.round(52 * sy));

    langs.forEach(([code, name], i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = panelX - panelW / 2 + col * colW + colW / 2;
      const y = listTop + row * rowH + rowH / 2;
      const isAvailable = TRANSLATED_LANGUAGES.includes(code);

      if (isAvailable) {
        // Highlighted button
        const bg = this.add.graphics();
        bg.fillStyle(0x112233, 0.6);
        bg.fillRoundedRect(x - colW / 2 + 8, y - itemH / 2, colW - 16, itemH, 6);
        bg.lineStyle(1, 0x2a5a7a, 0.5);
        bg.strokeRoundedRect(x - colW / 2 + 8, y - itemH / 2, colW - 16, itemH, 6);

        const txt = this.add.text(x, y, name, {
          fontSize: `${Math.round(22 * ss)}px`, fill: '#88bbdd', fontFamily: 'Georgia, serif',
        }).setOrigin(0.5);

        const hitZone = this.add.rectangle(x, y, colW - 16, itemH, 0x000000, 0)
          .setInteractive({ useHandCursor: true });

        hitZone.on('pointerover', () => {
          bg.clear();
          bg.fillStyle(0x1a4060, 0.9);
          bg.fillRoundedRect(x - colW / 2 + 8, y - itemH / 2, colW - 16, itemH, 6);
          bg.lineStyle(1, 0x55aacc, 0.8);
          bg.strokeRoundedRect(x - colW / 2 + 8, y - itemH / 2, colW - 16, itemH, 6);
          txt.setStyle({ fill: '#ffffff' });
        });
        hitZone.on('pointerout', () => {
          bg.clear();
          bg.fillStyle(0x112233, 0.6);
          bg.fillRoundedRect(x - colW / 2 + 8, y - itemH / 2, colW - 16, itemH, 6);
          bg.lineStyle(1, 0x2a5a7a, 0.5);
          bg.strokeRoundedRect(x - colW / 2 + 8, y - itemH / 2, colW - 16, itemH, 6);
          txt.setStyle({ fill: '#88bbdd' });
        });
        hitZone.on('pointerdown', () => this.selectLanguage(code));
      } else {
        // Unavailable — muted, struck through
        this.add.text(x, y, name, {
          fontSize: `${Math.round(18 * ss)}px`, fill: '#3a4a55', fontFamily: 'Georgia, serif',
        }).setOrigin(0.5);

        const lineGfx = this.add.graphics();
        lineGfx.lineStyle(1, 0x3a4a55, 0.7);
        const approxW = name.length * Math.round(10 * ss);
        lineGfx.lineBetween(x - approxW / 2, y + 1, x + approxW / 2, y + 1);
      }
    });

    // Fullscreen button — bottom left, matches MenuScene style
    const fsBtn = this.add.text(Math.round(15 * sx), height - Math.round(90 * sy), '⛶', {
      fontSize: `${Math.round(80 * sy)}px`, fill: '#88aacc', fontFamily: 'Georgia, serif',
      backgroundColor: '#1a2a3a', padding: { x: Math.round(20 * sx), y: Math.round(14 * sy) },
    }).setInteractive({ useHandCursor: true });
    fsBtn.on('pointerover', () => fsBtn.setStyle({ fill: '#ffffff' }));
    fsBtn.on('pointerout', () => fsBtn.setStyle({ fill: '#88aacc' }));
    fsBtn.on('pointerdown', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    });

    const reloadBtn = this.add.text(
      Math.round(15 * sx) + fsBtn.width + Math.round(10 * sx),
      height - Math.round(90 * sy), '🔄', {
        fontSize: `${Math.round(80 * sy)}px`, fill: '#88aacc', fontFamily: 'Georgia, serif',
        backgroundColor: '#1a2a3a', padding: { x: Math.round(20 * sx), y: Math.round(14 * sy) },
      }).setInteractive({ useHandCursor: true });
    reloadBtn.on('pointerover', () => reloadBtn.setStyle({ fill: '#ffffff' }));
    reloadBtn.on('pointerout', () => reloadBtn.setStyle({ fill: '#88aacc' }));
    reloadBtn.on('pointerdown', () => window.location.reload());

    // GitHub link — bottom-right
    const ghLink = this.add.text(width - 10, height - 10, 'github.com/alban/dualuna', {
      fontSize: `${Math.round(10 * ss)}px`, fill: '#334455', fontFamily: 'Georgia, serif',
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });
    ghLink.on('pointerover', () => ghLink.setStyle({ fill: '#88aacc' }));
    ghLink.on('pointerout', () => ghLink.setStyle({ fill: '#334455' }));
    ghLink.on('pointerdown', () => window.open('https://github.com/alban/dualuna', '_blank'));
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
