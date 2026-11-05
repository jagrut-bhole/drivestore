import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { registerController } from "./auth.controller";

const authRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    "/register",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    registerController,
  );
};

export default authRoutes;
