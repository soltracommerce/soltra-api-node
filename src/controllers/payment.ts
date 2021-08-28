import { Request, Response, NextFunction } from "express";
import PaymentService from "../services/paymentServices";

export const initialTransaction = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  req.body.amount *= 100;

  req.body.user = req.user.id;

  const { data } = await PaymentService.initialPayment(req.body);

  // res.redirect(data.authorization_url);

  res.status(200).send(data);
};

export const verifyTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { reference } = req.query;

  const receipt = await PaymentService.verifyPayment(reference as string);

  res.status(200).send(receipt);
};

export const getUsersTransactions = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const receipts = await PaymentService.getPaymentsByUser(req.user.id);

  if (receipts) {
    res.status(200).send(receipts);
  }
};

export const getATransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { paymentId } = req.params;

  const receipt = await PaymentService.getAPayment(paymentId);

  if (receipt) {
    res.status(200).send(receipt);
  }
};
