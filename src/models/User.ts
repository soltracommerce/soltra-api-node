import { Schema, model, Document } from "mongoose";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  password: string;
  isEmailVerified: boolean;
  verifyEmailToken: string | undefined;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
}

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter your firstname"],
    },
    lastname: {
      type: String,
      required: [true, "Please Enter your lastname"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter your passorwd"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    verifyEmailToken: String,
    verifyEmailExpire: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

userSchema.pre<IUser>("save", async function (next: Function) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.virtual("fullname").get(function (this: IUser) {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.methods.getSignedJWT = function () {
  const token = jwt.sign(
    { id: this._id, firstname: this.firstname, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY as Secret,
    { expiresIn: `${process.env.JWT_EXPIRES_IN}` }
  );

  return token;
};

userSchema.methods.comparePasswords = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.verifyEmailToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const verificationTokenExtended = crypto.randomBytes(100).toString("hex");
  const verificationTokenCombined = `${verificationToken}.${verificationTokenExtended}`;

  this.verifyEmailExpire = Date.now() + 10 * 60 * 1000;

  return verificationTokenCombined;
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default model<IUser>("User", userSchema);
