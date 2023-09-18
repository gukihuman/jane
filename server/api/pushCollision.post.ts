import { DATABASE } from "../database"
export default eventHandler(async (event) => {
  const body = await readBody(event)
  const request = {
    name: body.name,
    collisionData: body.collisionData,
  }
  return await DATABASE.pushCollision(request)
})
