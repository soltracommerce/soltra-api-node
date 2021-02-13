import request from "supertest";
import User from "../../../models/User";
import server from "../../../index";
import crypto from "crypto";

describe("Confirm Email", () => {
  let verificationToken: string;
  beforeAll(async () => {
    server;
    const user = new User({
      firstname: "Bukayo",
      lastname: "Saka",
      email: "saka7@gmail.com",
      password: "123456789",
    });
    verificationToken = (user as any).getEmailVerificationToken();
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany();
    await server.close();
  });

  const exec = (token: string) => {
    return request(server)
      .get(`/api/v1/auth/confirmemail?token=${token}`)
      .send();
  };
  it("should return 400 if there is no verification token in the query", async () => {
    verificationToken = "";
    const res = await exec(verificationToken);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("There is no verification token");
  });

  it("should return Invalid Token if verification token is not valid", async () => {
    verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExtended = crypto.randomBytes(100).toString("hex");
    verificationToken = `${verificationToken}.${verificationTokenExtended}`;

    const res = await exec(verificationToken);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid Verification Token");
  });

  it("should return 201 if verification token is valid", async () => {
    const user = new User({
      firstname: "West",
      lastname: "Brown",
      email: "westbrown@gmail.com",
      password: "123456789",
    });
    verificationToken = (user as any).getEmailVerificationToken();
    await user.save();
    const res = await exec(verificationToken);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
