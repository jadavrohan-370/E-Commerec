import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus, ChevronLeft } from "lucide-react";
import { addToCart, removeFromCart } from "../store/slices/cartSlice";
import { motion as Motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-12 border-b pb-8">
           <div className="flex flex-col gap-2">
              <Link to="/products" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-2">
                 <ChevronLeft size={14} /> Back to shop
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Your Bag</h1>
           </div>
           <span className="text-xl font-medium text-muted-foreground">({itemCount} items)</span>
        </div>

        {cartItems.length === 0 ? (
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-8">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Nothing here... yet.</h2>
            <p className="text-muted-foreground mb-12 max-w-md text-lg">
              Explore our latest arrivals and find something that speaks to your aesthetic.
            </p>
            <Link
              to="/products"
              className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-bold shadow-2xl hover:opacity-90 transition-all active:scale-95"
            >
              Start Searching
            </Link>
          </Motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <Motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-8 pb-8 border-b group"
                  >
                    {/* Image Container */}
                    <Link 
                      to={`/product/${item._id}`}
                      className="w-full sm:w-48 aspect-4/5 bg-secondary/30 rounded-3xl overflow-hidden shrink-0 border"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-4 mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700"
                      />
                    </Link>

                    {/* Content Container */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="max-w-md">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                             {item.brand || 'Premium Edition'}
                          </span>
                          <h3 className="text-xl font-bold tracking-tight hover:text-primary transition-colors leading-snug">
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                          </h3>
                        </div>
                        <span className="text-2xl font-medium">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
                        {/* Quantity Selector */}
                        <div className="flex items-center border rounded-full p-0.5 bg-secondary/50">
                          <button
                            onClick={() => item.qty > 1 && addToCartHandler(item, item.qty - 1)}
                            className="p-3 rounded-full hover:bg-background transition-colors disabled:opacity-30"
                            disabled={item.qty <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-sm">{item.qty}</span>
                          <button
                            onClick={() => item.qty < item.countInStock && addToCartHandler(item, item.qty + 1)}
                            className="p-3 rounded-full hover:bg-background transition-colors disabled:opacity-30"
                            disabled={item.qty >= item.countInStock}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                           <button 
                             onClick={() => removeFromCartHandler(item._id)}
                             className="text-muted-foreground hover:text-destructive flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
                           >
                              <Trash2 size={14} /> Remove
                           </button>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-secondary/20 rounded-4xl border p-10 sticky top-32">
                <h2 className="text-3xl font-bold tracking-tighter mb-10">Summary</h2>

                <div className="space-y-6">
                  <div className="flex justify-between items-center gap-4 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Subtotal</span>
                    <span className="text-xl font-medium text-foreground">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Shipping</span>
                    <span className="text-sm font-bold text-primary">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between items-center gap-4 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Tax</span>
                    <span className="text-sm font-medium">₹{(subtotal * 0.12).toLocaleString()}</span>
                  </div>
                  
                  <div className="h-px bg-border my-8" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <span className="text-sm font-bold uppercase tracking-widest mb-1">Total</span>
                    <span className="text-3xl md:text-4xl font-bold tracking-tighter break-all">₹{(subtotal + subtotal * 0.12).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-12 space-y-4">
                  <button
                    className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold text-lg tracking-tight hover:opacity-90 shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    onClick={checkoutHandler}
                  >
                    Checkout Securely
                    <ArrowRight size={20} />
                  </button>
                  <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] pt-4">
                     🔒 256-Bit SSL Encrypted 
                  </p>
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
