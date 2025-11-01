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

import * as LJS from 'littlejsengine'
import Tile from './tile'
import Level from './level'
import Utils from './utils'
import Room from './room'

const gvec2 = Utils.gvec2

export default class Game {
  width: number
  height: number
  tileSize: number
  scale: LJS.Vector2
  tiles: any
  tilesColumns: number
  tilesRow: number
  levelsCount: number
  player: Tile
  currentLevel: Level
  levels: (Level | null)[]
  hud: string
  debugHud: string
  debugMode: boolean
  timer: LJS.Timer
  gameSize: LJS.Vector2
  size: LJS.Vector2
  center: LJS.Vector2

  constructor(
    width: number,
    height: number,
    tileSize: number,
    scale: LJS.Vector2,
    tiles: any[],
    tilesColumns: number,
    tilesRow: number,
    levelsCount = 6
  ) {
    this.width = width
    this.height = height
    this.tileSize = tileSize
    this.scale = scale
    this.tiles = tiles
    this.tilesColumns = tilesColumns
    this.tilesRow = tilesRow
    this.player = null
    this.currentLevel = null
    this.levelsCount = levelsCount
    this.levels = []

    this.hud = ''
    this.debugHud = ''

    this.debugMode = true
  }

  init() {
    this.timer = new LJS.Timer(0.06)
    this.gameSize = LJS.vec2(this.width, this.height)
    LJS.setCanvasFixedSize(this.gameSize)
    LJS.setCanvasMaxSize(this.gameSize)
    this.size = LJS.vec2(
      this.width / this.tileSize,
      this.height / this.tileSize
    )
    // center of the screen
    this.center = LJS.vec2(this.size.x / 2, this.size.y / 2)
    // position camera in middle of screen
    LJS.setCameraPos(this.center)
    // scale 1:1 with our tilesize (16x16)
    LJS.setCameraScale(this.tileSize * 2)

    // Ranges
    // 24 - 31 : NPCS (+49 to go down a row)

    this.player = new Tile(24, this.tileSize, this.scale, this.center)

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
    this.createLevels()
    this.currentLevel.currentRoom.tileLayer.redraw()
    this.player.position = LJS.vec2(
      Math.floor(this.currentLevel.currentRoom.center.x),
      Math.floor(this.currentLevel.currentRoom.center.y)
    )
    LJS.setCameraPos(this.player.position)

    this.debugHud = `Player position: ${this.player.position.x}, ${this.player.position.y}\n
    Player gPosition: ${this.player.gPosition.x}, ${this.player.gPosition.y}\n
    Current level id: ${this.currentLevel.id}\n
    Current room id, position: ${this.currentLevel.currentRoom.id}, ${this.currentLevel.currentRoom.position.x}, ${this.currentLevel.currentRoom.position.y}`
  }

  update() {
    if (this.timer.elapsed()) {
      this.handleInput()
      this.updateDebugHUD()
      this.timer.set(0.06)
    }
  }

  render() {
    //LJS.drawRect(this.center, this.size, new LJS.Color().setHex("#001effff"));
    this.player.render()
  }

  renderPost() {
    // Draw HUD or effects above all objects
    if (this.debugMode) this.drawDebugHUD()
    this.currentLevel.renderMinimap()
  }

  drawDebugHUD() {
    const text = this.debugHud
    const lineColoropt = LJS.WHITE
    const textAlignopt = 'left'
    const sizeopt = 15
    const coloropt = LJS.WHITE
    const lineWidthopt = null
    const fontopt = 'Arial'
    const fontStyleopt = 'normal'
    const maxWidthopt = 1000
    const angleopt = 0
    const contextopt = null

    //LJS.drawTextOverlay(this.debugHud, LJS.vec2(0), 1, coloropt);

    LJS.drawTextScreen(
      text,
      LJS.vec2(100, 100),
      sizeopt,
      coloropt,
      lineWidthopt,
      lineColoropt,
      textAlignopt,
      fontopt,
      fontStyleopt,
      maxWidthopt,
      angleopt
    )
  }

  updateDebugHUD() {
    this.debugHud = `Player position: ${this.player.position.x}, ${this.player.position.y}\n
    Player game position: ${this.player.position.x}, ${this.player.position.y}\n
    Current level: ${this.currentLevel.id}\n
    Current room position: ${this.currentLevel.currentRoom.position.x}, ${this.currentLevel.currentRoom.position.y}`
  }

  handleInput() {
    const up = LJS.vec2(0, 1)
    const down = LJS.vec2(0, -1)
    const left = LJS.vec2(-1, 0)
    const right = LJS.vec2(1, 0)
    //console.log("Time delta: ", LJS.timeDelta);
    let direction = LJS.keyDirection()
    let gDirection = LJS.vec2(direction.x, -direction.y)
    //console.log("Direction: ", direction);

    //console.log("direction: ", direction);
    let collides = LJS.tileCollisionGetData(this.player.position.add(direction))
    if (collides) {
      console.log(
        'Collision data at position, player position, direction: ',
        collides,
        this.player.position.add(direction),
        this.player.position,
        direction
      )
      // If collides with a door, switch room
      if (collides == 2) {
        console.log('Door found, switching room')
        let newRoom: Room
        if (direction.y == 1) newRoom = this.currentLevel.currentRoom.up
        else if (direction.y == -1) newRoom = this.currentLevel.currentRoom.down
        else if (direction.x == -1) newRoom = this.currentLevel.currentRoom.left
        else if (direction.x == 1) newRoom = this.currentLevel.currentRoom.right

        if (newRoom) {
          this.player.position = this.currentLevel.switchRoom(newRoom)
          LJS.setCameraPos(this.player.position)
        }
        return

        /*switch (direction) {
          case up:
            this.player.position = this.currentLevel.currentRoom.center.add(
              LJS.vec2(0, this.currentLevel.currentRoom.size.y - 1)
            );
            break;
          case down:
            this.player.position = this.currentLevel.currentRoom.center.add(
              LJS.vec2(0, -this.currentLevel.currentRoom.size.y - 1)
            );
            break;
          case left:
            this.player.position = this.currentLevel.currentRoom.center.add(
              LJS.vec2(this.currentLevel.currentRoom.size.x - 1, 0)
            );
            break;
          case right:
            this.player.position = this.currentLevel.currentRoom.center.add(
              LJS.vec2(-this.currentLevel.currentRoom.size.x - 1, 0)
            );
            break;
        }

        LJS.setCameraPos(this.player.position);
        return;*/
      }
    }

    if (!collides) this.player.move(direction)
  }

  checkCollision(object1: any, object2: any) {
    // Implement collision detection here
  }

  createLevels() {
    for (let i = 0; i < this.levelsCount; i++) {
      const level = new Level(i)
      this.levels.push(level)
    }

    this.currentLevel = this.levels[0]
  }
}
