/*
 * File: global.ts
 * Project: testproj
 * File Created: Tuesday, 4th November 2025 11:34:25 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 4th November 2025 11:34:25 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';

namespace Global {
  export const TileSize = LJS.vec2(16, 16);
  export const EngineObjectPosOffset = LJS.vec2(0.5, 0.5);

  export enum TileType {
    NON_SOLID = 0,
    SOLID = 1,
    DOOR = 2,
  }

  export enum TileDataIndex {
    FLOOR = 0,
    WALL = 1,
    OBJECT = 2,
  }

  export enum TileIndex {
    FLOOR = 5,
    WALL = 637,
    PLAYER = 24,
    CHARACTER = 100,
    ENEMY = 200,
    DOOR = 444,
  }

  export enum RoomTypes {
    NONE = 0,
    REGULAR = 1,
    START = 2,
    END = 3,
    TREASURE = 4,
    ENEMY = 5,
    PUZZLE = 6,
  }
}

export default Global;
