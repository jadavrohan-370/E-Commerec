import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Trash2,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import { removeFromWishlist } from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import { motion as Motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const dispatch = useDispatch();

  const { wishlistItems } = useSelector((state) => state.wishlist);

  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const addToCartHandler = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-12 border-b pb-8">
          <div className="flex flex-col gap-2">
            <Link
              to="/products"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ChevronLeft size={14} /> Back to shop
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Your Wishlist
            </h1>
          </div>
          <span className="text-xl font-medium text-muted-foreground">
            ({wishlistItems.length} items)
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
              Your wishlist is empty.
            </h2>
            <p className="text-muted-foreground mb-12 max-w-md text-lg">
              Save items you love to find them easily later and keep track of
              what you want.
            </p>
            <Link
              to="/products"
              className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-bold shadow-2xl hover:opacity-90 transition-all active:scale-95"
            >
              Explore Products
            </Link>
          </Motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item) => (
                <Motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item._id}
                  className="bg-secondary/10 border rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-square bg-white flex items-center justify-center p-8 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={() => removeFromWishlistHandler(item._id)}
                      className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full text-destructive shadow-sm hover:bg-destructive hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                        {item.brand || "Premium Edition"}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight hover:text-primary transition-colors leading-snug">
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <span className="text-2xl font-medium">
                        ₹{item.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCartHandler(item)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all active:scale-95"
                      >
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
