import express from "express";
const router = express.Router();
import { searchProducts } from "../controllers/searchController.js";

router.get("/", searchProducts);

export default router;
