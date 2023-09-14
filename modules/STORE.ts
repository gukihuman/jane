const store: AnyObject = {
  // controller: {},
  mic: true,
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
  updateChatIndex: 0,
  updateChat: "chat0",
  lastTimeDigitalSpeak: Date.now(),
}

export const STORE = LIB.store(store)
