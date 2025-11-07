/*
 * File: gameCharacter.ts
 * Project: testproj
 * File Created: Wednesday, 5th November 2025 12:23:30 am
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Wednesday, 5th November 2025 12:23:30 am
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import { GameObject, Door } from './gameObjects';
import Global from './global';
import { vec2 } from 'littlejsengine';
import Game from './game';
import Level from './level';

export class GameCharacter extends GameObject {
  health: number;
  speed: number;
  moveInput: LJS.Vector2 = LJS.vec2(0, 0);
  lastPosition: LJS.Vector2 = LJS.vec2(0, 0);

  // Grid movement properties
  isMoving: boolean = false;
  moveStartTime: number = 0;
  moveStartPos: LJS.Vector2 = LJS.vec2(0, 0);
  moveTargetPos: LJS.Vector2 = LJS.vec2(0, 0);
  moveDuration: number = 0.2; // Time to move one grid cell in seconds
  pendingDirection: Global.GridDirection = Global.GridDirection.NONE;

  constructor(
    pos: LJS.Vector2 = LJS.vec2(0, 0),
    size: LJS.Vector2 = LJS.vec2(1, 1),
    tileInfo: LJS.TileInfo = LJS.tile(Global.TileIndex.ENEMY),
    health: number = 100,
    speed: number = 5
  ) {
    // GameCharacters use full grid alignment for discrete movement
    super(pos, size, tileInfo, true);
    this.health = health;
    this.speed = speed;
    this.renderOrder = 10;
    this.additiveColor = null;
    this.color = LJS.WHITE;
    this.angle = 0;
    this.setCollision(); // make object collide
    this.renderOrder = 1; // render player on top

    // Initialize grid position
    this.snapToGrid();
  }
  snapToGrid() {
    this.setPosition(Global.snapPositionToFullGrid(this.pos));
  }

  /**
   * Attempts to start grid movement in the specified direction
   * @param direction The direction to move
   * @returns true if movement started, false if blocked
   */
  startGridMovement(direction: Global.GridDirection): boolean {
    if (this.isMoving || direction === Global.GridDirection.NONE) {
      this.pendingDirection = direction;
      return false;
    }

    const directionVector = Global.gridDirectionToVector(direction);
    const targetPos = this.pos.add(directionVector);

    // Check if movement is valid (no collision)
    if (this.canMoveTo(targetPos)) {
      this.isMoving = true;
      this.moveStartTime = LJS.time;
      this.moveStartPos = this.pos.copy();
      this.moveTargetPos = targetPos;
      this.pendingDirection = Global.GridDirection.NONE;

      console.log(
        `Starting grid movement from (${this.pos.x}, ${this.pos.y}) to (${targetPos.x}, ${targetPos.y})`
      );
      return true;
    }

    return false;
  }

  /**
   * Checks if the character can move to the specified position
   * @param targetPos The target position to check
   * @returns true if movement is valid
   */
  canMoveTo(targetPos: LJS.Vector2): boolean {
    // Override in subclasses for specific collision logic
    return true;
  }

  /**
   * Updates grid movement interpolation
   */
  updateGridMovement() {
    if (!this.isMoving) return;

    const elapsed = LJS.time - this.moveStartTime;
    const progress = Math.min(elapsed / this.moveDuration, 1);

    // Interpolate position
    const currentPos = this.moveStartPos.lerp(this.moveTargetPos, progress);
    this.pos = currentPos;

    // Check if movement is complete
    if (progress >= 1) {
      this.isMoving = false;
      this.setPosition(this.moveTargetPos); // Ensure exact final position
      this.onGridMovementComplete();

      // Process pending movement if any
      if (this.pendingDirection !== Global.GridDirection.NONE) {
        const pendingDir = this.pendingDirection;
        this.pendingDirection = Global.GridDirection.NONE;
        this.startGridMovement(pendingDir);
      }
    }
  }

  /**
   * Called when grid movement is completed
   */
  onGridMovementComplete() {
    // Override in subclasses for specific behavior
  }

  getLastPositionWithOffset(): LJS.Vector2 {
    return this.lastPosition.copy().add(Global.EngineObjectPosOffset);
  }

  update() {
    this.updateGridMovement();
    super.update();
  }
}

