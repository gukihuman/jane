class Assistant {
  private abortController = new AbortController()
  resetAbortController = () => (this.abortController = new AbortController())
  init() {
    EVENTS.onSingle("toggleAssistant", () => {
      if (GLOBAL.assistant) {
        GLOBAL.assistant = false
        this.abort()
      } else GLOBAL.assistant = true
    })
  }
  abort = () => this.abortController.abort()
  async say() {
    if (!GLOBAL.assistant) return
    GLOBAL.digitalTalking = true
    GLOBAL.messages = LIB.limitMessegesLength(GLOBAL.messages, 4096)
    const request = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.OPEN_AI_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: GLOBAL.messages,
        temperature: 1.5,
        stream: true,
      }),
      signal: this.abortController.signal,
    }
    let response: any = await fetch(CONFIG.OPEN_AI_ENDPOINT, request)
    const sseStream = response.body
    const reader = sseStream.getReader()
    let accumulator = ""
    let digitalMessage = {
      role: "assistant",
      content: "",
    }
    GLOBAL.messages.pop()
    GLOBAL.messages.push(digitalMessage)
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulator += new TextDecoder("utf-8").decode(value)
        while (accumulator.includes("\n\n")) {
          const eventEnd = accumulator.indexOf("\n\n")
          const event = accumulator.slice(0, eventEnd)
          accumulator = accumulator.slice(eventEnd + 2)
          if (event.startsWith("data: ")) {
            const jsonStr = event.slice("data: ".length).trim()
            let data
            try {
              data = JSON.parse(jsonStr)
            } catch (e) {}
            if (!data) continue
            let messageToAdd
            if (data.choices[0].delta.content) {
              messageToAdd = data.choices[0].delta.content
            }
            if (!messageToAdd) continue
            digitalMessage.content += messageToAdd
            CHAT.update()
          }
        }
      }
    } catch (e) {
    } finally {
      GLOBAL.digitalTalking = false
      setTimeout(() => {
        REFS.chat.scrollTop = REFS.chat.scrollHeight
      }, 10)
      reader.releaseLock()
      let cleanContent = digitalMessage.content.replace(
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
        ""
      )
      VOICE.read(cleanContent)
    }
  }
}
export const ASSISTANT = new Assistant()
