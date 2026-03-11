import express from "express";
const router = express.Router();
import {
  getPopularProducts,
  getTrendingProducts,
  getSimilarProducts,
  getPersonalizedRecommendations
} from "../controllers/recommendationController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.get("/popular", getPopularProducts);
router.get("/trending", getTrendingProducts);
router.get("/similar/:productId", getSimilarProducts);
router.get("/recommended/:userId", protect, getPersonalizedRecommendations);

export default router;
