/*
 * File: door.js
 * Project: testproj
 * File Created: Tuesday, 28th October 2025 10:23:39 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 28th October 2025 10:23:39 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Room from './room';
import Utils from './utils';
import Entity from './entity';
import Game from './game';

export default class Door extends Entity {
  toRoom: Room;
  fromRoom: Room;
  cardinalDirection: Utils.CardinalDirection;

  constructor(
    id: number,
    fromRoom: Room,
    toRoom: Room,
    position: LJS.Vector2,
    cardinalDirection: Utils.CardinalDirection,
    tileId: number,
    tileSize: number
  ) {
    super(
      id,
      position,
      LJS.vec2(1, 1), // Use proper size instead of Game.GameSize
      Game.GameScale,
      tileId,
      Game.TileSize,
      0,
      LJS.RED,
      false,
      true,
      false,
      true,
      Entity.EntityTypes.DOOR
    );
    this.fromRoom = fromRoom;
    this.toRoom = toRoom;
    this.cardinalDirection = cardinalDirection;
    this.tileId = tileId;
    this.tileSize = tileSize;

    // Make door solid for collision detection
    this.isSolid = true;

    //this.tile.setCollisionData(LJS.CollisionGroups.PLAYER, true);
  }
}
