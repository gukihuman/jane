class Voice {
  private speechSynthesis
  private utterance
  private voices
  init() {
    this.speechSynthesis = window.speechSynthesis
    this.utterance = new SpeechSynthesisUtterance()
    this.speechSynthesis.onvoiceschanged = () => {
      this.voices = this.speechSynthesis.getVoices()
    }
  }
  read(line: string) {
    this.utterance.text = line
    console.log(this.voices)
    if (this.voices.length > 300) {
      this.utterance.voice = this.voices[117]
    }
    this.speechSynthesis.speak(this.utterance)
  }
  stop() {
    this.speechSynthesis.cancel()
  }
}
export const VOICE = new Voice()
