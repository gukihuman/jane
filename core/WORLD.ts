class World {
  ticker: Ticker = new PIXI.Ticker()
  loop = {
    fps: CONFIG.maxFPS, // precisely updated each loop
    elapsedMS: 0,
    elapsedSec: 0, // switched to precise getter on init
    // switched to precise getter on init that includes delta fluctuations
    /** @returns 1/60 for 60 fps, 1/144 for 144 fps */
    deltaSec: 1 / CONFIG.maxFPS,
    /** name is used to find priority in CONFIG.process, if exists */
    add: (fn: () => void, name?: string) => {
      if (name && CONFIG && CONFIG.priority.process[name]) {
        this.ticker.add(fn, undefined, CONFIG.priority.process[name])
        return
      }
      this.ticker.add(fn)
    },
  }
  init() {
    this.ticker.start()
    const holdFrames = 20
    const lastFramesFPS: number[] = []
    this.loop.add(() => {
      lastFramesFPS.push(this.ticker.FPS)
      if (lastFramesFPS.length > holdFrames) lastFramesFPS.shift()
      this.loop.fps = _.mean(lastFramesFPS)
      this.loop.elapsedMS += this.ticker.deltaMS
    })
    Object.defineProperty(this.loop, "deltaSec", {
      get: () => {
        return this.ticker.deltaMS / 16.66 / 60
      },
    })
    Object.defineProperty(this.loop, "elapsedSec", {
      get: () => {
        return Math.floor(this.loop.elapsedMS / 1000)
      },
    })
    this.ticker.maxFPS = CONFIG.maxFPS
  }
}
export const WORLD = new World()
