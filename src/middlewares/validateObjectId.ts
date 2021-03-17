import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ErrorResponse from "../exceptions/httpException";

export const validateAddressId = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.addressId)) {
    return next(new ErrorResponse(404, "Address not found"));
  }

  next();
};

export const validateProductId = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
    return next(new ErrorResponse(404, "Product not found"));
  }

  next();
};

export const validateCartId = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cartId)) {
    return next(new ErrorResponse(404, "Cart not found"));
  }

  next();
};

export const validateCartItemId = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cartItemId)) {
    return next(new ErrorResponse(404, "Cart item not found"));
  }

  next();
};

export const validateOrderId = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
    return next(new ErrorResponse(404, "Order not found"));
  }
  next();
};

export const validatePaymentId = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.paymentId)) {
    return next(new ErrorResponse(404, "Reciept not found"));
  }

  next();
};
