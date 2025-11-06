/*
 * File: room.ts
 * Project: testproj
 * File Created: Tuesday, 4th November 2025 11:05:05 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 4th November 2025 11:05:05 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Global from './global';
import Door from './door';

const defaultTileData: number[][] = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];

export default class Room {
  id: number;
  name: string = '';
  roomType: Global.RoomTypes = Global.RoomTypes.REGULAR;
  tilesData: number[][] = defaultTileData;
  up: Room | null = null;
  down: Room | null = null;
  left: Room | null = null;
  right: Room | null = null;
  tileLayers: LJS.TileCollisionLayer[] = [];
  floorLayer: LJS.TileCollisionLayer;
  wallLayer: LJS.TileCollisionLayer;
  doors: Door[] = [];
  position: LJS.Vector2;

  constructor(id: number, roomType: Global.RoomTypes, position: LJS.Vector2) {
    this.id = id;
    this.roomType = roomType;
    this.position = position;
    this.createLayers();
  }

  createLayers() {
    this.tileLayers[0] = new LJS.TileCollisionLayer(
      LJS.vec2(0, 0),
      LJS.vec2(5, 5),
      LJS.tile(LJS.vec2(0, 0), LJS.vec2(16, 16), 0),
      0
    );
    this.tileLayers[1] = new LJS.TileCollisionLayer(
      LJS.vec2(0, 0),
      LJS.vec2(5, 5),
      LJS.tile(LJS.vec2(0, 0), LJS.vec2(16, 16), 0),
      1
    );

    this.floorLayer = this.tileLayers[0];
    this.wallLayer = this.tileLayers[1];

    this.floorLayer.isSolid = false;
    this.wallLayer.isSolid = true;

    for (let y = 0; y < this.tilesData.length; y++) {
      for (let x = 0; x < this.tilesData[y].length; x++) {
        const tileId = this.tilesData[y][x];
        const position = LJS.vec2(x, y);
        if (tileId > 0) {
          const tileIndex = Global.TileIndex.WALL;
          const direction = 0;
          const mirror = false;
          const color = LJS.WHITE;
          const data = new LJS.TileLayerData(
            tileIndex,
            direction,
            mirror,
            color
          );
          this.wallLayer.setData(position, data);
          this.wallLayer.setCollisionData(position, Global.TileType.SOLID); // solid
        } else {
          const tileIndex = Global.TileIndex.FLOOR;
          const direction = 0;
          const mirror = false;
          const color = LJS.WHITE;
          const data = new LJS.TileLayerData(
            tileIndex,
            direction,
            mirror,
            color
          );
          this.floorLayer.setData(LJS.vec2(x, y), data); // floor tile
        }
      }
    }
  }

  createDoor(position: LJS.Vector2, toRoom: Room) {
    /*const doorIndex = Global.TileIndex.DOOR;
    const direction = 0;
    const mirror = false;
    const color = LJS.WHITE;
    const data = new LJS.TileLayerData(doorIndex, direction, mirror, color);

    // replace with empty tile and empty collision
    this.wallLayer.setData(position, new LJS.TileLayerData());
    this.wallLayer.setCollisionData(position, 0);
    const door = new Door(position, this, toRoom);
    this.doors.push(door);*/
  }
}
