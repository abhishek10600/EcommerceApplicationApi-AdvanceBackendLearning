import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { setCookies } from "../../utils/auth.helper.js";

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
