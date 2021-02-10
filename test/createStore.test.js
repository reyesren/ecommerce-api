const expect = require("chai").expect,
  request = require("supertest"),
  { basicSetup, getAuthToken } = require("./helper/setup"),
  jwtDecode = require("jwt-decode"),
  app = require("../app");

describe("POST: /users route to create a user", () => {
  basicSetup();
  let authToken;

  // test case 1: include valid data to send
  it("valid data", async () => {
    // get auth token to verify authentication
    // then add to authorization header
    authToken = await getAuthToken();
    const storeToCreate = { storeName: "Tester's First Store" };
    const response = await request(app)
      .post("/stores")
      .set("Authorization", "bearer " + authToken)
      .send(storeToCreate);

    expect(response.statusCode).to.equal(200);
    expect(response.body.newStore).to.be.an("object");
    expect(response.body.newStore.ownerName).to.equal("Tester Testing");
    expect(response.body.newStore.ownerId).to.equal(
      jwtDecode(authToken).userId
    );
  });

  // test case 2: include an empty store name in form
  it("include an empty store name in form", async () => {
    // get auth token to verify authentication
    // then add to authorization header
    authToken = await getAuthToken();
    const storeToCreate = { storeName: "" };
    const response = await request(app)
      .post("/stores")
      .set("Authorization", "bearer " + authToken)
      .send(storeToCreate);

    expect(response.statusCode).to.equal(500);
    expect(response.body).to.be.an("object");
    expect(response.body.error).to.equal(
      'ERROR "storeName" is not allowed to be empty'
    );
  });
});
