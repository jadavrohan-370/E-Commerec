import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { fetchProductById } from "../api/productApi";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  Heart,
  Share2,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import PropTypes from "prop-types";

const MotionDiv = Motion.div;

const ProductDetails = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.find((x) => x._id === productId);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
        setMainImage(data.images?.[0] || "");
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const wishlistHandler = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const shareHandler = async () => {
    const shareData = {
      title: product?.name,
      text: `Check out this product: ${product?.name}`,
      url: globalThis.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } else {
        await navigator.clipboard.writeText(globalThis.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error("Error sharing product");
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 pt-32">
        <Message variant="danger">{error}</Message>
      </div>
    );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link to="/products" className="hover:text-primary transition-colors">
            Lab
          </Link>
          <ChevronRight size={10} />
          <span className="text-primary truncate max-w-[200px]">
            {product?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Left Column: Media */}
          <div className="lg:col-span-7">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square md:aspect-4/5 rounded-[40px] bg-secondary/30 overflow-hidden group border shadow-sm"
            >
              <img
                src={mainImage || "https://via.placeholder.com/1000"}
                alt={product?.name}
                className="w-full h-full object-contain p-8 md:p-12 mix-blend-multiply transition-transform duration-1000"
              />
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                <button
                  onClick={wishlistHandler}
                  className={`p-4 bg-background rounded-2xl shadow-xl transition-all active:scale-95 border ${isWishlisted ? "text-primary" : "hover:text-primary"}`}
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? "fill-primary" : ""}
                  />
                </button>
                <button
                  onClick={shareHandler}
                  className="p-4 bg-background rounded-2xl shadow-xl hover:text-primary transition-all active:scale-95 border"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </MotionDiv>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              {product?.images?.map((img) => (
                <button
                  key={img}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-2xl bg-secondary/50 border overflow-hidden transition-all p-2 hover:border-primary ${mainImage === img ? "border-primary ring-2 ring-primary/20" : ""}`}
                >
                  <img
                    src={img}
                    alt={product?.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                {product?.brand} / {product?.category}
              </span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-primary text-primary" />
                <span className="text-sm font-black">{product?.rating}</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-2">
                  ({product?.numberOfReviews} Verified Reviews)
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.95] uppercase">
              {product?.name}
            </h1>

            <div className="flex items-baseline gap-6 mb-10 pb-10 border-b">
              <span className="text-5xl font-medium tracking-tighter">
                ₹
                {(
                  product?.discountPrice ||
                  product?.price ||
                  0
                ).toLocaleString()}
              </span>
              {product?.discountPrice < product?.price && (
                <span className="text-xl text-muted-foreground line-through italic opacity-50">
                  ₹{(product?.price || 0).toLocaleString()}
                </span>
              )}
            </div>

            <div className="space-y-10 mb-12">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product?.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailFeature
                  icon={<Truck size={20} />}
                  title="Next Day Delivery"
                  sub="Elite members only"
                />
                <DetailFeature
                  icon={<ShieldCheck size={20} />}
                  title="Extended Warranty"
                  sub={product?.warranty || "2 Year Protection"}
                />
              </div>
            </div>

            {/* Selection Area */}
            <div className="mt-auto space-y-8">
              <div className="flex items-center justify-between p-6 bg-secondary/20 rounded-3xl border border-transparent hover:border-border transition-colors group">
                <span className="text-xs font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                  Inventory Status
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${product?.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {product?.stock > 0
                      ? `${product?.stock} Ready To Ship`
                      : "Sold Out"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex items-center border rounded-2xl bg-secondary/50 p-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold hover:bg-background transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 font-black">{qty}</span>
                    <button
                      onClick={() =>
                        setQty((q) => Math.min(product?.stock || 1, q + 1))
                      }
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold hover:bg-background transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={addToCartHandler}
                    disabled={product?.stock === 0}
                    className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                      product?.stock === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/20 active:scale-95"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {product?.stock === 0
                      ? "Out Of Range"
                      : "Initiate Purchase"}
                  </button>
                </div>

                <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <Zap size={10} className="fill-amber-500 text-amber-500" />{" "}
                  Secure Encryption • Zero Interest Financing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Specifications Hub */}
        <div className="mt-32">
          <div className="flex gap-16 border-b mb-16 overflow-x-auto no-scrollbar">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-8 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? "text-primary" : "text-muted-foreground/50 hover:text-foreground"}`}
              >
                {tab}
                {activeTab === tab && (
                  <MotionDiv
                    layoutId="detail-tab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === "description" && (
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <p className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                  Unleash absolute productivity with the {product?.name}.
                  Engineered for those who refuse to compromise on potential.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product?.description}
                </p>
              </MotionDiv>
            )}

            {activeTab === "specifications" && (
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10"
              >
                {product?.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col gap-2 pb-6 border-b border-dashed"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {key}
                      </span>
                      <span className="font-bold text-lg">{value}</span>
                    </div>
                  ))}
                {!product?.specifications && (
                  <p className="text-muted-foreground italic">
                    Standard flagship specifications apply.
                  </p>
                )}
              </MotionDiv>
            )}

            {activeTab === "reviews" && (
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-12 mb-16 px-10 py-12 bg-secondary/20 rounded-[40px] border">
                  <div className="text-center">
                    <span className="text-6xl font-black text-primary">
                      {product?.rating}
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mt-2">
                      Collective Score
                    </p>
                  </div>
                  <div className="h-20 w-px bg-border" />
                  <div>
                    <Rating value={product?.rating} />
                    <p className="text-sm font-bold mt-4 tracking-tight">
                      Based on {product?.numberOfReviews} performance
                      benchmarks.
                    </p>
                  </div>
                </div>

                <div className="space-y-12">
                  {/* We might not have full reviews in the new schema, but we'll show a placeholder or map existing ones if available */}
                  <p className="text-muted-foreground italic">
                    Product testing feedback from verified owners...
                  </p>
                </div>
              </MotionDiv>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailFeature = ({ icon, title, sub }) => (
  <div className="flex items-center gap-5 p-6 rounded-3xl border border-transparent hover:border-border transition-all hover:bg-secondary/20 group">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
      {icon}
    </div>
    <div>
      <h4 className="text-xs font-black uppercase tracking-widest">{title}</h4>
      <p className="text-[10px] font-bold text-muted-foreground mt-1">{sub}</p>
    </div>
  </div>
);

DetailFeature.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  sub: PropTypes.string,
};

export default ProductDetails;
