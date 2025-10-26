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

  // create tile layer
  const pos = LJS.vec2();
  const tileLayer = new LJS.TileCollisionLayer(pos, game.size);
  for (pos.x = tileLayer.size.x; pos.x--; )
    for (pos.y = tileLayer.size.y; pos.y--; ) {
      // check if tile should be solid
      if (LJS.randBool(0.7)) continue;

      // set tile data
      const tileIndex = 42;
      const direction = LJS.randInt(4);
      const mirror = LJS.randBool();
      const color = LJS.randColor(LJS.WHITE, LJS.hsl(0, 0, 0.2));
      const data = new LJS.TileLayerData(tileIndex, direction, mirror, color);
      tileLayer.setData(pos, data);
      tileLayer.setCollisionData(pos);
    }
  tileLayer.redraw(); // redraw tile layer with new data
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
