const Store = require("../models/store");
const Item = require("../models/item");
const Order = require("../models/order");
const ExpressError = require("../utils/ExpressError");
const { isValidMongooseId } = require("../utils/utility");
const { validateGetItemByQueryReq } = require("../middleware/itemMiddleware");

// get all stores and get store by id
// can submit full search by name or description
const getStores = async (req, res, next) => {
  let searchResult;
  if (req.params.id) {
    isValidMongooseId(req.params.id);
    searchResult = await Store.findById(req.params.id);
  } else {
    if (req.query.storeName) {
      searchResult = await Store.find({ storeName: req.query.storeName });
      if (searchResult.length === 0)
        searchResult =
          "Cannot find any stores with that store name! (must input exact store name)";
    } else {
      searchResult = await Store.find({});
      if (searchResult.length === 0) searchResult = "Cannot find any stores!";
    }
  }
  if (!searchResult)
    throw new ExpressError("Cannot find a store with that id!", 400);
  res.json(searchResult);
};

// creating a store
const createStore = async (req, res, next) => {
  const { storeName } = req.body;
  const newStore = new Store({
    storeName,
    ownerId: req.userId,
  });
  await newStore.save();
  res.json({ newStore });
};

// updating a store (name)
const updateStore = async (req, res, next) => {
  const { storeName } = req.body;
  const storeToUpdate = req.store;
  storeToUpdate.storeName = storeName;
  await storeToUpdate.save();
  res.json({ storeToUpdate });
};

// delete a store
const deleteStore = async (req, res, next) => {
  const storeToDelete = req.store;
  await Store.deleteOne({ _id: storeToDelete._id });
  const deletedItems = await Item.deleteMany({ storeId: storeToDelete._id });
  res.json({
    deletedStore: storeToDelete,
    itemsDeleted: deletedItems.deletedCount,
  });
};

// list all items found in a store
const getItems = async (req, res, next) => {
  let searchResult;
  if (req.params.itemId) {
    isValidMongooseId(req.params.itemId);
    searchResult = await Item.findById(req.params.itemId);
    if (searchResult.storeId != req.params.storeId)
      throw new ExpressError("That item doesn't belong to this store!", 400);
  } else {
    if (Object.keys(req.query).length !== 0 && req.query.constructor === Object)
      validateGetItemByQueryReq(req.query);
    if (req.query.itemName || req.query.itemDescription) {
      searchResult = await Item.find({
        $or: [
          { itemName: req.query.itemName },
          { description: req.query.itemDescription },
        ],
        storeId: req.params.storeId,
      });
    } else {
      searchResult = await Item.find({ storeId: req.params.storeId });
    }
  }
  if (!searchResult)
    throw new ExpressError("Cannot find an item with that id!", 400);
  res.json(searchResult);
};

// create an item within the store
const createItem = async (req, res, next) => {
  const { itemName, description, unitPrice, quantity } = req.body;
  const newItem = new Item({
    storeId: req.params.storeId,
    itemName,
    description,
    unitPrice,
    quantity,
  });
  await newItem.save();
  res.json({ newItem });
};

// update item within a store
const updateItem = async (req, res, next) => {
  const { itemName, description, quantity } = req.body;
  const itemToUpdate = req.item;
  itemToUpdate.itemName = itemName;
  itemToUpdate.description = description;
  itemToUpdate.quantity = quantity;
  await itemToUpdate.save();
  res.json({ itemToUpdate });
};

// delete item within a store
const deleteItem = async (req, res, next) => {
  const itemToDelete = req.item;
  await Item.deleteOne({ _id: itemToDelete._id });
  res.json({ itemToDelete });
};

// retrieves all orders that were made to items from that store
const getStoreOrders = async (req, res, next) => {
  let allOrders;
  if (req.params.orderId) {
    isValidMongooseId(req.params.orderId);
    allOrders = await Order.findById(req.params.orderId);
  } else {
    allOrders = await Order.find({ storeId: req.store._id });
  }
  if (!allOrders)
    throw new ExpressError("Cannot find an order with that id!", 400);
  if (allOrders.length === 0) allOrders = "Your store has no orders!";
  res.json({ allOrders });
};

// delete an order for an item from their store
const deleteStoreOrder = async (req, res, next) => {
  const orderToDelete = req.order;
  await Order.deleteOne({ _id: orderToDelete._id });
  res.json({ orderToDelete });
};

module.exports = {
  getStores: getStores,
  createStore: createStore,
  updateStore: updateStore,
  deleteStore: deleteStore,
  getItems: getItems,
  createItem: createItem,
  updateItem: updateItem,
  deleteItem: deleteItem,
  getStoreOrders: getStoreOrders,
  deleteStoreOrder: deleteStoreOrder,
};
