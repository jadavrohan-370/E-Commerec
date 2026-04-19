import express from "express";
import {
  getProducts,
  getProductById,
  getTrendingProducts,
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @route   GET /api/products/trending
 * @desc    Get trending products
 * @access  Public
 */
router.get("/trending", getTrendingProducts);

/**
 * @route   GET /api/products
 * @desc    Get all products
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 */
router.get("/:id", getProductById);

export default router;