/*
 * File: tile.js
 * Project: testproj
 * File Created: Sunday, 26th October 2025 5:16:10 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 26th October 2025 5:16:10 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from "littlejsengine";
export default class Tile {
  constructor(
    tileId,
    tileSize,
    scale = LJS.vec2(2),
    position = LJS.vec2(0, 0)
  ) {
    this.tileId = tileId;
    this.position = position;
    this.tileSize = tileSize;
    this.scale = scale;
  }

  move(vec) {
    this.position = this.position.add(vec);
  }

  render(size = this.scale) {
    LJS.drawTile(
      this.position, // position (vector)
      size, // size
      LJS.tile(this.tileId, this.tileSize)
    );
  }
}
