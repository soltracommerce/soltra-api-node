import request from "supertest";
import User from "../../../models/User";
import server from "../../../index";

describe("Update Password", () => {
  beforeAll(async () => {
    server;
  });

  afterAll(async () => {
    await User.deleteMany();
    await server.close();
  });

  const exec = (
    currentPassword: string,
    newPassword: string,
    token: string
  ) => {
    return request(server)
      .put("/api/v1/auth/updatepassword")
      .set("Authorization", `Bearer ${token}`)
      .send({
        newPassword,
        currentPassword,
      });
  };
  it("should return Access denied if token is not provided", async () => {
    const token = "";
    const currentPassword = "123456";
    const newPasword = "1234567";
    const res = await exec(currentPassword, newPasword, token);
    expect(res.status).toBe(401);
    expect(res.body.errors[0].msg).toBe("Access Denied!!! No Token Provided");
  });

  it("should return 200 if current password is valid", async () => {
    const user = new User({
      firstname: "Jason",
      lastname: "Sturgis",
      email: "json@gmail.com",
      password: "123456789",
    });
    const token = (user as any).getSignedJWT();
    await user.save();

    const currentPassword = "123456789";
    const newPasword = "1234567";

    const res = await exec(currentPassword, newPasword, token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
