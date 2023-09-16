const store: AnyObject = {
  chatUpdateIndex: 0, // used as reactive dependency
  updateSettings: 0, // same
  remote: false,
  mic: false,
  language: false,
  voices: false,
  userTalking: false,
  digitalTalking: false,
  recognizing: true,
  userLine: "",
  messages: [
    {
      role: "system",
      content: TEXT.systemMessage,
    },
  ],
  lastTimeDigitalSpeak: Date.now(),
  init() {
    let localGlobal = {
      remote: this.remote,
      mic: this.mic,
    }
    if (LOCAL.get("global")) {
      localGlobal = LOCAL.get("global")
      _.forEach(localGlobal, (value, key) => {
        this[key] = value
      })
    } else LOCAL.add("global", localGlobal)
  },
}
export const GLOBAL = LIB.store(store)
