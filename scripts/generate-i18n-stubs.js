/**
 * Generate stub i18n files for all non-English languages.
 * Copies English as a starting point.
 * Run: node scripts/generate-i18n-stubs.js
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(__dirname, '..', 'src', 'data', 'i18n');

const languages = {
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  hu: 'Hungarian',
  it: 'Italian',
  pl: 'Polish',
  pt: 'Portuguese',
  ru: 'Russian',
  cs: 'Czech',
};

const enContent = readFileSync(join(i18nDir, 'en.js'), 'utf-8');

for (const [code, name] of Object.entries(languages)) {
  const content = enContent.replace(
    '// English — base language',
    `// ${name} — TODO: translate\n// Copy of English, replace values with ${name} translations`
  );
  const outPath = join(i18nDir, `${code}.js`);
  writeFileSync(outPath, content);
  console.log(`  ✓ ${code}.js (${name})`);
}

console.log('\nDone! Stub files created. Replace English values with translations.');
