class Local {
  localGlobal = {}
  localSettings = {}
  upsert(key: string, data) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  get(key: string) {
    const data = localStorage.getItem(key)
    if (!data) return
    return JSON.parse(data)
  }
  copyData() {
    this.localSettings = {
      inputEvents: SETTINGS.inputEvents,
      language: SETTINGS.language,
      voice: SETTINGS.voice,
    }
    this.localGlobal = {
      assistant: GLOBAL.assistant,
      mic: GLOBAL.mic,
    }
  }
  init() {
    this.copyData()
    if (this.get("global")) {
      this.localGlobal = this.get("global")
      _.forEach(this.localGlobal, (value, key) => {
        GLOBAL[key] = value
      })
    } else this.upsert("global", this.localGlobal)
    if (this.get("settings")) {
      this.localSettings = this.get("settings")
      _.forEach(this.localSettings, (value, key) => {
        SETTINGS[key] = value
      })
    } else this.upsert("settings", this.localSettings)
  }
  update() {
    setTimeout(() => {
      this.copyData()
      this.upsert("settings", this.localSettings)
      this.upsert("global", this.localGlobal)
    }, 30)
  }
}
export const LOCAL = new Local()
