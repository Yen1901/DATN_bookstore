const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);