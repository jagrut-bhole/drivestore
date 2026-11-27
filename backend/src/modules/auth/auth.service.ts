import { hashPassword, verifyPassword } from "@/common/utils/password";
import { authRepositery } from "./auth.repository";
import { createSession } from "../sessions/session.service";
import type { RegisterInput, LoginInput } from "./auth.schema";
import type { AuthContext } from "./auth.types";
import { AuthError } from "@/common/errors/AppError";
import { generateToken, hashToken } from "@/common/utils/crypto";
import { SESSION_EXPIRY } from "./auth.constants";

export async function registerUserService(
  input: RegisterInput,
  context: AuthContext,
) {
  const passwordHash = await hashPassword(input.password);

  const user = await authRepositery.createUserWithCredentials({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  const { session, token } = await createSession({
    userId: user.id,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
  });

  return {
    user,
    session,
    token,
  };
}

export async function loginUserService(
  input: LoginInput,
  context: AuthContext,
) {
  const user = await authRepositery.findCredentialsAccount(input.email);
  console.log("User: ", user);

  const account = user?.accounts[0];
  if (!user || !account?.passwordHash) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AuthError("Your account is currently unavailable", 403);
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    account.passwordHash,
  );

  console.log("Password Valid: ", isPasswordValid);

  if (!isPasswordValid) {
    throw new AuthError("Invalid email or password", 401);
  }

  const { session, token } = await createSession({
    userId: user.id,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      status: user.status,
    },
    session,
    token,
  };
}

export async function revokedCurrentSession(tokenHash: string) {
  return await authRepositery.revokedSession(tokenHash);
}

export async function revokedAllSessionService(userId: string) {
  return await authRepositery.revokedAllSessions(userId);
}

export async function refreshTokenService(token: string) {
  const currentHashToken = hashToken(token);

  const now = new Date();

  const sessionCheck = await authRepositery.checkSession(token, now);

  if (!sessionCheck) {
    throw new AuthError("Invalid or Expried session!!", 401);
  }

  const newToken = generateToken();
  const newTokenHash = hashToken(newToken);

  const sessionExpiry = new Date(now.getTime() + SESSION_EXPIRY);

  const sessionRotate = await authRepositery.updateSession({
    sessionCheck,
    currentHashToken,
    now,
    newTokenHash,
    sessionExpiry,
  });

  if (sessionRotate.count !== 1) {
    throw new AuthError("Session is invalid or already refreshed", 401);
  }

  return {
    sessionCheck,
    sessionExpiry,
    newToken,
  };
}
