const express = require("express");
const orderController = require("../controllers/orderController");
const catchAsync = require("../utils/catchAsync");
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  isValidItem,
  verifyItemBelongsToStore,
  verifyAndCompletePurchaseTransaction,
} = require("../middleware/itemMiddleware");
const {
  isValidOrder,
  isOrderOwner,
  validateCreateOrderSchema,
} = require("../middleware/orderMiddleware");

const router = express.Router();

// get all orders you've made
router.get("/", authenticateUser, catchAsync(orderController.getOrders));

// get an order you've made by referencing the id
router.get(
  "/:orderId",
  authenticateUser,
  catchAsync(orderController.getOrders)
);

// create an order (ie. purchase an item)
// note: can purchase items from your own store
router.post(
  "/",
  authenticateUser,
  validateCreateOrderSchema,
  isValidItem,
  verifyItemBelongsToStore,
  verifyAndCompletePurchaseTransaction,
  catchAsync(orderController.createOrder)
);

// delete an order
router.delete(
  "/:orderId",
  authenticateUser,
  isValidOrder,
  isOrderOwner,
  catchAsync(orderController.deleteOwnOrder)
);

module.exports = router;
