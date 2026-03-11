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
  const params = useParams();
  const category = params?.category || "laptops";

  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 5000],
    rating: 0,
    sortBy: "popular",
  });

  const { data, isLoading, error } = useGetProductsQuery({
    category,
    pageNumber: 1,
  });

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
    ? category.charAt(0).toUpperCase() +
      category.slice(1).replace(/-/g, " ")
    : "All Products";

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.floor(rating)
            ? "fill-primary text-primary"
            : "text-slate-300"
        }
        fill={i < Math.floor(rating) ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* HERO */}
      <div className="bg-gradient-to-r from-primary via-purple-600 to-secondary">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white">{pageTitle}</h1>
          <p className="text-white/80 mt-2">
            Discover the latest {pageTitle.toLowerCase()} with cutting-edge technology
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* LOADER */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>

        ) : error ? (

          <Message variant="danger">
            {error?.data?.message || error?.error}
          </Message>

        ) : (

          <div className="flex gap-8">

            {/* FILTER SIDEBAR */}
            <aside className="hidden lg:block w-64">
              <div className="bg-white dark:bg-slate-900 border p-6 rounded-xl">

                <div className="flex justify-between mb-4">
                  <h2 className="font-bold">Filters</h2>
                  <button
                    onClick={() =>
                      setFilters({
                        brands: [],
                        priceRange: [0, 5000],
                        rating: 0,
                        sortBy: "popular",
                      })
                    }
                    className="text-primary text-sm"
                  >
                    Clear
                  </button>
                </div>

                {/* BRAND */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Brand</h3>

                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 mb-1"
                    >
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>

                {/* PRICE */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Price</h3>

                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2 mb-1"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={
                          filters.priceRange[0] === range.min &&
                          filters.priceRange[1] === range.max
                        }
                        onChange={() =>
                          setFilters({
                            ...filters,
                            priceRange: [range.min, range.max],
                          })
                        }
                      />
                      {range.label}
                    </label>
                  ))}
                </div>

              </div>
            </aside>

            {/* PRODUCTS */}
            <div className="flex-1">

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

                {products.map((product) => {

                  const safeId = product?._id || product?.id;
                  if (!safeId) return null;

                  return (
                    <div
                      key={safeId}
                      className="bg-white dark:bg-slate-900 border rounded-xl p-4"
                    >
                      <Link to={`/product/${safeId}`}>
                        <img
                          src={product?.image}
                          alt={product?.name}
                          className="h-40 w-full object-contain"
                        />
                      </Link>

                      <div className="mt-3">

                        <div className="flex">
                          {renderStars(product?.rating || 0)}
                        </div>

                        <Link to={`/product/${safeId}`}>
                          <h3 className="font-semibold mt-2">
                            {product?.name}
                          </h3>
                        </Link>

                        <p className="font-bold mt-2">
                          ${product?.price?.toLocaleString?.() || 0}
                        </p>

                        <button className="mt-3 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg">
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>

                      </div>
                    </div>
                  );
                })}

              </div>

              {/* PAGINATION */}
              <div className="mt-10 flex justify-center gap-2">

                <button className="border p-2 rounded">
                  <ChevronLeft size={18} />
                </button>

                {[1,2,3,4].map((p)=>(
                  <button
                    key={p}
                    className="border px-3 py-2 rounded"
                  >
                    {p}
                  </button>
                ))}

                <button className="border p-2 rounded">
                  <ChevronRight size={18} />
                </button>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;