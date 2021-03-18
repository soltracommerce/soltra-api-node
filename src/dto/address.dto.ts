export class CreateAddressDTO {
  readonly address: string;
  readonly user: string;
  readonly phoneNumbers: string[];
  readonly additionalInfo: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly country: string;
  readonly isDefault: boolean;
}
