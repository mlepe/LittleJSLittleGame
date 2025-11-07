/*
 * File: gameObject.ts
 * Project: testproj
 * File Created: Wednesday, 5th November 2025 12:13:10 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Wednesday, 5th November 2025 12:13:10 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Room from './room';
import Global from './global';

export class GameObject extends LJS.EngineObject {
  useFullGrid: boolean = false; // By default use half-grid for precise positioning

  constructor(
    pos: LJS.Vector2,
    size: LJS.Vector2 = LJS.vec2(1, 1),
    tileInfo?: LJS.TileInfo,
    useFullGrid: boolean = false
  ) {
    // Snap initial position based on grid type
    const snappedPos = useFullGrid
      ? Global.snapPositionToFullGrid(pos)
      : Global.snapPositionToHalfGrid(pos);
    super(snappedPos, size, tileInfo);

    this.useFullGrid = useFullGrid;
  }

  // Override update to enforce position constraints after any movement
  update() {
    // Call parent update first
    super.update();

    // Snap position based on grid type
    this.pos = this.useFullGrid
      ? Global.snapPositionToFullGrid(this.pos)
      : Global.snapPositionToHalfGrid(this.pos);
  }

  // Method to set position with automatic snapping
  setPosition(newPos: LJS.Vector2) {
    this.pos = this.useFullGrid
      ? Global.snapPositionToFullGrid(newPos)
      : Global.snapPositionToHalfGrid(newPos);
  }

  getPosWithOffset(): LJS.Vector2 {
    return this.pos.copy().add(Global.EngineObjectPosOffset);
  }

  render() {
    // Render the game object at its current position
    LJS.drawTile(this.getPosWithOffset(), this.size, this.tileInfo);
  }

  kill() {
    this.destroy();
  }
}
export class Door extends GameObject {
  toRoom: Room;
  fromRoom: Room;

  constructor(pos: LJS.Vector2, fromRoom: Room, toRoom: Room) {
    let size = LJS.vec2(1, 1);
    super(pos, size, LJS.tile(Global.TileIndex.DOOR));
    this.fromRoom = fromRoom;
    this.toRoom = toRoom;
    //this.setCollision(); // make object collide
    this.setCollision(true, true, false, true);
    this.renderOrder = 1; // render player on top
    this.gravityScale = 0;

    console.log(
      `Door created from Room ${fromRoom.id} to Room ${toRoom.id} at position`,
      pos
    );
  }

  render() {
    // Optionally render door differently, e.g., with a special effect
    //LJS.drawTile(this.getPosWithOffset(), this.size, this.tileInfo);

    LJS.drawTile(this.pos, this.size, this.tileInfo);
  }
}
