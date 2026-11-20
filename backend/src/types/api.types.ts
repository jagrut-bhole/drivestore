import { z } from "zod";

export const RouteParams = z.object({
  id: z.uuid()
});

export type RouteParamsType = z.infer<typeof RouteParams>