export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    SOCKET.init()
    WORLD.init()
    VOICE.init()
    REMOTE.init()
    EVENTS.init()
    SETTINGS.init()
    INPUT.init()
    CHAT.init()
    GLOBAL.init()
    WORLD.loop.add(() => {
      INPUT.update()
    })
  }
})
