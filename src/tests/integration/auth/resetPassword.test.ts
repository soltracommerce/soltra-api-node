import request from "supertest";
import User from "../../../models/User";
import server from "../../../index";
import crypto from "crypto";

describe("Reset Password", () => {
  let resetToken: string;
  let password: string = "123456789";
  beforeAll(async () => {
    server;
    const user = new User({
      firstname: "Declan",
      lastname: "Rice",
      email: "declanrice7@gmail.com",
      password,
    });
    resetToken = (user as any).getResetPasswordToken();
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany();
    await server.close;
  });

  const exec = (token: string, password: string) => {
    return request(server)
      .put(`/api/v1/auth/resetpassword/${token}`)
      .send({ password });
  };

  it("should return Invalid Token if reset token is not valid", async () => {
    resetToken = crypto.randomBytes(20).toString("hex");
    password = "1234567";
    const res = await exec(resetToken, password);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid Token");
  });

  it("should return 200 if reset token is valid", async () => {
    const user = new User({
      firstname: "Jon",
      lastname: "Snow",
      email: "jonsnow@gmail.com",
      password,
    });
    resetToken = (user as any).getResetPasswordToken();
    await user.save();

    password = "1234567";
    const res = await exec(resetToken, password);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
