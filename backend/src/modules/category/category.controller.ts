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
