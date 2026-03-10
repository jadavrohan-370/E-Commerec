import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  createRazorpayOrder,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").post(protect, updateOrderToPaid);
router.route("/:id/razorpay").post(protect, createRazorpayOrder);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
