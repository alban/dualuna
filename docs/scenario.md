# Dualuna — Scenario Bible

> This file is the source of truth for the game's world,
> characters, and tone. Claude Code reads this to maintain
> consistency when generating quests, dialogue, and content.
> Write in French first, translate to English.

---

## The World

### Geography
Four small islands on the surface of planet Dualuna.
Population: a few hundred people total. Intimate, knowable,
cozy. The ocean appears to be an impassable barrier.

Beneath the ocean: a vast civilisation of millions.
Cities spanning the entire ocean floor. Infrastructure
that makes the surface villages look like anthills.
The surface races do not know it exists.

### Verdium
A living crystal that grows in networks connecting the
ocean floor up through the basalt and into the island
cliff faces. It grows over centuries, tended like a garden.

To surface races: a precious mineral resource.
To undersea people: their infrastructure, nervous system,
and life support — the way a city needs its wiring.

The rose metaphor is the core of everything:
- Safe to harvest: branch tips (surface veins)
- Fatal to sever: trunk sections (deep connections)
Surface races have been cutting at the trunk for generations,
not knowing the rose was alive or that anyone tended it.

### The Two Civilisations
The same species. Separated thousands of years ago when
a tidal event stranded an undersea community on
newly-formed islands. Memory of this was lost over generations.

Surface races: Tidewatcher, Korrim, Velessi, Luminari
Undersea races: [TO BE DESIGNED]

Neither knows the other is intelligent.
Neither is doing anything wrong.
Both are accidentally harming each other.
This is not a story about villains.

### The Two Moons

Two moons, different in everything:
- Different colours (one amber/warm, one silver/cold)
- Different sizes in the sky (different distances)
- Different orbital cycles, not synchronized

Their combined light creates an ever-changing palette on the
planet surface. No two nights are alike. Sometimes only one
moon is up. Sometimes both, their colours mixing. Sometimes
neither. The interplay of amber, silver, and darkness — over
the blue of day, the orange of dawn, the red of dusk — means
the planet never looks the same twice.

**Rendering implication:** background images should be tinted
at runtime based on the current day phase and moon state.
A Phaser tint or color overlay on the bg image, computed
from game state. No regeneration needed — the same image
reads completely differently under amber moonlight vs silver
vs full day. This is a feature, not a complication.

**Moon phase naming:** the gender descriptors already in the
game (Depths/Heights, Spring/Winter, Weaver) are moon phase
indicators. Characters use them as cultural identity without
knowing they describe a biological state tied to which moon
was dominant at their birth.

### The Moon Cycles and Transformation

Specific alignments of the two moons flood the Verdium lattice
with energy. Surface-dwellers who have been exposed to Verdium
long enough — miners especially — carry dormant biology that
responds to this. During the right alignment, if they are
in contact with Verdium while sleeping, they transform into
their sea form.

This is not magic. It is forgotten biology reactivating.
The same species, remembering what it was.

The transformation requires three conditions simultaneously:
1. Sleep (the body must be at rest, defences lowered)
2. Physical contact with Verdium
3. The specific alignment of the two moons

This is why it is rare. This is why it was forgotten.
Most people never encounter all three conditions at once.

### Sleep Temples

Every island community has at least one sleep temple.
A large communal room. Many small circular beds arranged
in a pattern. The ceiling is set with crystals that filter
the moonlight, producing warm red-orange light — chosen
for its calming effect on the nervous system, by people who
did not consciously know why it worked.

The rule: silence, or whispers. You respect the sleep of others.
The sleep temple is the most sacred communal space precisely
because it requires nothing of you except presence and quiet.

**What nobody remembers:** sleep temples were built
deliberately over Verdium veins. The circular beds are
positioned at nodes in the lattice. The crystal ceiling
panels are tuned to the amber moon's spectrum — the one
that triggers transformation. This was not superstition.
It was engineering. Then it was forgotten, and the
engineering became tradition, and the tradition became
architecture, and nobody questioned why the beds were
circular or why the crystals were that specific colour.

Dialogue in sleep temples should feel different.
Quieter. More interior. Italicised, perhaps. Characters
say less and mean more. The space imposes itself.

---

## The Player Character

