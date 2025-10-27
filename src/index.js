/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

"use strict";

import * as LJS from "littlejsengine";
import Tileset from "./assets/img/16x16/monochrome-transparent_packed.png";
//import MainTileset from "./assets/img/8x8/8x8_main.png";
//import ExtraTileset from "./assets/img/8x8/8x8_interiors.png";
import Game from "./js/game";

const ENV_TILES = {
  WALL_TOP_LEFT: {
    tileName: "wallTopLeft",
    tileId: 39,
    blocksView: true,
    blocksMovement: true,
  },
  WALL_TOP: {
    tileName: "wallTop",
    tileId: 40,
    blocksView: true,
    blocksMovement: true,
  },
  WALL_TOP_RIGHT: {
    tileName: "wallTopRight",
    tileId: 41,
    blocksView: true,
    blocksMovement: true,
  },
  WALL_LEFT: {
    tileName: "wallLeft",
    tileId: 52,
    blocksView: true,
    blocksMovement: true,
  },
  WALL_RIGHT: {
    tileName: "wallRight",
    tileId: 54,
    blocksView: true,
    blocksMovement: true,
  },
  WALL_BOTTOM_LEFT: {
    tileName: "wallRight",
    tileId: 67,
    blocksView: true,
    blocksMovement: true,
  },
  WALL_BOTTOM: {
    tileName: "wallRight",
    tileId: 68,
    blocksView: true,
    blocksMovement: true,
  },
  WALL_BOTTOM_RIGHT: {
    tileName: "wallRight",
    tileId: 69,
    blocksView: true,
    blocksMovement: true,
  },
};

const game = new Game(800, 600, 16, LJS.vec2(1, 1), [Tileset], 48, 21);

// ENGINE CODE BELOW

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game
  game.init();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
  game.update();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
  game.render();
  //tileLayers[0].drawTileData(game.center);
  /*for (let x = game.gameSize.x; x--; )
    for (let y = game.gameSize.y; y--; ) {
      tileLayers[0].drawTileData(LJS.vec2(x, y));
    }*/
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
  //drawTextScreen("Hello World!", G.center, 50);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
LJS.engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  game.tiles
);
