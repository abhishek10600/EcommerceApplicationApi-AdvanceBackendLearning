import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "./address.schema.js";
import {
  createAddressController,
  deleteAddressController,
  getAddressesByUserIdController,
  updateAddressController,
} from "./address.controller.js";

const router = express.Router();

router
  .route("/create-address")
  .post(verifyUser, validate(createAddressSchema), createAddressController);

router.route("/all-addresses").get(verifyUser, getAddressesByUserIdController);

router
  .route("/update-address/:addressId")
  .patch(verifyUser, validate(updateAddressSchema), updateAddressController);

router
  .route("/delete-address/:addressId")
  .delete(verifyUser, deleteAddressController);

export default router;
