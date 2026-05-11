import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  logoutUserSchema,
  refreshTokenSchema,
  registerUserSchema,
} from "./auth.schema.js";
import {
  getCurrentUserController,
  loginUserController,
  logoutAllDevices,
  logoutController,
  refreshTokenController,
  registerUserController,
} from "./auth.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(authLimiter, validate(registerUserSchema), registerUserController);

router
  .route("/login")
  .post(authLimiter, validate(loginUserSchema), loginUserController);

router.route("/me").get(verifyUser, getCurrentUserController);

router
  .route("/logout")
  .post(verifyUser, validate(logoutUserSchema), logoutController);

router.route("/logout-all-devices").post(verifyUser, logoutAllDevices);

router
  .route("/refresh-token")
  .post(authLimiter, validate(refreshTokenSchema), refreshTokenController);

export default router;
