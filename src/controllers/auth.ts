import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { validationResult } from "express-validator";
import sendEmail from "../utiils/sendEmail";
import User from "../models/User";
import ErrorResponse from "../exceptions/httpException";
import sendTokenResponse from "../utiils/sendTokenResponse";
import logger from "../startup/logger";

// @Desc Register User
// Route: POST api/v1/auth/register
// Access: PUBLIC

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  const { firstname, lastname, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse(400, "User with the email already exist"));
  }

  user = new User({ firstname, lastname, email, password });

  const verificationToken = (user as any).getEmailVerificationToken();

  const verifyEmailUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/confirmemail?token=${verificationToken}`;

  const message = `Hello ${user.firstname},\n\n You are receiving this email because you need to confirm your
  email address. Please verify your account by clicking the link below \n\n ${verifyEmailUrl}`;

  user = await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Email confirmation token",
      message,
    });
    res.status(200).send("We just sent you an Email to verify your account");
  } catch (error) {
    return next(
      new ErrorResponse(
        400,
        "Sorry!!! we could not send an Email to verify your account"
      )
    );
  }
};

// @ Desc Login User
// Route POST/api/v1/auth/login
// Access PUBLIC

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(400, "Invalid Email or Password"));
  }
  // compare password
  const isMatch = await (user as any).comparePasswords(password);

  if (!isMatch) {
    return next(new ErrorResponse(400, "Invalid Email or Password"));
  }
  sendTokenResponse(user, 201, res);
};

// @ Desc Email Confirmation
// Route GET/api/v1/auth/confirmemail
// Access PUBLIC

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse(400, "There is no verification token"));
  }

  const splitToken = (token as any).split(".")[0];
  console.log(splitToken);

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

// @ Desc Forgot Password
// Route POST/api/v1/auth/forgotpassword
// Access PUBLIC

export const forgotPassword = async (
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
      .send(`Email to reset your password has been sent to ${email}`);
  } catch (error) {
    logger.error(error.toString());

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(400, "Sorry! Email Could not be sent"));
  }
};

// @Desc Reset Password
// Route PUT/api/v1/auth/resetpassword/:resettoken
// Access PUBLIC

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resettoken } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(400, "Invalid token"));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
};

// @Desc Update Password
// Route PUT/api/v1/auth/updatepassword
// Access PRIVATE

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, currentPassword } = req.body;

  const user = await User.findById((req as any).user.id).select("+password");

  const isMatch = (user as any).comparePasswords(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse(401, "Password is incorrect"));
  }

  (user as any).password = newPassword;
  await user?.save();

  sendTokenResponse(user as any, 200, res);
};
