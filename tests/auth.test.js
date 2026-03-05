import request from "supertest";
import app from "../src/app.js";

describe("Auth Routes", () => {
  const uniqueEmail = `test-${Date.now()}@example.com`;

  let token;

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: uniqueEmail,
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(uniqueEmail);
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

});