# Dualuna — Context for Claude Code

## What This Is
Adventure/strategy browser game. Phaser 3 + Vite.
Single dev project. See DEVLOG.md for full design context.

## Tech Stack
- Phaser 3 (Canvas, not WebGL)
- Vite 8
- Vanilla JavaScript (ES modules)
- GitHub Pages hosting
- No backend, no server, all static

## Architecture
```
src/scenes/    — Phaser scenes (engine layer, no content)
src/data/      — Game data (generated, don't hand-edit text)
src/systems/   — SaveManager, QuestManager, I18n
src/content/   — Source files (edit these to change content)
src/utils/     — Shared utilities (layout constants, etc.)
docs/          — Game design documents (game-design.md, scenario.md, pronunciation.yaml)
scripts/       — Build and tooling scripts
```

## Key Conventions
- All user-facing text goes through I18n.t() or I18n.tOr()
- Game state lives in Phaser registry, key 'gameState'
- Saves go through SaveManager, never raw localStorage
- Dialogue structure in data/dialogues.js (no text)
- English text source of truth: data/i18n/en.js
- Race colors belong in data/characters.js not in scenes
- Hotspot positions are per-location in data/locations.js

## What Not To Do
- Don't add text to dialogues.js (structure only)
- Don't hand-edit data/i18n/*.js (generated files)
- Don't hardcode strings in scene files
- Don't use localStorage directly (use SaveManager)
- Don't add 3D, WebGL shaders, or heavy CPU features
- Don't add any backend or server dependency
- Don't add registration or login requirements

## Known Limitations
- typeText() is a stub — shows text instantly, no typewriter animation
- Only 'en' and 'fr' are fully translated; other languages exist as stubs
- First fullscreen tap after page load is intermittent on mobile browser

## Platform Constraints
- Must work on 2012 laptop, 5-year-old phone, Firefox ESR
- Free, no registration, no backend ever
- All content pre-generated at build time
- Audio: MP3 only, streamed on demand, not preloaded
- Images: PNG only, pre-rendered backgrounds

## Game Design Principles
- Ordinary protagonist, not chosen hero
- Communal leadership, no commanding NPCs
- Moral ambiguity without clean resolution
- French cultural sensibility — pace, relationships, silence
- Relationships before plot — time with people is the point
- Authority earns trust, it is not assumed

## World — Key Facts
- Verdium is a living crystal network, not a mineral
- Surface races (few hundred people, 4 islands) and
  undersea civilisation (millions) are the same species
- Neither knows the other is intelligent
- Tremors = lattice healing itself, not mining directly
- The rose metaphor: safe to cut tips, fatal to cut trunk
- Moon cycles trigger transformation — player goes undersea
- Undersea name for surface races: "the ones who forgot"
- Ending: first sustainable harvest, not a battle

## Content Pipeline
- Source: src/content/ (write here)
- Generated: src/data/ (never hand-edit text fields)
- Hash-based caching: only regenerate changed nodes
- manifest.json tracks hashes for text and audio
- Build script: npm run generate

## Save System
- Tier 1: localStorage (always on)
- Tier 2: Export/Import JSON (config menu)
- Tier 3: Cloudflare Workers + KV (anonymous UUID)
- Save URL format: https://alban.github.io/dualuna/#s/[uuid]
- saveVersion field required in gameState for migration
