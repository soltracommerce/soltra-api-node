import { check } from "express-validator";

export const validateUserRules = () => {
  return [
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
};

export const validateLoginRules = () => {
  return [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ];
};

export const validateProductRules = () => {
  return [
    check("name", "Product's name is required").not().isEmpty(),
    check("description", "Product's description is required").not().isEmpty(),
    check("brand", "Product's brand is required").not().isEmpty(),
    check("category", "Product's category is required").not().isEmpty(),
    check("quantity", "Product's quantity is required").isNumeric().notEmpty(),
    check("rating", "Product's rating is required").isNumeric().notEmpty(),
    check("price", "Price of product is required").isNumeric().notEmpty(),
  ];
};

export const validateShopRules = () => {
  return [
    check("name", "Product's name is required").not().isEmpty(),
    check("description", "Product's description is required").not().isEmpty(),
  ];
};
