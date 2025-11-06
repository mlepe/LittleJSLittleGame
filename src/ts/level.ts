import * as LJS from 'littlejsengine';
import Room from './room';
import Global from './global';

const defaultLevelData: number[][] = [
  [0, 1, 0, 0],
  [1, 1, 2, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 3],
];

export default class Level {
  id: number;
  name: string = '';
  levelData: number[][] = defaultLevelData;
  roomsMap: Room[][] = [];
  rooms: Room[] = [];
  startRoom: Room;
  endRoom: Room;
  previousRoom: Room | null = null;
  currentRoom: Room;
  center: LJS.Vector2;

  constructor(id: number) {
    this.id = id;
    this.createRooms();
    this.connectRooms();
    this.center = LJS.vec2(
      Math.floor(this.levelData[0].length / 2),
      Math.floor(this.levelData.length / 2)
    );
  }

  createRooms() {
    let i = 0;
    for (let y = 0; y < this.levelData.length; y++) {
      this.roomsMap[y] = [];
      for (let x = 0; x < this.levelData[y].length; x++) {
        const roomType = this.levelData[y][x];
        if (roomType > 0) {
          const room = new Room(i++, roomType, LJS.vec2(x, y));
          this.rooms.push(room);
          this.roomsMap[y][x] = room;
          if (roomType === Global.RoomTypes.START) {
            this.startRoom = room;
          } else if (roomType === Global.RoomTypes.END) {
            this.endRoom = room;
          }
        }
      }
    }
  }

  connectRooms() {
    for (let y = 0; y < this.roomsMap.length; y++) {
      for (let x = 0; x < this.roomsMap[y].length; x++) {
        const room = this.roomsMap[y][x];
        if (room) {
          // Connect to adjacent rooms
          room.up = this.roomsMap[y - 1]?.[x] || null;
          room.down = this.roomsMap[y + 1]?.[x] || null;
          room.left = this.roomsMap[y][x - 1] || null;
          room.right = this.roomsMap[y][x + 1] || null;

          if (room.up) {
            room.createDoor(LJS.vec2(x, y - 1), room.up);
          }
          if (room.down) {
            room.createDoor(LJS.vec2(x, y + 1), room.down);
          }
          if (room.left) {
            room.createDoor(LJS.vec2(x - 1, y), room.left);
          }
          if (room.right) {
            room.createDoor(LJS.vec2(x + 1, y), room.right);
          }
        }
      }
    }
  }

  switchRoom(newRoom: Room): LJS.Vector2 {
    if (this.currentRoom != null) this.previousRoom = this.currentRoom;
    this.currentRoom = newRoom;
    this.currentRoom.tileLayers[0].redraw();
    this.currentRoom.tileLayers[1].redraw();
    let coords: LJS.Vector2 = LJS.vec2(0, 0);
    if (this.previousRoom?.roomType === Global.RoomTypes.START) {
      coords = this.center; // Entrance position
    }
    coords = this.center;
    return coords;
  }
}
