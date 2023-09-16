class Voice {
  private speechSynthesis
  private utterance
  voiceData
  languages
  voices
  init() {
    this.speechSynthesis = window.speechSynthesis
    this.utterance = new SpeechSynthesisUtterance()
    this.speechSynthesis.onvoiceschanged = () => {
      this.voiceData = this.speechSynthesis.getVoices()
      const languagesArray = this.voiceData.map((voice) => voice.lang)
      const voicesArray = this.voiceData.map((voice) => voice.name)
      this.languages = [...new Set(languagesArray)]
      this.voices = [...new Set(voicesArray)]
      setTimeout(() => {
        GLOBAL.updateSettings++
      }, 1000)
    }
  }
  read(line: string) {
    this.utterance.text = line
    let desiredVoice = this.voiceData.find(
      (voice) => voice.name === SETTINGS.voice
    )
    if (desiredVoice !== undefined) {
      this.utterance.voice = desiredVoice
    }
    this.speechSynthesis.speak(this.utterance)
  }
  stop() {
    this.speechSynthesis.cancel()
  }
}
export const VOICE = new Voice()
