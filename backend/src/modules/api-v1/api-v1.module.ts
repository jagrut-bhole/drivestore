import type { FastifyInstance } from "fastify";

import { authModule } from "../auth/auth.module";
import { healthModule } from "../health/health.module";
import { userModule } from "../users/user.module";
import { apiKeyModule } from "../apiKey/apiKey.module";

export async function apiV1Module(app: FastifyInstance) {
  await app.register(authModule, {
    prefix: "/auth",
  });

  await app.register(healthModule, {
    prefix: "/health",
  });

  await app.register(userModule, {
    prefix: "/users",
  });

  await app.register(apiKeyModule, {
    prefix: "/api-key",
  });
}
