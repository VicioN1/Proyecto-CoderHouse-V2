const supertest = require("supertest");
const chai = require("chai");

const expect = chai.expect;
const request = supertest("http://localhost:3000");

describe("POST /login", () => {
  it("debería iniciar sesión correctamente con credenciales válidas", async () => {
    const res = await request
      .post("/api/sessions/login")
      .send({ email: "fer@fer.com", password: "12345" });

    expect(res.status).to.equal(302);
    expect(res.headers.location).to.include("/realtimeproductsUser");
  });

  it("debería devolver un error 404 si el usuario no existe", async () => {
    const res = await request
      .post("/api/sessions/login")
      .send({ email: "noexiste@example.com", password: "contraseñaCualquiera" });

    expect(res.status).to.equal(404);
    expect(res.text).to.equal("Usuario no encontrado");
  });

  it("debería devolver un error 401 si la contraseña es incorrecta", async () => {
    const res = await request
      .post("/api/sessions/login")
      .send({ email: "fer@fer.com", password: "contraseñaIncorrecta" });

    expect(res.status).to.equal(401);
    expect(res.text).to.equal("Contraseña incorrecta");
  });

});
