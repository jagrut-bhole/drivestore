import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().default(6969),

  DATABASE_URL: z.string(),

  JWT_SECRET: z.string().min(32),

  CLIENT_URL: z.string()
});

export const env = envSchema.parse(process.env);