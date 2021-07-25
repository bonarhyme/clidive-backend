const mongoose = require("mongoose");

const listingsSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    poster: { type: Object, required: true },
    location: {
      type: String,
      required: true,
    },
    seenCounter: { type: Number, default: 0 },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ListingsModel = mongoose.model("Listing", listingsSchema);

module.exports = ListingsModel;
