import GukiInputController from "guki-input-controller"
export const INPUT = new GukiInputController()
import lodash from "lodash"
export const _ = lodash
export default defineNuxtPlugin(async () => {
  // example
  // await load(import.meta.glob("@/assets/**/*"), ASSETS.jsons, false, "json")
  // // important for proper sprite work
  // _.forEach(ASSETS.jsons, (value, name) => {
  //   if (value.meta && ASSETS.webps[name]) {
  //     value.meta.image = ASSETS.webps[name]
  //   }
  // })
})
async function load(
  paths,
  savePlace: AnyObject,
  addNameProperty: boolean = false,
  format: "ts" | "webp" | "json" | "md" = "ts"
) {
  for (const path in paths) {
    const name = getFileName(path, format)
    if (!name) continue
    const item = await paths[path]()
    savePlace[name] = item.default
    if (addNameProperty) item.default.name = name
  }
}
function getFileName(path: string, format: "ts" | "webp" | "json" | "md") {
  let match
  if (format === "ts") {
    match = path.match(/\/([^/]+)\.ts/)
  } else if (format === "webp") {
    match = path.match(/\/([^/]+)\.webp/)
  } else if (format === "json") {
    match = path.match(/\/([^/]+)\.json/)
  } else if (format === "md") {
    match = path.match(/\/([^/]+)\.md/)
  }
  if (!match) return
  return `${match[1]}`
}
