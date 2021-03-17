import axios from "axios";
import { CreateInitialTransactionDTO } from "../dto/payment.dto";

const { PAYSTACK_API_URL, PAYSTACK_TEST_SECRET_KEY } = process.env;

class Paystack {
  static async initialPaymentAPI(data: CreateInitialTransactionDTO) {
    const response = await axios.post(
      `${PAYSTACK_API_URL}/transaction/initialize`,
      data,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}`,
          "content-type": "application/json",
        },
      }
    );

    return response;
  }

  static async verifyPaymentAPI(reference: string) {
        const response = await axios.get(
            `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
            {
              headers: {
                Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}`,
              },
            }
          );
      
          return response.data
  }
}

export default Paystack;
