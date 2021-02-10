if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { connectDB, dbClose } = require("./config/db");
const passport = require("passport");
const changeOrderStatusOvernight = require("./scripts/changeOrdersScript");
require("./auth/auth");

const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

changeOrderStatusOvernight();

app.get("/", (req, res) => {
  res.send("The API is running!");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/stores", storeRoutes);
app.use("/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
