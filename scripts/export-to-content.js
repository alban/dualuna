/**
 * One-time bootstrap: converts existing i18n/en.js + fr.js dialogue sections
 * into human-readable src/content/dialogues/*.md source files.
 *
 * Run once: node scripts/export-to-content.js
 * After this, edit content files and run: npm run generate
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'src/content/dialogues');

const en = (await import('../src/data/i18n/en.js')).default;
const fr = (await import('../src/data/i18n/fr.js')).default;

// Group dialogue IDs into files by character/location
const GROUPS = {
  'narration': [
    'intro-mine',
    'examine-verdium-crate',
    'examine-cracks',
    'examine-water',
    'examine-vein',
    'harbor-travel',
    'examine-telescope',
  ],
  'foreman-kael': ['foreman-kael-default'],
  'dera': ['dera-default'],
  'elder-brin': ['brin-default'],
  'elder-mossa': [
    'roothold-default',
    'elder-mossa-default',
    'examine-flora',
    'examine-great-root',
  ],
  'tink': [
    'tink-default',
    'examine-machinery',
    'examine-blueprints',
    'examine-prototype',
  ],
  'scholar-elyn': [
    'scholar-elyn-default',
    'examine-mural',
    'examine-geology-archives',
    'examine-ancient-records',
    'examine-pedestal',
  ],
};

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const [filename, dialogueIds] of Object.entries(GROUPS)) {
  const lines = [];

  for (const dialogueId of dialogueIds) {
    const enNodes = en.dialogues?.[dialogueId];
    const frNodes = fr.dialogues?.[dialogueId];

    if (!enNodes && !frNodes) {
      console.warn(`  skipping ${dialogueId} — no i18n data`);
      continue;
    }

    lines.push(`# dialogue: ${dialogueId}`);
    lines.push('');

    const nodeIds = Object.keys(enNodes || frNodes);
    for (const nodeId of nodeIds) {
      const enNode = enNodes?.[nodeId];
      const frNode = frNodes?.[nodeId];

      lines.push(`## node: ${nodeId}`);
      if (frNode?.text) lines.push(`fr: ${frNode.text}`);
      if (enNode?.text) lines.push(`en: ${enNode.text}`);

      const choiceCount = Math.max(
        enNode?.choices?.length ?? 0,
        frNode?.choices?.length ?? 0,
      );
      for (let i = 0; i < choiceCount; i++) {
        if (frNode?.choices?.[i]) lines.push(`choice[${i}].fr: ${frNode.choices[i]}`);
        if (enNode?.choices?.[i]) lines.push(`choice[${i}].en: ${enNode.choices[i]}`);
      }

      lines.push('');
    }

    lines.push('');
  }

  const outputPath = join(OUTPUT_DIR, `${filename}.md`);
  writeFileSync(outputPath, lines.join('\n').trimEnd() + '\n');
  console.log(`Created ${filename}.md`);
}

console.log('\nDone. Edit files in src/content/dialogues/, then run: npm run generate');
