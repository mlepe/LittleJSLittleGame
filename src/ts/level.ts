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
import * as LJS from 'littlejsengine'
import Room from './room'
import Utils from './utils'
const gvec2 = Utils.gvec2

const DEFAULT_LEVEL_LAYOUT: number[][] = [
  [0, 1, 0, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 3, 0],
]

const DEFAULT_EMPTY_ROOMS_MAP: (Room | null)[][] = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
]
export default class Level {
  id: number
  roomsCount: number
  rooms: any[]
  roomsMap: Room[][]
  levelLayout: number[][]
  currentRoom: Room | null
  constructor(id: number, roomsCount = 6, levelLayout = DEFAULT_LEVEL_LAYOUT) {
    this.id = id
    this.roomsCount = roomsCount
    this.rooms = []
    this.roomsMap = DEFAULT_EMPTY_ROOMS_MAP
    this.levelLayout = levelLayout
    this.currentRoom = null

    this.init()
  }

  init() {
    this.createRooms()
  }

  createRooms() {
    let i = 0
    for (let y = 0; y < this.levelLayout.length; y++) {
      for (let x = 0; x < this.levelLayout[y].length; x++) {
        const roomType = this.levelLayout[y][x]
        if (roomType == Room.RoomTypes.EMPTY) continue // Skip empty rooms
        const room = new Room(i, LJS.vec2(x, y), roomType)
        i++

        this.roomsMap[y][x] = room
        this.rooms.push(room)
        //if (roomType == 2) this.currentRoom = room; // Set start room
      }
    }

    for (let y = 0; y < this.levelLayout.length; y++) {
      for (let x = 0; x < this.levelLayout[y].length; x++) {
        if (this.roomsMap[y][x] != null) {
          let room = this.roomsMap[y][x]
          /*console.log(
            "Creating doors for room at position, gPosition (fn call): ",
            this.roomsMap[y][x],
            LJS.vec2(x, y),
            gvec2(LJS.vec2(x, y))
          );*/
          if (y > 0 && this.roomsMap[y - 1][x] != null) {
            room.up = this.roomsMap[y - 1][x]
            room.createDoor(room.up, Utils.CardinalDirection.UP)
          }
          if (
            y < this.levelLayout.length - 1 &&
            this.roomsMap[y + 1][x] != null
          ) {
            room.down = this.roomsMap[y + 1][x]
            room.createDoor(room.down, Utils.CardinalDirection.DOWN)
          }
          if (x > 0 && this.roomsMap[y][x - 1] != null) {
            room.left = this.roomsMap[y][x - 1]
            room.createDoor(room.left, Utils.CardinalDirection.LEFT)
          }
          if (
            x < this.levelLayout[y].length - 1 &&
            this.roomsMap[y][x + 1] != null
          ) {
            room.right = this.roomsMap[y][x + 1]
            room.createDoor(room.right, Utils.CardinalDirection.RIGHT)
          }
        }
      }
    }

    for (let y = 0; y < this.levelLayout.length; y++) {
      for (let x = 0; x < this.levelLayout[y].length; x++) {
        if (this.levelLayout[y][x] == Room.RoomTypes.START) {
          //this.currentRoom = this.roomsMap[y][x];
          this.switchRoom(this.roomsMap[y][x])
        }
      }
    }
  }

