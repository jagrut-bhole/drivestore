import { driveCallbackSchema, driveDetailsUpsertSchema } from "./drive.schema";
import { z } from "zod";

export type DriveCallbackInput = z.infer<typeof driveCallbackSchema>
export type DriveDetailsUpsertInput = z.infer<typeof driveDetailsUpsertSchema>