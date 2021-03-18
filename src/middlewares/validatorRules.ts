import { check } from "express-validator";
import { isString } from "lodash";

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

export const validateAddressRules = () => {
  return [
    check("address", "address is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("phoneNumbers", "phone number is required").not().isEmpty(),
    check("zipcode", "zipcode is required").not().isEmpty(),
    check("state", "City is required").not().isEmpty(),
    check("country", "country is required").not().isEmpty(),
  ];
};

export const validatePaymentRules = () => {
  return [check("amount", "amount must be a number").isNumeric()];
};

export const validateOrderRules = () => {
  return [
    check("payment_id", "payment id must be a number").isNumeric().not().isEmpty(),
    check("payment_status", "payment status is required").isString().not().isEmpty(),
    check("payment_date", "payment date is required").not().isEmpty(),
    check("payment_reference", "payment reference is required").isString().not().isEmpty()
  ];
};
