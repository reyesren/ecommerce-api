const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const Item = require("../models/item");
const catchAsync = require("../utils/catchAsync");
const {
  isValidMongooseId,
  validateBody,
  validateQueryParams,
} = require("../utils/utility");
const {
  createItemSchema,
  updateItemSchema,
  getItemByQuerySchema,
} = require("../validation/validateItemRequests");

const isValidItem = catchAsync(async (req, res, next) => {
  let itemId;
  if (!req.body.itemId) itemId = req.params.itemId;
  else itemId = req.body.itemId;
  isValidMongooseId(itemId);
  const foundItem = await Item.findById(itemId);
  if (!foundItem)
    throw new ExpressError("Cannot find an item with that id!", 400);
  else {
    req.item = foundItem;
    next();
  }
});

const verifyItemBelongsToStore = catchAsync(async (req, res, next) => {
  if (req.item.storeId != req.body.storeId)
    throw new ExpressError("This item does not belong to this store!", 400);
  next();
});

const verifyAndCompletePurchaseTransaction = catchAsync(
  async (req, res, next) => {
    const purchaser = await User.findById(req.userId);
    const itemToPurchase = req.item;
    if (itemToPurchase.quantity < req.body.numPurchased)
      throw new ExpressError(
        "There is not enough of this item in stock to complete the order!",
        400
      );
    else if (
      purchaser.balance <
      req.body.numPurchased * itemToPurchase.unitPrice
    )
      throw new ExpressError(
        "You do not have enough money to make this purchase.",
        400
      );
    else {
      itemToPurchase.quantity = itemToPurchase.quantity - req.body.numPurchased;
      purchaser.balance =
        purchaser.balance - req.body.numPurchased * itemToPurchase.unitPrice;
      await itemToPurchase.save();
      await purchaser.save();
      next();
    }
  }
);

const checkItemIsFromStore = (req, res, next) => {
  if (req.item.storeId != req.params.storeId)
    throw new ExpressError("This item does not belong to your store!", 400);
  next();
};

const validateGetItemByQueryReq = (reqParams) => {
  console.log(reqParams);
  validateQueryParams(reqParams, getItemByQuerySchema);
};

const validateCreateItemReq = (req, res, next) => {
  validateBody(req, res, next, createItemSchema);
};

const validateUpdateItemReq = (req, res, next) => {
  validateBody(req, res, next, updateItemSchema);
};

module.exports = {
  isValidItem: isValidItem,
  verifyItemBelongsToStore: verifyItemBelongsToStore,
  verifyAndCompletePurchaseTransaction: verifyAndCompletePurchaseTransaction,
  validateCreateItemReq,
  validateUpdateItemReq,
  validateGetItemByQueryReq,
  checkItemIsFromStore,
};
