import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const fetchAndSyncFromApi = async () => {
  try {
    console.log("Connecting to Intelligence API (DummyJSON)...");
    const { data } = await axios.get("https://dummyjson.com/products?limit=100");
    const externalProducts = data.products;

    // Get Admin ID for attribution
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.error("Critical Failure: Admin user not found. Run seeder first.");
      process.exit(1);
    }

    console.log(`Located ${externalProducts.length} high-fidelity assets. Initializing sync...`);

    let syncCount = 0;

    for (const item of externalProducts) {
      // Map API fields to our premium schema
      const productData = {
        user: admin._id,
        name: item.title,
        brand: item.brand || "NovaElite",
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        subCategory: item.category,
        price: Math.round(item.price * 82), // Convert to INR
        discountPrice: Math.round((item.price * (1 - item.discountPercentage / 100)) * 82),
        rating: item.rating,
        numberOfReviews: Math.floor(Math.random() * 200) + 20,
        stock: item.stock,
        images: item.images, // Array of URLs from API
        description: item.description,
        warranty: "1 Year International Warranty",
        specifications: {
          "Dimensions": "Standard Product Scale",
          "Material": "Premium Composite",
          "SKU": item.sku,
          "Weight": `${item.weight}g`
        }
      };

      // Upsert: Update if exists by name, else create
      await Product.findOneAndUpdate(
        { name: item.title },
        productData,
        { upsert: true, new: true }
      );
      syncCount++;
    }

    console.log(`Sync Complete: ${syncCount} products updated with live API data & images.`);
    process.exit();
  } catch (error) {
    console.error(`Matrix Sync Error: ${error.message}`);
    process.exit(1);
  }
};

fetchAndSyncFromApi();
