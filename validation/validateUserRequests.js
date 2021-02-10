const Joi = require("joi");

module.exports.updateBalanceSchema = Joi.object({
  changeBy: Joi.number().required(),
}).strict();

module.exports.updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  shippingAddress: Joi.object({
    line1: Joi.string(),
    line2: Joi.string(),
    city: Joi.string(),
    province: Joi.string(),
    postalCode: Joi.string(),
    country: Joi.string(),
  }),
  password: Joi.string().min(6),
}).strict();

module.exports.createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  shippingAddress: Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string(),
    city: Joi.string().required(),
    province: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  balance: Joi.number().min(0).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).strict();
