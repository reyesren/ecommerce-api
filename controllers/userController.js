const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const { isValidMongooseId } = require("../utils/utility");

// get all users and get user by id
const getUsers = async (req, res, next) => {
  let searchResult;
  if (req.params.userId) {
    isValidMongooseId(req.params.userId);
    searchResult = await User.findById(req.params.userId).select(
      "firstName lastName shippingAddress balance email"
    );
  } else {
    searchResult = await User.find({}).select(
      "firstName lastName shippingAddress balance email"
    );
  }
  if (!searchResult)
    throw new ExpressError("Cannot find a user with that id!", 400);
  if (searchResult.length === 0) searchResult = "There are no users!";
  res.json(searchResult);
};

// creating a user
const createUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    shippingAddress,
    balance,
    email,
    password,
  } = req.body;
  const newUser = await User.create({
    firstName,
    lastName,
    shippingAddress,
    balance,
    email,
    password,
  });
  res.json({
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    shippingAddress: newUser.shippingAddress,
    balance: newUser.balance,
    email: newUser.email,
    password: newUser.password,
  });
};

// updating a user's profile (first name, last name, shipping address, password)
const updateUser = async (req, res, next) => {
  const userToUpdate = req.user;
  const { firstName, lastName, shippingAddress, password } = req.body;
  if (firstName) userToUpdate.firstName = firstName;
  if (lastName) userToUpdate.lastName = lastName;
  if (shippingAddress) userToUpdate.shippingAddress = shippingAddress;
  if (password) userToUpdate.password = password;
  await userToUpdate.save();
  res.json({
    firstName: userToUpdate.firstName,
    lastName: userToUpdate.lastName,
    shippingAddress: userToUpdate.shippingAddress,
    balance: userToUpdate.balance,
    email: userToUpdate.email,
  });
};

// update a user's balance
const updateUserBalance = async (req, res, next) => {
  const { changeBy } = req.body;
  const userToUpdate = req.user;
  userToUpdate.balance = userToUpdate.balance + changeBy;
  await userToUpdate.save();
  res.json({
    balance: userToUpdate.balance,
  });
};

module.exports = {
  getUsers: getUsers,
  createUser: createUser,
  updateUser: updateUser,
  updateUserBalance: updateUserBalance,
};
