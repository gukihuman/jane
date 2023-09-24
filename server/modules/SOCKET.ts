import { readFile, readdir, writeFile } from "fs/promises"
import { resolve } from "path"
import { REMOTE } from "./REMOTE"
import { PROMPTS } from "./PROMPTS"
import { SETTINGS } from "./SETTINGS"
import { LIB } from "./LIB"
import vectorArray from "../data/descriptionsVectors.json"
class Socket {
  io
  descriptions: any[] = []
  async adjustDescriptions(descriptions) {
    let response
    try {
      response = await REMOTE.fetchOpenAi([
        {
          role: "system",
          content: PROMPTS.adjustDescriptions(descriptions),
        },
      ])
    } catch (error) {
      this.io.emit("log", `❌ adjust descriptions, start again...`)
      await this.adjustDescriptions(descriptions)
    }
    return response
  }
  async describeFile(filePath) {
    const cleanFilePath = filePath.replace(SETTINGS.basePath, "")
    this.io.emit("log", `✎ ${cleanFilePath}`)
    let response
    try {
      const fileContents = await readFile(filePath, "utf-8")
      response = await REMOTE.fetchOpenAi([
        {
          role: "system",
          content: PROMPTS.describeFile(cleanFilePath, fileContents),
        },
      ])
    } catch (error) {
      this.io.emit("log", `❌ ${cleanFilePath}`)
      await this.describeFile(filePath)
    }
    return response
  }
  async describeDirectories(directories?) {
    let root = false
    if (!directories) {
      directories = SETTINGS.directories.map((element) => {
        return SETTINGS.basePath + "\\" + element
      })
      root = true
    }
    for (const directory of directories) {
      let regex = /[^\\]*$/
      let cleanDirectory = directory.match(regex)[0]
      const dirents = await readdir(directory, { withFileTypes: true })
      for (const dirent of dirents) {
        const filePath = resolve(directory, dirent.name)
        if (dirent.isDirectory()) {
          this.descriptions.push(await this.describeDirectories([filePath]))
        } else {
          this.descriptions.push(await this.describeFile(filePath))
        }
      }
      if (root) {
        this.descriptions = this.descriptions.filter((el) => el) // no undefined
        let descriptions = this.descriptions.join("\n---\n")
        this.io.emit("log", `✎📄 ${cleanDirectory}.txt`)
        descriptions = await this.adjustDescriptions(this.descriptions)
        await writeFile(
          `./server/data/descriptions/${cleanDirectory}.txt`,
          descriptions,
          "utf-8"
        )
        this.io.emit("log", `✔📄 ${cleanDirectory}.txt`)
        this.descriptions = []
      }
    }
  }
  async parseDescriptionFile(filePath) {
    const fileContents = await readFile(filePath, "utf-8")
    return fileContents
      .split("\n")
      .filter((content) => content !== "") // Ignore empty lines
      .map((content) => {
        const [path, ...descriptionParts] = content.split(": ")
        const description = descriptionParts.join(": ")
        return { path, description }
      })
  }
  async updateVectors() {
    this.io.emit("log", `✎📄 descriptionsVectors.json`)
    const directory = ".\\server\\data\\descriptions"
    const dirents = await readdir(directory, { withFileTypes: true })
    const descriptionsVectors: any[] = []
    for (const dirent of dirents) {
      const filePath = resolve(directory, dirent.name)
      const vectorsArray = await this.parseDescriptionFile(filePath)
      const length = vectorsArray.length
      this.io.emit("log", `✎ ${dirent.name} (${length}) ~${length / 2}min`)
      for (const vector of vectorsArray) {
        const filledVector: any = vector
        const response = await REMOTE.fetchCohereVector(vector.description)
        filledVector.embedding = response.embeddings[0]
        descriptionsVectors.push(filledVector)
        this.io.emit("log", `✎ ${filledVector.path}`)
        await LIB.delay(31_000) // cohere limits 2 requests per minute
      }
    }
    await writeFile(
      "./server/data/descriptionsVectors.json",
      JSON.stringify(descriptionsVectors, null, 2)
    )
    this.io.emit("log", `✔📄 descriptionsVectors.json`)
  }
  async upsertVectors() {
    this.io.emit("log", `✎ upsertVectors`)
    for (const vector of vectorArray) await REMOTE.upsertPineconeVector(vector)
    this.io.emit("log", `✔ upsertVectors`)
  }
  async queryRelevantFiles(text) {
    this.io.emit("log", `✎ queryRelevantFiles`)
    const cohereResponse = await REMOTE.fetchCohereVector(text)
    if (cohereResponse.message) {
      this.io.emit("log", "❌ cohere limit exceeded (2 per min)")
      return
    }
    const embedding = cohereResponse.embeddings[0]
    const pineconeResponse = await REMOTE.queryPineconeVector(embedding)
    const filePaths = pineconeResponse.matches.map((file) => file.id)
    this.io.emit("filePaths", filePaths)
    this.io.emit("log", filePaths)
  }
}
export const SOCKET = new Socket()
