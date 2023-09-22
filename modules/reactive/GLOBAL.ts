const store: AnyObject = {
  updateSettings: 0, // used as reactive dependency
  assistant: false,
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
}
export const GLOBAL = LIB.store(store)
