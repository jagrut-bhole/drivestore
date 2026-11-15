import Fastify from "fastify";

import cookie from "@fastify/cookie";

import { corsPlugin } from "./plugins/cor.plugin";
import { helmetPlugin } from "./plugins/helmet.plugin";
import rateLimitPlugin from "./plugins/rate-limit.plugin";
import prismaPlugin from "./plugins/prisma.plugin";

import { registerSwagger } from "./common/swagger/swagger";
import { registerErrorHandler } from "./common/errors/errorHandler";
import { env } from "./config/env";

import { apiV1Module } from "./modules/api-v1/api-v1.module";
import { API_BASE_URL } from "./common/constants/api.constants";

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

  //Log every incoming request
  fastify.addHook("onRequest", async (request, reply) => {
    console.log("Incoming Request:");
    console.log("Method:", request.method);
    console.log("URL:", request.url);
    console.log("Hostname:", request.hostname);
    console.log("Protocol:", request.protocol);
    console.log(
      `Final URL: ${request.protocol}/${request.hostname}/${request.url}`,
    );
  });

  // Swagger Docs
  if (env.NODE_ENV !== "production") {
    await registerSwagger(fastify);
  }

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

  // feature modules using api-v1 Module
  await fastify.register(apiV1Module, {
    prefix: `${API_BASE_URL}`,
  });

  return fastify;
}
