import { IProduct } from "../models/Product";
import { CreateProductDTO } from "../dto/product.dto";
import { NextFunction } from "express";
import ErrorResponse from "./../exceptions/httpException";
import {
  createProductDB,
  findProducts,
  findRelatedProducts,
  findLatestProducts,
  findTopProducts,
  findOneProduct,
  removeProductDB,
  updateProductDB,
} from "../repositories/products";

class ProductService {
  static async getProducts(
    search: string,
    category: string,
    pageNumber: string
  ): Promise<{ products: IProduct[]; page: number; pages: number }> {
    const pageSize = 2;
    const page = Number(pageNumber) || 1;

    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : category && category !== "All"
      ? { category }
      : {};

    const { products, count } = await findProducts(searchQuery, pageSize, page);

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  static async createProduct(data: CreateProductDTO): Promise<IProduct> {
    const product = await createProductDB(data);

    return product;
  }

  static async getProductByID(
    productId: string,
    next: NextFunction
  ): Promise<void | IProduct> {
    const product = await findOneProduct(productId);

    if (!product) {
      return next(new ErrorResponse(400, "Product not found"));
    }

    return product;
  }

  static async getTopProducts(): Promise<IProduct[]> {
    const products = await findTopProducts();

    return products;
  }

  static async getRelatedProducts(
    productId: string,
    next: NextFunction
  ): Promise<void | IProduct[]> {
    const product = await findOneProduct(productId);

    if (!product) {
      return next(new ErrorResponse(404, "Product not found"));
    }

    const products = await findRelatedProducts(product);

    return products;
  }

  static async getLatestProducts(): Promise<IProduct[]> {
    const products = await findLatestProducts();

    return products;
  }

  static async updateProduct(
    productId: string,
    data: CreateProductDTO,
    next: NextFunction
  ): Promise<void | IProduct> {
    const product = await findOneProduct(productId);

    if (!product) {
      return next(new ErrorResponse(400, "Product not found"));
    }

    if(product.user._id.toString() !== data.user) {
      return next(new ErrorResponse(401, "User not authorized to update this product"))
    }

    product.name = data.name;
    product.description = data.description;
    product.brand = data.brand;
    product.category = data.category;
    product.quantity = data.quantity;
    product.rating = data.rating;
    product.numReviews = data.numReviews;
    product.price = data.price;

    const updatedProduct = await updateProductDB(product);

    return updatedProduct;
  }

  static async deleteProduct(productId: string, userId:string, next: NextFunction): Promise<void | IProduct> {
    const product = await findOneProduct(productId);

    if (!product) {
      return next(new ErrorResponse(400, "Product not found"));
    }

    if(product.user._id.toString() !== userId) {
      return next(new ErrorResponse(401, "User not authorized to delete this product"))
    }

    const deletedProduct = await removeProductDB(product);

    return deletedProduct;
  }
}

export default ProductService;
