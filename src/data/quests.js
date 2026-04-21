export const QUESTS = {
  'tremors-in-the-deep': {
    title: 'Tremors in the Deep',
    description: 'Strange tremors are shaking the Verdium mines. Investigate the cause and find a solution.',
    triggerLocation: 'mine-entrance',
    objectives: [
      { id: 'talk-gael', description: 'Talk to Foreman Gaël about the tremors' },
      { id: 'examine-shaft', description: 'Examine the damage in the mine shaft' },
      { id: 'consult-lix', description: 'Consult Lix the engineer on Spark Cove' },
      { id: 'consult-mossa', description: 'Consult Elder Mossa on Green Root' },
      { id: 'research-archives', description: 'Research cliff geology in the Luminara archives' },
    ],
    onComplete: {
      setFlags: { 'ch1-investigation-complete': true },
      startQuest: 'the-deep-response',
    },
  },
  'the-deep-response': {
    title: 'The Deep Response',
    description: 'Armed with knowledge from across the islands, return to the mine to implement a solution.',
    objectives: [
      { id: 'return-to-gael', description: 'Report findings to Foreman Gaël' },
      { id: 'investigate-water', description: 'Investigate the strange water in the lower shaft' },
    ],
    onComplete: {
      setFlags: { 'ch1-complete': true },
    },
  },
};
