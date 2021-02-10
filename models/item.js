const mongoose = require("mongoose");
const { updateIfCurrentPlugin } = require("mongoose-update-if-current");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  storeId: { type: Schema.Types.ObjectId, ref: "Store" },
  itemName: String,
  description: String,
  unitPrice: Number,
  quantity: Number,
});

ItemSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model("Item", ItemSchema);
