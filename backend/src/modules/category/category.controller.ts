import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { categoryService } from "./category.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Category created successfully",
      data: result,
    });
  },
);

export const getAllCategoriesController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();

    sendResponse(res, 200, {
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });
  },
);

export const updateCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.catId as string;
    const result = await categoryService.updateCategory(req.body, categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  },
);

export const deleteCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.catId as string;

    await categoryService.deleteCategory(categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Category deleted successfully",
    });
  },
);
