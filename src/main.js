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

// DPR: boost canvas buffer to physical pixels so text/images are crisp on high-DPI screens.
// Phaser's input uses getBoundingClientRect() + CSS coordinates — it does NOT use canvas.width
// for hit detection, so boosting the buffer does not affect input at all.
const dpr = window.devicePixelRatio || 1;

function boostCanvas() {
  if (dpr <= 1) return;
  const canvas = game.canvas;
  const w = game.scale.width, h = game.scale.height;
  if (!w || !h) return;
  const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
  if (canvas.width === pw && canvas.height === ph) return;
  canvas.width = pw;
  canvas.height = ph;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  // Sync Phaser's stored canvasBounds and displayScale to the new CSS size.
  // Without this, Phaser uses stale portrait-orientation bounds for input coordinate
  // transforms, making all hit detection wrong by a factor of ~2.
  game.scale.updateBounds();
  const cb = game.scale.canvasBounds;
  game.scale.displayScale.set(
    game.scale.baseSize.width / cb.width,
    game.scale.baseSize.height / cb.height
  );
}

if (dpr > 1) {
  game.events.once('ready', () => {
    // After origPreRender resets to identity, apply DPR scale so all subsequent
    // draw calls land in physical pixels.
    // boostCanvas() is called here every frame because Phaser's ScaleManager.updateScale()
    // resets canvas.width to CSS size on every PRE_STEP tick — we must re-boost each render.
    const origPreRender = game.renderer.preRender.bind(game.renderer);
    game.renderer.preRender = function () {
      boostCanvas();
      origPreRender();
      const ctx = this.gameContext;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, this.width, this.height);
      if (!this.config.transparent) {
        ctx.fillStyle = this.config.backgroundColor.rgba;
        ctx.fillRect(0, 0, this.width, this.height);
      }
    };

    // Phaser game objects set the canvas transform via setToContext, which calls
    // ctx.setTransform() — a full replace. Multiply each matrix value by DPR so
    // the replace preserves our physical-pixel scale.
    const TransformMatrix = Phaser.GameObjects.Components.TransformMatrix;
    TransformMatrix.prototype.setToContext = function (ctx) {
      ctx.setTransform(
        this.a * dpr, this.b * dpr,
        this.c * dpr, this.d * dpr,
        this.e * dpr, this.f * dpr,
      );
      return ctx;
    };

    // Text canvases render at CSS resolution by default; resolution: dpr makes them
    // render at physical resolution so text is sharp.
    const origText = Phaser.GameObjects.GameObjectFactory.prototype.text;
    Phaser.GameObjects.GameObjectFactory.prototype.text = function (x, y, text, style) {
      return origText.call(this, x, y, text, Object.assign({}, style, { resolution: dpr }));
    };
  });
}

// Resize canvas to window size and restart active scenes.
// Needed because mobile browser initializes in portrait then rotates.
const startedAt = Date.now();
const applyResize = () => {
  if (Date.now() - startedAt < 1500) return; // ignore browser-settle resize on load
  const w = window.innerWidth, h = window.innerHeight;
  if (Math.abs(game.scale.width - w) < 2 && Math.abs(game.scale.height - h) < 2) return;
  game.scale.resize(w, h);
  boostCanvas(); // synchronous: re-boost immediately after Phaser resets canvas dimensions
  game.scene.getScenes(true).forEach(s => s.scene.restart());
  game.loop.tick();
};
window.addEventListener('resize', () => setTimeout(applyResize, 100));
window.addEventListener('orientationchange', () => setTimeout(applyResize, 300));
const applyFullscreenResize = () => {
  const w = window.innerWidth, h = window.innerHeight;
  game.scale.resize(w, h);
  boostCanvas(); // synchronous: re-boost immediately after Phaser resets canvas dimensions
  game.scene.getScenes(true).forEach(s => s.scene.restart());
  game.loop.tick();
};
document.addEventListener('fullscreenchange', () => setTimeout(applyFullscreenResize, 400));
document.addEventListener('webkitfullscreenchange', () => setTimeout(applyFullscreenResize, 400));
