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
import Level from "./level";

export default class Game {
  constructor(
    width,
    height,
    tileSize,
    scale,
    tiles,
    tilesColumns,
    tilesRow,
    levelsCount = 6
  ) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.scale = scale;
    this.tiles = tiles;
    this.tilesColumns = tilesColumns;
    this.tilesRow = tilesRow;
    this.player = null;
    this.currentLevel = null;
    this.levelsCount = levelsCount;
    this.levels = [];
  }

  init() {
    this.timer = new LJS.Timer(0.06);
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
    LJS.cameraScale = this.tileSize * 1;

    // Ranges
    // 24 - 31 : NPCS (+49 to go down a row)

    this.player = new Tile(24, this.tileSize, this.scale, this.center);

    /*// create tile layer
    const pos = LJS.vec2();
    this.tileLayers = [
      new LJS.TileCollisionLayer(
        pos,
        this.size,
        new LJS.TileInfo(LJS.vec2(0), LJS.vec2(this.tileSize), 0)
      ),
      new LJS.TileCollisionLayer(
        pos,
        this.size,
        new LJS.TileInfo(LJS.vec2(0), LJS.vec2(this.tileSize), 0)
      ),
    ];
    for (let i = 0; i < this.tileLayers.length; i++) {
      // set tile data
      let tileIndex = 52;
      let direction = LJS.randInt(4);
      let mirror = LJS.randBool();
      let color = LJS.randColor(LJS.WHITE, LJS.hsl(0, 0, 0.2));

      if (i == 0) {
        tileIndex = 5;
      } else if (i == 1) {
        tileIndex = 637;
      }

      for (pos.x = this.tileLayers[i].size.x; pos.x--; ) {
        for (pos.y = this.tileLayers[i].size.y; pos.y--; ) {
          if (i == 1) {
            // check if tile should be solid
            if (LJS.randBool(0.7)) continue;
            color = LJS.RED;
            //tileIndex = 10;
            direction = LJS.randInt(4);
            mirror = LJS.randBool();
            //color = LJS.randColor(LJS.WHITE, LJS.hsl(0, 0, 0.2));
          }
          // check if tile should be solid
          if (LJS.randBool(0.1)) continue;
          let data = new LJS.TileLayerData(tileIndex, direction, mirror, color);
          this.tileLayers[i].setData(pos, data);
          this.tileLayers[i].setCollisionData(pos);
        }
      }
      this.tileLayers[i].redraw();
    }*/
    this.createLevels();
    this.currentLevel.currentRoom.tileLayer.redraw();
    this.player.position = this.currentLevel.currentRoom.center;
    LJS.setCameraPos(this.player.position);
  }

  update() {
    if (this.timer.elapsed()) {
      this.handleInput();
      this.timer.set(0.06);
    }
  }

  render() {
    //LJS.drawRect(this.center, this.size, new LJS.Color().setHex("#001effff"));
    this.player.render();
  }

  handleInput() {
    //console.log("Time delta: ", LJS.timeDelta);
    let direction = LJS.keyDirection();
    //console.log("direction: ", direction);
    let collides = LJS.tileCollisionGetData(
      this.player.position.add(direction)
    );
    /*if (collides) {
      console.log(
        "collision data: ",
        this.tileLayers[1].getCollisionData(this.player.position.add(direction))
      );
      if (
        !this.tileLayers[1].getCollisionData(
          this.player.position.add(direction)
        )
      ) {
        collides = false;
      }
    }*/
    if (!collides) this.player.move(direction);
  }

  checkCollision(object1, object2) {
    // Implement collision detection here
  }

  createLevels() {
    for (let i = 0; i < this.levelsCount; i++) {
      const level = new Level();
      this.levels.push(level);
    }

    this.currentLevel = this.levels[0];
  }
}
