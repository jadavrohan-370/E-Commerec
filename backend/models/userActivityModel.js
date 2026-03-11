import mongoose from "mongoose";

const userActivitySchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    searchedCategories: [{ type: String }],
    purchasedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

const UserActivity = mongoose.model("UserActivity", userActivitySchema);
export default UserActivity;
