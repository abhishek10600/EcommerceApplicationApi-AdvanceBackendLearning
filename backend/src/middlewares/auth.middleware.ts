import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/Jwt.helper.js";
import { IJwtPayload } from "../types/index.js";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppError("Unautohrized request", 401);
    }

    const decoded = verifyAccessToken(token) as IJwtPayload;

    console.log({ decoded });

    const user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      createdAt: decoded.createdAt,
      updatedAt: decoded.updatedAt,
    };

    console.log({ user });

    req.user = user;

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const verifySeller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (user.role !== "SELLER") {
    throw new AppError("You are not authorized.", 401);
  }

  next();
};
