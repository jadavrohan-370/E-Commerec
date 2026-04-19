import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import UserActivity from "../models/userActivityModel.js";
import { indexProduct, deleteProductFromES } from "../services/elasticsearch.js";
import { getFromCache, setInCache, deleteFromCache } from "../services/redisCacheService.js";
import jwt from "jsonwebtoken";
// @desc    Fetch all products with pagination and filter
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;

  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.brand) query.brand = req.query.brand;
  if (req.query.rating) query.rating = { $gte: Number(req.query.rating) };
  if (req.query.price) {
    query.price = { $lte: Number(req.query.price) };
  }

  const cacheKey = `products_p${page}_l${limit}_${JSON.stringify(query)}`;
  const cached = await getFromCache(cacheKey);
  if (cached) return res.json(cached);

  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 });

  const response = {
    page,
    limit,
    totalProducts,
    products,
  };

  await setInCache(cacheKey, response, 300); // 5 mins cache
  res.json(response);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const cacheKey = `product_${productId}`;
  let product = await getFromCache(cacheKey);

  if (!product) {
    product = await Product.findById(productId);
  }

  if (product) {
    // Increment views asynchronously
    Product.findByIdAndUpdate(productId, { $inc: { viewsCount: 1 } }).exec();
    
    // TRACK USER ACTIVITY IF LOGGED IN
    const token = req.cookies.jwt;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        await UserActivity.findOneAndUpdate(
          { userId },
          { 
            $addToSet: { 
              viewedProducts: productId,
              searchedCategories: product.category 
            } 
          },
          { upsert: true }
        );
      } catch (err) {
        console.warn("Invalid token during activity tracking:", err.message);
      }
    }

    await setInCache(cacheKey, product, 600);
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, category, subCategory, price, stock, description, specifications, images, warranty } = req.body;

  const product = new Product({
    name,
    brand,
    category,
    subCategory,
    price,
    stock,
    description,
    specifications,
    images: images || [],
    warranty,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  await indexProduct(createdProduct);
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    
    await indexProduct(updatedProduct);
    await deleteFromCache(`product_${req.params.id}`);
    
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    await deleteProductFromES(product._id);
    await deleteFromCache(`product_${req.params.id}`);
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export { getTrendingProducts } from "./recommendationController.js";
