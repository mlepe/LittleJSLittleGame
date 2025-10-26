/*
 * File: game.js
 * Project: testproj
 * File Created: Sunday, 26th October 2025 5:25:53 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 26th October 2025 5:25:53 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */

import * as LJS from "littlejsengine";
import Tile from "./tile";

export default class Game {
  constructor(
    width,
    height,
    tileSize,
    scale,
    tiles,
    tilesColumns = 0,
    tilesRow = 0
  ) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.scale = scale;
    this.tiles = tiles;
    this.tilesColumns = tilesColumns;
    this.tilesRow = tilesRow;
    this.player = null;
  }

  init() {
    this.gameSize = LJS.vec2(this.width, this.height);
    LJS.setCanvasFixedSize(this.gameSize);
    LJS.setCanvasMaxSize(this.gameSize);
    this.size = LJS.vec2(
      this.width / this.tileSize,
      this.height / this.tileSize
    );
    // center of the screen
    this.center = LJS.vec2(this.size.x / 2, this.size.y / 2);
    // position camera in middle of screen
    LJS.setCameraPos(this.center);
    // scale 1:1 with our tilesize (16x16)
    LJS.cameraScale = this.tileSize;

    this.player = new Tile(42, this.tileSize, this.scale, this.center);
  }

  update() {
    this.handleInput();
  }

  render() {
    LJS.drawRect(this.center, this.size, new LJS.Color().setHex("#001effff"));
    this.player.render();
  }

  handleInput() {
    this.player.move(LJS.keyDirection());
  }
}
