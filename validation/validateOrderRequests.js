const Joi = require("joi");

module.exports.createOrderSchema = Joi.object({
  itemId: Joi.string().required(),
  storeId: Joi.string().required(),
  numPurchased: Joi.number().min(0).required(),
}).strict();
