import type { FastifyReply, FastifyRequest } from "fastify";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { validateData } from "@/common/utils/validateData";
import { driveService } from "./drive.service";
import type { DriveCallbackInput, DriveIdParams } from "./drive.types";
import { driveCallbackSchema, driveIdParamsSchema } from "./drive.schema";

export async function driveConnect(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 404, "Unauthorized");
  }

  try {
    const result = await driveService.driveConnection(userId);

    console.log("Authorization URL:", result);

    return ResponseHandler.sendSuccess(
      reply,
      201,
      "Authorization URL generated successfully!!",
      { url: result },
    );
  } catch (error: unknown) {
    request.log.error(error);
    if (error instanceof Error) {
      if (error.message === "LIMIT_REACHED") {
        return ResponseHandler.sendError(reply, 409, "Account limit reached!!");
      }
    }
  }
  return ResponseHandler.sendError(reply, 500, "Internal Server Error");
}

export async function driveCallback(
  request: FastifyRequest<{
    Body: DriveCallbackInput;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  const data = validateData(driveCallbackSchema, request.body, reply);

  if (!data) return;

  try {
    const result = await driveService.driveCallback({
      code: data.code,
      state: data.state,
      userId: userId!,
    });

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "Google Drive connected successfully!",
      result,
    );
  } catch (error) {
    request.log.error(error);

    if (error instanceof Error) {
      switch (error.message) {
        case "INVALID_STATE":
          return ResponseHandler.sendError(
            reply,
            400,
            "Invalid or expired OAuth state",
          );

        case "NO_REFRESH_TOKEN":
          return ResponseHandler.sendError(
            reply,
            400,
            "Unable to obtain refresh token",
          );

        case "DRIVE_SCOPE_NOT_GRANTED":
          return ResponseHandler.sendError(
            reply,
            403,
            "Google Drive permission was not granted",
          );

        case "DRIVE_LINKED_TO_ANOTHER_USER":
          return ResponseHandler.sendError(
            reply,
            409,
            "This Google Drive account is already linked to another user",
          );

        default:
          break;
      }
    }

    return ResponseHandler.sendError(reply, 500, "Internal Server Error");
  }
}

export async function getDriveAccount(
  request: FastifyRequest<{
    Params: DriveIdParams;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  const params = validateData(driveIdParamsSchema, request.params, reply);

  if (!params) return;

  try {
    const result = await driveService.getDriveAccount(userId, params.driveId);

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "Account Details fetched successfully",
      result,
    );
  } catch (error) {
    request.log.error(error);

    if (error instanceof Error && error.message === "DRIVE_ACCOUNT_NOT_FOUND") {
      return ResponseHandler.sendError(reply, 404, "Drive Account no found");
    }
    return ResponseHandler.sendError(
      reply,
      500,
      "Unable to fetch Drive account",
    );
  }
}

export async function driveAccountDelete(
  request: FastifyRequest<{
    Params: DriveIdParams;
  }>,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Unauthorized");
  }

  const params = validateData(driveIdParamsSchema, request.params, reply);

  if (!params) return;

  try {
    const result = await driveService.disconnectDriveAccount(
      userId,
      params.driveId,
    );

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "Google Drive disconnected successfully",
      result,
    );
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error && error.message === "DRIVE_ACCOUNT_NOT_FOUND") {
      return ResponseHandler.sendError(reply, 404, "Drive account not found");
    }

    return ResponseHandler.sendError(
      reply,
      500,
      "Unable to disconnect Drive account",
    );
  }
}
