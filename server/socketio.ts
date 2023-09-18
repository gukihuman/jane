import { Server } from "socket.io"
import { defineNuxtModule } from "@nuxt/kit"
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook("listen", (server) => {
      const io = new Server(server)
      nuxt.hook("close", () => io.close())
      io.on("connection", (socket) => {
        console.log("Client connected: " + socket.id)
        socket.on("disconnect", () => {
          console.log("Client disconnected: " + socket.id)
        })
      })
    })
  },
})
