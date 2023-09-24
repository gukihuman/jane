import { SOCKET } from "./SOCKET"
class Remote {
  private openAiEndpoint = process.env.OPEN_AI_ENDPOINT as string
  private openAiKey = process.env.OPEN_AI_KEY as string
  private cohereEndpoint = process.env.COHERE_ENDPOINT as string
  private cohereKey = process.env.COHERE_KEY as string
  private pineconeEndpoint = process.env.PINECONE_ENDPOINT as string
  private pineconeKey = process.env.PINECONE_KEY as string
  private abortController = new AbortController()
  resetAbortController = () => (this.abortController = new AbortController())
  abort = () => this.abortController.abort()
  async fetchOpenAi(messages: Messages) {
    const body: AnyObject = {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      stream: true,
    }
    const request: AnyObject = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAiKey}`,
      },
      method: "POST",
      body: JSON.stringify(body),
      signal: this.abortController.signal,
    }
    let response: any = await fetch(this.openAiEndpoint, request)
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
  async fetchCohereVector(text: string) {
    const body: AnyObject = {
      texts: [text],
      model: "embed-multilingual-v2.0",
    }
    const request: AnyObject = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.cohereKey}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    }
    const response = await fetch(this.cohereEndpoint, request)
    const data = await response.json()
    return data
  }
  async upsertPineconeVector(vector: Vector) {
    const body: AnyObject = {
      vectors: [{ values: vector.embedding, id: vector.path }],
    }
    const request: AnyObject = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Api-Key": `${this.pineconeKey}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    }
    const response = await fetch(
      this.pineconeEndpoint + "/vectors/upsert",
      request
    )
    const data = await response.json()
    return data
  }
  async queryPineconeVector(embedding: number[]) {
    const body: AnyObject = {
      vector: embedding,
      topK: 15,
      includeValues: false,
      includeMetadata: false,
    }
    const request: AnyObject = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Api-Key": `${this.pineconeKey}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    }
    const response = await fetch(this.pineconeEndpoint + "/query", request)
    const data = await response.json()
    return data
  }
}
export const REMOTE = new Remote()
