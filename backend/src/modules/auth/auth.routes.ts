import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  loginController,
  logoutAllController,
  logoutController,
  registerController,
} from "./auth.controller";

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

  app.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    loginController,
  );

  app.post("/logout", logoutController);

  app.post(
    "/logout/all",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    logoutAllController,
  );
};

export default authRoutes;
