import { io } from "socket.io-client"
class Socket {
  io
  init() {
    this.io = io(window.location.host)
    this.io.on("connect", () => {
      console.log(`Connected to server with id: ${this.io.id}`)
    })
  }
}
export const SOCKET = new Socket()
