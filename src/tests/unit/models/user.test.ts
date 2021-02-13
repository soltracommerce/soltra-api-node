import User from "../../../models/User";
import "dotenv/config";
import jwt, { Secret } from "jsonwebtoken";

describe("user.getSignedJWT", () => {
  it("should return a valid JWT", () => {
    const payload = {
      firstname: "Sharon",
      isAdmin: true,
    };

    const user = new User(payload);
    const token = (user as any).getSignedJWT();
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);

    expect(decoded).toMatchObject(payload);
  });
});
