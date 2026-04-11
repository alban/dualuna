import { LOCATIONS } from '../data/locations.js';
import { CHARACTERS } from '../data/characters.js';
import { SaveManager } from '../systems/SaveManager.js';
import { QuestManager } from '../systems/QuestManager.js';
import { I18n } from '../systems/I18n.js';

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

    // Pre-rendered background image — full canvas size, UI bar draws on top
    this.add.image(0, 0, `bg-${this.locationId}`).setOrigin(0, 0);

    // Location name watermark (localized)
    const locName = I18n.t(`locations.${this.locationId}.name`) !== `locations.${this.locationId}.name`
      ? I18n.t(`locations.${this.locationId}.name`) : location.name;
    this.add.text(width / 2, 30, locName, {
      fontSize: '24px', fill: '#ffffff', fontFamily: 'Georgia, serif',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0.7);

    // Description (localized)
    const locDesc = I18n.t(`locations.${this.locationId}.description`) !== `locations.${this.locationId}.description`
      ? I18n.t(`locations.${this.locationId}.description`) : location.description;
    if (locDesc) {
      this.add.text(width / 2, 60, locDesc, {
        fontSize: '14px', fill: '#aabbcc', fontFamily: 'Georgia, serif',
        stroke: '#000000', strokeThickness: 2,
      }).setOrigin(0.5).setAlpha(0.8);
    }
  }

  drawDayNight(phase) {
    const { width, height } = this.scale;
    const alphaMap = {
      morning: 0.05,
      day: 0,
      evening: 0.15,
      night: 0.35,
    };
    const colorMap = {
      morning: 0xffaa44,
      day: 0x000000,
      evening: 0xff6633,
      night: 0x000033,
    };
    const alpha = alphaMap[phase] || 0;
    const color = colorMap[phase] || 0x000000;
    if (alpha > 0) {
      this.add.rectangle(width / 2, (height - 120) / 2, width, height - 120, color, alpha);
    }
  }

  createHotspots(location) {
    const state = this.registry.get('gameState');

    if (!location.hotspots) return;

    for (const hotspot of location.hotspots) {
      // Check if hotspot should be visible
      if (hotspot.requireFlag && !state.questFlags[hotspot.requireFlag]) continue;
      if (hotspot.hideFlag && state.questFlags[hotspot.hideFlag]) continue;

      const zone = this.add.zone(hotspot.x, hotspot.y, hotspot.width, hotspot.height)
        .setInteractive({ useHandCursor: true });

      // Visual indicator — localized label
      const hsLabel = I18n.t(`locations.${this.locationId}.hotspots.${hotspot.id}`) !== `locations.${this.locationId}.hotspots.${hotspot.id}`
        ? I18n.t(`locations.${this.locationId}.hotspots.${hotspot.id}`) : hotspot.label;
      const labelText = this.add.text(hotspot.x, hotspot.y - hotspot.height / 2 - 16, hsLabel, {
        fontSize: '16px', fill: '#aaddcc', fontFamily: 'Georgia, serif',
        stroke: '#000000', strokeThickness: 2,
        backgroundColor: '#00000088', padding: { x: 8, y: 5 },
      }).setOrigin(0.5).setAlpha(0);

      const indicator = this.add.graphics();
      // Character portrait marker
      if (hotspot.action === 'dialogue' && hotspot.character) {
        const char = CHARACTERS[hotspot.character];
        if (char) {
          const raceColors = {
            tidewatcher: 0x6688aa, korrim: 0x558844, velessi: 0xaaaa44, luminari: 0x8866bb,
            coralline: 0xcc6677, deepkin: 0x4466aa, shellborn: 0x887744,
          };
          const color = raceColors[char.race] || 0x888888;

          // Simple character sprite: circle with initial
          indicator.fillStyle(color, 0.8);
          indicator.fillCircle(hotspot.x, hotspot.y, 22);
          indicator.fillStyle(0xffffff, 0.9);
          indicator.fillCircle(hotspot.x, hotspot.y - 2, 9); // head

          this.add.text(hotspot.x, hotspot.y + 24, char.name, {
            fontSize: '14px', fill: '#dddddd', fontFamily: 'Georgia, serif',
            stroke: '#000000', strokeThickness: 2,
          }).setOrigin(0.5);
        }
      }

      // Travel indicator (door/path)
      if (hotspot.action === 'travel') {
        indicator.lineStyle(2, 0x88ccaa, 0.5);
        indicator.strokeRect(
          hotspot.x - hotspot.width / 2,
          hotspot.y - hotspot.height / 2,
          hotspot.width, hotspot.height
        );
      }

      // Examine indicator
      if (hotspot.action === 'examine') {
        indicator.fillStyle(0xffcc44, 0.6);
        indicator.fillCircle(hotspot.x, hotspot.y, 6);
      }

      // On touch devices, always show labels; on desktop, show on hover
      const isTouch = this.sys.game.device.input.touch;
      if (isTouch) {
        labelText.setAlpha(0.8);
      } else {
        zone.on('pointerover', () => {
          labelText.setAlpha(1);
          this.tweens.add({ targets: labelText, y: hotspot.y - hotspot.height / 2 - 16, duration: 150 });
        });
        zone.on('pointerout', () => {
          labelText.setAlpha(0);
          labelText.y = hotspot.y - hotspot.height / 2 - 12;
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
    const notif = this.add.text(width / 2, 100, text, {
      fontSize: '18px', fill: '#44ff88', fontFamily: 'Georgia, serif',
      stroke: '#003311', strokeThickness: 3,
      backgroundColor: '#003322aa', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: notif,
      alpha: 1, y: 90,
      duration: 400,
      yoyo: true,
      hold: 1500,
      onComplete: () => notif.destroy(),
    });
  }

  createUI(location, state) {
    const { width, height } = this.scale;
    const uiH = 140;
    const uiY = height - uiH;

    // UI background
    const uiBg = this.add.graphics();
    uiBg.fillStyle(0x112233, 0.95);
    uiBg.fillRect(0, uiY, width, uiH);
    uiBg.lineStyle(1, 0x334455, 1);
    uiBg.lineBetween(0, uiY, width, uiY);

    // Location name (localized)
    const uiLocName = I18n.t(`locations.${this.locationId}.name`) !== `locations.${this.locationId}.name`
      ? I18n.t(`locations.${this.locationId}.name`) : location.name;
    this.add.text(20, uiY + 8, uiLocName, {
      fontSize: '18px', fill: '#88ccdd', fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
    });

    // Verdium display
    this.add.text(20, uiY + 34, `◆ ${state.verdium}`, {
      fontSize: '16px', fill: '#44cc88', fontFamily: 'Georgia, serif',
    });

    // Navigation buttons for connected locations
    if (location.connections) {
      let navX = 20;
      const navY = uiY + 62;

      for (const connId of location.connections) {
        const connLoc = LOCATIONS[connId];
        if (!connLoc) continue;

        const connName = I18n.t(`locations.${connId}.name`) !== `locations.${connId}.name`
          ? I18n.t(`locations.${connId}.name`) : connLoc.name;
        const btn = this.add.text(navX, navY, `▸ ${connName}`, {
          fontSize: '16px', fill: '#88aacc', fontFamily: 'Georgia, serif',
          backgroundColor: '#1a2a3a', padding: { x: 8, y: 6 },
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#ffffff' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#88aacc' }));
        btn.on('pointerdown', () => {
          this.scene.start('Location', { locationId: connId });
        });

        navX += btn.width + 10;
      }
    }

    // Quest log hint (translated)
    const activeQuests = QuestManager.getActiveQuests(state);
    if (activeQuests.length > 0) {
      const questTitle = I18n.t(`quests.${activeQuests[0].id}`) !== `quests.${activeQuests[0].id}`
        ? I18n.t(`quests.${activeQuests[0].id}`) : activeQuests[0].title;
      this.add.text(20, uiY + uiH - 28, `📋 ${questTitle}`, {
        fontSize: '14px', fill: '#ccaa66', fontFamily: 'Georgia, serif',
      });
    }

    // Right side: Map (left) + Config (right), side by side, full height
    const bigBtnStyle = { fontSize: '48px', fill: '#88aacc', fontFamily: 'Georgia, serif' };
    const btnW = 90;
    const btnH = uiH - 10;
    const btnCenterY = uiY + uiH / 2;

    // Map button (left of the two)
    const mapBg = this.add.rectangle(width - btnW - btnW / 2 - 10, btnCenterY, btnW, btnH, 0x1a2a3a, 0.8)
      .setInteractive({ useHandCursor: true });
    const mapTxt = this.add.text(width - btnW - btnW / 2 - 10, btnCenterY, '🗺', bigBtnStyle).setOrigin(0.5);
    mapBg.on('pointerover', () => mapTxt.setStyle({ fill: '#ffffff' }));
    mapBg.on('pointerout', () => mapTxt.setStyle({ fill: '#88aacc' }));
    mapBg.on('pointerdown', () => this.scene.start('WorldMap'));

    // Config button (right of the two)
    const cfgBg = this.add.rectangle(width - btnW / 2 - 5, btnCenterY, btnW, btnH, 0x1a2a3a, 0.8)
      .setInteractive({ useHandCursor: true });
    const cfgTxt = this.add.text(width - btnW / 2 - 5, btnCenterY, '⚙', bigBtnStyle).setOrigin(0.5);
    cfgBg.on('pointerover', () => cfgTxt.setStyle({ fill: '#ffffff' }));
    cfgBg.on('pointerout', () => cfgTxt.setStyle({ fill: '#88aacc' }));
    cfgBg.on('pointerdown', () => this.openConfigMenu(state));
  }

  openConfigMenu(state) {
    const { width, height } = this.scale;

    const backdrop = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setInteractive();

    const panelW = 450, panelH = 380;
    const panelX = width / 2, panelY = height / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x0a1520, 0.95);
    panel.fillRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 12);
    panel.lineStyle(1, 0x334455, 1);
    panel.strokeRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 12);

    const elements = [backdrop, panel];

    const makeCfgBtn = (y, label, onClick) => {
      const bg = this.add.rectangle(panelX, y, panelW - 40, 60, 0x1a2a3a, 0.8)
        .setInteractive({ useHandCursor: true });
      const txt = this.add.text(panelX, y, label, {
        fontSize: '22px', fill: '#88aacc', fontFamily: 'Georgia, serif',
      }).setOrigin(0.5);
      bg.on('pointerover', () => txt.setStyle({ fill: '#ffffff' }));
      bg.on('pointerout', () => txt.setStyle({ fill: '#88aacc' }));
      bg.on('pointerdown', onClick);
      elements.push(bg, txt);
    };

    const closeMenu = () => elements.forEach(el => el.destroy());

    makeCfgBtn(panelY - 115, '💾  ' + I18n.t('ui.saveLabel'), () => {
      SaveManager.save(state);
      closeMenu();
      this.showNotification(I18n.t('ui.gameSaved'));
    });

    makeCfgBtn(panelY - 45, '🌐  ' + I18n.t('ui.languageLabel'), () => {
      SaveManager.save(state);
      closeMenu();
      this.scene.start('Language');
    });

    const fsLabel = document.fullscreenElement ? I18n.t('ui.exitFullscreenLabel') : I18n.t('ui.fullscreenLabel');
    makeCfgBtn(panelY + 25, '⛶  ' + fsLabel, () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      closeMenu();
    });

    makeCfgBtn(panelY + 95, '↻  ' + I18n.t('ui.restart'), () => {
      window.location.reload();
    });

    // Close button
    const closeBtn = this.add.text(panelX + panelW / 2 - 15, panelY - panelH / 2 + 8, '✕', {
      fontSize: '22px', fill: '#667788', fontFamily: 'Georgia, serif',
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', closeMenu);
    elements.push(closeBtn);

    backdrop.on('pointerdown', closeMenu);
  }
}
