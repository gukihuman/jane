class Remote {
  private endpoint = process.env.OPEN_AI_ENDPOINT as string
  private apiKey = process.env.OPEN_AI_KEY as string
  private abortController = new AbortController()
  resetAbortController = () => (this.abortController = new AbortController())
  abort = () => this.abortController.abort()
  async fetch(messages: Messages) {
    const body: AnyObject = {
      model: "gpt-3.5-turbo",
      messages: messages,
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
          }
        }
      }
    } catch (e) {
    } finally {
      reader.releaseLock()
      return digitalMessage.content
    }
  }
}
export const REMOTE = new Remote()
