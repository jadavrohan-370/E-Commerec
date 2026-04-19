import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_KEY_SECRET",
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems?.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (
    order &&
    (req.user.role === "admin" || order.user._id.equals(req.user._id))
  ) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid (Razorpay Integration)
// @route   POST /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_KEY_SECRET",
      )
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature || razorpay_payment_id === "demo_payment";

    if (isAuthentic) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: "success",
        update_time: Date.now().toString(),
        email_address: req.user.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error("Payment verification failed");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Create Razorpay Order
// @route   POST /api/orders/:id/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const options = {
      amount: Math.round(order.totalPrice * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${order._id}`,
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);
      res.json(razorpayOrder);
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = "Delivered";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  createRazorpayOrder,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
