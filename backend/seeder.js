import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import UserActivity from "./models/userActivityModel.js";
import connectDB from "./config/db.js";
import { indexProduct } from "./services/elasticsearch.js";
import { generateProducts } from "./utils/generateProducts.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await UserActivity.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log("Generating 1000 products...");
    const products = generateProducts(1000, adminUser);

    console.log("Inserting products to MongoDB...");
    const insertedProducts = await Product.insertMany(products);

    console.log("Indexing products to Elasticsearch...");
    // We can't index 1000 products synchronously easily if ES is not running or slow, 
    // but we'll try in batches of 100
    for (let i = 0; i < insertedProducts.length; i += 100) {
      const batch = insertedProducts.slice(i, i + 100);
      await Promise.all(batch.map(prod => indexProduct(prod)));
      console.log(`Indexed ${i + batch.length} products...`);
    }

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await UserActivity.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
