/*
 * File: utils.js
 * Project: testproj
 * File Created: Tuesday, 28th October 2025 1:55:11 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 28th October 2025 1:55:11 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from "littlejsengine";

namespace Utils {
  export function gvec2(vec: LJS.Vector2): LJS.Vector2 {
    return LJS.vec2(vec.x, -vec.y);
  }

  export const enum DirectionCoordinates {
    UP_X = 0,
    UP_Y = -1,
    DOWN_X = 0,
    DOWN_Y = 1,
    LEFT_X = -1,
    LEFT_Y = 0,
    RIGHT_X = 1,
    RIGHT_Y = 0,
    ENGINE_UP_X = 0,
    ENGINE_UP_Y = 1,
    ENGINE_DOWN_X = 0,
    ENGINE_DOWN_Y = -1,
    ENGINE_LEFT_X = -1,
    ENGINE_LEFT_Y = 0,
    ENGINE_RIGHT_X = 1,
    ENGINE_RIGHT_Y = 0,
  }

  export const enum CardinalDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
  }
}
export default Utils;
/* default class Utils {
  static gvec2(vec: LJS.Vector2): LJS.Vector2 {
    return LJS.vec2(vec.x, -vec.y);
  }
}*/
