const { connectDB, dbClose } = require("../../config/db");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");

const basicSetup = () => {
  before((done) => {
    // runs before the first test case
    connectDB();
    mongoose.connection
      .once("open", () => done())
      .on("error", (error) => console.warn("Error", error));
  });

  // runs before each test case
  beforeEach(async () => {
    const connection = mongoose.connection;
    const numOrders = await connection.db.collection("orders").countDocuments();
    const numUsers = await connection.db.collection("users").countDocuments();
    const numItems = await connection.db.collection("items").countDocuments();
    const numStores = await connection.db.collection("stores").countDocuments();
    if (numUsers > 0) await connection.collections.users.drop();
    if (numOrders > 0) await connection.collections.orders.drop();
    if (numItems > 0) await connection.collections.items.drop();
    if (numStores > 0) await connection.collections.stores.drop();

    // Create dummy first user
    const userToCreate = {
      firstName: "Tester",
      lastName: "Testing",
      shippingAddress: {
        line1: "22 Tester Neighbourhood Place",
        city: "Testville",
        province: "Ontario",
        postalCode: "L1N 2A4",
        country: "Canada",
      },
      balance: 100,
      email: "test@test.com",
      password: "123456",
    };
    await request(app).post("/users").send(userToCreate);
  });

  // runs after the last test case
  after((done) => {
    dbClose()
      .then(() => done())
      .catch((err) => done(err));
  });
};

// retrieve auth token for authentication
const getAuthToken = async () => {
  const userToAuthenticate = {
    email: "test@test.com",
    password: "123456",
  };
  const response = await request(app).post("/auth").send(userToAuthenticate);
  return response.body.token;
};

module.exports = { basicSetup, getAuthToken };
