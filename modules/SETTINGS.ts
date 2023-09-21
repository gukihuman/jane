class Settings {
  inputEvents = {
    keyboard: {
      toggleMic: "o",
      toggleRemote: "e",
    },
    mouse: {},
    gamepad: {},
  }
  language = "en-US"
  voice = "Microsoft Sonia Online (Natural) - English (United Kingdom)"
  // voice = "Microsoft Zira - English (United States)"
  emitEvents() {
    _.forEach(this.inputEvents, (settingList, device) => {
      _.forEach(settingList, (button, setting) => {
        if (INPUT[device].justPressed.includes(button)) {
          EVENTS.emitSingle(setting)
          LOCAL.update()
        }
      })
    })
  }
  init() {
    let localSettings = {
      inputEvents: this.inputEvents,
      language: this.language,
      voice: this.voice,
    }
    if (LOCAL.get("settings")) {
      localSettings = LOCAL.get("settings")
      _.forEach(localSettings, (value, key) => {
        this[key] = value
      })
    } else LOCAL.add("settings", localSettings)
    WORLD.loop.add(() => {
      this.emitEvents()
    }, "SETTINGS")
    this.addEvents()
  }
  addEvents() {
    EVENTS.onSingle("toggleLanguage", () => {
      GLOBAL.language = !GLOBAL.language
      if (GLOBAL.voices && GLOBAL.language) {
        GLOBAL.voices = false
      }
      LOCAL.update()
    })
    EVENTS.onSingle("toggleVoices", () => {
      GLOBAL.voices = !GLOBAL.voices
      if (GLOBAL.voices && GLOBAL.language) {
        GLOBAL.language = false
      }
      LOCAL.update()
    })
  }
}
export const SETTINGS = new Settings()
