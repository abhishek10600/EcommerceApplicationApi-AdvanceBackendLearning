import { z } from "zod";

export const addToCartSchema = z
  .object({
    productId: z.string(),
    quantity: z.int(),
  })
  .strict();

export const updateCartItemSchema = z
  .object({
    quantity: z.number(),
  })
  .strict();

export type addToCartDTO = z.infer<typeof addToCartSchema>;
export type updateCartItemDTO = z.infer<typeof updateCartItemSchema>;