A Tidewatcher miner. Works in the Verdium mine on
Cliff Haven. Ordinary. Not chosen. Has lived near
Verdium their whole life, building biological sensitivity
without knowing it.

Has a small friend group. Is curious. Notices things.
The kind of person who asks "has anyone actually studied
this properly?" when everyone else accepts the official answer.

Authority comes from perspective, not rank. Becomes the
only being who has lived as both civilisations. The
translator — not just of language but of experience.

---

## Tone

[WRITE THIS IN YOUR OWN WORDS — this is your game]

### What this game feels like
...

### Pace
Unhurried. Silence is allowed. The world does not rush
the player. Moments of just looking at something are valid.

### Humour
From character, not situation. Understated. The brass
octopus ("Don't touch. ESPECIALLY the octopus.") is the
model — specific, trusting the player's imagination,
never explained.

### Moral Texture
Both sides are right. No villains. Complexity without
clean resolution. The French intellectual tradition:
comfortable with questions that do not have answers.

### Relationships
Take time. Are worth taking time. Are not transactions.
You spend time with people before anything is asked of you.

### Authority
Earns trust. Is not assumed. Official explanations are
wrong. Personal investigation finds truth. Institutions
are worth questioning.

---

## Character Voices

> For each character: how they speak, what they care about,
> their verbal tics, what they would never say, their arc.
> This is what Claude uses to keep them consistent.

### Foreman Gaël (Tidewatcher, Depths)
Role: Mine foreman, Cliff Haven
Voice: [WRITE THIS]
Cares about: [WRITE THIS]
Would never: [WRITE THIS]
Arc: [WRITE THIS]

### Léra (Tidewatcher, Heights)
Role: Mine worker, player's closest friend
Voice: Colloquial, warm, fast. Finishes thoughts mid-sentence.
       Uses "Ha!" as punctuation. Calls player "cave-dweller"
       affectionately.
Cares about: Curiosity, honesty, the player's safety
Would never: Pretend to be calm when she is not
Arc: First to believe, first to develop telepathy,
     becomes player's most reliable relay

### Elder Brin (Tidewatcher, Depths)
Role: Village elder, Cliff Haven
Voice: [WRITE THIS]
Cares about: [WRITE THIS]
Would never: [WRITE THIS]
Arc: [WRITE THIS]

### Lix (Velessi, agender)
Role: Chief inventor, Spark Cove
Voice: Breathless, fast, finishes other people's sentences.
       Thinks in exclamation points. Goes from 0 to excited
       in one sentence. Says "Hmm..." when genuinely puzzled —
       the only time they slow down.
Cares about: How things work, the physics of the impossible,
             being useful
Would never: Accept "it just works" as an explanation
Arc: Approaches telepathy as engineering problem, builds
     a device, ends up understanding the lattice better
     than anyone except the undersea people themselves

### Elder Mossa (Korrim, Spring-aspect)
Role: Forest elder, Green Root
Voice: Slow, deliberate, full of silence. Speaks in images
       not abstractions. Never says more than needed.
       Pauses before answering as if listening to something else.
Cares about: The earth, what the roots say, old knowledge
Would never: Rush, raise their voice, dismiss a question
Arc: Already half-knows. Has been waiting for someone
     to ask the right question. Least surprised of anyone.

### Scholar Éline (Luminari, Weaver)
Role: Archive keeper, Luminara
Voice: [WRITE THIS]
Cares about: [WRITE THIS]
Would never: [WRITE THIS]
Arc: [WRITE THIS]

### Curator A
Role: Museum curator (couple), friend of player
Voice: [WRITE THIS]
Cares about: Evidence, rigour, the official explanation
Would never: Accept something without a source
Arc: Hardest conversion. Most meaningful acceptance.
     Does not announce the change — just starts asking
     different questions.

### Curator B
Role: Museum curator (couple), friend of player
Voice: [WRITE THIS]
Cares about: Old songs, myths, the fragments that do not fit
Would never: Dismiss something just because it is not documented
Arc: Vindication is not triumphant. It is lonely then
     relieving then overtaken by scale.

---

## Chapter 1: The Mine Problem

