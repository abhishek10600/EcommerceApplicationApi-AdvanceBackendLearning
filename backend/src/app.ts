import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config/env.config.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";

export const app = express();

// only in production if using NGINX, AWS or etc
// app.set("trust proxy", 1);

app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());

app.get("/health-check", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Api is working fine",
  });
});

import authRouter from "./modules/auth/auth.route.js";
import categoryRouter from "./modules/category/category.route.js";
import productRouter from "./modules/product/product.route.js";
import orderRouter from "./modules/order/order.route.js";
import addressRouter from "./modules/address/address.route.js";
import cartRouter from "./modules/cart/cart.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/cart", cartRouter);

app.use(globalErrorHandler);
