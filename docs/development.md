# Development Notes

## Architecture

### Rendering
- **Phaser.js 3** with Canvas2D renderer (not WebGL) for minimal GPU usage
- **1fps** idle rendering with force-render on pointer events for instant input response
- **Static PNG backgrounds** pre-rendered by `scripts/generate-backgrounds.js` using node-canvas
- Never use Phaser Graphics objects for complex backgrounds — causes 100% CPU/GPU

### Internationalization
- All user-facing text goes through `src/systems/I18n.js`
- Language files: `src/data/i18n/<lang>.js` (en, fr translated; de, es, hu, it, pl, pt, ru, cs are stubs)
- Dialogue structure (branching, effects, flags) lives in `src/data/dialogues.js`
- Translated dialogue text lives in i18n files
- I18n is preloaded in BootScene before any scene renders

### Game State
- Stored in Phaser registry during gameplay
- Persisted to `localStorage` via SaveManager
- Language preference saved separately in `localStorage`

## Build & Development

```bash
# Prerequisites: Node.js 22+ (use nvm)
nvm use 22
npm install

# Development
make dev            # Start dev server on port 4444
make art            # Regenerate background PNGs
make build          # Production build to dist/
make screenshots    # Generate screenshots (requires dev server running)
make i18n           # Extract dialogue strings to i18n
make i18n-stubs     # Generate stub translation files
```

## Deployment
- GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys to GitHub Pages on push to `main`
- Vite base path set to `/dualuna/` in `vite.config.js`

## Adding a New Language
1. Add the language code and name to `I18n.SUPPORTED_LANGUAGES` in `src/systems/I18n.js`
2. Copy `src/data/i18n/en.js` to `src/data/i18n/<code>.js`
3. Translate all string values (keep keys, structure, and proper nouns unchanged)
4. Add the language code to `TRANSLATED_LANGUAGES` in `src/scenes/LanguageScene.js`

## Adding a New Location
1. Add location data to `src/data/locations.js` (name, connections, hotspots)
2. Add drawing function to `scripts/generate-backgrounds.js`
3. Run `make art` to generate the background PNG
4. Add the location to the appropriate island in `src/data/world.js`
5. Add location strings to all i18n files (`src/data/i18n/*.js`)
6. Add any dialogues to `src/data/dialogues.js` and i18n files

## Design Principles
- **Mobile-first touch targets**: all interactive elements must be large enough for finger taps
- **Minimal CPU/GPU**: static images, low FPS, no animations unless needed
- **Short, punchy dialogue**: 1-2 sentences per text bubble, conversational tone
- **No typewriter effect**: text appears instantly
- **Config menu**: groups Save/Language/Fullscreen/Restart behind a single ⚙ button
- **Backgrounds at full canvas height** (768px): UI bar draws on top
