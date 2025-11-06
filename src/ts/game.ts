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
import Level from './level';
import Utils from './utils';
import Room from './room';
//import { GameCharacter, Player } from './gameCharacter';
import Global from './global';
import Entity from './entity';

const gvec2 = Utils.gvec2;

const GAME_SIZE = LJS.vec2(800, 600);
const GAME_SCALE = LJS.vec2(1);
const TILE_SIZE = 16;

export default class Game {
  width: number;
  height: number;
  tileSize: LJS.Vector2;
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
  //characters: GameCharacter[];

  constructor(
    width: number,
    height: number,
    tileSize: LJS.Vector2,
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

    this.hud = '';
    this.debugHud = '';

    this.debugMode = true;
  }

  static GameSize = GAME_SIZE;
  static GameScale = GAME_SCALE;
  static TileSize = TILE_SIZE;

  init() {
    this.timer = new LJS.Timer(0.06);
    this.gameSize = LJS.vec2(this.width, this.height);
    LJS.setCanvasFixedSize(this.gameSize);
    LJS.setCanvasMaxSize(this.gameSize);
    this.size = LJS.vec2(
      this.width / this.tileSize.x,
      this.height / this.tileSize.x
    );
    // center of the screen
    this.center = LJS.vec2(
      Math.floor(this.size.x / 2),
      Math.floor(this.size.y / 2)
    );
    // position camera in middle of screen
    //LJS.setCameraPos(this.center);
    // scale 1:1 with our tilesize (16x16)
    //LJS.setCameraScale(this.tileSize.x * 2);

    // Ranges
    // 24 - 31 : NPCS (+49 to go down a row)

    let playerTileId: number = 24;

    this.player = new Entity(
      0,
      this.center,
      LJS.vec2(1, 1),
      LJS.vec2(1, 1),
      playerTileId,
      16
    );

    //this.createLevels();
    //this.currentLevel.currentRoom.tileLayer.redraw();
    /*this.player.position = this.currentLevel.switchRoom(
      this.currentLevel.startRoom
    );*/
    LJS.setCameraPos(this.player.position);
  }

  update() {
    if (this.timer.elapsed()) {
      //this.handleInput();
      //this.updateDebugHUD();
      this.timer.set(0.06);
    }
  }

  render() {
    LJS.drawRect(this.center, this.size, new LJS.Color().setHex('#001effff'));
    LJS.drawTile(
      LJS.vec2(10, 10),
      LJS.vec2(1, 1),
      LJS.tile(LJS.vec2(10, 10), LJS.vec2(16, 16), 3, 0),
      LJS.WHITE
    );
    this.player.render();
    /*Game.Entities.forEach((entity) => {
      entity.render();
    });*/
    // Render doors in current room
    /*if (this.currentLevel && this.currentLevel.currentRoom) {
      this.currentLevel.currentRoom.render();
    }*/
    //this.currentLevel.currentRoom.render();
    //this.player.render();
  }

  renderPost() {
    // Draw HUD or effects above all objects
    //if (this.debugMode) this.drawDebugHUD();
    //this.currentLevel.renderMinimap();
  }
  /*handleInput() {
    let direction = LJS.keyDirection();
    this.playerDirection = direction;
    let gDirection = LJS.vec2(direction.x, -direction.y);
    //console.log("Direction: ", direction);

    //console.log("direction: ", direction);

    let collidesWithTile = LJS.tileCollisionGetData(
      this.player.position.add(direction)
    );

    switch (this.playerDirection) {
      case LJS.vec2(0, 1):
        this.player.collideWithObject(
          this.currentLevel.currentRoom.doorsMap.up
        ) &&
          this.currentLevel.switchRoom(
            this.currentLevel.currentRoom.doorsMap.up.toRoom
          );
        break;
      case LJS.vec2(0, -1):
        this.player.collideWithObject(
          this.currentLevel.currentRoom.doorsMap.down
        ) &&
          this.currentLevel.switchRoom(
            this.currentLevel.currentRoom.doorsMap.down.toRoom
          );
        break;
      case LJS.vec2(-1, 0):
        this.player.collideWithObject(
          this.currentLevel.currentRoom.doorsMap.left
        ) &&
          this.currentLevel.switchRoom(
            this.currentLevel.currentRoom.doorsMap.left.toRoom
          );
        break;
      case LJS.vec2(1, 0):
        this.player.collideWithObject(
          this.currentLevel.currentRoom.doorsMap.right
        ) &&
          this.currentLevel.switchRoom(
            this.currentLevel.currentRoom.doorsMap.right.toRoom
          );
        break;
    }

    let collides = collidesWithTile;
    //LJS.setCameraPos(this.player.position);
    if (!collides) this.player.move(direction);
  }*/

  createLevels() {
    for (let i = 0; i < this.levelsCount; i++) {
      const level = new Level(i);
      this.levels.push(level);
    }

    this.currentLevel = this.levels[0];
  }
}
