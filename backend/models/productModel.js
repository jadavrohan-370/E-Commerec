import mongoose from "mongoose";
import { indexProduct, deleteProductFromES } from "../services/elasticsearch.js";



const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Compound and single-field indexes designed for scaling High Query Load
productSchema.index({ category: 1, rating: -1 });
productSchema.index({ brand: 1, price: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Fallback MongoDB text index
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  brand: "text",
});

// Middleware to sync with Elasticsearch automatically
productSchema.post("save", async function (doc, next) {
  try {
    if (doc) {
      await indexProduct(doc);
    }
    next();
  } catch (error) {
    console.error("Error indexing to Elasticsearch on save:", error.message);
    next(error);
  }
});

productSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc) {
      await indexProduct(doc);
    }
    next();
  } catch (error) {
    console.error("Error indexing to Elasticsearch on findOneAndUpdate:", error.message);
    next(error);
  }
});

productSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    if (doc) {
      await deleteProductFromES(doc._id);
    }
    next();
  } catch (error) {
    console.error("Error deleting from Elasticsearch on findOneAndDelete:", error.message);
    next(error);
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
