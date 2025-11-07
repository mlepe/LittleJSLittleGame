# Copilot Instructions for LittleJS Game Project

## Project Overview

This is a 2D tile-based game built with **LittleJS engine** using TypeScript and Webpack. The game features a hierarchical room-based level system with entity management and dual coordinate systems.

## Architecture

### Core Game Loop (`src/index.ts`)

- Entry point follows LittleJS pattern: `gameInit()`, `gameUpdate()`, `gameRender()`, `gameRenderPost()`
- Main game instance: `Game(800, 600, 16, vec2(1,1), [Tileset], 48, 21)`
- Environment tiles predefined in `ENV_TILES` constant with collision properties

### Game Structure (`src/ts/game.ts`)

- **Game class**: Central coordinator with static properties used globally
  - `Game.GameSize`, `Game.GameScale`, `Game.TileSize` - accessed throughout codebase
  - `Game.Entities[]` - static array for collision detection across all entities
- **Timer-based updates**: 0.06s intervals for input handling (not frame-based)
- **Debug mode**: `debugMode = true` renders HUD with position/room data and minimap

### Level-Room Hierarchy (`src/ts/level.ts`, `src/ts/room.ts`)

- **Levels**: Container for 2D `roomsMap[][]` grid with automatic door generation
- **Room types**: `EMPTY(0)`, `NORMAL(1)`, `START(2)`, `END(3)` defined as enum
- **Room layout**: Each room has 11x9 tile grid with walls=1, floors=0
- **Door creation**: Automatic between adjacent non-empty rooms using cardinal directions
- **Room switching**: `level.switchRoom()` redraws tile layers and repositions player to room center

### Dual Coordinate System (`src/ts/utils.ts`)

- **Standard coordinates**: LittleJS engine coordinates (Y+ = up)
- **Game coordinates**: Flipped Y-axis (Y+ = down) for room grid indexing
- **Key functions**: `gvec2(vec)` flips Y, `convertToGvec2(size, vec)` converts positions
- Critical for room positioning: `position` vs `gPosition` on entities

### Entity System (`src/ts/entity.ts`)

- **Inheritance**: Extends `LJS.EngineObject` with game-specific properties
- **Dual positioning**: Both `position` and `gPosition` maintained automatically
- **Entity types**: `PLAYER`, `ENEMY`, `NPC`, `DOOR` enum for collision handling
- **Collision detection**: `checkCollisionWithEntityAtPosition()` iterates `Game.Entities[]`
- **Rendering**: Each entity wraps a `Tile` class for sprite rendering

## Development Workflows

### Build Commands

```bash
npm run serve    # Development with hot reload
npm run build    # Production webpack build
npm run rebuild  # Clean reinstall and build
```

### Asset Pipeline

- **Import**: `import Tileset from './assets/img/16x16/file.png'`
- **Register**: Pass to `engineInit()` as array: `[Tileset]`
- **Reference**: Use tile index (e.g., 24-31 for NPCs, 444 for doors, 637 for walls)
- **Types**: PNG/JPG handled by file-loader, declared in `src/custom.d.ts`

### Debugging Patterns

```typescript
// Enable visual debugging
game.debugMode = true; // Shows HUD + minimap

// Visual debugging helpers
LJS.drawRect(position, size, color);
LJS.drawTextScreen(text, position, size);
```

## Key Implementation Patterns

### Room Door Creation

```typescript
// Doors auto-created between adjacent rooms
if (y > 0 && this.roomsMap[y - 1][x] != null) {
  room.createDoor(room.up, Utils.CardinalDirection.UP);
}
// Door position = room center on appropriate edge
```

### Movement with Dual Collision

```typescript
// Check both tile and entity collisions
let collidesWithTile = LJS.tileCollisionGetData(player.position.add(direction));
let collidesWithEntity = player.checkCollisionWithEntityAtPosition(newPos);

// Handle entity collision by type
switch (collidesWithEntity?.other?.entityType) {
  case Entity.EntityTypes.DOOR:
    // Room transition logic
    break;
}
```

### Tile Layer Management

```typescript
// Build room with collision data
this.tileLayer.setData(pos, new LJS.TileLayerData(tileId));
this.tileLayer.setCollisionData(pos, isSolid); // 0=passable, 1=solid, 2=special

// Redraw when switching rooms
room.tileLayer.redraw();
```

## Common Modification Tasks

### Adding Entity Types

1. Add to `EntityTypes` enum in `entity.ts`
2. Handle in `game.handleInput()` collision switch
3. Add to `Game.Entities[]` for collision detection
4. Set appropriate `tileId` for sprite (ranges: 24-31 NPCs, 444 doors, 637 walls)

### Level Layout Changes

- Modify `DEFAULT_LEVEL_LAYOUT` 2D array in `level.ts`
- Room types: 0=empty, 1=normal, 2=start, 3=end
- Doors auto-generate between adjacent non-zero rooms

### Door System Debugging

**Critical Issues Fixed:**

- Door entities must be added to `Game.Entities[]` for collision detection
- Entity collision uses `position.distance()` not `==` for Vector2 comparison
- Doors must be `isSolid = true` to trigger collision detection
- Door positions use room-local coordinates (0-10, 0-8 for 11x9 rooms)
- Tile collision data for doors should be set to `0` (passable) in room tile layer

**Common Door Problems:**

- Doors not showing: Check `room.render()` is called in `game.render()`
- Doors not triggering: Verify entity added to `Game.Entities[]` and `isSolid = true`
- Wrong room transitions: Check `gDirection` calculation and `roomsMap` indexing
- Doors in all directions: Ensure `roomsMap` array indices match level layout and null values are set properly
- Door misalignment: Check door position calculation against room size and tile boundaries (use `size - 1` for edges)
- Door positioning offset: EngineObject uses center-based coordinates, add 0.5 to tile positions for proper alignment
- Wrong door connections: Ensure proper null checking in roomsMap array access with bounds validation

### File Header Standard

All `.ts` files include standardized header with file path, creation date, author (Matthieu LEPERLIER), and copyright notice.
