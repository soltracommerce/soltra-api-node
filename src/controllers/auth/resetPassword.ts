import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../../models/User";
import ErrorResponse from "../../exceptions/httpException";
import sendTokenResponse from "../../utils/sendTokenResponse";

// @ Desc Reset Password
// Route PUT/api/v1/auth/resetpassword/:resettoken
// Access PUBLIC
 const resetPassword = async (
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
      return next(new ErrorResponse(400, "Invalid Token"));
    }
  
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendTokenResponse(user, 200, res);
  };

  export default resetPassword;