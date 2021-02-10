const express = require("express");
const authController = require("../controllers/authController");
const { validateCredentials } = require("../middleware/authMiddleware");

const router = express.Router();

// authenticate the user's credentials
router.post("/", validateCredentials, authController.authenticateUser);

module.exports = router;
