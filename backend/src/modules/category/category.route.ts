import express from "express";
import { verifyAdmin, verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category.controller.js";

const router = express.Router();

router
  .route("/create-category")
  .post(
    verifyUser,
    verifyAdmin,
    validate(createCategorySchema),
    createCategoryController,
  );

router.route("/all-categories").get(getAllCategoriesController);

router
  .route("/update-category/:catId")
  .patch(verifyUser, verifyAdmin, updateCategoryController);

router
  .route("/delete-category/:catId")
  .delete(
    verifyUser,
    verifyAdmin,
    validate(updateCategorySchema),
    deleteCategoryController,
  );

export default router;
