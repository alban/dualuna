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
  width: 1024,
  height: 768,
  backgroundColor: '#000000',
  fps: {
    target: 10,
    forceSetTimeOut: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, LanguageScene, MenuScene, WorldMapScene, LocationScene, DialogueScene],
};

const game = new Phaser.Game(config);
