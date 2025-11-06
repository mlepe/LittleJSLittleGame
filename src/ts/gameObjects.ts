/*
 * File: gameObject.ts
 * Project: testproj
 * File Created: Wednesday, 5th November 2025 12:13:10 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Wednesday, 5th November 2025 12:13:10 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Room from './room';
import Global from './global';

export class GameObject extends LJS.EngineObject {
  position: LJS.Vector2;
  size: LJS.Vector2 = LJS.vec2(1, 1);
  color: LJS.Color = LJS.WHITE;
  health: number;
  isGameObject: number;
  tileType: Global.TileType = Global.TileType.NON_SOLID;

  constructor(
    position: LJS.Vector2,
    size: LJS.Vector2 = LJS.vec2(1, 1),
    tileInfo: LJS.TileInfo = LJS.tile(position, Global.TileSize, 0)
  ) {
    super(position, size, tileInfo);
    this.health = 0;
    this.isGameObject = 1;
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  update() {
    // Update logic for the game object
  }

  render() {
    LJS.drawTile(this.position, this.size, this.tileInfo, this.color);
    //super.render();
  }

  kill() {
    this.destroy();
  }
}

export class Door extends GameObject {
  position: LJS.Vector2;
  toRoom: Room;
  fromRoom: Room;

  constructor(position: LJS.Vector2, fromRoom: Room, toRoom: Room) {
    super(
      position,
      LJS.vec2(1, 1),
      LJS.tile(position, Global.TileSize, Global.TileIndex.DOOR)
    );
    this.fromRoom = fromRoom;
    this.toRoom = toRoom;

    this.setCollision();
  }

  render() {
    super.render();
  }
}
