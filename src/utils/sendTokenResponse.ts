import { Response } from "express";
import { IUser } from "../models/User";

const sendResponseToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token = user.getSignedJWT();

  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, cookieOptions).send({ token });
};

export default sendResponseToken;
