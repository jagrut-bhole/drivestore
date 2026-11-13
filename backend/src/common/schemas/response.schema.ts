
import type { FastifySchema } from "fastify";

type JsonSchema = Record<string, any>;

export function successResponse(
  dataSchema: JsonSchema = {}
) {
  return {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        const: true,
      },
      message: {
        type: "string",
      },
      error: {
        type: "null",
      },
      data: dataSchema,
    },
    required: ["success", "message", "error", "data"],
  };
}

export function errorResponse(
  errorSchema: JsonSchema = {}
) {
  return {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        const: false,
      },
      message: {
        type: "string",
      },
      error: errorSchema,
      data: {
        type: "null",
      },
    },
    required: ["success", "message", "error", "data"],
  };
}

export function paginatedResponse(
  itemSchema: JsonSchema = {}
) {
  return successResponse({
    type: "object",
    properties: {
      items: {
        type: "array",
        items: itemSchema,
      },
      pagination: {
        type: "object",
        properties: {
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" },
          totalPages: { type: "integer" },
        },
        required: ["page", "limit", "total", "totalPages"],
      },
    },
    required: ["items", "pagination"],
  });
}