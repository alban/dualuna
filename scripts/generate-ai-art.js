/**
 * Generate AI backgrounds using Pollinations.ai free API.
 * No API key needed. Each image takes ~15-30 seconds.
 *
 * Usage: node scripts/generate-ai-art.js
 * Output: public/assets/backgrounds/<name>.png
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'backgrounds');
mkdirSync(OUT_DIR, { recursive: true });

const STYLE = 'Pre-rendered 3D scene in the style of retro graphic adventure. First-person viewpoint. Static scene, no characters visible. Rich textures on all surfaces. Atmospheric lighting with fog or haze. Muted earthy color palette. Painterly but semi-realistic.';

const PROMPTS = {
  'mine-entrance': `${STYLE} A mine entrance carved into a massive sea cliff face. Weathered wooden support beams frame a dark tunnel opening in the rock. The cliff is layered sedimentary rock with thin glowing green veins of mineral running through it. On the left, a view of the ocean far below. Wooden crates with faintly green-glowing ore stacked near the entrance. A dirt path leads along the cliff edge. Rope pulleys and mining tools hang from iron hooks. Late morning light, sea mist rising from below.`,

  'mine-shaft': `${STYLE} Interior of a deep mine shaft carved through dark rock. Thick wooden support beams line the tunnel. Glowing green mineral veins pulse faintly in the walls, providing dim emerald light. Iron lanterns hang from beams. The floor is damp with pooling water. Fresh cracks run across the far wall. The tunnel disappears into darkness ahead. Claustrophobic, atmospheric, damp.`,

  'tidewatcher-village': `${STYLE} A small coastal village perched on cliff tops overlooking the ocean. Rustic stone-and-timber cottages with thatched roofs, warm light glowing from windows. Vegetable gardens between houses. A winding stone path leads between buildings. Wildflowers and mossy stone walls. The ocean is visible in the background, far below the cliffs. Two moons faintly visible in a hazy sky. Peaceful, idyllic, golden-hour lighting.`,

  'cliff-overlook': `${STYLE} A dramatic cliff-edge viewpoint with a weathered brass telescope on a stone pedestal. Panoramic view of a vast ocean dotted with distant islands. Two moons hang in a pastel sky. Wildgrass and wind-bent shrubs on the cliff edge. A low stone wall along the precipice. Breathtaking sense of scale and distance.`,

  'forest-path': `${STYLE} A forest path winding through towering ancient trees with thick mossy trunks. Ferns and bioluminescent moss carpet the forest floor with a faint green glow. Sunlight filters through the dense canopy in misty shafts. Gnarled roots cross the path. The trees are impossibly tall and ancient, their bark textured with deep grooves. The air looks thick and humid. Mysterious, enchanted, primordial forest.`,

  'elder-grove': `${STYLE} A massive ancient tree dominates the scene, its trunk wider than a house, roots spreading across the ground like rivers of wood. The bark is covered in glowing moss. At the base, a natural clearing with flat stones arranged in a circle for gatherings. Hanging vines with faintly luminescent tips. Filtered green light from the immense canopy above. Sacred, serene, ancient atmosphere. The tree feels alive and aware.`,

  'harbor-workshop': `${STYLE} A quirky harbor with wooden docks, scattered with unusual mechanical inventions. Brass gears, copper pipes, half-assembled machines. Workshop buildings with smoking chimneys line the waterfront, mismatched sizes, covered in tools and hanging contraptions. Boats moored at the dock. Warm afternoon light reflecting off the water. Charming, cluttered, inventive.`,

  'inventors-lab': `${STYLE} Interior of an inventor workshop. Two large wooden workbenches covered with brass instruments, crystal probes, coiled wire, and scattered blueprints. Shelves lined with bottles, gears, and strange devices. A hanging oil lamp provides warm light. Blueprints pinned to the stone walls. A half-built device with crystal elements sits prominently. Warm, cluttered, genius-at-work atmosphere.`,

  'crystal-plaza': `${STYLE} An elegant open plaza with tall crystalline pillars that emit a soft violet-blue bioluminescent glow. The floor is polished dark stone with embedded glowing patterns. An ornate archway leads to the archives beyond. The architecture is organic yet refined, curves rather than straight lines, grown rather than built. The ambient light comes from the crystals themselves, casting soft colored shadows. Ethereal, mysterious, otherworldly.`,

  'archive-hall': `${STYLE} A long hall with alcoves on both sides, each containing shelves of translucent crystal tablets that glow faintly with stored knowledge. A central reading pedestal with a luminous crystal sphere hovering above it. The architecture is smooth dark stone with embedded crystal veins. Soft blue-violet light emanates from the tablets, creating a library-like atmosphere. Quiet, scholarly, ancient.`,

  'menu': `A dreamlike nightscape of a small planet seen from space. Several islands visible on a dark ocean, lit by two moons of different sizes. One moon is large and pale white, the other smaller and amber. Starfield in the background. The ocean shimmers with reflected moonlight. Atmospheric, mysterious, inviting. Painted style, semi-realistic.`,

  'worldmap': `A hand-drawn nautical chart on aged parchment, showing several islands scattered across an ocean. Each island has a distinct character: one with cliffs and mines, one with dense forests, one with workshop buildings, one with crystal spires. Compass rose in the corner. Two moon symbols in the margin. Ink and watercolor style, aged paper texture. Sea creatures hinted in the deep water.`,
};

async function generateImage(name, prompt) {
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&nologo=true&model=flux`;

  console.log(`  Generating ${name}...`);
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`  ✗ ${name}: HTTP ${response.status}`);
    return false;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = join(OUT_DIR, `${name}.png`);
  writeFileSync(outPath, buffer);
  console.log(`  ✓ ${name}.png (${(buffer.length / 1024).toFixed(0)} KB)`);
  return true;
}

async function run() {
  console.log('Generating AI backgrounds via Pollinations.ai...\n');

  const entries = Object.entries(PROMPTS);
  for (let i = 0; i < entries.length; i++) {
    const [name, prompt] = entries[i];
    console.log(`[${i + 1}/${entries.length}]`);
    let success = await generateImage(name, prompt);
    if (!success) {
      console.log('  Retrying in 5s...');
      await new Promise(r => setTimeout(r, 5000));
      await generateImage(name, prompt);
    }
    // Small delay between requests to be nice to the free API
    if (i < entries.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\nDone! All backgrounds saved to public/assets/backgrounds/');
  console.log('Run "make screenshots" to see them in context.');
}

run().catch(e => { console.error(e); process.exit(1); });
