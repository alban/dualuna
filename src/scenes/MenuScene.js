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

    // Pre-rendered background
    this.add.image(0, 0, 'bg-menu').setOrigin(0, 0).setDisplaySize(width, height);

    // Title
    this.add.text(width / 2, Math.round(200 * sy), 'DUALUNA', {
      fontSize: `${Math.round(72 * sy)}px`, fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#224466', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, Math.round(270 * sy), I18n.t('ui.subtitle'), {
      fontSize: `${Math.round(28 * sy)}px`, fill: '#66aa99', fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    this.add.text(width / 2, Math.round(330 * sy), I18n.t('ui.tagline'), {
      fontSize: `${Math.round(16 * sy)}px`, fill: '#557788', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Menu buttons
    const buttonStyle = {
      fontSize: `${Math.round(24 * sy)}px`, fill: '#aaddcc', fontFamily: 'Georgia, serif',
    };
    const hoverStyle = { fill: '#ffffff' };
    const normalStyle = { fill: '#aaddcc' };

    const newGame = this.add.text(width / 2, Math.round(440 * sy), `◆  ${I18n.t('ui.newGame')}  ◆`, buttonStyle)
      .setOrigin(0.5).setInteractive({ useHandCursor: true });

    const continueBtn = this.add.text(width / 2, Math.round(500 * sy), `◆  ${I18n.t('ui.continue')}  ◆`, buttonStyle)
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

    // Version
    this.add.text(width / 2, height - Math.round(30 * sy), I18n.t('ui.phase'), {
      fontSize: `${Math.round(12 * sy)}px`, fill: '#8899aa', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);
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
