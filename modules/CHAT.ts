class Chat {
  recognition
  update = () => GLOBAL.chatUpdateIndex++
  init() {
    const w: any = window // type issues
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()
    this.addEvents(this.recognition)
    let newLine = ""
    const onSpeeachEnd = _.debounce(() => {
      GLOBAL.userTalking = false
      REMOTE.resetAbortController()
      GLOBAL.messages.push({
        role: "system",
        content: TEXT.eachTimeInstruction,
      })
      REMOTE.fetch()
      GLOBAL.userLine = ""
      newLine = ""
    }, 1200)
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "en-US"
    this.recognition.start()
    this.recognition.onstart = () => (GLOBAL.recognizing = true)
    this.recognition.onend = () => (GLOBAL.recognizing = false)
    this.recognition.onresult = (event) => {
      REMOTE.abort()
      VOICE.stop()
      GLOBAL.userTalking = true
      onSpeeachEnd()

      let interimTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          GLOBAL.messages.push({
            role: "user",
            content: transcript,
          })
        } else {
          interimTranscript += transcript
        }
      }

      // Update latest user message or GLOBAL.userLine with interimTranscript
      const lastUserMessage = GLOBAL.messages
        .filter((message) => message.role === "user")
        .pop()
      if (lastUserMessage) {
        lastUserMessage.content = interimTranscript
      } else {
        GLOBAL.userLine = interimTranscript
      }

      this.update()
      REFS.chat.scrollTop = REFS.chat.scrollHeight
    }
    setInterval(() => {
      if (GLOBAL.recognizing || !GLOBAL.mic) return
      try {
        this.recognition.start()
      } catch (e) {}
    }, 200)
    setInterval(() => {
      if (Date.now() - GLOBAL.lastTimeDigitalSpeak < REMOTE.timeBeforeThinkMS) {
        return
      }
      if (!GLOBAL.mic || GLOBAL.digitalTalking) return
      if (Math.random() > 0.08) return
      GLOBAL.messages.push({
        role: "system",
        content: TEXT.ownThoughtsInstruction,
      })
      REMOTE.fetch()
    }, 1000)
  }
  private addEvents(recognition) {
    EVENTS.onSingle("toggleMic", () => {
      if (GLOBAL.recognizing) {
        recognition.stop()
        GLOBAL.recognizing = false
        GLOBAL.mic = false
      } else {
        recognition.start()
        GLOBAL.recognizing = true
        GLOBAL.mic = true
      }
    })
  }
}
export const CHAT = new Chat()
