import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import User from "../../models/User";
import ErrorResponse from "../../exceptions/httpException";
import sendTokenResponse from "../../utils/sendTokenResponse";

// @ Desc Login User
// Route POST/api/v1/auth/login
// Access PUBLIC

const loginUser = async (
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
  const isMatch = await (user as any).comparePasswords(password);

  if (!isMatch) {
    return next(new ErrorResponse(400, "Invalid Email or Password"));
  }
  sendTokenResponse(user, 201, res);
};

export default loginUser;