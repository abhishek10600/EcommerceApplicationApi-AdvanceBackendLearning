import { Category } from "@prisma/client";

export interface ICategoryRepository {
  createCategory(data: {
    categoryName: string;
    categoryDescription: string;
  }): Promise<Category>;

  findCategoryByName(categoryName: string): Promise<Category | null>;
}
