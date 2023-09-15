class Settings {
  inputEvents = {
    keyboard: {
      turnMic: "o",
    },
    mouse: {},
    gamepad: {},
  }
  gameplay = {}
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
  }
}
export const SETTINGS = new Settings()
