import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ArrowRight, ShoppingBag, Heart } from "lucide-react";
import { addToCart, removeFromCart } from "../store/slices/cartSlice";
import Message from "../components/Message";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <ShoppingBag className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-glow transition-all"
              >
                Start Shopping
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="w-28 h-28 shrink-0 bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-slate-900 dark:text-white font-semibold hover:text-primary line-clamp-2 block"
                    >
                      {item.name}
                    </Link>
                    {item.countInStock > 0 ? (
                      <span className="text-xs text-green-600 font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-500 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => item.qty > 1 && addToCartHandler(item, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{item.qty}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => item.qty < item.countInStock && addToCartHandler(item, item.qty + 1)}
                      disabled={item.qty >= item.countInStock}
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">
                      {subtotal > 100 ? "FREE" : "$9.99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tax (10%)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${(subtotal * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-primary">
                        ${(subtotal + (subtotal > 100 ? 0 : 9.99) + subtotal * 0.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {subtotal < 100 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                    <p className="text-sm text-primary font-medium">
                      Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-glow"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>Secure checkout with SSL encryption</span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                    <span>Money Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-lg">support_agent</span>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

