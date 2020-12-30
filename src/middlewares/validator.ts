import { check } from "express-validator";

export const validateUser = [
  check("firstname", "Firstname is required").not().isEmpty(),
  check("lastname", "Lastname is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({
    min: 6,
  }),
];

export const validateLogin = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];
