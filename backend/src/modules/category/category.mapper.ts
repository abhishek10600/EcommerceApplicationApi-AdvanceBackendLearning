import { Category } from "@prisma/client";
import { CategoryResponseDTO } from "./category.response.js";

export const toCategotryResponse = (
  category: Category,
): CategoryResponseDTO => {
  return {
    id: category.id,
    categoryName: category.categoryName,
    categoryDescription: category.categoryDescription,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};
