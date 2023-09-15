import userConfig from "@/guki.config"
class GukiConfig {
  /** merge user config with default config */
  constructor() {
    if (!userConfig) return
    _.forEach(userConfig, (value, key) => {
      if (this[key] && typeof this[key] === "object") {
        this[key] = _.merge(this[key], value)
      } else {
        this[key] = value
      }
    })
  }
  maxFPS = 60
  priority = {
    process: {},
  }
}
export const CONFIG = new GukiConfig()
