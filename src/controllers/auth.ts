import AuthService from "./../services/authService";
import { Request, Response, NextFunction } from "express";
import logger from "./../startup/logger";
import ErrorResponse from "./../exceptions/httpException";
import sendResponseToken from "./../utils/sendTokenResponse";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const info = await AuthService.SignUp(req, req.body, next);

  if (info) {
    res
      .status(200)
      .send({ msg: "We just sent you an Email to verify your account" });
    logger.info(info);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user, isMatch } = await AuthService.SignIn(req.body);

  if (!user || !isMatch) {
    return next(new ErrorResponse(400, "Invalid Email or Password"));
  }

  sendResponseToken(user, 201, res);
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse(400, "There is no verification token"));
  }

  const user = await AuthService.EmailConfirmation(token as string);

  if (!user) {
    return next(new ErrorResponse(400, "Invalid Verification Token"));
  }

  sendResponseToken(user, 201, res);
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const info = await AuthService.ForgotPassword(req, req.body, next);

  if (info) {
    res
      .status(200)
      .send({
        msg: `Email to reset your password has been sent to ${req.body.email}`,
      });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resettoken } = req.params;
  const { password } = req.body;

  const user = await AuthService.ResetPassword(resettoken, password);

  if (!user) {
    return next(new ErrorResponse(400, "Invalid Token"));
  }

  sendResponseToken(user, 200, res);
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, currentPassword } = req.body;

  const { user, isMatch } = await AuthService.UpdatePassword(req, {
    newPassword,
    currentPassword,
  });

  if (!isMatch) {
    return next(new ErrorResponse(400, "Password is incorrect"));
  }

  sendResponseToken(user as any, 200, res);
};
