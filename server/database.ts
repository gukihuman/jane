import Prisma from "@prisma/client"
const { PrismaClient } = Prisma
const prisma = new PrismaClient()
export interface Request {
  name: string
  collisionData: string
}
class Database {
  // a prisma example function, currently connected to mongodb
  pushCollision = async (request: Request) => {
    try {
      let res: any = await prisma.collision.upsert({
        where: {
          name: request.name,
        },
        update: {
          collisionData: request.collisionData,
        },
        create: {
          name: request.name,
          collisionData: request.collisionData,
        },
      })
      res = res || "not found"
      return res
    } catch (err) {
      return err
    }
  }
}
export const DATABASE = new Database()
