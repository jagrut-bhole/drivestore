import type { FastifyRequest, FastifyReply } from "fastify";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { userPofile, userService } from "./users.service";
import { validateData } from "@/common/utils/validateData";
import { updateProfileSchema } from "./users.schema";

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 400, "UserID not found!!");
  }

  try {
    const result = await userPofile(userId);

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "UserProfile Fetched successfully!!",
      result,
    );
  } catch (error: unknown) {
    request.log.error(error);
  }
}

export async function updateMe(request: FastifyRequest, reply: FastifyReply) {
  const parsed = validateData(updateProfileSchema, request.body, reply);

  if (!parsed) return;

  try {
    const userId = request.auth?.id;

    if (!userId) {
      return ResponseHandler.sendError(reply, 400, "UserId not found!!");
    }

    const user = await userService.updateProfile(userId, parsed);

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "Profile Updated successfully!!",
      {
        user,
      },
    );
  } catch (error) {
    request.log.error(error);
    
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return ResponseHandler.sendError(reply, 404, "User not found!!");
      }
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return ResponseHandler.sendError(reply, 409, "Email Already Exists!!");
      }
    }
  }

  return ResponseHandler.sendError(reply, 500, "Something went wrong!!");
}
