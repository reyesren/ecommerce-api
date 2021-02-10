const Joi = require("joi");

module.exports.authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).strict();
