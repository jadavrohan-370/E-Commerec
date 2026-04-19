import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";
import { checkElasticsearchConnection, setupIndex, indexProduct } from "../services/elasticsearch.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const syncES = async () => {
  try {
    await connectDB();
    await checkElasticsearchConnection();
    await setupIndex();

    console.log("Starting to sync MongoDB to Elasticsearch...");
    
    const totalProducts = await Product.countDocuments();
    console.log(`Found ${totalProducts} products to sync.`);

    let synced = 0;
    let failed = 0;

    const cursor = Product.find().cursor();
    
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      try {
        await indexProduct(doc);
        synced++;
        if (synced % 100 === 0) {
          console.log(`Synced ${synced}/${totalProducts} products...`);
        }
      } catch (err) {
        console.error(`Failed to index product ${doc._id}: ${err.message}`);
        failed++;
      }
    }

    console.log(`Sync process completed. Successfully synced: ${synced}, Failed: ${failed}`);
    process.exit(0);

  } catch (error) {
    console.error("Error during sync:", error.message);
    process.exit(1);
  }
};

syncES();
