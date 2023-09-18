class Prompts {
  describeFile(filePath, content) {
    return `
    Describe given file, mentioning the path starting from "spirit-of-lira" on the first separate line then give a paragraph of description:
    Example:
    FilePath: "\\systems\\motion\\move.ts"
    FileContent:
    export default class {
      private preventGamepadMoveMS = 500 // disable axes after start track
      // used to not prevent gamepad move after kill, updates on mobs killed by hero
      lastMobKilledMS = 0
      private gamepadAxesMoved = false
      init() {
        EVENTS.onSingle("moveOrCast1", () => {
          if (WORLD.hoverId) {
            EVENTS.emitSingle("cast1")
            EVENTS.emitSingle("lockTarget")
          } else this.mouseMove()
        })
        EVENTS.onSingle("mouseMove", () => this.mouseMove())
        EVENTS.onSingle("gamepadMove", () => this.gamepadMove())
        EVENTS.onSingle("autoMouseMove", () => {
          GLOBAL.autoMouseMove = !GLOBAL.autoMouseMove
        })
      }
      process() {
        if (GLOBAL.context === "scene") return
        WORLD.entities.forEach((entity, id) => {
          if (!entity.move) return
          this.move(entity)
        })
        if (GLOBAL.autoMouseMove) EVENTS.emitSingle("mouseMove")
        this.checkGamepadAxes()
      }
      private checkGamepadAxes() {
        if (LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone)) {
          this.gamepadAxesMoved = true
        } else {
          // first time not moved
          if (this.gamepadAxesMoved && INPUT.lastActiveDevice === "gamepad") {
            WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
          }
          this.gamepadAxesMoved = false
        }
      }
      mouseMove() {
        if (GLOBAL.context !== "world") return
        WORLD.hero.state.track = false
        WORLD.hero.state.cast = false
        WORLD.hero
        const distance = COORDINATES.distance(
          COORDINATES.conterOfScreen(),
          COORDINATES.mouseOfScreen()
        )
        if (distance < 10) {
          WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
          return
        }
        WORLD.hero.move.finaldestination = COORDINATES.mousePosition()
      }
      private gamepadMoveTries = 0
      gamepadMove() {
        const elapsedMS = WORLD.loop.elapsedMS
        if (
          WORLD.hero.state.active === "track" &&
          elapsedMS < WORLD.hero.state.lastChangeMS + this.preventGamepadMoveMS &&
          elapsedMS > this.lastMobKilledMS + this.preventGamepadMoveMS
        ) {
          return
        }
        WORLD.hero.state.track = false
        WORLD.hero.state.cast = false
        this.gamepadMoveTries = 0
        this.gamepadMoveLogic()
      }
      private gamepadMoveLogic(otherRatio = 1) {
        if (!WORLD.hero) return
        const speedPerTick = COORDINATES.speedPerTick(WORLD.hero)
        const axesVector = COORDINATES.vector(
          INPUT.gamepad.axes[0],
          INPUT.gamepad.axes[1]
        )
        const angle = axesVector.angle
        let ratio = axesVector.distance
        ratio = _.clamp(ratio, 1)
        const vectorToFinalDestination = COORDINATES.vectorFromAngle(
          angle,
          speedPerTick * WORLD.loop.fps * 2
        )
        const hero = WORLD.hero
        const possibleDestinationX =
          hero.position.x + vectorToFinalDestination.x * ratio * otherRatio
        const possibleDestinationY =
          hero.position.y + vectorToFinalDestination.y * ratio * otherRatio
        if (
          !COORDINATES.isWalkable(possibleDestinationX, possibleDestinationY) &&
          GLOBAL.collision
        ) {
          this.gamepadMoveTries++
          if (this.gamepadMoveTries > 100) return
          if (this.gamepadMoveTries > 3) {
            this.gamepadMoveLogic(otherRatio - 0.1)
          }
          this.gamepadMoveLogic(otherRatio + 0.1)
          return
        }
        hero.move.finaldestination.x = possibleDestinationX
        hero.move.finaldestination.y = possibleDestinationY
        this.gamepadAxesMoved = true
      }
      private canMove(entity) {
        if (
          !entity.move ||
          !entity.state ||
          !entity.move.destination ||
          !entity.move.finaldestination
        ) {
          return false
        }
        if (entity.state.active === "cast" || entity.state.active === "dead") {
          return false
        }
        return true
      }
      move(entity: Entity) {
        if (!this.canMove(entity)) return
        const speedPerTick = COORDINATES.speedPerTick(entity)
        const displacement = COORDINATES.vectorFromPoints(
          entity.position,
          entity.move.destination
        )
        const finaldisplacement = COORDINATES.vectorFromPoints(
          entity.position,
          entity.move.finaldestination
        )
        const finaldistance = finaldisplacement.distance
        const distance = displacement.distance
        if (distance < speedPerTick) {
          return
        }
        if (entity.attack && entity.target.tracked) {
          const targetEntity = WORLD.entities.get(entity.target.id)
          if (
            targetEntity &&
            finaldistance < targetEntity.size.width / 2 + entity.attack.distance
          ) {
            return
          }
        }
        let ratio = _.clamp(finaldistance / 200, 1)
        ratio = Math.sqrt(ratio)
        ratio = _.clamp(ratio, 0.3, 1)
        if (WORLD.hero.state.track) ratio = 1
        const angle = displacement.angle
        const velocity = COORDINATES.vectorFromAngle(angle, speedPerTick)
        entity.position.x += velocity.x * ratio
        entity.position.y += velocity.y * ratio
      }
    }
    Your response:
    FilePath: "\\systems\\motion\\move.ts"
    Description: This file defines a class for managing character movements in a game. It provides mechanisms for different types of movement, including those driven by the mouse, gamepad, and automated motion. The class not only covers different modes of navigation but also handles different interaction events and states of the game. The critical functions like mouseMove and gamepadMove define how the hero character moves in response to mouse or gamepad inputs, while process method applies these movements to the game world. Moreover, there is built-in functionality for limiting certain actions, like movement during gamepad interactions.
    Now your task:
    FilePath:
    ${filePath}
    FileContent:
    ${content}
    Your response:
    `
  }
  adjustDescriptions(content) {
    return `
    Adjust those descriptions, removing repetetive information in the format of one consice paragraph of text:
    Example:
    Given description:
    FilePath: "\\core\load.ts"
    Description: This file appears to be a TypeScript module responsible for loading various resources and data for a game or application. It imports several external libraries and modules, including GukiInputController for input handling, Pixi.js for graphics rendering, Pixi-filters for graphical filters, and lodash for utility functions. The module defines a default Nuxt plugin function that asynchronously loads various resources and data, such as entities, components, systems, items, skills, scenes, and assets, from different file paths using dynamic imports and stores them in corresponding data structures. It also performs format-specific processing for certain resources, such as webp and json files, and ensures proper sprite work by linking meta information with associated webp images. The load function iterates through provided paths, extracts resource names based on the specified format, and populates the savePlace object with the loaded resources, optionally adding name properties to items if required. Overall, this module serves as an essential part of resource loading and management in the application.
    ---
    FilePath: "core\\start.ts"
    Description: This TypeScript file is a crucial part of a game engine, responsible for initializing and starting the game. It begins by importing necessary modules, including one from "vitest/dist/index-40ebba2b". The file defines a default export, which is an asynchronous function that takes an 'app' argument. Inside this function, the app's lifecycle hook "app:mounted" is used to call the 'startApp' function.

    The 'startApp' function handles various game setup tasks. It first checks for the existence of a viewport and logs a warning if it's not found. Then, it sets the 'devMode' based on a cookie value and initializes the game configuration. Afterward, it initializes the game world, creates a hero character, and initializes various game systems and components such as events, settings, local storage, inventory, interfaces, effects, and more.

    Additionally, the file includes event listeners for context menu events, initializes certain static game entities, and sets a timeout to handle loading transitions.

    The 'setupSystems' function is defined to handle the setup of game systems. It iterates through a sorted list of system names, instantiates the corresponding system classes, and initializes and processes them asynchronously. Systems are added to the game loop to ensure their continuous execution during gameplay.

    Overall, this file serves as the entry point for starting the game and orchestrates the initialization of various game systems and components to provide a complete gaming experience.
    ---
    FilePath: "\\core\\WORLD.ts"
    Description: This file defines a TypeScript class named "World" that appears to be a core component of a game engine or application. The class is responsible for managing various aspects of the game world, including entities, rendering layers, and the game loop. Here is a breakdown of its key features:

    - The class includes properties like "app" (representing the PIXI Application), "entities" (a map of game entities), and "systems" (an object for system management).

    - It defines the "loop" property, which contains information about the game loop, such as frames per second (fps), elapsed milliseconds, and delta time. It also provides a method for adding functions to the game loop.

    - The "init" method initializes the game world, creating the PIXI Application, setting up rendering layers (map, ground, sortable, collision), and configuring the game loop.

    - There is a private "loopSetup" method that handles FPS calculation and delta time.

    - The class exports an instance of itself as "WORLD."

    Overall, this file sets up the foundational structure for a game world within a larger game or application, including rendering and loop management.
    Your adjusted description:
    core\\load.ts: This TypeScript module orchestrates the loading of game or app resources. It leverages external libraries for input handling, graphics, and utility functions. The module defines a Nuxt plugin function that loads entities such as components, systems, items, skills, scenes, and assets from various file paths and stores them. It also supports format-specific processing for resources and ensures proper linking of sprites and meta information.

    core\\start.ts: This TypeScript file is pivotal to a game engine's functionality, handling initialization and game start. The file includes a function that leverages the 'app:mounted' lifecycle hook of an app argument to start the game. It checks for a viewport, initializes game configurations, the game world, and character creation. It also manages game systems and components like events, settings, local storage, among others. A setup function is included to handle the arrangement of game systems.

    core\\WORLD.ts: This TypeScript class, 'World', manages salient aspects of a game world, such as entities, rendering layers, and game loop. It contains properties like 'app', 'entities', and 'systems'. The class defines the 'loop' property for game loop information and a method for adding functions to it. It features an 'init' method that initializes the game world and a private 'loopSetup' for handling FPS calculation and delta time. The class exports an instance of itself, 'WORLD', adding structure to a game world within a larger game or app, including rendering and loop management.
    Now, adjust these:
    Description:
    ${content}
    Your adjusted description:
    `
  }
}
export const PROMPTS = new Prompts()
