import { Request, NextFunction } from "express";
import crypto from "crypto";
import { IUser } from "./../models/User";
import { CreateUserDTO, LoginUserDTO } from "../dto/auth.dto";
import {
  findOneUser,
  createUserDB,
  updateUserDB,
} from "./../repositories/auth";
import ErrorResponse from "./../exceptions/httpException";
import sendEmail from "../utils/sendEmail";
import MailService from "./../utils/emailServices";

class AuthService {
  static async signUp(
    req: Request,
    data: CreateUserDTO,
  ): Promise<any> {
    const { email } = data;

    const userData = await findOneUser({ email });

    if (userData) {
      throw new ErrorResponse(400, "User with the email already exists");
    }

    const user = await createUserDB(data);

    const verificationToken = user.getEmailVerificationToken();

    const verifyEmailUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/confirmemail?token=${verificationToken}`;

    await updateUserDB(user);

    //send email

    const response = await MailService.sendMail(
      {
        name: "confirmation.html",
        data: { username: user.firstname, verifyEmailUrl },
      },
      { email: user.email, subject: "Account Verification" }
    );

    return response;
  }

  static async signIn(data: LoginUserDTO): Promise<void | IUser> {
    const { email } = data;

    const user = await findOneUser({ email });

    if (!user) {
      throw new ErrorResponse(400, "Invalid Email or Password");
    }

    const isMatch = await user.comparePasswords(data.password);

    if (!isMatch) {
      throw new ErrorResponse(400, "Invalid Email or Password");
    }

    return user;
  }

  static async emailConfirmation(
    token: string | any,
  ): Promise<void | IUser> {
    if (!token) {
      throw new ErrorResponse(400, "There is no verification token");
    }

    const splitToken = token.split(".")[0];

    const verifyEmailToken = crypto
      .createHash("sha256")
      .update(splitToken)
      .digest("hex");

    const user = await findOneUser({
      verifyEmailToken,
      isEmailVerified: false,
    });

    if (!user) {
      throw new ErrorResponse(400, "Invalid Verification Token");
    }

    user.verifyEmailExpire = undefined;
    user.verifyEmailToken = undefined;
    user.isEmailVerified = true;

    const newUser = await updateUserDB(user);

    return newUser;
  }

  static async forgotPassword(
    req: Request,
    data: any,
  ): Promise<any> {
    const { email } = data;

    const user = await findOneUser({ email });

    if (!user) {
      throw new ErrorResponse(404, "User does not exist");
    }

    const resetToken = user.getResetPasswordToken();
    await updateUserDB(user);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are recieving this email because you (or someone else) 
    has requested the reset of a password. Please click on the link below to reset your password\n\n${resetUrl}`;

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

      await updateUserDB(user);
      throw new ErrorResponse(400, "Sorry! Email Could not be sent");
    }
  }

  static async resetPassword(
    token: string,
    password: string,
  ): Promise<void | IUser> {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await findOneUser({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorResponse(400, "Invalid Token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    const newUser = await updateUserDB(user);

    return newUser;
  }

  static async updatePassword(
    req: Request | any,
    newPassword: string,
    currentPassword: string,
  ): Promise<void | IUser> {
    const user = await findOneUser({ _id: req.user.id });

    if (!user) {
      throw new ErrorResponse(400, "User does not exist");
    }

    const isMatch = await user.comparePasswords(currentPassword);

    if (!isMatch) {
      throw new ErrorResponse(400, "Password is incorrect");
    }

    user.password = newPassword;

    const newUser = await updateUserDB(user);

    return newUser;
  }
}

export default AuthService;
