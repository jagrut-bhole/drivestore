import type { FastifyRequest, FastifyReply } from "fastify";
import { loginInputSchema, registerInputSchema } from "./auth.schema";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { authService } from "./auth.service";
import { validateData } from "@/common/utils/validateData";
import { clearSessionCookie, setSessionCookie } from "@/common/utils/cookie";
import { AuthError } from "@/common/errors/AppError";
import { SESSION_COOKIE_NAME } from "./auth.constants";
import { hashToken } from "@/common/utils/crypto";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = request.body;

  const data = validateData(registerInputSchema, body, reply);

  if (!data) return;

  try {
    const result = await authService.registerUser(data, {
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    setSessionCookie(reply, result.token);

    return ResponseHandler.sendSuccess(
      reply,
      201,
      "Account created successfully!!",
      {
        user: result.user,
        session: result.session,
      },
    );
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

  const data = validateData(loginInputSchema, body, reply);

  if (!data) return;

  try {
    const result = await authService.loginUser(data, {
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

      await authService.revokedCurrentSession(tokenHash);

      clearSessionCookie(reply);

      return ResponseHandler.sendSuccess(
        reply,
        200,
        "Logged out successfull!!",
      );
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
  try {
    const userId = request.auth?.id;

    if (!userId) {
      return ResponseHandler.sendError(reply, 401, "Invalid Access!!");
    }

    await authService.revokedAllSession(userId);

    clearSessionCookie(reply);

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "All devices logout successfully!!",
    );
  } catch (error: unknown) {
    request.log.error(error);

    return ResponseHandler.sendError(
      reply,
      500,
      "Failed to logout from all devices",
    );
  }
}

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  const currentToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!currentToken) {
    return ResponseHandler.sendError(reply, 401, "Session token is required!!");
  }

  try {
    const { sessionCheck, sessionExpiry, newToken } =
      await authService.refreshToken(currentToken);

    setSessionCookie(reply, newToken);

    return ResponseHandler.sendSuccess(
      reply,
      200,
      "Session Refreshed Successfully!!",
      {
        token: newToken,
        session: {
          id: sessionCheck.id,
          userId: sessionCheck.userId,
          expiresAt: sessionExpiry,
        },
      },
    );
  } catch (error) {
    return ResponseHandler.sendError(reply, 400, "Unable to Update token!!");
  }
}
