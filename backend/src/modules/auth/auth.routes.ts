import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  loginController,
  logoutAllController,
  logoutController,
  registerController,
} from "./auth.controller";
import {
  successResponse,
  errorResponse,
} from "@/common/schemas/response.schema";
import { authenticate } from "@/middleware/authenticate";
import { userSchema, sessionSchema } from "./auth.schema";

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
      schema: {
        tags: ["AUTH"],
        summary: "Register a new user",
        description: "Create a new user account",

        response: {
          201: successResponse({
            type: "object",
            properties: {
              user: userSchema,
              session: sessionSchema,
            },
            required: ["user", "session"],
          }),

          400: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),

          500: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),
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
      schema: {
        tags: ["AUTH"],
        summary: "Login a existing user",
        description: "Signin a user account",

        response: {
          201: successResponse({
            type: "object",
            properties: {
              user: userSchema,
              session: sessionSchema,
            },
            required: ["user", "session"],
          }),

          400: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),

          500: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),
        },
      },
    },
    loginController,
  );

  app.post(
    "/logout",
    {
      schema: {
        tags: ["AUTH"],
        summary: "Logout an account",
        description: "Clearing an sinle session",

        response: {
          200: successResponse({
            type: "object",
            properties: null,
          }),

          400: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),

          500: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),
        },
      },
    },
    logoutController,
  );

  app.post(
    "/logout/all",
    {
      preHandler: [authenticate],
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
      schema: {
        tags: ["AUTH"],
        summary: "Logout an account",
        description: "Clearing an sinle session",

        response: {
          200: successResponse({
            type: "object",
            properties: null,
          }),

          400: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),

          500: errorResponse({
            $ref: "commonSwaggerSchemas#/ErrorDetails",
          }),
        },
      },
    },
    logoutAllController,
  );
};

export default authRoutes;