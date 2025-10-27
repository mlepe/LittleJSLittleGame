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

const DEFAULT_ROOM_LAYOUT = [
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

const ROOM_TYPES = ["EMPTY", "BASIC", "START", "END"];

export default class Room {
  constructor(
    roomType = ROOM_TYPES[0],
    roomLayout = DEFAULT_ROOM_LAYOUT,
    tileSize = 8,
    size = LJS.vec2(11, 9)
  ) {
    this.roomType = roomType;
    this.roomLayout = roomLayout;
    this.tileLayer = null;
    this.tileSize = tileSize;
    this.size = size;
    this.center = null;

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
        let tileId;
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
}
