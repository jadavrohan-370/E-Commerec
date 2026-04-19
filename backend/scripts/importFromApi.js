import axios from "axios";
import path from "node:path";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const fetchAndAddProduct = async () => {
  try {
    await connectDB();

    // 1. Get an admin user to associate with the product
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.error("Admin user not found. Please run seeder.js first.");
      process.exit(1);
    }

    // 2. API Options
    const options = {
      method: 'GET',
      url: 'https://product-search-api.p.rapidapi.com/products/3301658752573219491',
      params: { country: 'us' },
      headers: {
        'x-rapidapi-key': '990c0e871bmshad579755580380bp174c68jsn70831f0b3dc7',
        'x-rapidapi-host': 'product-search-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };

    console.log("Fetching product from API...");
    const response = await axios.request(options);
    const apiData = response.data;

    // 3. Map API data to our Product Model
    // Note: Adjust the mapping based on the actual API response structure
    const productData = {
      user: adminUser._id,
      name: apiData.title || apiData.name || "API Product",
      brand: apiData.brand || "Generic",
      category: apiData.category || "General",
      description: apiData.description || "No description available",
      price: apiData.price?.amount || apiData.price || 0,
      discountPrice: apiData.price?.amount || apiData.price || 0,
      stock: apiData.stock || 10,
      rating: apiData.rating || 0,
      numReviews: apiData.reviews_count || 0,
      images: apiData.images || (apiData.image ? [apiData.image] : []),
    };

    // If images is empty, add a placeholder
    if (productData.images.length === 0) {
      productData.images = ["https://via.placeholder.com/800"];
    }

    console.log(`Adding product: ${productData.name}`);
    
    // 4. Save to MongoDB
    const product = new Product(productData);
    const createdProduct = await product.save();

    console.log("Product added successfully:", createdProduct._id);
    process.exit(0);
  } catch (error) {
    console.error("Error fetching or adding product:", error.message);
    if (error.response) {
      console.error("API Response Data:", error.response.data);
    }
    process.exit(1);
  }
};

fetchAndAddProduct();
