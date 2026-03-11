import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Search as SearchIcon, 
  ArrowUpDown, 
  Star,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  X 
} from "lucide-react";
import { searchProducts } from "../api/productApi";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import { motion as Motion, AnimatePresence } from "framer-motion";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        // Using our high-performance backend search (ES with MongoDB fallback)
        const results = await searchProducts(query);
        setProducts(results);
        setError(null);
      } catch (err) {
        console.error("Search error:", err);
        setError("Our search matrix failed to calibrate. Please refine your query.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [query]);

  // Sort products locally
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    
    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (loading) return (
    <div className="min-h-screen pt-32 flex justify-center">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-12">
           <Link to="/" className="hover:text-primary transition-colors">Home</Link>
           <ChevronRight size={10} />
           <span className="text-primary">Intelligence Search</span>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-4">
               {query ? `Scan: ${query}` : "All Matrix"}<span className="text-primary">.</span>
            </h1>
            <p className="text-muted-foreground text-lg">
               Located <span className="text-foreground font-bold">{products.length}</span> units matching your identification string.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <select 
                className="appearance-none bg-secondary/50 border border-transparent rounded-2xl px-10 py-5 text-[10px] font-black uppercase tracking-widest cursor-pointer focus:bg-background focus:border-primary/20 transition-all outline-hidden pr-16"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ArrowUpDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors" size={14} />
            </div>

            <div className="hidden md:flex items-center border rounded-2xl p-1 bg-secondary/30">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-background shadow-md text-primary" : "text-muted-foreground"}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-background shadow-md text-primary" : "text-muted-foreground"}`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="py-32 flex justify-center">
            <Message variant="danger">{error}</Message>
          </div>
        ) : products.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-8"}>
            {sortedProducts.map((p) => (
              <Product key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-secondary/10 rounded-[60px] border border-dashed flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-8">
                <SearchIcon size={40} className="text-muted-foreground opacity-30" />
             </div>
             <h3 className="text-4xl font-black tracking-tighter uppercase mb-6">Zero Matches</h3>
             <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
               Your identification string <span className="text-foreground font-bold italic">"{query}"</span> returned no results in our current matrix. 
               Try broadening your search parameters.
             </p>
             <Link to="/products" className="mt-12 bg-foreground text-background px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                Explore All Collections
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
