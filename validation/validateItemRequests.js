const Joi = require("joi");

module.exports.createItemSchema = Joi.object({
  itemName: Joi.string().required(),
  description: Joi.string().required(),
  unitPrice: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
}).strict();

module.exports.getItemByQuerySchema = Joi.object({
  itemName: Joi.string().required(),
  itemDescription: Joi.string().required(),
}).strict();

module.exports.updateItemSchema = Joi.object({
  itemName: Joi.string(),
  description: Joi.string(),
  quantity: Joi.number().min(0),
}).strict();
