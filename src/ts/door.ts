/*
 * File: door.ts
 * Project: testproj
 * File Created: Tuesday, 4th November 2025 11:52:15 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 4th November 2025 11:52:15 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Global from './global';
import Room from './room';
import { GameObject } from './gameObjects';

export default class Door extends GameObject {
  position: LJS.Vector2;
  toRoom: Room;
  fromRoom: Room;
  tile: LJS.TileInfo;

  constructor(position: LJS.Vector2, fromRoom: Room, toRoom: Room) {
    super(
      position,
      LJS.vec2(1, 1),
      LJS.tile(position, Global.TileSize, Global.TileIndex.DOOR)
    );
    this.fromRoom = fromRoom;
    this.toRoom = toRoom;
  }

  /*render() {
    LJS.drawTile(this.position, LJS.vec2(1, 1), this.tile, LJS.WHITE);
  }*/
}
