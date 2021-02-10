const express = require("express");
const userController = require("../controllers/userController");
const catchAsync = require("../utils/catchAsync");
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  isValidUser,
  isAccountOwner,
  validateBalanceRequest,
  validateCreateUserRequest,
  validateUserUpdateRequest,
} = require("../middleware/accountMiddleware");

const router = express.Router();

// get all users
router.get("/", authenticateUser, catchAsync(userController.getUsers));

// get a user by id
router.get("/:userId", authenticateUser, catchAsync(userController.getUsers));

// create a new user
router.post(
  "/",
  validateCreateUserRequest,
  catchAsync(userController.createUser)
);

// update the profile of a user
router.patch(
  "/:userId",
  authenticateUser,
  validateUserUpdateRequest,
  isValidUser,
  isAccountOwner,
  catchAsync(userController.updateUser)
);

// update the balance of a user
router.patch(
  "/:userId/balance",
  authenticateUser,
  validateBalanceRequest,
  isValidUser,
  isAccountOwner,
  catchAsync(userController.updateUserBalance)
);

module.exports = router;
