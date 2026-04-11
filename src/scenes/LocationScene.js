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

    // Pre-rendered background image
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
      const labelText = this.add.text(hotspot.x, hotspot.y - hotspot.height / 2 - 12, hsLabel, {
        fontSize: '13px', fill: '#aaddcc', fontFamily: 'Georgia, serif',
        stroke: '#000000', strokeThickness: 2,
        backgroundColor: '#00000066', padding: { x: 6, y: 3 },
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
          indicator.fillCircle(hotspot.x, hotspot.y, 20);
          indicator.fillStyle(0xffffff, 0.9);
          indicator.fillCircle(hotspot.x, hotspot.y - 2, 8); // head

          this.add.text(hotspot.x, hotspot.y + 20, char.name, {
            fontSize: '11px', fill: '#dddddd', fontFamily: 'Georgia, serif',
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

      zone.on('pointerover', () => {
        labelText.setAlpha(1);
        this.tweens.add({ targets: labelText, y: hotspot.y - hotspot.height / 2 - 16, duration: 150 });
      });
      zone.on('pointerout', () => {
        labelText.setAlpha(0);
        labelText.y = hotspot.y - hotspot.height / 2 - 12;
      });
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
    const uiY = height - 120;

    // UI background
    const uiBg = this.add.graphics();
    uiBg.fillStyle(0x112233, 0.95);
    uiBg.fillRect(0, uiY, width, 120);
    uiBg.lineStyle(1, 0x334455, 1);
    uiBg.lineBetween(0, uiY, width, uiY);

    // Location name and island (localized)
    const uiLocName = I18n.t(`locations.${this.locationId}.name`) !== `locations.${this.locationId}.name`
      ? I18n.t(`locations.${this.locationId}.name`) : location.name;
    this.add.text(20, uiY + 10, uiLocName, {
      fontSize: '16px', fill: '#88ccdd', fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
    });
    this.add.text(20, uiY + 32, `${location.island || ''} — ${state.dayPhase}`, {
      fontSize: '12px', fill: '#667788', fontFamily: 'Georgia, serif',
    });

    // Navigation buttons for connected locations
    if (location.connections) {
      const navY = uiY + 60;
      let navX = 20;
      this.add.text(navX, navY - 18, I18n.t('ui.goTo'), {
        fontSize: '11px', fill: '#556677', fontFamily: 'Georgia, serif',
      });

      for (const connId of location.connections) {
        const connLoc = LOCATIONS[connId];
        if (!connLoc) continue;

        const connName = I18n.t(`locations.${connId}.name`) !== `locations.${connId}.name`
          ? I18n.t(`locations.${connId}.name`) : connLoc.name;
        const btn = this.add.text(navX, navY, `▸ ${connName}`, {
          fontSize: '13px', fill: '#88aacc', fontFamily: 'Georgia, serif',
        }).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#ffffff' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#88aacc' }));
        btn.on('pointerdown', () => {
          this.scene.start('Location', { locationId: connId });
        });

        navX += btn.width + 20;
      }
    }

    // Right side buttons
    const btnStyle = { fontSize: '14px', fill: '#88aacc', fontFamily: 'Georgia, serif' };

    // World Map button
    const mapBtn = this.add.text(width - 20, uiY + 10, I18n.t('ui.map'), btnStyle)
      .setOrigin(1, 0).setInteractive({ useHandCursor: true });
    mapBtn.on('pointerover', () => mapBtn.setStyle({ fill: '#ffffff' }));
    mapBtn.on('pointerout', () => mapBtn.setStyle({ fill: '#88aacc' }));
    mapBtn.on('pointerdown', () => this.scene.start('WorldMap'));

    // Save button
    const saveBtn = this.add.text(width - 20, uiY + 30, I18n.t('ui.save'), btnStyle)
      .setOrigin(1, 0).setInteractive({ useHandCursor: true });
    saveBtn.on('pointerover', () => saveBtn.setStyle({ fill: '#ffffff' }));
    saveBtn.on('pointerout', () => saveBtn.setStyle({ fill: '#88aacc' }));
    saveBtn.on('pointerdown', () => {
      SaveManager.save(state);
      this.showNotification(I18n.t('ui.gameSaved'));
    });

    // Language button
    const langCode = I18n.currentLanguage.toUpperCase();
    const langBtn = this.add.text(width - 20, uiY + 50, `🌐 ${langCode}`, btnStyle)
      .setOrigin(1, 0).setInteractive({ useHandCursor: true });
    langBtn.on('pointerover', () => langBtn.setStyle({ fill: '#ffffff' }));
    langBtn.on('pointerout', () => langBtn.setStyle({ fill: '#88aacc' }));
    langBtn.on('pointerdown', () => {
      SaveManager.save(state);
      this.scene.start('Language');
    });

    // Verdium display
    this.add.text(width - 20, uiY + 75, `◆ ${I18n.t('ui.verdium')}: ${state.verdium}`, {
      fontSize: '14px', fill: '#44cc88', fontFamily: 'Georgia, serif',
    }).setOrigin(1, 0);

    // Quest log hint
    const activeQuests = QuestManager.getActiveQuests(state);
    if (activeQuests.length > 0) {
      this.add.text(width / 2, uiY + 95, `📋 ${activeQuests[0].title}`, {
        fontSize: '12px', fill: '#ccaa66', fontFamily: 'Georgia, serif',
      }).setOrigin(0.5);
    }
  }
}
