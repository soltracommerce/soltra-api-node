import Payment, { IPayment } from "../models/Payment";

export const findOneReceipt = async (query: any): Promise<IPayment | null> => {
  const receipt = await Payment.findOne({ ...query });

  return receipt;
};

export const createReceipt = async (data: IPayment): Promise<IPayment> => {
  let receipt = new Payment(data);

  receipt = await receipt.save();

  return receipt;
};

export const getUserReceipts = async (email: string): Promise<IPayment[]> => {
  const receipts = await Payment.find({ email });

  return receipts;
};
