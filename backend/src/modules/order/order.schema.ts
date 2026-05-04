import { z } from "zod";

export const createOrderSchema = z
  .object({
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1, "At least 1 item must be there."),
      }),
    ),
  })
  .strict();

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
  })
  .strict();

export type createOrderDTO = z.infer<typeof createOrderSchema>;
export type updateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>;
