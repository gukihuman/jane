class Remote {
  timeBeforeThinkMS = 38_000
  private endpoint = `https://ai.fakeopen.com/v1/chat/completions`
  private apiKey = "pk-this-is-a-real-free-pool-token-for-everyone"
  private clarifyEach = 5
  private clarificationCounter = 5
  private superShortInstructionChance = 0.3
  private abortController = new AbortController()
  resetAbortController = () => (this.abortController = new AbortController())
  init() {
    const api = useRuntimeConfig().OPEN_AI_KEY
    // console.log(api)
    EVENTS.onSingle("toggleRemote", () => {
      if (GLOBAL.remote) {
        GLOBAL.remote = false
        this.abort()
      } else GLOBAL.remote = true
    })
  }
  abort = () => this.abortController.abort()
  async fetch() {
    if (!GLOBAL.remote) return
    GLOBAL.digitalTalking = true
    if (this.clarificationCounter <= 0) {
      this.clarificationCounter = this.clarifyEach
      GLOBAL.messages.push({
        role: "system",
        content: TEXT.clarification,
      })
    }
    this.clarificationCounter--
    if (Math.random() < this.superShortInstructionChance) {
      GLOBAL.messages.push({
        role: "system",
        content: TEXT.superShortInstruction,
      })
    }

    GLOBAL.messages = LIB.limitMessegesLength(GLOBAL.messages, 4096)
    const body: AnyObject = {
      model: "gpt-3.5-turbo",
      messages: GLOBAL.messages,
      temperature: 1.5,
      stream: true,
    }
    const request: AnyObject = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      method: "POST",
      body: JSON.stringify(body),
      signal: this.abortController.signal,
    }
    let response: any = await fetch(this.endpoint, request)
    const sseStream = response.body
    const reader = sseStream.getReader()
    let accumulator = ""
    let digitalMessage = {
      role: "assistant",
      content: "",
    }
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
            REFS.chat.scrollTop = REFS.chat.scrollHeight
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
      console.log(cleanContent)
      VOICE.read(cleanContent)
    }
  }
}
export const REMOTE = new Remote()