export class Player extends GameCharacter {
  private lastInputTime: number = 0;
  private inputCooldown: number = 0.1; // Prevent input spam

  constructor(pos: LJS.Vector2, size: LJS.Vector2 = LJS.vec2(1, 1)) {
    super(pos, size, LJS.tile(Global.TileIndex.PLAYER));
    this.setCollision(); // make object collide
    this.renderOrder = 1; // render player on top
    this.lastPosition = this.pos.copy();
    this.velocity = LJS.vec2(0, 0);
    this.moveDuration = 0.15; // Faster movement for player
  }

  /**
   * Override collision checking for player-specific logic
   */
  canMoveTo(targetPos: LJS.Vector2): boolean {
    const currentLevel = Game.CurrentLevel;
    if (!currentLevel || !currentLevel.currentRoom) {
      return false;
    }

    const doorCollision = this.checkDoorCollision(targetPos, currentLevel);
    if (doorCollision) {
      console.log('Door collision detected at position:', targetPos);
      return false;
    }

    // Check tile collision (walls)
    const tileCollision =
      currentLevel.currentRoom.wallLayer.getCollisionData(targetPos);
    if (tileCollision !== 0) {
      console.log('Wall collision detected at position:', targetPos);
      return false;
    }

    return true;
  }

  /**
   * Called when player completes a grid movement
   */
  onGridMovementComplete() {
    // Check for door collision at the new position
    const currentLevel = Game.CurrentLevel;
    if (!currentLevel || !currentLevel.currentRoom) return;

    const doorCollision = this.checkDoorCollision(this.pos, currentLevel);
    if (doorCollision) {
      console.log('Door collision detected after movement, switching rooms');
      const newPlayerPos = currentLevel.switchRoom(
        doorCollision.toRoom,
        doorCollision
      );
      this.setPosition(newPlayerPos);
      LJS.setCameraPos(this.pos);
    } else {
      LJS.setCameraPos(this.pos);
    }
  }

  update() {
    // Handle input for grid movement
    this.handleGridInput();

    // Update position logging
    if (
      this.lastPosition.x !== this.pos.x ||
      this.lastPosition.y !== this.pos.y
    ) {
      console.log('Player position:', this.pos);
      this.lastPosition = this.pos.copy();
    }

    super.update();
  } /**
   * Handles input for grid-based movement
   */
  private handleGridInput() {
    // Prevent input spam
    if (LJS.time - this.lastInputTime < this.inputCooldown) {
      return;
    }

    // Get input direction
    const moveInput = LJS.keyDirection();
    if (moveInput.length() === 0) {
      return;
    }

    // Convert to grid direction (prioritize strongest axis)
    let gridDirection: Global.GridDirection;
    if (Math.abs(moveInput.x) > Math.abs(moveInput.y)) {
      gridDirection =
        moveInput.x > 0
          ? Global.GridDirection.RIGHT
          : Global.GridDirection.LEFT;
    } else {
      gridDirection =
        moveInput.y > 0 ? Global.GridDirection.UP : Global.GridDirection.DOWN;
    }

    // Attempt to start movement
    if (this.startGridMovement(gridDirection)) {
      this.lastInputTime = LJS.time;
    }
  }

  checkDoorCollision(pos: LJS.Vector2, currentLevel: Level): Door | null {
    const room = currentLevel.currentRoom;

    // Check collision with each door in the current room
    for (const door of room.doors) {
      // Calculate distance between player position and door position
      const distance = pos.distance(door.pos);

      // If player is close enough to door (within collision distance)
      if (distance < 0.7) {
        console.log(
          `Player collided with door at ${door.pos.x}, ${door.pos.y}`
        );
        return door;
      }
    }

    return null;
  }

  getLastPositionWithOffset(): LJS.Vector2 {
    return this.lastPosition.copy().add(Global.EngineObjectPosOffset);
  }

  kill() {
    console.log('Player has died!');
    this.destroy();
  }
}
export class Enemy extends GameCharacter {
  constructor(
    pos: LJS.Vector2,
    size: LJS.Vector2 = LJS.vec2(1, 1),
    tileInfo?: LJS.TileInfo
  ) {
    super(pos, size, tileInfo || LJS.tile(Global.TileIndex.ENEMY));
    this.color = LJS.RED;
  }
}
