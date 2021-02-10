const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const {
  updateBalanceSchema,
  createUserSchema,
  updateUserSchema,
} = require("../validation/validateUserRequests");
const { isValidMongooseId, validateBody } = require("../utils/utility");

const isValidUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  isValidMongooseId(userId);
  const foundUser = await User.findById(userId);
  if (!foundUser)
    throw new ExpressError("Cannot find a user with that id!", 400);
  else {
    req.user = foundUser;
    next();
  }
});

const isAccountOwner = (req, res, next) => {
  const currentUser = req.userId;
  const accountToCheck = req.params.userId;

  if (currentUser !== accountToCheck)
    throw new ExpressError("You do not have permission to do that!", 403);
  next();
};

const validateUserUpdateRequest = (req, res, next) => {
  validateBody(req, res, next, updateUserSchema);
};

const validateBalanceRequest = (req, res, next) => {
  validateBody(req, res, next, updateBalanceSchema);
};

const validateCreateUserRequest = (req, res, next) => {
  validateBody(req, res, next, createUserSchema);
};

module.exports = {
  isValidUser: isValidUser,
  isAccountOwner: isAccountOwner,
  validateBalanceRequest: validateBalanceRequest,
  validateCreateUserRequest: validateCreateUserRequest,
  validateUserUpdateRequest: validateUserUpdateRequest,
};
