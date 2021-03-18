import AuthService from "./../services/authService";
import { Request, Response, NextFunction } from "express";
import sendResponseToken from "./../utils/sendTokenResponse";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const info = await AuthService.signUp(req, req.body, next);

  if (info) {
    res.status(200).send({
      msg: `We just sent an email to ${req.body.email} to verify your account`,
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await AuthService.signIn(req.body, next);

  if (user) {
    sendResponseToken(user, 201, res);
  }
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  console.log(token)

  const user = await AuthService.emailConfirmation(token, next);

  if (user) {
    sendResponseToken(user, 201, res);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const info = await AuthService.forgotPassword(req, req.body, next);

  if (info) {
    res.status(200).send({
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

  const user = await AuthService.resetPassword(resettoken, password, next);

  if(user) {
    sendResponseToken(user, 200, res);
  }

  
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, currentPassword } = req.body;

  const user = await AuthService.updatePassword(req, newPassword, currentPassword, next);

  if(user) {
    sendResponseToken(user as any, 200, res);
  }
 
};
