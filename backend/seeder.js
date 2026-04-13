import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import UserActivity from "./models/userActivityModel.js";
import connectDB from "./config/db.js";
import { indexProduct } from "./services/elasticsearch.js";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "backend", ".env") });

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await UserActivity.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const dbJsonPath = path.join(__dirname, "backend", "data", "db.json");
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));
    const products = dbData.products.map((product) => {
      // Map db.json fields to Mongoose schema names
      const { _id, numberOfReviews, rating, ...rest } = product;
      return { 
        ...rest, 
        user: adminUser,
        numReviews: Number(numberOfReviews) || 0,
        rating: Number(rating) || 0
      };
    });

    console.log(`Importing ${products.length} products to MongoDB...`);
    const insertedProducts = await Product.insertMany(products);

    console.log("Indexing products to Elasticsearch...");
    // Batch indexing for performance
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

