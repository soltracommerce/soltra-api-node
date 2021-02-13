import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import ErrorResponse from "../../exceptions/httpException";
import sendTokenResponse from "../../utils/sendTokenResponse";

// @Desc Update Password
// Route PUT/api/v1/auth/updatepassword
// Access PRIVATE

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, currentPassword } = req.body;

  const user = await User.findById((req as any).user.id).select("+password");

  const isMatch = (user as any).comparePasswords(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse(400, "Password is incorrect"));
  }

  (user as any).password = newPassword;
  await user?.save();

  sendTokenResponse(user as any, 200, res);
};

export default updatePassword;
