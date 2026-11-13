export const commonSwaggerSchemas = {
  $id: "commonSwaggerSchemas",
  ErrorDetails: {
    type: "object",
    properties: {
      code: { type: "string" },
      details: { type: "string" },
    },
  },
} as const;
