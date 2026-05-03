import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { productService } from "./product.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authService } from "../auth/auth.container.js";

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

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productService.getAllProducts();

    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  },
);

export const getAllActiveProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productService.getAllActiveProducts();

    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
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

export const updateProductController = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.prodId as string;
    const sellerId = req.user.id as string;
    const result = await productService.editProduct(
      req.body,
      productId,
      sellerId,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  },
);

export const toggleActiveProductController = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.prodId as string;
    const sellerId = req.user.id as string;

    const result = await productService.toggleActiveProduct(
      productId,
      sellerId,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Product's active status toggled successfully.",
      data: result,
    });
  },
);

export const deleteProductController = catchAsync(
  async (req: Request, res: Response) => {
    const sellerId = req.user.id as string;
    const productId = req.params.prodId as string;

    await productService.deleteProduct(productId, sellerId);

    sendResponse(res, 200, {
      success: true,
      message: "Product deleted successfully",
    });
  },
);
