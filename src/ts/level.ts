import * as LJS from 'littlejsengine';
import Room from './room';
import Global from './global';
import { Door } from './gameObjects';

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
  roomsMap: (Room | null)[][] = [];
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
    for (let y = 0; y < this.levelData.length; y++) {
      this.roomsMap[y] = [];
      for (let x = 0; x < this.levelData[y].length; x++) {
        const roomType = this.levelData[y][x];

        if (roomType === Global.RoomTypes.NONE) {
          this.roomsMap[y][x] = null; // Explicitly set null for empty positions
          continue;
        }

        const room = new Room(LJS.vec2(x, y), roomType, LJS.vec2(x, y), this);
        this.rooms.push(room);
        this.roomsMap[y][x] = room;

        if (roomType === Global.RoomTypes.START) {
          this.startRoom = room;
        } else if (roomType === Global.RoomTypes.END) {
          this.endRoom = room;
        }
      }
    }
    console.log('Rooms created:', this.roomsMap);
  }

  displayCurrentRoomInfo() {
    if (this.currentRoom) {
      console.log(
        `Current Room ID: (${this.currentRoom.id.x}, ${this.currentRoom.id.y}), Type: ${Global.RoomTypes[this.currentRoom.roomType]}\n
        Doors: ${JSON.stringify(
          this.currentRoom.doorsDirections,
          (key, value) => {
            if (value instanceof Room) {
              return `${key}: Room(${value.id.x},${value.id.y})`;
            }
            return `${key}: None`;
          }
        )}`
      );
    }
  }

  connectRooms() {
    for (let y = 0; y < this.roomsMap.length; y++) {
      for (let x = 0; x < this.roomsMap[y].length; x++) {
        const room = this.roomsMap[y][x];
        if (room !== null) {
          // Connect to adjacent rooms using correct array indices with proper null checks
          room.up =
            (y > 0 && this.roomsMap[y - 1] && this.roomsMap[y - 1][x]) || null;
          room.down =
            (y < this.roomsMap.length - 1 &&
              this.roomsMap[y + 1] &&
              this.roomsMap[y + 1][x]) ||
            null;
          room.left = (x > 0 && this.roomsMap[y][x - 1]) || null;
          room.right =
            (x < this.roomsMap[y].length - 1 && this.roomsMap[y][x + 1]) ||
            null;

          // Only create doors where adjacent rooms actually exist
          console.log(
            `Room at (${x},${y}) connections:`,
            `up=${room.up ? `(${room.up.id.x},${room.up.id.y})` : 'none'}`,
            `down=${room.down ? `(${room.down.id.x},${room.down.id.y})` : 'none'}`,
            `left=${room.left ? `(${room.left.id.x},${room.left.id.y})` : 'none'}`,
            `right=${room.right ? `(${room.right.id.x},${room.right.id.y})` : 'none'}`
          );

          // Adjust door positions to account for center-based EngineObject positioning
          // Add 0.5 to align with tile centers since EngineObject uses center-based coords
          const doorPositionsOffset = {
            up: LJS.vec2(2.5, 4.5), // center x, top wall + 0.5 offset
            down: LJS.vec2(2.5, 0.5), // center x, bottom wall + 0.5 offset
            left: LJS.vec2(0.5, 2.5), // left wall + 0.5 offset, center y
            right: LJS.vec2(4.5, 2.5), // right wall + 0.5 offset, center y
          };

          const doorPositions = {
            up: LJS.vec2(2, 4), // center x, top wall + 0.5 offset
            down: LJS.vec2(2, 0), // center x, bottom wall + 0.5 offset
            left: LJS.vec2(0, 2), // left wall + 0.5 offset, center y
            right: LJS.vec2(4, 2), // right wall + 0.5 offset, center y
          };

          if (room.up !== null) {
            room.createDoor(doorPositions.up, room.up, 'up');
            console.log(
              `Created UP door at (${doorPositions.up.x}, ${doorPositions.up.y})`
            );
          }
          if (room.down !== null) {
            room.createDoor(doorPositions.down, room.down, 'down');
            console.log(
              `Created DOWN door at (${doorPositions.down.x}, ${doorPositions.down.y})`
            );
          }
          if (room.left !== null) {
            room.createDoor(doorPositions.left, room.left, 'left');
            console.log(
              `Created LEFT door at (${doorPositions.left.x}, ${doorPositions.left.y})`
            );
          }
          if (room.right !== null) {
            room.createDoor(doorPositions.right, room.right, 'right');
            console.log(
              `Created RIGHT door at (${doorPositions.right.x}, ${doorPositions.right.y})`
            );
          }
        }
      }
    }
  }

  switchRoom(newRoom: Room, fromDoor?: Door): LJS.Vector2 {
    if (this.currentRoom != null) this.previousRoom = this.currentRoom;
    this.currentRoom = newRoom;
    this.currentRoom.tileLayers[0].redraw();
    this.currentRoom.tileLayers[1].redraw();

    let coords: LJS.Vector2;

    if (fromDoor) {
      // Calculate spawn position based on which door the player came from
      coords = this.calculateSpawnPosition(newRoom, fromDoor);
    } else {
      // Default spawn position (center of room)
      coords = newRoom.center;
    }

    this.displayCurrentRoomInfo();
    return coords;
  }

  calculateSpawnPosition(newRoom: Room, fromDoor: Door): LJS.Vector2 {
    // Find the corresponding door in the new room that connects back to the previous room
    for (const [direction, door] of Object.entries(newRoom.doorsDirections)) {
      if (door && door.toRoom === fromDoor.fromRoom) {
        // Spawn player one tile away from the door in the opposite direction
        let spawnPos: LJS.Vector2;
        switch (direction) {
          case 'up':
            spawnPos = LJS.vec2(door.pos.x, door.pos.y - 1); // Spawn below the door (full grid)
            break;
          case 'down':
            spawnPos = LJS.vec2(door.pos.x, door.pos.y + 1); // Spawn above the door (full grid)
            break;
          case 'left':
            spawnPos = LJS.vec2(door.pos.x + 1, door.pos.y); // Spawn to the right of door (full grid)
            break;
          case 'right':
            spawnPos = LJS.vec2(door.pos.x - 1, door.pos.y); // Spawn to the left of door (full grid)
            break;
          default:
            spawnPos = newRoom.center;
        }

        // Ensure spawn position is snapped to full-grid for GameCharacters
        return Global.snapPositionToFullGrid(spawnPos);
      }
    }

    // Fallback to center if no matching door found
    return Global.snapPositionToFullGrid(newRoom.center);
  }
}
