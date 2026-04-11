import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    const { width, height } = this.scale;

    // Background gradient
    const bg = this.add.graphics();
    for (let y = 0; y < height; y++) {
      const t = y / height;
      const r = Math.floor(10 + t * 20);
      const g = Math.floor(15 + t * 40);
      const b = Math.floor(40 + t * 80);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      bg.fillRect(0, y, width, 1);
    }

    // Two moons
    const moonGfx = this.add.graphics();
    moonGfx.fillStyle(0xeeeedd, 0.8);
    moonGfx.fillCircle(300, 120, 35);
    moonGfx.fillStyle(0xddccbb, 0.6);
    moonGfx.fillCircle(720, 90, 25);

    // Title
    this.add.text(width / 2, 200, 'DUALUNA', {
      fontSize: '72px', fill: '#88ccff', fontFamily: 'Georgia, serif',
      stroke: '#224466', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, 270, 'The Verdium Collector', {
      fontSize: '28px', fill: '#66aa99', fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 330, 'A world of islands above, mysteries below', {
      fontSize: '16px', fill: '#557788', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);

    // Menu buttons
    const buttonStyle = {
      fontSize: '24px', fill: '#aaddcc', fontFamily: 'Georgia, serif',
    };
    const hoverStyle = { fill: '#ffffff' };
    const normalStyle = { fill: '#aaddcc' };

    const newGame = this.add.text(width / 2, 440, '◆  New Game  ◆', buttonStyle)
      .setOrigin(0.5).setInteractive({ useHandCursor: true });

    const continueBtn = this.add.text(width / 2, 500, '◆  Continue  ◆', buttonStyle)
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

    newGame.on('pointerdown', () => {
      this.startNewGame();
    });

    continueBtn.on('pointerdown', () => {
      this.continueGame();
    });

    // Version
    this.add.text(width / 2, height - 30, 'Phase 1 — Chapter 1: The Mine Problem', {
      fontSize: '12px', fill: '#445566', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5);
  }

  startNewGame() {
    // Initialize fresh game state
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
