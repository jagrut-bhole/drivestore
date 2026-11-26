import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  driveAccount,
  driveCallback,
  driveConnect,
  driveAccountDelete,
} from "./drive.controller";
import {
  successResponse,
  errorResponse,
} from "@/common/schemas/response.schema";
import { authenticate } from "@/middleware/authenticate";

const driveRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get(
    "/connect",
    {
      preHandler: [authenticate],
    },
    driveConnect,
  );
};

export default driveRoutes;
