/*
 * File: game.js
 * Project: testproj
 * File Created: Sunday, 26th October 2025 5:25:53 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 26th October 2025 5:25:53 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */

import * as LJS from 'littlejsengine';
import Tile from './tile';
import Level from './level';
import Utils from './utils';
import Room from './room';
import Entity, { EntityCollisionObject, EntityTypes } from './entity';

const gvec2 = Utils.gvec2;

const GAME_SIZE = LJS.vec2(800, 600);
const GAME_SCALE = LJS.vec2(1);
const TILE_SIZE = 16;
export default class Game {
  width: number;
  height: number;
  tileSize: number;
  scale: LJS.Vector2;
  tiles: any;
  tilesColumns: number;
  tilesRow: number;
  levelsCount: number;
  player: Entity;
  currentLevel: Level;
  levels: (Level | null)[];
  hud: string;
  debugHud: string;
  debugMode: boolean;
  timer: LJS.Timer;
  gameSize: LJS.Vector2;
  size: LJS.Vector2;
  center: LJS.Vector2;
  playerDirection: LJS.Vector2;
  entities: Entity[];

  constructor(
    width: number,
    height: number,
    tileSize: number,
    scale: LJS.Vector2,
    tiles: any[],
    tilesColumns: number,
    tilesRow: number,
    levelsCount = 6
  ) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.scale = scale;
    this.tiles = tiles;
    this.tilesColumns = tilesColumns;
    this.tilesRow = tilesRow;
    this.currentLevel = null;
    this.levelsCount = levelsCount;
    this.levels = [];
    this.playerDirection = LJS.vec2(0, 0);

    this.hud = '';
    this.debugHud = '';

    this.debugMode = true;
  }

  static GameSize = GAME_SIZE;
  static GameScale = GAME_SCALE;
  static TileSize = TILE_SIZE;
  static Entities: Entity[] = [];

  static getEntities(): Entity[] {
    return this.Entities;
  }

  init() {
    this.timer = new LJS.Timer(0.06);
    this.gameSize = LJS.vec2(this.width, this.height);
    LJS.setCanvasFixedSize(this.gameSize);
    LJS.setCanvasMaxSize(this.gameSize);
    this.size = LJS.vec2(
      this.width / this.tileSize,
      this.height / this.tileSize
    );
    // center of the screen
    this.center = LJS.vec2(
      Math.floor(this.size.x / 2),
      Math.floor(this.size.y / 2)
    );
    // position camera in middle of screen
    LJS.setCameraPos(this.center);
    // scale 1:1 with our tilesize (16x16)
    LJS.setCameraScale(this.tileSize * 2);

    // Ranges
    // 24 - 31 : NPCS (+49 to go down a row)

    let playerTileId: number = 24;

    this.player = new Entity(
      0,
      LJS.vec2(0, 0),
      LJS.vec2(1, 1),
      this.scale,
      playerTileId,
      this.tileSize,
      0,
      LJS.WHITE,
      true,
      true,
      true,
      true,
      EntityTypes.PLAYER
    );

    Game.Entities[0] = this.player;

    this.createLevels();
    //this.currentLevel.currentRoom.tileLayer.redraw();
    this.player.setPosition(
      this.currentLevel.switchRoom(this.currentLevel.startRoom)
    );
    LJS.setCameraPos(this.player.position);

    this.debugHud = `Player position: ${this.player.position.x}, ${this.player.position.y}\n
    Player gPosition: ${this.player.gPosition.x}, ${this.player.gPosition.y}\n
    Current level id: ${this.currentLevel.id}\n
    Current room id, position: ${this.currentLevel.currentRoom.id}, ${this.currentLevel.currentRoom.position.x}, ${this.currentLevel.currentRoom.position.y}`;
  }

  update() {
    if (this.timer.elapsed()) {
      this.handleInput();
      this.updateDebugHUD();
      this.timer.set(0.06);
    }
  }

  render() {
    //LJS.drawRect(this.center, this.size, new LJS.Color().setHex("#001effff"));
    this.player.render();
    // Render doors in current room
    if (this.currentLevel && this.currentLevel.currentRoom) {
      this.currentLevel.currentRoom.render();
    }
  }

  renderPost() {
    // Draw HUD or effects above all objects
    if (this.debugMode) this.drawDebugHUD();
    this.currentLevel.renderMinimap();
  }

  drawDebugHUD() {
    const text = this.debugHud;
    const lineColoropt = LJS.WHITE;
    const textAlignopt = 'left';
    const sizeopt = 15;
    const coloropt = LJS.WHITE;
    const lineWidthopt = null;
    const fontopt = 'Arial';
    const fontStyleopt = 'normal';
    const maxWidthopt = 1000;
    const angleopt = 0;
    const contextopt = null;

    //LJS.drawTextOverlay(this.debugHud, LJS.vec2(0), 1, coloropt);

    LJS.drawTextScreen(
      text,
      LJS.vec2(100, 100),
      sizeopt,
      coloropt,
      lineWidthopt,
      lineColoropt,
      textAlignopt,
      fontopt,
      fontStyleopt,
      maxWidthopt,
      angleopt
    );
  }

  updateDebugHUD() {
    const currentRoom = this.currentLevel.currentRoom;
    const doorCount = currentRoom ? currentRoom.doors.length : 0;
    const entitiesCount = Game.Entities.length;

    this.debugHud = `Player position: ${this.player.position.x.toFixed(1)}, ${this.player.position.y.toFixed(1)}\n
    Player direction: ${this.playerDirection.x}, ${this.playerDirection.y}\n
    Current level: ${this.currentLevel.id}\n
    Current room position: ${currentRoom?.position.x}, ${currentRoom?.position.y}\n
    Doors in room: ${doorCount}\n
    Total entities: ${entitiesCount}`;
  }

  handleInput() {
    const up = LJS.vec2(0, 1);
    const down = LJS.vec2(0, -1);
    const left = LJS.vec2(-1, 0);
    const right = LJS.vec2(1, 0);
    //console.log("Time delta: ", LJS.timeDelta);
    let direction = LJS.keyDirection();
    this.playerDirection = direction;
    let gDirection = LJS.vec2(direction.x, -direction.y);
    //console.log("Direction: ", direction);

    //console.log("direction: ", direction);
    let collidesWithEntity: EntityCollisionObject | null =
      this.player.checkCollisionWithEntityAtPosition(
        this.player.position.add(direction)
      );

    switch (collidesWithEntity?.other?.entityType) {
      case null:
        // no collision
        break;
      case Entity.EntityTypes.ENEMY:
        // handle collision with enemy
        break;
      case Entity.EntityTypes.DOOR:
        // handle collision with door
        this.player.setPosition(
          this.currentLevel.switchRoom(
            this.currentLevel.roomsMap[
              this.currentLevel.currentRoom.position.y + gDirection.y
            ][this.currentLevel.currentRoom.position.x + gDirection.x]
          )
        );
        break;
      default:
        // handle collision with entity
        console.log(
          'Collided with entity of type: ',
          collidesWithEntity?.other?.entityType
        );
        break;
    }

    let collidesWithTile = LJS.tileCollisionGetData(
      this.player.position.add(direction)
    );

    let collides = collidesWithTile || collidesWithEntity;
    //LJS.setCameraPos(this.player.position);
    if (!collides) this.player.move(direction);
  }

  createLevels() {
    for (let i = 0; i < this.levelsCount; i++) {
      const level = new Level(i);
      this.levels.push(level);
    }

    this.currentLevel = this.levels[0];
  }
}
