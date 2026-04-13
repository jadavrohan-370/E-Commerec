import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const importCsvData = async () => {
  try {
    await connectDB();

    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.error("Admin user not found. Run seeder.js first.");
      process.exit(1);
    }

    const results = [];
    const csvFilePath = path.join(__dirname, "../data/products.csv");

    if (!fs.existsSync(csvFilePath)) {
      console.error(`File not found: ${csvFilePath}`);
      process.exit(1);
    }

    // Helper to strip HTML tags from description
    const stripHtml = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || "";

    const productsMap = new Map();

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        const handle = data['Handle'];
        
        if (!productsMap.has(handle)) {
          // New product entry
          productsMap.set(handle, {
            user: adminUser._id,
            name: data['Title'] || handle,
            brand: data['Vendor'] || "Unknown",
            category: data['Type'] || "General",
            description: stripHtml(data['Body (HTML)']),
            price: parseFloat(data['Variant Price']) || 0,
            discountPrice: parseFloat(data['Variant Compare At Price']) || 0,
            stock: parseInt(data['Variant Inventory Qty']) || 0,
            images: data['Image Src'] ? [data['Image Src']] : [],
            rating: 4.5, // Default for new items
            numReviews: 0
          });
        } else {
          // Existing product (handle variant or extra image)
          const existing = productsMap.get(handle);
          
          // Add image if it exists and isn't already there
          if (data['Image Src'] && !existing.images.includes(data['Image Src'])) {
            existing.images.push(data['Image Src']);
          }
          
          // If this variant has a price and the existing one doesn't (or we want to update)
          if (!existing.price && data['Variant Price']) {
            existing.price = parseFloat(data['Variant Price']);
          }

          // Sum up stock if it's across multiple rows
          if (data['Variant Inventory Qty']) {
            existing.stock += parseInt(data['Variant Inventory Qty']) || 0;
          }
        }
      })
      .on("end", async () => {
        const productsToInsert = Array.from(productsMap.values());
        
        console.log(`Parsed ${productsToInsert.length} unique products from CSV.`);
        
        // Optional: Clear existing products first if requested
        // await Product.deleteMany(); 
        
        const createdProducts = await Product.insertMany(productsToInsert);
        console.log(`${createdProducts.length} Products imported successfully!`);

        // Index in Elasticsearch
        try {
          const { indexProduct } = await import("../services/elasticsearch.js");
          console.log("Indexing products in Elasticsearch...");
          for (const product of createdProducts) {
            await indexProduct(product);
          }
          console.log("Elasticsearch indexing complete.");
        } catch (esError) {
          console.log("Elasticsearch indexing failed, skipping.");
        }
        
        process.exit(0);
      });

  } catch (error) {
    console.error("Error during CSV import:", error.message);
    process.exit(1);
  }
};

importCsvData();
