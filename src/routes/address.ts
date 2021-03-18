import express from "express";
import authMiddleware from "./../middlewares/auth";
import adminMiddleware from "./../middlewares/admin";
import validator from "./../middlewares/validator";
import { validateAddressRules } from "./../middlewares/validatorRules";
import { validateAddressId } from "./../middlewares/validateObjectId";
import {
  addAddress,
  getAllAddresses,
  getAddress,
  getMyAddresses,
  getAddressByUser,
  updateAddress,
  deleteAddress,
} from "./../controllers/address";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, validateAddressRules(), validator, addAddress)
  .get(authMiddleware, adminMiddleware, getAllAddresses)

  router.route("/my_addresses").get(authMiddleware, getMyAddresses);
router
  .route("/:addressId")
  .get(authMiddleware, adminMiddleware, validateAddressId, getAddress)
  .get(authMiddleware, validateAddressId, getAddressByUser)
  .put(authMiddleware, validateAddressId, updateAddress)
  .delete(authMiddleware, validateAddressId, deleteAddress);

export default router;
