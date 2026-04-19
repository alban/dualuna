import Phaser from 'phaser';
import { LOCATIONS } from '../data/locations.js';
import { CHARACTERS, RACE_COLORS } from '../data/characters.js';
import { SaveManager } from '../systems/SaveManager.js';
import { QuestManager } from '../systems/QuestManager.js';
import { I18n } from '../systems/I18n.js';
import { BASE_W, BASE_H } from '../utils/layout.js';

export class LocationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Location' });
  }

  init(data) {
    this.locationId = data.locationId;
  }

  create() {
    const { width, height } = this.scale;
    const state = this.registry.get('gameState');
    const location = LOCATIONS[this.locationId];

    if (!location) {
      console.error(`Unknown location: ${this.locationId}`);
      this.scene.start('Menu');
      return;
    }

    this.sx = width / BASE_W;
    this.sy = height / BASE_H;

    // Update state
    state.currentLocation = this.locationId;
    if (!state.visitedLocations.includes(this.locationId)) {
      state.visitedLocations.push(this.locationId);
    }
    this.registry.set('gameState', state);

    // Draw background
    this.drawBackground(location);

    // Day/night overlay
    this.drawDayNight(state.dayPhase);

    // Create hotspots
    this.createHotspots(location);

    // Bottom UI bar
    this.createUI(location, state);

    // Auto-trigger dialogue if this is a first visit with an intro
    if (location.introDialogue && !state.dialogueHistory.includes(location.introDialogue)) {
      this.time.delayedCall(500, () => {
        this.startDialogue(location.introDialogue);
      });
    }

    // Check quest triggers
    QuestManager.checkLocationTriggers(this.locationId, state);
    this.registry.set('gameState', state);
  }

  drawBackground(location) {
    const { width, height } = this.scale;
    const bg = this.add.image(0, 0, `bg-${this.locationId}`).setOrigin(0, 0);
    bg.setDisplaySize(width, height);
  }

  drawDayNight(phase) {
    const { width, height } = this.scale;
    const alphaMap = { morning: 0.05, day: 0, evening: 0.15, night: 0.35 };
    const colorMap = { morning: 0xffaa44, day: 0x000000, evening: 0xff6633, night: 0x000033 };
    const alpha = alphaMap[phase] || 0;
    const color = colorMap[phase] || 0x000000;
    if (alpha > 0) {
      this.add.rectangle(width / 2, (height - 120) / 2, width, height - 120, color, alpha);
    }
  }

  createHotspots(location) {
    const state = this.registry.get('gameState');
    const sx = this.sx, sy = this.sy, ss = Math.min(sx, sy);

    if (!location.hotspots) return;

    for (const hotspot of location.hotspots) {
      if (hotspot.requireFlag && !state.questFlags[hotspot.requireFlag]) continue;
      if (hotspot.hideFlag && state.questFlags[hotspot.hideFlag]) continue;

      const hx = Math.round(hotspot.x * sx), hy = Math.round(hotspot.y * sy);
      const hw = Math.round(hotspot.width * sx), hh = Math.round(hotspot.height * sy);

      const zone = this.add.zone(hx, hy, hw, hh).setInteractive({ useHandCursor: true });

      const hsLabel = I18n.tOr(`locations.${this.locationId}.hotspots.${hotspot.id}`, hotspot.label);
      const labelY = hy - hh / 2 - 16;
      const labelText = this.add.text(hx, labelY, hsLabel, {
        fontSize: `${Math.round(16 * sy)}px`, fill: '#aaddcc', fontFamily: 'Georgia, serif',
        stroke: '#000000', strokeThickness: 2,
        backgroundColor: '#00000088', padding: { x: 8, y: 5 },
      }).setOrigin(0.5).setAlpha(0);

      const indicator = this.add.graphics();

      if (hotspot.action === 'dialogue' && hotspot.character) {
        const char = CHARACTERS[hotspot.character];
        if (char) {
          const color = RACE_COLORS[char.race] || 0x888888;
          const r = Math.round(22 * ss);
          indicator.fillStyle(color, 0.8);
          indicator.fillCircle(hx, hy, r);
          indicator.fillStyle(0xffffff, 0.9);
          indicator.fillCircle(hx, hy - Math.round(2 * sy), Math.round(9 * ss));
          this.add.text(hx, hy + Math.round(24 * sy), char.name, {
            fontSize: `${Math.round(14 * sy)}px`, fill: '#dddddd', fontFamily: 'Georgia, serif',
            stroke: '#000000', strokeThickness: 2,
          }).setOrigin(0.5);
        }
      }

      if (hotspot.action === 'travel') {
        indicator.lineStyle(2, 0x88ccaa, 0.5);
        indicator.strokeRect(hx - hw / 2, hy - hh / 2, hw, hh);
      }

      if (hotspot.action === 'examine') {
        indicator.fillStyle(0xffcc44, 0.6);
        indicator.fillCircle(hx, hy, Math.round(6 * ss));
      }

      const isTouch = this.sys.game.device.input.touch;
      if (isTouch) {
        labelText.setAlpha(0.8);
      } else {
        zone.on('pointerover', () => {
          labelText.setAlpha(1);
          this.tweens.add({ targets: labelText, y: labelY, duration: 150 });
        });
        zone.on('pointerout', () => {
          labelText.setAlpha(0);
          labelText.y = labelY + 4;
        });
      }
      zone.on('pointerdown', () => this.handleHotspot(hotspot));
    }
  }

  handleHotspot(hotspot) {
    const state = this.registry.get('gameState');

    switch (hotspot.action) {
      case 'travel':
        this.scene.start('Location', { locationId: hotspot.target });
        break;

      case 'dialogue':
        this.startDialogue(hotspot.dialogueId || `${hotspot.character}-default`);
        break;

      case 'examine':
        this.startDialogue(hotspot.dialogueId);
        break;

      case 'item':
        if (!state.inventory.includes(hotspot.itemId)) {
          state.inventory.push(hotspot.itemId);
          this.registry.set('gameState', state);
          this.showNotification(`Found: ${hotspot.itemName}`);
        }
        break;

      default:
        console.warn('Unknown hotspot action:', hotspot.action);
    }
  }

  startDialogue(dialogueId) {
    this.scene.launch('Dialogue', {
      dialogueId,
      returnScene: 'Location',
      returnData: { locationId: this.locationId },
    });
    this.scene.pause();
  }

  showNotification(text) {
    const { width } = this.scale;
    const notif = this.add.text(width / 2, Math.round(100 * this.sy), text, {
      fontSize: `${Math.round(18 * this.sy)}px`, fill: '#44ff88', fontFamily: 'Georgia, serif',
      stroke: '#003311', strokeThickness: 3,
      backgroundColor: '#003322aa', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: notif,
      alpha: 1, y: Math.round(90 * this.sy),
      duration: 400,
      yoyo: true,
      hold: 1500,
      onComplete: () => notif.destroy(),
    });
  }

  createUI(location, state) {
    const { width, height } = this.scale;
    const sx = this.sx, sy = this.sy;

    const uiLocName = I18n.tOr(`locations.${this.locationId}.name`, location.name);
    this.add.text(Math.round(15 * sx), height - Math.round(55 * sy), uiLocName, {
      fontSize: `${Math.round(16 * sy)}px`, fill: '#ffffff', fontFamily: 'Georgia, serif',
      stroke: '#000000', strokeThickness: 3,
    });
    this.add.text(Math.round(15 * sx), height - Math.round(32 * sy), `◆ ${state.verdium}`, {
      fontSize: `${Math.round(14 * sy)}px`, fill: '#44cc88', fontFamily: 'Georgia, serif',
      stroke: '#000000', strokeThickness: 2,
    });

    // Navigation buttons
    if (location.connections) {
      let navX = Math.round(15 * sx);
      const navY = height - Math.round(90 * sy);

      for (const connId of location.connections) {
        const connLoc = LOCATIONS[connId];
        if (!connLoc) continue;

        const connName = I18n.tOr(`locations.${connId}.name`, connLoc.name);
        const btn = this.add.text(navX, navY, `▸ ${connName}`, {
          fontSize: `${Math.round(15 * sy)}px`, fill: '#ccddee', fontFamily: 'Georgia, serif',
          stroke: '#000000', strokeThickness: 3,
          backgroundColor: '#000000aa', padding: { x: 8, y: 5 },
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#ffffff' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#ccddee' }));
        btn.on('pointerdown', () => {
          this.scene.start('Location', { locationId: connId });
        });

        navX += btn.width + 8;
      }
    }

    // Quest hint
    const activeQuests = QuestManager.getActiveQuests(state);
    if (activeQuests.length > 0) {
      const questTitle = I18n.tOr(`quests.${activeQuests[0].id}`, activeQuests[0].title);
      this.add.text(Math.round(15 * sx), height - Math.round(12 * sy), `📋 ${questTitle}`, {
        fontSize: `${Math.round(11 * sy)}px`, fill: '#ccaa66', fontFamily: 'Georgia, serif',
        stroke: '#000000', strokeThickness: 2,
      });
    }

    // Floating buttons: Map + Config (bottom-right)
    const btnSize = Math.round(60 * Math.min(sx, sy));
    const btnStyle = { fontSize: `${Math.round(36 * Math.min(sx, sy))}px`, fill: '#ccddee', fontFamily: 'Georgia, serif' };

    const mapBg = this.add.rectangle(width - btnSize - btnSize / 2 - 10, height - btnSize / 2 - 8, btnSize, btnSize, 0x000000, 0.6)
      .setInteractive({ useHandCursor: true });
    const mapTxt = this.add.text(width - btnSize - btnSize / 2 - 10, height - btnSize / 2 - 8, '🗺', btnStyle).setOrigin(0.5);
    mapBg.on('pointerover', () => mapTxt.setStyle({ fill: '#ffffff' }));
    mapBg.on('pointerout', () => mapTxt.setStyle({ fill: '#ccddee' }));
    mapBg.on('pointerdown', () => this.scene.start('WorldMap'));

    const cfgBg = this.add.rectangle(width - btnSize / 2 - 5, height - btnSize / 2 - 8, btnSize, btnSize, 0x000000, 0.6)
      .setInteractive({ useHandCursor: true });
    const cfgTxt = this.add.text(width - btnSize / 2 - 5, height - btnSize / 2 - 8, '⚙', btnStyle).setOrigin(0.5);
    cfgBg.on('pointerover', () => cfgTxt.setStyle({ fill: '#ffffff' }));
    cfgBg.on('pointerout', () => cfgTxt.setStyle({ fill: '#ccddee' }));
    cfgBg.on('pointerdown', () => this.openConfigMenu(state));
  }

  openConfigMenu(state) {
    const { width, height } = this.scale;
    const sx = this.sx, sy = this.sy, ss = Math.min(sx, sy);

    const backdrop = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setInteractive();

    const panelW = Math.round(450 * sx), panelH = Math.round(540 * sy);
    const panelX = width / 2, panelY = height / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x0a1520, 0.95);
    panel.fillRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 12);
    panel.lineStyle(1, 0x334455, 1);
    panel.strokeRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 12);

    const elements = [backdrop, panel];

    const makeCfgBtn = (y, label, onClick) => {
      const bg = this.add.rectangle(panelX, y, panelW - 40, Math.round(72 * sy), 0x1a2a3a, 0.8)
        .setInteractive({ useHandCursor: true });
      const txt = this.add.text(panelX, y, label, {
        fontSize: `${Math.round(26 * ss)}px`, fill: '#88aacc', fontFamily: 'Georgia, serif',
      }).setOrigin(0.5);
      bg.on('pointerover', () => txt.setStyle({ fill: '#ffffff' }));
      bg.on('pointerout', () => txt.setStyle({ fill: '#88aacc' }));
      bg.on('pointerdown', onClick);
      elements.push(bg, txt);
    };

    this.time.paused = true;
    const closeMenu = () => {
      this.time.paused = false;
      elements.forEach(el => el.destroy());
    };
    const btnSpacing = Math.round(65 * sy);

    makeCfgBtn(panelY - btnSpacing * 2.5, '💾  ' + I18n.t('ui.saveLabel'), () => {
      SaveManager.save(state);
      closeMenu();
      this.showNotification(I18n.t('ui.gameSaved'));
    });

    makeCfgBtn(panelY - btnSpacing * 1.5, '📤  ' + I18n.t('ui.exportLabel'), () => {
      SaveManager.save(state);
      SaveManager.exportJSON(state);
      closeMenu();
    });

    makeCfgBtn(panelY - btnSpacing * 0.5, '📥  ' + I18n.t('ui.importLabel'), () => {
      closeMenu();
      SaveManager.importJSON(
        (save) => {
          this.registry.set('gameState', save);
          SaveManager.save(save);
          this.showNotification(I18n.t('ui.importSuccess'));
          this.scene.start('Location', { locationId: save.currentLocation });
        },
        () => this.showNotification(I18n.t('ui.importError')),
      );
    });

    makeCfgBtn(panelY + btnSpacing * 0.5, '🌐  ' + I18n.t('ui.languageLabel'), () => {
      SaveManager.save(state);
      closeMenu();
      this.scene.start('Language');
    });

    const fsLabel = document.fullscreenElement ? I18n.t('ui.exitFullscreenLabel') : I18n.t('ui.fullscreenLabel');
    makeCfgBtn(panelY + btnSpacing * 1.5, '⛶  ' + fsLabel, () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      closeMenu();
    });

    makeCfgBtn(panelY + btnSpacing * 2.5, '↻  ' + I18n.t('ui.restart'), () => {
      window.location.reload();
    });

    const closeBtn = this.add.text(panelX + panelW / 2 - 15, panelY - panelH / 2 + 8, '✕', {
      fontSize: `${Math.round(22 * ss)}px`, fill: '#667788', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', closeMenu);
    elements.push(closeBtn);

    backdrop.on('pointerdown', closeMenu);
  }
}
