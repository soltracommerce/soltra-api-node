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
import adminMiddleware from './../middlewares/admin';
import {validateProductId} from "./../middlewares/validateObjectId"
import parser from "../utils/cloudinary";


const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    adminMiddleware,
    parser.single("image"),
    validateProductRules(),
    validate,
    createProduct
  )
  .get(listAllProducts);

router.route("/top").get(listTopProducts);
router.route("/related/:productId").get(validateProductId, listRelatedProducts);
router.route("/latest").get(listLatestProducts);

router
  .route("/:productId")
  .get(validateProductId, getProduct)
  .put(authMiddleware, adminMiddleware, validateProductRules(), validate, validateProductId, updateProduct)
  .delete(authMiddleware, adminMiddleware, validateProductId, deleteProduct);

export default router;
