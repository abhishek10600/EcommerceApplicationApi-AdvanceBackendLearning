import { z } from "zod";

export const createCategorySchema = z
  .object({
    categoryName: z
      .string()
      .min(2, "Category name must be at least 2 characters long"),
    categoryDescription: z
      .string()
      .min(2, "Category description must be at least 2 characters long."),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    categoryName: z
      .string()
      .min(2, "Category name must be at least 2 charcters long")
      .optional(),
    categoryDescription: z
      .string()
      .min(2, "Category description must be at least 2 characters long.")
      .optional(),
  })
  .strict();

export type createCategoryDTO = z.infer<typeof createCategorySchema>;
export type updateCategoryDTO = z.infer<typeof updateCategorySchema>;
