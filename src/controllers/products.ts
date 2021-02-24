import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../exceptions/httpException";
import ProductService from "./../services/productService";

export const listAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, category, pageNumber } = req.query;
  const { products, page, pages } = await ProductService.getProducts(
    search as string,
    category as string,
    pageNumber as string
  );

  res.status(200).send({ products, page, pages });
};

export const createProduct = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  req.body.user = req.user._id;
  req.body.image = req.file.path;
  const product = await ProductService.createProduct(req.body);
  res.status(201).send(product);
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const product = await ProductService.getProductByID(productId);
  if (!product) {
    return next(
      new ErrorResponse(400, "Product with the given ID does not exist")
    );
  }
  res.status(200).send(product);
};

export const listLatestProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await ProductService.getLatestProducts();
  res.status(200).send(products);
};

export const listTopProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await ProductService.getTopProducts();
  res.status(200).send(products);
};

export const listRelatedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const products = await ProductService.getRelatedProducts(productId);
  res.status(200).send(products);
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const product = await ProductService.update(productId, req.body);
  if (!product) {
    return next(
      new ErrorResponse(400, "Product with the given ID does not exist")
    );
  }
  res.status(200).send(product);
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const product = await ProductService.deleteProduct(productId);
  if (!product) {
    return next(
      new ErrorResponse(400, "Product with the given ID does not exist")
    );
  }
  res.status(200).send(product);
};
