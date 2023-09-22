class Recognition {
  private sendDelay = 2000
  speech
  currentMessage
  completeTranscript = ""
  sendMessageDebounced = _.debounce(() => {
    if (!GLOBAL.assistant) return
    GLOBAL.userTalking = false
    ASSISTANT.resetAbortController()
    ASSISTANT.say()
    this.completeTranscript = ""
    this.addMessage()
  }, this.sendDelay)
  init() {
    const w: any = window // type issues
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition
    this.speech = new SpeechRecognition()
    this.speech.interimResults = true
    this.speech.onstart = () => (GLOBAL.recognitinActive = true)
    this.speech.onend = () => {
      GLOBAL.recognitinActive = false
      setTimeout(() => {
        // rarely might be active by the interval
        if (GLOBAL.mic && !GLOBAL.recognitionActive) {
          try {
            this.speech.start()
          } catch (e) {}
        }
      }, 5)
    }
    this.speech.onresult = (event) => {
      ASSISTANT.abort()
      GLOBAL.userTalking = true
      let transcript = event.results[0][0].transcript
      const lastMessage: any = _.last(GLOBAL.messages)
      if (lastMessage.role !== "user") this.addMessage()
      this.currentMessage.content = this.completeTranscript + " " + transcript
      if (event.results[0].isFinal) {
        this.completeTranscript += " " + transcript
      }
      this.sendMessageDebounced()
      CHAT.update()
    }
    setInterval(() => {
      if (!GLOBAL.mic || GLOBAL.recognitinActive) return
      try {
        this.speech.start()
      } catch (e) {}
    }, 200)
    EVENTS.onSingle("toggleMic", () => {
      if (GLOBAL.mic) {
        this.speech.stop()
        GLOBAL.recognitinActive = false
        GLOBAL.mic = false
      } else {
        try {
          this.speech.start()
        } catch (e) {}
        GLOBAL.recognitinActive = true
        GLOBAL.mic = true
      }
    })
  }
  addMessage() {
    GLOBAL.messages.push({
      role: "user",
      content: "",
    })
    this.currentMessage = GLOBAL.messages[GLOBAL.messages.length - 1]
  }
}
export const RECOGNITION = new Recognition()
