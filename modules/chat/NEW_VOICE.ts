class NewVoice {
  link = ""
  async fetch() {
    const fixedLink = this.link.replace("http", "https") + "/say"
    try {
      console.log(fixedLink)
      const response = await fetch(fixedLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "my ass is yours, daddy",
        }),
      })

      if (!response.ok) {
        // Get detailed error message from the server
        const message = await response.text()
        throw new Error(message)
      }

      const blob = await response.blob()

      let audio = new Audio(URL.createObjectURL(blob))
      audio.play()
    } catch (error) {
      console.log("Error:", error)
    }
  }
}
export const NEW_VOICE = new NewVoice()
