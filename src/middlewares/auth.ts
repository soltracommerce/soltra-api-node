import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import colors from "colors/safe";
import logger from "../startup/logger";
import User from "../models/User";
import ErrorResponse from "./../exceptions/httpException";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   else if (req.cookies && req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    return next(new ErrorResponse(401, "Access Denied!!! No Token Provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);

    (req as any).user = await User.findById((decoded as any).id);
    next();
  } catch (error) {
    logger.error(colors.red(error));
    return next(
      new ErrorResponse(
        401,
        "Invalid Token!!! Not Authorized to access this endpoint"
      )
    );
  }
};

export default authMiddleware;
