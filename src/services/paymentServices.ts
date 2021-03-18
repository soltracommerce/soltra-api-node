import { CreateInitialTransactionDTO } from "../dto/payment.dto";
import Paystack from "../apis/paystack";
import { createReceipt, findOneReceipt } from "../repositories/payment";
import { IPayment } from "./../models/Payment";
import { findOneUser } from "./../repositories/auth";
import ErrorResponse from "./../exceptions/httpException";
import { NextFunction } from "express";
import { getUserReceipts } from './../repositories/payment';

class PaymentService {
  static async initialPayment(
    data: { amount: number; user: string },
    next: NextFunction
  ): Promise<any> {
    const user = await findOneUser({ _id: data.user });

    if (!user) {
      return next(new ErrorResponse(404, "User does not exist"));
    }

    const newData = {
      amount: data.amount,
      email: user.email,
      metadata: {
        fullname: `${user.firstname} ${user.lastname}`,
      },
    };

    const response = await Paystack.initialPaymentAPI(newData);

    return response.data;
  }

  static async verifyPayment(reference: string): Promise <IPayment> {
    const { data } = await Paystack.verifyPaymentAPI(reference);

    const payment = {
      fullname: data.metadata.fullname,
      email: data.customer.email,
      amount: data.amount / 100,
      currency: data.currency,
      status: data.status,
      payment_id: data.id,
      payment_date: data.paid_at,
      payment_reference: data.reference,
    };

    const receipt = await createReceipt(payment as IPayment);

    return receipt;
  }

  static async getPaymentsByUser(userId: string, next: NextFunction): Promise<void | IPayment[]> {
    const user = await findOneUser({ _id: userId });

    if(!user) {
      return next(new ErrorResponse(404, "User does not exist"))
    }

    const receipts = await getUserReceipts(user.email);

    return receipts;
  }

  static async getAPayment(paymentId: string, next: NextFunction): Promise<void | IPayment> {
    const receipt = await findOneReceipt({ _id: paymentId });

    if (!receipt) {
      return next(
        new ErrorResponse(404, "Receipt not found")
      );
    }

    return receipt;
  }
}

export default PaymentService;
