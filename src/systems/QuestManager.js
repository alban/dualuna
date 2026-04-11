import { QUESTS } from '../data/quests.js';

export class QuestManager {
  static startQuest(questId, state) {
    if (state.quests[questId]) return; // already started

    const quest = QUESTS[questId];
    if (!quest) {
      console.warn(`Quest not found: ${questId}`);
      return;
    }

    state.quests[questId] = {
      status: 'active',
      objectives: {},
    };

    // Initialize all objectives as incomplete
    for (const obj of quest.objectives) {
      state.quests[questId].objectives[obj.id] = false;
    }
  }

  static completeObjective(questId, objectiveId, state) {
    const questState = state.quests[questId];
    if (!questState || questState.status !== 'active') return;

    questState.objectives[objectiveId] = true;

    // Check if all objectives are complete
    const quest = QUESTS[questId];
    const allDone = quest.objectives.every(obj => questState.objectives[obj.id]);

    if (allDone) {
      questState.status = 'completed';
      // Apply quest completion effects
      if (quest.onComplete) {
        if (quest.onComplete.setFlags) {
          Object.assign(state.questFlags, quest.onComplete.setFlags);
        }
        if (quest.onComplete.startQuest) {
          this.startQuest(quest.onComplete.startQuest, state);
        }
        if (quest.onComplete.discoverIsland) {
          if (!state.discoveredIslands.includes(quest.onComplete.discoverIsland)) {
            state.discoveredIslands.push(quest.onComplete.discoverIsland);
          }
        }
      }
    }
  }

  static getActiveQuests(state) {
    const active = [];
    for (const [id, questState] of Object.entries(state.quests)) {
      if (questState.status === 'active') {
        const quest = QUESTS[id];
        if (quest) {
          active.push({
            id,
            title: quest.title,
            description: quest.description,
            objectives: quest.objectives.map(obj => ({
              ...obj,
              completed: questState.objectives[obj.id],
            })),
          });
        }
      }
    }
    return active;
  }

  static checkLocationTriggers(locationId, state) {
    for (const [questId, quest] of Object.entries(QUESTS)) {
      // Auto-start quests triggered by visiting a location
      if (quest.triggerLocation === locationId && !state.quests[questId]) {
        this.startQuest(questId, state);
      }
    }
  }
}
