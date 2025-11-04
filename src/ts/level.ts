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
import * as LJS from 'littlejsengine';
import Room from './room';
import Utils from './utils';
const gvec2 = Utils.gvec2;

const DEFAULT_LEVEL_LAYOUT: number[][] = [
  [0, 1, 0, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 3, 0],
];

function createEmptyRoomsMap(): (Room | null)[][] {
  return [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];
}
export default class Level {
  id: number;
  roomsCount: number;
  rooms: any[];
  roomsMap: Room[][];
  levelLayout: number[][];
  currentRoom: Room | null;
  startRoom: Room | null;
  endRoom: Room | null;

  constructor(id: number, roomsCount = 6, levelLayout = DEFAULT_LEVEL_LAYOUT) {
    this.id = id;
    this.roomsCount = roomsCount;
    this.rooms = [];
    this.roomsMap = createEmptyRoomsMap();
    this.levelLayout = levelLayout;
    this.currentRoom = null;

    this.init();
  }

  init() {
    this.createRooms();
  }

  createRooms() {
    let i = 0;
    for (let y = 0; y < this.levelLayout.length; y++) {
      for (let x = 0; x < this.levelLayout[y].length; x++) {
        const roomType = this.levelLayout[y][x];
        if (roomType == Room.RoomTypes.EMPTY) continue; // Skip empty rooms
        const room = new Room(i, LJS.vec2(x, y), roomType);
        i++;

        this.roomsMap[y][x] = room;
        this.rooms.push(room);
        //if (roomType == 2) this.currentRoom = room; // Set start room
      }
    }

    for (let y = 0; y < this.levelLayout.length; y++) {
      for (let x = 0; x < this.levelLayout[y].length; x++) {
        if (this.roomsMap[y][x] != null) {
          let room = this.roomsMap[y][x];
          /*console.log(
            "Creating doors for room at position, gPosition (fn call): ",
            this.roomsMap[y][x],
            LJS.vec2(x, y),
            gvec2(LJS.vec2(x, y))
          );*/
          if (y > 0 && this.roomsMap[y - 1][x] != null) {
            room.up = this.roomsMap[y - 1][x];
            console.log(
              `Creating UP door from room ${room.id} at (${x},${y}) to room ${room.up.id}`
            );
            room.createDoor(room.up, Utils.CardinalDirection.UP);
          }
          if (
            y < this.levelLayout.length - 1 &&
            this.roomsMap[y + 1][x] != null
          ) {
            room.down = this.roomsMap[y + 1][x];
            console.log(
              `Creating DOWN door from room ${room.id} at (${x},${y}) to room ${room.down.id}`
            );
            room.createDoor(room.down, Utils.CardinalDirection.DOWN);
          }
          if (x > 0 && this.roomsMap[y][x - 1] != null) {
            room.left = this.roomsMap[y][x - 1];
            console.log(
              `Creating LEFT door from room ${room.id} at (${x},${y}) to room ${room.left.id}`
            );
            room.createDoor(room.left, Utils.CardinalDirection.LEFT);
          }
          if (
            x < this.levelLayout[y].length - 1 &&
            this.roomsMap[y][x + 1] != null
          ) {
            room.right = this.roomsMap[y][x + 1];
            console.log(
              `Creating RIGHT door from room ${room.id} at (${x},${y}) to room ${room.right.id}`
            );
            room.createDoor(room.right, Utils.CardinalDirection.RIGHT);
          }
        }
      }
    }

    for (let y = 0; y < this.levelLayout.length; y++) {
      for (let x = 0; x < this.levelLayout[y].length; x++) {
        if (this.levelLayout[y][x] == Room.RoomTypes.START) {
          //this.currentRoom = this.roomsMap[y][x];
          this.startRoom = this.roomsMap[y][x];
        } else if (this.levelLayout[y][x] == Room.RoomTypes.END) {
          this.endRoom = this.roomsMap[y][x];
        }
      }
    }
  }

  renderMinimap() {
    let minimap = this.roomsMap;
    let minimapSize = LJS.vec2(100, 100);
    let minimapPos = LJS.vec2(500, 50);
    let color: LJS.Color;

    LJS.drawRect(minimapPos, minimapSize, LJS.GRAY, 0, true, true);
    for (let y = 0; y < minimap.length; y++) {
      for (let x = 0; x < minimap[y].length; x++) {
        if (minimap[y][x] != null) {
          if (minimap[y][x].roomType == Room.RoomTypes.START) {
            color = LJS.YELLOW;
          } else if (minimap[y][x].roomType == Room.RoomTypes.END) {
            color = LJS.RED;
          } else {
            color = LJS.WHITE;
          }

          if (minimap[y][x] == this.currentRoom) {
            color = LJS.GREEN;
          }

          LJS.drawRect(
            minimapPos.add(LJS.vec2(x * 10, y * 10)),
            LJS.vec2(10, 10),
            color,
            0,
            true,
            true
          );
        }
      }
    }
  }

  switchRoom(newRoom: Room) {
    let coords: LJS.Vector2;
    if (this.currentRoom != null) {
    }
    this.currentRoom = newRoom;
    this.currentRoom.tileLayer.redraw();
    coords = newRoom.center;
    return coords; // Always safe from edge doors
  }
}
