class Lib {
  delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }
  truncateWords(inputString, wordLimit) {
    const words = inputString.split(/\s+/)

    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."
    } else {
      return inputString
    }
  }
}
export const LIB = new Lib()
