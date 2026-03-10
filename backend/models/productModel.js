import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Admin who added
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    specifications: {
      type: Map,
      of: String,
    },
    variants: [
      {
        color: { type: String },
        storage: { type: String },
        model: { type: String },
        priceAdjustment: { type: Number, default: 0 },
        inStock: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true },
);

// Create text index for search
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
});

const Product = mongoose.model("Product", productSchema);
export default Product;
