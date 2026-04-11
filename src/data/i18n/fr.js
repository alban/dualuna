// French — TODO: translate
// Copy of English, replace values with French translations
export default {
  "ui": {
    "newGame": "New Game",
    "continue": "Continue",
    "save": "💾 Save",
    "map": "🗺 Map",
    "back": "← Back",
    "close": "▸ Close",
    "continueDialogue": "▸ Continue",
    "goTo": "Go to:",
    "verdium": "Verdium",
    "gameSaved": "Game saved!",
    "found": "Found:",
    "current": "Current:",
    "sailingTo": "Sailing to",
    "loading": "Loading Dualuna...",
    "chooseLanguage": "Choose your language",
    "subtitle": "The Verdium Collector",
    "tagline": "A world of islands above, mysteries below",
    "phase": "Phase 1 — Chapter 1: The Mine Problem",
    "worldMapTitle": "The Islands of Dualuna"
  },
  "dialogues": {
    "intro-mine": {
      "start": {
        "text": "Dawn tremor. Third one this week."
      },
      "start2": {
        "text": "Verdium glints at the tunnel mouth. Without it, Dualuna dies."
      }
    },
    "foreman-kael-default": {
      "start": {
        "text": "Third tremor this week. Thirty tides in these mines, never felt anything like it.",
        "choices": [
          "What's causing them?",
          "Should we stop mining?",
          "Anyone hurt?"
        ]
      },
      "cause": {
        "text": "That's what worries me. Lower shaft's changed — wetter, new cracks. Tap the rock and it sounds... hollow. Something's behind there.",
        "choices": [
          "I'll check the shaft myself.",
          "Could it be natural?"
        ]
      },
      "stop": {
        "text": "Stop? Everything needs Verdium. Brin won't allow it without proof. All we've got is shaky ground and worried faces."
      },
      "hurt": {
        "text": "Not yet. But a support beam cracked yesterday. Dera patched it. If these tremors get worse..."
      },
      "natural": {
        "text": "Thought so at first. Twin moons pull the earth, sure. But this is different. Rhythmic. Almost... deliberate."
      },
      "examine": {
        "text": "Get down to the lower shaft. See those cracks. Check the water pooling down there. And talk to Dera — she noticed things I missed."
      }
    },
    "dera-default": {
      "start": {
        "text": "Hey! Feel that one at dawn? Nearly fell off the rope ladder! My Heights-sense went crazy!",
        "choices": [
          "Kael says the lower shaft's bad.",
          "What do you think it is?",
          "You okay?"
        ]
      },
      "shaft": {
        "text": "Worse than bad! I pressed my ear to the far wall down there. Heard something. Not rock. Not water. A low hum. Alive.",
        "choices": [
          "Alive?!",
          "We should consult other islands."
        ]
      },
      "theory": {
        "text": "Okay, this'll sound crazy. The cliffs go way deeper than we mine. What if something's down there? Something that doesn't like the digging?"
      },
      "okay": {
        "text": "Ha! Takes more than a quake to shake a Heights-born! But... something feels wrong in the rock. Can't explain it."
      },
      "alive": {
        "text": "Like a heartbeat! Deep, slow, from the sea side. Never heard anything like it. I wasn't imagining it."
      },
      "consult": {
        "text": "We're miners, not scholars! We need help. Tink on Spark Cove knows geology. Elder Mossa on Green Root can sense things we can't. And the Luminari might have records.",
        "choices": [
          "Good idea. I'll visit them all.",
          "That's a lot of sailing."
        ]
      },
      "govisit": {
        "text": "Be careful! And come back with answers. I don't wanna be here when whatever's down there pushes harder."
      },
      "sailing": {
        "text": "Ha! Sea air'll do you good, cave-dweller! Use the harbor. Brin can arrange boats. Go talk to everyone!"
      }
    },
    "examine-verdium-crate": {
      "start": {
        "text": "Crates of fresh Verdium, glinting green. Powers the lamps, feeds the soil, keeps Dualuna alive."
      }
    },
    "examine-cracks": {
      "start": {
        "text": "Wide cracks across the tunnel wall. The rock feels warm. Through the biggest crack... a faint, rhythmic sound. Like breathing."
      }
    },
    "examine-water": {
      "start": {
        "text": "Salt water. Sea water. Deep in the cliff, far from the ocean. It shimmers strangely in the lantern light."
      }
    },
    "examine-vein": {
      "start": {
        "text": "A thick Verdium vein pulses green. Near the cracks, the glow flickers. Something's drawing energy from the other side."
      }
    },
    "brin-default": {
      "start": {
        "text": "There you are. Felt the tremor too. Whole village is worried. What does Kael say?",
        "choices": [
          "Cracks and salt water in the lower shaft.",
          "He's worried. We need to investigate.",
          "Haven't talked to him yet."
        ]
      },
      "report": {
        "text": "Salt water? In the deep shaft? We've mined these cliffs for generations. Never hit seawater. If the rock between us and the ocean is cracking...",
        "choices": [
          "Dera says we should consult the other islands.",
          "Should we stop mining?"
        ]
      },
      "worried": {
        "text": "Then go see it yourself. Check the cracks, touch the rock. I need your Tidewatcher instincts on this."
      },
      "gofirst": {
        "text": "Mine first. Talk to Kael, examine the shaft. I need a report. The village needs Verdium, but not at the cost of lives."
      },
      "agree": {
        "text": "Smart girl. Go — Spark Cove, Green Root, Luminara. Velessi know engineering, Korrim know the earth, Luminari keep the old records. Use the harbor. Tell them Brin sent you."
      },
      "stopmine": {
        "text": "Can't. Not yet. Village needs Verdium. But I'll have Kael pull back from the deep shaft. Go consult the other islands. Find out what we're dealing with."
      }
    },
    "harbor-travel": {
      "start": {
        "text": "Cliff Haven harbor. Boats rock gently in the swell. You can sail to any known island.",
        "choices": [
          "Open the world map",
          "Not right now"
        ]
      },
      "map": {
        "text": "You study the sailing charts..."
      },
      "end": {
        "text": ""
      }
    },
    "examine-telescope": {
      "start": {
        "text": "Green Root to the north — forests. Spark Cove east — workshop smoke. Luminara south — crystal spires catching both moons."
      },
      "start2": {
        "text": "The ocean between the islands is vast. No one knows what lies beneath. At least... that's what everyone believes."
      }
    },
    "roothold-default": {
      "start": {
        "text": "Halt. Elder Grove is sacred. What brings a Tidewatcher here?",
        "choices": [
          "I need to see Elder Mossa. About the tremors.",
          "Our mines are in trouble."
        ]
      },
      "tremors": {
        "text": "Tremors... We've felt them too. Even the Great Tree's roots are restless. Go. Mossa will want to hear this."
      },
      "learn": {
        "text": "The earth's been louder these past days. Speak with Mossa. The Elder knows more."
      }
    },
    "elder-mossa-default": {
      "start": {
        "text": "I felt your footsteps, Tidewatcher. The earth carries all things. Lately... it carries distress.",
        "choices": [
          "Salt water in our mines. Where it shouldn't be.",
          "Can you sense what's causing the tremors?"
        ]
      },
      "mining": {
        "text": "Salt water... The Verdium energy I feel through every root — it falters. The earth isn't just shaking. It's resisting."
      },
      "sense": {
        "text": "The tremors don't come from your rock. They come from below. Deeper than the cliffs. Deeper than the ocean floor."
      },
      "deeper": {
        "text": "The earth beneath Dualuna's oceans... breathes. A slow rhythm, like a sleeping giant. But lately, the breathing quickens. Something stirs.",
        "choices": [
          "Could our mining have disturbed it?",
          "What do you think is down there?"
        ]
      },
      "mining-cause": {
        "text": "Perhaps. Verdium veins connect to... something. When you mine, you sever old bonds. What if those bonds matter to something other than us?"
      },
      "whatis": {
        "text": "Our oldest songs speak of \"the world beneath the water.\" We thought them poetry. What if they were truth?"
      },
      "advice": {
        "text": "Try Luminara — their archives hold what we only remember as song. And that Velessi, Tink? Engineer eyes see what spirit ones miss."
      }
    },
    "examine-flora": {
      "start": {
        "text": "Glowing moss and ferns, green as Verdium. But in places, the glow is fading. The plants look... tired."
      }
    },
    "examine-great-root": {
      "start": {
        "text": "The Great Root Tree. Trunk wider than three houses, roots spanning the island. Press your ear to the bark — you hear a slow, steady thrum. A heartbeat."
      }
    },
    "tink-default": {
      "start": {
        "text": "A Tidewatcher! Been dying to study your cliff Verdium — totally different crystal structure! Wait. You've got that worried look. What broke?",
        "choices": [
          "Mine's cracking. Filling with seawater.",
          "Strange tremors on Cliff Haven."
        ]
      },
      "problem": {
        "text": "Seawater?! That's forty meters of solid basalt! If water's getting through, something breached the barrier from the OTHER side. Not your mining."
      },
      "tremors": {
        "text": "Tremors! Periodic? ...Periodic! That rules out tectonics. Periodic means a SOURCE. Something generating them. Hmm..."
      },
      "analysis": {
        "text": "I've got a half-built resonance sensor! Measures rock vibrations. The periodicity, the salt water, the cracking — something's pushing against your cliff from the ocean side!",
        "choices": [
          "Could something alive cause this?",
          "Can you build something to help?"
        ]
      },
      "alive": {
        "text": "I'm an engineer, not a storyteller! But... pressure doesn't pulse. Water doesn't intrude rhythmically. Something's either pushing or trying to get through. The physics says it's not random."
      },
      "build": {
        "text": "Already on it! Calibrate my sensor to Verdium frequencies and — YES! — I can trace the vibrations to their source! Give me a few days. Check the Luminari archives in the meantime!"
      }
    },
    "examine-machinery": {
      "start": {
        "text": "Half-finished inventions everywhere. A wind-mill, a twin-moon tide clock, self-mending nets, and... a brass octopus. Sign says: \"Don't touch. ESPECIALLY the octopus.\""
      }
    },
    "examine-blueprints": {
      "start": {
        "text": "Cliff Haven cross-section on the wall. Tink's notes: \"Veins extend below sea level. How deep?\" And smaller: \"Why do the deepest veins curve toward the ocean?\""
      }
    },
    "examine-prototype": {
      "start": {
        "text": "Crystal probes, a Verdium oscillator. Label: \"Resonance Sensor v3 — CLIFF HAVEN.\" Tiny gears, hand-wound coils. Tink's already on it."
      }
    },
    "scholar-elyn-default": {
      "start": {
        "text": "Your bioluminescence betrays your worry, Tidewatcher. What brings you to the Crystal Plaza?",
        "choices": [
          "Tremors in our mines. I need answers.",
          "I need the archives. Geological records."
        ]
      },
      "research": {
        "text": "Tremors near the Verdium mines... I've seen records of this before. Crystal tablets from the first settlers — they mention \"the voice of the deep.\" We called it mythology."
      },
      "archives": {
        "text": "The archives are open. But let me guide you — I've been cross-referencing geological surveys with old myths. I found correlations that shouldn't exist."
      },
      "reveal": {
        "text": "The first settlers described Verdium as \"bridges between worlds.\" Surface to something below. We assumed metaphor. But what if it's literal?",
        "choices": [
          "Something exists beneath the ocean?!",
          "Are we severing those connections by mining?"
        ]
      },
      "beneath": {
        "text": "One damaged tablet speaks of \"those who build below the water\" and \"cities where no moon shines.\" Filed under mythology. But your tremors, the seawater, the pulsing sounds... what if it's real?"
      },
      "severing": {
        "text": "Exactly what I fear. If Verdium connects surface and depth, we've been severing it for generations. And if something intelligent lives below... they might see our mining as an attack."
      },
      "conclude": {
        "text": "Take this knowledge to Cliff Haven. But tread carefully. The idea that our Verdium harvest harms someone we didn't know existed... not everyone will accept that."
      }
    },
    "examine-mural": {
      "start": {
        "text": "A crystal mural — four races arriving, Verdium discovered, villages built. But in the corner... shapes beneath waves, glowing in the dark ocean."
      }
    },
    "examine-geology-archives": {
      "start": {
        "text": "Centuries of geological surveys. The oldest note: \"Veins originate from beneath the ocean floor, not from the island rock itself.\" Someone underlined it in luminescent ink."
      }
    },
    "examine-ancient-records": {
      "start": {
        "text": "The oldest records. One fragment: \"...heard again the singing from below. A planet does not sing in harmonies. Only thinking beings sing in harmonies...\""
      }
    },
    "examine-pedestal": {
      "start": {
        "text": "A reading pedestal, humming with Verdium energy. Even here, far from the mines — everything on Dualuna is connected."
      }
    }
  }
};
