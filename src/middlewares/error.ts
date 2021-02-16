import { Response, NextFunction } from "express";
import colors from "colors/safe";
import logger from "../startup/logger";
import ErrorResponse from "../exceptions/httpException";
import { error } from "winston";

const errorMiddleware = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const msg = err.message || "Something went wrong";

  res.status(status).send({ errors: [{ status, msg }] });

  logger.error(colors.red(`Express server error: ${msg}`));
};

export default errorMiddleware;