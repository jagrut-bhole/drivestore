import type { FastifyRequest, FastifyReply } from "fastify";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { validateData } from "@/common/utils/validateData";
import type { CreateApiKeyInput } from "./apiKey.types";
import { createApiKeySchema } from "./apiKey.schema";
import { apiKeyService } from "./apiKey.service";

export async function createApiKey(
  request: FastifyRequest<{
    Body: CreateApiKeyInput;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;
  if (!userId) {
    return ResponseHandler.sendError(reply, 404, "UserId not found!!");
  }

  const data = validateData(createApiKeySchema, request.body, reply);

  if (!data) return;

  try {
    const result = await apiKeyService.createApiKey(userId, data);

    console.log("API Create Result: ", result);

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
    return ResponseHandler.sendError(reply, 404, "UserId not found!!");
  }

  try {
    const result = await apiKeyService.getApiKey(userId);

    if (!result) return;

    console.log("Result: ", result);

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
