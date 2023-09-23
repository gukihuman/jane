class Lib {
  delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }
}
export const LIB = new Lib()
