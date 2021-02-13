import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import sendEmail from "../../utils/sendEmail";
import User from "../../models/User";
import ErrorResponse from "../../exceptions/httpException";

// @Desc Register User
// Route: POST api/v1/auth/register
// Access: PUBLIC

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  const { firstname, lastname, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse(400, "User with the email already exists"));
  }

  user = new User({ firstname, lastname, email, password });

  const verificationToken = (user as any).getEmailVerificationToken();

  const verifyEmailUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/confirmemail?token=${verificationToken}`;

  const message = `Hello ${user.firstname},\n\n You are receiving this email because you need to confirm your
    email address. Please verify your account by clicking the link below \n\n ${verifyEmailUrl}`;

  user = await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Email confirmation token",
      message,
    });
    res
      .status(200)
      .send({ msg: "We just sent you an Email to verify your account" });
  } catch (error) {
    return next(
      new ErrorResponse(
        400,
        "Sorry!!! we could not send an Email to verify your account"
      )
    );
  }
};

export default registerUser;
