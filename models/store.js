const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  storeName: String,
  ownerId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Store", StoreSchema);
