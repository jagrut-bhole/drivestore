import type { FastifyPluginAsync } from "fastify";
import { authenticate } from "@/middleware/authenticate";

import {
  createApiKey,
  deleteAPIKey,
  getApiKey,
  getDetailedApiKeyInfo,
  rotateKey,
  updateApiKeySetting,
} from "./apiKey.controller";

import type { CreateApiKeyInput } from "./apiKey.types";
import type { RouteParamsType } from "@/types/api.types";

const apiKeyRoutes: FastifyPluginAsync = async (app) => {

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
        description: "Generates a new API key for the authenticated user.",
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
        description: "Returns all API keys belonging to the authenticated user.",
      },
    },
    getApiKey,
  );

  app.post<{
    Params: RouteParamsType;
  }>(
    "/:id/rotate",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["API_KEYS"],
        summary: "Rotate API key",
        description: "Generates a new secret and revokes the existing API key.",
      },
    },
    rotateKey,
  );

  app.delete<{
    Params: RouteParamsType;
  }>(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["API_KEYS"],
        summary: "Revoke API key",
        description:
          "Revokes an API key by setting revokedAt. The record is retained for audit history.",
      },
    },
    deleteAPIKey,
  );

  app.get<{
    Params: RouteParamsType;
  }>(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["API_KEYS"],
        summary: "Get API key details",
        description: "Returns detailed information about a specific API key.",
      },
    },
    getDetailedApiKeyInfo,
  );

  app.patch<{
    Params: RouteParamsType;
  }>(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["API_KEYS"],
        summary: "Update API key settings",
        description: "Updates the settings of an existing API key.",
      },
    },
    updateApiKeySetting,
  );
};

export default apiKeyRoutes;
