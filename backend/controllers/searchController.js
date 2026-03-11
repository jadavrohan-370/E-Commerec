import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { searchProductsES } from "../services/elasticsearch.js";

// @desc    Search products using Elasticsearch
// @route   GET /api/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const filters = {
    category: req.query.category,
    brand: req.query.brand,
  };

  if (!query) {
    res.status(400);
    throw new Error("Query text is required");
  }

  // Get matching IDs from Elasticsearch
  const esIds = await searchProductsES(query, filters);

  if (esIds.length > 0) {
    const products = await Product.find({ _id: { $in: esIds } });
    // Sort products in the order returned by ES
    const sortedProducts = esIds.map(id => products.find(p => p._id.toString() === id)).filter(p => p);
    
    return res.json({
      total: sortedProducts.length,
      products: sortedProducts
    });
  }

  // Fallback to MongoDB text search if ES fails or returns no results
  const mongoQuery = {
    $text: { $search: query }
  };
  if (filters.category) mongoQuery.category = filters.category;
  if (filters.brand) mongoQuery.brand = filters.brand;

  const products = await Product.find(mongoQuery).limit(20);
  
  res.json({
    total: products.length,
    products
  });
});

export { searchProducts };
