/**
 * Generate character voice MP3s using ElevenLabs API.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=xxx node scripts/generate-audio.js [options]
 *
 * Options:
 *   --lang en          Only generate for one language (default: all)
 *   --dialogue <id>    Only regenerate one dialogue
 *   --force            Ignore hash cache, regenerate all
 *   --list-voices      List available ElevenLabs voices and exit
 *   --dry-run          Show what would be generated without calling API
 *
 * Output: public/assets/audio/{lang}/{dialogueId}/{nodeId}.mp3
 * Cache:  src/content/audio-manifest.json  (commit this)
 * MPs:    gitignored — regenerate on deploy if needed
 */

import { createHash } from 'crypto';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────────

const API_KEY = process.env.ELEVENLABS_API_KEY;
const MANIFEST_PATH = join(ROOT, 'src/content/audio-manifest.json');
const VOICES_PATH   = join(ROOT, 'src/content/voices.json');
const PRONUN_PATH   = join(ROOT, 'docs/pronunciation.yaml');
const AUDIO_DIR     = join(ROOT, 'public/assets/audio');
const SUPPORTED_LANGS = ['en', 'fr'];

// Emotion → voice_settings overrides (applied on top of character base settings)
const EMOTION_OVERRIDES = {
  default:      {},
  worried:      { stability: -0.15, style: +0.20 },
  excited:      { stability: -0.25, style: +0.35 },
  very_excited: { stability: -0.35, style: +0.45 },
  awed:         { stability: -0.10, style: +0.25 },
  solemn:       { stability: +0.10, style: -0.10 },
  thoughtful:   { stability: +0.05, style: +0.05 },
  warm:         { stability: -0.05, style: +0.15 },
  whisper:      { stability: +0.15, style: -0.20 },
  curious:      { stability: -0.10, style: +0.15 },
  firm:         { stability: +0.10, style: +0.10 },
  concerned:    { stability: -0.10, style: +0.15 },
};

// ── Arg parsing ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt  = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };

const FORCE      = flag('--force');
const DRY_RUN    = flag('--dry-run');
const LIST_VOICES= flag('--list-voices');
const ONLY_LANG  = opt('--lang');
const ONLY_DLG   = opt('--dialogue');
const LANGS      = ONLY_LANG ? [ONLY_LANG] : SUPPORTED_LANGS;

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadJSON(path) {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, 'utf8'));
}

function saveJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function hash(...parts) {
  return createHash('sha256').update(parts.join('|')).digest('hex').slice(0, 16);
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function applyEmotionOverrides(base, emotion) {
  const ov = EMOTION_OVERRIDES[emotion] || {};
  return {
    stability:        clamp((base.stability        || 0.75) + (ov.stability        || 0), 0, 1),
    similarity_boost: clamp((base.similarity_boost || 0.75) + (ov.similarity_boost || 0), 0, 1),
    style:            clamp((base.style            || 0.30) + (ov.style            || 0), 0, 1),
    use_speaker_boost: base.use_speaker_boost ?? true,
  };
}

// ── Pronunciation YAML parser (minimal — reads only what we need) ─────────────

function loadPronunciation() {
  const raw = readFileSync(PRONUN_PATH, 'utf8');
  const result = {};
  let currentWord = null;
  let currentLang = null;
  let inWords = false;
  let inLanguages = false;

  for (const rawLine of raw.split('\n')) {
    const line = rawLine.replace(/#.*$/, '');      // strip comments
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed === 'words:') { inWords = true; continue; }
    if (!inWords) continue;

    const indent = line.length - line.trimStart().length;

    // Top-level word key (indent 2)
    if (indent === 2 && trimmed.endsWith(':') && !trimmed.startsWith('-')) {
      currentWord = trimmed.slice(0, -1).replace(/^"|"$/g, '');
      currentLang = null;
      inLanguages = false;
      if (!result[currentWord]) result[currentWord] = { languages: {} };
      continue;
    }

    if (!currentWord) continue;

    if (indent === 4) {
      if (trimmed === 'languages:') { inLanguages = true; continue; }
      if (trimmed.startsWith('ipa:') && !inLanguages) {
        result[currentWord].ipa = trimmed.replace(/^ipa:\s*["']?/, '').replace(/["']?$/, '');
      }
    }

    if (inLanguages && indent === 6 && trimmed.endsWith(':')) {
      currentLang = trimmed.slice(0, -1);
      if (!result[currentWord].languages[currentLang]) result[currentWord].languages[currentLang] = {};
      continue;
    }

    if (inLanguages && currentLang && indent === 8 && trimmed.startsWith('ipa:')) {
      result[currentWord].languages[currentLang].ipa =
        trimmed.replace(/^ipa:\s*["']?/, '').replace(/["']?$/, '');
    }
  }
  return result;
}

// Wrap fantasy words in SSML phoneme tags using ElevenLabs-compatible SSML
function applyPronunciation(text, pronunciation, lang) {
  let result = text;
  for (const [word, data] of Object.entries(pronunciation)) {
    const ipa = data.languages?.[lang]?.ipa || data.ipa;
    if (!ipa) continue;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b(${escaped})\\b`, 'gi');
    result = result.replace(re, `<phoneme alphabet="ipa" ph="${ipa}">$1</phoneme>`);
  }
  // Wrap in speak tags for SSML
  if (result.includes('<phoneme')) {
    result = `<speak>${result}</speak>`;
  }
  return result;
}

// ── ElevenLabs API ────────────────────────────────────────────────────────────

async function listVoices() {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': API_KEY },
  });
  if (!res.ok) throw new Error(`ElevenLabs voices: HTTP ${res.status}`);
  const { voices } = await res.json();
  return voices;
}

async function synthesize(text, voiceId, voiceSettings, modelId) {
  const isSSML = text.startsWith('<speak>');
  const body = {
    text,
    model_id: modelId || 'eleven_multilingual_v2',
    voice_settings: voiceSettings,
  };
  if (isSSML) {
    // ElevenLabs accepts raw SSML in the text field for supported models
    body.text = text;
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS: HTTP ${res.status} — ${err.slice(0, 200)}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

// ── i18n loader ───────────────────────────────────────────────────────────────

async function loadI18n(lang) {
  const path = join(ROOT, `src/data/i18n/${lang}.js`);
  // Dynamic import of the ES module — works in Node 18+
  const mod = await import(`${path}?t=${Date.now()}`);
  return (mod.default || mod).dialogues || {};
}

// ── Dialogue structure loader ─────────────────────────────────────────────────

async function loadDialogues() {
  const path = join(ROOT, 'src/data/dialogues.js');
  const mod = await import(`${path}?t=${Date.now()}`);
  return mod.DIALOGUES || {};
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  // List voices mode
  if (LIST_VOICES) {
    if (!API_KEY) { console.error('Set ELEVENLABS_API_KEY'); process.exit(1); }
    const voices = await listVoices();
    console.log('\nAvailable ElevenLabs voices:\n');
    for (const v of voices.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  ${v.voice_id}  ${v.name}  (${v.labels?.gender || '?'}, ${v.labels?.accent || '?'})`);
    }
    return;
  }

  if (!API_KEY && !DRY_RUN) {
    console.error('Error: ELEVENLABS_API_KEY not set.');
    console.error('Usage: ELEVENLABS_API_KEY=xxx node scripts/generate-audio.js [options]');
    process.exit(1);
  }

  const voices      = loadJSON(VOICES_PATH);
  const manifest    = loadJSON(MANIFEST_PATH);
  const dialogues   = await loadDialogues();
  const pronunciation = loadPronunciation();

  if (!manifest.audio) manifest.audio = {};
  let generated = 0, skipped = 0, errors = 0;

  for (const lang of LANGS) {
    console.log(`\n── Language: ${lang} ─────────────────────────────────────`);
    const i18n = await loadI18n(lang);

    for (const [dialogueId, dialogue] of Object.entries(dialogues)) {
      if (ONLY_DLG && dialogueId !== ONLY_DLG) continue;

      for (const [nodeId, node] of Object.entries(dialogue.nodes || {})) {
        if (!node.speaker) continue; // skip narration nodes

        const voiceProfile = voices[node.speaker];
        if (!voiceProfile) {
          console.warn(`  ⚠ No voice profile for: ${node.speaker}`);
          continue;
        }

        // Get localized text
        const localizedText = i18n[dialogueId]?.[nodeId]?.text || node.text;
        if (!localizedText) continue;

        // Apply pronunciation SSML
        const finalText = applyPronunciation(localizedText, pronunciation, lang);

        // Compute hash — changes if text, voice, or emotion changes
        const emotion = node.emotion || 'default';
        const nodeHash = hash(finalText, voiceProfile.voice_id, emotion, lang, voiceProfile.model_id);
        const manifestKey = `${dialogueId}.${nodeId}.${lang}`;

        if (!FORCE && manifest.audio[manifestKey]?.hash === nodeHash) {
          skipped++;
          continue;
        }

        const outDir  = join(AUDIO_DIR, lang, dialogueId);
        const outFile = join(outDir, `${nodeId}.mp3`);
        const relPath = `${lang}/${dialogueId}/${nodeId}.mp3`;

        if (DRY_RUN) {
          console.log(`  [dry] ${manifestKey} → ${relPath}  (${emotion})`);
          generated++;
          continue;
        }

        mkdirSync(outDir, { recursive: true });

        try {
          const settings = applyEmotionOverrides(voiceProfile, emotion);
          const mp3 = await synthesize(finalText, voiceProfile.voice_id, settings, voiceProfile.model_id);
          writeFileSync(outFile, mp3);

          manifest.audio[manifestKey] = { hash: nodeHash, file: relPath, emotion };
          generated++;
          console.log(`  ✓ ${manifestKey}  (${emotion}, ${(mp3.length / 1024).toFixed(0)} KB)`);
        } catch (e) {
          errors++;
          console.error(`  ✗ ${manifestKey}: ${e.message}`);
        }

        // Rate limit: ElevenLabs allows ~2 req/s on free tier
        await new Promise(r => setTimeout(r, 600));
      }
    }
  }

  if (!DRY_RUN) saveJSON(MANIFEST_PATH, manifest);

  console.log(`\n─────────────────────────────────────────────────────────`);
  console.log(`Generated: ${generated}  Skipped: ${skipped}  Errors: ${errors}`);
  if (DRY_RUN) console.log('(dry run — no files written, no API calls made)');
}

run().catch(e => { console.error(e); process.exit(1); });
