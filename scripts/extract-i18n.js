/**
 * Extract all dialogue text from dialogues.js into i18n/en.js
 * Run: node scripts/extract-i18n.js
 */
import { DIALOGUES } from '../src/data/dialogues.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dialogues = {};
for (const [dId, dialogue] of Object.entries(DIALOGUES)) {
  dialogues[dId] = {};
  for (const [nId, node] of Object.entries(dialogue.nodes)) {
    const entry = {};
    if (node.text !== undefined) entry.text = node.text;
    if (node.choices) {
      entry.choices = node.choices.map(c => c.text);
    }
    dialogues[dId][nId] = entry;
  }
}

const content = `// English — base language
export default ${JSON.stringify({ 
  ui: {
    newGame: 'New Game',
    continue: 'Continue',
    save: '💾 Save',
    map: '🗺 Map',
    back: '← Back',
    close: '▸ Close',
    continueDialogue: '▸ Continue',
    goTo: 'Go to:',
    verdium: 'Verdium',
    gameSaved: 'Game saved!',
    found: 'Found:',
    current: 'Current:',
    sailingTo: 'Sailing to',
    loading: 'Loading Dualuna...',
    chooseLanguage: 'Choose your language',
    subtitle: 'The Verdium Collector',
    tagline: 'A world of islands above, mysteries below',
    phase: 'Phase 1 — Chapter 1: The Mine Problem',
    worldMapTitle: 'The Islands of Dualuna',
  },
  dialogues,
}, null, 2)};
`;

const outPath = join(__dirname, '..', 'src', 'data', 'i18n', 'en.js');
writeFileSync(outPath, content);
console.log('English i18n file generated at src/data/i18n/en.js');
