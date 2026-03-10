
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import { searchProductsES } from "../services/elasticsearch.js";

// @desc    Fetch all products with pagination and search
// @route   GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword;
  let query = {};

  if (keyword) {
    // Try elasticsearch first
    const esResults = await searchProductsES(keyword);
    if (esResults && esResults.length > 0) {
      query = { _id: { $in: esResults } };
    } else {
      // Fallback to mongo text search regex
      query = {
        name: {
          $regex: keyword,
          $options: "i",
        },
      };
    }
  }

  // Handle category filtering
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Handle brand filtering
  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  const count = await Product.countDocuments({ ...query });
  const products = await Product.find({ ...query })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // If the id is not a valid ObjectId, immediately return 404
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Product not found");
  }

  const product = await Product.findById(id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  await indexProduct(createdProduct);
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = image ? [image] : product.images; // simple image update
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    await indexProduct(updatedProduct);
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
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(6);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  getTopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
