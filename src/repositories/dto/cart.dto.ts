export class CreateCartItemDTO {
  readonly _id: string;
  readonly quantity: number;
  readonly amount: number;
  readonly status: string;
  readonly product: string;
  readonly user: string;
}

export class CreateCartDTO {
  readonly quantity: number;
  readonly amount: number;
  readonly user: string;
  readonly cart_total: number;
}
