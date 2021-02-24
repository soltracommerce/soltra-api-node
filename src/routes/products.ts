import express from "express";
import validate from "../middlewares/validator";
import { validateProductRules } from "./../middlewares/validatorRules";
import {
  createProduct,
  listAllProducts,
  getProduct,
  listTopProducts,
  listRelatedProducts,
  listLatestProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import parser from "../utils/cloudinary";

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    parser.single("image"),
    validateProductRules(),
    validate,
    createProduct
  )
  .get(listAllProducts);

router.route("/top").get(listTopProducts);
router.route("/related/:productId").get(listRelatedProducts);
router.route("latest/:productId").get(listLatestProducts);

router
  .route("/:productId")
  .get(getProduct)
  .put(validateProductRules(), validate, updateProduct)
  .delete(deleteProduct);

export default router;
