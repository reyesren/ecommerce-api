const ExpressError = require("../utils/ExpressError");
const Order = require("../models/order");
const catchAsync = require("../utils/catchAsync");
const { isValidMongooseId, validateBody } = require("../utils/utility");
const { createOrderSchema } = require("../validation/validateOrderRequests");

const isValidOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId;
  isValidMongooseId(orderId);
  const foundOrder = await Order.findById(orderId);
  if (!foundOrder)
    throw new ExpressError("Cannot find an order with that id!", 400);
  else {
    req.order = foundOrder;
    next();
  }
});

const isOrderOwner = catchAsync(async (req, res, next) => {
  const order = req.order;
  const ownerToCheck = req.userId;
  if (order.purchaserId != ownerToCheck)
    throw new ExpressError(
      "This is not your order, you don't have permission to do that!",
      403
    );
  next();
});

const checkOrderIsFromStore = (req, res, next) => {
  const store = req.store;
  const order = req.order;
  if (!store._id.equals(order.storeId))
    throw new ExpressError(
      "This order doesn't belong to your store, you don't have permission to do that!",
      403
    );
  next();
};

const validateCreateOrderSchema = (req, res, next) => {
  validateBody(req, res, next, createOrderSchema);
};

module.exports = {
  isValidOrder: isValidOrder,
  isOrderOwner: isOrderOwner,
  checkOrderIsFromStore: checkOrderIsFromStore,
  validateCreateOrderSchema,
};
