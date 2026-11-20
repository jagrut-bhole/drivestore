import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { getMe } from "./users.controller";
import { authenticate } from "@/middleware/authenticate";

const userRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get(
    "/me",
    {
      preHandler: [authenticate],
    },
    getMe
  )
}

export default userRoutes;