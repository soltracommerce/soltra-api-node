import express from "express";
import authMiddleware from "./../middlewares/auth";
import validator from "./../middlewares/validator";
import { validateAddressRules } from "./../middlewares/validatorRules";
import {
  addAddress,
  getAllAddress,
  getSingleAddress,
  updateAddress,
  deleteAddress,
} from "./../controllers/address";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, validateAddressRules(), validator, addAddress)
  .get(authMiddleware, getAllAddress);
router
  .route("/:addressId")
  .get(authMiddleware, getSingleAddress)
  .put(authMiddleware, updateAddress)
  .delete(authMiddleware, deleteAddress);

export default router;
