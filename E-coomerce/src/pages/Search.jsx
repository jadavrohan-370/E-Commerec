import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Grid, List, ChevronLeft, ChevronRight, Heart, X, ArrowRight } from "lucide-react";

// Mock products data - in real app, this would come from Elasticsearch
const mockProducts = [
  {
    _id: "1",
    name: "Sony WH-1000XM5 Noise Cancelling",
    price: 349.00,
    originalPrice: 399.00,
    rating: 4.5,
    reviews: 1200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApJlqGPIA94WzvEB-2z57FKglXwPazZhfbn5s5Db4esvwgenuN9POMUJ3GJMNQr3iVwYk5VNoL4xyFJegQzJbOecNYRFvNZj48JgeHVVc62SuCFY-jqbvDiRx6Wxklq_F8KqUskrbEOGm1WJdARZi32K6pWPldsc73ndmhKzulcS5YG3hq3JBIQd-q6Yigjc3IyUm07Qn2un2Sd88vKnEBOQvFF7b3lygP2MZdOVUPIFKj4AoTk5B8io6aFu_C0Gt8azSzRdgntQ",
    badge: "BEST SELLER",
    category: "headphones"
  },
  {
    _id: "2",
    name: "Bose QuietComfort Ultra",
    price: 429.00,
    originalPrice: 479.00,
    rating: 5,
    reviews: 856,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO31MQkD1NVjB7S2TA-pkoS9bNFPVQbMt74C2obRpNtXwAPHZqraDyxafgtSM_e7MRsBsmQRKDGoxKY7lKvSaNH7cPspgWoIsUH44NmWJGYN54fiSiPMENldDdFmmwfUlTe3JG_0ReIRtcq8jbM9K8rSZjtn3gVEuaj_6Tdw8myBKzBtLbwFVxNA4aatDOORzits0cGnFQXvqWkssS515h4hEmzrKPRZ7JN2JJ-rBUJsECKkqz8aFDad1iGls5Ic0hyhXrkRx_vQ",
    badge: "NEW ARRIVAL",
    category: "headphones"
  },
  {
    _id: "3",
    name: "QuietBuds G2 Noise Isolation",
    price: 119.00,
    originalPrice: 149.00,
    rating: 4,
    reviews: 244,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAd0u78kN9rp55vcyTom4S-CsRySD6q6EKp91dMRZOMBlNcRgEzNJsow6ZWVhDsi0btZoUUWJ35gezp8qA39sziypmbU10zCIvTNOQdNJ_38RCik7fNfv2N7FA2r9S4V6OuwfgeHQlDiZsYzyPXcjEc9QVU0E4zb0J4HqEipG676LfWyebI74dqrEG7hj9hFxPXdjP1Hi770UwXPa2vIV_gH4FGIUpD4KUnj8g-ovVkojWbk5jQEQGltz2V3gGCv6V3i9S5BYRm8Q",
    badge: "LIMITED DEAL",
    discount: 20,
    category: "earbuds"
  },
  {
    _id: "4",
    name: "Streamer Pro Noise Filter Mic",
    price: 189.00,
    originalPrice: 229.00,
    rating: 4.5,
    reviews: 128,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUeVDeEkwddD1OqkROo5XSVUcyXnGFld76xD8iIC8S0yLYzLHty-QrXjub4y99esaQ0-lbKgwZBc1g2STuFvVdlMFDBSzMDxiAMBsBlD6cO5JSxNDaHUJQ4eQzwkTnqjX8triskP4srbLomLvaPFnzbUKOsi40SznSTKZ52WZpNoJAAdIeSrwC4f2FDSEhHP2X6XO2z394g6HXZgXWdJH0ZyZxz7CRxyZhTT6ABdhcOsHLP9Ftfbw5rSyEGOGbWMimlf3BfOIF7w",
    category: "microphones"
  },
  {
    _id: "5",
    name: "Sennheiser Accentum Noise",
    price: 199.00,
    originalPrice: 249.00,
    rating: 4,
    reviews: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmMLtZxlQFOxcSLdbeaqh9oWQVQfP2O6AwmT2nUB0gJ9IhPEL6UJH3WYJxn6RQ2Sxldip-GUNKwnoDXu3kEI9z_qyIQJb5gIa-PnvixEjaFi6IVvBPKH9V7eraUATGP6tuWkWvSxDiAJtKwiHmLZ9rZykjzHSUVQQ6kNIon-NDLaD7lYWiNtHltK9OMYKQdZRhqID_48-tXw8jA0_Kll2RHu-lIHSzVzxIFo286l4H3bkf1O75CtO7LoDpjCKEPG7-TSM0-8DUpA",
    category: "headphones"
  },
  {
    _id: "6",
    name: "Eco-Audio V3 Noise Reducer",
    price: 259.00,
    originalPrice: 299.00,
    rating: 4.5,
    reviews: 67,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWXaoxAySHIjG3AmzYh7VSAhbghpUhtRFfzMMIqJCemyUXj15y8OR_pLhYo8mAGMPmHtrMvcTvdRtuMuLL1La5OdsUGt7C-41DGmGRzknSF5TK6b9XXBhE0loYHGZmvzsIhOXFxQV4_Ml1uJKqrQ7h20VfFLuFLNkAv4uAwzdKGLGsuZ18DkPpxhtfhn77SGUQa6P-ReQv5C1_hMQkBKeeNg2PDN-A3UdhuvjiXN3IjT9V_hFZWkyn19wLCsuXPqjx0ZCWwOWiDw",
    category: "headphones"
  },
];

