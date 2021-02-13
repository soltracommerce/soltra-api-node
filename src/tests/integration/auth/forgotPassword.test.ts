import request from "supertest";
import server from "../../../index";
import User from "../../../models/User";

describe("Register User", () => {
  beforeAll(async () => {
    server;
    const user = new User({
      firstname: "Max",
      lastname: "Planck",
      email: "maxplanck2@gmail.com",
      password: "123456789",
    });
    await user.save();
  });
  afterAll(async () => {
    await User.deleteMany();
    await server.close();
  });

  const exec = (email: string) => {
    return request(server).post("/api/v1/auth/forgotpassword").send({ email });
  };

  it("should return There is no user with this email if email does not exist", async () => {
    const res = await exec("test1@gmail.com");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("There is no user with this email");
  });

  it("should return There is no user with this email if email does not exist", async () => {
    const res = await exec("test1@gmail.com");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("There is no user with this email");
  });

  it("should return 200 if email exists", async () => {
    const email = "maxplanck2@gmail.com";
    const res = await exec(email);
    expect(res.status).toBe(200);
    expect(res.body.msg).toBe(
      `Email to reset your password has been sent to ${email}`
    );
  });
});
