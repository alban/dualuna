# Dualuna — Project Context & Devlog

## Project
- Game: Dualuna — adventure/strategy browser game
- Repo: https://github.com/alban/dualuna
- Live: https://alban.github.io/dualuna/
- Dev: solo, Linux laptop + Android phone
- Stack: Phaser 3 + Vite, JavaScript, GitHub Pages

## Inspirations
- a 1990s adventure-strategy game — travel between locations, community
  relationships, resource management, strategy map feeling,
  sietch-to-sietch structure, indirect influence not command
- Myst — graphic style, pre-rendered atmospheric visuals,
  stillness, world that exists without you
- a 1990s island RPG — island world with distinct
  civilisations, warm quirky characters, non-combat progression,
  communal warmth, humour from character not situation

---

## Development Setup

### Tools
- Claude Pro ($20/month) — Claude Code + Remote Control
- VPN tool (free tier) — connects Linux laptop to Android phone
- Remote Control: `claude remote-control` in project dir,
  scan QR code with Android app
  Works on Linux (Dispatch requires macOS/Windows, skip it)
- Testing: Claude Code runs Puppeteer on laptop,
  Vite dev server accessible from phone via VPN network
- Claude Code writes build scripts, runs tests, makes changes
  while dev walks outside with phone

### Memory Across Sessions
- Claude has NO persistent memory between conversations
- CLAUDE.md in repo root = auto-read by Claude Code each session
- This DEVLOG = persistent design memory
- To resume on any device/account: paste relevant section here
- Can reopen the original claude.ai conversation for full context

---

## Devlog

### 2026-04-21 — Character naming, portraits, dialogue fixes, UI polish

