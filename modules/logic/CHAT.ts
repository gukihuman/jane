const chat = {
  updateIndex: 0,
  update: () => {
    CHAT.updateIndex++
    REFS.chat.scrollTop = REFS.chat.scrollHeight
  },
}
export const CHAT = LIB.store(chat)
