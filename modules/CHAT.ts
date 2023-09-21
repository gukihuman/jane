class Chat {
  recognition
  update = () => GLOBAL.chatUpdateIndex++
  currentMessage
  init() {
    const w: any = window // type issues
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()
    this.addEvents(this.recognition)
    let newLine = ""
    const onSpeeachEnd = _.debounce(() => {
      GLOBAL.userTalking = false
      REMOTE.resetAbortController()
      REMOTE.fetch()
      GLOBAL.userLine = ""
      newLine = ""
    }, 1200)
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "en-US"
    if (GLOBAL.mic) this.recognition.start()
    this.recognition.onstart = () => (GLOBAL.recognizing = true)
    this.recognition.onend = () => (GLOBAL.recognizing = false)
    this.recognition.onresult = (event) => {
      REMOTE.abort()
      VOICE.stop()
      GLOBAL.userTalking = true
      onSpeeachEnd() // debounced

      let interimTranscript = ""
      const last: any = _.last(GLOBAL.messages)
      if (last.role !== "user") {
        GLOBAL.messages.push({
          role: "user",
          content: "",
        })
        this.currentMessage = GLOBAL.messages[GLOBAL.messages.length - 1]
      }
      let newMessage = false
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          interimTranscript += transcript
          GLOBAL.messages.push({
            role: "user",
            content: "",
          })
          this.currentMessage = GLOBAL.messages[GLOBAL.messages.length - 1]
          newMessage = true
        } else {
          interimTranscript += transcript
        }
      }
      if (!newMessage) {
        this.currentMessage.content = interimTranscript
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
    // setInterval(() => {
    //   if (!GLOBAL.remote) return
    //   if (Date.now() - GLOBAL.lastTimeDigitalSpeak < REMOTE.timeBeforeThinkMS) {
    //     return
    //   }
    //   if (!GLOBAL.mic || GLOBAL.digitalTalking) return
    //   if (Math.random() > 0.08) return
    //   GLOBAL.messages.push({
    //     role: "system",
    //     content: TEXT.ownThoughtsInstruction,
    //   })
    //   REMOTE.fetch()
    // }, 1000)
  }
  private addEvents(recognition) {
    EVENTS.onSingle("toggleMic", () => {
      if (GLOBAL.mic) {
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
