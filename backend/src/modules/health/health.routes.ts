import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { getHealth, getLiveness, getReadiness } from "./health.controller";

const healthRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get(
    "/",
    getHealth
  );

  app.get(
    "/live",
    getLiveness
  )

  app.get(
    "/ready",
    getReadiness
  )
}

export default healthRoutes;