/**
 * Smoke test: launch game, check all scenes render without JS errors or black screens.
 * Run with dev server: npm run smoke-test (or make smoke-test)
 *
 * Exit 0 = pass, exit 1 = fail. Screenshots saved to screenshots/smoke/.
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.SMOKE_URL || 'http://localhost:5173/dualuna/';
const OUT_DIR = join(__dirname, '..', 'screenshots', 'smoke');
mkdirSync(OUT_DIR, { recursive: true });

const WAIT = (ms) => new Promise(r => setTimeout(r, ms));

// Android phone landscape (DPR=3, 800×360 CSS = 2400×1080 physical)
const PHONE = { width: 800, height: 360, isMobile: true, hasTouch: true, deviceScaleFactor: 3 };

let pass = true;
const errors = [];
const log = (msg) => process.stdout.write(msg + '\n');

async function snap(page, filename) {
  await page.screenshot({ path: join(OUT_DIR, filename) });
  log(`  screenshot: ${filename}`);
}

// Returns dark pixel ratio. Fails test if >95% dark (all-black).
async function checkCanvas(page, label) {
  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { exists: false };
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const step = Math.max(10, Math.floor(Math.min(w, h) / 20));
    let total = 0, dark = 0;
    for (let x = step; x < w - step; x += step) {
      for (let y = step; y < h - step; y += step) {
        const px = ctx.getImageData(x, y, 1, 1).data;
        total++;
        if (px[0] < 10 && px[1] < 10 && px[2] < 10) dark++;
      }
    }
    return { exists: true, w, h, darkRatio: total > 0 ? dark / total : 1 };
  });

  if (!result.exists) {
    errors.push(`${label}: no canvas found`);
    pass = false;
    return;
  }

  const pct = Math.round(result.darkRatio * 100);
  log(`  ${label}: canvas ${result.w}×${result.h}, ${pct}% dark pixels`);
  if (result.darkRatio > 0.95) {
    errors.push(`${label}: appears all black (${pct}% dark pixels)`);
    pass = false;
  }
}

// Navigate to a scene using Phaser's internal API (bypasses click/input issues)
async function goToScene(page, sceneName, state, sceneData) {
  await page.evaluate((name, st, data) => {
    const game = window.__PHASER_GAME__;
    if (st) game.registry.set('gameState', st);
    // Stop all active scenes cleanly
    const active = game.scene.getScenes(true).map(s => s.sys.settings.key);
    active.forEach(k => { try { game.scene.stop(k); } catch(e) {} });
    game.scene.start(name, data || {});
  }, sceneName, state || null, sceneData || null);
  await WAIT(2000); // wait for 1fps render cycle
}

function makeState(locationId) {
  return {
    saveVersion: 1, chapter: 1,
    currentLocation: locationId, currentIsland: 'cliff-haven',
    visitedLocations: [locationId], discoveredIslands: ['cliff-haven'],
    quests: { 'tremors-in-the-deep': { status: 'active', objectives: {} } },
    questFlags: { 'talked-to-kael': true },
    inventory: [], verdium: 50,
    dayPhase: 'day', gameTime: 0, dialogueHistory: [],
  };
}

async function run() {
  log('=== Dualuna Smoke Test ===');
  log(`URL: ${BASE_URL}`);
  log(`Viewport: ${PHONE.width}×${PHONE.height} DPR=${PHONE.deviceScaleFactor}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport(PHONE);

  const jsErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') jsErrors.push(msg.text().slice(0, 300));
  });
  page.on('pageerror', err => {
    const stack = (err.stack || '').split('\n').slice(0, 3).join(' | ');
    jsErrors.push(`${err.message.slice(0, 100)} — ${stack}`);
  });
  page.on('response', res => {
    if (res.status() === 404) jsErrors.push(`404: ${res.url().slice(0, 200)}`);
  });

  // Load page
  log('[1/5] Boot + Language screen');
  await page.evaluateOnNewDocument(() => localStorage.setItem('dualuna_lang', 'en'));
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 20000 });
  } catch (e) {
    errors.push(`Page failed to load: ${e.message}`);
    pass = false;
    await browser.close();
    return reportAndExit();
  }
  await WAIT(3000);
  await snap(page, '01-language.png');
  await checkCanvas(page, 'Language');

  // Menu
  log('[2/5] Menu screen');
  await goToScene(page, 'Menu', null, null);
  await snap(page, '02-menu.png');
  await checkCanvas(page, 'Menu');

  // World map
  log('[3/5] World map');
  await goToScene(page, 'WorldMap', makeState('mine-entrance'), null);
  await snap(page, '03-worldmap.png');
  await checkCanvas(page, 'WorldMap');

  // Location: mine-entrance
  log('[4/5] Location (mine-entrance)');
  await goToScene(page, 'Location', makeState('mine-entrance'), { locationId: 'mine-entrance' });
  await snap(page, '04-location.png');
  await checkCanvas(page, 'Location');

  // Dialogue
  log('[5/5] Dialogue');
  await page.evaluate(() => {
    const game = window.__PHASER_GAME__;
    try {
      game.scene.launch('Dialogue', {
        dialogueId: 'foreman-kael-default',
        returnScene: 'Location',
        returnData: { locationId: 'mine-entrance' },
      });
      const loc = game.scene.getScene('Location');
      if (loc) loc.scene.pause();
    } catch(e) {}
  });
  await WAIT(2000);
  await snap(page, '05-dialogue.png');
  await checkCanvas(page, 'Dialogue');

  // JS errors summary
  log('[JS errors]');
  // Ignore favicon 404s — normal when no favicon.ico exists. Also filter the generic
  // "Failed to load resource: 404" console message that the browser emits for favicon.
  const hasFaviconOnly = jsErrors.some(e => e.includes('favicon')) &&
    !jsErrors.some(e => e.startsWith('404:') && !e.includes('favicon'));
  const realErrors = jsErrors.filter(e =>
    !e.includes('favicon') &&
    !(hasFaviconOnly && e.includes('Failed to load resource'))
  );
  if (realErrors.length === 0) {
    log('  no JS errors ✓');
  } else {
    realErrors.forEach(e => {
      log(`  ERROR: ${e}`);
      errors.push(e);
    });
    pass = false;
  }

  await browser.close();
  return reportAndExit();
}

function reportAndExit() {
  log('\n=== Result ===');
  if (pass) {
    log('PASS ✓ — no crashes, all scenes render content');
    log(`Screenshots: screenshots/smoke/`);
    process.exit(0);
  } else {
    log('FAIL ✗');
    errors.forEach(e => log(`  • ${e}`));
    log(`Screenshots: screenshots/smoke/`);
    process.exit(1);
  }
}

run().catch(e => {
  log(`Fatal: ${e.message}`);
  process.exit(1);
});
