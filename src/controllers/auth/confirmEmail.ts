import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../../models/User";
import ErrorResponse from "../../exceptions/httpException";
import sendTokenResponse from "../../utils/sendTokenResponse";

// @ Desc Email Confirmation
// Route GET/api/v1/auth/confirmemail
// Access PUBLIC

const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse(400, "There is no verification token"));
  }

  const splitToken = (token as any).split(".")[0];

  const verifyEmailToken = crypto
    .createHash("sha256")
    .update(splitToken)
    .digest("hex");

  const user = await User.findOne({ verifyEmailToken, isEmailVerified: false });
  if (!user) {
    return next(new ErrorResponse(400, "Invalid Verification Token"));
  }

  user.verifyEmailToken = undefined;
  user.isEmailVerified = true;

  user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 201, res);
};

export default confirmEmail;