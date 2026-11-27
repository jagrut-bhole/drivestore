import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

const rateLimitPlugin = fp(
  async (app: FastifyInstance) => {
    await app.register(rateLimit, {
      global: false,

      max: 5,
      timeWindow: "1 minute",

      errorResponseBuilder: () => ({
        success: false,
        message: "Too many requests. Please try again later.",
      }),
    });
  },
  {
    name: "rate-limit-plugin",
  },
);

export default rateLimitPlugin;
