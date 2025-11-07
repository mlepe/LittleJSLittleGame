import * as LJS from 'littlejsengine';
import Global from './global';

export default class Player extends LJS.EngineObject {
  constructor(pos) {
    super(pos, LJS.vec2(1), LJS.tile(Global.TileIndex.PLAYER), 0, LJS.RED);
    this.setCollision(); // make object collide
    this.renderOrder = 1; // render player on top
  }

  update() {
    // apply movement controls
    const moveInput = LJS.keyDirection().clampLength(1).scale(0.2);
    this.velocity = this.velocity.add(moveInput);

    // move camera with player
    LJS.setCameraPos(this.pos);
  }
}
