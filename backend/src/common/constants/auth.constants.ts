export const SESSION_COOKIE_NAME = "app_session";

export const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days

export const SESSION_DURATION_MS = SESSION_DURATION * 1000;

export const VERIFICATION_TOKEN_DURATION = 15 * 60; // 15 minutes

export const PASSWORD_RESET_TOKEN_DURATION = 15 * 60; // 15 minutes

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
