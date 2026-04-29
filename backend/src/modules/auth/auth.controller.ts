import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { destroyCookies, setCookies } from "../../utils/auth.helper.js";

export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.registerUserService(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 201, {
      success: true,
      message: "Account created successfully.",
      data: result,
    });
  },
);

export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  },
);

export const getCurrentUserController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result = await authService.getCurrentUser(user.id);

    sendResponse(res, 200, {
      success: true,
      message: "User details fetched successfully",
      data: result,
    });
  },
);

export const logoutController = catchAsync(
  async (req: Request, res: Response) => {
    const isLoggedOut = await authService.logout(req.body);

    if (isLoggedOut) {
      destroyCookies(res);
    }

    sendResponse(res, 200, {
      success: true,
      message: "User logged out successfully",
    });
  },
);

export const logoutAllDevices = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const isLoggedOutOfAllDevices = await authService.logoutAllDevices(userId);

    if (isLoggedOutOfAllDevices) {
      destroyCookies(res);
    }

    sendResponse(res, 200, {
      success: true,
      message: "User logged out of all devices",
    });
  },
);

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "Token refreshed",
      data: result,
    });
  },
);
