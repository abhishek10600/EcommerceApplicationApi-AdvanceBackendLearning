import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { cartService } from "./cart.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const addToCartController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await cartService.addToCart(userId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Item added to your cart.",
      data: result,
    });
  },
);

export const getCartController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await cartService.getCart(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Cart fetched successfully",
      data: result,
    });
  },
);

export const updateCartItemController = catchAsync(
  async (req: Request, res: Response) => {
    const cartItemId = req.params.cartItemId as string;

    const result = await cartService.updateCartItem(cartItemId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Item update successfully",
      data: result,
    });
  },
);

export const deleteCartItemController = catchAsync(
  async (req: Request, res: Response) => {
    const cartItemId = req.params.cartItemId as string;

    await cartService.removeCartItem(cartItemId);

    sendResponse(res, 200, {
      success: true,
      message: "Item removed from cart",
    });
  },
);

export const clearCartController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    await cartService.clearCart(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Cart cleared successfully",
    });
  },
);
