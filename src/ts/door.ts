/*
 * File: door.js
 * Project: testproj
 * File Created: Tuesday, 28th October 2025 10:23:39 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Tuesday, 28th October 2025 10:23:39 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from "littlejsengine";
import Room from "./room";
import Utils from "./utils";

export default class Door {
  position: LJS.Vector2;
  direction: LJS.Vector2;
  toRoom: Room;
  fromRoom: Room;
  cardinalDirection: Utils.CardinalDirection;

  constructor(
    position: LJS.Vector2,
    fromRoom: Room,
    toRoom: Room,
    cardinalDirection: Utils.CardinalDirection
  ) {
    this.position = position;
    this.fromRoom = fromRoom;
    this.toRoom = toRoom;
    this.cardinalDirection = cardinalDirection;
  }
}
