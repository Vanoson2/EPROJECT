const chai = require("chai");
const chaiHttp = require("chai-http");
const App = require("../app");
const expect = chai.expect;
require("dotenv").config();

chai.use(chaiHttp);

describe("Products", () => {
  let app;
  let authToken;
  let createdProductId;

  before(async function() {
    app = new App();
    await app.connectDB();
    console.log("LOGIN_TEST_USER:", process.env.LOGIN_TEST_USER);
    console.log("LOGIN_TEST_PASSWORD:", process.env.LOGIN_TEST_PASSWORD ? "***" : "MISSING");
    
    try {
      await chai
        .request("http://localhost:3000")
        .post("/register")
        .send({ 
          username: process.env.LOGIN_TEST_USER, 
          password: process.env.LOGIN_TEST_PASSWORD 
        });
      console.log("✓ User registered");
    } catch (error) {
      console.log("✓ User already exists");
    }
      const authRes = await chai
        .request("http://localhost:3000")
        .post("/login")
        .send({ 
          username: process.env.LOGIN_TEST_USER, 
          password: process.env.LOGIN_TEST_PASSWORD });
      authToken = authRes.body.token;
      app.start();
  });

  after(async function() {
    await app.disconnectDB();
    app.stop();
  });

  describe("POST /", () => {
    it("should create a new product with valid data", async () => {
      const product = {
        name: "Product 1",
        description: "Description of Product 1",
        price: 10,
      };
      const res = await chai
        .request(app.app)
        .post("/")
        .set("Authorization", `Bearer ${authToken}`)
        .send(product);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("name", product.name);
      expect(res.body).to.have.property("description", product.description);
      expect(res.body).to.have.property("price", product.price);
      createdProductId = res.body._id;
    });
  });

  describe("GET /", () => {
    it("should get all products", async () => {
      const res = await chai
        .request(app.app)
        .get("/")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.above(0);
    });
  });

  describe("GET /:id", () => {
    it("should get product by id", async () => {
      const res = await chai
        .request(app.app)
        .get(`/${createdProductId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id", createdProductId);
      expect(res.body).to.have.property("name", "Product 1");
    });
  });
});
