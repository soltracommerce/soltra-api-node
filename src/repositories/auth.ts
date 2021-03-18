import User from "../models/User";
import { CreateUserDTO } from "../dto/auth.dto";
import { IUser } from "./../models/User";

export const findOneUser = async (query: any): Promise<IUser | null> => {
  const user = await User.findOne({ ...query });

  return user;
};

export const createUserDB = async (data: CreateUserDTO): Promise<IUser> => {
  let user = new User(data);

  user = await user.save();
  
  return user;
};

export const updateUserDB = async (user: IUser): Promise<IUser> => {
  const newUser = await user.save({ validateBeforeSave: false });

  return newUser
}

