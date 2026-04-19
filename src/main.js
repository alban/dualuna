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
  backgroundColor: '#000000',
  fps: {
    target: 1,
    forceSetTimeOut: true,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
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

// Force Phaser canvas to actual window size and restart active scenes
// Needed because mobile browser initializes in portrait then rotates
const startedAt = Date.now();
const applyResize = () => {
  if (Date.now() - startedAt < 1500) return; // ignore browser-settle resize on load
  const w = window.innerWidth, h = window.innerHeight;
  if (Math.abs(game.scale.width - w) < 2 && Math.abs(game.scale.height - h) < 2) return;
  game.scale.resize(w, h);
  game.scene.getScenes(true).forEach(s => s.scene.restart());
  game.loop.tick();
};
window.addEventListener('resize', () => setTimeout(applyResize, 100));
window.addEventListener('orientationchange', () => setTimeout(applyResize, 300));
const applyFullscreenResize = () => {
  const w = window.innerWidth, h = window.innerHeight;
  game.scale.resize(w, h);
  game.scene.getScenes(true).forEach(s => s.scene.restart());
  game.loop.tick();
};
document.addEventListener('fullscreenchange', () => setTimeout(applyFullscreenResize, 400));
document.addEventListener('webkitfullscreenchange', () => setTimeout(applyFullscreenResize, 400));
