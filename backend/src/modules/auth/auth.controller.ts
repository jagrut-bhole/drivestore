import type { FastifyRequest, FastifyReply } from "fastify";
import { loginSchema, registerSchema } from "./auth.schema";
import { ResponseHandler } from "@/common/utils/responseHandler";
import {
  loginUserService,
  registerUserService,
  revokedAllSessionService,
} from "./auth.service";
import { validateData } from "@/common/utils/validateData";
import { clearSessionCookie, setSessionCookie } from "@/common/utils/cookie";
import { AuthError } from "@/common/errors/AppError";
import { SESSION_COOKIE_NAME } from "@/common/constants/auth.constants";
import { hashToken } from "@/common/utils/crypto";
import { revokedSession } from "./auth.repository";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = request.body;

  const data = validateData(registerSchema, body, reply);

  if (!data) return;

  try {
    const result = await registerUserService(data, {
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    setSessionCookie(reply, result.token);

    return ResponseHandler.sendSuccess(reply, 201, "Account created successfully!!", {
      user: result.user,
      session: result.session,
    });
  } catch (error: unknown) {
    request.log.error(error);

    const prismaError = error as {
      code?: string;
      meta?: {
        target?: string[];
      };
    };

    if (
      prismaError.code === "P2002" &&
      prismaError.meta?.target?.includes("email")
    ) {
      return ResponseHandler.sendError(
        reply,
        409,
        "An account with this email already exists",
      );
    }
    return ResponseHandler.sendError(reply, 500, "Unable to create account");
  }
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = request.body;

  const data = validateData(loginSchema, body, reply);

  if (!data) return;

  try {
    const result = await loginUserService(data, {
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    setSessionCookie(reply, result.token);

    return ResponseHandler.sendSuccess(reply, 200, "Login Successfull!!", {
      user: result.user,
      session: result.session,
    });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return ResponseHandler.sendError(reply, error.statusCode, error.message);
    }

    request.log.error(error);

    return ResponseHandler.sendError(reply, 500, "Unable to Login!!");
  }
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token = request.cookies[SESSION_COOKIE_NAME];

    if (token) {
      const tokenHash = hashToken(token);

      await revokedSession(tokenHash);

      clearSessionCookie(reply);

      return ResponseHandler.sendSuccess(reply, 200, "Logged out successfull!!");
    }

    return ResponseHandler.sendError(reply, 401, "No active session found");
  } catch (error: unknown) {
    request.log.error(error);

    return ResponseHandler.sendError(reply, 500, "Logout failed");
  }
}

export async function logoutAllController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 401, "Invalid Access!!");
  }

  await revokedAllSessionService(userId);

  clearSessionCookie(reply);

  return ResponseHandler.sendSuccess(reply, 200, "All devices logout successfully!!");
}
