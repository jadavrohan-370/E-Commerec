import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    rating: { type: Number, required: true, default: 0 },
    numberOfReviews: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    specifications: {
      type: Map,
      of: String,
    },
    description: { type: String, required: true },
    warranty: { type: String },
    salesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Create indexes for high performance queries
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: 1 });
productSchema.index({ name: "text", description: "text", brand: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
