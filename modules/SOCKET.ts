import { io } from "socket.io-client"
class Socket {
  io
  init() {
    this.io = io(window.location.host)
    this.io.on("log", (string) => {
      console.log(string)
    })
  }
}
export const SOCKET = new Socket()
