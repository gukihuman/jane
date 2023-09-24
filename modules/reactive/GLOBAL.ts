const store: AnyObject = {
  filePaths: [],
  // chat
  chat: false,
  updateSettings: 0, // used as reactive dependency
  assistant: false,
  mic: false,
  language: false,
  voices: false,
  userTalking: false,
  digitalTalking: false,
  messages: [
    {
      role: "system",
      content: PROMPTS.systemMessage,
    },
  ],
}
export const GLOBAL = LIB.store(store)
