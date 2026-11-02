import Fastify from "fastify";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import { globalErrorHandler } from "./middleware/error.middleware";

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
    })
  },
});

async function buildServer() {

  // Cookie-Parser usage
  fastify.register(cookie);
  
  // Helmet usage
  fastify.register(helmet);
  // CORS Configuration
  await fastify.register(cors, {
    origin: ["http:/localhost:5173"],
    credentials: true,
    maxAge: 600,
    exposedHeaders: ["Content-Length"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "x-requested-with",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // GLobal Error Handler
  fastify.setErrorHandler(globalErrorHandler);

  // Not Found Handler
  fastify.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      success: false,
      message: "Route Not Found!!",
    });
  });

  //health check-up route
  fastify.get("/health", async (_request, _reply) => {
    return {
      status: "OK!!",
      timestamp: new Date().toISOString()
    }
  });

  //welcome route
  fastify.get("/", async (_request, _reply) => {
    return {
      application: "DriveStore Backend Server",
      status: "operational",
      version: "1.0.0",
      projectStatus: process.env.PROJECT_STATUS ?? null
    }
  });

  return fastify;
}

export {
  buildServer
};
