import express from "express";
import { verifyAdmin, verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createCategorySchema } from "./category.schema.js";
import { createCategoryController } from "./category.controller.js";

const router = express.Router();

router
  .route("/create-category")
  .post(
    verifyUser,
    verifyAdmin,
    validate(createCategorySchema),
    createCategoryController,
  );

export default router;
