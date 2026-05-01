import { Category } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ICategoryRepository } from "./category.interface.js";
import { updateCategoryDTO } from "./category.schema.js";

export class CategoryRepository implements ICategoryRepository {
  async createCategory(data: {
    categoryName: string;
    categoryDescription: string;
  }): Promise<Category> {
    const newCategory = await prisma.category.create({
      data,
    });

    return newCategory;
  }

  async findCategoryById(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return category;
  }

  async findCategoryByName(categoryName: string) {
    const category = await prisma.category.findUnique({
      where: {
        categoryName,
      },
    });

    return category;
  }

  async getAllCategories() {
    const categories = await prisma.category.findMany();

    return categories;
  }

  async updateCategory(data: updateCategoryDTO, categoryId: string) {
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data,
    });

    return updatedCategory;
  }

  async deleteCategoryById(categoryId: string) {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
