class Settings {
  inputEvents = {
    keyboard: {
      toggleMic: "o",
      toggleRemote: "e",
      toggleLanguage: "c",
      toggleVoices: "u",
    },
    mouse: {},
    gamepad: {},
  }
  language = "en-US"
  voice = "Microsoft Zira - English (United States)"
  emitEvents() {
    _.forEach(this.inputEvents, (settingList, device) => {
      _.forEach(settingList, (button, setting) => {
        if (INPUT[device].justPressed.includes(button)) {
          EVENTS.emitSingle(setting)
        }
      })
    })
  }
  init() {
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
    })
    EVENTS.onSingle("toggleVoices", () => {
      GLOBAL.voices = !GLOBAL.voices
      if (GLOBAL.voices && GLOBAL.language) {
        GLOBAL.language = false
      }
    })
  }
}
export const SETTINGS = new Settings()
