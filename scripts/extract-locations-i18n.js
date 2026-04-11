/**
 * Extract location strings (names, descriptions, hotspot labels) into i18n.
 * Run: node scripts/extract-locations-i18n.js
 */
import { LOCATIONS } from '../src/data/locations.js';
import { WORLD } from '../src/data/world.js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(__dirname, '..', 'src', 'data', 'i18n');

// Extract location strings
const locations = {};
for (const [id, loc] of Object.entries(LOCATIONS)) {
  locations[id] = {
    name: loc.name,
    description: loc.description || '',
  };
  if (loc.hotspots) {
    const labels = {};
    for (const hs of loc.hotspots) {
      if (hs.label) labels[hs.id] = hs.label;
    }
    locations[id].hotspots = labels;
  }
}

// Extract island names
const islands = {};
for (const [id, island] of Object.entries(WORLD.islands)) {
  islands[id] = {
    name: island.name,
    description: island.description || '',
  };
}

console.log('Location strings to add to i18n files:');
console.log(JSON.stringify({ locations, islands }, null, 2));

// Update en.js — read, parse, add locations/islands, write back
const enPath = join(i18nDir, 'en.js');
let enContent = readFileSync(enPath, 'utf-8');
// Insert before the closing };
enContent = enContent.replace(
  /\n\};?\s*$/,
  `,\n  "locations": ${JSON.stringify(locations, null, 2)},\n  "islands": ${JSON.stringify(islands, null, 2)}\n};\n`
);
// Fix indentation (2-space for nested)
writeFileSync(enPath, enContent);
console.log('Updated en.js');
