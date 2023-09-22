export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    SOCKET.init()
    WORLD.init()
    VOICE.init()
    CONFIG.init()
    ASSISTANT.init()
    EVENTS.init()
    SETTINGS.init()
    INPUT.init()
    LOCAL.init()
    RECOGNITION.init()
    WORLD.loop.add(() => {
      INPUT.update()
    })
  }
})
