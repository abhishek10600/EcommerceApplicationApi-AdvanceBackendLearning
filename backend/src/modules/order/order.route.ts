import express from "express";
import { verifyAdmin, verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createOrderSchema } from "./order.schema.js";
import {
  cancelOrderController,
  createOrderController,
  getMyOrdersController,
  updateOrderStatusController,
} from "./order.controller.js";

const router = express.Router();

router
  .route("/create-order")
  .post(verifyUser, validate(createOrderSchema), createOrderController);

router.route("/my-orders").get(verifyUser, getMyOrdersController);

router
  .route("/update-order-status/:ordId")
  .patch(verifyUser, verifyAdmin, updateOrderStatusController);

router.route("/cancel-order/:ordId").post(verifyUser, cancelOrderController);

export default router;
