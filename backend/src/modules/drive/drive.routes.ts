import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  getDriveAccount,
  driveCallback,
  driveConnect,
  driveAccountDelete,
} from "./drive.controller";
import {
  successResponse,
  errorResponse,
} from "@/common/schemas/response.schema";
import { authenticate } from "@/middleware/authenticate";
import type { DriveIdParams } from "./drive.types";

const driveRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get(
    "/connect",
    {
      preHandler: [authenticate],
    },
    driveConnect,
  );

  app.get("/callback", driveCallback);

  app.get<{
    Params: DriveIdParams;
  }>(
    "/account/:driveId",
    {
      preHandler: [authenticate],
    },
    getDriveAccount,
  );

  app.delete<{
    Params: DriveIdParams;
  }>(
    "/account/:driveId",
    {
      preHandler: [authenticate],
    },
    driveAccountDelete,
  );
};

export default driveRoutes;
