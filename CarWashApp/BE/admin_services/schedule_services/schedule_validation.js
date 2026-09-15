import { z } from "zod";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/);

export const scheduleSchema = z
  .array(
    z.object({
      Day: z.string().trim().min(1).max(20),
      OpenTime: timeSchema,
      CloseTime: timeSchema,
      Notes: z.string().trim().max(255).optional().default(""),
    }),
  )
  .min(1)
  .max(31);
