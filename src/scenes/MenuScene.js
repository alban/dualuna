import Phaser from 'phaser';
import { I18n } from '../systems/I18n.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    const { width, height } = this.scale;

    // Pre-rendered background
    this.add.image(0, 0, 'bg-menu').setOrigin(0, 0);

    // Title
    this.add.text(width / 2, 200, 'DUALUNA', {
      fontSize: '72px', fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#224466', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, 270, I18n.t('ui.subtitle'), {
      fontSize: '28px', fill: '#66aa99', fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    this.add.text(width / 2, 330, I18n.t('ui.tagline'), {
      fontSize: '16px', fill: '#557788', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Menu buttons
    const buttonStyle = {
      fontSize: '24px', fill: '#aaddcc', fontFamily: 'Georgia, serif',
    };
    const hoverStyle = { fill: '#ffffff' };
    const normalStyle = { fill: '#aaddcc' };

    const newGame = this.add.text(width / 2, 440, `◆  ${I18n.t('ui.newGame')}  ◆`, buttonStyle)
      .setOrigin(0.5).setInteractive({ useHandCursor: true });

    const continueBtn = this.add.text(width / 2, 500, `◆  ${I18n.t('ui.continue')}  ◆`, buttonStyle)
      .setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Check if save exists
    const hasSave = localStorage.getItem('dualuna_save') !== null;
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

    // Version
    this.add.text(width / 2, height - 30, I18n.t('ui.phase'), {
      fontSize: '12px', fill: '#8899aa', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);
  }

  startNewGame() {
    this.registry.set('gameState', {
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
      const save = JSON.parse(localStorage.getItem('dualuna_save'));
      this.registry.set('gameState', save);
      this.scene.start('Location', { locationId: save.currentLocation });
    } catch (e) {
      console.error('Failed to load save:', e);
      this.startNewGame();
    }
  }
}
