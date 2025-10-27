/*
 * File: level.js
 * Project: testproj
 * File Created: Monday, 27th October 2025 2:36:02 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Monday, 27th October 2025 2:36:02 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from "littlejsengine";
import Room from "./room";

const DEFAULT_LEVEL_LAYOUT = [
  [0, 1, 0, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 3, 0],
];
export default class Level {
  constructor(roomsCount = 6, levelLayout = DEFAULT_LEVEL_LAYOUT) {
    this.roomsCount = roomsCount;
    this.rooms = [];
    this.levelLayout = levelLayout;
    this.currentRoom = null;

    this.init();
  }

  init() {
    this.createRooms();
  }

  createRooms() {
    for (let y = 0; y < this.levelLayout.length; y++) {
      for (let x = 0; x < this.levelLayout[y].length; x++) {
        const roomType = this.levelLayout[y][x];
        if (roomType === 0) continue; // Skip empty rooms
        const room = new Room(roomType);
        this.rooms.push({
          room: room,
          position: LJS.vec2(x, y),
        });
        if (roomType == 2) this.currentRoom = room; // Set start room
      }
    }
  }

  switchRoom(newRoom) {
    this.currentRoom = newRoom;
    this.currentRoom.tileLayer.redraw();
  }
}
