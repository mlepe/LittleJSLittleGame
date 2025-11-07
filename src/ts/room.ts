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
import { Door } from './gameObjects';
import Level from './level';

const defaultTileData: number[][] = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];

export default class Room {
  id: LJS.Vector2;
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
  doorsDirections: {
    up: Door | null;
    down: Door | null;
    left: Door | null;
    right: Door | null;
  } = {
    up: null,
    down: null,
    left: null,
    right: null,
  };
  position: LJS.Vector2;
  level: Level;
  center: LJS.Vector2;
  size: LJS.Vector2;

  constructor(
    id: LJS.Vector2,
    roomType: Global.RoomTypes,
    position: LJS.Vector2,
    level: Level
  ) {
    this.id = id;
    this.roomType = roomType;
    this.position = position;
    this.level = level;
    this.center = LJS.vec2(
      Math.floor(this.tilesData[0].length / 2),
      Math.floor(this.tilesData.length / 2)
    );
    this.size = LJS.vec2(this.tilesData[0].length, this.tilesData.length);
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

  createDoor(
    position: LJS.Vector2,
    toRoom: Room,
    direction: 'up' | 'down' | 'left' | 'right'
  ) {
    // Convert door position to tile coordinates for tile layer manipulation
    const tilePos = LJS.vec2(Math.floor(position.x), Math.floor(position.y));

    // Door object position should be at center of tile for proper collision detection
    // Ensure it's snapped to half-grid
    const doorObjPos = Global.snapPositionToHalfGrid(
      LJS.vec2(position.x + 0.5, position.y + 0.5)
    );

    // Replace wall tile with empty tile and remove collision
    this.wallLayer.setData(tilePos, new LJS.TileLayerData());
    this.wallLayer.setCollisionData(tilePos, 0);

    // Create door object at the center-based position
    const door = new Door(doorObjPos, this, toRoom);
    this.doors.push(door);
    this.doorsDirections[direction] = door;

    console.log(
      `Door created at position ${doorObjPos.x}, ${doorObjPos.y} (tile: ${tilePos.x}, ${tilePos.y}) going ${direction}`
    );
  }
}
