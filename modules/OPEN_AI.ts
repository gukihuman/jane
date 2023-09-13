class OpenAI {
  private endpoint = `https://ai.fakeopen.com/v1/chat/completions`
  private apiKey = "pk-this-is-a-real-free-pool-token-for-everyone"
  private clarifyEach = 5
  private clarificationCounter = 0
  async fetch() {
    STORE.digitalTalking = true
    if (this.clarificationCounter <= 0) {
      this.clarificationCounter = this.clarifyEach
      STORE.messages.push({
        role: "system",
        content: TEXT.clarification,
      })
    }
    this.clarificationCounter--
    STORE.messages = LIB.limitMessegesLength(STORE.messages, 1024)
    const body: AnyObject = {
      model: "gpt-3.5-turbo",
      messages: STORE.messages,
      temperature: 1,
      stream: true,
    }
    const request: AnyObject = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      method: "POST",
      body: JSON.stringify(body),
      signal: STORE.controller.signal,
    }
    let response: any = await fetch(this.endpoint, request)
    const sseStream = response.body
    const reader = sseStream.getReader()
    let accumulator = ""
    let digitalMessage = {
      role: "assistant",
      content: "",
    }
    STORE.messages.push(digitalMessage)
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
            STORE.updateChatIndex++
            STORE.updateChat = "chat" + STORE.updateChatIndex
          }
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      STORE.digitalTalking = false
      reader.releaseLock()
    }
  }
}
export const OPEN_AI = new OpenAI()
