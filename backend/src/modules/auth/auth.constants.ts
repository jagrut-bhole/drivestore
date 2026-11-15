export const EMAIL_REGEX: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/

export const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;

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
