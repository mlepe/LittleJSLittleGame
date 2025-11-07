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

  class EnvironmentData {
    public data: { levelLayout: { map: number[][] } };
    public finalData: { room: number[][][] };
    constructor() {
      this.data = {
        levelLayout: {
          map: [
            [0, 1, 0, 0],
            [0, 1, 2, 1],
            [0, 1, 0, 1],
            [0, 0, 0, 3],
          ],
        },
      };
      this.finalData = {
        room: [
          [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 2, 1, 1],
          ],
          [
            [1, 1, 2, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 2],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
          ],
          [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 2],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
          ],
          [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [2, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
          ],
          [
            [1, 1, 2, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
          ],
          [
            [1, 1, 2, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 2, 1, 1],
          ],
          [
            [1, 1, , 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
          ],
        ],
      };
    }
  }

  /**
   * Snaps a value to the nearest 0.5 increment
   * @param value The value to snap
   * @returns The snapped value (0, 0.5, 1, 1.5, 2, etc.)
   */
  export function snapToHalfGrid(value: number): number {
    return Math.round(value * 2) / 2;
  }

  /**
   * Snaps a Vector2 position to the nearest 0.5 increments
   * @param position The position to snap
   * @returns A new Vector2 with snapped coordinates
   */
  export function snapPositionToHalfGrid(position: LJS.Vector2): LJS.Vector2 {
    return LJS.vec2(snapToHalfGrid(position.x), snapToHalfGrid(position.y));
  }

  /**
   * Snaps a value to the nearest full grid increment (1.0)
   * @param value The value to snap
   * @returns The snapped value (0, 1, 2, 3, etc.)
   */
  export function snapToFullGrid(value: number): number {
    return Math.round(value);
  }

  /**
   * Snaps a Vector2 position to the nearest full grid increments
   * @param position The position to snap
   * @returns A new Vector2 with snapped coordinates
   */
  export function snapPositionToFullGrid(position: LJS.Vector2): LJS.Vector2 {
    return LJS.vec2(snapToFullGrid(position.x), snapToFullGrid(position.y));
  }

  /**
   * Grid movement directions for discrete movement
   */
  export enum GridDirection {
    NONE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4,
  }

  /**
   * Converts Vector2 direction to GridDirection enum
   * @param direction The input direction vector
   * @returns GridDirection enum value
   */
  export function vectorToGridDirection(direction: LJS.Vector2): GridDirection {
    if (direction.y > 0) return GridDirection.UP;
    if (direction.y < 0) return GridDirection.DOWN;
    if (direction.x < 0) return GridDirection.LEFT;
    if (direction.x > 0) return GridDirection.RIGHT;
    return GridDirection.NONE;
  }

  /**
   * Converts GridDirection to unit Vector2
   * @param direction The grid direction
   * @returns Unit vector for the direction
   */
  export function gridDirectionToVector(direction: GridDirection): LJS.Vector2 {
    switch (direction) {
      case GridDirection.UP:
        return LJS.vec2(0, 1);
      case GridDirection.DOWN:
        return LJS.vec2(0, -1);
      case GridDirection.LEFT:
        return LJS.vec2(-1, 0);
      case GridDirection.RIGHT:
        return LJS.vec2(1, 0);
      default:
        return LJS.vec2(0, 0);
    }
  }
}

export default Global;
