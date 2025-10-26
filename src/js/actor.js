/*
import render from './../../node_modules/dom-serializer/lib/esm/index.d';
 * File: actor.js
 * Project: testproj
 * File Created: Sunday, 26th October 2025 6:18:44 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 26th October 2025 6:18:44 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
export default class Actor {
  constructor(tile) {
    this.tile = tile;
    this.position = tile.position;
  }

  init() {
    // Initialize actor properties here
  }

  update() {
    // Update actor logic here
  }

  render() {
    this.tile.render();
  }

  destroy() {}
}