  createRoomDoor(room: Room, cardinalDirection: Utils.CardinalDirection) {
    console.log(
      'Creating door for room at position: ',
      room.position,
      ' direction: ',
      cardinalDirection
    )
    let destRoom = null
    if (cardinalDirection == 'up') {
      destRoom = this.roomsMap[room.position.y - 1][room.position.x]
    } else if (cardinalDirection == 'down') {
      destRoom = this.roomsMap[room.position.y + 1][room.position.x]
    } else if (cardinalDirection == 'left') {
      destRoom = this.roomsMap[room.position.y][room.position.x - 1]
    } else if (cardinalDirection == 'right') {
      destRoom = this.roomsMap[room.position.y][room.position.x + 1]
    }

    room.createDoor(destRoom, cardinalDirection)
  }
  createDoors(room: Room) {
    console.log(
      'In level.createDoors() for room at position: ',
      room,
      room.position
    )
    const up = room.position.add(LJS.vec2(0, -1))
    const down = room.position.add(LJS.vec2(0, 1))
    const left = room.position.add(LJS.vec2(-1, 0))
    const right = room.position.add(LJS.vec2(1, 0))

    console.log(
      'Adjacent rooms at up, down, left, right: ',
      this.roomsMap[up.y] ? this.roomsMap[up.y][up.x] : 'Out of bounds',
      this.roomsMap[down.y] ? this.roomsMap[down.y][down.x] : 'Out of bounds',
      this.roomsMap[left.y] ? this.roomsMap[left.y][left.x] : 'Out of bounds',
      this.roomsMap[right.y] ? this.roomsMap[right.y][right.x] : 'Out of bounds'
    )

    let adjacentRooms = {
      up: this.roomsMap[up.y] ? this.roomsMap[up.y][up.x] : null,
      down: this.roomsMap[down.y] ? this.roomsMap[down.y][down.x] : null,
      left: this.roomsMap[left.y] ? this.roomsMap[left.y][left.x] : null,
      right: this.roomsMap[right.y] ? this.roomsMap[right.y][right.x] : null,
    }

    if (adjacentRooms.up) {
      // Create door at the top
      let position = LJS.vec2(Math.floor(room.size.x / 2), 0)
      //let direction = LJS.vec2(0, -1);
      room.createDoor(this.roomsMap[up.y][up.x], Utils.CardinalDirection.UP)
    }
    if (adjacentRooms.down) {
      // Create door at the bottom
      let position = LJS.vec2(Math.floor(room.size.x / 2), room.size.y - 1)
      //let direction = LJS.vec2(0, 0);
      room.createDoor(
        this.roomsMap[down.y][down.x],
        Utils.CardinalDirection.DOWN
      )
    }
    if (adjacentRooms.left) {
      // Create door on the left
      let position = LJS.vec2(0, Math.floor(room.size.y / 2))
      //let direction = LJS.vec2(-1, 0);
      room.createDoor(
        this.roomsMap[left.y][left.x],
        Utils.CardinalDirection.LEFT
      )
    }
    if (adjacentRooms.right) {
      // Create door on the right
      let position = LJS.vec2(room.size.x - 1, Math.floor(room.size.y / 2))
      //let direction = LJS.vec2(1, 0);
      room.createDoor(
        this.roomsMap[right.y][right.x],
        Utils.CardinalDirection.RIGHT
      )
    }
  }

  renderMinimap() {
    let minimap = this.roomsMap
    let minimapSize = LJS.vec2(100, 100)
    let minimapPos = LJS.vec2(500, 50)
    let color: LJS.Color

    LJS.drawRect(minimapPos, minimapSize, LJS.GRAY, 0, true, true)
    for (let y = 0; y < minimap.length; y++) {
      for (let x = 0; x < minimap[y].length; x++) {
        if (minimap[y][x] != null) {
          if (minimap[y][x].roomType == Room.RoomTypes.START) {
            color = LJS.YELLOW
          } else if (minimap[y][x].roomType == Room.RoomTypes.END) {
            color = LJS.RED
          } else {
            color = LJS.WHITE
          }

          if (minimap[y][x] == this.currentRoom) {
            color = LJS.GREEN
          }

          LJS.drawRect(
            minimapPos.add(LJS.vec2(x * 10, y * 10)),
            LJS.vec2(10, 10),
            color,
            0,
            true,
            true
          )
        }
      }
    }
  }

  switchRoom(newRoom: Room) {
    const previousRoom: Room | null = this.currentRoom

    console.log('Switching room from, to: ', previousRoom, newRoom)
    this.currentRoom = newRoom
    this.currentRoom.tileLayer.redraw()

    // Always place player at center of new room to avoid door collision issues
    return newRoom.center
  }
}
