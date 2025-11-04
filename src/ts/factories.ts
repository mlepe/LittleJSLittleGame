/*
 * File: factories.ts
 * Project: testproj
 * File Created: Friday, 31st October 2025 12:05:36 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Friday, 31st October 2025 12:05:36 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2021  - 2025 Matthieu LEPERLIER, Nomad Solutions
 */
import * as LJS from 'littlejsengine';
import Entity, { EntityTypes } from './entity';
import Tile from './tile';
import Utils from './utils';

class Factory {
  static createEntity(entityType: EntityTypes, position?: LJS.Vector2): Entity {
    switch (entityType) {
      case Entity.EntityTypes.PLAYER:
        return new Entity(
          0,
          position,
          LJS.vec2(1, 1),
          LJS.vec2(1, 1),
          0,
          16,
          0,
          LJS.WHITE,
          true,
          true,
          true,
          true,
          Entity.EntityTypes.PLAYER
        );
      case EntityTypes.ENEMY:
        return new Entity(
          0,
          position,
          LJS.vec2(1, 1),
          LJS.vec2(1, 1),
          0,
          16,
          0,
          LJS.WHITE,
          false,
          true,
          true,
          true,
          EntityTypes.ENEMY
        );
      // Add more cases for other entity types as needed
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }
}
