const store: AnyObject = {
  chatUpdateIndex: 0, // used as reactive dependency
  updateSettings: 0, // same
  remote: false,
  mic: true,
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
}
export const GLOBAL = LIB.store(store)
