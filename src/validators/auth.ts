import { check } from "express-validator";

export const signUpValidator = [
  check("name").notEmpty().withMessage("name is required"),
  check("name").isLength({ max: 32 }).withMessage("max is 32 character"),
  check("email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required"),
];