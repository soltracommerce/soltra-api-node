import request from "supertest";
import server from "../../../index";
import User from "../../../models/User";

describe("Register User", () => {
  beforeAll(async () => {
    server;
    const user = new User({
      firstname: "John",
      lastname: "Doe",
      email: "example2@gmail.com",
      password: "123456789",
    });
    await user.save();
  });
  afterAll(async () => {
    await User.deleteMany();
    await server.close();
  });

  interface reqBody {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }
  const exec = (reqBody: reqBody) => {
    return request(server).post("/api/v1/auth/register").send(reqBody);
  };

  it("should return firstname is required if firstname is not given", async () => {
    const res: any = await exec({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Firstname is required");
  });

  it("should return lastname is required if lastname is not given", async () => {
    const res: any = await exec({
      firstname: "Joan",
      lastname: "",
      email: "joanbagovic@gmail.com",
      password: "1234567",
    });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Lastname is required");
  });

  it("should return please include a valid email if email is not valid", async () => {
    const res: any = await exec({
      firstname: "Joan",
      lastname: "Begovic",
      email: "",
      password: "1234567",
    });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Please include a valid email");
  });

  it("should return password please enter a password with 6 or more characters password is not up to 6 characters ", async () => {
    const res: any = await exec({
      firstname: "Kelvin",
      lastname: "Smith",
      email: "kelvinsmith@gmail.com",
      password: "12345",
    });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Please enter a password with 6 or more characters"
    );
  });

  it("should return User with email already exists if email is already in database", async () => {
    const res: any = await exec({
      firstname: "Jane",
      lastname: "Doe",
      email: "example2@gmail.com",
      password: "123456789",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("User with the email already exists");
  });

  it("should return 200 if signup credentials are valid", async () => {
    const res: any = await exec({
      firstname: "James",
      lastname: "Smith",
      email: "example3@gmail.com",
      password: "12345678",
    });
    expect(res.status).toBe(200);
    expect(res.body.msg).toBe(
      "We just sent you an Email to verify your account"
    );
  });
});
