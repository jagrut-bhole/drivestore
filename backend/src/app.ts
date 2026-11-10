import Fastify from "fastify";

import cookie from "@fastify/cookie";
import { corsPlugin } from "./plugins/cor.plugin";
import { helmetPlugin } from "./plugins/helmet.plugin";
import rateLimitPlugin from "./plugins/rate-limit.plugin";
import { swaggerPlugin } from "./plugins/swagger.plugin";

import { registerErrorHandler } from "./common/errors/errorHandler";
import { env } from "./config/env";

// Routes
import authRoutes from "./modules/auth/auth.routes";
import healthRoutes from "./modules/health/health.routes";
import prismaPlugin from "./plugins/prisma.plugin";

export async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      ...(process.env.NODE_ENV !== "production" && {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }),
    },
  });

  // Prisma Plugin usage
  await fastify.register(prismaPlugin);

  // Cookie-Parser usage
  await fastify.register(cookie);

  // Helmet usage
  await helmetPlugin(fastify);

  // CORS Configuration
  await corsPlugin(fastify);

  // Rate-Limit usage
  await rateLimitPlugin(fastify);

  // GLobal Error Handler
  registerErrorHandler(fastify);

  // Not Found Handler
  fastify.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      success: false,
      message: "Route Not Found!!",
      error: {
        code: "ROUTE_NOT_FOUND",
      },
      data: null,
    });
  });

  //Swagger Docs
  if (env.NODE_ENV !== "production") {
    await swaggerPlugin(fastify);
  }

  //health check-up route
  fastify.get("/health", async (_request, _reply) => {
    return {
      status: "OK!!",
      timestamp: new Date().toISOString(),
    };
  });

  //welcome route
  fastify.get("/", async (_request, _reply) => {
    return {
      application: "DriveStore Backend Server",
      status: "operational",
      version: "1.0.0",
      projectStatus: process.env.PROJECT_STATUS ?? null,
    };
  });

  // feature modules
  await fastify.register(authRoutes, {
    prefix: "/api/v1/auth",
  });

  await fastify.register(healthRoutes, {
    prefix: "/api/v1/health",
  });

  return fastify;
}
