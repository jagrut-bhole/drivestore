import type { FastifyPluginAsync, FastifyInstance } from "fastify";
import { authenticate } from "@/middleware/authenticate";
import { createApiKey, getApiKey } from "./apiKey.controller";
import { createApiKeySchema } from "./apiKey.schema";
import type { CreateApiKeyInput } from "./apiKey.types";
import {
  successResponse,
  errorResponse,
} from "@/common/schemas/response.schema";

const apiKeyRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post<{
    Body: CreateApiKeyInput;
  }>(
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

        // response: {
        //   201: successResponse({
        //     type: "object",
        //     properties: {
        //       apiKey: 
        //     },
        //     required: ["apiKey"],
        //   }),

        //   400: errorResponse({
        //     $ref: "commonSwaggerSchemas#/ErrorDetails",
        //   }),

        //   500: errorResponse({
        //     $ref: "commonSwaggerSchemas#/ErrorDetails",
        //   }),
        // },
      },
    },
    createApiKey,
  );

  app.get(
    "/all",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["API_KEYS"],
        summary: "Get all API keys",
        description: "Returns all API keys belonging to the authenticated user",
      },
    },
    getApiKey,
  );
};

export default apiKeyRoutes;
