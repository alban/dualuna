// Location data — backgrounds are pre-rendered PNGs in assets/backgrounds/

export const LOCATIONS = {
  // ============== CLIFF HAVEN ==============
  'mine-entrance': {
    name: 'Verdium Mine Entrance',
    island: 'Cliff Haven',
    description: 'The main entrance to the cliff-face Verdium mines',
    introDialogue: 'intro-mine',
    connections: ['mine-shaft', 'tidewatcher-village', 'cliff-overlook'],
    hotspots: [
      {
        id: 'kael', x: 550, y: 400, width: 60, height: 80,
        label: 'Foreman Kael', action: 'dialogue', character: 'foreman-kael',
        dialogueId: 'foreman-kael-default',
      },
      {
        id: 'dera', x: 400, y: 420, width: 60, height: 80,
        label: 'Dera', action: 'dialogue', character: 'dera',
        dialogueId: 'dera-default',
      },
      {
        id: 'mine-entry', x: 790, y: 320, width: 60, height: 100,
        label: 'Enter the mine', action: 'travel', target: 'mine-shaft',
      },
      {
        id: 'verdium-crate', x: 590, y: 440, width: 40, height: 30,
        label: 'Verdium crate', action: 'examine', dialogueId: 'examine-verdium-crate',
      },
    ],
  },

  'mine-shaft': {
    name: 'Lower Mine Shaft',
    island: 'Cliff Haven',
    description: 'Deep inside the cliff — the Verdium extraction tunnels',
    connections: ['mine-entrance'],
    hotspots: [
      {
        id: 'cracks', x: 370, y: 220, width: 80, height: 100,
        label: 'Examine the cracks', action: 'examine', dialogueId: 'examine-cracks',
      },
      {
        id: 'water-puddle', x: 512, y: 480, width: 120, height: 40,
        label: 'Strange water', action: 'examine', dialogueId: 'examine-water',
      },
      {
        id: 'verdium-vein', x: 250, y: 200, width: 60, height: 40,
        label: 'Glowing Verdium vein', action: 'examine', dialogueId: 'examine-vein',
      },
    ],
  },

  'tidewatcher-village': {
    name: 'Tidewatcher Village',
    island: 'Cliff Haven',
    description: 'A cozy village perched between cliff tops and the sea',
    connections: ['mine-entrance', 'cliff-overlook'],
    hotspots: [
      {
        id: 'brin', x: 300, y: 360, width: 60, height: 80,
        label: 'Elder Brin', action: 'dialogue', character: 'village-elder-brin',
        dialogueId: 'brin-default',
      },
      {
        id: 'harbor', x: 800, y: 500, width: 100, height: 60,
        label: 'Harbor (travel to other islands)', action: 'examine',
        dialogueId: 'harbor-travel',
      },
    ],
  },

  'cliff-overlook': {
    name: 'Cliff Overlook',
    island: 'Cliff Haven',
    description: 'A breathtaking view of the ocean and distant islands',
    connections: ['tidewatcher-village', 'mine-entrance'],
    hotspots: [
      {
        id: 'telescope', x: 512, y: 520, width: 50, height: 60,
        label: 'Look through the telescope', action: 'examine',
        dialogueId: 'examine-telescope',
      },
    ],
  },

  // ============== GREEN ROOT ==============
  'forest-path': {
    name: 'Forest Path',
    island: 'Green Root',
    description: 'A winding path through ancient, Verdium-nourished forests',
    connections: ['elder-grove'],
    hotspots: [
      {
        id: 'roothold', x: 700, y: 400, width: 60, height: 80,
        label: 'Roothold the Warden', action: 'dialogue', character: 'korrim-guard',
        dialogueId: 'roothold-default',
      },
      {
        id: 'flora', x: 200, y: 440, width: 80, height: 50,
        label: 'Examine the flora', action: 'examine',
        dialogueId: 'examine-flora',
      },
    ],
  },

  'elder-grove': {
    name: 'Elder Grove',
    island: 'Green Root',
    description: 'Sacred gathering place of the Korrim elders, under the Great Root Tree',
    connections: ['forest-path'],
    hotspots: [
      {
        id: 'mossa', x: 350, y: 400, width: 60, height: 80,
        label: 'Elder Mossa', action: 'dialogue', character: 'elder-mossa',
        dialogueId: 'elder-mossa-default',
      },
      {
        id: 'great-root', x: 512, y: 300, width: 100, height: 100,
        label: 'The Great Root Tree', action: 'examine',
        dialogueId: 'examine-great-root',
      },
    ],
  },

  // ============== SPARK COVE ==============
  'harbor-workshop': {
    name: 'Harbor Workshop',
    island: 'Spark Cove',
    description: 'A bustling harbor filled with Velessi inventions and half-finished projects',
    connections: ['inventors-lab'],
    hotspots: [
      {
        id: 'tink', x: 350, y: 350, width: 60, height: 80,
        label: 'Tink the Inventor', action: 'dialogue', character: 'tink',
        dialogueId: 'tink-default',
      },
      {
        id: 'machinery', x: 560, y: 260, width: 80, height: 60,
        label: 'Examine machinery', action: 'examine',
        dialogueId: 'examine-machinery',
      },
    ],
  },

  'inventors-lab': {
    name: 'Tink\'s Laboratory',
    island: 'Spark Cove',
    description: 'A chaotic but brilliant workshop filled with prototypes and blueprints',
    connections: ['harbor-workshop'],
    hotspots: [
      {
        id: 'blueprints', x: 140, y: 120, width: 80, height: 60,
        label: 'Examine blueprints', action: 'examine',
        dialogueId: 'examine-blueprints',
      },
      {
        id: 'prototype', x: 680, y: 290, width: 60, height: 40,
        label: 'Strange prototype', action: 'examine',
        dialogueId: 'examine-prototype',
        requireFlag: 'talked-to-tink',
      },
    ],
  },

  // ============== LUMINARA ==============
  'crystal-plaza': {
    name: 'Crystal Plaza',
    island: 'Luminara',
    description: 'The luminous heart of Luminari culture, aglow with bioluminescent patterns',
    connections: ['archive-hall'],
    hotspots: [
      {
        id: 'elyn', x: 500, y: 400, width: 60, height: 80,
        label: 'Scholar Elyn', action: 'dialogue', character: 'scholar-elyn',
        dialogueId: 'scholar-elyn-default',
      },
      {
        id: 'mural', x: 180, y: 250, width: 80, height: 100,
        label: 'Ancient mural', action: 'examine',
        dialogueId: 'examine-mural',
      },
    ],
  },

  'archive-hall': {
    name: 'Archive Hall',
    island: 'Luminara',
    description: 'Rows of crystal tablets containing the collected knowledge of Dualuna',
    connections: ['crystal-plaza'],
    hotspots: [
      {
        id: 'geology-section', x: 210, y: 300, width: 100, height: 120,
        label: 'Geology archives', action: 'examine',
        dialogueId: 'examine-geology-archives',
      },
      {
        id: 'ancient-section', x: 530, y: 300, width: 100, height: 120,
        label: 'Ancient records', action: 'examine',
        dialogueId: 'examine-ancient-records',
      },
      {
        id: 'pedestal', x: 512, y: 380, width: 60, height: 60,
        label: 'Reading pedestal', action: 'examine',
        dialogueId: 'examine-pedestal',
      },
    ],
  },
};
