export class CreateUserDTO {
  readonly firstname: string;
  readonly lastname: string;
  readonly email: string;
  readonly password: string;
}

export class LoginUserDTO {
  readonly email: string;
  readonly password: string;
}

