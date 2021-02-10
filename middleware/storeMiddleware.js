const ExpressError = require("../utils/ExpressError");
const Store = require("../models/store");
const catchAsync = require("../utils/catchAsync");
const { isValidMongooseId, validateBody } = require("../utils/utility");
const {
  createStoreSchema,
  updateStoreSchema,
} = require("../validation/validateStoreRequests");

const isValidStore = catchAsync(async (req, res, next) => {
  const { storeId } = req.params;
  isValidMongooseId(storeId);
  const foundStore = await Store.findById(storeId);
  if (!foundStore)
    throw new ExpressError("Cannot find a store with that id!", 400);
  else {
    req.store = foundStore;
    next();
  }
});

const isStoreOwner = (req, res, next) => {
  const storeOwner = req.store.ownerId;
  const ownerToCheck = req.userId;
  if (ownerToCheck != storeOwner)
    throw new ExpressError(
      "This is not your store, you don't have permission to do that!",
      403
    );
  next();
};

const validateCreateStoreReq = (req, res, next) => {
  validateBody(req, res, next, createStoreSchema);
};

const validateUpdateStoreReq = (req, res, next) => {
  validateBody(req, res, next, updateStoreSchema);
};

module.exports = {
  isValidStore: isValidStore,
  isStoreOwner: isStoreOwner,
  validateCreateStoreReq: validateCreateStoreReq,
  validateUpdateStoreReq: validateUpdateStoreReq,
};
