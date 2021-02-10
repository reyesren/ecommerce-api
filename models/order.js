const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  purchaserId: { type: Schema.Types.ObjectId, ref: "User" },
  storeId: { type: Schema.Types.ObjectId, ref: "Store" },
  itemId: { type: Schema.Types.ObjectId, ref: "Item" },
  numPurchased: Number,
  amountCharged: Number,
  status: String,
  destination: {
    line1: String,
    line2: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
  },
  dateOrderPlaced: String,
});

module.exports = mongoose.model("Order", OrderSchema);
