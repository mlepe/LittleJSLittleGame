/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

"use strict";

import * as LJS from "littlejsengine";
import Tileset from "./assets/img/tileset.png";
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

/*function handleInput() {
  G.player.move(LJS.keyDirection());
}*/

const game = new Game(800, 600, 8, LJS.vec2(2), [Tileset], 13, 11);

// ---

const tileLayers = [];

// ENGINE CODE BELOW

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game
  game.init();
  tileLayers[0] = new LJS.TileLayer(LJS.vec2(), game.gameSize);
  tileLayers[0].setData(LJS.vec2(), 42);
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
