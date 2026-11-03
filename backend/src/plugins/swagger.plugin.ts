import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export async function swaggerPlugin(
  app: FastifyInstance
) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "DriveStore API",
        description: "DriveStore Backend API: Automatically generated OPENAPI Documentation",
        version: "1.0.0"
      }
    }
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs"
  })
}