const popularSearches = ["MacBook M3", "OLED Monitors", "Mechanical Keyboards", "4K Webcams"];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [priceRange, setPriceRange] = useState(1000);
  const [filters, setFilters] = useState({
    headphones: true,
    microphones: true,
    earbuds: true,
    sony: false,
    bose: false,
    sennheiser: false,
  });

  // Filter products based on search query
  const filteredProducts = mockProducts.filter((product) => {
    const matchesQuery = !query || product.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return b.badge === "NEW ARRIVAL" ? 1 : -1;
      default:
        return b.reviews - a.reviews;
    }
  });

  const handleCompareToggle = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleClearCompare = () => {
    setSelectedProducts([]);
    setShowCompare(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-sm ${
          i < Math.floor(rating)
            ? "text-primary fill-current"
            : i < rating
            ? "text-primary"
            : "text-slate-300"
        }`}
      >
        star
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-white">Search Results</span>
        </div>
      </nav>

      {/* Results Header */}
      <div className="mx-auto mb-8 max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Results for "{query || "All Products"}"
            </h1>
            <p className="mt-1 text-slate-500">
              Showing 1-{sortedProducts.length} of {sortedProducts.length} products found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-8 w-8 items-center justify-center rounded ${
                  viewMode === "grid" ? "bg-primary text-white" : "text-slate-400 hover:text-primary"
                }`}
              >
                <Grid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-8 w-8 items-center justify-center rounded ${
                  viewMode === "list" ? "bg-primary text-white" : "text-slate-400 hover:text-primary"
                }`}
              >
                <List className="text-lg" />
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-primary focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="relevance">Sort by: Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 pb-16 md:px-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64">
          <div className="sticky top-24 space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.headphones}
                    onChange={(e) => setFilters({ ...filters, headphones: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Headphones (18)</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.earbuds}
                    onChange={(e) => setFilters({ ...filters, earbuds: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Earbuds (12)</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.microphones}
                    onChange={(e) => setFilters({ ...filters, microphones: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Microphones (4)</span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Price Range</h3>
              <div className="px-2">
                <input
                  type="range"
                  max="1000"
                  min="0"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-primary/20 accent-primary"
                />
                <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
                  <span>$0</span>
                  <span>${priceRange}+</span>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Brand</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.sony}
                    onChange={(e) => setFilters({ ...filters, sony: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Sony</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.bose}
                    onChange={(e) => setFilters({ ...filters, bose: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Bose</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.sennheiser}
                    onChange={(e) => setFilters({ ...filters, sennheiser: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Sennheiser</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className={`flex-1 ${viewMode === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}`}>
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              className={`group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div className={`relative overflow-hidden bg-slate-50 dark:bg-slate-700 ${viewMode === "list" ? "w-48 h-48" : "aspect-square"}`}>
                {/* Compare Checkbox */}
                <label className="absolute top-3 left-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white/80 px-2 py-1 backdrop-blur hover:border-primary dark:border-slate-700 dark:bg-slate-800/80">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleCompareToggle(product._id)}
                    className="size-3.5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700 dark:text-slate-200">
                    Compare
                  </span>
                </label>
                
                {/* Wishlist */}
                <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-sm backdrop-blur hover:bg-primary hover:text-white transition-colors dark:bg-slate-800/80">
                  <Heart className="text-lg" />
                </button>
                
                {/* Discount Badge */}
                {product.discount && (
                  <span className="absolute left-3 top-3 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                    -{product.discount}% OFF
                  </span>
                )}
                
                <img
                  alt={product.name}
                  src={product.image}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              
              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                {product.badge && (
                  <p className={`text-xs font-semibold ${product.badge === "BEST SELLER" ? "text-primary" : product.badge === "NEW ARRIVAL" ? "text-slate-400" : "text-red-500"}`}>
                    {product.badge}
                  </p>
                )}
                <h3 className="mt-1 line-clamp-2 text-base font-bold text-slate-900 dark:text-white">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="ml-1 text-xs text-slate-500">({product.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <button className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mx-auto flex justify-center pb-16">
        <nav className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-800">
            <ChevronLeft className="text-slate-400" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-white">
            1
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            2
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            3
          </button>
          <span className="px-2 text-slate-400">...</span>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            14
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-800">
            <ChevronRight className="text-slate-400" />
          </button>
        </nav>
      </div>

      {/* Comparison Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-60 flex items-center justify-between border-t border-primary/20 bg-white px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:bg-slate-900 md:px-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Compare ({selectedProducts.length}/4)
            </span>
            <div className="flex gap-2">
              {selectedProducts.map((id) => {
                const product = mockProducts.find((p) => p._id === id);
                return (
                  <div
                    key={id}
                    className="flex size-12 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <img
                      src={product?.image}
                      alt={product?.name}
                      className="size-10 object-contain"
                    />
                  </div>
                );
              })}
              {[...Array(4 - selectedProducts.length)].map((_, i) => (
                <div
                  key={i}
                  className="flex size-12 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800"
                >
                  <span className="material-symbols-outlined text-slate-300">add</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearCompare}
              className="px-6 py-2.5 text-sm font-bold uppercase text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowCompare(true)}
              className="rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-2.5 font-bold uppercase text-white shadow-lg shadow-primary/20 transition-all hover:shadow-glow"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompare && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm md:p-8">
          <div className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-background-light dark:bg-background-dark shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Comparison</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Comparing selected premium audio products
                </p>
              </div>
              <button
                onClick={() => setShowCompare(false)}
                className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="min-w-[800px] rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
                <table className="w-full table-fixed border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase text-primary dark:border-slate-700">
                      <th className="min-w-[180px] rounded-tl-xl bg-primary/5 p-6 align-bottom">
                        Specifications
                      </th>
                      {selectedProducts.map((id) => {
                        const product = mockProducts.find((p) => p._id === id);
                        return (
                          <th key={id} className="min-w-[250px] p-6">
                            <div className="flex flex-col gap-4">
                              <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                                <img
                                  src={product?.image}
                                  alt={product?.name}
                                  className="h-full object-contain"
                                />
                              </div>
                              <span className="text-lg text-slate-900 dark:text-white">
                                {product?.name}
                              </span>
                              <span className="text-xl font-bold text-primary">
                                ${product?.price.toFixed(2)}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                      {[...Array(4 - selectedProducts.length)].map((_, i) => (
                        <th key={i} className="min-w-[250px] p-6">
                          <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                            <span className="material-symbols-outlined text-4xl text-slate-300">
                              add
                            </span>
                            <span className="mt-2 text-sm text-slate-400">Add Product</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                      <td className="bg-primary/5 p-6 font-bold text-slate-700 dark:text-slate-300">
                        Noise Cancellation
                      </td>
                      {selectedProducts.map((id) => (
                        <td key={id} className="p-6 text-slate-900 dark:text-slate-100">
                          {id === "1" ? "Industry-leading NC" : id === "2" ? "Customizable Silent Mode" : id === "3" ? "Active Noise Cancellation" : "Adaptive Noise Control"}
                        </td>
                      ))}
                      {[...Array(4 - selectedProducts.length)].map((_, i) => (
                        <td key={i} className="p-6" />
                      ))}
                    </tr>
                    <tr>
                      <td className="bg-primary/5 p-6 font-bold text-slate-700 dark:text-slate-300">
                        Battery Life
                      </td>
                      {selectedProducts.map((id) => (
                        <td key={id} className="p-6 text-slate-900 dark:text-slate-100">
                          {id === "1" ? "Up to 30 hours" : id === "2" ? "Up to 24 hours" : id === "3" ? "Up to 8 hours" : "Up to 35 hours"}
                        </td>
                      ))}
                      {[...Array(4 - selectedProducts.length)].map((_, i) => (
                        <td key={i} className="p-6" />
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                      <td className="bg-primary/5 p-6 font-bold text-slate-700 dark:text-slate-300">
                        Bluetooth
                      </td>
                      {selectedProducts.map((id) => (
                        <td key={id} className="p-6 text-slate-900 dark:text-slate-100">
                          {id === "1" ? "Bluetooth 5.2" : id === "2" ? "Bluetooth 5.3" : "Bluetooth 5.0"}
                        </td>
                      ))}
                      {[...Array(4 - selectedProducts.length)].map((_, i) => (
                        <td key={i} className="p-6" />
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/80">
              <button
                onClick={() => setShowCompare(false)}
                className="rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-3 font-bold uppercase text-white transition-all hover:shadow-glow"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

