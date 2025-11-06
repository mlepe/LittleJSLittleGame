/*
 * File: entity.ts
 * Project: testproj
 * File Created: Thursday, 6th November 2025 3:44:35 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Thursday, 6th November 2025 3:44:36 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Utils from './utils';
import Game from './game';

const gvec2 = Utils.gvec2;
const convertToGvec2 = Utils.convertToGvec2;

export enum EntityTypes {
  PLAYER = 'player',
  ENEMY = 'enemy',
  NPC = 'npc',
  DOOR = 'door',
}

export interface EntityCollisionObject {
  position: LJS.Vector2;
  self: Entity;
  other: Entity;
}

export default class Entity extends LJS.EngineObject {
  id: number;
  position: LJS.Vector2;
  gPosition: LJS.Vector2;
  size: LJS.Vector2;
  scale: LJS.Vector2;
  isSolid: boolean;
  isVisible: boolean;
  canMove: boolean;
  isAlive: boolean;
  entityType: EntityTypes;
  tileId: number | null;
  tileSize: number | null;

  constructor(
    id: number,
    position: LJS.Vector2,
    size: LJS.Vector2 = LJS.vec2(1, 1),
    scale: LJS.Vector2 = LJS.vec2(1, 1),
    tileId: number = 0,
    tileSize: number = 16,
    angle: number = 0,
    color: LJS.Color = LJS.WHITE,
    isPlayer: boolean = false,
    isVisible: boolean = true,
    canMove: boolean = false,
    isAlive: boolean = true,
    entityType: EntityTypes = EntityTypes.NPC
  ) {
    const tileInfo: LJS.TileInfo = LJS.tile(tileId, tileSize);
    super(position, size, tileInfo, angle, color);
    this.id = id;
    this.position = position;
    this.gPosition = convertToGvec2(Game.GameSize, position);
    this.size = size;
    this.scale = scale;

    this.isVisible = true;
    this.canMove = false;
    this.isAlive = true;
    this.entityType = EntityTypes.NPC;
    this.tileId = 44;
    this.tileSize = tileSize;
    //this.tile = new Tile(this.tileId, this.tileSize, this.scale, this.position);
    this.clampSpeed = true;
    this.additiveColor = LJS.rgb(0, 0, 0, 0);
    this.collideRaycast = true;
    this.collideSolidObjects = true;
    this.collideTiles = true;
  }

  move(direction: LJS.Vector2) {
    this.setPosition(this.position.add(direction));
    this.gPosition = this.position.add(gvec2(direction));
  }

  setPosition(position: LJS.Vector2) {
    this.position = position;
    this.gPosition = convertToGvec2(Game.GameSize, position);
    //this.tile.position = position;
    //this.tile.gPosition = this.gPosition;
  }

  static get EntityTypes() {
    return EntityTypes;
  }

  static get EntityCollisionObject() {
    return Entity.EntityCollisionObject;
  }

  render() {
    //if (this.tile && this.isVisible) this.tile.render(this.scale);
    LJS.drawTile(
      this.position,
      this.size,
      LJS.tile(this.position, this.tileSize, 44),
      this.color
    );
  }

  /*checkCollisionWithEntityAtPosition(
    position: LJS.Vector2
  ): EntityCollisionObject | null {
    let returnValue: EntityCollisionObject | null = null;
    for (const entity of Game.Entities) {
      if (entity !== this && entity.isSolid) {
        // Use distance check for Vector2 comparison (tile-based movement)
        const collision = entity.position.distance(position) < 1;
        if (collision) {
          returnValue = {
            position: position,
            self: this,
            other: entity,
          };
          break;
        }
      }
    }
    return returnValue;
  }*/
}
