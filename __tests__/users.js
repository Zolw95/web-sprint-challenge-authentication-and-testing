const supertest = require("supertest");
const server = require("../api/server");

describe("Users integration test", () => {
  // REGISTER Failing with missing Username
  it("POST /api/auth/register", async () => {
    const res = await supertest(server).post("/api/auth/register").send({
      username: "",
      password: "test123",
    });
    expect(res.statusCode).toBe(409);
    expect(res.type).toBe("application/json");
    expect(res.body.msg).toBe("Username must be at least 3 characters long");
  });

  // REGISTER Successful with Username and Password
  //   it("POST /api/auth/register", async () => {
  //     const res = await supertest(server).post("/api/auth/register").send({
  //       username: "Tester",
  //       password: "Tester",
  //     });
  //     expect(res.statusCode).toBe(201);
  //     expect(res.type).toBe("application/json");
  //     expect(res.body.username).toBe("Test User");
  //   });

  // LOGIN Failing with incorrect Username and Password
  it("POST /api/auth/login", async () => {
    const res = await supertest(server).post("/api/auth/login").send({
      username: "Testerr",
      password: "Testerr",
    });
    expect(res.statusCode).toBe(401);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toBe("Invalid Credentials");
  });

  // LOGIN Successful with correct Username and Password
  it("POST /api/auth/login", async () => {
    const res = await supertest(server).post("/api/auth/login").send({
      username: "Tester",
      password: "Tester",
    });
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toBe("Welcome Tester");
  });

  // Failing response without being Authenticated
  it("GET /api/jokes", async () => {
    const res = await supertest(server).get("/api/jokes");
    expect(res.statusCode).toBe(405);
    expect(res.type).toBe("application/json");
    expect(res.body.msg).toBe("Please log in");
  });

  // Successful Jokes response when Auth for Private Route is turned Off
  it("GET /api/jokes", async () => {
    const res = await supertest(server).get("/api/jokes");
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    expect(res.body[0].joke).toBe(
      "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
    );
  });
});
