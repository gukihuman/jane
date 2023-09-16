class Local {
  add(key: string, data) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  get(key: string) {
    const data = localStorage.getItem(key)
    if (!data) return
    return JSON.parse(data)
  }
  update() {
    setTimeout(() => {
      let localSettings = {
        inputEvents: SETTINGS.inputEvents,
        language: SETTINGS.language,
        voice: SETTINGS.voice,
      }
      let localGlobal = {
        remote: GLOBAL.remote,
        mic: GLOBAL.mic,
      }
      LOCAL.add("settings", localSettings)
      LOCAL.add("global", localGlobal)
    }, 30)
  }
}
export const LOCAL = new Local()
