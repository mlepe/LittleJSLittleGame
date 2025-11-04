/*
 * File: room.js
 * Project: testproj
 * File Created: Monday, 27th October 2025 2:36:08 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 27th October 2025 2:36:08 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Door from './door';
import Utils from './utils';
import Game from './game';

const gvec2 = Utils.gvec2;
const convertToGvec2 = Utils.convertToGvec2;

const DEFAULT_ROOM_LAYOUT: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

enum RoomTypes {
  EMPTY = 0,
  NORMAL = 1,
  START = 2,
  END = 3,
}

export default class Room {
  id: number;
  roomType: RoomTypes;
  roomLayout: number[][];
  tileLayer: LJS.TileCollisionLayer | null;
  tileSize: number;
  size: LJS.Vector2;
  center: LJS.Vector2 | null;
  doors: Door[];
  doorsMap: {
    up: Door | null;
    down: Door | null;
    left: Door | null;
    right: Door | null;
  };
  position: LJS.Vector2;
  gPosition: LJS.Vector2;
  up: Room | null;
  down: Room | null;
  left: Room | null;
  right: Room | null;
  doorId: number;

  static RoomTypes = RoomTypes;

  constructor(
    id: number,
    position: LJS.Vector2,
    roomType: RoomTypes = RoomTypes.EMPTY,
    roomLayout: number[][] = DEFAULT_ROOM_LAYOUT,
    tileSize: number = 8,
    size = LJS.vec2(11, 9)
  ) {
    this.id = id;
    this.roomType = roomType;
    this.roomLayout = roomLayout;
    this.tileLayer = null;
    this.tileSize = tileSize;
    this.size = size;
    this.center = null;
    this.doors = [];
    this.doorsMap = { up: null, down: null, left: null, right: null };
    this.position = position;
    this.gPosition = convertToGvec2(Game.GameSize, position);
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
    this.doorId = 0;

    this.init();
  }

  init() {
    this.buildTileLayer();
    this.center = LJS.vec2(
      Math.floor(this.size.x / 2),
      Math.floor(this.size.y / 2)
    );
  }

  buildTileLayer() {
    const pos = LJS.vec2();
    this.tileLayer = new LJS.TileCollisionLayer(
      pos,
      this.size,
      LJS.tile(this.tileSize, this.tileSize)
    );
    for (let y = 0; y < this.roomLayout.length; y++) {
      for (let x = 0; x < this.roomLayout[y].length; x++) {
        const dataTileId = this.roomLayout[y][x];
        const pos = LJS.vec2(x, y);
        const isSolid = dataTileId;
        let tileId: number;
        switch (dataTileId) {
          case 0:
            // Floor tile
            tileId = 5;
            break;
          case 1:
            // Wall tile
            tileId = 637;
            break;
          default:
            // Default
            tileId = 0;
            break;
        }
        const data = new LJS.TileLayerData(tileId);
        this.tileLayer.setData(pos, data);
        this.tileLayer.setCollisionData(pos, isSolid);
      }
    }
  }

  createDoor(destRoom: Room, cardinalDirection: Utils.CardinalDirection) {
    const data = new LJS.TileLayerData(444, 0);
    let localPosition: LJS.Vector2 = LJS.vec2(0, 0);
    let direction: number = 0;

    // Calculate door position in room coordinates
    switch (cardinalDirection) {
      case Utils.CardinalDirection.UP:
        localPosition = LJS.vec2(Math.floor(this.size.x / 2), this.size.y - 1);
        break;
      case Utils.CardinalDirection.DOWN:
        localPosition = LJS.vec2(Math.floor(this.size.x / 2), 0);
        break;
      case Utils.CardinalDirection.LEFT:
        localPosition = LJS.vec2(0, Math.floor(this.size.y / 2));
        break;
      case Utils.CardinalDirection.RIGHT:
        localPosition = LJS.vec2(this.size.x - 1, Math.floor(this.size.y / 2));
        break;
    }

    // Use room-local coordinates since rooms are rendered at origin
    const worldPosition = localPosition;

    // Place door tile in the tile layer
    this.tileLayer.setData(localPosition, data);
    this.tileLayer.setCollisionData(localPosition, 0); // Make doors passable for tile collision
    const door = new Door(
      this.doorId++,
      this,
      destRoom,
      worldPosition,
      cardinalDirection,
      444,
      this.tileSize
    );
    this.doors.push(door);
    this.doorsMap[cardinalDirection] = door;

    // Add door to global entities array for collision detection
    Game.Entities.push(door);

    console.log(
      `Created door in room ${this.id} at position ${worldPosition.x}, ${worldPosition.y} facing ${cardinalDirection} to room ${destRoom.id}`
    );
  }
  render() {
    this.doors.forEach((door) => {
      door.render();
      // Debug: draw a red circle at door position
      LJS.drawRect(door.position, LJS.vec2(0.2, 0.2), LJS.RED, 0, true);
    });
  }
}
