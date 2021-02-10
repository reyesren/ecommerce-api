const express = require("express");
const storeController = require("../controllers/storeController");
const catchAsync = require("../utils/catchAsync");
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  isValidStore,
  isStoreOwner,
  validateCreateStoreReq,
  validateUpdateStoreReq,
} = require("../middleware/storeMiddleware");
const {
  isValidItem,
  validateCreateItemReq,
  validateUpdateItemReq,
  checkItemIsFromStore,
} = require("../middleware/itemMiddleware");
const {
  isValidOrder,
  checkOrderIsFromStore,
} = require("../middleware/orderMiddleware");

const router = express.Router();

// get all stores
router.get("/", catchAsync(storeController.getStores));

// get a store by id
router.get("/:id", catchAsync(storeController.getStores));

// create a new store
router.post(
  "/",
  authenticateUser,
  validateCreateStoreReq,
  catchAsync(storeController.createStore)
);

// update the store
router.patch(
  "/:storeId",
  authenticateUser,
  validateUpdateStoreReq,
  isValidStore,
  isStoreOwner,
  catchAsync(storeController.updateStore)
);

// delete the store
router.delete(
  "/:storeId",
  authenticateUser,
  isValidStore,
  isStoreOwner,
  catchAsync(storeController.deleteStore)
);

// list all items for a store
router.get(
  "/:storeId/items",
  isValidStore,
  catchAsync(storeController.getItems)
);

// list details for a single item for a store given their id
router.get(
  "/:storeId/items/:itemId",
  isValidStore,
  catchAsync(storeController.getItems)
);

// create item within store
router.post(
  "/:storeId/items",
  authenticateUser,
  validateCreateItemReq,
  isValidStore,
  isStoreOwner,
  catchAsync(storeController.createItem)
);

// update item within the store
router.patch(
  "/:storeId/items/:itemId",
  authenticateUser,
  validateUpdateItemReq,
  isValidStore,
  isStoreOwner,
  isValidItem,
  checkItemIsFromStore,
  catchAsync(storeController.updateItem)
);

// delete item within the store
router.delete(
  "/:storeId/items/:itemId",
  authenticateUser,
  isValidStore,
  isStoreOwner,
  isValidItem,
  checkItemIsFromStore,
  catchAsync(storeController.deleteItem)
);

// get all orders from your store
router.get(
  "/:storeId/orders",
  authenticateUser,
  isValidStore,
  isStoreOwner,
  catchAsync(storeController.getStoreOrders)
);

// get an order from your store by giving an id
router.get(
  "/:storeId/orders/:orderId",
  authenticateUser,
  isValidStore,
  isStoreOwner,
  catchAsync(storeController.getStoreOrders)
);

// delete order for an item from their store
router.delete(
  "/:storeId/orders/:orderId",
  authenticateUser,
  isValidStore,
  isStoreOwner,
  isValidOrder,
  checkOrderIsFromStore,
  catchAsync(storeController.deleteStoreOrder)
);

module.exports = router;
