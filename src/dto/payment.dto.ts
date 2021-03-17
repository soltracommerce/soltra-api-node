export class CreateInitialTransactionDTO {
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  callback_url?: string;
  plan?: string;
  invoice_limit?: number;
  metadata?: any;
  transaction_charge?: number;
  bearer?: string;
}