### What Happens
The player is a miner on Cliff Haven. Tremors have been
increasing. The foreman is worried. Salt water is appearing
deep in the mine. The player investigates, talks to
characters across the islands, and slowly pieces together
that something is wrong — something that cannot be explained
by the official geological theory.

Chapter 1 ends when the player has gathered enough evidence
that the truth is undeniable but not yet understood.
No strategy layer yet. Pure exploration and dialogue.

### The Museum Opening
Private visit, day one. Friend is the curator.
Tutorial quest "Opening Day" — three small tasks:
1. Check exhibit accuracy (player's miner knowledge matters)
2. Find missing Verdium sample (talk to friend group)
3. Help with opening ceremony wording (choice remembered later)

Tremor hits mid-quest. Cracks the exhibit:
"Periodic tremors — completely natural. Nothing to worry about."
Friends make a joke. Laugh too hard. The crack stays.

### The Museum Is a Sleep Temple

The museum was built on the site of an old sleep temple —
directly over a Verdium vein. This is why the tremor crack
appeared exactly where it did. The vein runs beneath the floor.

The crystal panels in the ceiling: Curator B always thought
they were decorative. They are not. They are tuned to the
amber moon's spectrum. They were the ceiling of a sleep temple.
The museum inherited them without understanding them.

The mythology section's "artwork showing figures lying in
circular beds" is an architectural diagram of the temple
that used to stand here.

The "unreadable script" in the mythology section is in the
undersea language. Post-transformation, the player can read it:

> "When the amber moon rises over the silver moon,
> lie on the stone, touch the crystal,
> and remember what you were."

The museum has been displaying a how-to guide for a century.
Curator B always felt the mythology section was important
without being able to say why. They were right.

**On the player's return post-transformation:**
When the player touches the museum floor, they can sense the
Verdium vein beneath. The crystal ceiling panels respond faintly
to their presence. The building recognises them.

**The moon cycle exhibit:**
A twin-moon astronomical chart that nobody fully understands.
Curator A labeled it "decorative astronomical record."
It is a calendar. The alignments that trigger transformation
are marked with a small symbol. The same symbol is carved
into the floor of every sleep temple on every island.
It was always in plain sight.

### The Sea Form

After transformation, the player exists as a sea creature.
Surface-dwellers in their sea form can:
- Walk on the ocean floor
- Jump with low gravity — like a human on the moon
  (the water is not an obstacle, it is a medium)
- Breathe underwater (dormant biology, now reactivated)
- Sense the Verdium lattice directly, not through touch

The low-gravity movement is important to get right tonally.
It is not swimming. It is not walking. It is something between —
unhurried, deliberate, slightly dreamlike. The undersea world
should feel vast and quiet and navigable, not hostile.

The undersea people find the transformed surface-dwellers
immediately recognisable — "the returned" — and not surprising.
They have been waiting, in their way, for this to happen.

### Key Chapter 1 Beats (pre-written, never generated)
- Museum tremor and the cracked exhibit
- First time player hears the rhythmic sound in the mine cracks
- Léra's "like a heartbeat" moment
- Lix's "the physics says it's not random"
- Éline's "what if it's literal?"
- Player expresses doubt about tremors in museum
  → callback delivered much later: "I should have listened"

---

## The Ending (Chapter 5)

A Tidewatcher miner and an undersea elder, together
at a Verdium vein. The elder shows exactly where to place
the chisel. The miner cuts — safely, for the first time.

Not a battle. Not a treaty signing. Not a speech.
The first sustainable harvest. Done together.
The game ends not with victory but with the first conversation
becoming something real.

The museum's final exhibit panel, being written together
by Curator A and Curator B — combining evidence and memory
into something neither could have written alone — is the
image that closes the game.

---

## Notes on Generation

When generating quests, dialogue, or content:

1. Read character voices above before writing any dialogue
2. Maintain the unhurried pace — no urgent music stings in text
3. Characters disagree through personality, not through being wrong
4. The official explanation is always incomplete, never malicious
5. Humour is specific and understated, never a punchline
6. When in doubt: write it in French first
7. The world existed before the player arrived
8. The world will continue after the player leaves
9. Nobody is the chosen one
10. Both sides are right
