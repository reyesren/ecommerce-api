# ecommerce-api

This is a rest-api express application used to simulate a ecommerce platform. The ecommerce platform includes full CRUD functionality for all resources (ie. users, stores, orders, items). This application includes one integration test for creating a store, and passes both cases. The test is intended to be a structure for future integration tests. Also, this application includes a automation script to run nightly at 8pm to update the statuses of orders from "placed" to "shipped".


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />

### `npm test`

Launches the mocha test runner.


## Tools

This application was created using:
- Node.js
- Express.js
- mongoDB

This application was testing using:
- chai
- mocha
- supertest

Relevant Packages:
- passport
- passport-jwt
- node-schedule
- joi
