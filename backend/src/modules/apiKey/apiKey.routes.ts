import type { FastifyPluginAsync, FastifyInstance } from "fastify";
import { authenticate } from "@/middleware/authenticate";
import { createApiKey } from "./apiKey.controller";

const apiKeyRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    "/create",
    {
      preHandler: [authenticate],
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
      schema: {
        tags: ["API_KEYS"],
        summary: "Create a new API key",
        description: "Generates a new API key for the authenticated user",
      },
    },
    createApiKey,
  );
};

export default apiKeyRoutes;