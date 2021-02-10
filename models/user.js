const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  shippingAddress: {
    line1: String,
    line2: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
  },
  balance: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(require("mongoose-bcrypt"));
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
