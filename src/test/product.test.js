const supertest = require("supertest");
const chai = require("chai");

const expect = chai.expect;
const request = supertest("http://localhost:3000");

describe("GET /products", () => {
  it("debería obtener una lista de productos con paginación y filtros", async () => {
    const res = await request
      .get("/api/products")
      .query({ limit: 5, page: 1, sort: "asc" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).to.have.property("status", "success");
    expect(res.body.payload).to.be.an("array");
    expect(res.body).to.have.property("totalPages");
    expect(res.body).to.have.property("page");
  });

  it("debería devolver un error 400 si el parámetro sort es inválido", async () => {
    const res = await request
      .get("/api/products")
      .query({ limit: 5, page: 1, sort: "invalid_sort" }) 
      .expect("Content-Type", /json/)
      .expect(400);

    expect(res.body).to.have.property("message", "Parámetro 'sort' inválido. Debe ser 'asc' o 'desc'.");
  });

});

describe("GET /api/products/:pid", () => {
  it("debería obtener un producto por ID si existe", async () => {
    const validProductId = 9; 

    const res = await request
      .get(`/api/products/${validProductId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).to.have.property("product");
    expect(res.body.product).to.have.property("idProduct", validProductId);
  });

  it("debería devolver un error 404 si el producto no existe", async () => {
    const invalidProductId = 99999; 

    const res = await request
      .get(`/api/products/${invalidProductId}`)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(res.body).to.have.property("message", "Producto no encontrado");
  });
});
