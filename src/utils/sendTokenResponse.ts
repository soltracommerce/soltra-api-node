
import { Response } from "express";

const sendResponseToken = (user:object, statusCode: number, res: Response ) => {
    const token = (user as any).getSignedJWT();

    const cookieOptions = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, cookieOptions).send({ token });

}

export default sendResponseToken;