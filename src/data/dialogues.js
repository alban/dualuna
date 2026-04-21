// All dialogue trees for Chapter 1: "The Mine Problem"

export const DIALOGUES = {
  // ====== INTRO ======
  'intro-mine': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Dawn tremor. Third one this week.',
        next: 'start2',
      },
      start2: {
        speaker: null,
        text: 'Verdium glints at the tunnel mouth. Without it, Dualuna dies.',
        next: null,
      },
    },
  },

  // ====== FOREMAN KAEL ======
  'foreman-gael-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'foreman-gael',
        text: 'Third tremor this week. Thirty tides in these mines, never felt anything like it.',
        choices: [
          { text: 'What\'s causing them?', next: 'cause' },
          { text: 'Should we stop mining?', next: 'stop' },
          { text: 'Anyone hurt?', next: 'hurt' },
        ],
      },
      cause: {
        speaker: 'foreman-gael',
        text: 'That\'s what worries me. Lower shaft\'s changed — wetter, new cracks. Tap the rock and it sounds... hollow. Something\'s behind there.',
        choices: [
          { text: 'I\'ll check the shaft myself.', next: 'examine' },
          { text: 'Could it be natural?', next: 'natural' },
        ],
      },
      stop: {
        speaker: 'foreman-gael',
        text: 'Stop? Everything needs Verdium. Brin won\'t allow it without proof. All we\'ve got is shaky ground and worried faces.',
        next: 'examine',
      },
      hurt: {
        speaker: 'foreman-gael',
        text: 'Not yet. But a support beam cracked yesterday. Léra patched it. If these tremors get worse...',
        next: 'examine',
      },
      natural: {
        speaker: 'foreman-gael',
        text: 'Thought so at first. Twin moons pull the earth, sure. But this is different. Rhythmic. Almost... deliberate.',
        next: 'examine',
      },
      examine: {
        speaker: 'foreman-gael',
        text: 'Get down to the lower shaft. See those cracks. Check the water pooling down there. And talk to Léra — she noticed things I missed.',
        effects: {
          startQuest: 'tremors-in-the-deep',
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'talk-gael' },
          setFlags: { 'talked-to-gael': true },
        },
        next: null,
      },
    },
  },

  // ====== DERA ======
  'lera-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'lera',
        text: 'Hey! Feel that one at dawn? Nearly fell off the rope ladder! My Heights-sense went crazy!',
        choices: [
          { text: 'Gaël says the lower shaft\'s bad.', next: 'shaft', requireFlag: 'talked-to-gael' },
          { text: 'What do you think it is?', next: 'theory' },
          { text: 'You okay?', next: 'okay' },
        ],
      },
      shaft: {
        speaker: 'lera',
        text: 'Worse than bad! I pressed my ear to the far wall down there. Heard something. Not rock. Not water. A low hum. Alive.',
        choices: [
          { text: 'Alive?!', next: 'alive' },
          { text: 'We should consult other islands.', next: 'consult' },
        ],
      },
      theory: {
        speaker: 'lera',
        text: 'Okay, this\'ll sound crazy. The cliffs go way deeper than we mine. What if something\'s down there? Something that doesn\'t like the digging?',
        next: 'consult',
      },
      okay: {
        speaker: 'lera',
        text: 'Ha! Takes more than a quake to shake a Heights-born! But... something feels wrong in the rock. Can\'t explain it.',
        next: 'consult',
      },
      alive: {
        speaker: 'lera',
        text: 'Like a heartbeat! Deep, slow, from the sea side. Never heard anything like it. I wasn\'t imagining it.',
        next: 'consult',
      },
      consult: {
        speaker: 'lera',
        text: 'We\'re miners, not scholars! We need help. Lix on Spark Cove knows geology. Elder Mossa on Green Root can sense things we can\'t. And the Luminari might have records.',
        effects: {
          setFlags: {
            'lera-consult-advice': true,
          },
          discoverIsland: 'green-root',
          // Spark Cove and Luminara are discovered through other dialogues
        },
        choices: [
          { text: 'Good idea. I\'ll visit them all.', next: 'govisit' },
          { text: 'That\'s a lot of sailing.', next: 'sailing' },
        ],
      },
      govisit: {
        speaker: 'lera',
        text: 'Be careful! And come back with answers. I don\'t wanna be here when whatever\'s down there pushes harder.',
        next: null,
      },
      sailing: {
        speaker: 'lera',
        text: 'Ha! Sea air\'ll do you good, cave-dweller! Use the harbor. Brin can arrange boats. Go talk to everyone!',
        effects: {
          discoverIslands: ['spark-cove', 'luminara'],
        },
        next: null,
      },
    },
  },

  // ====== EXAMINE HOTSPOTS - MINE ======
  'examine-verdium-crate': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Crates of fresh Verdium, glinting green. Powers the lamps, feeds the soil, keeps Dualuna alive.',
        next: null,
      },
    },
  },

  'examine-cracks': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Wide cracks across the tunnel wall. The rock feels warm. Through the biggest crack... a faint, rhythmic sound. Like breathing.',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'examine-shaft' },
          setFlags: { 'examined-cracks': true },
        },
        next: null,
      },
    },
  },

  'examine-water': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Salt water. Sea water. Deep in the cliff, far from the ocean. It shimmers strangely in the lantern light.',
        effects: {
          setFlags: { 'examined-strange-water': true },
        },
        next: null,
      },
    },
  },

  'examine-vein': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'A thick Verdium vein pulses green. Near the cracks, the glow flickers. Something\'s drawing energy from the other side.',
        next: null,
      },
    },
  },

  // ====== VILLAGE ======
  'brin-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'village-elder-brin',
        text: 'There you are. Felt the tremor too. Whole village is worried. What does Gaël say?',
        choices: [
          { text: 'Cracks and salt water in the lower shaft.', next: 'report', requireFlag: 'examined-cracks' },
          { text: 'He\'s worried. We need to investigate.', next: 'worried' },
          { text: 'Haven\'t talked to him yet.', next: 'gofirst' },
        ],
      },
      report: {
        speaker: 'village-elder-brin',
        text: 'Salt water? In the deep shaft? We\'ve mined these cliffs for generations. Never hit seawater. If the rock between us and the ocean is cracking...',
        choices: [
          { text: 'Léra says we should consult the other islands.', next: 'agree' },
          { text: 'Should we stop mining?', next: 'stopmine' },
        ],
      },
      worried: {
        speaker: 'village-elder-brin',
        text: 'Then go see it yourself. Check the cracks, touch the rock. I need your Tidewatcher instincts on this.',
        next: null,
      },
      gofirst: {
        speaker: 'village-elder-brin',
        text: 'Mine first. Talk to Gaël, examine the shaft. I need a report. The village needs Verdium, but not at the cost of lives.',
        next: null,
      },
      agree: {
        speaker: 'village-elder-brin',
        text: 'Smart girl. Go — Spark Cove, Green Root, Luminara. Velessi know engineering, Korrim know the earth, Luminari keep the old records. Use the harbor. Tell them Brin sent you.',
        effects: {
          discoverIslands: ['spark-cove', 'luminara'],
          setFlags: { 'brin-approved-journey': true },
        },
        next: null,
      },
      stopmine: {
        speaker: 'village-elder-brin',
        text: 'Can\'t. Not yet. Village needs Verdium. But I\'ll have Gaël pull back from the deep shaft. Go consult the other islands. Find out what we\'re dealing with.',
        effects: {
          discoverIslands: ['spark-cove', 'luminara'],
          setFlags: { 'brin-approved-journey': true },
        },
        next: null,
      },
    },
  },

  'harbor-travel': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Cliff Haven harbor. Boats rock gently in the swell. You can sail to any known island.',
        choices: [
          { text: 'Open the world map', next: 'map' },
          { text: 'Not right now', next: 'end' },
        ],
      },
      map: {
        speaker: null,
        text: 'You study the sailing charts...',
        effects: { setFlags: { 'open-map': true } },
        next: null,
      },
      end: {
        text: '',
        next: null,
      },
    },
  },

  // ====== CLIFF OVERLOOK ======
  'examine-telescope': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Green Root to the north — forests. Spark Cove east — workshop smoke. Luminara south — crystal spires catching both moons.',
        effects: {
          discoverIslands: ['green-root', 'spark-cove', 'luminara'],
        },
        next: 'start2',
      },
      start2: {
        speaker: null,
        text: 'The ocean between the islands is vast. No one knows what lies beneath. At least... that\'s what everyone believes.',
        next: null,
      },
    },
  },

  // ====== GREEN ROOT ======
  'roothold-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'korrim-guard',
        text: 'Halt. Elder Grove is sacred. What brings a Tidewatcher here?',
        choices: [
          { text: 'I need to see Elder Mossa. About the tremors.', next: 'tremors' },
          { text: 'Our mines are in trouble.', next: 'learn' },
        ],
      },
      tremors: {
        speaker: 'korrim-guard',
        text: 'Tremors... We\'ve felt them too. Even the Great Tree\'s roots are restless. Go. Mossa will want to hear this.',
        next: null,
      },
      learn: {
        speaker: 'korrim-guard',
        text: 'The earth\'s been louder these past days. Speak with Mossa. The Elder knows more.',
        next: null,
      },
    },
  },

  'elder-mossa-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'elder-mossa',
        text: 'I felt your footsteps, Tidewatcher. The earth carries all things. Lately... it carries distress.',
        choices: [
          { text: 'Salt water in our mines. Where it shouldn\'t be.', next: 'mining' },
          { text: 'Can you sense what\'s causing the tremors?', next: 'sense' },
        ],
      },
      mining: {
        speaker: 'elder-mossa',
        text: 'Salt water... The Verdium energy I feel through every root — it falters. The earth isn\'t just shaking. It\'s resisting.',
        next: 'deeper',
      },
      sense: {
        speaker: 'elder-mossa',
        text: 'The tremors don\'t come from your rock. They come from below. Deeper than the cliffs. Deeper than the ocean floor.',
        next: 'deeper',
      },
      deeper: {
        speaker: 'elder-mossa',
        text: 'The earth beneath Dualuna\'s oceans... breathes. A slow rhythm, like a sleeping giant. But lately, the breathing quickens. Something stirs.',
        choices: [
          { text: 'Could our mining have disturbed it?', next: 'mining-cause' },
          { text: 'What do you think is down there?', next: 'whatis' },
        ],
      },
      'mining-cause': {
        speaker: 'elder-mossa',
        text: 'Perhaps. Verdium veins connect to... something. When you mine, you sever old bonds. What if those bonds matter to something other than us?',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-mossa' },
          setFlags: { 'mossa-insight': true },
        },
        next: 'advice',
      },
      whatis: {
        speaker: 'elder-mossa',
        text: 'Our oldest songs speak of "the world beneath the water." We thought them poetry. What if they were truth?',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-mossa' },
          setFlags: { 'mossa-insight': true },
        },
        next: 'advice',
      },
      advice: {
        speaker: 'elder-mossa',
        text: 'Try Luminara — their archives hold what we only remember as song. And that Velessi, Lix? Engineer eyes see what spirit ones miss.',
        next: null,
      },
    },
  },

  'examine-flora': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Glowing moss and ferns, green as Verdium. But in places, the glow is fading. The plants look... tired.',
        next: null,
      },
    },
  },

  'examine-great-root': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'The Great Root Tree. Trunk wider than three houses, roots spanning the island. Press your ear to the bark — you hear a slow, steady thrum. A heartbeat.',
        next: null,
      },
    },
  },

  // ====== SPARK COVE ======
  'lix-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'lix',
        text: 'A Tidewatcher! Been dying to study your cliff Verdium — totally different crystal structure! Wait. You\'ve got that worried look. What broke?',
        choices: [
          { text: 'Mine\'s cracking. Filling with seawater.', next: 'problem' },
          { text: 'Strange tremors on Cliff Haven.', next: 'tremors' },
        ],
      },
      problem: {
        speaker: 'lix',
        text: 'Seawater?! That\'s forty meters of solid basalt! If water\'s getting through, something breached the barrier from the OTHER side. Not your mining.',
        next: 'analysis',
      },
      tremors: {
        speaker: 'lix',
        text: 'Tremors! Periodic? ...Periodic! That rules out tectonics. Periodic means a SOURCE. Something generating them. Hmm...',
        next: 'analysis',
      },
      analysis: {
        speaker: 'lix',
        text: 'I\'ve got a half-built resonance sensor! Measures rock vibrations. The periodicity, the salt water, the cracking — something\'s pushing against your cliff from the ocean side!',
        choices: [
          { text: 'Could something alive cause this?', next: 'alive' },
          { text: 'Can you build something to help?', next: 'build' },
        ],
      },
      alive: {
        speaker: 'lix',
        text: 'I\'m an engineer, not a storyteller! But... pressure doesn\'t pulse. Water doesn\'t intrude rhythmically. Something\'s either pushing or trying to get through. The physics says it\'s not random.',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-lix' },
          setFlags: { 'talked-to-lix': true, 'lix-insight': true },
        },
        next: null,
      },
      build: {
        speaker: 'lix',
        text: 'Already on it! Calibrate my sensor to Verdium frequencies and — YES! — I can trace the vibrations to their source! Give me a few days. Check the Luminari archives in the meantime!',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-lix' },
          setFlags: { 'talked-to-lix': true, 'lix-building-sensor': true },
        },
        next: null,
      },
    },
  },

  'examine-machinery': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Half-finished inventions everywhere. A wind-mill, a twin-moon tide clock, self-mending nets, and... a brass octopus. Sign says: "Don\'t touch. ESPECIALLY the octopus."',
        next: null,
      },
    },
  },

  'examine-blueprints': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Cliff Haven cross-section on the wall. Lix\'s notes: "Veins extend below sea level. How deep?" And smaller: "Why do the deepest veins curve toward the ocean?"',
        next: null,
      },
    },
  },

  'examine-prototype': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Crystal probes, a Verdium oscillator. Label: "Resonance Sensor v3 — CLIFF HAVEN." Tiny gears, hand-wound coils. Lix\'s already on it.',
        next: null,
      },
    },
  },

  // ====== LUMINARA ======
  'scholar-eline-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'scholar-eline',
        text: 'Your bioluminescence betrays your worry, Tidewatcher. What brings you to the Crystal Plaza?',
        choices: [
          { text: 'Tremors in our mines. I need answers.', next: 'research' },
          { text: 'I need the archives. Geological records.', next: 'archives' },
        ],
      },
      research: {
        speaker: 'scholar-eline',
        text: 'Tremors near the Verdium mines... I\'ve seen records of this before. Crystal tablets from the first settlers — they mention "the voice of the deep." We called it mythology.',
        next: 'reveal',
      },
      archives: {
        speaker: 'scholar-eline',
        text: 'The archives are open. But let me guide you — I\'ve been cross-referencing geological surveys with old myths. I found correlations that shouldn\'t exist.',
        next: 'reveal',
      },
      reveal: {
        speaker: 'scholar-eline',
        text: 'The first settlers described Verdium as "bridges between worlds." Surface to something below. We assumed metaphor. But what if it\'s literal?',
        choices: [
          { text: 'Something exists beneath the ocean?!', next: 'beneath' },
          { text: 'Are we severing those connections by mining?', next: 'severing' },
        ],
      },
      beneath: {
        speaker: 'scholar-eline',
        text: 'One damaged tablet speaks of "those who build below the water" and "cities where no moon shines." Filed under mythology. But your tremors, the seawater, the pulsing sounds... what if it\'s real?',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'research-archives' },
          setFlags: { 'eline-insight': true, 'learned-about-deep-ones': true },
        },
        next: 'conclude',
      },
      severing: {
        speaker: 'scholar-eline',
        text: 'Exactly what I fear. If Verdium connects surface and depth, we\'ve been severing it for generations. And if something intelligent lives below... they might see our mining as an attack.',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'research-archives' },
          setFlags: { 'eline-insight': true, 'learned-about-deep-ones': true },
        },
        next: 'conclude',
      },
      conclude: {
        speaker: 'scholar-eline',
        text: 'Take this knowledge to Cliff Haven. But tread carefully. The idea that our Verdium harvest harms someone we didn\'t know existed... not everyone will accept that.',
        next: null,
      },
    },
  },

  'examine-mural': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'A crystal mural — four races arriving, Verdium discovered, villages built. But in the corner... shapes beneath waves, glowing in the dark ocean.',
        next: null,
      },
    },
  },

  'examine-geology-archives': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Centuries of geological surveys. The oldest note: "Veins originate from beneath the ocean floor, not from the island rock itself." Someone underlined it in luminescent ink.',
        effects: {
          setFlags: { 'read-geology-archives': true },
        },
        next: null,
      },
    },
  },

  'examine-ancient-records': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'The oldest records. One fragment: "...heard again the singing from below. A planet does not sing in harmonies. Only thinking beings sing in harmonies..."',
        effects: {
          setFlags: { 'read-ancient-records': true },
        },
        next: null,
      },
    },
  },

  'examine-pedestal': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'A reading pedestal, humming with Verdium energy. Even here, far from the mines — everything on Dualuna is connected.',
        next: null,
      },
    },
  },
};
