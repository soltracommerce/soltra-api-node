import bcrypt from "bcryptjs";

export class DummyUserDTO {
  readonly firstname: string;
  readonly lastname: string;
  readonly isAdmin: boolean;
  readonly isEmailVerified: boolean;
  readonly email: string;
  readonly password: string;
}
const users: DummyUserDTO[] = [
  {
    firstname: "Kristine",
    lastname: "Ball",
    email: "krisball@gmail.com",
    password: bcrypt.hashSync("123456789", 10),
    isAdmin: true,
    isEmailVerified: true,
  },
  {
    firstname: "Melbar",
    lastname: "Diaz",
    email: "meldiaz@gmail.com",
    password: bcrypt.hashSync("123456789", 10),
    isAdmin: false,
    isEmailVerified: true,
  },

  {
    firstname: "Chris",
    lastname: "Underwood",
    email: "chriswood@gmail.com",
    password: bcrypt.hashSync("123456789", 10),
    isAdmin: false,
    isEmailVerified: true,
  },
];

export default users;