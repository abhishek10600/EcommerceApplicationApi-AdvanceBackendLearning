import { AppError } from "../../utils/AppError.js";
import { ICategoryRepository } from "./category.interface.js";
import { toCategotryResponse } from "./category.mapper.js";
import { createCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(private categoryRepo: ICategoryRepository) {}

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
}
