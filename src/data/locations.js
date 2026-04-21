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
        id: 'gael', x: 688, y: 375, width: 75, height: 75,
        label: 'Foreman Gaël', action: 'dialogue', character: 'foreman-gael',
        dialogueId: 'foreman-gael-default',
      },
      {
        id: 'lera', x: 500, y: 394, width: 75, height: 75,
        label: 'Léra', action: 'dialogue', character: 'lera',
        dialogueId: 'lera-default',
      },
      {
        id: 'mine-entry', x: 988, y: 300, width: 75, height: 94,
        label: 'Enter the mine', action: 'travel', target: 'mine-shaft',
      },
      {
        id: 'verdium-crate', x: 738, y: 413, width: 50, height: 28,
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
        id: 'cracks', x: 463, y: 206, width: 100, height: 94,
        label: 'Examine the cracks', action: 'examine', dialogueId: 'examine-cracks',
      },
      {
        id: 'water-puddle', x: 640, y: 450, width: 150, height: 38,
        label: 'Strange water', action: 'examine', dialogueId: 'examine-water',
      },
      {
        id: 'verdium-vein', x: 313, y: 188, width: 75, height: 38,
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
        id: 'brin', x: 375, y: 338, width: 75, height: 75,
        label: 'Elder Brin', action: 'dialogue', character: 'village-elder-brin',
        dialogueId: 'brin-default',
      },
      {
        id: 'harbor', x: 1000, y: 469, width: 125, height: 56,
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
        id: 'telescope', x: 640, y: 488, width: 63, height: 56,
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
        id: 'roothold', x: 875, y: 375, width: 75, height: 75,
        label: 'Roothold the Warden', action: 'dialogue', character: 'korrim-guard',
        dialogueId: 'roothold-default',
      },
      {
        id: 'flora', x: 250, y: 413, width: 100, height: 47,
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
        id: 'mossa', x: 438, y: 375, width: 75, height: 75,
        label: 'Elder Mossa', action: 'dialogue', character: 'elder-mossa',
        dialogueId: 'elder-mossa-default',
      },
      {
        id: 'great-root', x: 640, y: 281, width: 125, height: 94,
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
        id: 'lix', x: 438, y: 328, width: 75, height: 75,
        label: 'Lix the Inventor', action: 'dialogue', character: 'lix',
        dialogueId: 'lix-default',
      },
      {
        id: 'machinery', x: 700, y: 244, width: 100, height: 56,
        label: 'Examine machinery', action: 'examine',
        dialogueId: 'examine-machinery',
      },
    ],
  },

  'inventors-lab': {
    name: 'Lix\'s Laboratory',
    island: 'Spark Cove',
    description: 'A chaotic but brilliant workshop filled with prototypes and blueprints',
    connections: ['harbor-workshop'],
    hotspots: [
      {
        id: 'blueprints', x: 175, y: 113, width: 100, height: 56,
        label: 'Examine blueprints', action: 'examine',
        dialogueId: 'examine-blueprints',
      },
      {
        id: 'prototype', x: 850, y: 272, width: 75, height: 38,
        label: 'Strange prototype', action: 'examine',
        dialogueId: 'examine-prototype',
        requireFlag: 'talked-to-lix',
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
        id: 'eline', x: 625, y: 375, width: 75, height: 75,
        label: 'Scholar Éline', action: 'dialogue', character: 'scholar-eline',
        dialogueId: 'scholar-eline-default',
      },
      {
        id: 'mural', x: 225, y: 234, width: 100, height: 94,
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
        id: 'geology-section', x: 263, y: 281, width: 125, height: 113,
        label: 'Geology archives', action: 'examine',
        dialogueId: 'examine-geology-archives',
      },
      {
        id: 'ancient-section', x: 663, y: 281, width: 125, height: 113,
        label: 'Ancient records', action: 'examine',
        dialogueId: 'examine-ancient-records',
      },
      {
        id: 'pedestal', x: 640, y: 356, width: 75, height: 56,
        label: 'Reading pedestal', action: 'examine',
        dialogueId: 'examine-pedestal',
      },
    ],
  },
};
