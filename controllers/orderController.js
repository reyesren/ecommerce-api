const Order = require("../models/order");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const {
  isValidMongooseId,
  convertDateToReadable,
} = require("../utils/utility");

// get all your orders and get order by id
const getOrders = async (req, res, next) => {
  let searchResult;
  if (req.params.orderId) {
    isValidMongooseId(req.params.orderId);
    searchResult = await Order.findById(req.params.orderId);
    if (!searchResult)
      throw new ExpressError("Cannot find an order with that id!", 400);
  } else {
    searchResult = await Order.find({ purchaserId: req.userId });
    if (searchResult.length === 0) searchResult = "You've made no orders!";
  }
  res.json(searchResult);
};

// creating an order
const createOrder = async (req, res, next) => {
  const { numPurchased, storeId } = req.body;
  const purchasedItem = req.body.itemId;
  const status = "placed";
  const purchaserId = req.userId;
  const amountCharged = req.item.unitPrice * numPurchased;
  const date = convertDateToReadable(new Date());
  const newOrder = new Order({
    purchaserId: purchaserId,
    storeId: storeId,
    itemId: purchasedItem,
    numPurchased: numPurchased,
    amountCharged: amountCharged,
    status: status,
    destination: req.shippingAddress,
    dateOrderPlaced: date,
  });
  await newOrder.save();
  res.json({ newOrder });
};

// delete an order you've made
// cannot delete an order that has a status of "shipped"
const deleteOwnOrder = async (req, res, next) => {
  const orderToDelete = req.order;
  const orderOwner = await User.findById(req.userId);
  if (orderToDelete.status === "shipped")
    throw new ExpressError(
      "Cannot delete an order with a status of shipped!",
      400
    );
  orderOwner.balance = orderOwner.balance + orderToDelete.amountCharged;
  await Order.deleteOne({ _id: orderToDelete._id });
  await orderOwner.save();
  res.json({ orderToDelete });
};

module.exports = {
  getOrders: getOrders,
  createOrder: createOrder,
  deleteOwnOrder: deleteOwnOrder,
};