#### GitHub link on all non-game screens
Added to MenuScene and rotate-hint overlay (LanguageScene already had it).
Colour: #8899aa — matches existing secondary/version text, proven readable.
Dark background pill (backgroundColor #000000aa) ensures contrast over background images.
Font: Math.max(14*sy, 14)px — minimum 14px so it doesn't vanish on small screens.
rotate-hint uses fixed CSS 12px + text-shadow (HTML element, not Phaser).

### 2026-04-21 — Character naming, portraits, dialogue fixes

#### Character renames (French phonetics)
All four English-sounding character names replaced with French-sounding equivalents:
- Kael → Gaël (Breton, near-identical sound)
- Dera → Léra
- Tink → Lix (short, no gender, slightly mechanical)
- Elyn → Éline

Code IDs use unaccented forms (foreman-gael, lera, lix, scholar-eline).
Content files renamed accordingly (git mv preserves history).
Updated across: characters.js, dialogues.js, locations.js, quests.js,
all i18n files (en, fr, 8 stubs), all content dialogue files, scenario.md.

#### AI-generated character portraits
Each character now has a portrait image (256×256 PNG, Pollinations/flux model).
Portrait prompt lives in `src/content/characters/<id>.md`.
All portraits share a style suffix for visual consistency:
"Fantasy character portrait. Bust shot. Painterly, retro graphic adventure aesthetic.
Dark moody background. Dramatic warm amber side lighting."

Regenerate: `node scripts/generate-ai-art.js portraits`

Portraits shown:
- In DialogueScene: replaces the race-coloured circle in the portrait frame
- In LocationScene: replaces the coloured circle at hotspot positions
- Fallback: race-coloured silhouette if portrait not loaded

#### Dialogue freeze bug — two root causes fixed
Player could get permanently stuck in a dialogue with no way to exit.

**Bug 1 — No escape hatch:** backdrop had setInteractive() but no pointerdown
handler. If choices failed to render, nothing could be clicked.
Fix: permanent ✕ close button top-right of panel, always rendered first.

**Bug 2 — Silent empty-choices:** if node.choices exists (length > 0) but all
entries are filtered by requireFlag, the if-branch runs but forEach produces
nothing. The else-branch (Continue button) never executes. Player stuck.
Fix: if validChoices is empty after filtering, fall through to Continue button.

### 2026-04-21 — DPR rendering + smoke test session

#### Context
Three Claude Code sessions were lost mid-work due to a 403 auth error
("Account is no longer a member of the organization associated with this token").
All three sessions had uncommitted changes. On restart, we diagnosed the diff
and selectively reverted.

#### What was reverted (bad)
- DPR canvas patch in main.js — broke Phaser input (see root cause below)
- webkit fullscreen API changes in all scenes — broken logic + not the root fix
- generate-ai-art.js 1280→1920 resolution bump — Pollinations ignores larger sizes anyway
- index.html rotate-hint animation — untested

#### What was kept and committed
- `scripts/run-smoke.js` + `scripts/smoke-test.js` — Puppeteer smoke test that
  self-starts vite, checks all 5 scenes for JS errors and black screens at DPR=3
  (Android phone landscape). Bypasses click/input by using Phaser internal API
  directly. `make smoke-test` or `npm run smoke-test`.

#### DPR rendering — root cause of broken input (IMPORTANT)
mobile browser initialises the viewport in portrait orientation, then rotates.
Phaser's ScaleManager calls `updateBounds()` (which reads `canvas.getBoundingClientRect()`)
at init time while the canvas is portrait-sized (360×667 CSS). After rotation to landscape
(723×280), `canvasBounds` stays stale at 360×667 because `getParentBounds()` doesn't
always trigger `refresh()` after the canvas resize.

Result: `displayScale = baseSize / canvasBounds = 723/360, 280/667 = (2.01, 0.42)`.
Phaser multiplies every pointer coordinate by 2.01, placing all taps far off-screen.
Buttons appear to receive no input.

#### DPR rendering — correct fix
In `boostCanvas()`, after changing `canvas.width`/`canvas.style.width`, force Phaser
to resync its stale values:

```js
game.scale.updateBounds();                              // re-reads getBoundingClientRect
game.scale.displayScale.set(
  game.scale.baseSize.width / game.scale.canvasBounds.width,
  game.scale.baseSize.height / game.scale.canvasBounds.height
);                                                      // recalculates to (1, 1)
```

Also: call `boostCanvas()` inside the `preRender` patch every frame, because
`ScaleManager.updateScale()` (called from `step()` on every PRE_STEP tick) resets
`canvas.width` back to CSS size. Without the per-frame boost, the DPR buffer is
lost after the first Phaser internal resize cycle.

#### Debugging methodology — fetch-to-server logging
When phone debugging requires more than a screenshot (e.g. inspecting internal
Phaser state), inject debug JS that sends a fetch request with data encoded in
the URL query string. Vite won't log these by default, so add a middleware plugin
to vite.config.js to capture them:

```js
// vite.config.js — temporary, remove after debugging
plugins: [{
  name: 'dbg-logger',
  configureServer(server) {
    server.middlewares.use('/dbg', (req, res) => {
      console.log('[DBG]', req.url);
      res.writeHead(200);
      res.end('ok');
    });
  },
}]
```

In the game JS:
```js
fetch('/dbg?' + new URLSearchParams({ key: value, ... })).catch(() => {});
```

Advantages over screenshots: no round-trip delay, captures exact numeric values,
can fire on every tap automatically, readable directly in server logs.
Remove both the fetch calls and the vite plugin before committing.

#### Status at end of session
Fix implemented in `src/main.js`, not yet confirmed working on phone.
Debug fetch logging is still in main.js — remove before committing.
The debug middleware is still in vite.config.js — remove before committing.

#### Remaining known issues
- Fullscreen first-tap sometimes does nothing (pre-existing, unrelated to DPR)
- All debug code needs cleanup before commit

### 2026-04-19 — Full design and architecture session
(mobile chat, claude.ai account separate from laptop account)

---

## CODE REVIEW FINDINGS

### Bugs to Fix
- Missing `import Phaser from 'phaser'` in LocationScene.js
- raceColors hardcoded identically in LocationScene.js
  AND DialogueScene.js — move to characters.js as color
  property per character
- pointermove forces render tick — throttle or remove
- typeText() is a stub — implement typewriter or remove wrapper
- MenuScene uses raw localStorage instead of SaveManager.hasSave()

### Architecture Issues
- en.js and dialogues.js both contain English text — duplication
  en.js should be sole source of truth for English text
  dialogues.js should contain structure only (node graph, effects)
- i18n fallback pattern duplicated everywhere:
  `I18n.t(key) !== key ? I18n.t(key) : fallback`
  → add I18n.tOr(key, fallback) helper method
- raceColors in scenes = scenario data inside engine code
- world.js and locations.js both track island/location membership,
  can get out of sync

### What's Already Good
- 1 FPS + forced render on input: clever for turn-based,
  saves battery/CPU
- Clean scene-based architecture
- State management via Phaser registry is consistent
- Quest flag system in applyEffects clean and extensible
- Mobile-first design (touch targets, landscape hint)
- French translation complete and high quality
  "rat de galerie" for cave-dweller — perfect
  Tink's speech pattern preserved well

### French Translation Notes
- "Bien vu, petite" for "Smart girl" — petite adds
  condescension not in English, may be intentional
- "Ancien Brin" grammatically masculine — consider
  neutral form if Brin is non-binary

---

## CONTENT PIPELINE

### Separation: Source vs Generated

```
src/
  content/               <- SOURCE (you edit these)
    scenario.md          <- lore bible — WRITE THIS FIRST
    acts/
      chapter1.md        <- plot outline
    dialogues/
      foreman-kael.md    <- per character, SSML markers
      foreman-kael.fr.md <- language-specific pronunciation
    characters/
      foreman-kael.md    <- includes voice profile
    pronunciation.yaml   <- global fantasy word pronunciations
  data/                  <- GENERATED (never hand-edit)
    dialogues.js         <- structure only, no text
    i18n/
      en.js              <- generated from content/
      fr.js              <- generated
    audio/
      en/                <- generated, expensive
      fr/
    manifest.json        <- hash-based cache index
```

### Hash-Based Caching — Critical for Audio Cost
- Each dialogue node gets hash of source text
- Build script only calls TTS API when hash changed
- Fixing one typo = one TTS call, not full regeneration
- Same principle for translations
- manifest.json tracks: en_hash, per-language hashes,
  audio file paths

### What to Commit to Git
- YES: content/ — always
- YES: data/dialogues.js — structure only
- YES: data/i18n/*.js — so game works without build
- YES: audio/manifest.json
- NO: audio/*.mp3 — gitignore OR use Git LFS

### Build Script (`npm run generate`)
1. Read content/dialogues/*.md
2. Generate data/dialogues.js (structure, no text)
3. Hash check each node vs manifest
4. Call Claude API for new/changed translations only
5. Call TTS API for new/changed audio only
6. Update manifest

---

## AUDIO / SSML SYSTEM

### Voice Profiles in Character Files

```yaml
voice:
  description: "Deep, weathered, slow. Like stone that
                learned to speak. Calm under pressure."
  pace: slow
  pitch: low
  tts_provider: elevenlabs
  voice_id: "xyz123"    # pin specific voice, prevents drift
  stability: 0.8
```

### SSML for Word-Level Control
- Industry standard: ElevenLabs, Google, Azure, Polly
- Use for: emphasis, pauses, prosody, phoneme pronunciation
- Build script converts source markers to full SSML
- Per-provider adapter layer — write once, convert to
  whatever provider needs, switch providers without
  rewriting source files

### Global Pronunciation Dictionary

```yaml
# content/pronunciation.yaml
words:
  Verdium:
    ipa: "vɜːdiəm"
    languages:
      fr:
        ipa: "vɛʁdjɔm"
  Tidewatcher:
    ipa: "taɪdwɒtʃər"
  Korrim:
    ipa: "kɒrɪm"
  Luminari:
    ipa: "luːmɪˈnɑːri"
```

- Build script auto-wraps every occurrence in phoneme tags
- Annotate once, applies everywhere, all languages
- DO THIS FIRST before generating any audio

### Recommended Order
1. Write pronunciation.yaml for all fantasy words
2. Add voice profiles to character files
3. Build hash-checking build script (Claude Code task)
4. English audio first, validate pipeline
5. Add French once English solid

---

## SAVE SYSTEM

### Three-Tier System, All Optional

**Tier 1: localStorage (already done)**
Always on, invisible, per browser per origin

**Tier 2: Export/Import JSON (implement first, easy)**
Config menu: Download save file / Load save file
Player manages file themselves
Zero infrastructure, works everywhere

**Tier 3: Anonymous cloud save**
Cloudflare Workers + KV
No registration — UUID as anonymous identity
UUID stored in localStorage + shown to player to keep
Free at this game's scale, ~10 lines of Worker code
If UUID lost: cloud gone, local save still works

### Save URL

```
Format: https://alban.github.io/dualuna/#s/[uuid]
```

- On load: check hash, fetch from KV, store locally,
  store UUID, clean hash, boot normally
- Language inferred from save data, not needed in URL
- Clean hash after load (prevent accidental sharing)

Config menu options:
- Copy save link
- Show QR code (phone to laptop switching, tiny JS lib)

Security: anyone with URL has save access.
Fine for single-player, mention briefly in UI.

Bonus: cooperative/family play on shared save —
free consequence of design, not a feature to build.

### Notification Timing
Show after museum tutorial quest completion.
Warm tone, not alarming, respects immediate refusal:

```
"Your save may be lost if you clear browser data.
 Want to back it up? / No thanks / Don't ask again"
```

### Save System TODOs
- Add saveVersion: 1 to gameState NOW
- Add save migration logic on load
- Export/Import JSON buttons in config menu
- Cloudflare Worker + KV (after launch if needed)
- Save URL / QR code UI

---

## PWA / OFFLINE

- vite-plugin-pwa for service worker generation
- JS/CSS/images: pre-cached at install (automatic)
- Audio: CacheFirst runtime — builds up through play
- Config menu: opt-in "Download for offline" per language
- manifest.json doubles as offline download index
- Low bandwidth mode toggle: text only, no audio

### Progressive Enhancement Layers

**Layer 0: Core (very old browser, always works)**
Text dialogue, PNG backgrounds, basic interaction

**Layer 1: Full experience (modern-ish browser, automatic)**
Phaser 3, audio on demand, ambient sound

**Layer 2: PWA (opt-in)**
Offline, downloaded audio, home screen install

---

## PLATFORM CONSTRAINTS

- Free, no registration, no backend server
- Web: mobile + desktop
- No 3D, low CPU
- Target: 2012 laptop, 5-year-old phone, Firefox ESR
- Static hosting on GitHub Pages

### Current Stack Already Correct
- Phaser 3 Canvas (not WebGL) ✓
- 1 FPS = near-zero idle CPU ✓
- Pre-rendered PNG backgrounds ✓
- GitHub Pages ✓
- localStorage ✓
- All content pre-generated at build time ✓

### Audio
- MP3 only as primary format
- Stream on demand, don't preload all
- Estimated Chapter 1: ~50MB for 2 languages
- Low bandwidth mode: text only

### GitHub Pages Specifics
- Hash-based routing (/#/location) not path routing
- 404.html = copy of index.html
- HTTPS automatic — required for PWA + Web Audio API
- Git LFS if audio grows large across chapters

### Pre-Release Test Targets
- 5-6 year old phone on 3G
- 2012 laptop on WiFi
- Firefox ESR latest

---

## BACKGROUND IMAGES + HOTSPOTS

- Images AI-generated at build time — non-deterministic
- Pixel coordinates break on every image regeneration
- Decision: pin images in manifest, only regenerate
  explicitly when prompt changes

### Zone-Based Hotspot System (Long Term)

```js
hotspots: [
  { id: 'kael', zone: 'center-foreground' },
  { id: 'mine-entry', zone: 'right' },
]
```

Image prompts written to match zones semantically.
Engine converts zone names to pixel rectangles at runtime.
Possible addition: vision model validates zone placement
post-generation.

---

## WEEKLY QUEST GENERATION PIPELINE

### Flow
Short brief (2-3 paragraphs) → Claude generates:
quest data, dialogue trees, i18n strings,
suggested hotspots, character reactions

- Requires scenario.md to maintain consistency
- Requires voice profiles so Tink sounds like Tink
- Human review before commit — AI as first draft
- Review non-negotiable before audio generation

### Strategy Map Generates the Brief Automatically
Lattice health + character states + recent events
→ Claude writes this week's crisis description
→ Dev reviews and approves
→ Pipeline generates content

---

## BUTTERFLY EFFECT + COMBINATORIAL EXPLOSION

### Hybrid Approach

**Layer 1 — Structural beats (20% content, 80% weight)**
Fully pre-written, fully crafted, never generated.
Museum tremor, first contact, transformation, final harvest.

**Layer 2 — Character reactions**
Templates + pre-written variants for common flag combos.
Generate + cache for rare combinations.

**Layer 3 — Ambient/incidental dialogue**
Generated at runtime or build time.
Lower quality bar, texture not story.

**Layer 4 — Butterfly effect callbacks**
Few, precious, pre-written.
10 perfect callbacks > 100 adequate ones.
Player feels seen because RIGHT things are tracked.

### Player Profile Instead of Flag Explosion

```js
playerProfile: {
  curiosity: 0.8,
  caution: 0.3,
  trust_brin: 60,
  trust_dera: 85,
  key_moments: ['museum-tremor-doubt', 'first-shaft-touch']
}
```

Generation prompt uses profile not flag list.

### Audio Cost Management
- Pre-generate for high-probability paths
- On-demand TTS + caching for rare combinations
- Simpler voice for ambient, full voice for beats
- Mixed voiced/unvoiced is a legitimate artistic choice

### Cultural Note — Important
Butterfly effect fantasy = American individualism
(individual at centre, world radiates from their choices)

French/European alternative:
- World has its own momentum
- Same events occur for everyone
- What varies: relationships, access, understanding
- Combinatorial space = who you are + who trusts you,
  not what happens

The world has its own logic. You navigate it.
You are not the author of events. You are a participant.

---

## CULTURAL AUTHORSHIP

Core principle: not translation but original imagination.
Games from the 90s that resonated most because conceived from French sensibility.
Dualuna should think in French, not translate from English.

### What to Preserve
- Pace and silence — don't rush, don't fill every moment
- Relationships before plot — time with people is the point
- Moral ambiguity without clean resolution
- Ordinary life depicted with respect
- Humour from character, understated, absurd treated seriously
- Authority not automatically legitimate — official
  explanations are wrong, personal investigation finds truth
- Collective action over individual heroism

### What to Avoid
- Waypoints telling player exactly where to go
- XP/reward systems making relationships transactional
- Villains wrong because evil, not circumstance
- Player power fantasy — accumulation, domination
- Clean endings that resolve all ambiguity
- Comedy that explains itself

### Language
- Write dialogue FIRST IN FRENCH — conceived in French
- Translate to English as faithful adaptation
- French is original, English is translation
- Thought structure will be different and that is correct

### The Test
Could this game only have been made by someone from
this particular cultural imagination?
If yes — you're on the right track.

---

## WORLD DESIGN

### Physical Model

**What Verdium Actually Is**
- Living crystal — between coral and nervous tissue
- Grows over centuries, forms vast networks
- Undersea civilisation grew it — it is their infrastructure,
  nervous system, and life support simultaneously
- Surface races found tips protruding into cliff faces
  and started mining without knowing what they were

**The Rose Metaphor — Core of Everything**
- Mining Verdium = pruning a rose
- Safe: cut at branch tips (surface veins)
- Fatal: cut between root and branch (deep trunk sections)
- Surface races have been cutting at the trunk unknowingly
- Solution: undersea people teach where to cut safely
- Requires permanent communication between civilisations

**Geography**

```
SURFACE
[cliff face / island rock]    <- surface races live here
[basalt layer — 40m thick]    <- Tink's number from dialogue
[verdium lattice network]     <- connects everything
[ocean floor]
[undersea city]               <- built within the lattice
[deep ocean]
```

**The Damage Mechanism**
- Severed vein → pressure imbalance → seawater migrates
  upward through empty channel (explains salt water in mines)
- Tremors NOT caused by mining directly
  Caused by lattice healing itself — contracting like wound
  Rhythmic because biological
- Undersea response: pressure buttresses (paratonnerres)
  reinforcing weakened sections
  Side effect: pushes upward through basalt → cracks cliffs
- Feedback loop:
  more mining → more buttresses → more cracks →
  faster mining to stockpile → more damage
- Neither side knows the other exists
- Neither side is doing anything wrong

**Scale Inversion — Most Important Design Element**
- Surface: 4 small islands, few hundred people, intimate,
  knowable, cozy
- Undersea: vast, cities of millions, spans entire ocean
  floor, infrastructure continent-sized
- Player goes below → scale revelation — best scene in game
- Everything the player knew was just the tip
- Surface races are to undersea as remote island tribe
  to continental civilisation
- Undersea have known surface exists, studied them,
  never contacted — asymmetry of scale, no shared medium
- Until mining became political problem not curiosity

**Shared Origin — The Central Secret**
- Surface and undersea are the SAME SPECIES
- Islands are geologically young
- Previous tidal event pushed undersea community upward,
  stranded them on newly-formed islands
- Memory lost over generations
- The whole game is the act of remembering
- The diplomacy at end is not two species meeting —
  it is a family reuniting after generational amnesia

**Moon Cycles + Transformation**
- Twin moons create complex tidal cycles
- Rare alignments flood lattice with energy
- Triggers transformation in surface-dwellers near lattice
  (miners especially — years of proximity, biological
  sensitivity built up)
- Not magic — dormant biological pathways activating
- Transformation = how player can go undersea
- Undersea people call transformed ones "the returned"
- Gender system (Depths/Heights, Spring/Winter, Weaver)
  = moon phase descriptors, forgotten meaning
  Already in character data — characters are telling us
  what phase they are in without knowing it matters

**Verdium Counter Splits Into**

```js
verdium: {
  stockpile: 340,
  debt: 12,         // trunk sections severed, permanent damage
  sustainable: false
}
```

**The Solution / Ending**
- Not "stop mining" — surface needs Verdium to survive
- Undersea teach surface WHERE to cut safely
- Sustainable harvesting: tips only, never trunk sections
- Requires permanent communication between civilisations
- Game ends with first sustainable harvest, together
- A Tidewatcher miner learning from undersea elder
  exactly where to place a chisel
- Small, quiet, revolutionary
- Game ends not with a battle but with the first conversation

### Telepathy / Communication

**Not a gift — a skill anyone can learn**
- Requires: proximity to lattice nodes, biological
  sensitivity from Verdium exposure, and crucially —
  knowing the lattice is alive and TRYING
- Player is first because first to believe and try
- Authority = perspective, not rank

**Others Develop It Too**
- Dera: fast, intuitive, will share everything with everyone
- Tink: via device, precise but cold, communicates data only
- Mossa: already had version (called it earth-feeling),
  slow but far-reaching
- Undersea people: have had it for generations

**Communication Range = Lattice Health**
- Fix the lattice → extend your reach
- Ecological restoration and communication are the same thing
- Moon phases affect range — strategic timing element

**Relay Network = People You've Trusted and Developed**
- Not infrastructure you build
- Your communication range IS your relationship map
- Each person communicates according to their personality:
  Dera: impulsive, warm, shares everything
  Tink: precise, data only, tries to systematise
  Mossa: slow, far-reaching, interpretation takes time

**Origin**
- Undersea civilisation built around this network
- Surface races lost access when stranded and forgot
- Player isn't learning something new — remembering ancient
- Undersea name for surface races: "the ones who forgot"

---

## STORY STRUCTURE

### Chapter Arc
1. "Something is wrong"
   Exploration, museum, friend group, simple quest. No strategy.
2. "Something is alive"
   Horror/wonder of realising scale.
3. "We caused this"
   Guilt, debt counter starts mattering.
4. "We are them"
   Transformation, world from below, vast scale revealed.
5. "Here is where you can cut"
   First sustainable harvest together.

### Why Player Must Be Ordinary Character
- A leader would send an ambassador
- Only someone with no power, no agenda, no choice goes
- Player's authority = perspective, not rank
- Only being who has lived as both civilisations
- Can translate not just language but experience
- Practices small diplomacy (friend group, curators)
  before civilisational diplomacy — same skill

### The Undersea Diplomacy Challenge
- Not symmetric negotiation — civilisation of millions
  vs few hundred surface people
- Undersea politicians: "not worth the effort, just
  reinforce lattice and wait"
- Player must make case that surface people matter
- Argument that wins is not political — it is biological
- Player transformed, standing in undersea parliament,
  IS the argument

---

## CHARACTERS

### The Curator Couple

**Who They Are**
- Friend of player, organised the museum
- Private opening visit = tutorial setting
- Healthy relationship with difficulties —
  humour not stress, normalised disagreement
- Player witnesses relationship, does not manage it
- Conflict is theirs to resolve, player at margins only

**Curator A**
- Rigorous, evidence-based, official explanation believer
- Identity built on knowing things — expertise, certainty
- Arc: hardest conversion, most meaningful acceptance
  Loses foundation, then rebuilds on better data
  Does not tell anyone when they change their mind —
  just starts asking different questions one night alone

**Curator B**
- Romantic, questioner, pushed for mythology section
- Intuitive, drawn to old myths and fragments that do not fit
- Arc: vindication is complicated, not triumphant
  Being right when nobody believed is lonely then relieving
  then overtaken by scale of what being right means

**Suggested: Cross-Race Couple (Luminari + Korrim)**
- Maps intellectual disagreement onto cultural difference
- Curator A's rigour = Luminari archive tradition
- Curator B's romanticism = Korrim earth-feeling, old songs
- Their relationship = small act of cross-cultural translation
  Rehearsal for civilisational diplomacy to come

**The Gift Quest (Mid-Game)**
- One curator asks player to help find meaningful gift
- Not urgent, not world-ending — ordinary amid crisis
- Tests whether player has been paying attention
- Gift must be world-specific, not generic
  (a sourced text fragment, geological sample, old song
   recording — something that says "I see what you care about")
- Resolution happens offscreen or witnessed, no intervention
- Player arrives one day to find them laughing — worked it out

**Final Scene**
- Rewriting museum exhibits together
- Combining evidence and memory
- Neither could have written it alone

**Their Tone**
- Warmth sets emotional register for whole game
- Makes stakes human-scale: worth saving because
  these specific people are in it

### The Museum

**Purpose**
- Opening day = tutorial, private visit, friend is curator
- Every exhibit is incomplete — true as far as it goes
- Player reads exhibits as tourist first
- Returns later with knowledge, reads differently
- Museum is foreshadowing engine

**Exhibit Panels**

```
EXHIBIT A: "Ocean floor shows no unusual features."
[later: undersea civilisation spans entire ocean floor]

EXHIBIT B: "Verdium formed under volcanic pressure."
[later: it's alive, tended, someone's infrastructure]

EXHIBIT C: "Periodic tremors — completely natural.
            Nothing to worry about."
[later: someone is screaming and this is what
        it sounds like from above]
```

**Mythology Section**
- Curator B insisted on it
- Contains: old songs, legends, artwork of figures
  neither surface nor undersea, unreadable script
- Unreadable script = undersea language
- Player reads it post-transformation
- It says: "the ones who forgot"
  (undersea name for surface races)

**Recurring Location**
Player returns at key moments:
- After learning lattice is alive
- After transformation — can now sense lattice beneath floor
- At end — final scene, new exhibit being written

**Tutorial Quest: "Opening Day"**

Three small tasks before tomorrow's public opening:

1. Check exhibit accuracy
   Player's miner knowledge catches an error
   Teaches: examine hotspots, your background matters

2. Find missing Verdium sample
   Someone in friend group borrowed it, forgot to return
   Teaches: talk to characters, follow dialogue chains

3. Help with opening ceremony wording
   Curator asks what the museum should be FOR
   Choice seems trivial — game remembers it
   Teaches: choices have weight even when small

**The Tremor Mid-Quest**
- Happens during task 2 or 3, not at the end
- Cracks the tremor exhibit panel specifically:
  "Completely natural. Nothing to worry about."
- Friends make a joke, laugh too hard
- Hairline crack visible when player leaves
- Game remembers it

**Butterfly Callback**
Player can express doubt about tremors during tutorial:
- "Has anyone actually studied them properly?"
- "The one at dawn felt different somehow."

Chapters later, curator says:
"You said that in the museum. I should have listened."
Player may not remember saying it. The world did.

### The Friend Group

**Why It Matters**
- Communal feeling from scene one
- World feels inhabited and worth protecting
- Stakes are human: these specific people
- Safety of opening makes everything after more frightening

**Suggested Composition**
- Dera: closest friend, in the mine, curious and warm
  Already established in game
- The skeptic: thinks tremors are nothing, has family
  to feed, can't afford mine to close
  Arc: slowly convinced, represents everyone who needs
  status quo to be okay
- The half-knower: strange dreams near the mine,
  relieved when player investigates
- The practical one: keeps group fed, housed, grounded
  Reminds player why it matters

**Friendships Fracture Under Weight of Truth**
Not to death — to disagreement, fear, inability to accept.
A friendship fracturing over what the world actually is
more affecting than any action sequence.

---

## GAME MECHANICS

### Strategy Layer (Influence Without Military)

**Core Principle**
Not commanding units — influencing web of relationships.
Each character has: trust level, knowledge state,
current mood, current independent action.
What you tell them changes what they do on their own.
Strategy = who do I tell what, in what order.

**Character Knowledge States**

```js
'foreman-kael': {
  trust: 60,
  knowledge: ['tremors', 'salt-water', 'hollow-sound'],
  mood: 'worried',
  currently: 'monitoring-lower-shaft'
},
'village-elder-brin': {
  trust: 40,
  knowledge: ['tremors'],
  mood: 'cautious',
  currently: 'considering-mining-expansion'
}
```

**Strategy Map View**
- Surface map (small, intimate) + undersea map (vast)
- Connected by lattice + player who moves between
- Per location: lattice health colour, community activity,
  current dominant belief, trust indicators
- Per character: location, pending messages, mood,
  what they are about to do (if trust high enough)
- Per lattice section: health, trunk vs branch,
  time until critical damage at current mining rate
- Time: moon cycle counter, week counter

**The Player's Unique Value**
- Brin sees Cliff Haven economy
- Tink sees sensor readings
- Mossa feels lattice through roots
- Undersea people see their damage
- Only player sees ALL simultaneously
- Other characters start sending player messages
- Player becomes nervous system connecting all nodes
- Authority = perspective, not rank or power

### Companion System — Communal Leadership

**Core Principle**
- Player is not boss
- Leadership rotates by situation
- In the mine: Dera leads
- In Elder Grove: Mossa leads
- Group of equals with different strengths

**Mechanics**
When companion takes point:

```
[Dera steps forward]
"Let me handle this. I know these tunnels."

> "Go ahead"
> "I'll come with you"
> "Actually, wait—"
```

Player chooses RELATIONSHIP to moment, not outcome.
Options: defer / support / redirect.

**Some Quests: Companion Is Protagonist**
Player's role: support, open doors, know when to step back.
Challenge: being a good friend to someone solving their quest.
Almost never done in games.
Maps onto theme: nobody is chosen one.

**Companions Act by Personality When Unsupervised**
Player prepares them, informs them, trusts them.
Consequences follow from quality of preparation.
Strategy is in preparation and trust, not execution.

### Weekly Quest Generation

**Brief Format (You Write)**
2-3 paragraphs describing:
- What is happening this week in the world
- Which character is at the centre
- What the player needs to do
- What the complication is

**Pipeline Generates**
- Quest data (objectives, flags, completion effects)
- Dialogue trees for all involved characters
- i18n strings for all languages
- Suggested hotspot positions
- Character reactions based on current trust/knowledge

**Strategy Map Auto-Generates Brief**
Lattice health + character states + recent events
→ Claude writes crisis description
→ Dev reviews and adjusts
→ Pipeline generates content
→ Human reviews quality before commit
→ Audio generated only for approved content

---

## IMMEDIATE TODOS (Priority Order)

1. Write scenario.md — lore bible, DO THIS FIRST
   Before any more code or content.
   Include: world physics, character voices, tone,
   ending you are building toward.

2. Write content/pronunciation.yaml
   All fantasy words: Verdium, Tidewatcher, Korrim,
   Luminari, Velessi, Dualuna, Deepkin, Coralline.

3. Fix LocationScene.js — add missing Phaser import

4. Move raceColors into characters.js

5. Add I18n.tOr(key, fallback) helper method

6. Add saveVersion: 1 to initial gameState in MenuScene.js

7. Fix MenuScene to use SaveManager.hasSave()

8. Implement Export/Import JSON save buttons

9. Build hash-based content pipeline
   (Claude Code task: claude remote-control, ask it to
   write the build script)

10. Add vite-plugin-pwa

11. Design zone-based hotspot system

12. Write CLAUDE.md for repo root
    (Claude Code reads this automatically each session)

---

*Last updated: 2026-04-19*
*Next session: start with scenario.md*
*Full conversation archived in claude.ai*
