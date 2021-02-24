import { IProduct } from "../models/Product";
import { CreateProductDTO } from "../repositories/dto/product.dto";
import {
  createProduct,
  findProducts,
  findRelatedProducts,
  findLatestProducts,
  findTopProducts,
  findOneProduct,
  removeProduct,
  updateProduct,
} from "../repositories/products";

class ProductService {
  static async getProducts(
    search: string,
    category: string,
    pageNumber: string
  ) {
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

  static async createProduct(data: IProduct) {
    const product = await createProduct(data);
    return product;
  }

  static async getProductByID(productId: string) {
    const product = await findOneProduct(productId);
    return product;
  }

  static async getTopProducts() {
    const products = await findTopProducts();
    return products;
  }

  static async getRelatedProducts(productId: string) {
    const products = await findRelatedProducts(productId);
    return products;
  }

  static async getLatestProducts() {
    const products = await findLatestProducts();
    return products;
  }

  static async update(productId: string, data: CreateProductDTO) {
    const product = await updateProduct(productId, data);
    return product;
  }

  static async deleteProduct(productId: string) {
    const product = await removeProduct(productId);
    return product;
  }
}

export default ProductService;
