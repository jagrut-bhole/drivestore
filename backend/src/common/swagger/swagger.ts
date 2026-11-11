import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { commonSwaggerSchemas } from "./swagger.schema";

export async function registerSwagger(fastify: FastifyInstance) {
  // Register shared schemas so $ref: "commonSwaggerSchemas#/ErrorDetails"
  // (used in auth route responses) can be resolved when building the
  // serialization/validation schema for each endpoint.
  fastify.addSchema(commonSwaggerSchemas);

  await fastify.register(swagger, {
    openapi: {
      openapi: "3.0.3",

      info: {
        title: "My Backend API",
        description: "Complete API documentation",
        version: "1.0.0",
      },

      servers: [
        {
          url: "http://localhost:3000",
          description: "Development",
        },
      ],

      components: {
        schemas: {
          ErrorDetails: commonSwaggerSchemas.ErrorDetails,
        },
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/documentation",

    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      filter: true,
      displayRequestDuration: true,
      persistAuthorization: true,
    },

    staticCSP: true,
  });
}
