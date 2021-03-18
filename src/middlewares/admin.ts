import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../exceptions/httpException";

const adminMiddleware = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (!req.user.isAdmin) {
    return next(
      new ErrorResponse(
        403,
        "Access denied! user is not authorized to access this endpoint"
      )
    );
  }
  next();
};

export default adminMiddleware;
