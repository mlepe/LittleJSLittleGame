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
import * as LJS from "littlejsengine";
import Door from "./door";
import Utils from "./utils";

const gvec2 = Utils.gvec2;

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

const enum RoomTypes {
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
    this.gPosition = gvec2(position);
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;

    this.init();
  }

  init() {
    this.buildTileLayer();
    this.center = LJS.vec2(this.size.x / 2, this.size.y / 2);
  }

  buildTileLayer() {
    const pos = LJS.vec2();
    this.tileLayer = new LJS.TileCollisionLayer(
      pos,
      this.size,
      new LJS.TileInfo(LJS.vec2(0), LJS.vec2(this.tileSize))
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
    let position: LJS.Vector2;
    let direction: number = 0;

    switch (cardinalDirection) {
      case Utils.CardinalDirection.UP:
        position = LJS.vec2(Math.floor(this.size.x / 2), this.size.y);
        break;
      case Utils.CardinalDirection.DOWN:
        position = LJS.vec2(Math.floor(this.size.x / 2), 0);
        break;
      case Utils.CardinalDirection.LEFT:
        position = LJS.vec2(0, Math.floor(this.size.y / 2));
        break;
      case Utils.CardinalDirection.RIGHT:
        position = LJS.vec2(this.size.x - 1, Math.floor(this.size.y / 2));
        break;
    }

    this.tileLayer.setData(position, data);
    this.tileLayer.setCollisionData(position, 2);
    const door = new Door(position, this, destRoom, cardinalDirection);
    this.doors.push(door);
    this.doorsMap[cardinalDirection] = door;
  }
}
