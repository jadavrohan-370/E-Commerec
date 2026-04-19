import path from "node:path";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";


const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const clearProducts = async () => {
  try {
    await connectDB();

    console.log("Removing all orders (linked to products)...");
    await Order.deleteMany();

    console.log("Removing all products from MongoDB...");
    await Product.deleteMany();

    // 2. Clear Redis Cache
    try {
      const { default: redisClient } = await import("../config/redis.js");
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      console.log("Flushing Redis cache...");
      await redisClient.flushAll();
      console.log("Redis cache cleared.");
    } catch (redisError) {
      console.warn("Redis not available, skipping cache clear.", redisError.message);
    }

    // 3. Clear Elasticsearch if configured
    try {
      const { Client } = await import("@elastic/elasticsearch");
      const esClient = new Client({
        node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
        auth: process.env.ELASTICSEARCH_API_KEY 
          ? { apiKey: process.env.ELASTICSEARCH_API_KEY } 
          : undefined
      });
      console.log("Cleaning Elasticsearch index...");
      await esClient.indices.delete({ index: "products", ignore_unavailable: true });
      await esClient.indices.create({ index: "products" });
      console.log("Elasticsearch synced.");
    } catch (esError) {
      console.warn("Elasticsearch not available or not configured, skipping ES clear.", esError.message);
    }

    console.log("SUCCESS: Website products have been cleared.");
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

clearProducts();
