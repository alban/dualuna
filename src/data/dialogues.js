// All dialogue trees for Chapter 1: "The Mine Problem"

export const DIALOGUES = {
  // ====== INTRO ======
  'intro-mine': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'The morning air carries the salt of the sea up the cliff face. The Verdium mine entrance stands before you — familiar, steady, like every other day. Except today, the ground trembled at dawn. The third time this week.',
        next: 'start2',
      },
      start2: {
        speaker: null,
        text: 'The green glint of Verdium veins catches the light from the tunnel mouth. This metal sustains everything — the forests, the gardens, the warmth of every hearth on the islands. Without it, Dualuna would wither.',
        next: null,
      },
    },
  },

  // ====== FOREMAN KAEL ======
  'foreman-kael-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'foreman-kael',
        text: 'Another tremor this morning. Third one this week. I\'ve been working these cliffs for thirty tides, and I\'ve never felt anything like this.',
        choices: [
          { text: 'What do you think is causing them?', next: 'cause' },
          { text: 'Should we stop mining?', next: 'stop' },
          { text: 'Has anyone been hurt?', next: 'hurt' },
        ],
      },
      cause: {
        speaker: 'foreman-kael',
        text: 'That\'s what worries me — I don\'t know. The rock down in the lower shaft has changed. It\'s... wetter. There are cracks that weren\'t there last moon-cycle. And the sound it makes when you tap it... hollow. Like there\'s something beyond.',
        choices: [
          { text: 'I\'ll go examine the shaft.', next: 'examine' },
          { text: 'Could it be natural?', next: 'natural' },
        ],
      },
      stop: {
        speaker: 'foreman-kael',
        text: 'Stop mining? You know what happens then. The forests need Verdium. The gardens need Verdium. Elder Brin would never allow it — not unless we had proof of real danger. Right now, all we have is shaking ground and worried looks.',
        next: 'examine',
      },
      hurt: {
        speaker: 'foreman-kael',
        text: 'Not yet, thank the twin moons. But a support beam in the lower shaft cracked yesterday. Dera patched it, but I don\'t like the look of it. If these tremors get worse...',
        next: 'examine',
      },
      natural: {
        speaker: 'foreman-kael',
        text: 'I thought so at first. Dualuna has always had its moods — the twin moons pull the earth just as they pull the tides. But this feels different. Rhythmic. Almost... deliberate.',
        next: 'examine',
      },
      examine: {
        speaker: 'foreman-kael',
        text: 'Go down to the lower shaft and have a look. See those cracks for yourself, and that strange water pooling in the deep tunnel. Something is not right down there. And talk to Dera — she noticed things I might have missed.',
        effects: {
          startQuest: 'tremors-in-the-deep',
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'talk-kael' },
          setFlags: { 'talked-to-kael': true },
        },
        next: null,
      },
    },
  },

  // ====== DERA ======
  'dera-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'dera',
        text: 'Hey! Did you feel that one at dawn? I was halfway up the rope ladder and nearly lost my grip. My Heights-sense was screaming.',
        choices: [
          { text: 'Kael says the lower shaft looks bad.', next: 'shaft', requireFlag: 'talked-to-kael' },
          { text: 'What do you think it is?', next: 'theory' },
          { text: 'Are you okay?', next: 'okay' },
        ],
      },
      shaft: {
        speaker: 'dera',
        text: 'Oh, it\'s worse than bad. I was down there patching the beam, and I pressed my ear against the far wall. I heard... something. Not rock settling. Not water dripping. Like a low hum. Alive.',
        choices: [
          { text: 'Alive? What do you mean?', next: 'alive' },
          { text: 'Maybe we should consult someone from another island.', next: 'consult' },
        ],
      },
      theory: {
        speaker: 'dera',
        text: 'I have a theory, but it\'s going to sound strange. You know how the cliffs go deep — deeper than we mine? What if there\'s something down there we\'ve never reached? Something that doesn\'t appreciate us digging?',
        next: 'consult',
      },
      okay: {
        speaker: 'dera',
        text: 'I\'m fine! Takes more than a little earthquake to shake a Heights-born. But... I won\'t lie, I\'m unsettled. Something feels wrong in the rock. I can\'t explain it better than that.',
        next: 'consult',
      },
      alive: {
        speaker: 'dera',
        text: 'I mean it sounded alive. Like a heartbeat, but deep and slow. Coming from below. From the sea side of the cliff. I\'ve never heard anything like it. Maybe I was imagining things but... I don\'t think so.',
        next: 'consult',
      },
      consult: {
        speaker: 'dera',
        text: 'Listen — we\'re miners, not scholars. If something strange is happening in the deep rock, we need help. Tink on Spark Cove knows about geological engineering. Elder Mossa on Green Root can sense things in the earth we can\'t. And the Luminari archives might have records of anything like this happening before.',
        effects: {
          setFlags: {
            'dera-consult-advice': true,
          },
          discoverIsland: 'green-root',
          // Spark Cove and Luminara are discovered through other dialogues
        },
        choices: [
          { text: 'Good idea. I\'ll visit all three islands.', next: 'govisit' },
          { text: 'That\'s a lot of sailing.', next: 'sailing' },
        ],
      },
      govisit: {
        speaker: 'dera',
        text: 'Be careful out there. And come back with answers — I\'d rather not be in this mine when whatever is down there decides to push back harder.',
        next: null,
      },
      sailing: {
        speaker: 'dera',
        text: 'Ha! A little sea air will do you good, cave-dweller. Seriously though — use the harbor in the village. Elder Brin can arrange boats to any discovered island. Go talk to everyone, gather what you can.',
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
        text: 'Crates of freshly mined Verdium, the green metal glinting softly in the daylight. Each crate will be sent to the villages — powering lamps, feeding the soil, keeping the forests alive. It\'s hard to imagine Dualuna without it.',
        next: null,
      },
    },
  },

  'examine-cracks': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Deep cracks spider across the tunnel wall, far wider than anything natural erosion would cause. The rock here feels warm to the touch — warmer than it should be this deep. Through the widest crack, you hear a faint, rhythmic sound. Like distant breathing.',
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
        text: 'A pool of water has gathered in the lowest part of the shaft. But this isn\'t groundwater seepage — it\'s salt water. Sea water. Down here, deep in the cliff, far from any known connection to the ocean. It shimmers faintly, catching the lantern light in unusual patterns.',
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
        text: 'A thick vein of Verdium runs through the rock, pulsing with its characteristic green glow. But near the cracks, the glow is different — dimmer, almost flickering. As if something is drawing energy from the other side.',
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
        text: 'Ah, there you are. I felt the tremor at dawn too. The whole village is talking. Tell me — what does Kael say about the mines?',
        choices: [
          { text: 'There are cracks and strange water in the lower shaft.', next: 'report', requireFlag: 'examined-cracks' },
          { text: 'He\'s worried. We need to investigate further.', next: 'worried' },
          { text: 'I haven\'t spoken to Kael yet.', next: 'gofirst' },
        ],
      },
      report: {
        speaker: 'village-elder-brin',
        text: 'Salt water in the deep shaft? That\'s... concerning. These cliffs have been mined for generations, and we\'ve never hit seawater. The rock between us and the ocean has always been solid and thick. If it\'s cracking...',
        choices: [
          { text: 'Dera thinks we should consult the other islands.', next: 'agree' },
          { text: 'Should we stop mining?', next: 'stopmine' },
        ],
      },
      worried: {
        speaker: 'village-elder-brin',
        text: 'Worried is right. Go examine the shaft yourself. See those cracks, touch the rock. Then come back and tell me what your Tidewatcher instincts say. We need eyes we trust down there.',
        next: null,
      },
      gofirst: {
        speaker: 'village-elder-brin',
        text: 'Then go to the mine first. Talk to Kael, examine the shaft. I need a full report before I can decide anything. The village depends on that Verdium, but not at the cost of lives.',
        next: null,
      },
      agree: {
        speaker: 'village-elder-brin',
        text: 'Dera is wise for a young Heights. Yes — go. Sail to Spark Cove, Green Root, and Luminara. The Velessi know engineering, the Korrim know the earth\'s moods, and the Luminari keep records of things long forgotten. Use the harbor — tell them Elder Brin sends you.',
        effects: {
          discoverIslands: ['spark-cove', 'luminara'],
          setFlags: { 'brin-approved-journey': true },
        },
        next: null,
      },
      stopmine: {
        speaker: 'village-elder-brin',
        text: 'I can\'t order that. Not yet. The village needs Verdium to survive — the forests, the energy, the food. But I\'ll have Kael reduce the deep shaft work while you investigate. Go consult the other islands. Find out what we\'re dealing with.',
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
        text: 'The small harbor of Cliff Haven. Fishing boats and a few larger vessels bob gently in the swell. From here, you can sail to any island you\'ve learned about.',
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
        text: 'Through the old brass telescope, you can see the other islands of Dualuna dotting the vast blue ocean. Green Root to the north, its forests visible even from here. Spark Cove to the east, with thin trails of workshop smoke. And Luminara to the south, its crystal spires catching the light of both moons at dusk.',
        effects: {
          discoverIslands: ['green-root', 'spark-cove', 'luminara'],
        },
        next: 'start2',
      },
      start2: {
        speaker: null,
        text: 'The ocean between the islands is vast and deep. No one has ever explored what lies beneath. The sea is simply... the sea. A space between places, not a place itself. At least, that\'s what everyone believes.',
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
        text: 'Halt. The Elder Grove is sacred ground. What brings a Tidewatcher to the roots of Green Root? You\'re far from your cliffs, miner.',
        choices: [
          { text: 'I need to speak with Elder Mossa about the tremors.', next: 'tremors' },
          { text: 'I\'m here to learn about the earth. Our mines are troubled.', next: 'learn' },
        ],
      },
      tremors: {
        speaker: 'korrim-guard',
        text: 'Tremors? ...We\'ve felt them too. The roots of the Great Tree have been restless. Even in my Winter-aspect, when I am most still, I feel the ground shiver. Go — Mossa will want to hear this. The Grove is ahead.',
        next: null,
      },
      learn: {
        speaker: 'korrim-guard',
        text: 'The earth speaks to those who listen. I\'ve heard its murmurs grow louder these past days. If your mines are the cause... but no, I shouldn\'t say. Speak with Mossa. The Elder will know more.',
        next: null,
      },
    },
  },

  'elder-mossa-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'elder-mossa',
        text: 'Welcome, young Tidewatcher. I felt your footsteps before you arrived — the earth carries all vibrations to those who listen. But lately, the earth carries something else. Something... distressed.',
        choices: [
          { text: 'Our mines are cracking. There\'s salt water where there shouldn\'t be.', next: 'mining' },
          { text: 'Can you sense what\'s causing the tremors?', next: 'sense' },
        ],
      },
      mining: {
        speaker: 'elder-mossa',
        text: 'Salt water in the deep cliffs... The forests I tend are fed by Verdium — I feel its energy flowing through every root. Lately, that flow has faltered. As if something is pulling back. The earth is not just shaking — it is... resisting.',
        next: 'deeper',
      },
      sense: {
        speaker: 'elder-mossa',
        text: 'I press my roots into the soil and I feel... layers. The tremors do not come from above, from the rock you mine. They come from below. From deep below. Deeper than the cliffs. Deeper than the ocean floor itself.',
        next: 'deeper',
      },
      deeper: {
        speaker: 'elder-mossa',
        text: 'I will tell you something that will sound strange: the earth beneath Dualuna\'s oceans... it breathes. I have always sensed it — a slow, deep rhythm. Like a sleeping giant. But lately, the breathing has quickened. Whatever sleeps beneath... is stirring.',
        choices: [
          { text: 'Could our mining have disturbed it?', next: 'mining-cause' },
          { text: 'What do you think is down there?', next: 'whatis' },
        ],
      },
      'mining-cause': {
        speaker: 'elder-mossa',
        text: 'Perhaps. The Verdium veins run deep — deeper than any of us truly know. They connect the cliffs to... something. When you mine, you sever connections that may have existed since Dualuna was young. What if those connections matter to something other than us?',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-mossa' },
          setFlags: { 'mossa-insight': true },
        },
        next: 'advice',
      },
      whatis: {
        speaker: 'elder-mossa',
        text: 'In the oldest Korrim songs — songs from before we tracked the seasons — there are verses about "the world beneath the water." We always thought them metaphors. Poetry about death and renewal. But what if they were literal?',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-mossa' },
          setFlags: { 'mossa-insight': true },
        },
        next: 'advice',
      },
      advice: {
        speaker: 'elder-mossa',
        text: 'Go to Luminara. The Luminari archives may hold knowledge that we Korrim only remember as song. And visit that clever Velessi on Spark Cove — Tink, I think? Engineering eyes may see what spiritual ones miss. The answer lies in combining all our ways of knowing.',
        next: null,
      },
    },
  },

  'examine-flora': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'The forest floor is carpeted with bioluminescent moss and ferns that glow faintly green — the same green as Verdium. These plants thrive because of the metal\'s energy flowing through the soil. In places, you notice the glow is dimmer than it should be. The plants look... tired.',
        next: null,
      },
    },
  },

  'examine-great-root': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'The Great Root Tree is ancient beyond counting — its trunk wider than three houses, its roots spreading across the entire island like veins beneath the soil. The Korrim say it connects to every living thing on Green Root. Its bark is warm to the touch, and if you press your ear against it, you can hear a low, steady thrum. The heartbeat of the island itself.',
        next: null,
      },
    },
  },

  // ====== SPARK COVE ======
  'tink-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'tink',
        text: 'A Tidewatcher! Excellent! I\'ve been meaning to study your cliff formations — the crystal structure of coastal Verdium is completely different from inland deposits. Wait, you\'re not here for geological chat, are you? You have that worried look. What broke?',
        choices: [
          { text: 'The Verdium mine is cracking and filling with seawater.', next: 'problem' },
          { text: 'We\'re having tremors on Cliff Haven. Strange ones.', next: 'tremors' },
        ],
      },
      problem: {
        speaker: 'tink',
        text: 'Seawater intrusion in a cliff mine? That shouldn\'t happen. The geological barrier between your mines and the ocean is — was — at least forty meters of solid basalt. If seawater is coming through, something has compromised that barrier from the OTHER side. Not from your mining.',
        next: 'analysis',
      },
      tremors: {
        speaker: 'tink',
        text: 'Tremors! Fascinating and terrifying. What kind? Periodic? Random? ...Periodic, you say? That rules out standard tectonic activity. Periodic tremors mean a source. Something generating them rhythmically. Let me think...',
        next: 'analysis',
      },
      analysis: {
        speaker: 'tink',
        text: 'I\'ve been building a resonance sensor — it measures vibrations in rock. Never finished it because I couldn\'t test it on anything interesting enough. THIS is interesting enough. Your mine tremors... the periodicity, the salt water, the cracking patterns... it\'s almost as if something is pushing against the cliff from the ocean side.',
        choices: [
          { text: 'Could something alive be causing this?', next: 'alive' },
          { text: 'Can you build something to help us?', next: 'build' },
        ],
      },
      alive: {
        speaker: 'tink',
        text: 'Alive? I\'m an engineer, not a storyteller. But... the data doesn\'t lie. Geological pressure doesn\'t pulse. Water doesn\'t intrude rhythmically. Something is either building pressure against your cliff face or — and this is the wild option — actively trying to get through. I don\'t know what, but the physics says it\'s not random.',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-tink' },
          setFlags: { 'talked-to-tink': true, 'tink-insight': true },
        },
        next: null,
      },
      build: {
        speaker: 'tink',
        text: 'Already thinking about it! My resonance sensor could map where the pressure is coming from. And if I calibrate it to Verdium frequencies... yes, YES, I could trace the vibrations back to their source. Give me a few days. Come back and I\'ll have something for you. In the meantime — check the Luminari archives. If this has happened before, they\'ll have records.',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'consult-tink' },
          setFlags: { 'talked-to-tink': true, 'tink-building-sensor': true },
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
        text: 'The harbor workshop is filled with Velessi inventions in various states of completion: a wind-powered grain mill, a tide-prediction clock (with two moon dials), self-mending fishing nets, and something that looks like a brass octopus. A sign reads: "Please don\'t touch. Especially the octopus."',
        next: null,
      },
    },
  },

  'examine-blueprints': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Detailed engineering blueprints cover the wall. One catches your eye: a cross-section diagram of the cliffs of Cliff Haven, showing the Verdium veins running deep into the rock. Tink has annotated it: "Veins extend below sea level. How deep? Need core samples." Below that, in smaller writing: "Why do the deepest veins curve toward the ocean?"',
        next: null,
      },
    },
  },

  'examine-prototype': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'A half-built device with crystal probes and a Verdium-powered oscillator. A label reads: "Resonance Sensor v3 — FOR CLIFF HAVEN INVESTIGATION." Tink is already working on it. The craftsmanship is remarkable — tiny gears, hand-wound coils, and a display made from polished shell.',
        next: null,
      },
    },
  },

  // ====== LUMINARA ======
  'scholar-elyn-default': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: 'scholar-elyn',
        text: 'Your bioluminescence tells me you carry worry, Tidewatcher. The patterns of stress are the same in all races, though expressed differently. What brings you to the Crystal Plaza?',
        choices: [
          { text: 'I\'m researching the tremors affecting Cliff Haven\'s mines.', next: 'research' },
          { text: 'I need access to the archives — geological records.', next: 'archives' },
        ],
      },
      research: {
        speaker: 'scholar-elyn',
        text: 'Tremors near the Verdium mines? This is... not the first time I\'ve encountered such records. Come — let me show you something in the Archive Hall. There are crystal tablets from the early settlers that mention "the voice of the deep." We always classified them as mythology.',
        next: 'reveal',
      },
      archives: {
        speaker: 'scholar-elyn',
        text: 'The archives are open to all seekers of knowledge. But let me guide you — I suspect I know what you\'re looking for. Recently, I\'ve been cross-referencing geological surveys with old mythological texts, and I found... discrepancies. Or rather, correlations that shouldn\'t exist.',
        next: 'reveal',
      },
      reveal: {
        speaker: 'scholar-elyn',
        text: 'In the ancient records, before the four races had even named this planet, the first settlers wrote of sounds from beneath the ocean. They described the Verdium veins as "bridges between worlds" — connecting the surface to something below. We assumed it was spiritual metaphor. But what if the Verdium literally connects two layers of Dualuna?',
        choices: [
          { text: 'Two layers? You mean something exists beneath the ocean?', next: 'beneath' },
          { text: 'Could mining the Verdium be severing those connections?', next: 'severing' },
        ],
      },
      beneath: {
        speaker: 'scholar-elyn',
        text: 'The records are ambiguous. But one tablet — very old, damaged — speaks of "those who build below the water" and "cities in the deep where no moon shines." It was always filed under mythology. But your tremors, the seawater intrusion, the pulsing sounds your friend Dera described... what if it\'s not mythology at all?',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'research-archives' },
          setFlags: { 'elyn-insight': true, 'learned-about-deep-ones': true },
        },
        next: 'conclude',
      },
      severing: {
        speaker: 'scholar-elyn',
        text: 'That\'s exactly what I fear. If Verdium is a connective tissue between surface and depth, then mining it for generations could be slowly damaging something we don\'t understand. And if something intelligent exists below... they might perceive our mining as an attack.',
        effects: {
          completeObjective: { quest: 'tremors-in-the-deep', objective: 'research-archives' },
          setFlags: { 'elyn-insight': true, 'learned-about-deep-ones': true },
        },
        next: 'conclude',
      },
      conclude: {
        speaker: 'scholar-elyn',
        text: 'Return to Cliff Haven with what you\'ve learned. But be careful how you share it. The idea that our entire way of life — our Verdium harvesting — might be harming someone we didn\'t know existed... not everyone will want to hear that. Some truths are harder to mine than any metal.',
        next: null,
      },
    },
  },

  'examine-mural': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'A luminous mural covers the crystal wall, depicting the history of Dualuna as the Luminari understand it. Four races arriving on the islands. The discovery of Verdium. The building of villages. But in the bottom corner, almost hidden, there\'s something else: abstract shapes beneath waves, glowing in the dark ocean. It could be artistic fancy. Or it could be a record of something seen.',
        next: null,
      },
    },
  },

  'examine-geology-archives': {
    startNode: 'start',
    nodes: {
      start: {
        speaker: null,
        text: 'Crystal tablets cataloging centuries of geological surveys. You find the Cliff Haven section and trace the mine records. The Verdium veins go deep — far deeper than any mine has reached. And in the oldest surveys, a note: "Veins appear to originate from beneath the ocean floor, not from the island rock itself." Someone has underlined this in luminescent ink.',
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
        text: 'These are the oldest records in the archive — pre-dating the current calendar. The crystal is clouded with age but still readable. One fragment catches your eye: "...heard again the singing from below the waters. The Builders say it is the planet\'s own voice. But I have listened carefully, and a planet does not sing in harmonies. Only thinking beings sing in harmonies..."',
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
        text: 'The reading pedestal holds a crystal that can project the contents of any archive tablet. It hums gently with Verdium-powered energy. Even here, far from the mines, the work of the Tidewatchers sustains Luminari scholarship. Everything on Dualuna is connected — more deeply than anyone yet realizes.',
        next: null,
      },
    },
  },
};
