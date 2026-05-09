import redis from "../../lib/redis.js";
import { AppError } from "../../utils/AppError.js";
import { invalidateCategoryCache } from "../../utils/cache.helper.js";
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

    await invalidateCategoryCache();

    return toCategotryResponse(newCategory);
  }

  async getAllCategories() {
    const cacheKey = `categories:all`;

    const cachedCategories = await redis.get(cacheKey);

    if (cachedCategories) {
      console.log("CACHE HIT");
      return JSON.parse(cachedCategories);
    }

    console.log("CACHE MISS");

    const categories = await this.categoryRepo.getAllCategories();

    const formattedResult = toCategoryListResponse(categories);

    await redis.set(cacheKey, JSON.stringify(formattedResult), "EX", 300);

    return formattedResult;
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

    await invalidateCategoryCache();

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

    await invalidateCategoryCache();

    return true;
  }
}
