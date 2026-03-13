import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.find((x) => x._id === product._id);

  const wishlistHandler = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const shareHandler = async (e) => {
    e.preventDefault();
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: `${window.location.origin}/product/${product._id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/product/${product._id}`);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error("Error sharing product");
      }
    }
  };
  return (
    <div className="bg-background rounded-3xl transition-all duration-500 overflow-hidden border border-border flex flex-col h-full group hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
      <Link
        to={`/product/${product._id}`}
        className="block relative aspect-square overflow-hidden bg-secondary/20"
      >
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
          alt={product.name}
        />
        {product.price > product.discountPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
            SALE
          </div>
        )}
        <div className="absolute top-4 right-4 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all flex flex-col gap-2">
          <button 
            onClick={wishlistHandler}
            className={`p-2 bg-background/80 backdrop-blur rounded-full shadow-lg transition-all active:scale-95 ${isWishlisted ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-primary' : ''} />
          </button>
          <button 
            onClick={shareHandler}
            className="p-2 bg-background/80 backdrop-blur rounded-full shadow-lg text-muted-foreground hover:text-primary transition-all active:scale-95"
          >
            <Share2 size={16} />
          </button>
          <div className="p-2 bg-background/80 backdrop-blur rounded-full shadow-lg text-primary">
            <Star size={16} className="fill-current" />
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-primary text-primary" />
            <span className="text-xs font-bold">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-foreground font-bold tracking-tight line-clamp-2 hover:text-primary transition-colors mb-4 text-lg leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-xs text-muted-foreground line-through italic">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            className={`p-3 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
