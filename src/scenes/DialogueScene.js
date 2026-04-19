import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues.js';
import { CHARACTERS, RACE_COLORS } from '../data/characters.js';
import { QuestManager } from '../systems/QuestManager.js';
import { I18n } from '../systems/I18n.js';

export class DialogueScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Dialogue' });
  }

  init(data) {
    this.dialogueId = data.dialogueId;
    this.returnScene = data.returnScene;
    this.returnData = data.returnData;
  }

  create() {
    const { width, height } = this.scale;
    const dialogue = DIALOGUES[this.dialogueId];

    if (!dialogue) {
      console.warn(`Dialogue not found: ${this.dialogueId}`);
      this.closeDialogue();
      return;
    }

    this.dialogue = dialogue;
    this.currentNodeId = dialogue.startNode || 'start';

    // Semi-transparent backdrop
    this.backdrop = this.add.graphics();
    this.backdrop.fillStyle(0x000000, 0.6);
    this.backdrop.fillRect(0, 0, width, height);
    this.backdrop.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    // Dialogue panel — large, covers bottom half
    this.panelY = height - 380;
    const panelH = 350;
    this.panel = this.add.graphics();
    this.panel.fillStyle(0x0a1520, 0.95);
    this.panel.fillRoundedRect(20, this.panelY, width - 40, panelH, 8);
    this.panel.lineStyle(1, 0x334455, 1);
    this.panel.strokeRoundedRect(20, this.panelY, width - 40, panelH, 8);

    // Portrait area (left side)
    this.portraitArea = this.add.graphics();
    this.portraitNameText = this.add.text(110, this.panelY + 140, '', {
      fontSize: '14px', fill: '#88ccdd', fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Dialogue text area
    this.dialogueText = this.add.text(210, this.panelY + 20, '', {
      fontSize: '24px', fill: '#ccddee', fontFamily: 'Georgia, serif',
      wordWrap: { width: width - 270 },
      lineSpacing: 10,
    });

    // Choices container
    this.choiceTexts = [];

    this.showNode(this.currentNodeId);
  }

  showNode(nodeId) {
    const node = this.dialogue.nodes[nodeId];
    if (!node) {
      console.warn(`Dialogue node not found: ${nodeId} in ${this.dialogueId}`);
      this.closeDialogue();
      return;
    }

    const state = this.registry.get('gameState');

    // Record that we've seen this dialogue
    if (!state.dialogueHistory.includes(this.dialogueId)) {
      state.dialogueHistory.push(this.dialogueId);
    }

    // Apply effects from this node
    if (node.effects) {
      this.applyEffects(node.effects, state);
    }

    // Show speaker portrait
    this.updatePortrait(node.speaker);

    // Get localized text (fall back to dialogue data)
    const localizedText = I18n.dialogue(this.dialogueId, nodeId, 'text') || node.text || '';
    this.dialogueText.setText('');
    this.typeText(localizedText, () => {
      this.showChoices(node, nodeId);
    });
  }

  updatePortrait(speakerId) {
    this.portraitArea.clear();

    if (!speakerId) {
      this.portraitNameText.setText('');
      return;
    }

    const char = CHARACTERS[speakerId];
    if (!char) {
      this.portraitNameText.setText(speakerId);
      return;
    }

    const color = RACE_COLORS[char.race] || 0x888888;
    const cx = 110, cy = this.panelY + 80;

    // Portrait background
    this.portraitArea.fillStyle(0x0d1a25, 1);
    this.portraitArea.fillRoundedRect(40, this.panelY + 15, 140, 130, 6);
    this.portraitArea.lineStyle(1, color, 0.6);
    this.portraitArea.strokeRoundedRect(40, this.panelY + 15, 140, 130, 6);

    // Simple character face
    this.portraitArea.fillStyle(color, 0.4);
    this.portraitArea.fillCircle(cx, cy, 35);
    this.portraitArea.fillStyle(color, 0.7);
    this.portraitArea.fillCircle(cx, cy - 5, 25); // face
    this.portraitArea.fillStyle(0xffffff, 0.8);
    this.portraitArea.fillCircle(cx - 8, cy - 10, 4); // left eye
    this.portraitArea.fillCircle(cx + 8, cy - 10, 4); // right eye
    this.portraitArea.fillStyle(color, 0.9);
    this.portraitArea.fillCircle(cx - 8, cy - 10, 2);
    this.portraitArea.fillCircle(cx + 8, cy - 10, 2);

    this.portraitNameText.setText(char.name);

    // Race tag
    if (!this.raceTag) {
      this.raceTag = this.add.text(130, this.panelY + 155, '', {
        fontSize: '10px', fill: '#667788', fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
      }).setOrigin(0.5);
    }
    this.raceTag.setText(char.race.charAt(0).toUpperCase() + char.race.slice(1));
  }

  typeText(fullText, onComplete) {
    // Show text instantly — no typewriter delay
    this.dialogueText.setText(fullText);
    onComplete();
  }

  showChoices(node, nodeId) {
    // Clear old choices
    this.choiceTexts.forEach(t => t.destroy());
    this.choiceTexts = [];

    const state = this.registry.get('gameState');
    const { width } = this.scale;

    if (node.choices && node.choices.length > 0) {
      // Filter choices by conditions, tracking original indices for i18n
      const validChoices = [];
      node.choices.forEach((c, originalIndex) => {
        if (c.requireFlag && !state.questFlags[c.requireFlag]) return;
        if (c.requireItem && !state.inventory.includes(c.requireItem)) return;
        validChoices.push({ ...c, _origIndex: originalIndex });
      });

      validChoices.forEach((choice, i) => {
        const y = this.panelY + 200 + i * 45;
        const choiceLabel = I18n.choice(this.dialogueId, nodeId, choice._origIndex) || choice.text;
        const text = this.add.text(210, y, `▸ ${choiceLabel}`, {
          fontSize: '22px', fill: '#88ccaa', fontFamily: 'Georgia, serif',
          backgroundColor: '#0a151f', padding: { x: 8, y: 6 },
        }).setInteractive({ useHandCursor: true });

        text.on('pointerover', () => text.setStyle({ fill: '#ffffff' }));
        text.on('pointerout', () => text.setStyle({ fill: '#88ccaa' }));
        text.on('pointerdown', () => {
          if (choice.effects) {
            this.applyEffects(choice.effects, state);
          }
          if (choice.next === 'end' || !choice.next) {
            this.closeDialogue();
          } else {
            this.showNode(choice.next);
          }
        });

        this.choiceTexts.push(text);
      });
    } else {
      // No choices — click to continue or end
      const label = node.next ? I18n.t('ui.continueDialogue') : I18n.t('ui.close');
      const continueText = this.add.text(width / 2, this.panelY + 250, label, {
          fontSize: '24px', fill: '#88ccaa', fontFamily: 'Georgia, serif',
          backgroundColor: '#0a151f', padding: { x: 14, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      continueText.on('pointerover', () => continueText.setStyle({ fill: '#ffffff' }));
      continueText.on('pointerout', () => continueText.setStyle({ fill: '#88ccaa' }));
      continueText.on('pointerdown', () => {
        if (node.next) {
          this.showNode(node.next);
        } else {
          this.closeDialogue();
        }
      });

      this.choiceTexts.push(continueText);
    }
  }

  applyEffects(effects, state) {
    if (effects.setFlags) {
      Object.assign(state.questFlags, effects.setFlags);
    }
    if (effects.addItem) {
      if (!state.inventory.includes(effects.addItem)) {
        state.inventory.push(effects.addItem);
      }
    }
    if (effects.removeItem) {
      state.inventory = state.inventory.filter(i => i !== effects.removeItem);
    }
    if (effects.addVerdium) {
      state.verdium += effects.addVerdium;
    }
    if (effects.startQuest) {
      QuestManager.startQuest(effects.startQuest, state);
    }
    if (effects.completeObjective) {
      QuestManager.completeObjective(effects.completeObjective.quest, effects.completeObjective.objective, state);
    }
    if (effects.discoverIsland) {
      if (!state.discoveredIslands.includes(effects.discoverIsland)) {
        state.discoveredIslands.push(effects.discoverIsland);
      }
    }
    if (effects.discoverIslands) {
      for (const island of effects.discoverIslands) {
        if (!state.discoveredIslands.includes(island)) {
          state.discoveredIslands.push(island);
        }
      }
    }
    this.registry.set('gameState', state);
  }

  closeDialogue() {
    const state = this.registry.get('gameState');

    // Check if we should open the world map
    if (state.questFlags['open-map']) {
      delete state.questFlags['open-map'];
      this.registry.set('gameState', state);
      this.scene.stop(this.returnScene);
      this.scene.start('WorldMap');
      this.scene.stop();
      return;
    }

    this.scene.resume(this.returnScene);
    this.scene.stop();
    // Restart the location scene to reflect any changes
    this.scene.get(this.returnScene).scene.restart(this.returnData);
  }
}
