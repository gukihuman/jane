import { Server } from "socket.io"
import { defineNuxtModule } from "@nuxt/kit"
import { SOCKET } from "./modules/SOCKET"
import _ from "lodash"
export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook("listen", (server) => {
      const io = new Server(server)
      nuxt.hook("close", () => io.close())
      io.on("connection", (socket) => {
        SOCKET.io = socket
        // Attach each function of the SOCKET as an event listener
        Object.getOwnPropertyNames(Object.getPrototypeOf(SOCKET)).forEach(
          (key) => {
            if (typeof SOCKET[key] === "function" && key !== "constructor") {
              socket.on(key, SOCKET[key].bind(SOCKET))
            }
          }
        )
      })
    })
  },
})
