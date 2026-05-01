import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { productService } from "./product.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createProductController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await productService.createProduct(
      req.body,
      userId,
      req.files as Express.Multer.File[],
    );

    sendResponse(res, 201, {
      success: true,
      message: "Product created successfully",
      data: result,
    });
  },
);

export const getProductsByCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.catId as string;

    const result = await productService.getProductsByCategoryId(categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  },
);
