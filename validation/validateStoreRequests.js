const Joi = require("joi");

module.exports.createStoreSchema = Joi.object({
  storeName: Joi.string().required(),
});

module.exports.updateStoreSchema = Joi.object({
  storeName: Joi.string().required(),
});
