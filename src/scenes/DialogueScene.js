import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues.js';
import { CHARACTERS, RACE_COLORS } from '../data/characters.js';
import { QuestManager } from '../systems/QuestManager.js';
import { I18n } from '../systems/I18n.js';
import { BASE_W, BASE_H } from '../utils/layout.js';

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
    const sx = width / BASE_W, sy = height / BASE_H, ss = Math.min(sx, sy);
    this.sx = sx; this.sy = sy; this.ss = ss;

    const dialogue = DIALOGUES[this.dialogueId];
    if (!dialogue) {
      console.warn(`Dialogue not found: ${this.dialogueId}`);
      this.closeDialogue();
      return;
    }

    this.dialogue = dialogue;
    this.currentNodeId = dialogue.startNode || 'start';

    // Semi-transparent backdrop — also acts as emergency close
    this.backdrop = this.add.graphics();
    this.backdrop.fillStyle(0x000000, 0.6);
    this.backdrop.fillRect(0, 0, width, height);
    this.backdrop.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    // Panel — bottom half of screen
    const panelH = Math.round(350 * sy);
    this.panelY = height - panelH - Math.round(30 * sy);
    this.panelH = panelH;
    this.panel = this.add.graphics();
    this.panel.fillStyle(0x0a1520, 0.95);
    this.panel.fillRoundedRect(Math.round(20 * sx), this.panelY, width - Math.round(40 * sx), panelH, 8);
    this.panel.lineStyle(1, 0x334455, 1);
    this.panel.strokeRoundedRect(Math.round(20 * sx), this.panelY, width - Math.round(40 * sx), panelH, 8);

    // Close button — always visible, always works
    const closeBtn = this.add.text(
      width - Math.round(40 * sx), this.panelY - Math.round(18 * sy), '✕', {
        fontSize: `${Math.round(22 * ss)}px`, fill: '#667788', fontFamily: 'Georgia, serif',
        backgroundColor: '#0a1520cc', padding: { x: 8, y: 4 },
      }
    ).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setStyle({ fill: '#aabbcc' }));
    closeBtn.on('pointerout', () => closeBtn.setStyle({ fill: '#667788' }));
    closeBtn.on('pointerdown', () => this.closeDialogue());

    // Portrait area
    this.portraitArea = this.add.graphics();
    this.portraitNameText = this.add.text(Math.round(110 * sx), this.panelY + Math.round(140 * sy), '', {
      fontSize: `${Math.round(14 * sy)}px`, fill: '#88ccdd', fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Dialogue text area
    this.dialogueText = this.add.text(Math.round(210 * sx), this.panelY + Math.round(20 * sy), '', {
      fontSize: `${Math.round(30 * sy)}px`, fill: '#ccddee', fontFamily: 'Georgia, serif',
      wordWrap: { width: width - Math.round(270 * sx) },
      lineSpacing: Math.round(10 * sy),
    });

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

    if (!state.dialogueHistory.includes(this.dialogueId)) {
      state.dialogueHistory.push(this.dialogueId);
    }

    if (node.effects) {
      this.applyEffects(node.effects, state);
    }

    this.updatePortrait(node.speaker);

    const localizedText = I18n.dialogue(this.dialogueId, nodeId, 'text') || node.text || '';
    this.dialogueText.setText('');
    this.typeText(localizedText, () => {
      this.showChoices(node, nodeId);
    });
  }

  updatePortrait(speakerId) {
    this.portraitArea.clear();
    if (this.portraitImage && this.portraitImage.active) { this.portraitImage.destroy(); }
    this.portraitImage = null;

    if (!speakerId) {
      this.portraitNameText.setText('');
      return;
    }

    const char = CHARACTERS[speakerId];
    if (!char) {
      this.portraitNameText.setText(speakerId);
      return;
    }

    const sx = this.sx, sy = this.sy, ss = this.ss;
    const color = RACE_COLORS[char.race] || 0x888888;
    const frameX = Math.round(40 * sx), frameY = this.panelY + Math.round(15 * sy);
    const frameW = Math.round(140 * sx), frameH = Math.round(130 * sy);
    const cx = frameX + frameW / 2, cy = frameY + frameH / 2;

    // Dark background fill
    this.portraitArea.fillStyle(0x0d1a25, 1);
    this.portraitArea.fillRoundedRect(frameX, frameY, frameW, frameH, 6);

    const textureKey = `portrait-${speakerId}`;
    if (this.textures.exists(textureKey) && this.textures.get(textureKey).key !== '__MISSING') {
      this.portraitImage = this.add.image(cx, cy, textureKey);
      const scale = Math.min(frameW / this.portraitImage.width, frameH / this.portraitImage.height);
      this.portraitImage.setScale(scale);
    } else {
      // Fallback: race-coloured silhouette
      this.portraitArea.fillStyle(color, 0.35);
      this.portraitArea.fillCircle(cx, cy, Math.round(35 * ss));
      this.portraitArea.fillStyle(color, 0.65);
      this.portraitArea.fillCircle(cx, cy - Math.round(5 * sy), Math.round(25 * ss));
    }

    // Coloured border drawn on top
    this.portraitArea.lineStyle(1, color, 0.7);
    this.portraitArea.strokeRoundedRect(frameX, frameY, frameW, frameH, 6);

    this.portraitNameText.setText(char.name);

    if (!this.raceTag) {
      this.raceTag = this.add.text(Math.round(110 * sx), this.panelY + Math.round(155 * sy), '', {
        fontSize: `${Math.round(10 * sy)}px`, fill: '#667788', fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
      }).setOrigin(0.5);
    }
    this.raceTag.setText(char.race.charAt(0).toUpperCase() + char.race.slice(1));
  }

  typeText(fullText, onComplete) {
    this.dialogueText.setText(fullText);
    onComplete();
  }

  showChoices(node, nodeId) {
    this.choiceTexts.forEach(t => t.destroy());
    this.choiceTexts = [];

    const state = this.registry.get('gameState');
    const { width } = this.scale;
    const sy = this.sy, sx = this.sx;

    if (node.choices && node.choices.length > 0) {
      const validChoices = [];
      node.choices.forEach((c, originalIndex) => {
        if (c.requireFlag && !state.questFlags[c.requireFlag]) return;
        if (c.requireItem && !state.inventory.includes(c.requireItem)) return;
        validChoices.push({ ...c, _origIndex: originalIndex });
      });

      // If all choices were filtered out, fall through to the continue button
      if (validChoices.length === 0) {
        const label = node.next ? I18n.t('ui.continueDialogue') : I18n.t('ui.close');
        const continueText = this.add.text(width / 2, this.panelY + Math.round(250 * sy), label, {
          fontSize: `${Math.round(28 * sy)}px`, fill: '#88ccaa', fontFamily: 'Georgia, serif',
          backgroundColor: '#0a151f', padding: { x: 16, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        continueText.on('pointerover', () => continueText.setStyle({ fill: '#ffffff' }));
        continueText.on('pointerout', () => continueText.setStyle({ fill: '#88ccaa' }));
        continueText.on('pointerdown', () => {
          if (node.next) this.showNode(node.next);
          else this.closeDialogue();
        });
        this.choiceTexts.push(continueText);
        return;
      }

      validChoices.forEach((choice, i) => {
        const y = this.panelY + Math.round(200 * sy) + i * Math.round(45 * sy);
        const choiceLabel = I18n.choice(this.dialogueId, nodeId, choice._origIndex) || choice.text;
        const text = this.add.text(Math.round(210 * sx), y, `▸ ${choiceLabel}`, {
          fontSize: `${Math.round(28 * sy)}px`, fill: '#88ccaa', fontFamily: 'Georgia, serif',
          backgroundColor: '#0a151f', padding: { x: 10, y: 8 },
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
      const label = node.next ? I18n.t('ui.continueDialogue') : I18n.t('ui.close');
      const continueText = this.add.text(width / 2, this.panelY + Math.round(250 * sy), label, {
        fontSize: `${Math.round(28 * sy)}px`, fill: '#88ccaa', fontFamily: 'Georgia, serif',
        backgroundColor: '#0a151f', padding: { x: 16, y: 10 },
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
    this.scene.get(this.returnScene).scene.restart(this.returnData);
  }
}
