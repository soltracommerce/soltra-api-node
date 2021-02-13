import request from "supertest";
import User from "../../../models/User";
import server from "../../../index";

describe("Login User", () => {
  beforeAll(async () => {
    server;
    const user = new User({
      firstname: "John",
      lastname: "Doe",
      email: "example1@gmail.com",
      password: "123456789",
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany();
    await server.close();
  });

  const exec = (email: string, password: string) => {
    return request(server).post("/api/v1/auth/login").send({
      email,
      password,
    });
  };
  it("should return please include a valid email if email is not valid", async () => {
    const res: any = await exec("test123@gmail...", "123456");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Please include a valid email");
  });

  it("should return Invalid Email or Password if email or password do not exist", async () => {
    const res: any = await exec("test123@gmail.com", "12345");
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid Email or Password");
  });

  it("should return 201 if email and password are valid", async () => {
    const res: any = await exec("example1@gmail.com", "123456789");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
