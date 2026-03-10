import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Grid3X3,
  List,
} from "lucide-react";
import { useGetProductsQuery } from "../store/slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductListing = () => {
  const { category } = useParams() || { category: "laptops" };

  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 5000],
    rating: 0,
    sortBy: "popular",
  });

  // Fetch products from backend
  const {
    data,
    isLoading,
    error,
  } = useGetProductsQuery({ category, pageNumber: 1 });

  const products = data?.products || [];

  const brands = ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Razer"];
  const priceRanges = [
    { label: "Under $500", min: 0, max: 500 },
    { label: "$500 - $1000", min: 500, max: 1000 },
    { label: "$1000 - $2000", min: 1000, max: 2000 },
    { label: "$2000+", min: 2000, max: 10000 },
  ];

  const toggleBrand = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
  };

  const pageTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
    : "All Products";

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < Math.floor(rating) ? "fill-primary text-primary" : "text-slate-300"}`}
        fill={i < Math.floor(rating) ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-purple-600 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {pageTitle}
            </h1>
            <p className="text-white/80 text-lg">
              Discover the latest {pageTitle.toLowerCase()} with cutting-edge technology and unbeatable prices
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-white/90">
                <span className="material-symbols-outlined">verified</span>
                <span className="text-sm font-medium">Official Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="material-symbols-outlined">local_shipping</span>
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="material-symbols-outlined">replay</span>
                <span className="text-sm font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:border-primary transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
            <span className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{products.length}</span> products found
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:border-primary focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            {/* View Toggle */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-slate-400 hover:text-primary"}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-slate-400 hover:text-primary"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16 w-full">
            <Loader />
          </div>
        ) : error ? (
          <div className="w-full">
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          </div>
        ) : (
          <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className={`hidden lg:block w-64 flex-shrink-0`}>
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => setFilters({ brands: [], priceRange: [0, 5000], rating: 0, sortBy: "popular" })}
                  className="text-sm text-primary hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                        onChange={() => setFilters({ ...filters, priceRange: [range.min, range.max] })}
                        className="border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, rating })}
                      className={`flex items-center gap-2 w-full px-2 py-1 rounded-lg transition-colors ${
                        filters.rating === rating 
                          ? "bg-primary/10 text-primary" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex">{renderStars(rating)}</div>
                      <span className="text-sm">{rating}+ Stars</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Mobile Filters Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
                <div className="sticky top-0 bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2">
                    <X size={24} className="text-slate-500" />
                  </button>
                </div>
                <div className="p-4 space-y-6">
                  {/* Same filters as desktop */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Brand</h3>
                    <div className="flex flex-wrap gap-2">
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            filters.brands.includes(brand)
                              ? "bg-primary text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                  <button
                    onClick={() => setFilters({ brands: [], priceRange: [0, 5000], rating: 0, sortBy: "popular" })}
                    className="flex-1 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products?.map((product) => {
                  const safeId = product?._id || product?.id;
                  if (!safeId) return null;
                  return (
                  <div
                    key={safeId}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-slate-50 dark:bg-slate-800 p-6">
                      {product.badge && (
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                          product.badge === "Best Seller" 
                            ? "bg-primary text-white"
                            : product.badge === "New"
                            ? "bg-green-500 text-white"
                            : product.badge === "Sale"
                            ? "bg-red-500 text-white"
                            : "bg-slate-900 text-white"
                        }`}>
                          {product.badge}
                        </span>
                      )}
                      <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                        <Heart size={18} />
                      </button>
                      <Link to={`/product/${safeId}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    </div>
                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(product.rating)}
                        <span className="text-xs text-slate-400 ml-1">({product.reviews})</span>
                      </div>
                      <Link to={`/product/${safeId}`}>
                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 mb-3 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-slate-400 line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-colors group-hover:bg-primary">
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {products?.map((product) => {
                  const safeId = product?._id || product?.id;
                  if (!safeId) return null;
                  return (
                  <div
                    key={safeId}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-primary/50 transition-all flex gap-6"
                  >
                    {/* Image */}
                    <div className="w-40 h-40 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex-shrink-0">
                      <Link to={`/product/${safeId}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </Link>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(product.rating)}
                        <span className="text-xs text-slate-400">({product.reviews} reviews)</span>
                      </div>
                      <Link to={`/product/${safeId}`}>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                        Experience unparalleled performance with the latest {product.name.split(' - ')[0]}. 
                        Designed for professionals and creators who demand the best.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            ${product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-slate-400 line-through">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors">
                          <ShoppingCart size={18} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    {/* Wishlist */}
                    <button className="p-3 h-fit bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors">
                  <ChevronLeft size={20} />
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-colors ${
                      page === 1
                        ? "bg-primary text-white"
                        : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                })}
                <span className="px-2 text-slate-400">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors">
                  12
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors">
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;

