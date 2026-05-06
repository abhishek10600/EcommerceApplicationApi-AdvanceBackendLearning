import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema.js";
import {
  addToCartController,
  clearCartController,
  deleteCartItemController,
  getCartController,
  updateCartItemController,
} from "./cart.controller.js";

const router = express.Router();

router
  .route("/add-to-cart")
  .post(verifyUser, validate(addToCartSchema), addToCartController);

router.route("/my-cart").get(verifyUser, getCartController);

router
  .route("/update-cart-item/:cartItemId")
  .patch(verifyUser, validate(updateCartItemSchema), updateCartItemController);

router
  .route("/remove-cart-item/:cartItemId")
  .delete(verifyUser, deleteCartItemController);

router.route("/clear-cart").delete(verifyUser, clearCartController);

export default router;
