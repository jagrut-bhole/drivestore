import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(6969),

  DATABASE_URL: z.string(),

  JWT_SECRET: z.string().min(32),

  CLIENT_URL: z.string(),

  RESEND_API_KEY: z.string(),

  RESEND_FROM_EMAIL: z.string(),

  G_DRIVE_CLIENT_ID: z.string(),

  G_DRIVE_CLIENT_SECRET: z.string(),

  G_DRIVE_REDIRECT_URI: z.string(),

  G_DRIVE_OAUTH_STATE_SECRET: z.string(),

  TOKEN_ENC_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
