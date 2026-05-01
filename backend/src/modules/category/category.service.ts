import { AppError } from "../../utils/AppError.js";
import { IProductRepository } from "../product/product.interface.js";
import { ICategoryRepository } from "./category.interface.js";
import {
  toCategoryListResponse,
  toCategotryResponse,
} from "./category.mapper.js";
import { createCategoryDTO, updateCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(
    private categoryRepo: ICategoryRepository,
    private productRepo: IProductRepository,
  ) {}

  async createCategory(data: createCategoryDTO) {
    const existingCategory = await this.categoryRepo.findCategoryByName(
      data.categoryName,
    );

    if (existingCategory) {
      throw new AppError("Category with this name already exists.", 400);
    }

    const newCategory = await this.categoryRepo.createCategory(data);

    return toCategotryResponse(newCategory);
  }

  async getAllCategories() {
    const categories = await this.categoryRepo.getAllCategories();

    return toCategoryListResponse(categories);
  }

  async updateCategory(data: updateCategoryDTO, categoryId: string) {
    const existingCategory =
      await this.categoryRepo.findCategoryById(categoryId);

    if (!existingCategory) {
      throw new AppError("Category not found.", 404);
    }

    const updatedCategory = await this.categoryRepo.updateCategory(
      data,
      categoryId,
    );

    return toCategotryResponse(updatedCategory);
  }

  async deleteCategory(categoryId: string) {
    const existingCategory =
      await this.categoryRepo.findCategoryById(categoryId);

    const products = await this.productRepo.getProductsByCategoryId(categoryId);

    if (products.length > 0) {
      throw new AppError(
        "Category that contains products cannot be deleted.",
        400,
      );
    }

    if (!existingCategory) {
      throw new AppError("Category not found.", 404);
    }

    await this.categoryRepo.deleteCategoryById(categoryId);

    return true;
  }
}
