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
import { GameObject } from './gameObjects';
import Global from './global';
import { vec2 } from 'littlejsengine';

export class GameCharacter extends GameObject {
  health: number;
  speed: number;
  moveInput: LJS.Vector2 = LJS.vec2(0, 0);
  lastPosition: LJS.Vector2 = LJS.vec2(0, 0);

  constructor(
    position: LJS.Vector2 = LJS.vec2(0, 0),
    size: LJS.Vector2 = LJS.vec2(1, 1),
    health: number = 100,
    speed: number = 5
  ) {
    super(position, size);
    this.health = health;
    this.speed = speed;
    this.renderOrder = 10;
    //this.tileType = Global.TileType.SOLID;
    this.setCollision(true, false);
  }

  update() {
    if (this.isDead()) {
      // Handle death logic
      return super.update();
    }

    const moveInput = this.moveInput.copy();
    console.log('GameCharacter move input:', moveInput);

    // Simple movement logic
    /*if (this.moveInput.x !== 0 || this.moveInput.y !== 0) {
      this.position = this.position.add(this.moveInput.scale(this.speed));
    }*/

    /*const velocity = moveInput.scale(this.speed);

    this.lastPosition = this.position.copy();

    this.velocity = velocity;*/

    super.update();
  }

  collideWithTile(data: number, position: LJS.Vector2) {
    if (!data) return false;
    super.collideWithTile(data, position);
  }

  render() {
    LJS.drawTile(
      this.position,
      this.size,
      this.tileInfo,
      this.color,
      this.angle,
      this.mirror
    );
    super.render();
  }
}

export class Player {
  position: LJS.Vector2;
  size: LJS.Vector2 = LJS.vec2(1, 1);
  constructor(position: LJS.Vector2) {
    /*super(
      position,
      LJS.vec2(1, 1),
      LJS.tile(position, Global.TileSize, Global.TileIndex.PLAYER)
    );*/
    this.position = position;
  }

  update() {
    // Handle player-specific input
    /*this.moveInput = LJS.keyDirection();
    console.log('Player move input:', this.moveInput);
    console.log('Calling super.update() from Player');*/
    //super.update();
  }
  render() {
    LJS.drawTile(
      this.position,
      this.size,
      LJS.tile(this.position, Global.TileSize, 3, 0)
    );
    // Additional rendering for the player
  }

  kill() {
    console.log('Player has died!');
    //super.kill();
  }
}
export class Enemy extends GameCharacter {
  constructor(position: LJS.Vector2) {
    super(position, LJS.vec2(1, 1));
    this.color = LJS.RED;
  }
  render() {
    super.render();
    // Additional rendering for the enemy
  }
}
