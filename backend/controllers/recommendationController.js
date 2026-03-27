import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import UserActivity from "../models/userActivityModel.js";
import { getFromCache, setInCache } from "../services/redisCacheService.js";

// @desc    Get popular products (highest sales)
// @route   GET /api/products/popular
// @access  Public
const getPopularProducts = asyncHandler(async (req, res) => {
  const cacheKey = "popular_products";
  const cachedData = await getFromCache(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const products = await Product.find({})
    .sort({ salesCount: -1 })
    .limit(10);

  await setInCache(cacheKey, products, 3600); // cache for 1 hour
  res.json(products);
});

// @desc    Get trending products (highest views)
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = asyncHandler(async (req, res) => {
  console.log("Fetching trending products...");
  const cacheKey = "trending_products";
  const cachedData = await getFromCache(cacheKey);

  if (cachedData) {
    console.log("Returning trending products from cache");
    return res.json(cachedData);
  }

  try {
    const products = await Product.find({})
      .sort({ viewsCount: -1 })
      .limit(Number(req.query.limit) || 10);
    
    console.log(`Found ${products.length} trending products`);
    await setInCache(cacheKey, products, 1800);
    res.json(products);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    res.status(500);
    throw new Error(`Trending fetch failed: ${error.message}`);
  }
});

// @desc    Get similar products
// @route   GET /api/products/similar/:productId
// @access  Public
const getSimilarProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const products = await Product.find({
    _id: { $ne: productId },
    $or: [{ category: product.category }, { brand: product.brand }],
  })
    .limit(10);

  res.json(products);
});

// @desc    Get personalized recommendations
// @route   GET /api/products/recommended/:userId
// @access  Private
const getPersonalizedRecommendations = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const activity = await UserActivity.findOne({ userId });

  if (!activity || !activity.searchedCategories.length) {
    // Fallback to top rated if no activity
    const products = await Product.find({}).sort({ rating: -1 }).limit(10);
    return res.json(products);
  }

  // Count occurrences of each category in viewed and searched
  const categoryFreq = {};
  activity.searchedCategories.forEach(cat => categoryFreq[cat] = (categoryFreq[cat] || 0) + 1);
  
  // Find top categories
  const topCategories = Object.keys(categoryFreq).sort((a,b) => categoryFreq[b] - categoryFreq[a]).slice(0, 3);

  const products = await Product.find({
    category: { $in: topCategories }
  })
    .sort({ rating: -1 })
    .limit(10);

  res.json(products);
});

export {
  getPopularProducts,
  getTrendingProducts,
  getSimilarProducts,
  getPersonalizedRecommendations
};
