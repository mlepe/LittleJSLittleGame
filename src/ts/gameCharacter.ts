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
    pos: LJS.Vector2 = LJS.vec2(0, 0),
    size: LJS.Vector2 = LJS.vec2(1, 1),
    tileInfo: LJS.TileInfo = LJS.tile(Global.TileIndex.ENEMY),
    health: number = 100,
    speed: number = 5
  ) {
    super(pos, size, tileInfo);
    this.health = health;
    this.speed = speed;
    this.renderOrder = 10;
    this.additiveColor = null;
    this.color = LJS.WHITE;
    this.angle = 0;
    this.setCollision(); // make object collide
    this.renderOrder = 1; // render player on top
    //this.tileType = Global.TileType.SOLID;
    //this.setCollision(true, false);
  }

  update() {
    /* if (this.isDead()) {
      // Handle death logic
      return super.update();
    }

    const moveInput = this.moveInput.copy();
    console.log('GameCharacter move input:', moveInput);*/

    // Simple movement logic
    /*if (this.moveInput.x !== 0 || this.moveInput.y !== 0) {
      this.position = this.position.add(this.moveInput.scale(this.speed));
    }*/

    /*const velocity = moveInput.scale(this.speed);

    this.lastPosition = this.position.copy();

    this.velocity = velocity;*/

    super.update();
  }

  /*collideWithTile(data: number, position: LJS.Vector2) {
    if (!data) return false;
    super.collideWithTile(data, position);
  }*/
}

export class Player extends GameCharacter {
  //position: LJS.Vector2;
  //size: LJS.Vector2 = LJS.vec2(1, 1);
  constructor(pos: LJS.Vector2, size: LJS.Vector2 = LJS.vec2(1, 1)) {
    super(pos, size, LJS.tile(Global.TileIndex.PLAYER));
    this.setCollision(); // make object collide
    this.renderOrder = 1; // render player on top
    //this.color = LJS.GREEN;
    //this.position = position;
    this.lastPosition = this.pos.copy();
  }

  update() {
    if (this.lastPosition != this.pos) {
      console.log('Player position:', this.pos);
    }
    // apply movement controls
    const moveInput = LJS.keyDirection().clampLength(1);
    this.velocity = this.velocity.add(moveInput);

    // move camera with player
    LJS.setCameraPos(this.pos);
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
    super(pos, size, tileInfo);
    this.color = LJS.RED;
  }
}
