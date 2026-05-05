import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { addressService } from "./address.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createAddressController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await addressService.createAddress(req.body, userId);

    sendResponse(res, 201, {
      success: true,
      message: "Address created successfully",
      data: result,
    });
  },
);

export const getAddressesByUserIdController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await addressService.getAddressByUserId(userId);

    sendResponse(res, 200, {
      success: true,
      message: "All addresses fetched successfully.",
      data: result,
    });
  },
);

export const updateAddressController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const addressId = req.params.addressId as string;

    const result = await addressService.updateAddress(
      userId,
      addressId,
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Address updated successfully.",
      data: result,
    });
  },
);

export const deleteAddressController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const addressId = req.params.addressId as string;

    await addressService.deleteAddress(userId, addressId);

    sendResponse(res, 200, {
      success: true,
      message: "Address deleted successfully",
    });
  },
);
