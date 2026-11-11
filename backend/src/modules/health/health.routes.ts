import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { getHealth, getLiveness, getReadiness } from "./health.controller";

const healthRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Health"],
        summary: "Get Overall system health",
        description: "Checks the application and database health.",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string" },
              uptime: { type: "number" },
              version: { type: "string" },
              environment: { type: "string" },
              
            },
          },
        },
      },
    },
    getHealth,
  );

  app.get("/live", getLiveness);

  app.get("/ready", getReadiness);
};

export default healthRoutes;
