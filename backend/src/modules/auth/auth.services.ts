import { hashPassword } from "@/common/utils/password";
import {
  createUserWithCredential,
  findCredentialsAccount,
  revokedAllSessions,
} from "./auth.repository";
import { createSession } from "../sessions/session.service";
import type { RegisterInput, LoginInput } from "./auth.schema";
import type { AuthContext } from "./auth.types";
import { AuthError } from "@/common/errors/AppError";

export async function registerUserService(
  input: RegisterInput,
  context: AuthContext,
) {
  const passwordHash = await hashPassword(input.password);

  const user = await createUserWithCredential({
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
  const user = await findCredentialsAccount(input.email);

  if (!user || !user.accounts[0]?.passwordHash) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AuthError("Your account is currently unavailable", 403);
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

export async function revokedAllSessionService(userId: string) {
  
  return await revokedAllSessions(userId);
  
}
