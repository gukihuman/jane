// redeclare some types for GLOBAL accessability
// nuxt issue, otherwise auto-import dont work,
import { Ticker as tempTicker } from "pixi.js"
declare global {
  type Ticker = tempTicker
  type AnyObject = { [key: string]: any }
}
