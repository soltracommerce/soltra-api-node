import { Request, Response, NextFunction } from "express";
import sendEmail from "../../utils/sendEmail";
import User from "../../models/User";
import ErrorResponse from "../../exceptions/httpException";
import logger from "../../startup/logger";

// @Desc Forgot Password
// Route POST/api/v1/auth/forgotpassword
// Access PUBLIC

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(400, "There is no user with this email"));
  }

  const resetToken = (user as any).getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are recieving this email because you (or someone else) 
  has requested the reset of a password. Please click on the link below to reset your password \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password Token",
      message,
    });

    res
      .status(200)
      .send({ msg: `Email to reset your password has been sent to ${email}` });
  } catch (error) {
    logger.error(error.toString());

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(400, "Sorry! Email Could not be sent"));
  }
};

export default forgotPassword;
