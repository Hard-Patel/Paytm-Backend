import { z } from "zod";

export const transferFundsSchema = z.object({
  fund: z.number().min(1),
  to: z.number(),
});