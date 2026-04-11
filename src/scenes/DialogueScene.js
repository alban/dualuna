import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues.js';
import { CHARACTERS } from '../data/characters.js';
import { QuestManager } from '../systems/QuestManager.js';

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

    // Dialogue panel
    this.panelY = height - 300;
    this.panel = this.add.graphics();
    this.panel.fillStyle(0x0a1520, 0.95);
    this.panel.fillRoundedRect(40, this.panelY, width - 80, 270, 8);
    this.panel.lineStyle(1, 0x334455, 1);
    this.panel.strokeRoundedRect(40, this.panelY, width - 80, 270, 8);

    // Portrait area (left side)
    this.portraitArea = this.add.graphics();
    this.portraitNameText = this.add.text(130, this.panelY + 140, '', {
      fontSize: '13px', fill: '#88ccdd', fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Dialogue text area
    this.dialogueText = this.add.text(230, this.panelY + 20, '', {
      fontSize: '16px', fill: '#ccddee', fontFamily: 'Georgia, serif',
      wordWrap: { width: width - 300 },
      lineSpacing: 6,
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

    // Type out the text
    this.dialogueText.setText('');
    this.typeText(node.text, () => {
      this.showChoices(node);
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

    const raceColors = {
      tidewatcher: 0x6688aa, korrim: 0x558844, velessi: 0xaaaa44, luminari: 0x8866bb,
      coralline: 0xcc6677, deepkin: 0x4466aa, shellborn: 0x887744,
    };
    const color = raceColors[char.race] || 0x888888;
    const cx = 130, cy = this.panelY + 75;

    // Portrait background
    this.portraitArea.fillStyle(0x0d1a25, 1);
    this.portraitArea.fillRoundedRect(70, this.panelY + 15, 120, 115, 6);
    this.portraitArea.lineStyle(1, color, 0.6);
    this.portraitArea.strokeRoundedRect(70, this.panelY + 15, 120, 115, 6);

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
    let index = 0;
    this.dialogueText.setText('');

    // Allow clicking to skip typing
    const skipHandler = () => {
      if (index < fullText.length) {
        index = fullText.length;
        this.dialogueText.setText(fullText);
        if (this.typeTimer) this.typeTimer.remove();
        onComplete();
      }
    };
    this.backdrop.once('pointerdown', skipHandler);

    this.typeTimer = this.time.addEvent({
      delay: 10,
      repeat: Math.ceil(fullText.length / 3) - 1,
      callback: () => {
        index = Math.min(index + 3, fullText.length);
        this.dialogueText.setText(fullText.substring(0, index));
        if (index >= fullText.length) {
          this.backdrop.off('pointerdown', skipHandler);
          onComplete();
        }
      },
    });
  }

  showChoices(node) {
    // Clear old choices
    this.choiceTexts.forEach(t => t.destroy());
    this.choiceTexts = [];

    const state = this.registry.get('gameState');
    const { width } = this.scale;

    if (node.choices && node.choices.length > 0) {
      // Filter choices by conditions
      const validChoices = node.choices.filter(c => {
        if (c.requireFlag && !state.questFlags[c.requireFlag]) return false;
        if (c.requireItem && !state.inventory.includes(c.requireItem)) return false;
        return true;
      });

      validChoices.forEach((choice, i) => {
        const y = this.panelY + 170 + i * 30;
        const text = this.add.text(230, y, `▸ ${choice.text}`, {
          fontSize: '14px', fill: '#88ccaa', fontFamily: 'Georgia, serif',
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
      const continueText = this.add.text(width / 2, this.panelY + 200,
        node.next ? '▸ Continue' : '▸ Close', {
          fontSize: '15px', fill: '#88ccaa', fontFamily: 'Georgia, serif',
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
    if (this.typeTimer) this.typeTimer.remove();
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
