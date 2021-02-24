import { Request, NextFunction} from "express";
import crypto from "crypto";
import {
  CreateUserDTO,
  LoginUserDTO,
  UpdatePasswordDTO,
} from "./../repositories/dto/auth.dto";
import {
  findOneUser,
  createUser,
  ConfirmUser,
  resetUserPassword,
} from "./../repositories/auth";
import ErrorResponse from "./../exceptions/httpException";
import sendEmail from "../utils/sendEmail";

class AuthService {
  static async SignUp(req: Request, data: CreateUserDTO, next: NextFunction) {
    const { email } = data;
    const userData = await findOneUser({ email });

    if (userData) {
      return next(new ErrorResponse(400, "User with the email already exists"));
    }

    const { verificationToken, user } = await createUser(data);

    const verifyEmailUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/confirmemail?token=${verificationToken}`;

    const message = `Hello ${user.firstname},\n\nYou are receiving this email because you need to confirm your
          email address. Please verify your account by clicking the link below\n\n${verifyEmailUrl}`;
    try {
      const info = await sendEmail({
        email: user.email,
        subject: "Email confirmation token",
        message,
      });
      return info;
    } catch (error) {
      return next(
        new ErrorResponse(
          400,
          "Sorry!!! we could not send an Email to verify your account"
        )
      );
    }
  }

  static async SignIn(data: LoginUserDTO) {
    const { email } = data;
    const user = await findOneUser({ email });

    const isMatch = await user?.comparePasswords(data.password);

    return { user, isMatch };
  }

  static async EmailConfirmation(token: string) {
    const splitToken = token.split(".")[0];

    const verifyEmailToken = crypto
      .createHash("sha256")
      .update(splitToken)
      .digest("hex");

    const user = await findOneUser({
      verifyEmailToken,
      isEmailVerified: false,
    });
    if (user) {
      await ConfirmUser(user);
    }
    return user;
  }

  static async ForgotPassword(req: Request, data: any, next: NextFunction) {
    const { email } = data;
    const user = await findOneUser({ email });

    if (!user) {
      return next(new ErrorResponse(400, "There is no user with this email"));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are recieving this email because you (or someone else) 
        has requested the reset of a password. Please click on the link below to reset your password\n\n ${resetUrl}`;

    try {
      const info = await sendEmail({
        email: user.email,
        subject: "Reset Password Token",
        message,
      });

      return info;
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse(400, "Sorry! Email Could not be sent"));
    }
  }

  static async ResetPassword(token: string, password: string) {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await findOneUser({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (user) {
      await resetUserPassword(user, password);
    }

    return user;
  }

  static async UpdatePassword(req: Request | any, data: UpdatePasswordDTO) {
    const { newPassword, currentPassword } = data;
    const user = await findOneUser({ _id: req.user.id });
    const isMatch = await user?.comparePasswords(currentPassword);
    if (isMatch) {
      (user as any).password = newPassword;
      await user?.save();
    }

    return { user, isMatch };
  }
}

export default AuthService;
