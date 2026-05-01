import express from "express";
import { verifySeller, verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProductSchema } from "./product.schema.js";
import {
  createProductController,
  getProductsByCategoryController,
} from "./product.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/create-product")
  .post(
    verifyUser,
    verifySeller,
    upload.array("images", 5),
    validate(createProductSchema),
    createProductController,
  );

router.route("/category/:catId").get(getProductsByCategoryController);

export default router;
