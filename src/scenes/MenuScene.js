import Phaser from 'phaser';
import { I18n } from '../systems/I18n.js';
import { SaveManager } from '../systems/SaveManager.js';
import { BASE_W, BASE_H } from '../utils/layout.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    const { width, height } = this.scale;
    const sx = width / BASE_W, sy = height / BASE_H;

    const ss = Math.min(sx, sy);

    // Pre-rendered background — dimmed so panel reads clearly
    this.add.image(0, 0, 'bg-menu').setOrigin(0, 0).setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.55);

    // Central panel
    const panelW = Math.min(Math.round(480 * sx), width - 40);
    const panelH = Math.min(Math.round(380 * sy), height - 20);
    const panelX = width / 2;
    const panelY = height / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x08131e, 0.92);
    panel.fillRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 10);
    panel.lineStyle(1, 0x2a4a66, 1);
    panel.strokeRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 10);

    // Title
    this.add.text(panelX, panelY - panelH / 2 + Math.round(40 * sy), 'DUALUNA', {
      fontSize: `${Math.round(28 * ss)}px`, fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#112233', strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(panelX, panelY - panelH / 2 + Math.round(80 * sy), I18n.t('ui.subtitle'), {
      fontSize: `${Math.round(13 * ss)}px`, fill: '#66aa99', fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    const divGfx = this.add.graphics();
    divGfx.lineStyle(1, 0x223344, 0.8);
    divGfx.lineBetween(panelX - panelW / 2 + 20, panelY - panelH / 2 + Math.round(100 * sy),
                       panelX + panelW / 2 - 20, panelY - panelH / 2 + Math.round(100 * sy));

    // Menu buttons
    const buttonStyle = {
      fontSize: `${Math.round(22 * ss)}px`, fill: '#aaddcc', fontFamily: 'Georgia, serif',
    };
    const hoverStyle = { fill: '#ffffff' };
    const normalStyle = { fill: '#aaddcc' };

    const newGame = this.add.text(panelX, panelY - panelH / 2 + Math.round(180 * sy), `◆  ${I18n.t('ui.newGame')}  ◆`, buttonStyle)
      .setOrigin(0.5).setInteractive({ useHandCursor: true });

    const continueBtn = this.add.text(panelX, panelY - panelH / 2 + Math.round(255 * sy), `◆  ${I18n.t('ui.continue')}  ◆`, buttonStyle)
      .setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Check if save exists
    const hasSave = SaveManager.hasSave();
    if (!hasSave) {
      continueBtn.setAlpha(0.3);
      continueBtn.disableInteractive();
    }

    [newGame, continueBtn].forEach(btn => {
      btn.on('pointerover', () => btn.setStyle(hoverStyle));
      btn.on('pointerout', () => btn.setStyle(normalStyle));
    });

    newGame.on('pointerdown', () => this.startNewGame());
    continueBtn.on('pointerdown', () => this.continueGame());

    // Fullscreen button — bottom left, large
    const fsBtn = this.add.text(Math.round(15 * sx), height - Math.round(90 * sy), '⛶', {
      fontSize: `${Math.round(80 * sy)}px`, fill: '#88aacc', fontFamily: 'Georgia, serif',
      backgroundColor: '#1a2a3a', padding: { x: Math.round(20 * sx), y: Math.round(14 * sy) },
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

    const reloadBtn = this.add.text(
      Math.round(15 * sx) + fsBtn.width + Math.round(10 * sx),
      height - Math.round(90 * sy), '🔄', {
        fontSize: `${Math.round(80 * sy)}px`, fill: '#88aacc', fontFamily: 'Georgia, serif',
        backgroundColor: '#1a2a3a', padding: { x: Math.round(20 * sx), y: Math.round(14 * sy) },
      }).setInteractive({ useHandCursor: true });
    reloadBtn.on('pointerover', () => reloadBtn.setStyle({ fill: '#ffffff' }));
    reloadBtn.on('pointerout', () => reloadBtn.setStyle({ fill: '#88aacc' }));
    reloadBtn.on('pointerdown', () => window.location.reload());

    // Version
    this.add.text(width / 2, height - Math.round(30 * sy), I18n.t('ui.phase'), {
      fontSize: `${Math.round(12 * sy)}px`, fill: '#8899aa', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // GitHub link — bottom-right
    const ghLink = this.add.text(width - 10, height - 10, 'github.com/alban/dualuna', {
      fontSize: `${Math.max(Math.round(14 * sy), 14)}px`, fill: '#8899aa', fontFamily: 'Georgia, serif',
      backgroundColor: '#000000aa', padding: { x: 6, y: 3 },
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });
    ghLink.on('pointerover', () => ghLink.setStyle({ fill: '#88aacc' }));
    ghLink.on('pointerout', () => ghLink.setStyle({ fill: '#8899aa' }));
    ghLink.on('pointerdown', () => window.open('https://github.com/alban/dualuna', '_blank'));
  }

  startNewGame() {
    this.registry.set('gameState', {
      saveVersion: 1,
      chapter: 1,
      currentLocation: 'mine-entrance',
      currentIsland: 'cliff-haven',
      visitedLocations: ['mine-entrance'],
      discoveredIslands: ['cliff-haven'],
      quests: {},
      questFlags: {},
      inventory: [],
      verdium: 100,
      dayPhase: 'morning',
      gameTime: 0,
      dialogueHistory: [],
    });
    this.scene.start('Location', { locationId: 'mine-entrance' });
  }

  continueGame() {
    try {
      const save = SaveManager.load();
      this.registry.set('gameState', save);
      this.scene.start('Location', { locationId: save.currentLocation });
    } catch (e) {
      console.error('Failed to load save:', e);
      this.startNewGame();
    }
  }
}
