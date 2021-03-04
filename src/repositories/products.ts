import Product from "../models/Product";
import { CreateProductDTO } from "./dto/product.dto";

export const findProducts = async (
  searchQuery: any,
  pageSize: number,
  page: number
) => {
  const count = await Product.countDocuments({ ...searchQuery });

  const products = await Product.find({ ...searchQuery })
    .populate({ path: "user", select: "firstname lastname email" })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  return { products, count };
};

export const createProduct = async (data: CreateProductDTO) => {
  let product = new Product(data);

  product = await product.save();

  return product;
};

export const findOneProduct = async (productId: string) => {
  const product = await Product.findById(productId);

  return product;
};

export const findTopProducts = async () => {
  const products = await Product.find({}).sort({ ratings: -1 }).limit(3);

  return products;
};

export const findRelatedProducts = async (productId: string) => {
  const product = await Product.findById(productId);

  if (product) {
    const products = await Product.find({
      _id: { $ne: product?._id },
      category: product?.category,
    });

    return products;
  }
};

export const findLatestProducts = async () => {
  const products = await Product.find({}).sort("-created").limit(3);
  return products;
};

export const updateProduct = async (
  productId: string,
  data: CreateProductDTO
) => {
  const product = await Product.findById(productId);

  if (!product) {
    return product;
  }

  const {
    name,
    description,
    brand,
    category,
    quantity,
    rating,
    numReviews,
    price,
  } = data;

  product.name = name;
  product.description = description;
  product.brand = brand;
  product.category = category;
  product.quantity = quantity;
  product.rating = rating;
  product.numReviews = numReviews;
  product.price = price;

  const updatedProduct = await product.save();
  return updatedProduct;
};

export const removeProduct = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product) {
    return product;
  }

  const deletedProduct = await product?.remove();

  return deletedProduct;
};
