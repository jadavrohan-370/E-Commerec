import mongoose from "mongoose";

const userActivitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    activityType: {
      type: String,
    },
    viewedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    searchedCategories: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
