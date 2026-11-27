import type { FastifyRequest, FastifyReply } from "fastify";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { validateData } from "@/common/utils/validateData";
import type { CreateApiKeyInput } from "./apiKey.types";
import { createApiKeySchema, updateApiSchema } from "./apiKey.schema";
import { apiKeyService } from "./apiKey.service";
import type { RouteParamsType } from "@/types/api.types";

export async function createApiKey(
  request: FastifyRequest<{
    Body: CreateApiKeyInput;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  const data = validateData(createApiKeySchema, request.body, reply);

  if (!data) return;

  try {
    const result = await apiKeyService.createApiKey(userId, data);

    return ResponseHandler.sendSuccess(
      reply,
      201,
      "Api Key created successfully!!",
      result,
    );
  } catch (error: unknown) {
    request.log.error(error);
    if (error instanceof Error) {
      if (error.message === "API_KEY_LIMIT_REACHED") {
        return ResponseHandler.sendError(
          reply,
          409,
          "Maximum API key limit reached!!",
        );
      }
      if (error.message === "BUCKET_NOT_FOUND") {
        return ResponseHandler.sendError(
          reply,
          404,
          "Selected Bucket not found!!",
        );
      }
    }
    return ResponseHandler.sendError(
      reply,
      500,
      "Failed to create the API key!!",
    );
  }
}

export async function getApiKey(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  try {
    const result = await apiKeyService.getAllApiKey(userId);

    if (!result) return;

    return ResponseHandler.sendSuccess(
      reply,
      200,
      result.length ? "API keys fetched successfully!!" : "No API Keys found!!",
      result,
    );
  } catch (error: unknown) {
    request.log.error(error);

    return ResponseHandler.sendError(
      reply,
      500,
      "Unable to process the request!!",
    );
  }
}

export async function rotateKey(
  request: FastifyRequest<{
    Params: RouteParamsType;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 404, "USER_ID missing!!");
  }

  const { id } = request.params;

  if (!id) {
    return ResponseHandler.sendError(reply, 404, "API_ID missing!!");
  }

  try {
    const result = await apiKeyService.rotateApiKey(userId, id);

    if (!result) return;

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "API Key revoked successfully!!",
      result,
    );
  } catch (error: unknown) {
    request.log.error(error);

    if (error instanceof Error) {
      if (error.message === "API_KEY_NOT_FOUND") {
        return ResponseHandler.sendError(
          reply,
          404,
          "Request API Key not found!!",
        );
      }
    }

    return ResponseHandler.sendError(
      reply,
      500,
      "Unable to process the request!!",
    );
  }
}

export async function deleteAPIKey(
  request: FastifyRequest<{
    Params: RouteParamsType;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  const { id } = request.params;

  if (!id) {
    return ResponseHandler.sendError(reply, 404, "API_ID missing!!");
  }

  try {
    await apiKeyService.deleteApiKey(userId, id);

    return ResponseHandler.sendSuccess(
      reply,
      204,
      "API Key deleted successfully!!",
    );
  } catch (error: unknown) {
    request.log.error(error);

    if (error instanceof Error) {
      if (error.message === "API_KEY_NOT_FOUND") {
        return ResponseHandler.sendError(reply, 404, "API key not found!!");
      }
    }
  }

  return ResponseHandler.sendError(
    reply,
    500,
    "Unable to complete the request!!",
  );
}

export async function getDetailedApiKeyInfo(
  request: FastifyRequest<{
    Params: RouteParamsType;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  const { id } = request.params;

  if (!id) {
    return ResponseHandler.sendError(reply, 404, "API_ID missing");
  }

  try {
    const result = await apiKeyService.getDetailedApiInfo(userId, id);

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "API Key information fetched successfully!!",
      result,
    );
  } catch (error: unknown) {
    request.log.error(error);
    if (error instanceof Error) {
      if (error.message === "API_KEY_NOT_FOUND") {
        return ResponseHandler.sendError(
          reply,
          404,
          "Requested API KEY not found!!",
        );
      }
    }
  }

  return ResponseHandler.sendError(
    reply,
    500,
    "Unable to process the request!!",
  );
}

export async function updateApiKeySetting(
  request: FastifyRequest<{
    Params: RouteParamsType;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  const { id } = request.params;

  const data = validateData(updateApiSchema, request.body, reply);

  if (!data) return;

  try {
    const result = await apiKeyService.updateApiKey(userId, id, data);

    request.log.info({ apiKeyId: id }, "API key settings updated");

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "API KEY setting updated successfully!!",
      result,
    );
  } catch (error: unknown) {
    request.log.error(
      { err: error, apiKeyId: id },
      "Failed to update API key settings",
    );
    if (error instanceof Error && error.message === "API_KEY_NOT_FOUND") {
      return ResponseHandler.sendError(reply, 404, "API key not found");
    }
  }

  return ResponseHandler.sendError(reply, 500, "Unable to process request!!");
}
