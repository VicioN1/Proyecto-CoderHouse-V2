const supertest = require("supertest");
const chai = require("chai");

const expect = chai.expect;
const request = supertest("http://localhost:3000");

describe("GET /:cid", () => {
  let cookies; 

  before(async () => {
    const loginRes = await request
      .post("/api/sessions/login")
      .send({ email: "fer@fer.com", password: "12345" });

    expect(loginRes.status).to.equal(302); 
    cookies = loginRes.headers["set-cookie"]; 
  });

  it("debería devolver los productos del carrito si el carrito existe y el usuario está autenticado", async () => {
    const cart_id = "1"; 
    const res = await request
      .get(`/api/carts/${cart_id}`)
      .set("Cookie", cookies) 
      .expect("Content-Type", /json/);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("products").that.is.an("array");
  });

  it("debería devolver un error 404 si el carrito no existe", async () => {
    const cart_id = "carrito_inexistente";
    const res = await request
      .get(`/api/carts/${cart_id}`)
      .set("Cookie", cookies) 
      .expect("Content-Type", /json/);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Carrito no encontrado");
  });

  it("debería redirigir a /login si el usuario no está autenticado", async () => {
    const res = await request
      .get(`/api/carts/cart_id_valido`) 
      .expect("Location", "/login")
      .expect(302); 
  });
});

describe("POST /:cid/product/:pid", () => {
  it("debería agregar un producto al carrito si el carrito y el producto existen y el usuario está autenticado", async () => {
    const loginRes = await request
      .post("/api/sessions/login")
      .send({ email: "fer@fer.com", password: "12345" });

    expect(loginRes.status).to.equal(302); 

    const cart_id = "1";
    const product_id = "9";

    const res = await request
      .post(`/api/carts/${cart_id}/product/${product_id}`)
      .set("Cookie", loginRes.headers["set-cookie"]) 
      .expect("Content-Type", /json/);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");
  });

  it("debería devolver un error 404 si el carrito o producto no existen", async () => {
    const loginRes = await request
      .post("/api/sessions/login")
      .send({ email: "fer@fer.com", password: "12345" });

    expect(loginRes.status).to.equal(302); 

    const cart_id = "carrito_inexistente";
    const product_id = "product_id_inexistente";

    const res = await request
      .post(`/api/carts/${cart_id}/product/${product_id}`)
      .set("Cookie", loginRes.headers["set-cookie"])
      .expect("Content-Type", /json/);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Carrito o producto no encontrado");
  });
});

describe("DELETE /:cid/product/:pid", () => {
  it("debería eliminar un producto del carrito si el carrito y el producto existen y el usuario está autenticado", async () => {
    const loginRes = await request
      .post("/api/sessions/login")
      .send({ email: "fer@fer.com", password: "12345" });

    expect(loginRes.status).to.equal(302); 

    const cart_id = "1";
    const product_id = "9";

    const res = await request
      .delete(`/api/carts/${cart_id}/product/${product_id}`)
      .set("Cookie", loginRes.headers["set-cookie"])
      .expect("Content-Type", /json/);

    expect(res.status).to.equal(200);
  });

  it("debería devolver un error 404 si el carrito o producto no existen", async () => {
    const loginRes = await request
      .post("/api/sessions/login")
      .send({ email: "fer@fer.com", password: "12345" });

    expect(loginRes.status).to.equal(302); 

    const cart_id = "carrito_inexistente";
    const product_id = "product_id_inexistente";

    const res = await request
      .delete(`/api/carts/${cart_id}/product/${product_id}`)
      .set("Cookie", loginRes.headers["set-cookie"])
      .expect("Content-Type", /json/);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Carrito o producto no encontrado");
  });
});

