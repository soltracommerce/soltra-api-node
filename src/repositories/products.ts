import Product from "../models/Product";
import { CreateProductDTO } from "../dto/product.dto";
import { IProduct } from "./../models/Product";

export const findProducts = async (
  searchQuery: any,
  pageSize: number,
  page: number
): Promise<{ products: IProduct[]; count: number }> => {
  const count = await Product.countDocuments({ ...searchQuery });

  const products = await Product.find({ ...searchQuery })
    .populate({ path: "user", select: "firstname lastname email" })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  return { products, count };
};

export const createProductDB = async (
  data: CreateProductDTO
): Promise<IProduct> => {
  let product = new Product(data);

  product = await product.save();

  return product;
};

export const findOneProduct = async (
  productId: string
): Promise<IProduct | null> => {
  const product = await Product.findById(productId).populate(
    "user",
    "firstname lastname email"
  );

  return product;
};

export const findTopProducts = async (): Promise<IProduct[]> => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(5)
    .populate("user", "firstname lastname email");

  return products;
};

export const findRelatedProducts = async (
  product: IProduct
): Promise<IProduct[]> => {
  const products = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  }).populate("user", "firstname lastname email");

  return products;
};

export const findLatestProducts = async () => {
  const products = await Product.find({})
    .sort("-createdAt")
    .limit(5)
    .populate("user", "firstname lastname email");

  return products;
};

export const updateProductDB = async (product: IProduct) => {
  const updatedProduct = await product.save();

  return updatedProduct;
};

export const removeProductDB = async (product: IProduct) => {
  const deletedProduct = await product?.remove();

  return deletedProduct;
};
