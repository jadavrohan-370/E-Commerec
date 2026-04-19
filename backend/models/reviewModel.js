import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
      index: true, // Critical for scaling
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// We add an index to scale the product reviews query
reviewSchema.index({ product: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
