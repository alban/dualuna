/**
 * Generate screenshots of all game screens in each supported language.
 * Requires a running dev server (npm run dev -- --port 4444).
 *
 * Usage:
 *   npm run dev -- --port 4444 &
 *   node scripts/screenshots.js
 *
 * Output: screenshots/<lang>/<screen>.png
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LOCATIONS as LOCATIONS_DATA } from '../src/data/locations.js';
import { WORLD } from '../src/data/world.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'screenshots');
const BASE_URL = 'http://localhost:4444/dualuna/';
const LANGUAGES = ['en', 'fr'];
const VIEWPORTS = {
  desktop: { width: 1024, height: 768, isMobile: false, deviceScaleFactor: 1 },
  mobile: { width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const LOCATION_IDS = Object.keys(LOCATIONS_DATA);
const ISLAND_IDS = Object.keys(WORLD.islands);

// Determine which island a location belongs to
function getIslandForLocation(locId) {
  for (const [islandId, island] of Object.entries(WORLD.islands)) {
    if (island.locations.includes(locId)) return islandId;
  }
  return ISLAND_IDS[0];
}

const WAIT = (ms) => new Promise(r => setTimeout(r, ms));

async function initGame(page, lang) {
  // Set language in localStorage before loading
  await page.evaluateOnNewDocument((l) => {
    localStorage.setItem('dualuna_lang', l);
  }, lang);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 20000 });
  await WAIT(2000);
}

function getGameState(locationId) {
  return {
    chapter: 1,
    currentLocation: locationId,
    currentIsland: getIslandForLocation(locationId),
    visitedLocations: LOCATION_IDS,
    discoveredIslands: ISLAND_IDS,
    quests: { 'tremors-in-the-deep': { status: 'active', objectives: {} } },
    questFlags: { 'talked-to-kael': true, 'talked-to-tink': true },
    inventory: [],
    verdium: 100,
    dayPhase: 'morning',
    gameTime: 0,
    dialogueHistory: [],
  };
}

async function screenshot(page, outPath) {
  await page.screenshot({ path: outPath });
  console.log(`  ✓ ${outPath}`);
}

async function navigateToScene(page, sceneName, opts) {
  await page.evaluate((name, state, data) => {
    const game = window.__PHASER_GAME__;
    if (state) game.registry.set('gameState', state);
    game.scene.getScenes(true).forEach(s => game.scene.stop(s));
    game.scene.start(name, data || {});
  }, sceneName, opts?.state || null, opts?.data || null);
  await WAIT(1500);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    for (const lang of LANGUAGES) {
      mkdirSync(OUT_DIR, { recursive: true });
      const prefix = `${vpName}-${lang}`;
      console.log(`\n=== ${vpName} / ${lang} ===`);

      const page = await browser.newPage();
      await page.setViewport(vp);
      await initGame(page, lang);

      // 1. Language screen
      await screenshot(page, join(OUT_DIR, `${prefix}-01-language.png`));

      // 2. Menu screen
      await page.evaluate(() => {
        const game = window.__PHASER_GAME__;
        game.scene.getScenes(true).forEach(s => game.scene.stop(s));
        game.scene.start('Menu');
      });
      await WAIT(1500);
      await screenshot(page, join(OUT_DIR, `${prefix}-02-menu.png`));

      // 3. World map
      const mapState = getGameState('mine-entrance');
      await navigateToScene(page, 'WorldMap', { state: mapState });
      await screenshot(page, join(OUT_DIR, `${prefix}-03-worldmap.png`));

      // 4. Each location
      for (let i = 0; i < LOCATION_IDS.length; i++) {
        const locId = LOCATION_IDS[i];
        const locState = getGameState(locId);
        await navigateToScene(page, 'Location', { state: locState, data: { locationId: locId } });
        await screenshot(page, join(OUT_DIR, `${prefix}-${String(i + 4).padStart(2, '0')}-${locId}.png`));
      }

      // Dialogue — navigate to Location first, then launch Dialogue on top
      const dlgState = getGameState('mine-entrance');
      await navigateToScene(page, 'Location', { state: dlgState, data: { locationId: 'mine-entrance' } });
      await page.evaluate(() => {
        const game = window.__PHASER_GAME__;
        const locationScene = game.scene.getScene('Location');
        locationScene.scene.launch('Dialogue', {
          dialogueId: 'foreman-kael-default',
          returnScene: 'Location',
          returnData: { locationId: 'mine-entrance' },
        });
        locationScene.scene.pause();
      });
      await WAIT(1500);
      let idx = LOCATION_IDS.length + 4;
      await screenshot(page, join(OUT_DIR, `${prefix}-${String(idx).padStart(2, '0')}-dialogue.png`));
      idx++;

      // Config menu
      const cfgState = getGameState('mine-entrance');
      await navigateToScene(page, 'Location', { state: cfgState, data: { locationId: 'mine-entrance' } });
      const canvas = await page.$('canvas');
      const box = await canvas.boundingBox();
      await page.mouse.click(box.x + box.width - 145, box.y + box.height - 70);
      await WAIT(1000);
      await screenshot(page, join(OUT_DIR, `${prefix}-${String(idx).padStart(2, '0')}-config-menu.png`));

      await page.close();
    }
  }

  await browser.close();
  console.log(`\nDone! Screenshots saved to ${OUT_DIR}/`);
}

run().catch(e => { console.error(e); process.exit(1); });
