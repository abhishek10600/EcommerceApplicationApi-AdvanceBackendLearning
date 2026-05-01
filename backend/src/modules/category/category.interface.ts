import { Category } from "@prisma/client";
import { updateCategoryDTO } from "./category.schema.js";

export interface ICategoryRepository {
  createCategory(data: {
    categoryName: string;
    categoryDescription: string;
  }): Promise<Category>;

  findCategoryById(categoryId: string): Promise<Category | null>;

  findCategoryByName(categoryName: string): Promise<Category | null>;

  getAllCategories(): Promise<Category[]>;

  updateCategory(
    data: updateCategoryDTO,
    categoryId: string,
  ): Promise<Category>;

  deleteCategoryById(categoryId: string): Promise<any>;
}
