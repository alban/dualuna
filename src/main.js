import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { LanguageScene } from './scenes/LanguageScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { LocationScene } from './scenes/LocationScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';

const config = {
  type: Phaser.CANVAS,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#000000',
  fps: {
    target: 1,
    forceSetTimeOut: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, LanguageScene, MenuScene, WorldMapScene, LocationScene, DialogueScene],
};

const game = new Phaser.Game(config);
window.__PHASER_GAME__ = game;

// Force immediate render on user input so clicks feel instant at 1fps
const forceRender = () => game.loop.tick();
document.addEventListener('pointerdown', forceRender);
document.addEventListener('pointerup', forceRender);
document.addEventListener('pointermove', forceRender);
