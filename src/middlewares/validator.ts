import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import ErrorResponse from "../exceptions/httpException";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  errors.array().map((err) => next(new ErrorResponse(400, `${err.msg}`)));
};

export default validate;
