import { readFile, readdir, writeFile } from "fs/promises"
import { resolve } from "path"
import { REMOTE } from "./REMOTE"
import { PROMPTS } from "./PROMPTS"
import { SETTINGS } from "./SETTINGS"
async function adjustDescriptions(descriptions, io) {
  let response
  try {
    response = await REMOTE.fetch([
      {
        role: "system",
        content: PROMPTS.adjustDescriptions(descriptions),
      },
    ])
  } catch (error) {
    io.emit("log", `❌ adjust descriptions, start again...`)
    await adjustDescriptions(descriptions, io)
  }
  return response
}
async function describeFile(filePath, io) {
  const cleanFilePath = filePath.replace(SETTINGS.basePath, "")
  io.emit("log", `✎ ${cleanFilePath}`)
  let response
  try {
    const fileContents = await readFile(filePath, "utf-8")
    response = await REMOTE.fetch([
      {
        role: "system",
        content: PROMPTS.describeFile(cleanFilePath, fileContents),
      },
    ])
    io.emit("log", `✔ ${cleanFilePath}`)
  } catch (error) {
    io.emit("log", `❌ ${cleanFilePath}`)
    await describeFile(filePath, io)
  }
  return response
}
class Socket {
  io
  descriptions: any[] = []
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
      const dirents = await readdir(directory, {
        withFileTypes: true,
      })
      for (const dirent of dirents) {
        const filePath = resolve(directory, dirent.name)
        if (dirent.isDirectory()) {
          this.descriptions.push(await this.describeDirectories([filePath]))
        } else {
          this.descriptions.push(await describeFile(filePath, this.io))
        }
      }
      if (root) {
        this.descriptions = this.descriptions.filter((el) => el) // no undefined
        let descriptions = this.descriptions.join("\n---\n")
        this.io.emit("log", `✎📄 ${cleanDirectory}.txt`)
        descriptions = await adjustDescriptions(this.descriptions, this.io)
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
}
export const SOCKET = new Socket()
