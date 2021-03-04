import { _FilterQuery } from "mongoose";
import User, { UserBaseDocument } from "../models/User";
import { CreateUserDTO } from "./dto/auth.dto";
import { IUser } from "./../models/User";

export const findOneUser = async (query: any) => {
  const user = await User.findOne({ ...query });

  return user;
};

export const createUser = async (data: CreateUserDTO) => {
  let user = new User(data);

  const verificationToken = user.getEmailVerificationToken();

  user = await user.save({ validateBeforeSave: false });
  
  return { user, verificationToken };
};

export const ConfirmUser = async (user: IUser | any) => {
  user.verifyEmailExpire = undefined;
  user.isEmailVerified = true;

  await user.save({ validateBeforeSave: false });
};

export const resetUserPassword = async (
  user: IUser | any,
  password: string
) => {
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });
};
